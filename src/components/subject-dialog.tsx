'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from './ui/card';
import { Plus } from 'lucide-react';

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

const SubjectDialog = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  teachers,
  getTeacherName,
  editUUID,
  formData,
  setFormData,
  handleSubmit,
  handleReset,
}: {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  teachers: Teacher[];
  getTeacherName: (teacherUuid: string) => string;
  editUUID: string | null;
  formData: { name: string; capacity: number; teacher_uuid: string };
  setFormData: (data: {
    name: string;
    capacity: number;
    teacher_uuid: string;
  }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleReset: () => void;
}) => {
  return (
    <div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger onClick={handleReset} asChild>
          <Button size='sm'>
            <Plus className='mr-1 h-4 w-4' />
            Add Class
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-md max-h-[95vh] overflow-y-auto scroll-hidden'>
          <DialogHeader>
            <DialogTitle>
              {editUUID ? 'Edit Class' : 'Add New Class'}
            </DialogTitle>
            <DialogDescription>
              {editUUID
                ? 'Update the class details below.'
                : 'Fill in the details to create a new class.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4 py-4'>
            {/* Class Name */}
            <div className='space-y-2'>
              <Label htmlFor='name'>Class Name *</Label>
              <Input
                id='name'
                placeholder='e.g., Grade 1A, Mathematics 101'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                    <SelectItem
                      key={teacher.user.uuid}
                      value={teacher.user.uuid}
                    >
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
                      <span className='font-medium'>Class:</span>{' '}
                      {formData.name}
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

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={!formData.name}>
                {editUUID ? 'Update Class' : 'Save Class'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectDialog;
