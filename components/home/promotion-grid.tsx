"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/woocommerce";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getDiscountPercentage } from "@/lib/woocommerce/products";
import { CurrencyPrice } from "@/components/ui/currency-price";

interface PromotionGridProps {
    promotionProducts?: Product[];
}

export function PromotionGrid({ promotionProducts = [] }: PromotionGridProps) {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [currentDeliveryIndex, setCurrentDeliveryIndex] = useState(0);

    const sliderProducts = promotionProducts.slice(0, 5);

    // Auto-advance product slider
    useEffect(() => {
        if (sliderProducts.length === 0) return;
        const timer = setInterval(() => {
            setCurrentProductIndex((prev) => (prev + 1) % sliderProducts.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [sliderProducts.length]);

    // Auto-advance delivery slider
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDeliveryIndex((prev) => (prev + 1) % 2);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full py-4 md:py-8">
            <div className="container-wide mx-auto px-[var(--container-padding)]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">

                    {/* Card 1: Hero/Welcome - Reversed Colors */}
                    <Link href="/shop" className="group">
                        <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 border border-yellow-400/50">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-overlay" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

                            <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between items-center text-center z-10">
                                <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
                                    <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-yellow-100/90 border border-yellow-600/20 text-emerald-900 text-[9px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                                        <Sparkles className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 mr-1 -mt-0.5 text-emerald-700" />
                                        Premium Quality
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-emerald-950 drop-shadow-sm leading-tight tracking-tight">
                                        Indian & <br />Pakistani
                                    </h2>
                                    <p className="text-emerald-900/80 text-xs sm:text-sm md:text-lg font-bold uppercase tracking-widest">
                                        Groceries
                                    </p>
                                </div>

                                <div className="space-y-1 md:space-y-2 mb-1 md:mb-2 w-full px-1">
                                    <p className="text-emerald-950/70 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-none">
                                        Authentic Basmati Rice, Spices & Halal Meat
                                    </p>
                                    <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-emerald-900 hover:bg-emerald-800 text-yellow-50 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                                        Shop Now <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5 text-yellow-400" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: Ramadan Mega Savings Promo */}
                    <Link href="/deals" className="group">
                        <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 border border-emerald-800/30">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

                            <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between items-center text-center z-10">
                                <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
                                    <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-200 text-[9px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                        Ramadan Special
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm leading-tight">
                                        Mega<br />Savings
                                    </h2>
                                </div>

                                <div className="space-y-1.5 md:space-y-4 mb-1 md:mb-2 w-full px-1">
                                    <p className="text-emerald-100/80 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-none">
                                        Exclusive discounts on Dates, Rice, Spices & More
                                    </p>
                                    <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-yellow-400 hover:bg-yellow-500 text-green-950 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                                        View All Deals <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: Dynamic Deal Slider */}
                    <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl group">
                        {sliderProducts.length > 0 ? (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentProductIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0"
                                    >
                                        {/* Product Image - Full Width */}
                                        <Image
                                            src={sliderProducts[currentProductIndex]?.images[0]?.src || ""}
                                            alt={sliderProducts[currentProductIndex]?.name || ""}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between z-10">
                                    {/* Top Badges */}
                                    <div className="flex justify-between items-start">
                                        <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-secondary text-secondary-foreground rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase">
                                            Hot Deal
                                        </span>
                                        <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-white/90 text-primary rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold">
                                            -{getDiscountPercentage(sliderProducts[currentProductIndex])}%
                                        </span>
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="space-y-1 md:space-y-2">
                                        <h3 className="text-white text-xs sm:text-sm md:text-base font-bold leading-tight line-clamp-2">
                                            {sliderProducts[currentProductIndex]?.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-1.5 md:gap-2">
                                                <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                                                    <CurrencyPrice price={sliderProducts[currentProductIndex]?.price} />
                                                </span>
                                                {sliderProducts[currentProductIndex]?.regular_price &&
                                                    sliderProducts[currentProductIndex]?.regular_price !== sliderProducts[currentProductIndex]?.price && (
                                                        <span className="text-white/60 text-[10px] sm:text-xs md:text-sm line-through">
                                                            <CurrencyPrice price={sliderProducts[currentProductIndex]?.regular_price} />
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                        <Link href={`/product/${sliderProducts[currentProductIndex]?.slug}`}>
                                            <Button size="sm" className="h-7 md:h-8 w-full text-[10px] sm:text-xs md:text-sm rounded-full bg-white text-foreground hover:bg-secondary hover:text-secondary-foreground font-semibold transition-colors">
                                                View Deal
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Pagination Dots */}
                                <div className="absolute bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                                    {sliderProducts.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentProductIndex(i)}
                                            className={`h-1 md:h-1.5 rounded-full transition-all ${currentProductIndex === i ? "bg-white w-4 md:w-5" : "bg-white/40 w-1 md:w-1.5"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <Link href="/deals" className="block h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-1">99 kr</span>
                                    <p className="text-sm md:text-base font-semibold text-foreground">Special Offers</p>
                                    <Button size="sm" className="mt-3 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs">
                                        View Deals
                                    </Button>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Card 4: Delivery Info Slider */}
                    <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl group">
                        <AnimatePresence mode="wait">
                            {currentDeliveryIndex === 0 ? (
                                <motion.div
                                    key="stockholm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0"
                                >
                                    {/* Background Image */}
                                    <Image
                                        src="https://crm.ideallivs.com/wp-content/uploads/2026/01/Delivey-Post-scaled-e1768345875656.jpg"
                                        alt="Stockholm Delivery"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-primary/30" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="europe"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"
                                />
                            )}
                        </AnimatePresence>

                        {/* Content */}
                        <div className="absolute inset-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between z-10">
                            <AnimatePresence mode="wait">
                                {currentDeliveryIndex === 0 ? (
                                    <motion.div
                                        key="stockholm-content"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col h-full justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                                <Truck className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase text-white/90 tracking-wide">
                                                Stockholm
                                            </span>
                                        </div>

                                        <div className="space-y-2 md:space-y-3">
                                            <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                                                Same-Day Delivery
                                            </h3>
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold text-white">
                                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse" />
                                                Free Over 500 kr
                                            </span>
                                            <Link href="/delivery-information" className="block">
                                                <Button size="sm" className="h-7 md:h-8 w-full text-[10px] sm:text-xs md:text-sm rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
                                                    Book a Slot
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="europe-content"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col h-full justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                                <Globe className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase text-white/90 tracking-wide">
                                                EU Shipping
                                            </span>
                                        </div>

                                        <div className="space-y-2 md:space-y-3">
                                            <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                                                Europe-Wide Delivery
                                            </h3>
                                            <div className="flex flex-wrap gap-1 md:gap-1.5">
                                                {['NOR', 'FIN', 'DEN', 'GER'].map((country) => (
                                                    <span key={country} className="px-1.5 py-0.5 md:px-2 md:py-1 bg-white/20 backdrop-blur-sm rounded text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white">
                                                        {country}
                                                    </span>
                                                ))}
                                            </div>
                                            <Link href="/europe-delivery" className="block">
                                                <Button size="sm" className="h-7 md:h-8 w-full text-[10px] sm:text-xs md:text-sm rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
                                                    Shipping Rates
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {[0, 1].map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentDeliveryIndex(i)}
                                    className={`h-1 md:h-1.5 rounded-full transition-all ${currentDeliveryIndex === i ? "bg-white w-4 md:w-5" : "bg-white/40 w-1 md:w-1.5"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
