"use client";

import Image from "next/image";
import { Link } from "@/lib/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export function BannerStrip() {
    const t = useTranslations('banner');
    return (
        <section className="w-full py-6 md:py-8">
            <div className="container-wide mx-auto px-[var(--container-padding)]">
                <Link href="/deals" className="block group relative overflow-hidden rounded-2xl">
                    {/* Background: Eid theme – deep teal/gold */}
                    <div className="relative overflow-hidden py-8 sm:py-10 md:py-12 px-5 sm:px-8 md:px-12"
                        style={{
                            background: 'linear-gradient(135deg, #0a2e1a 0%, #0d3d2a 25%, #1a3a0a 50%, #2e1a00 80%, #0a2e1a 100%)',
                        }}
                    >
                        {/* Decorative radial glows – Eid gold & green palette */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-[5%] w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-[20%] w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
                            <div className="absolute top-0 right-[5%] w-36 h-36 bg-yellow-300/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-[45%] w-40 h-40 bg-green-600/20 rounded-full blur-3xl" />
                        </div>

                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-black/25" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

                            {/* Left: Eid crescent moon icon */}
                            <div className="hidden md:flex items-center justify-center shrink-0">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-amber-300/30 to-emerald-400/40 rounded-full blur-xl scale-150" />
                                    <div className="relative p-4 bg-gradient-to-br from-yellow-500/20 via-amber-400/15 to-emerald-500/20 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                                        <span className="text-4xl leading-none select-none">☪️</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Main Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                                        style={{ background: 'linear-gradient(90deg, #d97706, #15803d)', color: '#fff' }}>
                                        <Sparkles className="w-3 h-3" />
                                        {t('eidTag')}
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 leading-tight"
                                    style={{
                                        background: 'linear-gradient(90deg, #fcd34d, #86efac, #fbbf24, #d1fae5)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>
                                    {t('eidTitle')}
                                </h2>

                                <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                                    {t('eidDesc')}
                                    <span className="font-semibold" style={{ color: '#fcd34d' }}> {t('eidHighlight')}</span>
                                </p>
                            </div>

                            {/* Right: CTA */}
                            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                                <Button
                                    className="h-10 md:h-11 w-full rounded-full font-bold px-5 md:px-7 shadow-lg transition-all hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(90deg, #d97706, #92400e)',
                                        color: '#fff',
                                        boxShadow: '0 4px 20px rgba(217,119,6,0.45)',
                                    }}
                                >
                                    {t('eidCta')}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        {/* Bottom gold-green border */}
                        <div className="absolute bottom-0 left-0 right-0 h-1"
                            style={{ background: 'linear-gradient(90deg, #d97706, #fcd34d, #15803d, #86efac, #d97706)' }} />
                    </div>
                </Link>
            </div>
        </section>
    );
}
