import React, {useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {MenuSquareIcon} from 'lucide-react';
import Link from 'next/link';
import {toast} from 'sonner';
import {useStudent} from '@/hooks/student';
import {useResult} from '@/hooks/result';
import {useRouter} from 'next/navigation';

interface User {
    uuid: string;
    name: string;
    email: string;
}

interface Parent {
    user: User;
}

interface Class {
    uuid: string;
    name: string;
}

interface Student {
    uuid: string;
    name: string;
    status: string;
    parent: Parent;
    class: Class;
    reg_number: string;
    avatar: string;
    class_uuid: string;
    parent_uuid: string;
}

export default function StudentsTable({fetchData, filteredStudents}: {
    fetchData: () => void;
    filteredStudents: Student[];
}) {
    const router = useRouter();
    const {create} = useResult();
    const {remove} = useStudent();

    const [loading, setLoading] = useState(false);

    const generateReport = async (student: Student) => {
        try {
            setLoading(true);
            const response = await create(student.uuid);
            if (response.success) {
                router.push(`/staff/reports/${response.data.result.uuid}`);
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (student: Student) => {
        if (confirm(`Are you sure you want to delete ${student.name}?`)) {
            try {
                const response = await remove(student.uuid);
                if (response.success) {
                    toast.success('Student deleted successfully');
                } else {
                    toast.error(response.message || 'Something went wrong');
                }
            } catch (error: any) {
                toast.error(error.message || 'Something went wrong');
            } finally {
                fetchData()
            }
        }
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='h-24 text-center'>
                                No students found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredStudents.map((student) => (
                            <TableRow key={student.uuid}>
                                <TableCell className='font-medium'>
                                    <div className='flex items-center gap-2'>
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage
                                                src={`/placeholder.svg?height=32&width=32&text=${student.name.charAt(
                                                    0
                                                )}`}
                                            />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {student.name}
                                    </div>
                                </TableCell>
                                <TableCell>{student.class?.name || 'Current'}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            student.status === 'active' ? 'default' : 'secondary'
                                        }
                                    >
                                        {student.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='sm'>
                                                <MenuSquareIcon/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem>
                                                <Link href={`/staff/students/${student.uuid}`}>
                                                    Show Student
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                disabled={loading}
                                                onClick={() => generateReport(student)}
                                            >
                                                Generate Report
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(student)}
                                                className='text-destructive'
                                            >
                                                Delete Student
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
