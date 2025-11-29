'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/hooks/user';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

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

const ClassCreate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState<Class>({
    name: '',
    email: '',
    status: '',
    capacity: 0,
    studentCount: 0,
    teacher_uuid: '',
  });

  const { index, update } = useUser();
  const { uuid } = useParams() as { uuid: string };

  const fetchData = async () => {
    const response = await index('staff');
    if (response.success) {
      setTeachers(response.data.user);
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

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      status: '',
      capacity: 0,
      studentCount: 0,
      teacher_uuid: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await update(uuid, formData);
    if (response.success) {
      toast.success('Class updated successfully');
      handleReset();
    } else {
      toast.error('Failed to update class');
    }
  };

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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <SelectValue placeholder='Select teacher' />
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

        {/* Summary Card */}
        {formData.name && formData.teacher_uuid && (
          <Card className='bg-muted/50'>
            <CardContent className='pt-4'>
              <div className='text-sm space-y-1'>
                <p>
                  <span className='font-medium'>Class:</span> {formData.name}
                </p>
                <p>
                  <span className='font-medium'>Teacher:</span>{' '}
                  {getTeacherName(formData.teacher_uuid)}
                </p>
                <p>
                  <span className='font-medium'>Capacity:</span>{' '}
                  {formData.capacity}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default ClassCreate;
