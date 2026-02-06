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

                    {/* Card 1: Hero/Welcome */}
                    <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl group">
                        {/* Background Image */}
                        <Image
                            src="https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg"
                            alt="Indian & Pakistani Groceries"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            priority
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                        {/* Content */}
                        <div className="absolute inset-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between">
                            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 md:px-2.5 md:py-1 bg-primary text-primary-foreground rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase">
                                <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                Fresh Deals
                            </span>

                            <div className="space-y-2 md:space-y-3">
                                <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                                    Indian & Pakistani Groceries
                                </h2>
                                <p className="text-white/80 text-[10px] sm:text-xs md:text-sm leading-snug line-clamp-2">
                                    Premium spices, Basmati rice & Halal meat
                                </p>
                                <Link href="/shop">
                                    <Button size="sm" className="h-7 md:h-8 lg:h-9 text-[10px] sm:text-xs md:text-sm rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 md:px-4">
                                        Shop Now <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Featured Product Promo */}
                    <Link href="/product/ig-idli-rice-5-kg" className="group">
                        <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-white border border-border">
                            <Image
                                src="https://crm.ideallivs.com/wp-content/uploads/2026/02/india-gate-idly-rice-offer.png"
                                alt="India Gate Idli Rice - Special Promotion"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, 25vw"
                                priority
                            />
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
