'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

import {useStudent} from "@/hooks/student";
import {useClass} from '@/hooks/class';
import {useUser} from '@/hooks/user';
import {toast} from "sonner";
import LoadingPage from "@/components/loading-page";

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

export default function StudentCreate() {
    const {index: classIndex} = useClass();
    const {index: userIndex} = useUser();
    const {create} = useStudent();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [classes, setClasses] = useState<Class[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        reg_number: '',
        class_uuid: '',
        parent_uuid: '',
    });

    const fetchData = async () => {
        try {
            const classesData = await classIndex();
            const parentsData = await userIndex('parent');
            if (classesData.success) {
                setClasses(classesData.data.classes);
            }
            if (parentsData.success) {
                setParents(parentsData.data.user);
            }

        } catch (error: any) {
            toast.error(error.message || 'Failed to create student');
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await create(formData);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
            router.push('/staff/students');

        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({...formData, avatar: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setFormData({...formData, avatar: ''});
    };

    if (isLoading) {
        return <LoadingPage/>
    }

    return (
        <div className='max-w-2xl mx-auto px-6'>
            <form onSubmit={handleSubmit} className='space-y-4 py-4'>
                {/* Avatar Upload Section */}
                {/* <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={formData.avatar || '/placeholder.svg'} />
                  <AvatarFallback className='text-lg'>
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : '?'}
                  </AvatarFallback>
                </Avatar>
                {formData.avatar && (
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                    onClick={removeAvatar}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                <Label htmlFor='avatar' className='cursor-pointer'>
                  <div className='flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground'>
                    <Upload className='h-4 w-4' />
                    <span>Upload Photo</span>
                  </div>
                </Label>
                <Input
                  id='avatar'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleAvatarChange}
                />
              </div>
            </div> */}

                {/* Student Name */}
                <div className='space-y-2'>
                    <Label htmlFor='name'>Student Name *</Label>
                    <Input
                        id='name'
                        placeholder="Enter student's full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>

                {/* Registration Number */}
                <div className='space-y-2'>
                    <Label htmlFor='reg-number'>Registration Number *</Label>
                    <Input
                        id='reg-number'
                        placeholder='Enter registration number'
                        value={formData.reg_number}
                        onChange={(e) =>
                            setFormData({...formData, reg_number: e.target.value})
                        }
                        required
                    />
                </div>

                {/* Parent Selection */}
                <div className='space-y-2'>
                    <Label htmlFor='parent'>Parent/Guardian *</Label>
                    <Select
                        value={formData.parent_uuid}
                        onValueChange={(value) => {
                            setFormData({
                                ...formData,
                                parent_uuid: value,
                            });
                        }}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select parent/guardian'/>
                        </SelectTrigger>
                        <SelectContent>
                            {parents.map((parent) => (
                                <SelectItem key={parent.user.uuid} value={parent.user.uuid}>
                                    <div className='flex flex-col'>
                                        <span>{parent.user.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Class Selection */}
                <div className='space-y-2'>
                    <Label htmlFor='class'>Class *</Label>
                    <Select
                        value={formData.class_uuid}
                        onValueChange={(value) => {
                            setFormData({
                                ...formData,
                                class_uuid: value,
                            });
                        }}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select class'/>
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((cls) => (
                                <SelectItem key={cls.uuid} value={cls.uuid}>
                                    {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        disabled={
                            !formData.name ||
                            !formData.reg_number ||
                            !formData.parent_uuid ||
                            !formData.class_uuid
                        }
                    >
                        Save Student
                    </Button>
                </div>
            </form>
        </div>
    );
}
