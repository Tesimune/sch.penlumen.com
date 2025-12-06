'use client';

import {toast} from 'sonner';
import {useUser} from '@/hooks/user';
import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import LoadingPage from '../loading-page';

type UserData = {
    name: string;
    email: string;
    password: string;
    contact?: string;
    alt_contact?: string;
    position?: string;
    address?: string;
    role: string;
};

export default function UserUpdatePage({role}: { role: string }) {
    const {show, update} = useUser();
    const {uuid} = useParams() as { uuid: string };
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [positions, setPositions] = useState<string[]>([]);
    const [formData, setFormData] = useState<UserData>({
        name: '',
        email: '',
        password: '',
        contact: '',
        alt_contact: '',
        position: '',
        address: '',
        role,
    });

    useEffect(() => {
        if (role === 'staff') {
            setPositions(['ADMINISTRATIVE', 'ACADEMIC']);
        } else if (role === 'parent') {
            setPositions(['PARENT', 'GUARDIAN']);
        } else {
            setPositions(['STUDENT']);
        }
    }, [role]);


    const fetchUser = async () => {
        const response = await show(uuid);
        if (response.success && response.data) {
            const user = response.data.user;
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                contact: user.contact || '',
                alt_contact: user.alt_contact || '',
                position: user.position || '',
                address: user.address || '',
                role: user.role,
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const saveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await update(uuid, formData);
            if (response.success) {
                toast.success('User updated successfully');
                router.push(`/staff/${role}s`);
            } else {
                toast.error(response.message || 'Unable to update user');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='max-w-2xl mx-auto px-6'>
            <div className='mb-3'>
                <h1 className='text-xl font-semibold'>
                    Update {role.charAt(0).toUpperCase() + role.slice(1)}
                </h1>
                <p className='text-muted-foreground'>Modify the user details below</p>
            </div>

            <form onSubmit={saveUser} className='space-y-3'>
                <div className='w-full space-y-2'>
                    <Label>Full Name</Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className='w-full space-y-2'>
                    <Label>Email</Label>
                    <Input
                        type='email'
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({...formData, email: e.target.value})
                        }
                    />
                </div>

                <div className='w-full space-y-2'>
                    <Label>Password (leave empty to keep current)</Label>
                    <Input
                        type='password'
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({...formData, password: e.target.value})
                        }
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div className='w-full space-y-2'>
                        <Label>Contact</Label>
                        <Input
                            value={formData.contact || ''}
                            onChange={(e) =>
                                setFormData({...formData, contact: e.target.value})
                            }
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label>Alt Contact</Label>
                        <Input
                            value={formData.alt_contact || ''}
                            onChange={(e) =>
                                setFormData({...formData, alt_contact: e.target.value})
                            }
                        />
                    </div>
                </div>

                <div className='w-full space-y-2'>
                    <Label>Position</Label>
                    <Select
                        value={formData.position || ''}
                        onValueChange={(value) =>
                            setFormData({...formData, position: value})
                        }
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select position'/>
                        </SelectTrigger>
                        <SelectContent>
                            {positions.map((position) => (
                                <SelectItem key={position} value={position}>
                                    {position.charAt(0).toUpperCase() + position.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='w-full space-y-2'>
                    <Label>Address</Label>
                    <Input
                        value={formData.address || ''}
                        onChange={(e) =>
                            setFormData({...formData, address: e.target.value})
                        }
                    />
                </div>

                <div className='flex justify-end gap-3'>
                    <Button variant='outline' type='button' onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type='submit'>
                        {isLoading ? 'Saving...' : 'Update User'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
