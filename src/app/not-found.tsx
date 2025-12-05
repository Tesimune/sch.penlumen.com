'use client';

import Link from 'next/link';

import {Button} from '@/components/ui/button';

import {motion} from 'framer-motion';
import {ArrowLeft} from 'lucide-react';

const APP_SLUG = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'School';
const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';

export default function NotFoundPage() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-muted p-4'>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className='text-center'
            >
                <Link href="/" className="grid justify-center items-center gap-3">
                    <div className="w-12 h-12 relative">
                        <img
                            src={APP_LOGO}
                            alt={`${APP_SLUG} Logo`}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                            }}
                        />
                    </div>
                    <span className="hidden md:inline text-lg font-bold text-primary">{APP_SLUG}</span>
                </Link>

                <motion.h1
                    className='mb-2 text-6xl font-bold'
                    initial={{scale: 0.8}}
                    animate={{scale: 1}}
                    transition={{delay: 0.2, type: 'spring', stiffness: 100}}
                >
                    404
                </motion.h1>

                <h2 className='mb-4 text-2xl font-semibold'>Page Not Found</h2>

                <p className='mb-8 max-w-md text-muted-foreground'>
                    The page you are looking for might have been removed, had its name
                    changed, or is temporarily unavailable.
                </p>

                <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                    <Button asChild size='lg'>
                        <Link href='/session'>
                            <ArrowLeft className='mr-2 h-4 w-4'/>
                            Back to Home
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>

            <div className='mt-16 flex flex-col items-center'>
                <div className='mb-4 h-px w-16 bg-border'/>
                <p className='text-sm text-muted-foreground'>
                    Need help?{' '}
                    <Link href='/#contact' className='text-primary hover:underline'>
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    );
}
