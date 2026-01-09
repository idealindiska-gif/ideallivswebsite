import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Youtube, ExternalLink, Linkedin } from 'lucide-react';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';

export async function Footer() {
  const saleProducts = await getOnSaleProducts(3);

  return (
    <footer className="w-full bg-background border-t border-border/10 pt-12 pb-6 sm:pt-16 sm:pb-8">
      <div className="w-full px-5 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Left Column: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start -mt-2">
            <Link href="/" className="inline-block mb-4">
              {/* Brand Logo */}
              <div className="relative h-12 w-24">
                <Image
                  src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png"
                  alt={brandProfile.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            </Link>

            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-sans max-w-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground italic opacity-80 mb-1">Stockholm's Best Indian & Pakistani Grocery</p>
                <p>{brandProfile.address.street}, {brandProfile.address.area}</p>
                <p>{brandProfile.address.postalCode} {brandProfile.address.city}, Sweden</p>
              </div>

              <div className="space-y-0.5">
                <p className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Mail className="h-3 w-3" /> {brandProfile.contact.email}
                </p>
                <p className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Phone className="h-3 w-3" /> {brandProfile.contact.phoneFormatted}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Delivery Information */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-7 text-foreground">Delivery</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-sans">
              <li>
                <Link href="/delivery-information" className="group hover:text-primary transition-colors">
                  <p className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Delivery Info</p>
                  <p className="text-xs opacity-70">Fast & reliable delivery across Sweden</p>
                </Link>
              </li>
              <li>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Neighborhoods</p>
                  <p className="text-[11px] leading-relaxed opacity-70">
                    Bandhagen, Högdalen, Enskede, Älvsjö, Farsta, Stockholms innerstad & more.
                  </p>
                </div>
              </li>
              <li>
                <p className="font-semibold text-foreground mb-1">Same-Day</p>
                <p className="text-xs opacity-70">Available for local Stockholm orders</p>
              </li>
            </ul>
          </div>

          {/* Column 3: Products on Sale */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-7 text-foreground">Featured Offers</h4>
            <div className="space-y-4">
              {saleProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex gap-4 group items-center"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/40 shadow-sm">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h5 className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 truncate">
                      {product.name}
                    </h5>
                    <div
                      className="text-[11px] font-bold text-primary mt-0.5"
                      dangerouslySetInnerHTML={{ __html: product.price_html || '' }}
                    />
                  </div>
                </Link>
              ))}
              {saleProducts.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No sale items currently.</p>
              )}
            </div>
          </div>

          {/* Column 4: Links */}
          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-7 text-foreground">Shop</h4>
              <ul className="space-y-3.5 text-sm text-muted-foreground font-sans">
                <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Our Blog</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-7 text-foreground">Connect</h4>
              <ul className="space-y-3.5 text-sm text-muted-foreground font-sans">
                {brandProfile.social.instagram && (
                  <li>
                    <Link href={brandProfile.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2.5">
                      <Instagram className="h-3.5 w-3.5" /> Instagram
                    </Link>
                  </li>
                )}
                {brandProfile.social.facebook && (
                  <li>
                    <Link href={brandProfile.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2.5">
                      <Facebook className="h-3.5 w-3.5" /> Facebook
                    </Link>
                  </li>
                )}
                {brandProfile.social.youtube && (
                  <li>
                    <Link href={brandProfile.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2.5">
                      <Youtube className="h-3.5 w-3.5" /> YouTube
                    </Link>
                  </li>
                )}
                {brandProfile.social.twitter && (
                  <li>
                    <Link href={brandProfile.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2.5">
                      <Twitter className="h-3.5 w-3.5" /> X
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-heading text-[13px] font-bold uppercase tracking-[0.15em] mb-7 text-foreground">Support</h4>
              <ul className="space-y-3.5 text-sm text-muted-foreground font-sans">
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms-conditions" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="/refund-return" className="hover:text-primary transition-colors">Refunds</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/10 pt-8 mt-12 flex flex-col md:flex-row items-center md:justify-between gap-6 text-xs text-muted-foreground/50 tracking-wider font-sans">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p>© {new Date().getFullYear()} Ideal Indiska Livs Stockholm. All Rights Reserved.</p>
            <p className="hidden md:block opacity-60">High-quality Indian & Pakistani products in the heart of Sweden.</p>
          </div>
          <p className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full border border-border/5 shadow-sm">
            <span>Crafted with passion by</span>
            <a href="https://fourlines.agency" target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1 uppercase text-[10px]">
              Fourlines Agency <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
