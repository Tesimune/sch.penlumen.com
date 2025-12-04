import './globals.css';
import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/sonner';
import {Geist, Geist_Mono} from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_FULL_NAME || 'School';
const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';
const THEME_CSS = process.env.NEXT_PUBLIC_THEME_CSS_URL || '/css/default.css';

export const metadata: Metadata = {
    title: APP_NAME,
    description: `Welcome to ${APP_NAME} - Inspiring Excellence in Education`,
    icons: {
        icon: [
            {url: APP_LOGO, media: '(prefers-color-scheme: light)'},
            {url: APP_LOGO, media: '(prefers-color-scheme: dark)'},
            {url: '/icon.svg', type: 'image/svg+xml'},
        ],
        apple: APP_LOGO,
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            {/* External theme CSS */}
            <link
                rel="stylesheet"
                href={THEME_CSS}
                key="theme-css"
            />
            <title>{APP_NAME}</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main>{children}</main>
        <Toaster/>
        </body>
        </html>
    );
}
