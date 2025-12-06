'use client'
import React from "react";

export default function AboutPage() {
    return (
        <div className="min-h-screen">

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
                            },].map((value, i) => (
                                <div key={i} className="bg-white rounded-lg p-6 border border-border">
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

        </div>
    );
}