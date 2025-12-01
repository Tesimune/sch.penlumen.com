'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pen, Plus, Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

import { toast } from 'sonner';
import IsLoading from '@/components/is-loading';
import SubjectsTable from '@/components/subjects-table';

import { useClass } from '@/hooks/class';
import { useSubject } from '@/hooks/subject';

interface Class {
  uuid: string;
  name: string;
}

interface Subject {
  uuid: string;
  name: string;
  class_uuid: string;
}

export default function StudentsPage() {
  const { show: classShow } = useClass();
  const { index: subjectIndex } = useSubject();

  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get('class');

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resClass = await classShow(uuid as string);
      const resSubject = await subjectIndex(uuid as string);

      if (resClass.success && resSubject.success) {
        setClasses([
          ...classes,
          {
            uuid: resClass.data.class.uuid,
            name: resClass.data.class.name,
          },
        ]);
        setSubjects(resSubject.data.subjects);
      } else {
        toast(resClass.message || 'Something went wrong');
        toast(resSubject.message || 'Something went wrong');
      }
    } catch (error: any) {
      toast(error.message || 'Something went wront');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!uuid) {
      router.back();
    }
    fetchData();
  }, [uuid, router]);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {classes[0]?.name}
          </h1>
          <p className='text-muted-foreground'>
            Manage subjects records and information
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center rounded-none'
          >
            <Pen className='mr-1 h-4 w-4' />
            Edit class
          </Button>
          <Link href={`/staff/classes/subjects/create?class=${uuid}`}>
            <Button size='sm' className='flex items-center rounded-none'>
              <Plus className='h-4 w-4' />
              <span>Add Subject</span>
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
          <CardHeader>
            <div className='relative w-full'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search subjects...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            <SubjectsTable
              fetchData={fetchData}
              filteredSubjects={filteredSubjects}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
