import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar, Facebook, MessageCircle,
    MapPin, ShoppingBag, Clock, Utensils,
    Wheat, Drumstick, Star, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProducts } from '@/lib/woocommerce/products-direct';
import { articleSchema } from '@/lib/schema/article';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { decodeHtmlEntities } from '@/lib/utils';
import { getAllPosts } from '@/lib/wordpress';
import { ProductCarousel } from './ProductCarousel';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-1.png';
const WISH_CARD = 'https://crm.ideallivs.com/wp-content/uploads/2026/02/ramadan-wish-card.png';
const ARTICLE_URL = `${siteConfig.site_domain}/blog/ramadan-2026`;
const PUBLISH_DATE = '2026-02-12';

export const metadata: Metadata = {
    title: 'Your Essential Ramadan Grocery Checklist for Stockholm | Ideal Indiska',
    description: 'Getting ready for Ramadan in Stockholm? Our essential grocery checklist has you covered! Find dates, Rooh Afza, atta, rice, frozen samosas & kebabs on mega savings at Ideal Indiska.',
    openGraph: {
        title: 'Your Essential Ramadan Grocery Checklist for Stockholm | Ideal Indiska',
        description: 'Getting ready for Ramadan in Stockholm? Our essential grocery checklist has you covered! Find dates, Rooh Afza, atta, rice, frozen samosas & kebabs on mega savings at Ideal Indiska.',
        images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Ramadan 2026 – Ideal Indiska Livs' }],
        type: 'article',
    },
};

export default async function RamadanBlogPost() {
    const currentYear = 2026;

    let carouselProducts: any[] = [];
    let promotionProducts: any[] = [];
    let recentPosts: any[] = [];

    try {
        const [{ data: saleProducts }, posts] = await Promise.all([
            getProducts({ per_page: 16, on_sale: true, orderby: 'date', order: 'desc' }),
            getAllPosts().catch(() => []),
        ]);
        // First 5 go to sidebar, all go to carousel
        promotionProducts = saleProducts.slice(0, 5);
        carouselProducts = saleProducts;
        recentPosts = posts;
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    const schemaData = articleSchema({
        title: `Your Essential Ramadan Grocery Checklist for Stockholm | Ideal Indiska`,
        description: 'A complete guide to essential groceries for Ramadan in Stockholm, featuring suhoor staples, iftar snacks, dates, drinks, and pantry essentials.',
        content: 'Ramadan grocery checklist content for Stockholm shoppers.',
        url: ARTICLE_URL,
        authorName: 'Ideal Indiska LIVS Team',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: `${PUBLISH_DATE}T08:00:00+01:00`,
        dateModified: `${PUBLISH_DATE}T08:00:00+01:00`,
        category: 'Guides',
        tags: ['Ramadan 2026', 'Grocery Guide', 'Suhoor', 'Iftar', 'Stockholm', 'Checklist'],
        featuredImage: FEATURE_IMAGE,
    });

    return (
        <div className="min-h-screen bg-background">

            {/* ─── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden h-[65vh] min-h-[520px]">
                <div className="absolute inset-0">
                    <Image
                        src={FEATURE_IMAGE}
                        alt={`Ramadan ${currentYear} – Ideal Indiska Livs`}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/55 to-black/20" />
                </div>

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl h-full flex flex-col justify-end pb-20 text-white">
                    <nav className="mb-5" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-white/75 font-medium">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li>/</li>
                            <li className="text-white/90">Seasonal Guides</li>
                        </ol>
                    </nav>

                    <Badge className="w-fit mb-5 bg-primary text-white border-none text-sm px-4 py-1.5 rounded-full font-bold shadow-lg shadow-primary/30 uppercase tracking-widest">
                        Ramadan {currentYear}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 max-w-4xl tracking-tight leading-[1.1]">
                        Your Essential Ramadan Grocery Checklist: Preparing for a Blessed Month in Stockholm
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-full border-2 border-white/25 overflow-hidden shrink-0 bg-white/10">
                                <Image
                                    src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png"
                                    alt="Ideal Indiska"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-white leading-tight">Ideal Indiska Team</p>
                                <p className="text-xs text-white/65 flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(PUBLISH_DATE).toLocaleDateString('en-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="flex items-center gap-3">
                            <Button asChild size="sm" className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full px-5 h-9 border-0 text-sm font-semibold">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ARTICLE_URL)}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-3.5 w-3.5 mr-1.5" /> Share
                                </a>
                            </Button>
                            <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-5 h-9 border-0 text-sm font-semibold">
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check this Ramadan guide: ' + ARTICLE_URL)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Ramadan Mubarak Banner ───────────────────────────── */}
            <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent" />
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-0 md:gap-8">
                        {/* Wish Card Image */}
                        <div className="relative w-full md:w-80 lg:w-96 shrink-0 aspect-[4/3] md:aspect-square">
                            <Image
                                src={WISH_CARD}
                                alt="Ramadan Mubarak – Ideal Indiska Livs"
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 100vw, 384px"
                            />
                        </div>
                        {/* Text */}
                        <div className="py-10 md:py-0 text-center md:text-left">
                            <p className="text-yellow-400 font-bold text-sm uppercase tracking-[0.2em] mb-3">رمضان كريم</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                                Ramadan Mubarak!
                            </h2>
                            <p className="text-emerald-100/80 text-lg leading-relaxed max-w-xl">
                                From our family to yours — wishing you a month filled with blessings, peace, and beautiful moments around the table. We're honored to be part of your Ramadan preparations.
                            </p>
                            <p className="text-yellow-400/80 font-semibold mt-4 text-base">
                                — The Team at Ideal Indiska Livs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Main Layout ─────────────────────────────────────── */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* ── Article ── */}
                        <article className="lg:col-span-8">

                            {/* Lead */}
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl">

                                <p className="text-xl md:text-2xl text-foreground font-medium border-l-4 border-primary pl-6 py-1 not-italic leading-relaxed mb-10">
                                    As the holy month of Ramadan approaches, a beautiful sense of anticipation fills the air. It's a time for reflection, prayer, community, and sharing delicious food with loved ones. From the pre-dawn meal of Suhoor to the joyous breaking of the fast at Iftar, a well-stocked kitchen is the heart of a smooth and blessed Ramadan.
                                </p>

                                <p>
                                    Here at Ideal Indiska, we understand the importance of having all your essential ingredients ready. We've put together a friendly grocery checklist inspired by our <strong>Ramadan Mega Savings</strong>, making it easier than ever to find everything you need right here in Stockholm.
                                </p>

                                {/* ── Section 1: Iftar Essentials ── */}
                                <SectionHeading
                                    icon={<Clock className="w-7 h-7" />}
                                    iconBg="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                                    number="1"
                                    title="The Iftar Table Essentials: Breaking the Fast"
                                />

                                <p>
                                    The moment the sun sets, breaking the fast is a sacred ritual. The Prophet's tradition of breaking fast with dates and water is both spiritually meaningful and nutritionally wise. These items are absolute must-haves.
                                </p>

                                <h3>Dates (Khajoor) — The Sunnah Starter</h3>
                                <p>
                                    The tradition of breaking the fast begins with dates. They are a natural source of energy and nutrients, perfect for gently replenishing the body after a long fast. We have beautiful, succulent <strong>Petra Jordanian Dates (900g)</strong> on special offer to grace your Iftar table.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
                                    <FeaturedProductCard
                                        title="Petra Jordanian Dates (900g)"
                                        desc="Premium soft Jordanian dates. The traditional and sunnah way to break your fast."
                                        badge="Sunnah Essential"
                                        badgeColor="amber"
                                        link="/product/petra-jordanian-dates-900g"
                                        icon={<Star className="w-8 h-8" />}
                                        iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                    />
                                    <FeaturedProductCard
                                        title="Mixed Fresh Dates"
                                        desc="A delightful variety of soft, sweet dates perfect for your Iftar spread."
                                        link="/product-category/dates"
                                        icon={<Star className="w-8 h-8" />}
                                        iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                    />
                                </div>

                                <h3>Refreshing Drinks (Sharbat)</h3>
                                <p>
                                    After a long day of fasting, rehydration is key. A classic, cooling sharbat is the perfect way to do it. These iconic drinks are a nostalgic and instantly refreshing choice.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
                                    <FeaturedProductCard
                                        title="Hamdard Rooh Afza (800ml)"
                                        desc="The classic 'Red Sharbat' of Ramadan. Works beautifully with milk, water, or yogurt."
                                        badge="Ramadan Classic"
                                        badgeColor="primary"
                                        link="/product/hamdard-rooh-afza-syrup-800-ml"
                                        icon={<Utensils className="w-8 h-8" />}
                                        iconBg="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                                    />
                                    <FeaturedProductCard
                                        title="Tang Mango / Orange (2kg)"
                                        desc="Instant Vitamin C boost. Kids love it — super refreshing served ice cold."
                                        badge="Family Pack"
                                        badgeColor="orange"
                                        link="/product/tang-mango-instant-drink-mix-2kg"
                                        icon={<Utensils className="w-8 h-8" />}
                                        iconBg="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                    />
                                </div>

                                {/* ── Section 2: Appetizers ── */}
                                <SectionHeading
                                    icon={<ShoppingBag className="w-7 h-7" />}
                                    iconBg="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                    number="2"
                                    title="Quick & Delicious Appetizers: For When You're Short on Time"
                                />

                                <p>
                                    Iftar is often a time for gathering, and having quick, easy, and delicious appetizers on hand is a lifesaver. Our frozen selection is perfect for busy evenings — from freezer to plate in minutes.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
                                    <FeaturedProductCard
                                        title="Chicken Samosas (20 pcs)"
                                        desc="Crispy golden samosas with generous chicken filling. Just fry or air-fry and serve."
                                        badge="Hot Seller"
                                        badgeColor="primary"
                                        link="/product/crown-chicken-samosa-20-st"
                                        icon={<Drumstick className="w-8 h-8" />}
                                        iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                    />
                                    <FeaturedProductCard
                                        title="Vegetable Samosas (20 pcs)"
                                        desc="Classic veg samosas — perfectly spiced potato and pea filling."
                                        link="/product/crown-vegetable-samosa-20pcs"
                                        icon={<Drumstick className="w-8 h-8" />}
                                        iconBg="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    />
                                    <FeaturedProductCard
                                        title="Seekh Kebabs"
                                        desc="Tender, flavorful, and quick to prepare. Perfect with mint chutney at Iftar."
                                        link="/product/crown-reshmi-kebab-chicken-15stk"
                                        icon={<Drumstick className="w-8 h-8" />}
                                        iconBg="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                    />
                                </div>

                                <div className="not-prose bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-border/50 rounded-3xl p-7 my-8">
                                    <h4 className="font-heading font-bold text-lg text-foreground mb-5 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-xs font-bold">✦</span>
                                        Also Great for Iftar
                                    </h4>
                                    <div className="space-y-3">
                                        <PromoItem
                                            name="Spring Home TYJ Spring Roll Pastry (30 sheets)"
                                            desc="Perfectly thin sheets for your own custom-filled spring rolls."
                                            link="/product/tjy-spring-rolls-215-mm-40-sheets"
                                        />
                                        <PromoItem
                                            name="Crown Reshmi Chicken Kebab"
                                            desc="Restaurant quality at home — try the creamy Reshmi marinade."
                                            link="/product/crown-reshmi-kebab-chicken-15stk"
                                        />
                                        <PromoItem
                                            name="Phulki (250g)"
                                            desc="Essential for Dahi Baray — a Ramadan table staple."
                                            link="/product/phulki"
                                        />
                                    </div>
                                </div>

                                {/* ── Section 3: Pantry Staples ── */}
                                <SectionHeading
                                    icon={<Wheat className="w-7 h-7" />}
                                    iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                    number="3"
                                    title="Pantry Staples for Suhoor & Iftar Meals"
                                />

                                <p>
                                    A well-stocked pantry is your best friend during Ramadan. These bulk items will see you through the entire month without a last-minute store run.
                                </p>

                                <h3>Atta — Whole Wheat Flour</h3>
                                <p>
                                    For soft, fresh rotis and parathas to accompany your Suhoor and Iftar curries. Having a large bag means you'll never run out mid-month.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-6">
                                    <FeaturedProductCard
                                        title="Fortune Chakki Fresh Atta (5kg)"
                                        desc="Stone-ground whole wheat for the softest, most pliable rotis."
                                        link="/product/fortune-chakki-fresh-atta-5-kg"
                                        icon={<Wheat className="w-8 h-8" />}
                                        iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                    />
                                    <FeaturedProductCard
                                        title="Elephant Atta Medium (25kg)"
                                        desc="The gold standard for families. A 25kg bag lasts the whole month — on special offer now."
                                        badge="Bulk Deal"
                                        badgeColor="primary"
                                        link="/product/elephant-atta-medium-25-kg"
                                        icon={<Wheat className="w-8 h-8" />}
                                        iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                    />
                                </div>

                                <h3>Basmati Rice — The Festive Grain</h3>
                                <p>
                                    No festive meal is complete without fragrant basmati rice. It's the foundation for Pulao, Biryani, or served simply with a rich curry.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-6">
                                    <FeaturedProductCard
                                        title="Guard Ultimate Basmati Rice (5kg)"
                                        desc="Premium long-grain basmati with a beautiful aroma. Perfect for biryani and pulao."
                                        link="/product/guard-ultimate-basmati-rice-5-kg"
                                        icon={<ShoppingBag className="w-8 h-8" />}
                                        iconBg="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    />
                                    <FeaturedProductCard
                                        title="Kaalar 1121 Basmati Rice (5kg)"
                                        desc="Extra-long super basmati — fluffy, fragrant, and non-sticky."
                                        link="/product/kaalar-1121-basmati-rice-5-kg"
                                        icon={<ShoppingBag className="w-8 h-8" />}
                                        iconBg="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                                    />
                                </div>

                                <h3>The Iftar Fry-Up Kit</h3>
                                <p>
                                    Is it really Iftar without pakoras? We didn't think so. Gram flour (Besan) is the soul of Ramadan snacking.
                                </p>

                                <div className="not-prose bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/40 rounded-3xl p-7 my-8">
                                    <h4 className="text-lg font-heading font-bold mb-5 text-foreground flex items-center gap-2">
                                        <span className="text-orange-500">✦</span> Gram Flour (Besan) Deals
                                    </h4>
                                    <div className="space-y-3">
                                        <PromoItem name="TRS Gram Flour (1kg)" desc="Premium quality, super fine texture." link="/product/trs-gram-flour-1kg" />
                                        <PromoItem name="TRS Gram Flour (2kg)" desc="Double pack for big families." link="/product/trs-gram-flour-2-kg" />
                                        <PromoItem name="Alibaba Gram Flour (1kg)" desc="Great everyday value option." link="/product/alibaba-gram-flour-1-kg" />
                                        <PromoItem name="Alibaba Gram Flour (2kg)" desc="Best value bulk pack for the month." link="/product/alibaba-gram-flour-2-kg" />
                                    </div>
                                    <div className="mt-5 pt-5 border-t border-orange-200 dark:border-orange-800/30">
                                        <PromoItem
                                            name="Guard Sunflower Oil (5L)"
                                            desc="With all the delicious frying you'll be doing, stock up now."
                                            link="/product/guard-sunflower-oil-5-liter"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* ── Product Carousel (full-width, outside prose) ── */}
                            <div className="mt-4">
                                <ProductCarousel products={carouselProducts} />
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline mt-4">

                                {/* ── Section 4: Snacks ── */}
                                <SectionHeading
                                    icon={<CheckCircle2 className="w-7 h-7" />}
                                    iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    number="4"
                                    title="Don't Forget the Snacks!"
                                />

                                <p>
                                    For lighter cravings between prayers or to serve to guests, having some ready-to-eat snacks is always a good idea. A bowl of classic <strong>Namkeen / Savouries</strong> is perfect to have on hand throughout the month.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
                                    <FeaturedProductCard
                                        title="Namkeen & Savouries"
                                        desc="Classic South Asian mix — light, spiced, and perfect for guests or between prayers."
                                        link="/product-category/indian-snacks"
                                        badge="Crowd Favourite"
                                        badgeColor="primary"
                                        icon={<Star className="w-8 h-8" />}
                                        iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                    />
                                    <FeaturedProductCard
                                        title="Qarshi Jam-e-Shirin"
                                        desc="A nostalgic herbal sherbet — beloved across generations for Iftar."
                                        link="/product/qarshi-jam-e-shirin"
                                        icon={<Utensils className="w-8 h-8" />}
                                        iconBg="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                                    />
                                </div>

                                {/* ── Final CTA ── */}
                                <div className="not-prose relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-[2.5rem] border border-primary/15 p-10 md:p-14 text-center mt-16">
                                    {/* Decorative */}
                                    <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                                    <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

                                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Don't Forget the Sunnah</p>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 relative z-10">
                                        Break Your Fast the Traditional Way
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed relative z-10">
                                        We have premium soft dates in stock, ready for your Iftar table. Start with a date, a glass of water, and a prayer.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Button asChild size="lg" className="rounded-full h-13 px-8 text-base font-bold shadow-lg shadow-primary/20">
                                            <Link href="/product/petra-jordanian-dates-900g" className="flex items-center gap-2">
                                                Shop Dates <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="rounded-full h-13 px-8 text-base font-bold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all">
                                            <Link href="/deals" className="flex items-center gap-2">
                                                All Ramadan Deals <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* ── Sign Off ── */}
                                <div className="not-prose mt-14 pt-10 border-t border-border/40">
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        We at Ideal Indiska are honoured to be a part of your Ramadan preparations. Our <strong className="text-foreground">Ramadan Mega Savings</strong> are here to help you stock your kitchen with authentic, high-quality ingredients without breaking your budget.
                                    </p>
                                    <p className="text-muted-foreground mt-4 leading-relaxed">
                                        Visit us at our store in <strong className="text-foreground">Bandhagen Centrum</strong>, or shop online at <a href="https://www.ideallivs.com" className="text-primary font-semibold hover:underline">www.ideallivs.com</a>. You can also reach us on WhatsApp at <a href="https://wa.me/46728494801" className="text-primary font-semibold hover:underline">+46 728 494 801</a>.
                                    </p>
                                    <p className="mt-6 text-foreground font-semibold">
                                        Wishing you and your family a peaceful, blessed, and delicious Ramadan!
                                    </p>
                                    <p className="text-primary font-bold mt-1">— The Team at Ideal Indiska Livs 🌙</p>
                                </div>

                            </div>
                        </article>

                        {/* ── Sidebar ── */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8">

                                {/* Trending Deals */}
                                {promotionProducts.length > 0 && (
                                    <div className="bg-card border border-border/50 rounded-3xl p-7 shadow-sm">
                                        <h3 className="text-lg font-heading font-bold text-foreground mb-1 tracking-tight">
                                            Trending Deals
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-6">Products on promotion right now</p>
                                        <div className="space-y-5">
                                            {promotionProducts.map((product) => (
                                                <Link key={product.id} href={`/product/${product.slug}`} className="flex gap-4 group items-center">
                                                    <div className="relative w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/20">
                                                        {product.images?.[0] && (
                                                            <Image
                                                                src={product.images[0].src}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                sizes="56px"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                                                            {decodeHtmlEntities(product.name)}
                                                        </h4>
                                                        <p className="text-primary font-bold text-sm">{product.price} SEK</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <Button asChild variant="outline" className="w-full mt-7 rounded-full h-11 border-primary/25 text-primary hover:bg-primary/5 font-semibold text-sm">
                                            <Link href="/deals">View All Deals</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Quick Checklist */}
                                <div className="bg-card border border-border/50 rounded-3xl p-7 shadow-sm">
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-5 tracking-tight">
                                        Quick Checklist
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {[
                                            'Petra Jordanian Dates (900g)',
                                            'Rooh Afza / Tang',
                                            'Elephant Atta (25kg)',
                                            'Basmati Rice (5kg)',
                                            'Gram Flour (Besan)',
                                            'Chicken Samosas (20pcs)',
                                            'Seekh Kebabs',
                                            'Cooking Oil (5L)',
                                            'Namkeen Snacks',
                                            'Spring Roll Pastry',
                                        ].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span className="w-4 h-4 rounded border-2 border-primary/40 shrink-0 flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className="w-full mt-7 rounded-full h-11 font-semibold text-sm">
                                        <Link href="/deals">Shop All Items</Link>
                                    </Button>
                                </div>

                                {/* Store Location */}
                                <div className="bg-card border border-border/50 rounded-3xl p-7 shadow-sm overflow-hidden">
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-5 flex items-center gap-2 tracking-tight">
                                        <MapPin className="h-4.5 w-4.5 text-primary" /> Store Location
                                    </h3>
                                    <div className="rounded-2xl overflow-hidden mb-5 h-[180px] border border-border/10">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.769278826918!2d18.048690399999998!3d59.2700036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77d07b5889cf%3A0xd20e7ba594e09663!2sIdeal%20Indiska%20Livs%20Bandhagen!5e0!3m2!1sen!2s!4v1765922506900!5m2!1sen!2s"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Ideal Indiska Livs location"
                                        />
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p className="text-foreground font-bold text-base">Ideal Indiska Livs</p>
                                        <p>Bandhagsplan 4, 12432 Bandhagen</p>
                                        <p className="text-primary font-semibold pt-2">Open Daily 10:00 – 20:00</p>
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

// ─── Helper Components ────────────────────────────────────────────────────────

function SectionHeading({
    icon, iconBg, number, title,
}: {
    icon: React.ReactNode;
    iconBg: string;
    number: string;
    title: string;
}) {
    return (
        <div className="not-prose flex items-start gap-4 mt-16 mb-6">
            <div className={`p-3 rounded-2xl shrink-0 ${iconBg}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Section {number}</p>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">{title}</h2>
            </div>
        </div>
    );
}

function FeaturedProductCard({
    title, desc, link, badge, badgeColor = 'primary', icon, iconBg,
}: {
    title: string;
    desc: string;
    link: string;
    badge?: string;
    badgeColor?: 'primary' | 'amber' | 'orange' | 'green';
    icon: React.ReactNode;
    iconBg: string;
}) {
    const badgeClasses: Record<string, string> = {
        primary: 'bg-primary/10 text-primary',
        amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    };

    return (
        <Link href={link} className="block group">
            <div className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>
                        {icon}
                    </div>
                    {badge && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClasses[badgeColor]} shrink-0`}>
                            {badge}
                        </span>
                    )}
                </div>
                <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-primary text-xs font-bold">
                    View product <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </Link>
    );
}

function PromoItem({ name, desc, link }: { name: string; desc: string; link: string }) {
    return (
        <Link
            href={link}
            className="flex items-start justify-between gap-4 group p-3.5 rounded-xl hover:bg-background/70 hover:shadow-sm transition-all border border-transparent hover:border-border/30"
        >
            <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block mb-0.5 leading-snug">
                    {name}
                </span>
                <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
        </Link>
    );
}
