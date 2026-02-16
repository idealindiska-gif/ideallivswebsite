import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { brandProfile } from "@/config/brand-profile";
import { getAlternates } from "@/lib/seo/metadata";
import { Truck, MapPin, Package, Clock, Info, MessageCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/navigation";
import { SchemaScript } from "@/lib/schema/schema-script";
import { goteborgMalmoDeliveryServiceSchema } from "@/lib/schema";
import { GoogleMapCompact } from "@/components/shared/google-map";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'goteborgMalmo' });

  return {
    title: `${t('title')} | Ideal Indiska Livs`,
    description: t('subtitle'),
    alternates: getAlternates('/delivery-goteborg-malmo'),
  };
}

export default async function GoteborgMalmoDeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'goteborgMalmo' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const popularProducts = [t('popular1'), t('popular2'), t('popular3'), t('popular4'), t('popular5')];

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
                  {t('introHighlight')}
                </p>
                <p>
                  {t('introText')}
                </p>
              </section>

              {/* Coverage Areas */}
              <section className="space-y-8">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  {t('coverageTitle')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 style={{ fontSize: '20px', fontWeight: 600 }}>{t('goteborgTitle')}</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                      <li>{t('goteborgCentral')}</li>
                      <li>{t('goteborgGreater')}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 style={{ fontSize: '20px', fontWeight: 600 }}>{t('malmoTitle')}</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground" style={{ fontSize: '15.13px' }}>
                      <li>{t('malmoDistricts')}</li>
                      <li>{t('malmoSurrounding')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Delivery Details */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }} className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-primary" />
                  {t('scheduleTitle')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl border bg-card/50">
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('goteborgScheduleTitle')}</h3>
                    <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('goteborgScheduleText')}</p>
                  </div>
                  <div className="p-6 rounded-xl border bg-card/50">
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">{t('malmoScheduleTitle')}</h3>
                    <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{t('malmoScheduleText')}</p>
                  </div>
                </div>
              </section>

              {/* Popular Products */}
              <section className="space-y-6">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }}>{t('popularTitle')}</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
                  {popularProducts.map((product, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/5">
                      <Package className="w-4 h-4 text-primary" />
                      <span style={{ fontSize: '14.31px' }}>{product}</span>
                    </div>
                  ))}
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
                      <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('noMinimumOrder')}</p>
                        <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('noMinimumOrderDesc')}</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{t('dhlTracking')}</p>
                        <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{t('dhlTrackingDesc')}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Store Location Map */}
                <div className="bg-card">
                  <GoogleMapCompact />
                  <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                    <p className="text-xs text-center text-muted-foreground">
                      {t('ourStore')} {brandProfile.address.street}, {brandProfile.address.postalCode} {brandProfile.address.area}
                    </p>
                  </div>
                </div>

                {/* Support */}
                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('questions')}</h3>
                  <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">{t('questionsDesc')}</p>
                  <a href="https://wa.me/46728494801" className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                    {tc('chatNow')}
                  </a>
                </div>

                {/* Main Delivery Link */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{t('moreOptions')}</h3>
                  <Link href="/delivery-information" className="text-primary hover:underline text-sm flex items-center justify-between">
                    {t('generalDeliveryInfo')} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Structured Data */}
      <SchemaScript
        id="goteborg-malmo-delivery-schema"
        schema={goteborgMalmoDeliveryServiceSchema()}
      />
    </main>
  );
}
