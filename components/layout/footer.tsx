import { Link } from '@/lib/navigation';
import NextLink from 'next/link';
import Image from 'next/image';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Star, ExternalLink, MapPin, Mail, Phone } from 'lucide-react';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { getTranslations } from 'next-intl/server';

const logoUrl =
  "https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-white.png";

export async function Footer() {
  const saleProducts = await getOnSaleProducts(3);
  const t = await getTranslations('footer');
  const nav = await getTranslations('navigation');

  return (
    <footer className="w-full bg-[#0f1f16] border-t border-white/10 pt-12 pb-6 text-white">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8">

        {/* Main grid — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Col 1: Brand + Contact */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <div className="relative h-10 w-24">
                <Image
                  src={logoUrl}
                  alt={`${brandProfile.name} - Indian & Pakistani Groceries Stockholm`}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            </Link>
            <p className="text-white/50 text-[12px] leading-relaxed mb-5 max-w-[220px]">
              Stockholm&apos;s favourite Indian &amp; Pakistani grocery store, delivering across Sweden &amp; Europe.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-white/60 text-[12px]">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-white/30" />
                <span>
                  {brandProfile.address.street}, {brandProfile.address.area}<br />
                  {brandProfile.address.postalCode} {brandProfile.address.city}
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-[12px]">
                <Mail className="h-3.5 w-3.5 shrink-0 text-white/30" />
                <a href={`mailto:${brandProfile.contact.email}`} className="hover:text-white transition-colors truncate">
                  {brandProfile.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-[12px]">
                <Phone className="h-3.5 w-3.5 shrink-0 text-white/30" />
                <a href={`tel:${brandProfile.contact.phone}`} className="hover:text-white transition-colors">
                  {brandProfile.contact.phoneFormatted}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h3 className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
              {t('shop')}
            </h3>
            <nav aria-label="Shop navigation">
              <ul className="space-y-3">
                <li><Link href="/shop" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('allProducts')}</Link></li>
                <li><Link href="/deals" className="text-destructive/80 hover:text-destructive transition-colors text-[13px] font-medium">{nav('dealsOffers')}</Link></li>
                <li><Link href="/brands" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('brands')}</Link></li>
                <li><Link href="/prepared-meals" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('preparedMeals')}</Link></li>
                <li><Link href="/blog" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('blog')}</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('ourStory')}</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('contactUs')}</Link></li>
              </ul>
            </nav>

            {/* Featured offers — compact list */}
            {saleProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-4">
                  {t('featuredOffers')}
                </h3>
                <ul className="space-y-3">
                  {saleProducts.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-2.5 group"
                      >
                        <div className="relative w-9 h-9 rounded-md overflow-hidden bg-white/10 shrink-0 border border-white/10">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0].src}
                              alt={product.images[0].alt || product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="36px"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/70 group-hover:text-white transition-colors text-[12px] line-clamp-1 font-medium">
                            {product.name}
                          </p>
                          <div
                            className="text-[11px] text-white/50 mt-0.5"
                            dangerouslySetInnerHTML={{ __html: product.price_html || '' }}
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Col 3: Help & Support */}
          <div>
            <h3 className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
              {nav('support')}
            </h3>
            <nav aria-label="Support navigation">
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('faq')}</Link></li>
                <li><Link href="/delivery-information" className="text-white/70 hover:text-white transition-colors text-[13px]">{t('deliveryInfo')}</Link></li>
                <li><Link href="/delivery-goteborg-malmo" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('goteborgMalmoDelivery')}</Link></li>
                <li><Link href="/delivery-kalmar" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('kalmarDelivery')}</Link></li>
                <li><Link href="/privacy-policy" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('privacy')}</Link></li>
                <li><Link href="/terms-conditions" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('terms')}</Link></li>
                <li><Link href="/refund-return" className="text-white/70 hover:text-white transition-colors text-[13px]">{nav('refunds')}</Link></li>
              </ul>
            </nav>
          </div>

          {/* Col 4: Connect (social) */}
          <div>
            <h3 className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
              {nav('connect')}
            </h3>
            <nav aria-label="Social media links">
              <ul className="space-y-3">
                {brandProfile.social.instagram && (
                  <li>
                    <a href={brandProfile.social.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-[13px]">
                      <Instagram className="h-4 w-4 text-white/40" />
                      Instagram
                    </a>
                  </li>
                )}
                {brandProfile.social.facebook && (
                  <li>
                    <a href={brandProfile.social.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-[13px]">
                      <Facebook className="h-4 w-4 text-white/40" />
                      Facebook
                    </a>
                  </li>
                )}
                {brandProfile.social.youtube && (
                  <li>
                    <a href={brandProfile.social.youtube} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-[13px]">
                      <Youtube className="h-4 w-4 text-white/40" />
                      YouTube
                    </a>
                  </li>
                )}
                {brandProfile.social.tiktok && (
                  <li>
                    <a href={brandProfile.social.tiktok} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-[13px]">
                      <svg className="h-4 w-4 text-white/40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z"/>
                      </svg>
                      TikTok
                    </a>
                  </li>
                )}
                {brandProfile.social.twitter && (
                  <li>
                    <a href={brandProfile.social.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-[13px]">
                      <Twitter className="h-4 w-4 text-white/40" />
                      X (Twitter)
                    </a>
                  </li>
                )}
                {brandProfile.social.linkedin && (
                  <li>
                    <a href={brandProfile.social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-[13px]">
                      <Linkedin className="h-4 w-4 text-white/40" />
                      LinkedIn
                    </a>
                  </li>
                )}
                <li>
                  <a href={brandProfile.google.reviewUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-yellow-400/80 hover:text-yellow-300 transition-colors text-[13px]">
                    <Star className="h-4 w-4" />
                    Leave a Google Review
                  </a>
                </li>
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <p className="text-white/40 text-[11px] tracking-wide">
            © {new Date().getFullYear()} Ideal Indiska Livs. {t('allRightsReserved')}.
          </p>

          {/* Locale links */}
          <nav aria-label="Language versions" className="flex items-center gap-2.5 text-white/35 text-[11px]">
            <NextLink href="/" className="hover:text-white/70 transition-colors" hrefLang="en">EN</NextLink>
            <span aria-hidden="true">·</span>
            <NextLink href="/sv" className="hover:text-white/70 transition-colors" hrefLang="sv">SV</NextLink>
            <span aria-hidden="true">·</span>
            <NextLink href="/no" className="hover:text-white/70 transition-colors" hrefLang="nb">NO</NextLink>
            <span aria-hidden="true">·</span>
            <NextLink href="/da" className="hover:text-white/70 transition-colors" hrefLang="da">DA</NextLink>
          </nav>

          {/* Payment methods */}
          <div className="relative h-5 w-44 opacity-60">
            <Image
              src="https://crm.ideallivs.com/wp-content/uploads/2026/01/payment-methods.png"
              alt="Payment Methods: Visa, Mastercard, Klarna, Swish"
              fill
              className="object-contain"
              sizes="176px"
            />
          </div>

          {/* Credits */}
          <p className="flex items-center gap-1.5 text-white/35 text-[11px] tracking-wide">
            <span>by</span>
            <a href="https://fourlines.agency" target="_blank" rel="noopener noreferrer"
              className="font-semibold text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 uppercase">
              Fourlines <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>

        </div>
      </div>
    </footer>
  );
}
