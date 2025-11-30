'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MenuSquareIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useResult } from '@/hooks/result';

interface Student {
  uuid: string;
  name: string;
  reg_number: string;
  avatar: string;
  class_name: string;
  branch: string;
}

interface Assessment {
  uuid: string;
  result_uuid: string;
  subject: string;
  assignment: number;
  assesment: number;
  examination: number;
  overall: number;
  grade: string;
}

interface Report {
  uuid: string;
  student_uuid: string;
  class_name: string;
  overall: number;
  remark: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  student: Student;
  assessments: Assessment[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ReportsPageProps {
  userRole: 'admin' | 'teacher' | 'staff';
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [reports, setReports] = useState<Report[]>([]);

  const { index } = useResult();
  const fetchedReports = async () => {
    const result = await index(statusFilter as string);
    setReports(result.data.results);
  };

  useEffect(() => {
    fetchedReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.student.reg_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.uuid.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-orange-600',
      },
      APPROVED: {
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'text-green-600',
      },
      REJECTED: {
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-600',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className='gap-1'>
        <Icon className='h-3 w-3' />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const handleDelete = async (report: Report) => {
    // Implement delete functionality here
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Student Reports</h1>
          <p className='text-muted-foreground'>
            Manage and review student academic reports
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className='shadow-none rounded-none'>
        <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          <div className='flex flex-col sm:flex-row w-full gap-4 mb-6'>
            <div className='relative w-full'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search classes...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-40'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PENDING'>PENDING</SelectItem>
                <SelectItem value='APPROVED'>APPROVED</SelectItem>
                <SelectItem value='REJECTED'>REJECTED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Reports Table */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className='text-center'>Overall Score</TableHead>
                  <TableHead className='text-center'>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='h-24 text-center'>
                      <div className='flex flex-col items-center gap-2'>
                        <FileText className='h-8 w-8 text-muted-foreground opacity-50' />
                        <p className='text-muted-foreground'>
                          {searchQuery
                            ? 'No reports found matching your filters.'
                            : 'No reports available.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.uuid}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-10 w-10'>
                            <AvatarImage
                              src={report.student.avatar || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {report.student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <Link href={`/staff/reports/${report.uuid}`}>
                            <div className='font-medium'>
                              {report.student.name}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {report.student.reg_number}
                            </div>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{report.class_name}</div>
                          <div className='text-sm text-muted-foreground'>
                            {report.student.branch}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge
                          className={
                            report.overall < 50 ? 'bg-red-500' : 'bg-green-500'
                          }
                        >
                          {report.overall}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        {getStatusBadge(report.status)}
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          {new Date(report.created_at).toLocaleDateString()}
                          <div className='text-xs text-muted-foreground'>
                            {new Date(report.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MenuSquareIcon className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link href={`/staff/reports/${report.uuid}`}>
                                Show Report
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(report)}
                              className='text-destructive'
                            >
                              Delete Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
