'use client'
import React, {useState} from "react";


interface Gallery {
    id: number;
    title: string;
    category: string;
    image: string;
}

export default function GalleryPage() {
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


    return (
        <div className="min-h-screen">

            <section id="gallery" className="py-20 px-4 bg-primary/10">
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

        </div>
    );
}