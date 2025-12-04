import type React from 'react';
import GuestNavFooter from "@/components/guest/guest-nav-footer";

export default function GuestLayout({children}: { children: React.ReactNode; }) {
    return (
        <GuestNavFooter>
            {children}
        </GuestNavFooter>
    );
}
