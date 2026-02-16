import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar,
    Facebook,
    Twitter,
    MapPin,
    MessageCircle,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brandProfile } from '@/config/brand-profile';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { getProducts } from '@/lib/woocommerce/products-direct';
import { getAllPosts } from '@/lib/wordpress';
import { decodeHtmlEntities } from '@/lib/utils';

export const metadata: Metadata = {
    title: "The Indian Fika: 5 Savory Snacks to Pair with Your Tea | Ideal Indiska",
    description: "Discover how to blend Swedish Fika culture with authentic Indian snacks. From spicy Samosas to crispy Namkeen, here are the best pairings for your afternoon tea.",
    openGraph: {
        title: "The Indian Fika: Authentic Snacks for Your Coffee Break",
        description: "Upgrade your Fika with a spicy twist. Explore the best Indian snacks available in Stockholm.",
        images: [{ url: '/images/blog/indian-fika-hero.png', width: 1200, height: 630, alt: 'Indian Fika Setup' }],
    },
};

export default async function IndianFikaPage() {
    const publishDate = "January 10, 2026";
    const title = "The Indian Fika: 5 Savory Snacks to Pair with Your Tea";
    const currentUrl = `${siteConfig.site_domain}/blog/the-indian-fika`;

    // Fetch sidebar data
    let promotionProducts: any[] = [];
    let recentPosts: any[] = [];

    try {
        const [{ data: products }, posts] = await Promise.all([
            getProducts({ per_page: 4, on_sale: true, orderby: 'date', order: 'desc' }),
            getAllPosts().catch(() => [])
        ]);
        promotionProducts = products;
        recentPosts = posts;
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 h-full w-full">
                    <Image
                        src="/images/blog/indian-fika-hero.png"
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl py-24 md:py-32 lg:py-40 text-white">
                    <nav className="mb-6 opacity-90">
                        <ol className="flex items-center gap-2 text-sm">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li>/</li>
                            <li>Culture & Lifestyle</li>
                        </ol>
                    </nav>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-8 max-w-4xl tracking-tight leading-[1.1]">
                        {title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden shrink-0 shadow-lg">
                                <Image
                                    src="https://secure.gravatar.com/avatar/6083515867990cd3b62453538466a987?s=96&d=mm&r=g"
                                    alt="Ideal Indiska Editorial"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Ideal Indiska Editorial</p>
                                <p className="text-sm text-white/70 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {publishDate}
                                </p>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full px-6 h-11">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-4.5 w-4.5 mr-2" /> Facebook
                                </a>
                            </Button>
                            <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-6 h-11">
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + currentUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4.5 w-4.5 mr-2" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Article Content */}
                        <article className="lg:col-span-8">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-primary prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground">
                                <p className="text-2xl text-foreground font-medium mb-12 leading-relaxed border-l-4 border-primary pl-8 py-2 italic opacity-90">
                                    In Sweden, the concept of <em>Fika</em> is sacred. It&apos;s more than just a coffee break; it&apos;s a moment of pause, community, and indulgence. But what happens when you swap the cinnamon bun for a crispy Samosa, or the black coffee for a steaming cup of spiced Masala Chai?
                                </p>

                                <p>
                                    Welcome to the <strong>Indian Fika</strong>. At Ideal Indiska LIVS, we believe that the afternoon "mellanmål" is the perfect opportunity to explore the bold, vibrant flavors of South Asia. Stockholm is full of hidden culinary gems, and starting your flavor journey in your own kitchen is the best way to experience it.
                                </p>

                                <h2 className="text-3xl mt-16 mb-8 tracking-tight">1. The Golden Samosa: The King of Tea-Time</h2>
                                <p>
                                    If the Kanelbulle is the king of Swedish fika, the Samosa is his Indian counterpart. These triangular pastries, filled with spiced potatoes and peas (or savory meats), offer a satisfying crunch followed by a warm, aromatic interior.
                                </p>
                                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 my-10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Clock className="w-16 h-16 text-primary" />
                                    </div>
                                    <p className="font-bold text-primary mb-3 flex items-center gap-2 text-lg">
                                        <Clock className="w-5 h-5" /> Professional Serving Tip:
                                    </p>
                                    <p className="relative z-10">
                                        Reheat your store-bought samosas in an air fryer at 180°C for 3-4 minutes to regain that authentic street-side crispiness. Never microwave them! Serve with a side of mint chutney or tangy tamarind sauce for the ultimate contrast.
                                    </p>
                                </div>

                                <h2 className="text-3xl mt-16 mb-8 tracking-tight">2. Spicy Namkeen: The Ultimate Crunch</h2>
                                <p>
                                    Looking for something lighter? <em>Namkeen</em> (Savory snacks) like Aloo Bhujia, Moong Dal, or spicy Murukku are perfect for mindless munching during a quick office break. They provide a spicy, salty kick that perfectly balances the sweetness of a Swedish latte or a traditional cup of tea.
                                </p>

                                <h2 className="text-3xl mt-16 mb-8 tracking-tight">3. Masala Chai: The Swedish Oatly&apos;s Best Friend</h2>
                                <p>
                                    While traditional fika centers on brewed coffee, Masala Chai brings a complex profile of cardamom, cinnamon, and cloves. Interestingly, many our customers in Stockholm love brewing their chai with local Swedish oat milk for a creamier, eco-friendly twist that perfectly bridges two cultures.
                                </p>

                                <h2 className="text-3xl mt-16 mb-8 tracking-tight">4. Parle-G: The Nostalgia Biscuit</h2>
                                <p>
                                    Every Indian grew up dipping Parle-G biscuits into hot tea. These simple, malted biscuits are the "Digestive" of South Asia. They are light, slightly sweet, and incredibly affordable—a true staple at any Ideal Indiska shopping trip that brings a sense of home to your afternoon break.
                                </p>

                                <h2 className="text-3xl mt-16 mb-8 tracking-tight">5. Gulab Jamun: For the Sweet Tooth</h2>
                                <p>
                                    Sometimes, you just need a sugar rush. Gulab Jamun—soft, syrup-soaked dough balls—is the ultimate indulgence. While usually served warm for dessert, a single Gulab Jamun with a cup of strong tea is a daytime luxury everyone in Stockholm should try at least once.
                                </p>

                                <div className="mt-24 p-12 bg-primary/5 rounded-[3rem] border border-primary/20 text-center shadow-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                                    <h3 className="text-4xl font-heading font-bold text-primary mb-6 relative z-10">Ready to try your first Indian Fika?</h3>
                                    <p className="text-xl mb-12 text-muted-foreground relative z-10 max-w-2xl mx-auto">Visit our store in Bandhagen or shop our curated "Fika Favorites" selection online today!</p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-12 rounded-full text-lg h-16 shadow-lg shadow-primary/20">
                                            <Link href="/shop?category=snacks-sweets">Shop Snacks Online</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="px-12 rounded-full text-lg h-16 bg-background border-primary/30 text-primary hover:bg-primary/5 transition-all">
                                            <Link href="/contact">Visit Our Store</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Author Section */}
                            <div className="mt-32 pt-16 border-t border-border/60">
                                <div className="bg-muted/40 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-start border border-border/40 hover:border-primary/20 transition-colors group">
                                    <div className="relative w-28 h-28 rounded-full overflow-hidden shrink-0 border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-500">
                                        <Image
                                            src="https://secure.gravatar.com/avatar/6083515867990cd3b62453538466a987?s=128&d=mm&r=g"
                                            alt="Ideal Indiska"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-2xl font-heading font-bold mb-1">Ideal Indiska Editorial Team</h4>
                                            <p className="text-sm text-primary font-bold tracking-[0.2em] uppercase">Culinary Experts & Cultural Ambassadors</p>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed text-lg italic">
                                            "Bringing the authentic taste of the subcontinent to the heart of Sweden. Our team is dedicated to bridging cultures through the universal language of food."
                                        </p>
                                        <div className="flex gap-8">
                                            <Link href="/about" className="text-sm font-bold text-primary hover:tracking-widest transition-all uppercase tracking-widest">Our Story</Link>
                                            <Link href="/contact" className="text-sm font-bold text-primary hover:tracking-widest transition-all uppercase tracking-widest">Contact Us</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-24 pt-16 border-t border-border/60">
                                <div className="flex items-center gap-6 mb-12">
                                    <h3 className="text-3xl font-heading font-bold text-foreground tracking-tight">Community Thoughts</h3>
                                    <div className="h-px flex-1 bg-border/40" />
                                </div>

                                <div className="space-y-12">
                                    {/* Empty State */}
                                    <div className="bg-background border border-border/50 rounded-[2.5rem] p-12 text-center py-20 shadow-sm">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 text-primary mb-8 animate-pulse">
                                            <MessageCircle className="w-10 h-10" />
                                        </div>
                                        <h4 className="text-2xl font-heading font-bold mb-3">Be the First to Share</h4>
                                        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
                                            We'd love to hear your favorite Indian snack pairings or your memories of tea-time!
                                        </p>
                                        <Button variant="outline" className="rounded-full px-12 h-14 text-base font-semibold border-primary/20 text-primary hover:bg-primary/5">Write a Comment</Button>
                                    </div>

                                    {/* Comment Form */}
                                    <div className="bg-card border border-border/60 rounded-[3rem] p-10 md:p-14 shadow-sm">
                                        <h4 className="text-2xl font-heading font-bold mb-6">Leave a Reply</h4>
                                        <p className="text-muted-foreground mb-10 text-lg">Your email address will not be published. Required fields are marked *</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-2">Your Name *</label>
                                                <div className="h-14 w-full bg-background border border-border/20 rounded-2xl focus-within:border-primary/40 transition-colors px-5 flex items-center text-muted-foreground/40 italic">Enter your name...</div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-2">Your Email *</label>
                                                <div className="h-14 w-full bg-background border border-border/20 rounded-2xl focus-within:border-primary/40 transition-colors px-5 flex items-center text-muted-foreground/40 italic">Enter your email...</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-10">
                                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-2">Message *</label>
                                            <div className="h-40 w-full bg-background border border-border/20 rounded-2xl focus-within:border-primary/40 transition-colors p-5 text-muted-foreground/40 italic">Write your thoughts here...</div>
                                        </div>

                                        <Button disabled size="lg" className="rounded-full px-14 h-16 text-lg shadow-lg opacity-80 cursor-not-allowed">Post Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-10">
                                {/* Promotions */}
                                {promotionProducts.length > 0 && (
                                    <div className="bg-white dark:bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm">
                                        <h3 className="text-xl font-heading font-bold text-primary mb-8 tracking-tight border-b border-primary/10 pb-4">Special Offers</h3>
                                        <div className="space-y-6">
                                            {promotionProducts.map((product) => (
                                                <Link key={product.id} href={`/product/${product.slug}`} className="flex gap-4 group items-center">
                                                    <div className="relative w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/20">
                                                        {product.images[0] && (
                                                            <Image src={product.images[0].src} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="64px" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1 font-sans">
                                                            {decodeHtmlEntities(product.name)}
                                                        </h4>
                                                        <p className="text-primary font-bold">{product.price} SEK</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <Button asChild variant="outline" className="w-full mt-8 rounded-full h-12 border-primary/20 text-primary hover:bg-primary/5">
                                            <Link href="/shop?on_sale=true">View All Deals</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Map */}
                                <div className="bg-white dark:bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm overflow-hidden">
                                    <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-primary" /> Our Kitchen
                                    </h3>
                                    <div className="rounded-[1.5rem] overflow-hidden mb-6 h-[220px] shadow-inner border border-border/10">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.769278826918!2d18.048690399999998!3d59.2700036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77d07b5889cf%3A0xd20e7ba594e09663!2sIdeal%20Indiska%20Livs%20Bandhagen!5e0!3m2!1sen!2s!4v1765922506900!5m2!1sen!2s"
                                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground/80 font-medium">
                                        <p className="text-foreground font-bold">Ideal Indiska Livs</p>
                                        <p>Bandhagsplan 4, 12432 Bandhagen</p>
                                        <p>Stockholm, Sweden</p>
                                    </div>
                                </div>

                                {/* Recent Articles */}
                                {recentPosts && recentPosts.length > 0 && (
                                    <div className="bg-white dark:bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm">
                                        <h3 className="text-xl font-heading font-bold text-foreground mb-8 tracking-tight border-b border-border/10 pb-4">Read More</h3>
                                        <div className="space-y-8">
                                            {recentPosts.slice(0, 3).map((recentPost: any) => (
                                                <Link key={recentPost.id} href={`/blog/${recentPost.slug}`} className="block group">
                                                    <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight font-heading">
                                                        {decodeHtmlEntities(recentPost.title.rendered)}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(recentPost.date).toLocaleDateString()}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <SchemaScript
                id="fika-article-schema"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": title,
                    "image": `${siteConfig.site_domain}/images/blog/indian-fika-hero.png`,
                    "author": {
                        "@type": "Organization",
                        "name": "Ideal Indiska LIVS"
                    },
                    "datePublished": "2026-01-10",
                    "description": "Discover how to blend Swedish Fika culture with authentic Indian snacks."
                }}
            />
        </div>
    );
}
