
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar, Facebook, Twitter, Linkedin, Mail, MessageCircle,
    MapPin, CheckCircle2, ShoppingBag, Clock, Utensils, Star,
    ArrowRight, Droplets, Snowflake, CakeSlice
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

export const revalidate = 86400;

const ARTICLE_URL = `${siteConfig.site_domain}/blog/ramadan-2026`;
const PUBLISH_DATE = '2026-02-12';

export const metadata: Metadata = {
    title: 'Ramadan 2026 Grocery Shortlist: Essential Foods for Suhoor & Iftar in Stockholm | Ideal Indiska',
    description: 'Your complete Ramadan 2026 grocery checklist for Stockholm. From Suhoor energy staples to Iftar favorites like dates, Rooh Afza, samosas & kebabs. All on sale at Ideal Indiska LIVS Bandhagen.',
    openGraph: {
        title: 'Ramadan 2026 Grocery Shortlist: Essential Foods for Suhoor & Iftar',
        description: 'Your complete Ramadan 2026 grocery checklist for Stockholm. Suhoor staples, Iftar favorites, and frozen shortcuts — all on sale.',
        images: [{ url: 'https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png', width: 1200, height: 630, alt: 'Ramadan Suhoor Table' }],
        type: 'article',
    },
};

export default async function RamadanGroceryChecklist() {
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

    const schemaData = articleSchema({
        title: 'Ramadan 2026 Grocery Shortlist: Essential Foods for Suhoor & Iftar in Stockholm',
        description: 'A complete guide to essential groceries for Ramadan 2026 in Sweden, featuring suhoor staples, iftar drinks, frozen shortcuts, and sweet endings.',
        content: 'Ramadan grocery guide for the South Asian community in Stockholm.',
        url: ARTICLE_URL,
        authorName: 'Ideal Indiska LIVS Team',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: `${PUBLISH_DATE}T08:00:00+01:00`,
        dateModified: `${PUBLISH_DATE}T08:00:00+01:00`,
        category: 'Guides',
        tags: ['Ramadan 2026', 'Grocery Guide', 'Suhoor', 'Iftar', 'Stockholm', 'Swedish Ramadan', 'Halal Food'],
        featuredImage: 'https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png',
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden h-[60vh] min-h-[500px]">
                <div className="absolute inset-0 h-full w-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png"
                        alt="Ramadan 2026 Suhoor & Iftar Guide"
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
                        Ramadan 2026
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-6 max-w-4xl tracking-tight leading-tight">
                        Your Ramadan Grocery Shortlist for Stockholm
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
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
                                    February 12, 2026
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full px-5 h-10 border-0">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ARTICLE_URL)}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-4 w-4 mr-2" /> Share
                                </a>
                            </Button>
                            <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-5 h-10 border-0">
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Ramadan grocery checklist for Stockholm: ' + ARTICLE_URL)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Article */}
                        <article className="lg:col-span-8">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-img:rounded-3xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline">

                                <p className="lead text-xl md:text-2xl text-foreground font-medium mb-12 border-l-4 border-primary pl-6 italic">
                                    Ramadan Mubarak, Stockholm! This year, the first fast begins around February 28th, with fasts stretching from roughly 7 AM to 5:30 PM. That&apos;s over 10 hours without food or water during the coldest month of the Swedish year. Your pantry needs to work <strong>hard</strong>.
                                </p>

                                <p>
                                    Whether you&apos;re a seasoned pro or this is your first Ramadan away from home, we&apos;ve put together a no-nonsense grocery list based on what our customers actually buy every year. No fluff, just the essentials &mdash; and most of them are on sale right now.
                                </p>

                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 not-prose my-8">
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Stockholm Ramadan 2026 at a Glance
                                    </h3>
                                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                        <div className="bg-background rounded-xl p-4 border border-border/50">
                                            <p className="font-bold text-foreground">First Fast</p>
                                            <p className="text-muted-foreground">~Feb 28, 2026</p>
                                        </div>
                                        <div className="bg-background rounded-xl p-4 border border-border/50">
                                            <p className="font-bold text-foreground">Fasting Hours</p>
                                            <p className="text-muted-foreground">~10-12 hrs (growing)</p>
                                        </div>
                                        <div className="bg-background rounded-xl p-4 border border-border/50">
                                            <p className="font-bold text-foreground">Eid al-Fitr</p>
                                            <p className="text-muted-foreground">~March 30, 2026</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ====== SECTION 1: BREAK YOUR FAST ====== */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400">
                                            <Droplets className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">1. Break Your Fast the Right Way</h2>
                                    </div>
                                    <p>
                                        The Sunnah is to break your fast with dates and water. After that first bite, your body craves hydration &mdash; not heavy food. A cold glass of Rooh Afza or Tang is the fastest way to feel human again. <strong>Save the biryani for 30 minutes later.</strong>
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-6 not-prose mt-8">
                                        <ProductCard
                                            title="Petra Jordanian Dates (900g)"
                                            desc="Premium Class 1 Medjool-style dates from Jordan. Soft, plump, and perfect for Iftar. One box lasts most families the whole month."
                                            price="99 kr"
                                            originalPrice="105 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2025/06/Premium-Jordanian-Medjool-Dates-900g-Natural-Sweet-Iftar-Energy-Boost.png"
                                            link="/product/petra-class-1-jordanian-dates"
                                            badge="Sunnah"
                                        />
                                        <ProductCard
                                            title="Hamdard Rooh Afza (800ml)"
                                            desc="The iconic pink sharbat. Mix with cold water, milk, or use it in falooda. One bottle = hundreds of glasses. A Ramadan table without Rooh Afza isn't a Ramadan table."
                                            price="30 kr"
                                            originalPrice="40 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2025/05/rooh-afzah.png"
                                            link="/product/hamdard-rooh-afza-syrup-800-ml"
                                            badge="25% Off"
                                        />
                                        <ProductCard
                                            title="Tang Mango Powder (750g)"
                                            desc="When the kids won't drink water, Tang saves the day. Makes about 6 litres per pack. Also available in Orange."
                                            price="59 kr"
                                            originalPrice="75 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2025/05/rooh-afzah.png"
                                            link="/product/tang-mango"
                                            badge="Family Size"
                                        />
                                    </div>
                                </div>

                                {/* ====== SECTION 2: SUHOOR POWER ====== */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                                            <Utensils className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">2. Suhoor: The Meal That Carries You</h2>
                                    </div>
                                    <p>
                                        Here&apos;s the truth about Suhoor in Sweden: you&apos;re eating at 5 AM in the dark, half asleep, and you need something that will keep you full until Maghrib. Forget fancy recipes. You need <strong>good atta for thick parathas</strong>, <strong>rice for leftover biryani</strong>, and <strong>eggs</strong> (grab those from ICA).
                                    </p>
                                    <p>
                                        A paratha with a fried egg and a glass of milk will carry you further than any energy bar. That&apos;s our experience, and the sales numbers prove it &mdash; atta is our #1 seller every Ramadan.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
                                        <ProductCard
                                            title="Elephant Atta (25kg)"
                                            desc="The undisputed champion of chapati flour. This 25kg bag is what serious roti-makers buy. Soft, pliable dough every single time. One bag = the entire month sorted."
                                            price="239 kr"
                                            originalPrice="290 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png"
                                            link="/product/elephant-atta-medium-25-kg"
                                            badge="Best Seller"
                                        />
                                        <ProductCard
                                            title="Fortune Chakki Fresh Atta (5kg)"
                                            desc="Don't need 25kg? Fortune's 5kg bag is perfect for smaller families. Stone-ground whole wheat that makes rotis so soft they don't even need ghee. (But add the ghee anyway.)"
                                            price="85 kr"
                                            originalPrice="99 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2025/04/fortune-fresh-chakki-atta-5-kg.png"
                                            link="/product/fortune-chakki-fresh-atta-5-kg"
                                            badge="On Sale"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 not-prose mt-6">
                                        <ProductCard
                                            title="India Gate Exotic Basmati Rice (5kg)"
                                            desc="The longest grain basmati you'll find in Stockholm. Whether it's Suhoor leftover biryani or a quick Iftar pulao, this rice delivers restaurant-quality results at home."
                                            price="159 kr"
                                            originalPrice="175 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2025/05/india-gate-extra-long-basmati-rice.png"
                                            link="/product/ig-exotic-basmati-rice-5kg"
                                            badge="Premium"
                                        />
                                        <ProductCard
                                            title="Elephant Atta (10kg)"
                                            desc="The middle ground. Too much for one person, perfect for a couple or small family. Same premium Elephant quality."
                                            price="160 kr"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png"
                                            link="/product/elephant-atta-medium-10-kg"
                                        />
                                    </div>
                                </div>

                                {/* ====== SECTION 3: IFTAR FRY-UP KIT ====== */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">3. The Iftar Fry-Up Kit</h2>
                                    </div>
                                    <p>
                                        Let&apos;s be honest: Iftar without pakoras is just dinner. And pakoras need besan (gram flour). We sell more besan in Ramadan than the rest of the year combined. Here&apos;s what you need for the classic Iftar spread:
                                    </p>

                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100 dark:border-orange-900/40 rounded-[2rem] p-8 not-prose shadow-sm mt-8">
                                        <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2">
                                            <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                                            Besan & Frying Essentials
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-6">Everything you need for pakoras, bhajias, and dahi baray</p>
                                        <div className="space-y-4">
                                            <PromoItem
                                                name="TRS Gram Flour (1kg)"
                                                price="33 kr"
                                                originalPrice="42 kr"
                                                desc="Premium fine-ground besan. The go-to for crispy pakoras."
                                                link="/product/trs-gram-flour-1kg"
                                            />
                                            <PromoItem
                                                name="TRS Gram Flour (2kg)"
                                                price="65 kr"
                                                originalPrice="82 kr"
                                                desc="Double pack. If you're making pakoras every day (no judgement), get this."
                                                link="/product/trs-gram-flour-2-kg"
                                            />
                                            <PromoItem
                                                name="Fortune Gram Flour (1kg)"
                                                price="38 kr"
                                                desc="Budget-friendly alternative. Great for ladoos too."
                                                link="/product/fortune-gram-flour-1kg"
                                            />
                                            <div className="pt-4 mt-4 border-t border-orange-200 dark:border-orange-800/30">
                                                <PromoItem
                                                    name="Spring Roll Pastry 250mm (30 sheets)"
                                                    price="39 kr"
                                                    originalPrice="60 kr"
                                                    desc="For spring rolls and samosa patti. Thin, crispy perfection."
                                                    link="/product/tjy-spring-rolls-250-mm-30-sheets"
                                                />
                                                <PromoItem
                                                    name="Spring Roll Pastry 215mm (40 sheets)"
                                                    price="39 kr"
                                                    originalPrice="50 kr"
                                                    desc="Smaller size, more sheets. Better for mini rolls."
                                                    link="/product/tjy-spring-rolls-215-mm-40-sheets"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ====== SECTION 4: FREEZER HEROES ====== */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                            <Snowflake className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">4. Freezer-to-Table in 15 Minutes</h2>
                                    </div>
                                    <p>
                                        Real talk: by week two, you won&apos;t have the energy to cook everything from scratch. That&apos;s not laziness, that&apos;s Ramadan. Our Crown frozen range is specifically designed for this &mdash; restaurant-quality kebabs and samosas that go from freezer to plate in minutes.
                                    </p>
                                    <p>
                                        <strong>Pro tip from our customers:</strong> Buy 3-4 packs of each at the start of Ramadan. They always sell out by week two.
                                    </p>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose mt-8">
                                        <ProductCard
                                            title="Crown Chicken Samosa (20 pcs)"
                                            desc="Crispy pastry, generous chicken filling. Deep fry from frozen for 5 minutes. Done. The whole family fights over the last one."
                                            price="59 kr"
                                            originalPrice="69.90 kr"
                                            link="/product/crown-chicken-samosa-20-st"
                                            badge="Top Seller"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png"
                                        />
                                        <ProductCard
                                            title="Crown Veg Samosa (20 pcs)"
                                            desc="Same crispy shell, filled with spiced potato and peas. Perfect for vegetarian guests or just because they're that good."
                                            price="59 kr"
                                            originalPrice="69.90 kr"
                                            link="/product/crown-veg-samosa-20-st"
                                            badge="Vegetarian"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png"
                                        />
                                        <ProductCard
                                            title="Crown Reshmi Kebab (15 pcs)"
                                            desc="Silky, melt-in-your-mouth chicken kebabs. The 'Reshmi' (silky) name is not marketing, it's accurate. Pan fry with a squeeze of lemon."
                                            price="129 kr"
                                            originalPrice="150 kr"
                                            link="/product/crown-reshmi-kebab-chicken-15stk"
                                            badge="Premium"
                                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-e1770940659874.png"
                                        />
                                    </div>

                                    <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 not-prose mt-8">
                                        <h3 className="text-lg font-heading font-bold text-foreground mb-4">More from the Crown Freezer Range</h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <PromoItem
                                                name="Crown Seekh Kebab Chicken (15 pcs)"
                                                price="129 kr"
                                                originalPrice="150 kr"
                                                desc="Classic seekh kebabs. Grill or pan fry."
                                                link="/product/crown-seekh-kebab-chicken-15-pcs"
                                            />
                                            <PromoItem
                                                name="Crown Seekh Kebab with Cheese (15 pcs)"
                                                price="129 kr"
                                                originalPrice="150 kr"
                                                desc="Cheese-stuffed seekh kebabs. Kids go crazy for these."
                                                link="/product/crown-special-seekh-kebab-chicken-15-pcs"
                                            />
                                            <PromoItem
                                                name="Crown Shami Kebab (15 pcs)"
                                                price="95 kr"
                                                desc="Dense, spiced lentil-and-chicken patties."
                                                link="/product/crown-shami-kebab-chicken-15-st"
                                            />
                                            <PromoItem
                                                name="Crown Chapli Kebab (12 pcs)"
                                                price="100 kr"
                                                desc="Peshawari-style flat kebabs with tomatoes."
                                                link="/product/crown-chapli-kebab-chicken-12-st"
                                            />
                                            <PromoItem
                                                name="Crown Green Chilli Seekh Kebab (15 pcs)"
                                                price="129 kr"
                                                originalPrice="150 kr"
                                                desc="For those who like it hot."
                                                link="/product/crown-green-chilli-seekh-kebab-chicken-15-st"
                                            />
                                            <PromoItem
                                                name="Crown Seekh Kebab Lamb (15 pcs)"
                                                price="185 kr"
                                                desc="Premium lamb seekh. Worth every krona."
                                                link="/product/crown-seekh-kebab-lamb-15-pcs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ====== SECTION 5: SWEET ENDINGS ====== */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl text-pink-600 dark:text-pink-400">
                                            <CakeSlice className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">5. Sweet Endings: Kheer, Falooda & Sewaiyan</h2>
                                    </div>
                                    <p>
                                        No Iftar is complete without something sweet. Vermicelli kheer (sewaiyan) is the quintessential Ramadan dessert across South Asia &mdash; quick to make, comforting to eat, and it feeds a crowd. Add Rooh Afza to milk with basil seeds for a quick falooda that takes 2 minutes.
                                    </p>

                                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/10 border border-pink-100 dark:border-pink-900/40 rounded-[2rem] p-8 not-prose shadow-sm mt-8">
                                        <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2">
                                            <Star className="w-5 h-5 fill-pink-400 text-pink-400" />
                                            Dessert Essentials
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-6">Everything for kheer, falooda, and sweet sewaiyan</p>
                                        <div className="space-y-4">
                                            <PromoItem
                                                name="Shan Vermicelli (150g)"
                                                price="10 kr"
                                                desc="Fine vermicelli for classic milk sewaiyan."
                                                link="/product/shan-vermicelli-150-gm"
                                            />
                                            <PromoItem
                                                name="MTR Roasted Vermicelli (440g)"
                                                price="25 kr"
                                                desc="Pre-roasted for richer flavour. Just add milk and sugar."
                                                link="/product/mtr-roasted-vermicelli-440g"
                                            />
                                            <PromoItem
                                                name="Ahmed Kheer Mix (160g)"
                                                price="20 kr"
                                                desc="Instant kheer. Add milk, boil, done. Perfect for busy evenings."
                                                link="/product/ahmed-kheer-mix-plain"
                                            />
                                            <PromoItem
                                                name="Alibaba Pheni (150g)"
                                                price="20 kr"
                                                desc="Crispy vermicelli nest for pheni kheer &mdash; a Ramadan classic."
                                                link="/product/ab-pheni-150g"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ====== SECTION 6: PRACTICAL TIPS ====== */}
                                <div className="mt-16 mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-bold m-0">6. Stockholm Ramadan Survival Tips</h2>
                                    </div>

                                    <div className="not-prose space-y-4 mt-6">
                                        <TipCard
                                            title="Shop in Week 1, Not Week 3"
                                            text="Every year, the popular items (dates, frozen samosas, Rooh Afza) sell out by the second week. We restock, but supply chains from Pakistan and India aren't instant. Shop early."
                                        />
                                        <TipCard
                                            title="Batch Cook & Freeze on Weekends"
                                            text="Make a big batch of samosa filling, kebab mix, or paratha dough on Saturday. Freeze in portions. Weekday Iftars become 10-minute affairs."
                                        />
                                        <TipCard
                                            title="Don't Skip Suhoor"
                                            text="Swedish Ramadan fasts aren't as long as summer ones, but skipping Suhoor is still a bad idea. Even two parathas with chai will make a massive difference by 3 PM."
                                        />
                                        <TipCard
                                            title="Hydrate Between Iftar & Suhoor"
                                            text="Stockholm tap water is excellent. Keep a bottle nearby and sip throughout the evening. Your body needs to store water for the next day."
                                        />
                                    </div>
                                </div>

                                {/* ====== FINAL CTA ====== */}
                                <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12 text-center border border-primary/10 mt-20 not-prose relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                        <Star className="w-64 h-64" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">Ready to Stock Up?</h2>
                                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                                        All these products are available at our store in Bandhagen Centrum and online with delivery across Stockholm and Sweden. Ramadan sale prices are valid while stocks last.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold">
                                            <Link href="/shop?on_sale=true" className="flex items-center gap-2">
                                                <ShoppingBag className="w-5 h-5" /> Shop Ramadan Deals
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full h-14 px-10 text-lg font-bold transition-all">
                                            <Link href="/shop" className="flex items-center gap-2">
                                                Browse Full Store <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <p className="text-sm text-muted-foreground mt-8">
                                        Visit us: <strong>Bandhagsplan 4, 12432 Bandhagen</strong> &middot; Open Daily 10:00 - 20:00 &middot; <a href="tel:+46728494801" className="text-primary font-semibold">+46 728 494 801</a>
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-10">
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

                                <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
                                    <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" /> Visit Our Store
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

                                {recentPosts && recentPosts.length > 0 && (
                                    <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-sm">
                                        <h3 className="text-xl font-heading font-bold text-foreground mb-6">More Articles</h3>
                                        <div className="space-y-4">
                                            {recentPosts.slice(0, 4).map((post: any) => (
                                                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                                                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                                        {decodeHtmlEntities(post.title.rendered)}
                                                    </h4>
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

            <SchemaScript id="ramadan-article-schema" schema={schemaData} />
        </div>
    );
}

// ===== Components =====

function ProductCard({ title, desc, price, originalPrice, link, badge, image }: any) {
    return (
        <Link href={link} className="block h-full">
            <Card className="overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full group border-border/60 rounded-[2rem]">
                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    {image ? (
                        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                    {badge && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm uppercase tracking-wider">
                            {badge}
                        </span>
                    )}
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg mb-3 group-hover:text-primary transition-colors leading-tight">{title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{desc}</p>
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

function PromoItem({ name, price, originalPrice, desc, link }: any) {
    return (
        <Link href={link} className="flex items-start justify-between group p-3 rounded-xl hover:bg-background/50 hover:shadow-sm transition-all border border-transparent hover:border-border/30">
            <div className="flex-1 min-w-0 mr-3">
                <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base block mb-0.5">{name}</span>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <div className="text-right shrink-0">
                <span className="font-bold text-primary whitespace-nowrap bg-primary/10 px-3 py-1.5 rounded-lg text-sm group-hover:bg-primary group-hover:text-white transition-colors block">
                    {price}
                </span>
                {originalPrice && (
                    <span className="text-xs text-muted-foreground line-through mt-1 block">{originalPrice}</span>
                )}
            </div>
        </Link>
    );
}

function TipCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
            <h4 className="font-heading font-bold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                {title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        </div>
    );
}
