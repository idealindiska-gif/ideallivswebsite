'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/utils';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    regular_price: string;
    sale_price: string;
    images: Array<{ src: string }>;
}

export function ProductCarousel({
    products,
    label = 'Ramadan Mega Savings',
    title = 'Products On Promotion Right Now',
    viewAllLabel = 'View all Ramadan deals',
}: {
    products: Product[];
    label?: string;
    title?: string;
    viewAllLabel?: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
    };

    if (!products.length) return null;

    return (
        <div className="not-prose my-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">{label}</p>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                        {title}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => scroll('left')}
                        className="rounded-full h-11 w-11 border-border hover:border-primary hover:text-primary transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => scroll('right')}
                        className="rounded-full h-11 w-11 border-border hover:border-primary hover:text-primary transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Scrollable Track */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => {
                    const price = parseFloat(product.price);
                    const regular = parseFloat(product.regular_price);
                    const isOnSale = product.sale_price && parseFloat(product.sale_price) > 0;
                    const discount = isOnSale && regular > price && regular > 0
                        ? Math.round((1 - price / regular) * 100)
                        : 0;

                    return (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="snap-start shrink-0 w-[200px] group"
                        >
                            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                                {/* Image */}
                                <div className="relative aspect-square bg-muted overflow-hidden">
                                    {product.images?.[0]?.src ? (
                                        <Image
                                            src={product.images[0].src}
                                            alt={decodeHtmlEntities(product.name)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="200px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Tag className="w-10 h-10 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                            -{discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-3 flex-1">
                                        {decodeHtmlEntities(product.name)}
                                    </h4>
                                    <div className="flex items-end gap-2 mt-auto">
                                        <span className="text-base font-extrabold text-primary">
                                            {price.toFixed(0)} SEK
                                        </span>
                                        {isOnSale && regular > price && (
                                            <span className="text-xs text-muted-foreground line-through mb-0.5">
                                                {regular.toFixed(0)} SEK
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* View All Link */}
            <div className="mt-6 text-center">
                <Link
                    href="/deals"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4"
                >
                    {viewAllLabel} <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
