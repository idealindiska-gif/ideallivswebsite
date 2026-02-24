import { Link } from '@/lib/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Youtube, ExternalLink, Linkedin } from 'lucide-react';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const saleProducts = await getOnSaleProducts(3);
  const t = await getTranslations('footer');
  const nav = await getTranslations('navigation');

  return (
    <footer className="w-full bg-gradient-to-br from-primary/95 via-primary to-primary/90 border-t-4 border-primary-600 pt-12 pb-6 text-white shadow-2xl">
      <div className="w-full px-5 max-w-[1400px] mx-auto">
        {/* Main Footer Grid - 2 cols on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 mb-8">

          {/* Column 1: Brand Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-10 w-20">
                <Image
                  src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-white.png"
                  alt={`${brandProfile.name} - Stockholm's Best Indian & Pakistani Grocery Store`}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
            </Link>
            <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-3 text-white">{t('contact')}</h2>
            <ul className="space-y-2.5 text-sm text-white/70 font-sans">
              <li className="text-xs leading-relaxed">
                {brandProfile.address.street}, {brandProfile.address.area}<br />
                {brandProfile.address.postalCode} {brandProfile.address.city}
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-xs">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{brandProfile.contact.email}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-xs">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                {brandProfile.contact.phoneFormatted}
              </li>
            </ul>
          </div>

          {/* Column 2: Delivery Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
            <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-4 text-white">{t('delivery')}</h2>
            <ul className="space-y-2.5 text-sm text-white/70 font-sans">
              <li>
                <Link href="/delivery-information" className="group hover:text-white transition-colors">
                  <p className="font-semibold text-white/90 mb-0.5 group-hover:text-white transition-colors text-xs">{t('deliveryInfo')}</p>
                  <p className="text-xs text-white/70">{t('fastReliable')}</p>
                </Link>
              </li>
              <li>
                <p className="font-semibold text-white/90 mb-0.5 text-xs">{t('neighborhoods')}</p>
                <p className="text-[11px] leading-relaxed text-white/70">
                  {t('neighborhoodsList')}
                </p>
              </li>
              <li>
                <p className="font-semibold text-white/90 mb-0.5 text-xs">{t('sameDay')}</p>
                <p className="text-xs text-white/70">{t('localStockholm')}</p>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Offers */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
            <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-4 text-white">{t('featuredOffers')}</h2>
            <div className="space-y-3">
              {saleProducts.slice(0, 3).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex gap-2.5 group items-center"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 border border-white/20 shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-white/50">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h5 className="text-xs font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1 truncate">
                      {product.name}
                    </h5>
                    <div
                      className="text-[11px] font-bold text-white/90 mt-0.5"
                      dangerouslySetInnerHTML={{ __html: product.price_html || '' }}
                    />
                  </div>
                </Link>
              ))}
              {saleProducts.length === 0 && (
                <p className="text-xs text-white/60 italic">{t('noSaleItems')}</p>
              )}
            </div>
          </div>

          {/* Column 4: Shop Links */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
            <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-4 text-white">{t('shop')}</h2>
            <nav aria-label="Shop navigation">
              <ul className="space-y-2.5 text-sm text-white/70 font-sans">
                <li><Link href="/shop" className="hover:text-white transition-colors text-xs">{nav('allProducts')}</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors text-xs">{nav('blog')}</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors text-xs">{nav('ourStory')}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors text-xs">{nav('contactUs')}</Link></li>
              </ul>
            </nav>
          </div>

          {/* Column 5: Connect & Support Combined */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
            <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-4 text-white">{nav('connect')}</h2>
            <nav aria-label="Social media links">
              <ul className="space-y-2.5 text-sm text-white/70 font-sans mb-5">
                {brandProfile.social.instagram && (
                  <li>
                    <a href={brandProfile.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
                      <Instagram className="h-3.5 w-3.5" /> Instagram
                    </a>
                  </li>
                )}
                {brandProfile.social.facebook && (
                  <li>
                    <a href={brandProfile.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
                      <Facebook className="h-3.5 w-3.5" /> Facebook
                    </a>
                  </li>
                )}
                {brandProfile.social.youtube && (
                  <li>
                    <a href={brandProfile.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 text-xs">
                      <Youtube className="h-3.5 w-3.5" /> YouTube
                    </a>
                  </li>
                )}
              </ul>
            </nav>
            <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-3 text-white">{nav('support')}</h2>
            <nav aria-label="Support navigation">
              <ul className="space-y-2.5 text-sm text-white/70 font-sans">
                <li><Link href="/faq" className="hover:text-white transition-colors text-xs">{nav('faq')}</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors text-xs">{nav('privacy')}</Link></li>
                <li><Link href="/terms-conditions" className="hover:text-white transition-colors text-xs">{nav('terms')}</Link></li>
                <li><Link href="/refund-return" className="hover:text-white transition-colors text-xs">{nav('refunds')}</Link></li>
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom Bar - 2 col grid on mobile */}
        <div className="border-t border-white/20 pt-6 mt-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-between gap-3 md:gap-4" style={{ fontSize: '11px' }}>
            {/* Copyright */}
            <p className="text-white/60 tracking-wide font-sans col-span-2 md:col-span-1">
              © {new Date().getFullYear()} Ideal Indiska Livs. {t('allRightsReserved')}.
            </p>

            {/* Payment Icons */}
            <div className="relative h-5 w-48">
              <Image
                src="https://crm.ideallivs.com/wp-content/uploads/2026/01/payment-methods.png"
                alt="Payment Methods"
                fill
                className="object-contain"
                sizes="192px"
              />
            </div>

            {/* Credits */}
            <p className="flex items-center gap-1.5 text-white/60 tracking-wide font-sans">
              <span>by</span>
              <a href="https://fourlines.agency" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1 uppercase">
                Fourlines <ExternalLink className="h-2 w-2" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
