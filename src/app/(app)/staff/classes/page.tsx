'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useClass } from '@/hooks/class';
import { useUser } from '@/hooks/user';
import { Download, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import IsLoading from '@/components/is-loading';
import ClassesTable from '@/components/classes-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  const { index: userIndex } = useUser();
  const { index: classIndex, create, update, remove } = useClass();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editUUID, setEditUUID] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
    teacher_uuid: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resClass = await classIndex();
      const resUser = await userIndex('staff');
      if (resClass.success && resUser) {
        setClasses(resClass.data.classes);
        setTeachers(resUser.data.user);
      } else {
        toast.error(resClass.message || 'Something went wrong');
        toast.error(resUser.message || 'Something went wrong');
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

  const handleEdit = (classItem: Class) => {
    setIsAddDialogOpen(false);

    // Set edit data
    setEditUUID(classItem.uuid);
    setFormData({
      name: classItem.name,
      capacity: classItem.capacity,
      teacher_uuid: classItem.teacher_uuid,
    });

    // Small delay to prevent dialog conflicts
    setTimeout(() => {
      setIsAddDialogOpen(true);
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (editUUID) {
        response = await update(editUUID, formData);
      } else {
        response = await create(formData);
      }
      if (response.success) {
        toast.success(
          editUUID ? 'Class updated successfully' : 'Class created successfully'
        );
        fetchData();
        handleReset();
      } else {
        toast.error(response.message || 'Something went wrong');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsAddDialogOpen(false);
      setIsLoading(false);
    }
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

  const handleReset = () => {
    setEditUUID(null);
    setFormData({
      name: '',
      capacity: 0,
      teacher_uuid: '',
    });
  };

  if (isLoading) {
    return <IsLoading />;
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
              <Plus className='h-4 w-4' />
              <span>Add Class</span>
            </Button>
          </Link>
        </div>
      </div>

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
                placeholder='Search classes...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ClassesTable
              filteredClasses={filteredClasses}
              getTeacherName={getTeacherName}
              handleDelete={handleDelete}
              searchQuery={searchQuery}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
