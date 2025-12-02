'use client';

import {useState} from "react"
import Link from "next/link";
import {Award, BookOpen, Calendar, MapPin, Trophy, Users} from "lucide-react"

interface  Feature {
    icon: any;
    title: string;
    description: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    attendees: string;
    location: string;
    date: string;
    time: string;
}

interface Gallery {
    id: number;
    title: string;
    category: string;
    image: string;
}

export default function LandingPage() {
    const APP_NAME = process.env.NEXT_PUBLIC_APP_SLUG_NAME || 'School';
    const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/placeholder.svg';

    const [features] = useState<Feature[]>([{
        icon: Award, title: "Excellence", description: "Committed to academic excellence and holistic development",
    }, {
        icon: Users, title: "Community", description: "Building a supportive and inclusive school community",
    }, {
        icon: BookOpen, title: "Education", description: "Modern curriculum with experienced educators",
    }, {
        icon: Trophy, title: "Achievement", description: "Celebrating student success and growth",
    },])

    const [events] = useState<Event[]>([])

    const [gallery] = useState<Gallery[]>([{
        id: 1, title: "Classroom Learning", category: "Academics", image: "/logo.svg",
    }, {
        id: 2, title: "Sports Activities", category: "Sports", image: "/logo.svg",
    }, {
        id: 3, title: "Science Lab", category: "Academics", image: "/logo.svg",
    }, {
        id: 4, title: "Art & Creativity", category: "Arts", image: "/logo.svg",
    }, {
        id: 5, title: "School Assembly", category: "Events", image: "/logo.svg",
    }, {
        id: 6, title: "Community Service", category: "Community", image: "/logo.svg",
    }, {
        id: 7, title: "Library Time", category: "Academics", image: "/logo.svg",
    }, {
        id: 8, title: "Cultural Program", category: "Events", image: "/logo.svg",
    },])

    const [selectedCategory, setSelectedCategory] = useState("All")
    const categories = ["All", "Academics", "Sports", "Arts", "Events", "Community"]

    const filteredGallery = selectedCategory === "All" ? gallery : gallery.filter((item) => item.category === selectedCategory)

    return (<div>
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
                        href="/#about"
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

        <section id="about" className="py-20 px-4 bg-primary/10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-primary mb-6">About Us</h1>
                <p className="text-xl text-muted-foreground">
                    Discover the mission, vision, and values that guide Optimum Achievers Academy
                </p>
            </div>
        </section>

        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        At Optimum Achievers Academy, our mission is to provide a world-class education that
                        empowers students
                        to become confident, capable, and compassionate leaders. We believe in nurturing academic
                        excellence,
                        critical thinking, and character development in a supportive and inclusive environment.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        We envision a community of learners who are curious, innovative, and committed to making a
                        positive
                        impact on the world. Our students will be well-rounded individuals equipped with the skills
                        and
                        knowledge to thrive in a rapidly changing global society.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[{
                            title: "Excellence", desc: "Striving for the highest standards in all we do"
                        }, {
                            title: "Integrity", desc: "Acting with honesty and strong moral principles"
                        }, {
                            title: "Inclusivity", desc: "Celebrating diversity and welcoming all students"
                        }, {
                            title: "Innovation", desc: "Embracing creative thinking and new approaches"
                        },].map((value, i) => (<div key={i} className="bg-white rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold text-primary mb-2">{value.title}</h3>
                            <p className="text-muted-foreground">{value.desc}</p>
                        </div>))}
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Facilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["Modern classrooms with interactive learning technology", "Well-equipped science and computer labs", "Sports facilities and recreation areas", "Library with extensive resources", "Art and music studios", "Cafeteria with nutritious meals",].map((facility, i) => (
                            <div key={i} className="bg-secondary/10 rounded-lg p-4">
                                <p className="font-medium text-foreground">{facility}</p>
                            </div>))}
                    </div>
                </div>
            </div>
        </section>

        <section id="events" className="py-20 px-4 bg-primary/10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-primary mb-6">School Events</h1>
                <p className="text-xl text-muted-foreground">Join us for exciting events throughout the year</p>
            </div>
        </section>

        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event: Event) => (<div
                        key={event.id}
                        className="bg-white rounded-lg shadow-sm border border-border hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <div className="bg-primary/10 h-32 flex items-center justify-center">
                            <Calendar className="text-primary" size={48}/>
                        </div>
                        <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold text-foreground">{event.title}</h3>

                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16}/>
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16}/>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16}/>
                                    <span>{event.attendees} expected</span>
                                </div>
                            </div>

                            <p className="text-foreground">{event.time}</p>
                            <p className="text-muted-foreground text-sm">{event.description}</p>

                            <button
                                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>))}
                </div>
            </div>
        </section>

        <section  id="gallery" className="py-20 px-4 bg-primary/10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-primary mb-6">Photo Gallery</h1>
                <p className="text-xl text-muted-foreground">Explore moments from our school life and activities</p>
            </div>
        </section>

        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {categories.map((cat) => (<button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-white border border-border text-foreground hover:bg-muted"}`}
                    >
                        {cat}
                    </button>))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredGallery.map((item) => (<div
                        key={item.id}
                        className="group overflow-hidden rounded-lg shadow-sm border border-border hover:shadow-lg transition-all cursor-pointer"
                    >
                        <div className="relative h-64 overflow-hidden bg-muted">
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg"
                                }}
                            />
                            <div
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                                <div
                                    className="w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-sm text-gray-200">{item.category}</p>
                                </div>
                            </div>
                        </div>
                    </div>))}
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
                    href="/#"
                    className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                    Contact Us Today
                </Link>
            </div>
        </section>


    </div>);
}
