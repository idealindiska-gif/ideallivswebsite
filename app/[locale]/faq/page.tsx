import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { SchemaScript } from "@/lib/schema/schema-script";
import { idealIndiskaFAQSchema } from "@/lib/schema/faq";
import { getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'faq' });

    return {
        title: `${t('title')} | Ideal Indiska LIVS`,
        description: t('subtitle'),
        alternates: getAlternates('/faq'),
    };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'faq' });
    const tc = await getTranslations({ locale, namespace: 'common' });
    const tContact = await getTranslations({ locale, namespace: 'contact' });

    const faqs = [
        {
            category: t('cat1'),
            questions: [
                { q: t('cat1q1'), a: t('cat1a1') },
                { q: t('cat1q2'), a: t('cat1a2') },
                { q: t('cat1q3'), a: t('cat1a3') },
                { q: t('cat1q4'), a: t('cat1a4') },
                { q: t('cat1q5'), a: t('cat1a5') },
            ]
        },
        {
            category: t('cat2'),
            questions: [
                { q: t('cat2q1'), a: t('cat2a1') },
                { q: t('cat2q2'), a: t('cat2a2') },
                { q: t('cat2q3'), a: t('cat2a3') },
                { q: t('cat2q4'), a: t('cat2a4') },
                { q: t('cat2q5'), a: t('cat2a5') },
            ]
        },
        {
            category: t('cat3'),
            questions: [
                { q: t('cat3q1'), a: t('cat3a1') },
                { q: t('cat3q2'), a: t('cat3a2') },
                { q: t('cat3q3'), a: t('cat3a3') },
                { q: t('cat3q4'), a: t('cat3a4') },
                { q: t('cat3q5'), a: t('cat3a5') },
            ]
        },
        {
            category: t('cat4'),
            questions: [
                { q: t('cat4q1'), a: t('cat4a1') },
            ]
        },
        {
            category: t('cat5'),
            questions: [
                { q: t('cat5q1'), a: t('cat5a1') },
                { q: t('cat5q2'), a: t('cat5a2') },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 style={{
                            fontSize: '31.25px',
                            fontWeight: 700,
                            lineHeight: 1.47,
                            letterSpacing: '0.02em'
                        }} className="mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-muted-foreground" style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: 1.52,
                            letterSpacing: '0.03em'
                        }}>
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* FAQ Categories */}
                        <div className="lg:col-span-2">
                            <div className="space-y-12">
                                {faqs.map((category, idx) => (
                                    <div key={idx}>
                                        <h2 style={{
                                            fontSize: '25px',
                                            fontWeight: 600,
                                            lineHeight: 1.47,
                                            letterSpacing: '0.02em'
                                        }} className="mb-6">
                                            {category.category}
                                        </h2>
                                        <Accordion type="single" collapsible className="space-y-4">
                                            {category.questions.map((faq, qIdx) => (
                                                <AccordionItem
                                                    key={qIdx}
                                                    value={`${idx}-${qIdx}`}
                                                    className="border rounded-lg px-6 bg-card"
                                                >
                                                    <AccordionTrigger className="text-left hover:no-underline py-4">
                                                        <span style={{
                                                            fontSize: '16px',
                                                            fontWeight: 500,
                                                            lineHeight: 1.52,
                                                            letterSpacing: '0.03em'
                                                        }}>{faq.q}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground pb-4" style={{
                                                        fontSize: '16px',
                                                        fontWeight: 400,
                                                        lineHeight: 1.52,
                                                        letterSpacing: '0.03em'
                                                    }}>
                                                        {faq.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar - Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{
                                        fontSize: '18.91px',
                                        fontWeight: 500,
                                        lineHeight: 1.52,
                                        letterSpacing: '0.03em'
                                    }} className="mb-4">
                                        {t('stillHaveQuestions')}
                                    </h3>
                                    <p className="text-muted-foreground mb-6" style={{
                                        fontSize: '13.53px',
                                        fontWeight: 400,
                                        lineHeight: 1.57,
                                        letterSpacing: '0.03em'
                                    }}>
                                        {t('stillHaveQuestionsDesc')}
                                    </p>
                                    <div className="space-y-4">
                                        <a
                                            href="https://wa.me/46728494801"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                        >
                                            <MessageCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p style={{
                                                    fontSize: '13.53px',
                                                    fontWeight: 500,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>{tc('whatsapp')}</p>
                                                <p className="text-muted-foreground" style={{
                                                    fontSize: '12.8px',
                                                    fontWeight: 300,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>{tc('chatWithUsInstantly')}</p>
                                            </div>
                                        </a>
                                        <a
                                            href="mailto:info@ideallivs.com"
                                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                        >
                                            <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p style={{
                                                    fontSize: '13.53px',
                                                    fontWeight: 500,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>{tc('email')}</p>
                                                <p className="text-muted-foreground" style={{
                                                    fontSize: '12.8px',
                                                    fontWeight: 300,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>info@ideallivs.com</p>
                                            </div>
                                        </a>
                                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                                            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p style={{
                                                    fontSize: '13.53px',
                                                    fontWeight: 500,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>{tc('visitStore')}</p>
                                                <p className="text-muted-foreground" style={{
                                                    fontSize: '12.8px',
                                                    fontWeight: 300,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>
                                                    Bandhagsplan 4<br />
                                                    12432 Bandhagen Centrum<br />
                                                    Stockholm
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-6 bg-muted/30">
                                    <h3 style={{
                                        fontSize: '18.91px',
                                        fontWeight: 500,
                                        lineHeight: 1.52,
                                        letterSpacing: '0.03em'
                                    }} className="mb-2">
                                        {tc('newCustomer')}
                                    </h3>
                                    <p className="text-muted-foreground mb-4" style={{
                                        fontSize: '13.53px',
                                        fontWeight: 400,
                                        lineHeight: 1.57,
                                        letterSpacing: '0.03em'
                                    }}>
                                        {tContact('newCustomerDesc')}
                                    </p>
                                    <Link
                                        href="/shop"
                                        className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                        style={{
                                            fontSize: '13.53px',
                                            fontWeight: 500,
                                            lineHeight: 1.57,
                                            letterSpacing: '0.03em'
                                        }}
                                    >
                                        {tc('startShopping')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="faq-page-schema"
                schema={idealIndiskaFAQSchema()}
            />
        </div>
    );
}
