'use client';

import { Link } from '@/lib/navigation';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// ─── Popular brands shown in the dropdown ────────────────────────────────────
const POPULAR_BRANDS = [
    { slug: 'trs', name: 'TRS', tagline: 'Spices & Flour', color: '#d62828', textColor: '#fff' },
    { slug: 'hr', name: 'H&R', tagline: 'Halal Products', color: '#2d6a4f', textColor: '#fff' },
    { slug: 'shan', name: 'Shan', tagline: 'Recipe Mixes', color: '#f77f00', textColor: '#fff' },
    { slug: 'mdh', name: 'MDH', tagline: 'Indian Spices', color: '#9b2226', textColor: '#fff' },
    { slug: 'national', name: 'National', tagline: 'Masalas & Sauces', color: '#1b4332', textColor: '#fff' },
    { slug: 'ig', name: 'India Gate', tagline: 'Premium Basmati', color: '#1d3557', textColor: '#fff' },
    { slug: 'mtr', name: 'MTR', tagline: 'Ready Meals', color: '#e07c24', textColor: '#fff' },
] as const;

// ─── Brand Logo Tile ─────────────────────────────────────────────────────────
function BrandTile({
    brand,
    size = 'md',
}: {
    brand: (typeof POPULAR_BRANDS)[number];
    size?: 'sm' | 'md';
}) {
    const dim = size === 'sm' ? 'w-12 h-12 text-xs' : 'w-14 h-14 text-sm';
    // Use first 2-3 chars as initials
    const initials = brand.name.length <= 3 ? brand.name : brand.name.slice(0, 2);

    return (
        <div
            className={`${dim} rounded-xl flex items-center justify-center font-black tracking-tight shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 shrink-0`}
            style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
            {initials}
        </div>
    );
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────
export function BrandsDropdown() {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Trigger */}
            <button
                className="group relative flex items-center gap-1 text-[0.70rem] xl:text-xs font-medium uppercase tracking-wider xl:tracking-widest text-foreground transition-colors hover:text-primary whitespace-nowrap"
                aria-expanded={open}
                aria-haspopup="true"
            >
                Popular Brands
                <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
                {/* underline matching NavLink */}
                <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${open ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                />
            </button>

            {/* Dropdown panel */}
            <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-background border border-border/60 rounded-2xl shadow-2xl shadow-black/10 z-50 transition-all duration-200 origin-top ${open
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
            >
                {/* Arrow tip */}
                <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-background border-l border-t border-border/60" />

                <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Popular Brands
                        </p>
                        <Link
                            href="/brands"
                            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                            onClick={() => setOpen(false)}
                        >
                            All brands <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {/* Brand grid — 4 cols */}
                    <div className="grid grid-cols-4 gap-2">
                        {POPULAR_BRANDS.map((brand) => (
                            <Link
                                key={brand.slug}
                                href={`/brand/${brand.slug}`}
                                onClick={() => setOpen(false)}
                                className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/40 transition-all duration-200"
                            >
                                <BrandTile brand={brand} size="md" />
                                <div className="text-center">
                                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                        {brand.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                                        {brand.tagline}
                                    </p>
                                </div>
                            </Link>
                        ))}

                        {/* "View all" tile */}
                        <Link
                            href="/brands"
                            onClick={() => setOpen(false)}
                            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                        >
                            <div className="w-14 h-14 rounded-xl bg-muted/60 border border-border/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors group-hover:scale-105">
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors leading-tight">
                                    All Brands
                                </p>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                                    View all
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Mobile brand grid (used inside MobileMenu) ───────────────────────────────
export function MobileBrandLinks({ onClose }: { onClose: () => void }) {
    return (
        <div className="px-4 py-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
                Popular Brands
            </p>
            <div className="grid grid-cols-4 gap-2">
                {POPULAR_BRANDS.map((brand) => (
                    <Link
                        key={brand.slug}
                        href={`/brand/${brand.slug}`}
                        onClick={onClose}
                        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-primary/5 transition-colors"
                    >
                        <BrandTile brand={brand} size="sm" />
                        <span className="text-[10px] font-bold text-center text-foreground group-hover:text-primary transition-colors leading-tight">
                            {brand.name}
                        </span>
                    </Link>
                ))}
            </div>
            <Link
                href="/brands"
                onClick={onClose}
                className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-border/40 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
                View all brands <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    );
}
