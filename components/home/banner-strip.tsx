"use client";

import Link from "next/link";
import { ArrowRight, Moon, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BannerStrip() {
    return (
        <section className="w-full py-6 md:py-8">
            <div className="container-wide mx-auto px-[var(--container-padding)]">
                <Link href="/deals" className="block group relative overflow-hidden rounded-2xl">
                    {/* Background with Ramadan theme */}
                    <div className="relative bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-8 sm:py-10 md:py-12 px-5 sm:px-8 md:px-12">

                        {/* Decorative Islamic Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Floating Stars Decoration */}
                        <div className="absolute top-4 left-[10%] text-yellow-400/30">
                            <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        </div>
                        <div className="absolute top-6 left-[25%] text-yellow-400/20">
                            <Star className="w-2 h-2 md:w-3 md:h-3 fill-current" />
                        </div>
                        <div className="absolute bottom-4 left-[15%] text-yellow-400/25">
                            <Star className="w-2 h-2 fill-current" />
                        </div>
                        <div className="absolute top-5 right-[30%] text-yellow-400/20">
                            <Star className="w-2 h-2 md:w-3 md:h-3 fill-current" />
                        </div>
                        <div className="absolute bottom-6 right-[20%] text-yellow-400/30">
                            <Star className="w-3 h-3 fill-current" />
                        </div>

                        {/* Glowing Orb Effect */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-32 h-32 md:w-48 md:h-48 bg-yellow-500/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-[5%] w-24 h-24 md:w-32 md:h-32 bg-purple-500/10 rounded-full blur-3xl" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                            {/* Left: Crescent Moon Icon */}
                            <div className="hidden md:flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-150" />
                                    <div className="relative p-4 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full border border-yellow-400/30">
                                        <Moon className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Center: Main Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <Moon className="w-4 h-4 text-yellow-400 md:hidden" />
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3" />
                                        Coming Soon
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 leading-tight">
                                    Ramadan Mega Savings
                                </h2>

                                <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                                    Get ready for exclusive discounts on dates, spices, rice & all your Ramadan essentials.
                                    <span className="text-yellow-400 font-semibold"> Big deals arriving soon!</span>
                                </p>
                            </div>

                            {/* Right: CTA */}
                            <div className="flex flex-col items-center gap-2">
                                <Button
                                    className="h-10 md:h-11 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 md:px-8 shadow-lg shadow-yellow-500/25 group-hover:shadow-yellow-500/40 transition-all"
                                >
                                    Notify Me
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <span className="text-white/50 text-[10px] md:text-xs">
                                    Be the first to know
                                </span>
                            </div>
                        </div>

                        {/* Bottom Decorative Border */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
