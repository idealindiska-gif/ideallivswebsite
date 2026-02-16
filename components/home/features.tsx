'use client';

import { Truck, ShieldCheck, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const featureIcons = [Truck, Award, ShieldCheck, Clock];
const featureKeys = ['freeDelivery', 'halalCertified', 'authenticBrands', 'freshProduce'] as const;

export function Features() {
    const t = useTranslations('features');
    return (
        <section className="w-full py-12 bg-muted/30">
            <div className="container-wide mx-auto px-[var(--container-padding)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featureKeys.map((key, index) => {
                        const Icon = featureIcons[index];
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
                            >
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold font-heading">{t(key)}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t(`${key}Desc`)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
