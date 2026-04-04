import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { brandProfile } from '@/config/brand-profile';
import { getAlternates } from '@/lib/seo/metadata';
import { Truck, Package, Clock, ShieldCheck, MessageCircle, ExternalLink, Info, AlertCircle } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { SchemaScript } from '@/lib/schema/schema-script';
import { norwayDeliveryServiceSchema } from '@/lib/schema';
import { GoogleMapCompact } from "@/components/shared/google-map";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'norwayDelivery' });

    return {
        title: `${t('title')} | Ideal Indiska LIVS`,
        description: t('subtitle'),
        alternates: getAlternates('/norway-delivery', locale),
    };
}

export default async function NorwayDeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'norwayDelivery' });
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

                            {/* Shipping Overview */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-primary" />
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

                            {/* Shipping Methods */}
                            <section className="space-y-6">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                                    <Package className="h-6 w-6 text-primary" />
                                    {t('methodsTitle')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-6 rounded-xl border bg-muted/5 items-start">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Truck className="w-5 h-5 text-primary" />
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

                            {/* Customs Note */}
                            <section className="p-6 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                                <div className="flex gap-3 items-start">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-1 text-amber-900 dark:text-amber-200">{t('customsTitle')}</h3>
                                        <p style={{ fontSize: '15.13px' }} className="text-amber-800 dark:text-amber-300">{t('customsText')}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Shipping Info */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-4">{t('shippingInfo')}</h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                                            <div>
                                                <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('estimatedTime')}</p>
                                                <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('estimatedTimeDesc')}</p>
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
                                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('norwaySupport')}</h3>
                                    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">{t('norwaySupportDesc')}</p>
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

            {/* FAQ Section */}
            <section className="py-12 border-t">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                        {locale === 'no' ? 'Vanlige spørsmål — Levering til Norge' : locale === 'sv' ? 'Vanliga frågor — Leverans till Norge' : 'FAQ — Delivery to Norway'}
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: locale === 'no' ? 'Leverer dere indiske dagligvarer til Norge?' : locale === 'sv' ? 'Levererar ni indiska livsmedel till Norge?' : 'Do you deliver Indian groceries to Norway?',
                                a: locale === 'no' ? 'Ja. Vi leverer til hele Norge via DHL fra vårt lager i Bandhagen, Stockholm. Forventet leveringstid er 2–4 virkedager.' : locale === 'sv' ? 'Ja. Vi levererar till hela Norge via DHL från vårt lager i Bandhagen, Stockholm. Förväntad leveranstid är 2–4 arbetsdagar.' : 'Yes. We deliver to all of Norway via DHL from our warehouse in Bandhagen, Stockholm. Estimated delivery time is 2–4 business days.',
                            },
                            {
                                q: locale === 'no' ? 'Hva er minimumsordren for levering til Norge?' : locale === 'sv' ? 'Vad är minimibeställningen för leverans till Norge?' : 'What is the minimum order for delivery to Norway?',
                                a: locale === 'no' ? 'Det er ingen minimumsordre for DHL-levering til Norge. Du kan bestille for akkurat det beløpet du ønsker.' : locale === 'sv' ? 'Det finns ingen minimibeställning för DHL-leverans till Norge. Du kan beställa för precis det belopp du önskar.' : 'There is no minimum order for DHL delivery to Norway. You can order for exactly the amount you need.',
                            },
                            {
                                q: locale === 'no' ? 'Må jeg betale toll på indiske dagligvarer bestilt fra Sverige til Norge?' : locale === 'sv' ? 'Måste jag betala tull för indiska livsmedel beställda från Sverige till Norge?' : 'Do I pay customs duties on Indian groceries ordered from Sweden to Norway?',
                                a: locale === 'no' ? 'Norge er utenfor EU, så norsk tollregelverk gjelder. Sendinger under NOK 350 er som regel tollfrie. For større ordrer kan toll og MVA påløpe. Se tolletaten.no for gjeldende grenser.' : locale === 'sv' ? 'Norge ligger utanför EU, så norska tullregler gäller. Försändelser under NOK 350 är vanligtvis tullfria. För större beställningar kan tull och moms tillkomma.' : 'Norway is outside the EU, so Norwegian customs rules apply. Shipments below NOK 350 are typically duty-free. For larger orders, customs duties and VAT may apply. Check tolletaten.no for current thresholds.',
                            },
                            {
                                q: locale === 'no' ? 'Hvilke indiske merkevarer kan jeg bestille til Norge?' : locale === 'sv' ? 'Vilka indiska märken kan jag beställa till Norge?' : 'Which Indian brands can I order to Norway?',
                                a: locale === 'no' ? 'Du kan bestille fra 150+ merkevarer inkludert India Gate, Shan, National Foods, Haldiram\'s, MDH, Ashoka, Rooh Afza, Gits og MTR. Hele sortimentet på 1500+ produkter er tilgjengelig på ideallivs.com.' : locale === 'sv' ? 'Du kan beställa från 150+ varumärken inklusive India Gate, Shan, National Foods, Haldiram\'s, MDH, Ashoka, Rooh Afza, Gits och MTR.' : 'You can order from 150+ brands including India Gate, Shan, National Foods, Haldiram\'s, MDH, Ashoka, Rooh Afza, Gits, and MTR. The full range of 1,500+ products is available at ideallivs.com.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="border rounded-xl p-5 bg-card">
                                <p className="font-bold text-foreground text-sm mb-2">{item.q}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="norway-delivery-schema"
                schema={norwayDeliveryServiceSchema()}
            />
            <SchemaScript
                id="norway-delivery-faq-schema"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                        { '@type': 'Question', name: 'Do you deliver Indian groceries to Norway?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We deliver to all of Norway via DHL from our warehouse in Bandhagen, Stockholm. Estimated delivery time is 2–4 business days.' } },
                        { '@type': 'Question', name: 'What is the minimum order for delivery to Norway?', acceptedAnswer: { '@type': 'Answer', text: 'There is no minimum order for DHL delivery to Norway. You can order for exactly the amount you need.' } },
                        { '@type': 'Question', name: 'Do I pay customs duties on Indian groceries ordered from Sweden to Norway?', acceptedAnswer: { '@type': 'Answer', text: 'Norway is outside the EU, so Norwegian customs rules apply. Shipments below NOK 350 are typically duty-free. For larger orders, customs duties and VAT may apply.' } },
                        { '@type': 'Question', name: 'Which Indian brands can I order to Norway?', acceptedAnswer: { '@type': 'Answer', text: 'You can order from 150+ brands including India Gate, Shan, National Foods, Haldiram\'s, MDH, Ashoka, Rooh Afza, Gits, and MTR. The full range of 1,500+ products is available at ideallivs.com.' } },
                    ],
                }}
            />
        </main>
    );
}
