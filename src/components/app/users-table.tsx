'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
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
import { MenuSquareIcon, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/hooks/user';
import { toast } from 'sonner';
import Link from 'next/link';

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

interface Users {
  user: User;
}

export default function UsersTable({
  role,
  users,
  fetchData,
}: {
  role: string;
  users: Users[];
  fetchData: () => void;
}) {
  const { remove } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (filter) =>
      (filter.user?.name ? filter.user.name.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (filter.user?.email ? filter.user.email.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (filter.user?.contact || '').includes(searchQuery) ||
      (filter.user?.alt_contact
        ? filter.user.alt_contact.includes(searchQuery)
        : false) ||
      (filter.user?.address ? filter.user.address.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      )
  );

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await remove(uuid);
        if (response.success) {
          toast.success('User deleted successfully');
        } else {
          toast.error(response.message || 'Failed to delete user');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete user');
      } finally {
        fetchData();
      }
    }
  };

  const getBadgeVariant = (position: string) => {
    switch (position) {
      case 'ADMINISTRATIVE':
        return 'default';
      case 'ACADEMIC':
        return 'outline';
      case 'PARENT':
        return 'default';
      case 'GUARDIAN':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className='shadow-none rounded-none'>
          <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='relative w-full'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={`Search ${role}...`}
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      No staff found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((filter) => (
                    <TableRow key={filter.user.uuid}>
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-2'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32&text=${(
                                filter.user?.name ?? 'U'
                              ).charAt(0)}`}
                            />
                            <AvatarFallback>
                              {(filter.user?.name ?? 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {filter.user?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className='capitalize'
                          variant={getBadgeVariant(filter.user.position)}
                        >
                          {filter.user.position.length > 15
                            ? filter.user.position.slice(0, 15) + '...'
                            : filter.user.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span>
                            {filter.user.contact.length > 15
                              ? filter.user.contact.slice(0, 15) + '...'
                              : filter.user.contact}
                          </span>
                          {filter.user.alt_contact && (
                            <span className='text-xs text-muted-foreground'>
                              {filter.user.alt_contact.length > 15
                                ? filter.user.alt_contact.slice(0, 15) + '...'
                                : filter.user.alt_contact}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {filter.user.email.length > 15
                          ? filter.user.email.slice(0, 15) + '...'
                          : filter.user.email}
                      </TableCell>
                      <TableCell>
                        {filter.user.address.length > 15
                          ? filter.user.address.slice(0, 15) + '...'
                          : filter.user.address}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MenuSquareIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link
                                href={`/staff/${role}/${filter.user.uuid}`}
                                className='w-full'
                              >
                                Show{' '}
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(filter.user.uuid)}
                              className='text-destructive'
                            >
                              Delete{' '}
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
