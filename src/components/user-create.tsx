'use client';

import { toast } from 'sonner';
import { useUser } from '@/hooks/user';
import { useBranch } from '@/hooks/branch';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UserCreatePage({ role }: { role: string }) {
  const { create } = useUser();
  const { createAccess } = useBranch();
  const [positions, setPositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
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
      setPositions(['administrator', 'principal', 'vice principal', 'teacher']);
    } else if (role === 'parent') {
      setPositions(['parent', 'guardian']);
    } else {
      setPositions(['student']);
    }
  }, [role]);

  const addToBranch = async (uuid: string) => {
    try {
      const response = await createAccess(uuid);
      if (response.success) {
        toast.success('User added to branch');
        resetForm();
      } else {
        toast.error(response.message || 'Unable to add user to branch');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add user');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      contact: '',
      alt_contact: '',
      position: '',
      address: '',
      role,
    });
  };

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await create(formData);

      if (response.success) {
        toast.success('User created successfully');
        resetForm();
      } else {
        toast.error(response.message || 'User already exists', {
          action: {
            label: 'Add to branch',
            onClick: () => addToBranch(response.data.user_uuid),
          },
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto px-6'>
      <div className='mb-3'>
        <h1 className='text-xl font-semibold'>
          Create New {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        <p className='text-muted-foreground'>
          Fill the form below to register a new {role}.
        </p>
      </div>

      <form onSubmit={saveUser} className='space-y-3'>
        <div className='w-full space-y-2'>
          <Label>Full Name</Label>
          <Input
            placeholder='John Doe'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className='w-full space-y-2'>
          <Label>Email Address</Label>
          <Input
            type='email'
            placeholder='john@example.com'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className='w-full space-y-2'>
          <Label>Password</Label>
          <Input
            type='password'
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='w-full space-y-2'>
            <Label>Contact</Label>
            <Input
              value={formData.contact}
              placeholder='+234...'
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>

          <div className='w-full space-y-2'>
            <Label>Alt Contact</Label>
            <Input
              value={formData.alt_contact}
              placeholder='+234...'
              onChange={(e) =>
                setFormData({ ...formData, alt_contact: e.target.value })
              }
            />
          </div>
        </div>

        <div className='w-full space-y-2'>
          <Label>Position</Label>
          <Select
            value={formData.position || ''}
            onValueChange={(value) =>
              setFormData({ ...formData, position: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select position' />
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
            placeholder='User home address...'
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={resetForm}>
            Reset
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : `Create ${role}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
