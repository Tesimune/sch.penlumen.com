'use client';

import {useEffect, useState} from 'react';

import Link from 'next/link';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import {useUser} from '@/hooks/user';
import {useClass} from '@/hooks/class';
import {Plus, Search} from 'lucide-react';

import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';
import ClassesTable from '@/components/app/classes-table';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

interface Class {
    uuid: string;
    name: string;
    email: string;
    status: string;
    capacity: number;
    studentCount: number;
    teacher_uuid: string;
}

interface User {
    uuid: string;
    name: string;
}

interface Teacher {
    user: User;
}

export default function ClassesPage() {
    const {index: userIndex} = useUser();
    const {index: classIndex, create, update, remove} = useClass();

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const resUser = await userIndex('staff');
            const resClass = await classIndex();
            if (resUser.success && resClass.success) {
                setTeachers(resUser.data.user);
                setClasses(resClass.data.classes);
            } else {
                toast.error(resUser.message || 'Something went wrong');
                toast.error(resClass.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredClasses = classes.filter(
        (classItem) =>
            classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teachers
                .find((t) => t.user.uuid === classItem.teacher_uuid)
                ?.user?.name.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const getTeacherName = (teacher_uuid: string) => {
        const teacher = teachers.find(
            (teacher) => teacher.user.uuid === teacher_uuid
        );
        return teacher ? teacher.user.name : '';
    };

    const handleDelete = async (classItem: Class) => {
        if (window.confirm(`Are you sure you want to delete ${classItem.name}?`)) {
            setIsLoading(true);
            try {
                const response = await remove(classItem.uuid);
                if (response.success) {
                    toast.success('Class deleted successfully');
                    fetchData();
                } else {
                    toast.error(response.message || 'Failed to delete class');
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete class');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Classes</h1>
                    <p className='text-muted-foreground'>
                        Manage class schedules and assignments
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Link href='/staff/classes/create'>
                        <Button size='sm' className='flex items-center rounded-none'>
                            <Plus className='h-4 w-4'/>
                            <span>Add Class</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Card className='shadow-none rounded-none'>
                    <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                        <div className='relative w-full'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search classes...'
                                className='pl-8'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ClassesTable
                            searchQuery={searchQuery}
                            filteredClasses={filteredClasses}
                            getTeacherName={getTeacherName}
                            handleDelete={handleDelete}
                        />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
