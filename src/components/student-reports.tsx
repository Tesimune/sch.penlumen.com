'use client';

import { useState } from 'react';
import {
  Search,
  Clock,
  XCircle,
  Download,
  FileText,
  CheckCircle,
  MenuSquareIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

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
  id: number;
  uuid: string;
  student_uuid: string;
  class_name: string;
  overall: number;
  remark: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  student: Student;
  assessments: Assessment[];
}

interface ReportsPageProps {
  userRole: 'admin' | 'teacher' | 'staff';
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  // Sample data based on your schema
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      uuid: 'report-001',
      student_uuid: 'student-001',
      class_name: 'JSS 2A',
      overall: 300,
      remark: 'Excellent performance across all subjects',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-16T14:30:00Z',
      status: 'approved',
      approved_by: 'Mrs. Johnson',
      approved_at: '2024-01-16T14:30:00Z',
      student: {
        uuid: 'student-001',
        name: 'Alice Johnson',
        reg_number: 'STU001',
        avatar: '/placeholder.svg?height=40&width=40',
        class_name: 'JSS 2A',
        branch: 'Main Campus',
      },
      assessments: [
        {
          uuid: 'assess-001',
          result_uuid: 'report-001',
          subject: 'Mathematics',
          assignment: 4,
          assesment: 12,
          examination: 52,
          overall: 68,
          grade: 'A',
        },
        {
          uuid: 'assess-002',
          result_uuid: 'report-001',
          subject: 'English Language',
          assignment: 5,
          assesment: 14,
          examination: 55,
          overall: 74,
          grade: 'A',
        },
      ],
    },
    {
      id: 2,
      uuid: 'report-002',
      student_uuid: 'student-002',
      class_name: 'JSS 1B',
      overall: 300,
      remark: 'Good progress with room for improvement in Mathematics',
      created_at: '2024-01-14T09:00:00Z',
      updated_at: '2024-01-14T09:00:00Z',
      status: 'pending',
      student: {
        uuid: 'student-002',
        name: 'Bob Smith',
        reg_number: 'STU002',
        avatar: '/placeholder.svg?height=40&width=40',
        class_name: 'JSS 1B',
        branch: 'North Branch',
      },
      assessments: [
        {
          uuid: 'assess-003',
          result_uuid: 'report-002',
          subject: 'Mathematics',
          assignment: 3,
          assesment: 10,
          examination: 45,
          overall: 58,
          grade: 'C',
        },
        {
          uuid: 'assess-004',
          result_uuid: 'report-002',
          subject: 'English Language',
          assignment: 4,
          assesment: 13,
          examination: 50,
          overall: 67,
          grade: 'B',
        },
      ],
    },
    {
      id: 3,
      uuid: 'report-003',
      student_uuid: 'student-003',
      class_name: 'JSS 3A',
      overall: 300,
      remark: 'Needs significant improvement in core subjects',
      created_at: '2024-01-13T11:30:00Z',
      updated_at: '2024-01-15T16:45:00Z',
      status: 'rejected',
      approved_by: 'Mr. Wilson',
      approved_at: '2024-01-15T16:45:00Z',
      student: {
        uuid: 'student-003',
        name: 'Charlie Brown',
        reg_number: 'STU003',
        avatar: '/placeholder.svg?height=40&width=40',
        class_name: 'JSS 3A',
        branch: 'South Branch',
      },
      assessments: [
        {
          uuid: 'assess-005',
          result_uuid: 'report-003',
          subject: 'Mathematics',
          assignment: 2,
          assesment: 8,
          examination: 35,
          overall: 45,
          grade: 'D',
        },
      ],
    },
    {
      id: 4,
      uuid: 'report-004',
      student_uuid: 'student-004',
      class_name: 'JSS 2B',
      overall: 300,
      remark: 'Consistent performance with strong analytical skills',
      created_at: '2024-01-12T08:15:00Z',
      updated_at: '2024-01-12T08:15:00Z',
      status: 'pending',
      student: {
        uuid: 'student-004',
        name: 'Diana Prince',
        reg_number: 'STU004',
        avatar: '/placeholder.svg?height=40&width=40',
        class_name: 'JSS 2B',
        branch: 'Main Campus',
      },
      assessments: [
        {
          uuid: 'assess-006',
          result_uuid: 'report-004',
          subject: 'Physics',
          assignment: 5,
          assesment: 13,
          examination: 58,
          overall: 76,
          grade: 'A',
        },
      ],
    },
    {
      id: 5,
      uuid: 'report-005',
      student_uuid: 'student-005',
      class_name: 'JSS 1A',
      overall: 300,
      remark: 'Steady improvement throughout the term',
      created_at: '2024-01-11T14:20:00Z',
      updated_at: '2024-01-13T10:15:00Z',
      status: 'approved',
      approved_by: 'Mrs. Davis',
      approved_at: '2024-01-13T10:15:00Z',
      student: {
        uuid: 'student-005',
        name: 'Edward Cullen',
        reg_number: 'STU005',
        avatar: '/placeholder.svg?height=40&width=40',
        class_name: 'JSS 1A',
        branch: 'North Branch',
      },
      assessments: [
        {
          uuid: 'assess-007',
          result_uuid: 'report-005',
          subject: 'Biology',
          assignment: 4,
          assesment: 11,
          examination: 48,
          overall: 63,
          grade: 'B',
        },
      ],
    },
  ]);

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.student.reg_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.uuid.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || report.status === statusFilter;
    const matchesClass =
      classFilter === 'all' || report.class_name === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

  // Get unique values for filters
  const uniqueClasses = [...new Set(reports.map((r) => r.class_name))].sort();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-orange-600',
      },
      approved: {
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'text-green-600',
      },
      rejected: {
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

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Student Reports</h1>
          <p className='text-muted-foreground'>
            Manage and review student academic reports
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='gap-2'>
            <Download className='h-4 w-4' />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent>
          {/* Reports Table */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
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
                          {searchQuery ||
                          statusFilter !== 'all' ||
                          classFilter !== 'all' ||
                          gradeFilter !== 'all'
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
                              <Link
                                href={`/staff/reports/${report.student.uuid}`}
                              >
                                Show Report
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link
                                href={`/report/${report.student.uuid}`}
                                target='_blank'
                              >
                                Generate Report
                              </Link>
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
