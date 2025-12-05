import React from 'react';
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
import {useSubject} from '@/hooks/subject';
import {toast} from 'sonner';
import Link from "next/link";

interface Subject {
    uuid: string;
    name: string;
    class_uuid: string;
}

export default function SubjectsTable({fetchData, filteredSubjects}: {
    fetchData: () => void,
    filteredSubjects: Subject[]
}) {
    const {remove} = useSubject();

    const handleDelete = async (subject: Subject) => {
        if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
            try {
                const response = await remove(subject.uuid);
                if (response.success) {
                    toast.success('Subject deleted successfully');
                } else {
                    toast.error(response.message || 'Something went wrong');
                }
            } catch (error: any) {
                toast.error(error.message || 'Something went wrong');
            } finally {
                fetchData();
            }
        }
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSubjects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='h-24 text-center'>
                                No subjects found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredSubjects.map((subject) => (
                            <TableRow key={subject.uuid}>
                                <TableCell>{subject.name || 'Unknown'}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='sm'>
                                                <MenuSquareIcon/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/staff/subjects/${subject.uuid}?class=${subject.class_uuid}`}>
                                                    Show Subject
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(subject)}
                                                className='text-destructive'
                                            >
                                                Delete Subject
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
