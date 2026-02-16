'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function SeoContent() {
    const t = useTranslations('seo');
    return (
        <section className="w-full py-16 border-t border-border/50">
            <div className="container-wide mx-auto px-[var(--container-padding)]">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                            {t('premierDestination')}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {t('seoP1')}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            {t('seoP2')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm space-y-4"
                    >
                        <h3 className="text-xl font-bold font-heading">{t('whyChooseUs')}</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                                <p className="text-sm text-muted-foreground">{t('unmatchedFreshness')}</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                                <p className="text-sm text-muted-foreground">{t('europeanDelivery')}</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                                <p className="text-sm text-muted-foreground">{t('customerFirst')}</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
                                <p className="text-sm text-muted-foreground">{t('secureOnline')}</p>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
