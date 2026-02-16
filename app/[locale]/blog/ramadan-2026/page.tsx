
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { notFound } from 'next/navigation';
import {
    Calendar, Facebook, Twitter, Linkedin, Mail, MessageCircle,
    MapPin, CheckCircle2, ShoppingBag, Clock, Utensils, Star,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProducts } from '@/lib/woocommerce/products-direct';
import { articleSchema } from '@/lib/schema/article';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { decodeHtmlEntities } from '@/lib/utils';
import { getAllPosts } from '@/lib/wordpress';

export const revalidate = 86400; // Daily revalidation

const ARTICLE_URL = `${siteConfig.site_domain}/blog/ramadan-2026`;
const PUBLISH_DATE = '2026-02-12';

export const metadata: Metadata = {
    title: 'Ramadan 2026 Grocery Shortlist: Essential Foods for Suhoor & Iftar | Ideal Indiska',
    description: 'Stock up for Ramadan 2026 with our essential grocery checklist. From energy-boosting Suhoor staples to quick Iftar snacks, get everything you need at Ideal Indiska LIVS.',
    openGraph: {
        title: 'Ramadan 2026 Grocery Shortlist: Essential Foods for Suhoor & Iftar',
        description: 'Stock up for Ramadan 2026 with our essential grocery checklist. From energy-boosting Suhoor staples to quick Iftar snacks.',
        images: [{ url: 'https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg', width: 1200, height: 630, alt: 'Ramadan Suhoor Table' }],
        type: 'article',
    },
};

export default async function RamadanGroceryChecklist() {
    const currentYear = 2026;

    // Fetch Sidebar Data (Promotions & Recent Posts)
    let promotionProducts: any[] = [];
    let recentPosts: any[] = [];

    try {
        const [{ data: products }, posts] = await Promise.all([
            getProducts({ per_page: 5, on_sale: true, orderby: 'date', order: 'desc' }),
            getAllPosts().catch(() => [])
        ]);
        promotionProducts = products;
        recentPosts = posts;
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
    }

    // Schema for the article
    const schemaData = articleSchema({
        title: `Ramadan ${currentYear} Grocery Shortlist: Essential Foods for Suhoor & Iftar`,
        description: 'A complete guide to essential groceries for Ramadan in Sweden, featuring suhoor staples, iftar snacks, and hydrating drinks.',
        content: 'Ramadan grocery guide content...', // Simplified
        url: ARTICLE_URL,
        authorName: 'Ideal Indiska LIVS Team',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: `${PUBLISH_DATE}T08:00:00+01:00`,
        dateModified: `${PUBLISH_DATE}T08:00:00+01:00`,
        category: 'Guides',
        tags: ['Ramadan 2026', 'Grocery Guide', 'Suhoor', 'Iftar', 'Stockholm'],
        featuredImage: 'https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg',
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <section className="relative overflow-hidden h-[60vh] min-h-[500px]">
                <div className="absolute inset-0 h-full w-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                        alt={`Ramadan ${currentYear} Guide`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/30" />
                </div>

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl h-full flex flex-col justify-end pb-24 text-white">
                    <nav className="mb-6">
                        <ol className="flex items-center gap-2 text-sm text-white/80 font-medium">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li>/</li>
                            <li className="text-white">Seasonal Guides</li>
                        </ol>
                    </nav>

                    <Badge className="w-fit mb-6 bg-primary text-white border-none text-base px-4 py-1.5 rounded-full font-bold shadow-lg shadow-primary/20">
                        Ramadan Prep Guide
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-6 max-w-4xl tracking-tight leading-tight">
                        Ramadan {currentYear} Grocery Shortlist: Essential Foods for Suhoor & Iftar
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shrink-0 shadow-lg bg-background">
                                <Image
                                    src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png"
                                    alt="Ideal Indiska"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-lg text-white">Ideal Indiska Team</p>
                                <p className="text-sm text-white/70 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(PUBLISH_DATE).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full px-5 h-10 border-0">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ARTICLE_URL)}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-4 w-4 mr-2" /> Share
                                </a>
                            </Button>
                            <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-5 h-10 border-0">
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check this Ramadan guide: ' + ARTICLE_URL)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Article Content */}
                        <article className="lg:col-span-8">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-img:rounded-3xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline">

                                <p className="lead text-xl md:text-2xl text-foreground font-medium mb-12 border-l-4 border-primary pl-6 italic">
                                    Salam neighbor! 👋 Ramadan is just around the corner (starting Feb 17th!), and likely the long fasts in Stockholm mean you need <strong>real energy</strong> for Suhoor and <strong>quick, comforting bites</strong> for Iftar.
                                </p>

                                <p>
                                    Don't stress about the shopping list. We've curated the essentials—and yes, they're on sale right now. Let's get your pantry ready! 🌙
                                </p>

                                {/* Section 1 */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400">
                                            <Clock className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">1. The Thirst Quenchers (Iftar Must-Haves)</h2>
                                    </div>
                                    <p>
                                        After 12+ hours without water, that first sip is everything. Traditional sherbets aren't just about sugar; they replenish your energy levels instantly.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
                                        <ProductCard
                                            title="Hamdard Rooh Afza"
                                            desc="The classic 'Red Sharbat' of Ramadan. Milk, water, or yogurt—it works with everything."
                                            price="30 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                            link="/product/hamdard-rooh-afza-syrup-800-ml"
                                            badge="Essential"
                                        />
                                        <ProductCard
                                            title="Tang (Orange/Mango)"
                                            desc="Instant Vitamin C boost. Kids love it, and it's super refreshing cold."
                                            price="59 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                            link="/product/tang-mango-instant-drink-mix-2kg"
                                            badge="Family Pack"
                                        />
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                                            <Utensils className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">2. Suhoor Power: Heavy Carbohydrates</h2>
                                    </div>
                                    <p>
                                        For a Swedish Suhoor, you need "slow-burning" carbs that keep you full until Maghrib. Think heavy Rotis and simple Parathas.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
                                        <ProductCard
                                            title="Elephant Atta (25kg)"
                                            desc="The gold standard for soft, fluffy rotis that actually keep you full. A 25kg bag lasts the whole month."
                                            price="239 kr"
                                            originalPrice="299 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                            link="/product/elephant-atta-medium-25-kg"
                                            badge="Bulk Deal"
                                        />
                                        <ProductCard
                                            title="Alwaid Cooking Oil (5L)"
                                            desc="You'll be doing a lot of frying and cooking. Stock up on the 5L pack now."
                                            price="99 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                            link="/product/al-waid-cooking-oil-5-liter"
                                        />
                                    </div>
                                </div>

                                {/* Section 3 */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">3. The "Iftar Fry-Up" Kit</h2>
                                    </div>
                                    <p>
                                        Is it really Iftar without Pakoras? We didn't think so. Here are your frying essentials.
                                    </p>

                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100 dark:border-orange-900/40 rounded-[2rem] p-8 not-prose shadow-sm mt-8">
                                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                                            <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                                            Besan (Gram Flour) Deals
                                        </h3>
                                        <div className="space-y-4">
                                            <PromoItem
                                                name="TRS Gram Flour (1kg)"
                                                price="33 kr"
                                                desc="Premium quality, super fine."
                                                link="/product/trs-gram-flour-1kg"
                                            />
                                            <PromoItem
                                                name="TRS Gram Flour (2kg)"
                                                price="65 kr"
                                                desc="Double pack for big families."
                                                link="/product/trs-gram-flour-2-kg"
                                            />
                                            <PromoItem
                                                name="Alibaba Gram Flour (1kg)"
                                                price="25 kr"
                                                desc="Great value option!"
                                                link="/product/alibaba-gram-flour-1-kg"
                                            />
                                            <PromoItem
                                                name="Alibaba Gram Flour (2kg)"
                                                price="45 kr"
                                                desc="Best value bulk pack."
                                                link="/product/alibaba-gram-flour-2-kg"
                                            />
                                            <div className="pt-4 mt-4 border-t border-orange-200 dark:border-orange-800/30">
                                                <PromoItem
                                                    name="Phulki (250g)"
                                                    price="28 kr"
                                                    desc="Essential for Dahi Baray."
                                                    link="/product/phulki"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4 */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">4. Quick Hacks for Busy Evenings</h2>
                                    </div>
                                    <p>
                                        Running late from work? These life-savers go from freezer to plate in minutes.
                                    </p>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose mt-8">
                                        <ProductCard
                                            title="Crown Veg/Chicken Samosa (20pcs)"
                                            desc="Crispy, generous filling. Just fry and serve."
                                            price="59 kr"
                                            link="/product/crown-chicken-samosa-20-st"
                                            badge="Hot Seller"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                        />
                                        <ProductCard
                                            title="Crown Kebabs (Seekh/Reshmi/Shami)"
                                            desc="Restaurant quality at home. Try the Reshmi kebabs!"
                                            price="129 kr"
                                            link="/product/crown-reshmi-kebab-chicken-15stk"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                        />
                                        <ProductCard
                                            title="TJY Spring Roll Pastry"
                                            desc="Making your own? These sheets are perfectly thin and crispy."
                                            price="39 kr"
                                            link="/product/tjy-spring-rolls-215-mm-40-sheets"
                                            badge="30/40 Sheets"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Final CTA Section */}
                                <div className="bg-primary/5 rounded-[3rem] p-12 text-center border border-primary/10 mt-20 not-prose relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                        <Star className="w-64 h-64" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">Don't Forget the Sunnah</h2>
                                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                        Break your fast the traditional way. We have fresh, soft dates in stock ready for your table.
                                    </p>
                                    <div className="inline-flex flex-col items-center bg-background p-8 rounded-3xl shadow-lg border border-border/50 max-w-sm w-full relative z-10">
                                        <h3 className="text-xl font-bold text-foreground">Premium Dates (900g)</h3>
                                        <p className="text-4xl font-extrabold text-primary my-4">99 kr</p>
                                        <Button asChild size="lg" className="w-full rounded-full h-12 text-lg">
                                            <Link href="/product/dates-900g">Add to Cart</Link>
                                        </Button>
                                    </div>

                                    <div className="mt-12 pt-12 border-t border-primary/10">
                                        <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full h-14 px-8 text-lg font-bold transition-all">
                                            <Link href="/shop" className="flex items-center gap-2">
                                                Shop All Ramadan Deals <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-10">
                                {/* Promotions Widget */}
                                {promotionProducts.length > 0 && (
                                    <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-sm">
                                        <h3 className="text-xl font-heading font-bold text-primary mb-8 tracking-tight border-b border-border/40 pb-4">
                                            Trending Deals
                                        </h3>
                                        <div className="space-y-6">
                                            {promotionProducts.map((product) => (
                                                <Link key={product.id} href={`/product/${product.slug}`} className="flex gap-4 group items-center">
                                                    <div className="relative w-16 h-16 rounded-2xl bg-muted overflow-hidden shrink-0 border border-border/20">
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
                                        <Button asChild variant="outline" className="w-full mt-8 rounded-full h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold">
                                            <Link href="/shop?on_sale=true">View All Deals</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Location Widget */}
                                <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
                                    <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" /> Store Location
                                    </h3>
                                    <div className="rounded-[1.5rem] overflow-hidden mb-6 h-[200px] shadow-inner border border-border/10 relative">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.769278826918!2d18.048690399999998!3d59.2700036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77d07b5889cf%3A0xd20e7ba594e09663!2sIdeal%20Indiska%20Livs%20Bandhagen!5e0!3m2!1sen!2s!4v1765922506900!5m2!1sen!2s"
                                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground font-medium">
                                        <p className="text-foreground font-bold text-base">Ideal Indiska Livs</p>
                                        <p>Bandhagsplan 4, 12432 Bandhagen</p>
                                        <p className="text-primary pt-2 font-bold">Open Daily 10:00 - 20:00</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <SchemaScript id="ramadan-article-schema" schema={schemaData} />
        </div>
    );
}

// Helper Components
function ProductCard({ title, desc, price, originalPrice, link, badge, image }: any) {
    return (
        <Link href={link} className="block h-full">
            <Card className="overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full group border-border/60 rounded-[2rem]">
                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            Image
                        </div>
                    )}

                    {badge && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm uppercase tracking-wider">
                            {badge}
                        </span>
                    )}
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg mb-3 group-hover:text-primary transition-colors leading-tight">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                            {desc}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-border/50">
                        <div>
                            <span className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">{price}</span>
                            {originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2 opacity-60">{originalPrice}</span>
                            )}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function PromoItem({ name, price, desc, link }: any) {
    return (
        <Link href={link} className="flex items-start justify-between group p-3 rounded-xl hover:bg-background/50 hover:shadow-sm transition-all border border-transparent hover:border-border/30">
            <div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base block mb-0.5">
                    {name}
                </span>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <span className="font-bold text-primary whitespace-nowrap bg-primary/10 px-3 py-1.5 rounded-lg text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                {price}
            </span>
        </Link>
    );
}
