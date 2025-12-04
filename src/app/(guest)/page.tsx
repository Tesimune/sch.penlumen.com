'use client';

import {useState} from "react"
import Link from "next/link";
import {Award, BookOpen, Trophy, Users} from "lucide-react"

interface Feature {
    icon: any;
    title: string;
    description: string;
}


export default function LandingPage() {
    const [features] = useState<Feature[]>([{
        icon: Award, title: "Excellence", description: "Committed to academic excellence and holistic development",
    }, {
        icon: Users, title: "Community", description: "Building a supportive and inclusive school community",
    }, {
        icon: BookOpen, title: "Education", description: "Modern curriculum with experienced educators",
    }, {
        icon: Trophy, title: "Achievement", description: "Celebrating student success and growth",
    },])


    return (
        <div>
            <section
                className="min-h-screen bg-gradient-to-br from-primary via-blue-50 to-background flex items-center justify-center px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-balance">
                        <span className="text-primary">Optimum Achievers</span> Academy
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        Empowering students to reach their full potential through excellence in education and character
                        development
                    </p>
                    <div className="flex gap-4 justify-center pt-8">
                        <Link
                            href="/about"
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Learn More
                        </Link>
                        <Link
                            href="/#contact"
                            className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>


            <section className="py-20 px-4 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
                        <p className="text-lg text-muted-foreground">Discover what makes Optimum Achievers Academy
                            special</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (<div
                                key={index}
                                className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <Icon className="text-secondary" size={24}/>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>)
                        })}
                    </div>
                </div>
            </section>


            <section className="py-20 px-4 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-bold">Ready to Join Us?</h2>
                    <p className="text-lg text-primary-foreground/90">
                        Become part of our community of achievers and discover your potential
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Contact Us Today
                    </Link>
                </div>
            </section>

        </div>
    );
}
