'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';

import {toast} from 'sonner';
import {useUser} from '@/hooks/user';
import {useClass} from "@/hooks/class";
import {Button} from "@/components/ui/button";
import LoadingPage from "@/components/loading-page";

interface Class {
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

const ClassUpdate = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [formData, setFormData] = useState<Class>({
        name: '',
        email: '',
        status: '',
        capacity: 0,
        studentCount: 0,
        teacher_uuid: '',
    });

    const {index} = useUser();
    const {show, update} = useClass()
    const {uuid} = useParams() as { uuid: string };
    const router = useRouter();

    const fetchData = async () => {
        try {
            const resUser = await index('staff');
            const resClass = await show(uuid as string);
            if (resUser.success && resClass.success) {
                setTeachers(resUser.data.user);
                setFormData({
                    name: resClass.data.class.name,
                    email: resClass.data.class.email,
                    status: resClass.data.class.status,
                    capacity: resClass.data.class.capacity,
                    studentCount: resClass.data.class.studentCount,
                    teacher_uuid: resClass.data.class.teacher_uuid,
                })
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

    const getTeacherName = (teacherUuid: string) => {
        const teacher = teachers.find(
            (teacher) => teacher.user.uuid === teacherUuid
        );
        return teacher ? teacher.user.name : 'Unknown Teacher';
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await update(uuid, formData);
        if (response.success) {
            toast.success('Class updated successfully');
            router.push('/staff/classes');
        } else {
            toast.error('Failed to update class');
        }
    };

    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }

    return (
        <div className='max-w-2xl mx-auto px-6'>
            <form onSubmit={handleSubmit} className='space-y-4 py-4'>
                {/* Class Name */}
                <div className='space-y-2'>
                    <Label htmlFor='name'>Class Name *</Label>
                    <Input
                        id='name'
                        placeholder='e.g., Grade 1A, Mathematics 101'
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    <p className='text-xs text-muted-foreground'>
                        Enter a descriptive name for the class
                    </p>
                </div>

                {/* Teacher Selection */}
                <div className='space-y-2'>
                    <Label htmlFor='teacher'>Class Teacher *</Label>
                    <Select
                        value={formData.teacher_uuid}
                        onValueChange={(value) => {
                            setFormData({
                                ...formData,
                                teacher_uuid: value,
                            });
                        }}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select teacher'/>
                        </SelectTrigger>
                        <SelectContent>
                            {teachers.map((teacher) => (
                                <SelectItem key={teacher.user.uuid} value={teacher.user.uuid}>
                                    {teacher.user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='capacity'>Max Capacity *</Label>
                    <Input
                        id='capacity'
                        type='number'
                        placeholder='30'
                        value={formData.capacity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                capacity: Number(e.target.value),
                            })
                        }
                        required
                    />
                </div>

                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        disabled={
                            !formData.name ||
                            !formData.teacher_uuid ||
                            formData.capacity <= 0 ||
                            isLoading
                        }
                    >
                        Save Class
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ClassUpdate;
