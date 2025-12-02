"use client"

import Link from "next/link"
import {useState} from "react"
import {Mail, MapPin, Menu, Phone, X} from "lucide-react"

const APP_NAME = process.env.NEXT_PUBLIC_APP_FULL_NAME || 'School';
const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';
const APP_PHONE = process.env.NEXT_PUBLIC_APP_PHONE || 'School';
const APP_EMAIL = process.env.NEXT_PUBLIC_APP_EMAIL || 'School';
const APP_ADDRESS = process.env.NEXT_PUBLIC_APP_ADDRESS || 'School';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 relative">
                            <img
                                src={APP_LOGO}
                                alt={`${APP_NAME} Logo`}
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span
                            className="hidden md:inline text-lg font-bold text-primary">{APP_NAME}</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/#about" className="text-foreground hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/#events" className="text-foreground hover:text-primary transition-colors">
                            Events
                        </Link>
                        <Link href="/#gallery" className="text-foreground hover:text-primary transition-colors">
                            Gallery
                        </Link>
                        <Link
                            href="/login"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-md">
                        {isOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (<div className="md:hidden pb-4 space-y-2">
                    <Link href="/" className="block px-4 py-2 hover:bg-muted rounded-md">
                        Home
                    </Link>
                    <Link href="/#about" className="block px-4 py-2 hover:bg-muted rounded-md">
                        About
                    </Link>
                    <Link href="/#events" className="block px-4 py-2 hover:bg-muted rounded-md">
                        Events
                    </Link>
                    <Link href="/#gallery" className="block px-4 py-2 hover:bg-muted rounded-md">
                        Gallery
                    </Link>
                    <Link href="/login" className="block px-4 py-2 bg-primary text-primary-foreground rounded-md">
                        Login
                    </Link>
                </div>)}
            </div>
        </nav>
    )
}


export function Footer() {
    return (
        <footer className="bg-foreground text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-center gap-3">
                                <Phone size={18}/>
                                <span>{APP_PHONE}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18}/>
                                <span>{APP_EMAIL}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={18}/>
                                <span>{APP_ADDRESS}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <div className="space-y-2 text-gray-300">
                            <Link href="/#about" className="hover:text-white transition-colors block">
                                About Us
                            </Link>
                            <Link href="/#events" className="hover:text-white transition-colors block">
                                Events
                            </Link>
                            <Link href="/#gallery" className="hover:text-white transition-colors block">
                                Gallery
                            </Link>
                            <Link href="/login" className="hover:text-white transition-colors block">
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* About */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">About</h3>
                        <p className="text-gray-300 text-sm">
                            {APP_NAME} is dedicated to inspiring excellence in education and shaping
                            future leaders.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 {APP_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

