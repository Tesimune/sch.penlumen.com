'use client'
import React, {useState} from "react";
import {Calendar, MapPin, Users} from "lucide-react";


interface Event {
    id: string;
    title: string;
    description: string;
    attendees: string;
    location: string;
    date: string;
    time: string;
}

export default function EventPage() {
    const [events] = useState<Event[]>([])

    return (
        <div className="min-h-screen">

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

        </div>
    );
}