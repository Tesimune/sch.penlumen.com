'use client';

import {useEffect, useState} from 'react';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';

import {toast} from 'sonner';
import {useUser} from '@/hooks/user';
import {useRouter} from "next/navigation";
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

export default function ClassCreate() {
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

    const {index, create} = useUser();
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await index('staff');
            if (response.success) {
                setTeachers(response.data.user);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await create(formData);
        if (response.success) {
            toast.success('Class created successfully');
            router.push('/staff/classes');
        } else {
            toast.error('Failed to create class');
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
}

