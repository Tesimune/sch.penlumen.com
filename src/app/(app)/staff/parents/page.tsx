'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

import {toast} from 'sonner';
import {Plus} from 'lucide-react';
import {useUser} from '@/hooks/user';
import {Button} from '@/components/ui/button';

import LoadingPage from '@/components/loading-page';
import UsersIndex from '@/components/app/users-table';

interface User {
    uuid: string;
    name: string;
    email: string;
    avatar: string;
    address: string;
    contact: string;
    alt_contact: string;
    position: string;
}

interface Parent {
    user: User;
}

export default function ParentPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [parents, setParents] = useState<Parent[] | []>([]);

    const {index} = useUser();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await index('parent');
            if (response.success) {
                setParents(response.data.user);
            } else {
                toast(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='space-y-6'>
            <div
                className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e7eb] pb-6'>
                <div>
                    <h1 className='text-3xl font-bold text-[#000000] tracking-tight'>
                        Parents
                    </h1>
                    <p className='text-[#6b7280] text-sm mt-1'>
                        Manage school parent information and accounts
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Link href='/staff/parents/create'>
                        <Button size='sm' className='flex items-center rounded-none'>
                            <Plus className='h-4 w-4'/>
                            <span>Add Parent</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='bg-white border border-[#e5e7eb]'>
                <UsersIndex role='parents' users={parents} fetchData={fetchData}/>
            </div>
        </div>
    );
}
