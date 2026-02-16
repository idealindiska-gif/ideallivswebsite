import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { brandProfile } from '@/config/brand-profile';
import { getAlternates } from '@/lib/seo/metadata';
import { Truck, MapPin, Package, Clock, Euro, ShieldCheck, Globe, MessageCircle, Mail, ExternalLink, Info } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { SchemaScript } from '@/lib/schema/schema-script';
import { europeDeliveryServiceSchema } from '@/lib/schema';
import { GoogleMapCompact } from "@/components/shared/google-map";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'europeDelivery' });

    return {
        title: `${t('title')} | Ideal Indiska LIVS`,
        description: t('subtitle'),
        alternates: getAlternates('/europe-delivery'),
    };
}

export default async function EuropeDeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'europeDelivery' });
    const tc = await getTranslations({ locale, namespace: 'common' });

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b">
                <div className="container mx-auto px-4 py-16 md:py-20 text-center md:text-left">
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

            {/* Main Content & Sidebar */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content Area (2/3) */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Introduction */}
                            <section className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground" style={{
                                fontSize: '16px',
                                fontWeight: 400,
                                lineHeight: 1.52,
                                letterSpacing: '0.03em'
                            }}>
                                <p className="text-foreground font-medium" style={{ fontSize: '18px' }}>
                                    {t('introHighlight')}
                                </p>
                                <p>
                                    {t('introText')}
                                </p>
                            </section>

                            {/* European Shipping Overview */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Globe className="h-6 w-6 text-primary" />
                                    {t('overviewTitle')}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('noMinimumOrder')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('noMinimumOrderDesc')}</p>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('calculatedRates')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('calculatedRatesDesc')}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Countries We Serve */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <MapPin className="h-6 w-6 text-primary" />
                                    {t('countriesTitle')}
                                </h2>
                                <div className="p-6 rounded-xl border bg-card/50 text-muted-foreground">
                                    <p className="mb-4" style={{ fontSize: '15.13px' }}>{t('countriesIntro')}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                                        {[
                                            "Germany", "France", "Netherlands", "Belgium", "Denmark",
                                            "Finland", "Norway", "Austria", "Italy", "Spain",
                                            "Portugal", "Poland", "Ireland", "Luxembourg"
                                        ].map((country, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {country}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-xs italic">{t('countriesNote')}</p>
                                </div>
                            </section>

                            {/* DHL Service Options */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-primary" />
                                    {t('methodsTitle')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-1">{t('dhlParcel')}</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('dhlParcelDesc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-1">{t('insuredTracked')}</h3>
                                            <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('insuredTrackedDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Shipping Estimator Info */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('shippingInfo')}</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('estimatedTime')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">
                                                    {t('estimatedTimeDesc').split('\n').map((line, i, arr) => (
                                                        <span key={i}>
                                                            {line}
                                                            {i < arr.length - 1 && <br />}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Info className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('perishables')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('perishablesDesc')}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Store Location Map */}
                                <div className="bg-card">
                                    <GoogleMapCompact />
                                    <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                                        <p className="text-xs text-center text-muted-foreground">
                                            {t('shippingFrom')} {brandProfile.address.street}, {brandProfile.address.postalCode} {brandProfile.address.area}
                                        </p>
                                    </div>
                                </div>

                                {/* WhatsApp Help */}
                                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('europeanSupport')}</h3>
                                    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">{t('europeanSupportDesc')}</p>
                                    <a href="https://wa.me/46728494801" className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                                        {t('whatsappInquiries')}
                                    </a>
                                </div>

                                {/* Shop CTA */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('readyToOrder')}</h3>
                                    <Link href="/shop" className="text-primary hover:underline text-sm flex items-center justify-between">
                                        {tc('startShopping')} <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="europe-delivery-schema"
                schema={europeDeliveryServiceSchema()}
            />
        </main>
    );
}
