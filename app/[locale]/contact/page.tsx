import { Metadata } from "next";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";
import { brandProfile } from "@/config/brand-profile";
import { getAlternates } from "@/lib/seo/metadata";
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { GoogleMapCompact } from "@/components/shared/google-map";
import { SchemaScript } from "@/lib/schema/schema-script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: `${t('title')} - Ideal Indiska LIVS | Grocery Store Bandhagen Stockholm`,
    description: t('subtitle'),
    alternates: getAlternates('/contact', locale),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const td = await getTranslations({ locale, namespace: 'days' });

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

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
              {/* Direct Lines */}
              <div>
                <h2 style={{
                  fontSize: '25px',
                  fontWeight: 600,
                  lineHeight: 1.47,
                  letterSpacing: '0.02em'
                }} className="mb-8">
                  {t('directTitle')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div className="p-6 rounded-xl border bg-card/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{tc('whatsapp')}</h3>
                    <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-4">
                      {t('whatsappDesc')}
                    </p>
                    <a
                      href="https://wa.me/46728494801"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      style={{ fontSize: '15.13px' }}
                    >
                      +46 728 494 801 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="p-6 rounded-xl border bg-card/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{tc('callUs')}</h3>
                    <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-4">
                      {t('callDesc')}
                    </p>
                    <a
                      href={`tel:${brandProfile.contact.phone}`}
                      className="text-primary hover:underline font-medium"
                      style={{ fontSize: '15.13px' }}
                    >
                      {brandProfile.contact.phoneFormatted}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="p-6 rounded-xl border bg-card/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{tc('email')}</h3>
                    <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-4">
                      {t('emailDesc')}
                    </p>
                    <a
                      href={`mailto:${brandProfile.contact.email}`}
                      className="text-primary hover:underline font-medium"
                      style={{ fontSize: '15.13px' }}
                    >
                      {brandProfile.contact.email}
                    </a>
                  </div>

                  {/* Visit */}
                  <div className="p-6 rounded-xl border bg-card/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{tc('visitStore')}</h3>
                    <p style={{ fontSize: '15.13px' }} className="text-muted-foreground mb-4">
                      {t('visitDesc')}
                    </p>
                    <a
                      href={brandProfile.google.mapsCidUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      style={{ fontSize: '15.13px' }}
                    >
                      {tc('getDirections')} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Form */}
              <div className="p-8 rounded-2xl border bg-card">
                <h2 style={{ fontSize: '22.36px', fontWeight: 600 }} className="mb-6">{t('messageTitle')}</h2>
                <ContactForm />
              </div>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Opening Hours */}
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 style={{
                      fontSize: '18.91px',
                      fontWeight: 500,
                      lineHeight: 1.52,
                      letterSpacing: '0.03em'
                    }}>
                      {t('openingHours')}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {daysOfWeek.map((day) => {
                      const hours = brandProfile.hours[day];
                      return (
                        <div key={day} className="flex justify-between items-center py-1 border-b border-dashed last:border-0">
                          <span style={{ fontSize: '14.31px', fontWeight: 500 }}>{td(day)}</span>
                          <span style={{ fontSize: '13.53px' }} className="text-muted-foreground">{hours.display}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FAQ Quick Link */}
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-2">
                    {t('findingAnswers')}
                  </h3>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: '13.53px' }}>
                    {t('findingAnswersDesc')}
                  </p>
                  <Link
                    href="/faq"
                    className="inline-block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                    style={{ fontSize: '13.53px', fontWeight: 500 }}
                  >
                    {tc('viewFaq')}
                  </Link>
                </div>

                {/* Store Location Map */}
                <div className="bg-card">
                  <GoogleMapCompact />
                  <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                    <p className="text-xs text-muted-foreground mb-2">
                      {brandProfile.address.street}, {brandProfile.address.postalCode} {brandProfile.address.area}
                    </p>
                    <a
                      href={brandProfile.google.mapsCidUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline flex items-center justify-center gap-1"
                    >
                      Open in Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Review CTA */}
      <section className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-xl text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Happy with your experience?</p>
          <p className="text-xs text-muted-foreground mb-4">Leave us a review on Google — it helps other shoppers find us.</p>
          <a
            href={brandProfile.google.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            ⭐ Leave a Google Review
          </a>
          <p className="text-xs text-muted-foreground mt-3">{brandProfile.google.rating.value} / 5 · {brandProfile.google.rating.count} reviews</p>
        </div>
      </section>

      <SchemaScript id="contact-page-schema" schema={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://www.ideallivs.com/contact#webpage",
        "name": "Contact Ideal Indiska Livs",
        "url": "https://www.ideallivs.com/contact",
        "description": "Contact Ideal Indiska Livs — Stockholm's Indian grocery store. Visit us in Bandhagen or reach us by phone, email, or social media.",
        "mainEntity": {
          "@type": "LocalBusiness",
          "@id": "https://www.ideallivs.com/#organization",
          "name": "Ideal Indiska Livs",
          "telephone": brandProfile.contact.phone,
          "email": brandProfile.contact.email,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": brandProfile.address.street,
            "addressLocality": brandProfile.address.city,
            "postalCode": brandProfile.address.postalCode,
            "addressCountry": "SE",
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": brandProfile.contact.phone,
              "email": brandProfile.contact.email,
              "availableLanguage": ["English", "Swedish"],
              "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "10:00",
                "closes": "20:00",
              },
            },
          ],
        },
      }} />
    </main>
  );
}
