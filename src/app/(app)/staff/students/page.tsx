'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/user';
import { useClass } from '@/hooks/class';
import { useStudent } from '@/hooks/student';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

import { toast } from 'sonner';
import IsLoading from '@/components/is-loading';
import StudentsTable from '@/components/students-table';
import StudentDialog from '@/components/student-create';
import Link from 'next/link';

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

export default function StudentsPage() {
  const { index: userIndex } = useUser();
  const { index: classIndex } = useClass();
  const { index: studentIndex, create, update, remove } = useStudent();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [editUUID, setEditUUID] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    reg_number: '',
    class_uuid: '',
    parent_uuid: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resClass = await classIndex();
      const resStudent = await studentIndex();
      const resUser = await userIndex('parent');

      if (resUser && resClass.success && resStudent) {
        setParents(resUser.data.user);
        setClasses(resClass.data.classes);
        setStudents(resStudent.data.students);
      } else {
        toast(resClass.message || 'Something went wrong');
        toast(resUser.message || 'Something went wrong');
      }
    } catch (error: any) {
      console.log(error);
      toast(error.message || 'Something went wront');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
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
        fetchData();
        setFormData({
          name: '',
          avatar: '',
          reg_number: '',
          class_uuid: '',
          parent_uuid: '',
        });
      } else {
        toast.error(response.message || 'Something went wrong');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatar: '' });
  };

  const handleEdit = (student: Student) => {
    setEditUUID(student.uuid);
    setFormData({
      name: student.name,
      avatar: student.avatar,
      reg_number: student.reg_number,
      class_uuid: student.class_uuid,
      parent_uuid: student.parent_uuid,
    });

    // Small delay to prevent dialog conflicts
    setTimeout(() => {}, 10);
  };

  const handleDelete = async (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      setIsLoading(true);
      try {
        const response = await remove(student.uuid);
        if (response.success) {
          fetchData();
          toast.success('Student deleted successfully');
        } else {
          toast.error(response.message || 'Something went wrong');
        }
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      avatar: '',
      reg_number: '',
      class_uuid: '',
      parent_uuid: '',
    });
    setEditUUID(null);
  };

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Students</h1>
          <p className='text-muted-foreground'>
            Manage student records and information
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/staff/students/create'>
            <Button size='sm'>
              <Plus className='mr-1 h-4 w-4' /> Create Student
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='relative w-full'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search students...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <StudentsTable filteredStudents={filteredStudents} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
