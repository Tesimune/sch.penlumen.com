'use client';

import Link from 'next/link';
import { School } from 'lucide-react';

export default function LandingPage() {
  const APP_NAME = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'School';

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-md rounded-lg border bg-card p-8 shadow-sm flex flex-col items-center gap-6'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <School className='h-8 w-8' />
          <h1 className='text-2xl font-bold'>{APP_NAME}</h1>
        </div>

        <p className='text-center text-muted-foreground'>
          Choose a login option to continue
        </p>

        <div className='flex w-full flex-col gap-3'>
          <Link
            href='/login'
            className='w-full rounded-md border px-4 py-2 text-center hover:bg-accent'
          >
            Default Login
          </Link>

          <Link
            href='/login?role=staff'
            className='w-full rounded-md border px-4 py-2 text-center hover:bg-accent'
          >
            Staff Login
          </Link>

          <Link
            href='/login?role=parent'
            className='w-full rounded-md border px-4 py-2 text-center hover:bg-accent'
          >
            Parent Login
          </Link>
        </div>
      </div>
    </div>
  );
}
