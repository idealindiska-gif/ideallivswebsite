"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Globe, ChevronLeft, ChevronRight, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/woocommerce";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getDiscountPercentage, formatPrice } from "@/lib/woocommerce/products";

interface PromotionGridProps {
    promotionProducts?: Product[];
}

export function PromotionGrid({ promotionProducts = [] }: PromotionGridProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance sliders
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % 30); // 30 is common multiple for 2, 3, 5
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const sliderProducts = promotionProducts.slice(0, 5);
    const card2Index = sliderProducts.length > 0 ? currentIndex % Math.min(sliderProducts.length, 5) : 0;
    const card3Index = currentIndex % 3;

    return (
        <section className="w-full pt-6 pb-6 md:pt-12 md:pb-8">
            <div className="w-full px-[10px] md:px-[15px]">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {/* Card 1: Brand/Hero Information */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#FFF9E5] aspect-square text-gray-900 shadow-sm hover:shadow-xl transition-all p-4 sm:p-5 xl:p-8 flex flex-col justify-center items-center text-center border border-amber-100">
                        <div className="space-y-2 sm:space-y-3 xl:space-y-6 relative z-10 w-full">
                            <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-200/50 text-amber-900 rounded-full text-[8px] sm:text-[9px] xl:text-[10px] font-bold uppercase tracking-wider">
                                Weekly Deals: Jan 19 - Jan 25
                            </span>

                            <div className="space-y-1 sm:space-y-2">
                                <h1 className="text-[13px] sm:text-base md:text-xl lg:text-lg xl:text-2xl 2xl:text-3xl font-bold leading-tight text-gray-900">
                                    Authentic Indian & <br className="hidden sm:block" />Pakistani Groceries
                                </h1>
                                <p className="text-[9px] sm:text-[11px] md:text-sm lg:text-[12px] xl:text-sm text-gray-600 leading-tight sm:leading-relaxed font-medium max-w-[240px] mx-auto line-clamp-2 md:line-clamp-none">
                                    From aromatic spices to premium Basmati rice & fresh Halal meat.
                                </p>
                            </div>

                            <div className="pt-1 sm:pt-2 xl:pt-4">
                                <Link href="/shop">
                                    <Button size="sm" className="h-7 sm:h-9 xl:h-10 text-[9px] sm:text-xs xl:text-sm rounded-full bg-amber-600 text-white hover:bg-amber-700 font-bold px-3 sm:px-6 xl:px-8 shadow-lg border-none">
                                        Shop Now <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-amber-200/30 rounded-full blur-2xl"></div>
                    </div>

                    {/* Card 2: Sona Masoori Special Promotion */}
                    <Link href="/product/india-gate-sona-masoori-rice-5kg" className="group">
                        <div className="relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-lg transition-all aspect-square border border-gray-100">
                            <Image
                                src="https://crm.ideallivs.com/wp-content/uploads/2025/05/sona-masoori-speical-promotion-price-web.jpg"
                                alt="India Gate Sona Masoori Rice 5kg - Special Promotion"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Card 3: Dynamic Promotion Slider */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#FFF0F0] aspect-square text-gray-900 shadow-sm hover:shadow-xl transition-all border border-rose-100">
                        {sliderProducts.length > 0 ? (
                            <div className="relative h-full flex flex-col p-4 sm:p-5">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={card2Index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex flex-col h-full justify-between"
                                    >
                                        {/* Top: Badges */}
                                        <div className="flex justify-between items-start z-10">
                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 bg-rose-200/50 text-rose-900 rounded-full tracking-wide">
                                                Deal
                                            </span>
                                            {sliderProducts[card2Index].regular_price && (
                                                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 bg-green-100 text-green-700 rounded-lg shadow-sm">
                                                    Save {getDiscountPercentage(sliderProducts[card2Index])}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Center: Image & Info */}
                                        <div className="flex flex-col items-center flex-1 justify-center min-h-0">
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 xl:w-32 xl:h-32 flex-shrink-0 drop-shadow-md mb-1 sm:mb-2">
                                                <Image
                                                    src={sliderProducts[card2Index].images[0]?.src || "https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg"}
                                                    alt={sliderProducts[card2Index].name}
                                                    fill
                                                    className="object-contain hover:scale-105 transition-transform duration-500"
                                                    priority
                                                />
                                            </div>
                                            <div className="text-center w-full px-1">
                                                <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 leading-tight line-clamp-2 min-h-[2.4em] mb-0.5">
                                                    {sliderProducts[card2Index].name}
                                                </h3>
                                                <div className="flex flex-col items-center justify-center -space-y-0.5">
                                                    <span className="text-base sm:text-lg xl:text-xl font-black text-rose-600">
                                                        {sliderProducts[card2Index].price} kr
                                                    </span>
                                                    {sliderProducts[card2Index].regular_price && sliderProducts[card2Index].regular_price !== sliderProducts[card2Index].price && (
                                                        <span className="text-[9px] line-through text-gray-400 font-medium">
                                                            {sliderProducts[card2Index].regular_price} kr
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom: Action */}
                                        <div className="flex items-center justify-between pt-1">
                                            <Link href={`/product/${sliderProducts[card2Index].slug}`}>
                                                <Button size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs rounded-full bg-rose-600 text-white hover:bg-rose-700 font-bold px-3 sm:px-5 shadow-sm border-none transition-all hover:shadow-md">
                                                    Buy Now
                                                </Button>
                                            </Link>
                                            <div className="flex gap-1">
                                                {sliderProducts.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 rounded-full transition-all ${card2Index === i ? "bg-rose-600 w-3 sm:w-4" : "bg-rose-200 w-1"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Fallback: Static 99 kr Special Offers */
                            <Link href="/deals" className="group h-full block p-4 sm:p-6 text-center">
                                <div className="relative z-10 flex flex-col h-full justify-center space-y-3">
                                    <span className="inline-block mx-auto px-2 py-0.5 sm:px-3 sm:py-1 bg-rose-200/50 text-rose-900 text-[8px] sm:text-[10px] font-bold rounded-full uppercase">
                                        Limited Time
                                    </span>
                                    <div>
                                        <h3 className="text-2xl sm:text-4xl xl:text-5xl font-black text-rose-600">99 kr</h3>
                                        <p className="text-[10px] sm:text-base font-bold text-gray-900">Special Offers</p>
                                    </div>
                                    <Button size="sm" className="h-7 sm:h-9 rounded-full bg-rose-600 text-white hover:bg-rose-700 font-bold px-4 sm:px-6 shadow-md border-none self-center">
                                        View All
                                    </Button>
                                </div>
                            </Link>
                        )}
                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-rose-200/20 rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    {/* Card 4: Dynamic Delivery Slider */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#F0FFF4] aspect-square text-gray-900 shadow-sm hover:shadow-xl transition-all border border-emerald-100">
                        <div className="relative h-full flex flex-col">
                            <AnimatePresence mode="wait">
                                {card3Index === 0 ? (
                                    <motion.div
                                        key="stockholm"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="p-4 sm:p-6 flex flex-col h-full justify-between items-center text-center pb-8"
                                    >
                                        <div className="space-y-2 sm:space-y-4 w-full flex-1 flex flex-col justify-center">
                                            <div className="flex justify-center mb-1">
                                                <div className="p-2 bg-emerald-100 rounded-xl">
                                                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Local Delivery</span>

                                            <div className="space-y-2">
                                                <h3 className="text-sm sm:text-lg md:text-xl font-bold leading-tight text-gray-900">
                                                    Fast & Reliable <br />Local Service
                                                </h3>
                                                <div className="flex flex-col gap-2 items-center pt-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase shadow-sm">Free</span>
                                                        <span className="text-xs font-semibold text-gray-700">Orders {'>'} 500 kr</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <Link href="/delivery-information" className="block w-full">
                                                <Button size="sm" className="w-full h-9 sm:h-10 text-xs sm:text-sm rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-md border-none">
                                                    Schedule Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ) : card3Index === 1 ? (
                                    <motion.div
                                        key="europe"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="p-4 sm:p-6 flex flex-col h-full justify-between items-center text-center pb-8"
                                    >
                                        <div className="space-y-3 w-full flex-1 flex flex-col justify-center">
                                            <div className="flex justify-center mb-1">
                                                <div className="p-2 bg-emerald-100 rounded-xl">
                                                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">EU Shipping</span>

                                            <div className="space-y-2">
                                                <h3 className="text-sm sm:text-lg md:text-xl font-bold leading-tight text-gray-900">
                                                    Authentic Tastes <br />Across Europe
                                                </h3>
                                                <p className="text-xs text-gray-600 leading-relaxed max-w-[220px] mx-auto">
                                                    Bringing home to your doorstep, anywhere in the EU.
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-2 pt-1">
                                                {['Norway', 'Finland', 'Denmark'].map((country) => (
                                                    <span key={country} className="px-2 py-1 bg-white text-gray-700 border border-emerald-100 rounded-lg text-[9px] font-bold uppercase shadow-sm">
                                                        {country}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <Link href="/europe-delivery" className="block w-full">
                                                <Button size="sm" className="w-full h-9 sm:h-10 text-xs sm:text-sm rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-md border-none">
                                                    Check Shipping
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="delivery-post"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative h-full w-full"
                                    >
                                        <Image
                                            src="https://crm.ideallivs.com/wp-content/uploads/2026/01/Delivey-Post-scaled-e1768345875656.jpg"
                                            alt="Ideal Livs Delivery Schedule"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-3 sm:p-6 opacity-0 hover:opacity-100 transition-opacity">
                                            <Link href="/delivery-information">
                                                <Button size="sm" className="h-7 sm:h-9 xl:h-10 text-[9px] sm:text-sm rounded-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-6 shadow-xl border-none">
                                                    View Schedule
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Static Pagination Dots for Card 4 */}
                            <div className="absolute bottom-2 sm:bottom-4 right-1/2 translate-x-1/2 flex gap-1 z-20">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${card3Index === i ? "bg-emerald-600 w-3 sm:w-4" : "bg-emerald-200"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-200/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
