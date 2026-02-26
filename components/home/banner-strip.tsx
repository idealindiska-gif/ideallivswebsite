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
                <div className="block group relative overflow-hidden rounded-2xl">
                    {/* Background: Holi Colours */}
                    <div className="relative overflow-hidden py-8 sm:py-10 md:py-12 px-5 sm:px-8 md:px-12"
                        style={{
                            background: 'linear-gradient(135deg, #1a0533 0%, #2d0a5e 20%, #0d1f5c 50%, #0a3d2e 80%, #1a0533 100%)',
                        }}
                    >
                        {/* Holi background image */}
                        <div className="absolute inset-0">
                            <Image
                                src="/images/holi-banner.png"
                                alt="Holi festival colors"
                                fill
                                className="object-cover mix-blend-screen opacity-60"
                                priority={false}
                            />
                        </div>

                        {/* Extra colorful radial blobs for vibrancy */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-[5%] w-40 h-40 bg-pink-500/30 rounded-full blur-3xl" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-[20%] w-48 h-48 bg-orange-500/30 rounded-full blur-3xl" />
                            <div className="absolute top-0 right-[5%] w-36 h-36 bg-yellow-400/25 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-[45%] w-40 h-40 bg-purple-500/25 rounded-full blur-3xl" />
                        </div>

                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

                            {/* Left: Holi Icon */}
                            <div className="hidden md:flex items-center justify-center shrink-0">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/40 via-yellow-400/30 to-cyan-400/40 rounded-full blur-xl scale-150" />
                                    <div className="relative p-4 bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-cyan-500/30 rounded-full border border-white/20 backdrop-blur-sm">
                                        {/* Holi colours emoji representation via layered circles */}
                                        <div className="flex gap-1">
                                            {['bg-pink-400', 'bg-yellow-400', 'bg-cyan-400', 'bg-orange-400', 'bg-purple-400'].map((color, i) => (
                                                <span
                                                    key={i}
                                                    className={`block w-3 h-3 rounded-full ${color} shadow-lg`}
                                                    style={{ transform: `translateY(${i % 2 === 0 ? '-3px' : '3px'})` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Main Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                                        style={{ background: 'linear-gradient(90deg, #f72585, #7209b7, #3a86ff)', color: '#fff' }}>
                                        <Sparkles className="w-3 h-3" />
                                        {t('holiTag')}
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 leading-tight"
                                    style={{
                                        background: 'linear-gradient(90deg, #ff9ff3, #ffd32a, #00d2d3, #ff9f43)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>
                                    {t('holiTitle')}
                                </h2>

                                <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                                    {t('holiDesc')}
                                    <span className="font-semibold" style={{ color: '#ffd32a' }}> {t('holiHighlight')}</span>
                                </p>
                            </div>

                            {/* Right: Two product CTAs */}
                            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                                <Link href="/product/5243" className="block">
                                    <Button
                                        className="h-10 md:h-11 w-full rounded-full font-bold px-5 md:px-7 shadow-lg transition-all hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(90deg, #f72585, #b5179e)',
                                            color: '#fff',
                                            boxShadow: '0 4px 20px rgba(247,37,133,0.4)',
                                        }}
                                    >
                                        {t('product1Cta')}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/product/5236" className="block">
                                    <Button
                                        className="h-10 md:h-11 w-full rounded-full font-bold px-5 md:px-7 shadow-lg transition-all hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(90deg, #3a86ff, #00d2d3)',
                                            color: '#fff',
                                            boxShadow: '0 4px 20px rgba(58,134,255,0.4)',
                                        }}
                                    >
                                        {t('product2Cta')}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Bottom rainbow border */}
                        <div className="absolute bottom-0 left-0 right-0 h-1"
                            style={{ background: 'linear-gradient(90deg, #f72585, #ffd32a, #00d2d3, #ff9f43, #3a86ff, #f72585)' }} />
                    </div>
                </div>
            </div>
        </section>
    );
}
