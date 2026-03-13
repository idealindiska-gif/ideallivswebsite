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

// ─── Delivery FAQ data ─────────────────────────────────────────────────────────

const deliveryFaqsEn = [
    { q: 'How does delivery work in Stockholm?', a: 'We offer local delivery across all of Stockholm. A delivery fee applies to all orders. The minimum order is 300 SEK. Visit our Delivery Information page for current pricing details.' },
    { q: 'How fast is same-day delivery?', a: 'Same-day delivery is available to Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge, Solna, and Sundbyberg. Place your order before 4 PM (16:00) for same-day delivery.' },
    { q: 'Do you deliver outside Stockholm?', a: 'Yes. We deliver to all of Sweden and across Europe via DHL. No customs duties apply within the EU. Rates are calculated at checkout based on your location and order weight.' },
    { q: 'Can I pick up my order from the store?', a: 'Yes. Free in-store pickup is available at Bandhagsplan 4, 124 32 Bandhagen, Stockholm. Select "Store Pickup" at checkout and we will prepare your order.' },
    { q: 'What payment methods do you accept for online orders?', a: 'We accept Visa, Mastercard, Klarna, Swish, Apple Pay, Google Pay, and Cash on delivery for local Stockholm orders.' },
];

const deliveryFaqsSv = [
    { q: 'Hur fungerar leveransen i Stockholm?', a: 'Vi erbjuder lokalleverans i hela Stockholm. Leveransavgift tillkommer på alla beställningar. Minimibeställning är 300 kr. Besök vår leveransinformationssida för aktuell prisinformation.' },
    { q: 'Hur snabb är samma-dagleveransen?', a: 'Samma-dagleverans finns till Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge, Solna och Sundbyberg. Lägg din beställning före kl. 16:00 för leverans samma dag.' },
    { q: 'Levererar ni utanför Stockholm?', a: 'Ja. Vi levererar till hela Sverige och Europa via DHL. Inga tullavgifter inom EU. Priset beräknas i kassan baserat på din plats och beställningens vikt.' },
    { q: 'Kan jag hämta min beställning i butiken?', a: 'Ja. Gratis upphämtning i butik finns på Bandhagsplan 4, 124 32 Bandhagen, Stockholm. Välj "Hämta i butik" i kassan så förbereder vi din beställning.' },
    { q: 'Vilka betalningsmetoder accepterar ni för onlinebeställningar?', a: 'Vi accepterar Visa, Mastercard, Klarna, Swish, Apple Pay, Google Pay samt kontant betalning vid lokal Stockholmsleverans.' },
];

const deliveryFaqsNo = [
    { q: 'Hvordan fungerer levering i Stockholm?', a: 'Vi tilbyr lokal levering i hele Stockholm. En leveringsavgift gjelder for alle bestillinger. Minimumsbestilling er 300 SEK. Besøk vår leveringsinformasjonsside for gjeldende priser.' },
    { q: 'Hvor rask er samme-dag levering?', a: 'Samme-dag levering er tilgjengelig til Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge, Solna og Sundbyberg. Legg inn bestillingen din før kl. 16:00 for levering samme dag.' },
    { q: 'Leverer dere utenfor Stockholm?', a: 'Ja. Vi leverer til hele Sverige og Europa via DHL. Ingen tollgebyrer innen EU. Priser beregnes ved kassen basert på din plassering og bestillingens vekt.' },
    { q: 'Kan jeg hente bestillingen min i butikken?', a: 'Ja. Gratis henting i butikk er tilgjengelig på Bandhagsplan 4, 124 32 Bandhagen, Stockholm. Velg «Hent i butikk» ved kassen, så forbereder vi bestillingen din.' },
    { q: 'Hvilke betalingsmetoder aksepterer dere for nettbestillinger?', a: 'Vi aksepterer Visa, Mastercard, Klarna, Swish, Apple Pay, Google Pay og kontant betaling for lokale Stockholm-leveranser.' },
];

const deliveryFaqsDa = [
    { q: 'Hvordan fungerer levering i Stockholm?', a: 'Vi tilbyder lokal levering i hele Stockholm. Et leveringsgebyr gælder for alle bestillinger. Minimumsbestilling er 300 SEK. Besøg vores leveringsinformationsside for aktuelle priser.' },
    { q: 'Hvor hurtig er samme-dag levering?', a: 'Samme-dag levering er tilgængeligt til Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge, Solna og Sundbyberg. Afgiv din bestilling inden kl. 16:00 for levering samme dag.' },
    { q: 'Leverer I uden for Stockholm?', a: 'Ja. Vi leverer til hele Sverige og Europa via DHL. Ingen toldsatser inden for EU. Priser beregnes ved kassen baseret på din placering og bestillingens vægt.' },
    { q: 'Kan jeg hente min bestilling i butikken?', a: 'Ja. Gratis afhentning i butik er tilgængeligt på Bandhagsplan 4, 124 32 Bandhagen, Stockholm. Vælg «Afhent i butik» ved kassen, så forbereder vi din bestilling.' },
    { q: 'Hvilke betalingsmetoder accepterer I for onlinebestillinger?', a: 'Vi accepterer Visa, Mastercard, Klarna, Swish, Apple Pay, Google Pay samt kontant betaling ved lokale Stockholm-leveringer.' },
];

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
      alternates: getAlternates('/delivery-information', locale),
    };
  }

  if (locale === 'no') {
    return {
      title: "Dagligvarelevering Stockholm & Hele Sverige | Ideal Indiska Livs",
      description: "Autentiske indiske og pakistanske dagligvarer med rask lokal levering i Stockholm. Samme-dag kveldlevering i Bandhagen og sørlige forsteder.",
      alternates: getAlternates('/delivery-information', locale),
    };
  }

  if (locale === 'da') {
    return {
      title: "Dagligvarelevering Stockholm & Hele Sverige | Ideal Indiska Livs",
      description: "Autentiske indiske og pakistanske dagligvarer med hurtig lokal levering i Stockholm. Samme-dag aftenlevering i Bandhagen og sydlige forstæder.",
      alternates: getAlternates('/delivery-information', locale),
    };
  }

  return {
    title: "Grocery Delivery Stockholm & All Sweden | Ideal Indiska Livs",
    description: "Authentic Indian & Pakistani groceries with fast local delivery across Stockholm. Same-day evening delivery in Bandhagen & southern suburbs.",
    alternates: getAlternates('/delivery-information', locale),
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

                            {/* FAQ Section — visible Q&A required for FAQPage rich results */}
                            <section className="space-y-4">
                                <h2 style={{ fontSize: '25px', fontWeight: 600 }}>
                                    {locale === 'sv' ? 'Vanliga frågor om leverans' : locale === 'no' ? 'Vanlige spørsmål om levering' : locale === 'da' ? 'Ofte stillede spørgsmål om levering' : 'Delivery FAQ'}
                                </h2>
                                <div className="divide-y divide-border">
                                    {(locale === 'sv' ? deliveryFaqsSv : locale === 'no' ? deliveryFaqsNo : locale === 'da' ? deliveryFaqsDa : deliveryFaqsEn).map((item, i) => (
                                        <details key={i} className="group py-4">
                                            <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                                                <span className="font-medium text-foreground" style={{ fontSize: '15.13px' }}>
                                                    {item.q}
                                                </span>
                                                <span className="text-muted-foreground flex-shrink-0 text-lg font-light group-open:hidden">+</span>
                                                <span className="text-muted-foreground flex-shrink-0 text-lg font-light hidden group-open:inline">−</span>
                                            </summary>
                                            <p className="mt-3 text-muted-foreground leading-relaxed" style={{ fontSize: '14.31px' }}>
                                                {item.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
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
