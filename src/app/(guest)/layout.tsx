import type React from 'react';
import {Footer, Navigation} from "@/components/guest/guest-layout";

export default function GuestLayout({children}: { children: React.ReactNode; }) {
    return (
        <>
            <Navigation/>
            {children}
            <Footer/>.
        </>
    );
}
