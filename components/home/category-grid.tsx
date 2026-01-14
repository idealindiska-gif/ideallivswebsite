"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: {
        src: string;
        alt: string;
    } | null;
    count?: number;
}

interface CategoryGridProps {
    categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    if (!categories || categories.length === 0) return null;

    // Gradient backgrounds for categories without images
    const gradientBackgrounds = [
        'bg-gradient-to-br from-emerald-500 to-teal-600',
        'bg-gradient-to-br from-blue-500 to-cyan-600',
        'bg-gradient-to-br from-purple-500 to-pink-600',
        'bg-gradient-to-br from-orange-500 to-red-600',
        'bg-gradient-to-br from-amber-500 to-yellow-600',
        'bg-gradient-to-br from-rose-500 to-pink-600',
        'bg-gradient-to-br from-indigo-500 to-blue-600',
        'bg-gradient-to-br from-green-500 to-emerald-600',
    ];

    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="space-y-1">
                        <span className="text-primary font-bold text-xs uppercase tracking-wider">Explore</span>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Top Categories</h2>
                    </div>
                    <Link
                        href="/shop"
                        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        <span className="hidden sm:inline">View All</span>
                        <span className="sm:hidden">All</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="flex-none w-[160px] sm:w-[200px] md:w-[220px] snap-start"
                        >
                            <Link href={`/product-category/${category.slug}`} className="group block h-full">
                                <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-[4/5] border border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                                    {/* Image Background or Colored Gradient */}
                                    <div className="absolute inset-0">
                                        {category.image ? (
                                            <Image
                                                src={category.image.src}
                                                alt={category.image.alt || category.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 160px, 220px"
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${gradientBackgrounds[index % gradientBackgrounds.length]}`}>
                                                <div className="text-white text-4xl font-bold opacity-20">
                                                    {category.name.charAt(0)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h3 className="text-white font-heading font-bold text-sm sm:text-base md:text-lg leading-tight mb-1 group-hover:text-amber-400 transition-colors truncate">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center justify-between text-white/70 text-[10px] sm:text-xs font-medium">
                                            <span>{category.count || 0} Items</span>
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center translate-x-2 group-hover:translate-x-0 transition-transform">
                                                <ArrowRight className="w-2.5 h-2.5 sm:w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
