import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { brandProfile } from "@/config/brand-profile";
import { ShoppingBag, Heart, Users, Award, MessageCircle, Mail, MapPin } from "lucide-react";
import { GoogleMapCompact } from "@/components/shared/google-map";
import { getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo/metadata';
import { swedishMeta } from '@/lib/seo/swedish-meta';
import { SchemaScript } from '@/lib/schema/schema-script';
import { idealIndiskaOrganizationSchemaFull } from '@/lib/schema';

// ISR: Revalidate static pages every 24 hours
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'sv') {
    const svMeta = swedishMeta['/about'];
    return {
      title: svMeta.title,
      description: svMeta.description,
      alternates: getAlternates('/about'),
    };
  }

  return {
    title: `About ${brandProfile.name} - Stockholm's Best Indian & Pakistani Grocery`,
    description: `Discover the story of ${brandProfile.name}. Since 2020, we have been Stockholm's most trusted source for authentic Indian and Pakistani groceries, premium Basmati rice, and Halal meat.`,
    alternates: getAlternates('/about'),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('about');
  const tc = await getTranslations('common');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-20 text-left">
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
              {brandProfile.tagline} {t('subtitle')}
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
              {/* Our Story */}
              <div>
                <h2 style={{
                  fontSize: '25px',
                  fontWeight: 600,
                  lineHeight: 1.47,
                  letterSpacing: '0.02em'
                }} className="mb-6">
                  {t('storyTitle')}
                </h2>
                <div className="space-y-6 text-muted-foreground" style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.52,
                  letterSpacing: '0.03em'
                }}>
                  <p>
                    {t('storyP1')}
                  </p>
                  <p>
                    {t('storyP2')}
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border mt-8">
                    <Image
                      src="https://crm.ideallivs.com/wp-content/uploads/2025/05/whatsapp-image-2025-05-06-at-23.02.51-90cce80c.jpeg"
                      alt="Ideal Indiska Store"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  <p className="mt-8">
                    {t('storyP3')}
                  </p>
                </div>
              </div>

              {/* What We Offer */}
              <div>
                <h2 style={{
                  fontSize: '25px',
                  fontWeight: 600,
                  lineHeight: 1.47,
                  letterSpacing: '0.02em'
                }} className="mb-6">
                  {t('ingredientsTitle')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { title: t('spicesTitle'), desc: t('spicesDesc'), icon: Award },
                    { title: t('grainsTitle'), desc: t('grainsDesc'), icon: ShoppingBag },
                    { title: t('produceTitle'), desc: t('produceDesc'), icon: Heart },
                    { title: t('treatsTitle'), desc: t('treatsDesc'), icon: Users },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-xl border bg-card/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{item.title}</h3>
                      <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <section className="space-y-6 pt-12 border-t">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }}>{t('testimonialsTitle')}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      text: "Glad att jag hittade denna butik! Bra sortiment, hittade allt jag beh\u00F6vde och mer. V\u00E4nlig och hj\u00E4lpsam personal.",
                      author: "Linda",
                      source: "Google Reviews"
                    },
                    {
                      text: "Kul med ett annat sortiment \u00E4n det som finns p\u00E5 vanliga matbutikskedjorna. Kommer tvekl\u00F6st \u00E5terkomma!",
                      author: "Michaela Svanberg",
                      source: "Google Reviews"
                    }
                  ].map((review, i) => (
                    <div key={i} className="p-6 rounded-2xl border bg-muted/10 italic">
                      <p className="text-muted-foreground mb-4" style={{ fontSize: '15.13px' }}>&quot;{review.text}&quot;</p>
                      <div className="not-italic">
                        <p className="font-semibold" style={{ fontSize: '14.31px' }}>{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Store Values */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-4">
                    {t('valuesTitle')}
                  </h3>
                  <div className="space-y-6">
                    {[
                      { title: t('authenticityTitle'), desc: t('authenticityDesc'), icon: Award },
                      { title: t('freshnessTitle'), desc: t('freshnessDesc'), icon: Heart },
                      { title: t('serviceTitle'), desc: t('serviceDesc'), icon: Users },
                    ].map((value, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <value.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{value.title}</p>
                          <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{value.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Sidebar Card */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-4">
                    {tc('contactUs')}
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/46728494801"
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{tc('whatsapp')}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12.8px' }}>{tc('chatWithUs')}</p>
                      </div>
                    </a>
                    <a
                      href="mailto:info@ideallivs.com"
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{tc('email')}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12.8px' }}>info@ideallivs.com</p>
                      </div>
                    </a>
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                      <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{tc('visitStore')}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12.8px' }}>
                          Bandhagsplan 4, Stockholm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Location Map */}
                <div className="bg-card">
                  <GoogleMapCompact />
                  <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                    <p className="text-xs text-center text-muted-foreground">
                      {brandProfile.address.street}, {brandProfile.address.postalCode} {brandProfile.address.area}
                    </p>
                  </div>
                </div>

                {/* New Customer? CTA */}
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-2">
                    {tc('readyToShop')}
                  </h3>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: '13.53px' }}>
                    {t('exploreBrands')}
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    style={{ fontSize: '13.53px', fontWeight: 500 }}
                  >
                    {tc('startShopping')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Schema — entity authority signal for Google & AI */}
      <SchemaScript
        id="about-organization-schema"
        schema={idealIndiskaOrganizationSchemaFull('https://www.ideallivs.com', locale)}
      />
    </main>
  );
}
