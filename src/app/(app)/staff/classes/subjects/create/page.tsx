'use client';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import IsLoading from '@/components/is-loading';

import { useClass } from '@/hooks/class';
import { useSubject } from '@/hooks/subject';

interface Class {
  uuid: string;
  name: string;
}

export default function CreateSubject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get('class');

  const { show } = useClass();
  const { create } = useSubject();

  const [name, setName] = useState('');
  const [classes, setClasses] = useState<Class>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    const resClass = await show(uuid as string);
    if (resClass.success) {
      setClasses({
        uuid: resClass.data.class.uuid,
        name: resClass.data.class.name,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!uuid) {
      router.back();
    }
    fetchData();
  }, [uuid, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await create(uuid as string, name);
      if (response.success) {
        toast.success('Subject created successfully');
        setName('');
        router.push(`/staff/classes/subjects?class=${uuid}`);
      } else {
        toast.error('Failed to create subject');
      }
    } catch (error: any) {
      toast(error.message || 'Something went wront');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='space-y-6 max-w-md mx-auto mt-10'
      >
        <Label className='text-lg font-semibold'>
          Create Subject for Class: {classes?.name}
        </Label>
        <div className='space-y-2'>
          <Label htmlFor='name'>Subject Name *</Label>
          <Input
            id='name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='flex justify-end'>
          <Button type='submit' disabled={!name || isLoading}>
            Save Subject
          </Button>
        </div>
      </form>
    </div>
  );
}
