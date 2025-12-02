'use client';
import type React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userString = Cookies.get('user');
  const user = userString ? JSON.parse(userString) : null;
  if (user?.role == 'PARENT') {
    router.push('/parent/dashboard');
  }
  return <AppSidebar>{children}</AppSidebar>;
}
