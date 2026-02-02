"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Globe, ChevronLeft, ChevronRight, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/woocommerce";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getDiscountPercentage } from "@/lib/woocommerce/products";
import { CurrencyPrice, CurrencySalePrice } from "@/components/ui/currency-price";

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

                    {/* Card 2: Annam Peanut Oil Special Promotion */}
                    <Link href="/product/annam-peanut-oil-1-liter" className="group">
                        <div className="relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-lg transition-all aspect-square border border-gray-100 bg-white">
                            <div className="absolute top-3 right-3 z-10">
                                <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase rounded-full shadow-md">
                                    Save 16 kr
                                </span>
                            </div>
                            <Image
                                src="https://crm.ideallivs.com/wp-content/uploads/2025/12/annam-peanut-oil-e1765817632858.png"
                                alt="Annam Peanut Oil 1 Liter - Special Promotion"
                                fill
                                className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5 flex flex-col justify-end min-h-[40%]">
                                <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-1">Annam Peanut Oil</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-yellow-400 text-2xl sm:text-3xl font-black">69 kr</span>
                                    <span className="text-gray-300 text-sm line-through decoration-rose-500">85 kr</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: Dynamic Promotion Slider - Redesigned for Premium Look */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF0F0] to-[#FFE4E4] aspect-square text-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 border border-rose-100 group">
                        {sliderProducts.length > 0 ? (
                            <div className="relative h-full flex flex-col p-3 sm:p-5 xl:p-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={card2Index}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="flex flex-col h-full justify-between relative z-10"
                                    >
                                        {/* Top: Premium Badges */}
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-[10px] sm:text-[11px] font-black uppercase px-2 py-1 sm:px-4 bg-rose-600 text-white rounded-full tracking-tighter sm:tracking-widest shadow-lg shadow-rose-200">
                                                Hot Deal
                                            </span>
                                            {sliderProducts[card2Index].regular_price && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] sm:text-[12px] font-bold px-2 py-0.5 sm:px-3 bg-white/80 backdrop-blur-md text-green-600 rounded-lg shadow-sm border border-green-50">
                                                        -{getDiscountPercentage(sliderProducts[card2Index])}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Center: Hero Product Image & Info */}
                                        <div className="flex flex-col items-center flex-1 justify-center min-h-0 py-1 sm:py-2">
                                            <div className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-44 lg:h-44 xl:w-56 xl:h-56 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3 drop-shadow-2xl">
                                                <Image
                                                    src={sliderProducts[card2Index].images[0]?.src || "https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg"}
                                                    alt={sliderProducts[card2Index].name}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                            <div className="text-center w-full mt-2 sm:mt-3">
                                                <h3 className="text-xs sm:text-base lg:text-lg xl:text-xl font-black text-gray-900 leading-tight line-clamp-1 group-hover:text-rose-600 transition-colors">
                                                    {sliderProducts[card2Index].name}
                                                </h3>
                                                <div className="flex items-center justify-center gap-3 mt-1 sm:mt-2">
                                                    <span className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-black text-rose-600 tabular-nums">
                                                        <CurrencyPrice price={sliderProducts[card2Index].price} size="lg" className="text-rose-600" />
                                                    </span>
                                                    {sliderProducts[card2Index].regular_price && sliderProducts[card2Index].regular_price !== sliderProducts[card2Index].price && (
                                                        <span className="text-[10px] sm:text-sm lg:text-base line-through text-gray-400 font-bold decoration-rose-400/30">
                                                            <CurrencyPrice price={sliderProducts[card2Index].regular_price} size="sm" className="text-gray-400" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom: Modern Action Card */}
                                        <div className="flex items-center justify-between gap-2 pt-1 sm:pt-2">
                                            <Link href={`/product/${sliderProducts[card2Index].slug}`} className="flex-1 max-w-[120px]">
                                                <Button size="sm" className="w-full h-7 sm:h-9 text-[9px] sm:text-xs font-black uppercase rounded-xl bg-gray-900 text-white hover:bg-rose-600 shadow-xl border-none transition-all active:scale-95 group-hover:shadow-rose-200/50">
                                                    Grab It
                                                </Button>
                                            </Link>
                                            <div className="flex gap-1 sm:gap-1.5 h-1 items-center">
                                                {sliderProducts.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-0.5 sm:h-1 rounded-full transition-all duration-500 ${card2Index === i ? "bg-rose-600 w-3 sm:w-6" : "bg-rose-200 w-1 sm:w-1.5"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Background Decorative Elements */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-300/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-400/20 transition-colors duration-700"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:translate-x-10"></div>
                            </div>
                        ) : (
                            /* Fallback: Premium 99 kr Special Offers */
                            <Link href="/deals" className="group h-full block p-4 sm:p-6 text-center relative z-10">
                                <div className="relative z-10 flex flex-col h-full justify-center space-y-4">
                                    <span className="inline-block mx-auto px-3 py-1 bg-white/60 backdrop-blur-md text-rose-600 text-[10px] xl:text-xs font-black rounded-full uppercase tracking-widest shadow-sm border border-white/40">
                                        Limited Time
                                    </span>
                                    <div className="space-y-0 sm:space-y-1">
                                        <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-rose-600 drop-shadow-sm tracking-tighter">99 kr</h3>
                                        <p className="text-[10px] sm:text-lg xl:text-xl font-black text-gray-900 uppercase tracking-tight">Mega Offers</p>
                                    </div>
                                    <Button size="sm" className="w-full max-w-[140px] h-8 sm:h-11 rounded-2xl bg-gray-900 text-white hover:bg-rose-600 font-black px-6 shadow-2xl border-none self-center transition-all hover:-translate-y-1">
                                        Discover All
                                    </Button>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Card 4: Dynamic Delivery Slider - Redesigned for Maximum Impact */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F0FFF4] to-[#E0FFE9] aspect-square text-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 border border-emerald-100 group">
                        <div className="relative h-full flex flex-col">
                            <AnimatePresence mode="wait">
                                {card3Index === 0 ? (
                                    <motion.div
                                        key="stockholm"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="p-4 sm:p-6 xl:p-8 flex flex-col h-full justify-between items-center text-center relative z-10"
                                    >
                                        <div className="space-y-3 sm:space-y-5 w-full flex-1 flex flex-col justify-center">
                                            <div className="relative mx-auto">
                                                <div className="p-3 sm:p-5 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-emerald-200/50 group-hover:rotate-12 transition-transform duration-500">
                                                    <Truck className="h-6 w-6 sm:h-10 sm:w-10 text-emerald-600" strokeWidth={2.5} />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-5 sm:h-5 bg-rose-500 rounded-full border-2 sm:border-4 border-white animate-pulse"></div>
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <span className="text-[8px] sm:text-[10px] font-black uppercase text-emerald-700 tracking-[0.2em]">Stockholm Area</span>
                                                <h3 className="text-sm sm:text-xl lg:text-2xl xl:text-3xl font-black leading-[1.1] text-gray-900">
                                                    Same-Day <br />Fast Delivery
                                                </h3>
                                            </div>

                                            <div className="flex justify-center pt-1">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-2xl text-[9px] sm:text-xs font-black uppercase shadow-lg shadow-emerald-700/20">
                                                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                                                    Free Over 500 kr
                                                </div>
                                            </div>
                                        </div>

                                        <Link href="/delivery-information" className="w-full mt-4">
                                            <Button size="sm" className="w-full h-8 sm:h-11 xl:h-12 text-[10px] sm:text-sm font-black uppercase rounded-2xl bg-gray-900 text-white hover:bg-emerald-600 shadow-xl border-none transition-all active:scale-95">
                                                Book a Slot
                                            </Button>
                                        </Link>
                                    </motion.div>
                                ) : card3Index === 1 ? (
                                    <motion.div
                                        key="europe"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="p-4 sm:p-6 xl:p-8 flex flex-col h-full justify-between items-center text-center relative z-10"
                                    >
                                        <div className="space-y-3 sm:space-y-5 w-full flex-1 flex flex-col justify-center text-center">
                                            <div className="p-3 sm:p-5 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-emerald-200/50 group-hover:-rotate-12 transition-transform duration-500 mx-auto">
                                                <Globe className="h-6 w-6 sm:h-10 sm:w-10 text-emerald-600" strokeWidth={2.5} />
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <span className="text-[8px] sm:text-[10px] font-black uppercase text-emerald-700 tracking-[0.2em]">EU Shipping</span>
                                                <h3 className="text-sm sm:text-xl lg:text-2xl xl:text-3xl font-black leading-[1.1] text-gray-900">
                                                    Home Tastes <br />EU-Wide
                                                </h3>
                                                <p className="text-[9px] sm:text-xs lg:text-sm text-gray-600 font-bold max-w-[180px] mx-auto opacity-80">
                                                    Safe & tracked shipping to all EU countries.
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                                {['NOR', 'FIN', 'DEN', 'GER'].map((country) => (
                                                    <span key={country} className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/80 border border-emerald-100 rounded-lg text-[8px] sm:text-[10px] font-black text-gray-700 shadow-sm">
                                                        {country}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Link href="/europe-delivery" className="w-full mt-4">
                                            <Button size="sm" className="w-full h-8 sm:h-11 xl:h-12 text-[10px] sm:text-sm font-black uppercase rounded-2xl bg-gray-900 text-white hover:bg-emerald-600 shadow-xl border-none transition-all active:scale-95">
                                                Shipping Rates
                                            </Button>
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="delivery-post"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative h-full w-full overflow-hidden"
                                    >
                                        <Image
                                            src="https://crm.ideallivs.com/wp-content/uploads/2026/01/Delivey-Post-scaled-e1768345875656.jpg"
                                            alt="Ideal Livs Delivery Schedule"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <Link href="/delivery-information" className="w-full">
                                                <Button size="sm" className="w-full h-9 sm:h-11 text-xs sm:text-sm rounded-2xl bg-white text-emerald-600 hover:bg-emerald-50 font-black uppercase shadow-2xl border-none">
                                                    View Schedule
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Modern Pagination Dots for Card 4 */}
                            <div className="absolute bottom-2 sm:bottom-4 right-1/2 translate-x-1/2 flex gap-1.5 z-20">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-500 ${card3Index === i ? "bg-emerald-600 w-4 sm:w-6" : "bg-emerald-200 w-1.5"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Background Decorative Sparkles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
