'use client';

import type React from 'react';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  School,
  Settings,
  Users,
  User,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface UserProfile {
  name: string;
  avatar: string;
  role: string;
}

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile>();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const terminateSession = () => {
    Cookies.remove('branch');
    router.push('/session');
  };

  const logoutAccount = () => {
    Cookies.remove('branch');
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const staffMenuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/staff/dashboard' },
    { title: 'Parents', icon: Users, href: '/staff/parents' },
    { title: 'Staff', icon: GraduationCap, href: '/staff/staffs' },
    { title: 'Classes', icon: BookOpen, href: '/staff/classes' },
    { title: 'Students', icon: Users, href: '/staff/students' },
    { title: 'Settings', icon: Settings, href: '/staff/settings' },
    { title: 'Reports', icon: BarChart3, href: '/staff/reports' },
    { title: 'Schedules', icon: Calendar, href: '/staff/schedules' },
  ];

  const parentsMenuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/parents/dashboard' },
    { title: 'My Children', icon: Users, href: '/parents/children' },
  ];

  useEffect(() => {
    setMounted(true);

    const userString = Cookies.get('user');
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      setProfile(user);
      if (user.role === 'parent') {
        setMenuItems(parentsMenuItems);
      } else {
        setMenuItems(staffMenuItems);
      }
    } else {
      Cookies.remove('user');
      Cookies.remove('token');
      Cookies.remove('branch');
      router.push('/login');
    }
  }, [router]);

  const APP_NAME = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'School';

  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-background'>
        {/* Sidebar */}
        <Sidebar className='border-r border-border'>
          <SidebarHeader className='border-b border-border p-0 h-16'>
            <div className='flex items-center gap-3 px-6 py-4'>
              <School className='h-6 w-6' />
              <span className='text-lg font-bold'>{APP_NAME}</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className='py-4 px-0'>
              <SidebarGroupLabel className='px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Main Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className='gap-0'>
                  {menuItems.map((item) => {
                    const isActive =
                      pathname.split('/').slice(0, 3).join('/') ===
                      item.href.split('/').slice(0, 3).join('/');

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`px-0 mx-0 border-l-4 transition-colors rounded-none ${
                            isActive
                              ? 'border-l-primary bg-sidebar-accent'
                              : 'border-l-transparent hover:bg-sidebar-accent'
                          }`}
                        >
                          <Link href={item.href} className='px-6 py-3'>
                            <item.icon className='h-5 w-5 flex-shrink-0' />
                            <span className='font-light text-sm'>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='border-t border-border p-0'>
            <div className='px-4 py-3'>
              <Button
                onClick={terminateSession}
                variant='outline'
                size='sm'
                className='w-full border-border text-foreground hover:bg-muted bg-transparent rounded-none'
              >
                Switch Branch
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className='flex-1 flex flex-col w-full'>
          <header className='flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6'>
            <SidebarTrigger className='text-foreground outline-0' />

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center outline-0 p-1'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={profile?.avatar || ''} alt='User' />
                      <AvatarFallback className='bg-primary text-primary-foreground text-xs font-bold'>
                        {profile?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start text-sm'>
                      <span className='font-semibold'>
                        {profile?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className='h-4 w-4 opacity-50 ml-2' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logoutAccount}
                  className='text-destructive cursor-pointer'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className='flex-1 w-full p-6 overflow-y-auto'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
