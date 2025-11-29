'use client';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, MenuSquareIcon } from 'lucide-react';

interface Class {
  uuid: string;
  name: string;
  email: string;
  status: string;
  capacity: number;
  studentCount: number;
  teacher_uuid: string;
}

export default function ClassesTable({
  filteredClasses,
  searchQuery,
  getTeacherName,
  handleDelete,
}: {
  filteredClasses: Class[];
  searchQuery: string;
  getTeacherName: (teacherUuid: string) => string;
  handleDelete: (classItem: Class) => void;
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Class Teacher</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                {searchQuery
                  ? 'No classes found matching your search.'
                  : 'No classes found.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredClasses.map((classItem) => (
              <TableRow key={classItem.uuid}>
                <TableCell className='font-medium'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                    </div>
                    <div>
                      <div className='font-medium'>{classItem.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {classItem.studentCount}/{classItem.capacity} students
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='text-sm'>
                    {getTeacherName(classItem.teacher_uuid)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <div className='text-sm font-medium'>
                      {classItem.studentCount}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      / {classItem.capacity}
                    </div>
                    <div
                      className={`h-2 w-16 rounded-full bg-muted ${
                        classItem.studentCount / classItem.capacity > 0.9
                          ? 'bg-red-200'
                          : 'bg-green-200'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          classItem.studentCount / classItem.capacity > 0.9
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${
                            (classItem.studentCount / classItem.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      classItem.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {classItem.status}
                  </Badge>
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
                        <Link href={`/staff/classes/${classItem.uuid}`}>
                          Show Class
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(classItem)}
                        className='text-destructive'
                      >
                        Delete Class
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
  );
}
