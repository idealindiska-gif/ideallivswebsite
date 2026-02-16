"use client";

import Image from "next/image";
import { Link } from "@/lib/navigation";
import { ArrowRight, Truck, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/woocommerce";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getDiscountPercentage } from "@/lib/woocommerce/products";
import { CurrencyPrice } from "@/components/ui/currency-price";
import { useTranslations } from 'next-intl';

interface PromotionGridProps {
    promotionProducts?: Product[];
}

export function PromotionGrid({ promotionProducts = [] }: PromotionGridProps) {
    const t = useTranslations('promo');
    const tc = useTranslations('common');
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">

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
                                        {t('premiumQuality')}
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-emerald-950 drop-shadow-sm leading-tight tracking-tight">
                                        {t('indianPakistani')}
                                    </h1>
                                </div>

                                <div className="space-y-1.5 md:space-y-4 mb-1 md:mb-2 w-full px-1">
                                    <p className="text-emerald-950/70 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-none">
                                        {t('authenticRice')}
                                    </p>
                                    <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-emerald-900 hover:bg-emerald-800 text-yellow-50 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                                        {tc('shopNow')} <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5 text-yellow-400" />
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
                                        {t('ramadanSpecial')}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm leading-tight">
                                        {t('megaSavings')}
                                    </h2>
                                </div>

                                <div className="space-y-1.5 md:space-y-4 mb-1 md:mb-2 w-full px-1">
                                    <p className="text-emerald-100/80 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-none">
                                        {t('exclusiveDiscounts')}
                                    </p>
                                    <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-yellow-400 hover:bg-yellow-500 text-green-950 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                                        {t('viewAllDeals')} <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: Dynamic Deal Slider */}
                    <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 border border-yellow-400/50 group">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-overlay" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

                        {sliderProducts.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentProductIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between items-center text-center z-10"
                                >
                                    {/* Top Content */}
                                    <div className="space-y-1 md:space-y-2 mt-2 md:mt-4 w-full">
                                        <div className="flex justify-center gap-2">
                                            <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-yellow-100/90 border border-yellow-600/20 text-emerald-900 text-[9px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                                                {t('hotDeal')}
                                            </span>
                                            <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-900 text-yellow-400 text-[9px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                                                -{getDiscountPercentage(sliderProducts[currentProductIndex])}%
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-emerald-950 drop-shadow-sm leading-tight tracking-tight line-clamp-2">
                                            {sliderProducts[currentProductIndex]?.name}
                                        </h2>
                                        <div className="flex justify-center items-center gap-2">
                                            {sliderProducts[currentProductIndex]?.regular_price && sliderProducts[currentProductIndex]?.regular_price !== sliderProducts[currentProductIndex]?.price && (
                                                <span className="text-emerald-900/60 text-xs sm:text-sm line-through decoration-emerald-900/40">
                                                    <CurrencyPrice price={sliderProducts[currentProductIndex]?.regular_price} />
                                                </span>
                                            )}
                                            <span className="text-emerald-900/80 text-sm md:text-lg font-bold uppercase tracking-widest">
                                                <CurrencyPrice price={sliderProducts[currentProductIndex]?.price} />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Background Image Overlay (Very Subtle) */}
                                    <div className="absolute inset-x-0 bottom-16 top-24 opacity-10 pointer-events-none mix-blend-multiply flex items-center justify-center">
                                        <Image
                                            src={sliderProducts[currentProductIndex]?.images[0]?.src || ""}
                                            alt=""
                                            width={200}
                                            height={200}
                                            className="object-contain max-h-full"
                                        />
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="space-y-1 md:space-y-2 mb-1 md:mb-2 w-full px-1 z-20">
                                        <p className="hidden md:block text-emerald-950/70 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-1">
                                            {t('limitedTimeOffer')}
                                        </p>
                                        <Link href={`/product/${sliderProducts[currentProductIndex]?.slug}`} className="block w-full sm:w-auto">
                                            <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-emerald-900 hover:bg-emerald-800 text-yellow-50 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                                                {t('viewDeal')} <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5 text-yellow-400" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between items-center text-center z-10">
                                <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
                                    <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-yellow-100/90 border border-yellow-600/20 text-emerald-900 text-[9px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                                        {t('specialOffers')}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-emerald-950 drop-shadow-sm leading-tight tracking-tight">
                                        {t('seasonalDeals')}
                                    </h2>
                                </div>
                                <div className="space-y-1 md:space-y-2 mb-1 md:mb-2 w-full px-1">
                                    <Link href="/deals">
                                        <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-emerald-900 hover:bg-emerald-800 text-yellow-50 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                                            {t('viewDeals')} <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5 text-yellow-400" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Pagination Dots */}
                        {sliderProducts.length > 0 && (
                            <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                                {sliderProducts.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentProductIndex(i)}
                                        className={`h-1 rounded-full transition-all ${currentProductIndex === i ? "bg-emerald-900 w-3 md:w-4" : "bg-emerald-900/30 w-1 md:w-1.5"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Card 4: Delivery Info Slider */}
                    <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 border border-emerald-800/30 group">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

                        <AnimatePresence mode="wait">
                            {currentDeliveryIndex === 0 ? (
                                <motion.div
                                    key="stockholm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between items-center text-center z-10"
                                >
                                    <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
                                        <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-200 text-[9px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                            <Truck className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 mr-1 -mt-0.5" />
                                            {t('stockholm')}
                                        </span>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm leading-tight">
                                            {t('sameDayDelivery')}
                                        </h2>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-4 mb-1 md:mb-2 w-full px-1">
                                        <p className="text-emerald-100/80 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed">
                                            {t('freeOver500')}
                                        </p>
                                        <Link href="/delivery-information" className="block w-full sm:w-auto">
                                            <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-yellow-400 hover:bg-yellow-500 text-green-950 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                                                {t('bookSlot')} <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="europe"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-between items-center text-center z-10"
                                >
                                    <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
                                        <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-200 text-[9px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                            <Globe className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 mr-1 -mt-0.5" />
                                            {t('euShipping')}
                                        </span>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm leading-tight">
                                            {t('europeWide')}
                                        </h2>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-4 mb-1 md:mb-2 w-full px-1">
                                        <div className="flex justify-center gap-1 md:gap-1.5 flex-wrap">
                                            {['NOR', 'FIN', 'DEN', 'GER'].map((country) => (
                                                <span key={country} className="px-1.5 py-0.5 md:px-2 md:py-1 bg-emerald-900/40 rounded text-[8px] sm:text-[9px] md:text-[10px] font-bold text-emerald-100/90 border border-emerald-500/20">
                                                    {country}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href="/europe-delivery" className="block w-full sm:w-auto">
                                            <Button size="sm" className="h-7 sm:h-8 md:h-9 w-full sm:w-auto rounded-full bg-yellow-400 hover:bg-yellow-500 text-green-950 text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                                                {t('shippingRates')} <ArrowRight className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {[0, 1].map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentDeliveryIndex(i)}
                                    className={`h-1 rounded-full transition-all ${currentDeliveryIndex === i ? "bg-yellow-400 w-3 md:w-4" : "bg-white/20 w-1 md:w-1.5"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
