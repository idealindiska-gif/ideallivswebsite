import type { Metadata } from 'next';
import { brandProfile } from '@/config/brand-profile';
import { Truck, Package, Clock, ShieldCheck, MapPin, ExternalLink, Globe, Info, ShoppingBag } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { SchemaScript } from "@/lib/schema/schema-script";
import { stockholmDeliveryServiceSchema, deliveryFAQSchema } from "@/lib/schema";
import { GoogleMapCompact } from "@/components/shared/google-map";
import { getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo/metadata';
import { swedishMeta } from '@/lib/seo/swedish-meta';

// ISR: Revalidate static pages every 24 hours
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'sv') {
    const svMeta = swedishMeta['/delivery-information'];
    return {
      title: svMeta.title,
      description: svMeta.description,
      alternates: getAlternates('/delivery-information'),
    };
  }

  return {
    title: "Free Grocery Delivery Stockholm & All Sweden | Ideal Indiska Livs",
    description: "Authentic Indian & Pakistani groceries with FAST delivery. Free in Stockholm on orders over 500 SEK. Same-day evening delivery in Bandhagen & southern suburbs.",
    alternates: getAlternates('/delivery-information'),
  };
}

export default async function DeliveryInformationPage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations('delivery');
    const tc = await getTranslations('common');

    return (
        <main className="min-h-screen bg-background">
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
                                    {t('welcomeText')}
                                </p>
                                <p>
                                    {t('introText')}
                                </p>
                            </section>

                            {/* Stockholm Delivery Options */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <MapPin className="h-6 w-6 text-primary" />
                                    {t('stockholmTitle')}
                                </h2>
                                <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
                                    {t('stockholmSubtitle')}
                                </p>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-3">{t('localDeliveryTitle')}</h3>
                                        <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                            <p>{t('localDeliveryIntro')}</p>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li><strong>{t('freeDelivery')}</strong></li>
                                                <li><strong>{t('standardDelivery')}</strong></li>
                                                <li><strong>{t('minimumOrder')}</strong></li>
                                            </ul>

                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="font-semibold text-foreground mb-2">{t('coverageTitle')}</h4>
                                                <p>{t('coverageText')}</p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="font-semibold text-foreground mb-2">{t('sameDayTitle')}</h4>
                                                <p>{t('sameDayText')}</p>
                                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                                    <li><strong>{t('sameDayAreas')}</strong></li>
                                                    <li><strong>{t('sameDaySchedule')}</strong></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl border bg-card/50">
                                        <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-3">{t('dhlStockholmTitle')}</h3>
                                        <p className="text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                            {t('dhlStockholmText')}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Rest of Sweden */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-primary" />
                                    {t('swedenTitle')}
                                </h2>
                                <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
                                    {t('swedenSubtitle')}
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-muted/20 border">
                                        <p className="font-semibold" style={{ fontSize: '15.13px' }}>{t('reliablePartner')}</p>
                                        <p className="text-sm text-muted-foreground">{t('reliablePartnerDesc')}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/20 border">
                                        <p className="font-semibold" style={{ fontSize: '15.13px' }}>{t('calculatedRates')}</p>
                                        <p className="text-sm text-muted-foreground">{t('calculatedRatesDesc')}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Local Pickup */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <ShoppingBag className="h-6 w-6 text-primary" />
                                    {t('pickupTitle')}
                                </h2>
                                <div className="p-6 rounded-xl border bg-card/50">
                                    <div className="space-y-4 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                                        <p>{t('pickupText')}</p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>{t('pickupCost')}</strong></li>
                                            <li><strong>{t('pickupLocation')}</strong></li>
                                            <li><strong>{t('pickupHow')}</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Our Commitment */}
                            <section className="p-8 rounded-2xl bg-muted/20 border">
                                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-4">{t('commitmentTitle')}</h2>
                                <p style={{ fontSize: '16px' }} className="text-muted-foreground">
                                    {t('commitmentText')}
                                </p>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Delivery Schedule */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('schedule')}</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('monSunDelivery')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('deliverySlots')}</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('cutoff')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('cutoffDesc')}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Quick Links */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('regionalDetails')}</h3>
                                    <div className="space-y-2">
                                        <Link href="/delivery-goteborg-malmo" className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-sm">
                                            Göteborg & Malmö <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <Link href="/europe-delivery" className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-sm">
                                            European Shipping <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Store Location Map */}
                                <div className="bg-card">
                                    <GoogleMapCompact />
                                    <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                                        <p className="text-xs text-center text-muted-foreground">
                                            {t('pickupFrom')} {brandProfile.address.street}, {brandProfile.address.postalCode} {brandProfile.address.area}
                                        </p>
                                    </div>
                                </div>

                                {/* Support */}
                                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('deliveryHelp')}</h3>
                                    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">{t('deliveryHelpDesc')}</p>
                                    <a href="https://wa.me/46728494801" className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                                        {tc('chatNow')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="delivery-service-schema"
                schema={stockholmDeliveryServiceSchema()}
            />
            <SchemaScript
                id="delivery-faq-schema"
                schema={deliveryFAQSchema()}
            />
        </main>
    );
}
