'use client';

import Cookies from 'js-cookie';
import {motion} from 'framer-motion';
import {useBranch} from '@/hooks/branch';
import React, {useEffect, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog';
import {Check, ChevronRight, Edit, LogOut, Plus, Search, Trash,} from 'lucide-react';
import LoadingPage from '@/components/loading-page';
import {toast} from 'sonner';
import Link from "next/link";

interface BranchAccess {
    uuid: string;
    name: string;
    email: string;
    contact: string;
    avatar: string;
    address: string;
    students: number;
}

interface Branch {
    branch: BranchAccess;
}

export default function BranchSelectionPage() {
    const {index, create, update, remove} = useBranch();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSaving, setIsSavingisSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        address: '',
    });

    const fetchData = async () => {
        const userString = Cookies.get('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user) {
            window.location.href = '/login';
            return;
        }

        const response = await index();
        if (!response.success) {
            toast.error(response.message || 'Something went wrong');
        } else {
            setBranches(response.data.branch_access);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredBranches = branches.filter((access) =>
        access.branch.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const item = {
        hidden: {opacity: 0, y: 20},
        show: {opacity: 1, y: 0},
    };

    const handleContinue = () => {
        if (selectedBranch === null) return;
        const userString = Cookies.get('user');
        const user = userString ? JSON.parse(userString) : null;
        Cookies.set('branch', selectedBranch.toString(), {expires: 7});
        toast.success('Branch selected successfully');

        if (user?.role === 'PARENT') {
            window.location.href = '/parent/wards';
        } else {
            window.location.href = '/staff/wards';
        }
    };

    const saveBranch = async () => {
        try {
            setIsSavingisSaving(true);
            let response;
            if (selectedBranch) {
                response = await update(selectedBranch, formData);
            } else {
                response = await create(formData);
            }
            if (response.success) {
                setFormData({
                    name: '',
                    email: '',
                    contact: '',
                    address: '',
                });
                fetchData();
                setShowCreateModal(false);
            } else {
                toast(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast(error.message || 'Something went wrong');
        } finally {
            setIsSavingisSaving(false);
        }
    };

    const handleEdit = (access: Branch) => {
        setFormData({
            name: access.branch.name,
            email: access.branch.email,
            contact: access.branch.contact,
            address: access.branch.address,
        });
        setShowCreateModal(true);
    };

    const handleDelete = async (access: Branch) => {
        if (
            !window.confirm(
                `Are you sure you want to delete the branch "${access.branch.name}"? This action cannot be undone.`
            )
        ) {
            return;
        }
        try {
            setIsLoading(true);
            const response = await remove(access.branch.uuid);
            if (response.success) {
                toast.success('Branch deleted successfully');
                fetchData();
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            contact: '',
            address: '',
        });
        setSelectedBranch(null);
        setShowCreateModal(true);
    };

    const handleLogout = () => {
        Cookies.remove('user');
        Cookies.remove('branch');
        window.location.href = '/login';
    };

    const APP_SLUG = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'School';
    const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-muted p-4'>
            {/* Create branch */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedBranch ? 'Edit Branch' : 'Create New Branch'}
                        </DialogTitle>
                        <p className='text-muted-foreground text-sm'>
                            {selectedBranch
                                ? 'Update the details for this branch.'
                                : 'Enter the details for your new branch.'}
                        </p>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <Input
                            placeholder='Branch name *'
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({...formData, name: e.target.value})
                            }
                        />
                        <Input
                            placeholder='Contact'
                            value={formData.contact}
                            onChange={(e) =>
                                setFormData({...formData, contact: e.target.value})
                            }
                        />

                        <Input
                            placeholder='Address'
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({...formData, address: e.target.value})
                            }
                        />
                    </div>
                    <DialogFooter className='flex justify-end gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setShowCreateModal(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => saveBranch()} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Branch'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 🔐 Logout Modal */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <p className='text-muted-foreground text-sm'>
                            Are you sure you want to logout? You’ll need to log in again to
                            continue.
                        </p>
                    </DialogHeader>
                    <DialogFooter className='mt-4 flex justify-end gap-2'>
                        <Button variant='outline' onClick={() => setShowLogoutModal(false)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* <AnimatePresence> */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className='w-full max-w-3xl'
            >
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            {/* Logo and Brand */}
                            <Link href="/" className="flex justify-center items-center gap-3">
                                <div className="w-12 h-12 relative">
                                    <img
                                        src={APP_LOGO}
                                        alt={`${APP_SLUG} Logo`}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="hidden md:inline text-lg font-bold text-primary">{APP_SLUG}</span>
                            </Link>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => handleReset()}
                                    title='Create Branch'
                                >
                                    <Plus className='h-4 w-4'/>
                                </Button>
                                {selectedBranch && (
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        onClick={() =>
                                            handleEdit(
                                                branches.find((b) => b.branch.uuid === selectedBranch)!
                                            )
                                        }
                                        title='Edit Branch'
                                    >
                                        <Edit className='h-4 w-4'/>
                                    </Button>
                                )}
                                {selectedBranch && (
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        onClick={() =>
                                            handleDelete(
                                                branches.find((b) => b.branch.uuid === selectedBranch)!
                                            )
                                        }
                                        title='Delete Branch'
                                    >
                                        <Trash className='h-4 w-4'/>
                                    </Button>
                                )}

                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => setShowLogoutModal(true)}
                                    title='Logout'
                                >
                                    <LogOut className='h-4 w-4'/>
                                </Button>
                            </div>
                        </div>
                        <CardTitle className='text-2xl font-bold text-center mt-4'>
                            Select a Branch
                        </CardTitle>
                        <CardDescription className='text-center'>
                            Choose which school branch you want to access
                        </CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                        <div className='relative'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
                            <Input
                                placeholder='Search branches...'
                                className='pl-8'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            {filteredBranches.length === 0 ? (
                                <div className='text-center py-8 text-muted-foreground'>
                                    No branches found matching your search.
                                </div>
                            ) : (
                                filteredBranches.map((access) => (
                                    <motion.div key={access.branch.uuid} variants={item}>
                                        <div
                                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                                                selectedBranch === access.branch.uuid
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:border-primary/50 hover:bg-muted'
                                            }`}
                                            onClick={() => setSelectedBranch(access.branch.uuid)}
                                        >
                                            <div className='flex items-center gap-4'>
                                                <Avatar className='h-12 w-12'>
                                                    <AvatarImage
                                                        src={access.branch.avatar || '/placeholder.svg'}
                                                        alt={access.branch.name}
                                                    />
                                                    <AvatarFallback>
                                                        {access.branch.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className='font-medium'>{access.branch.name}</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {access.branch.address}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                {selectedBranch === access.branch.uuid ? (
                                                    <Check className='h-5 w-5 text-primary'/>
                                                ) : (
                                                    <ChevronRight className='h-5 w-5 text-muted-foreground'/>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className='w-full'
                            disabled={selectedBranch === null || isLoading}
                            onClick={handleContinue}
                        >
                            {isLoading ? 'Loading...' : 'Continue'}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
