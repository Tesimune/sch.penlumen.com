'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function LoadingPage({
  text = 'Loading...',
  className = '',
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      <Loader2 className='h-10 w-10 animate-spin text-primary mb-3' />
      <p className='text-sm text-muted-foreground'>{text}</p>
    </div>
  );
}
