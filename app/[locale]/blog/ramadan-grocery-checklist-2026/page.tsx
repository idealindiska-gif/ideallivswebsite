
import { Article } from '@/lib/schema/types';
import { articleSchema } from '@/lib/schema/article';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShoppingBag, Clock, Utensils } from 'lucide-react';

export const revalidate = 86400; // Daily revalidation

export const metadata = {
    title: 'Ramadan 2026 Grocery Shortlist: Essential Foods for Suhoor & Iftar',
    description: 'Stock up for Ramadan 2026 with our essential grocery checklist. From energy-boosting Suhoor staples to quick Iftar snacks, get everything you need at Ideal Indiska LIVS.',
};

export default function RamadanGroceryChecklist() {
    const currentYear = 2026;

    // Schema for the article
    const schemaData = articleSchema({
        title: `Ramadan ${currentYear} Grocery Shortlist: Essential Foods for Suhoor & Iftar`,
        description: 'A complete guide to essential groceries for Ramadan in Sweden, featuring suhoor staples, iftar snacks, and hydrating drinks.',
        content: 'Ramadan grocery guide content...', // Simplified for schema
        url: 'https://ideallivs.com/blog/ramadan-grocery-checklist-2026',
        authorName: 'Ideal Indiska LIVS Team',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: '2026-02-12T08:00:00+01:00',
        dateModified: '2026-02-12T08:00:00+01:00',
        category: 'Guides',
        tags: ['Ramadan 2026', 'Grocery Guide', 'Suhoor', 'Iftar', 'Stockholm'],
        featuredImage: 'https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg', // Updated image
    });

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            {/* Inject Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Header Section */}
            <header className="text-center mb-12">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                    Ramadan Prep Guide
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-heading">
                    Ramadan {currentYear} Grocery Shortlist: Essential Foods for Suhoor & Iftar
                </h1>

                {/* Featured Image */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                        alt="Traditional Ramadan Suhoor Table with Dates and Rooh Afza"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Salam neighbor! 👋 Ramadan is just around the corner (starting Feb 17th!), and we know the drill. Long fasts in Stockholm mean you need <strong>real energy</strong> for Suhoor and <strong>quick, comforting bites</strong> for Iftar.
                </p>
                <p className="mt-4 text-muted-foreground">
                    Don't stress about the shopping list. We've curated the essentials—and yes, they're on sale right now. Let's get your pantry ready! 🌙
                </p>
            </header>

            {/* Main Content */}
            <div className="space-y-16">

                {/* Section 1: Hydration & Energy (Drinks) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">1. The Thirst Quenchers (Iftar Must-Haves)</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                        After 12+ hours without water, that first sip is everything. Traditional sherbets aren't just about sugar; they replenish your energy levels instantly.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Rooh Afza Deal */}
                        <ProductCard
                            title="Hamdard Rooh Afza"
                            desc="The classic 'Red Sharbat' of Ramadan. Milk, water, or yogurt—it works with everything."
                            price="30 kr"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg" // Using featured image as placeholder for now, ideally specific product images
                            link="/product/hamdard-rooh-afza-syrup-800-ml"
                            badge="Essential"
                        />

                        {/* Tang Deal */}
                        <ProductCard
                            title="Tang (Orange/Mango)"
                            desc="Instant Vitamin C boost. Kids love it, and it's super refreshing cold."
                            price="59 kr"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                            link="/product/tang-mango-instant-drink-mix-2kg"
                            badge="Family Pack"
                        />
                    </div>
                </section>

                {/* Section 2: The Suhoor Powerhouses */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <Utensils className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">2. Suhoor Power: Heavy Carbohydrates</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                        For a Swedish Suhoor, you need "slow-burning" carbs that keep you full until Maghrib. Think heavy Rotis and Parathas.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Elephant Atta */}
                        <ProductCard
                            title="Elephant Atta (25kg)"
                            desc="The gold standard for soft, fluffy rotis that actually keep you full. A 25kg bag lasts the whole month."
                            price="239 kr"
                            originalPrice="299 kr"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                            link="/product/elephant-atta-medium-25-kg"
                            badge="Bulk Deal"
                        />
                        {/* Cooking Oil */}
                        <ProductCard
                            title="Alwaid Cooking Oil (5L)"
                            desc="You'll be doing a lot of frying and cooking. Stock up on the 5L pack now."
                            price="99 kr"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                            link="/product/al-waid-cooking-oil-5-liter"
                        />
                    </div>
                </section>

                {/* Section 3: The "Iftar Fry-Up" Essentials */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">3. The "Iftar Fry-Up" Kit</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                        Is it really Iftar without Pakoras? We didn't think so. Here are your frying essentials.
                    </p>

                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Besan (Gram Flour) Deals</h3>
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
                                <div className="pt-4 mt-4 border-t border-orange-200">
                                    <PromoItem
                                        name="Phulki (250g)"
                                        price="28 kr"
                                        desc="Essential for Dahi Baray."
                                        link="/product/phulki"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 4: Quick Iftar Hacks (Frozen & Ready) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">4. Quick Hacks for Busy Evenings</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                        Running late from work? These life-savers go from freezer to plate in minutes.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Samosas */}
                        <ProductCard
                            title="Crown Veg/Chicken Samosa (20pcs)"
                            desc="Crispy, generous filling. Just fry and serve."
                            price="59 kr"
                            link="/product/crown-chicken-samosa-20-st"
                            badge="Hot Seller"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                        />
                        {/* Kebabs */}
                        <ProductCard
                            title="Crown Kebabs (Seekh/Reshmi/Shami)"
                            desc="Restaurant quality at home. Try the Reshmi kebabs!"
                            price="129 kr"
                            link="/product/crown-reshmi-kebab-chicken-15stk"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                        />
                        {/* Spring Roll Sheets */}
                        <ProductCard
                            title="TJY Spring Roll Pastry"
                            desc="Making your own? These sheets are perfectly thin and crispy."
                            price="39 kr"
                            link="/product/tjy-spring-rolls-215-mm-40-sheets"
                            badge="30/40 Sheets"
                            image="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                        />
                    </div>
                </section>

                {/* Section 5: The Dates */}
                <section className="bg-primary/5 rounded-2xl p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Don't Forget the Sunnah</h2>
                    <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Break your fast the traditional way. We have fresh, soft dates in stock.
                    </p>
                    <div className="inline-block bg-background p-6 rounded-xl shadow-sm border">
                        <h3 className="text-xl font-bold text-foreground">Premium Dates (900g)</h3>
                        <p className="text-3xl font-extrabold text-primary my-2">99 kr</p>
                        <Button asChild size="lg" className="mt-2">
                            <Link href="/product/dates-900g">Add to Cart</Link>
                        </Button>
                    </div>
                </section>

            </div>

            {/* Footer CTA */}
            <div className="mt-16 text-center border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Ready for Ramadan?</h2>
                <p className="text-muted-foreground mb-8">
                    These deals won't last forever. Fill your pantry now and enjoy a stress-free Ramadan!
                </p>
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full">
                    <Link href="/shop">Shop All Ramadan Deals</Link>
                </Button>
            </div>
        </article>
    );
}

// Helper Components

function ProductCard({ title, desc, price, originalPrice, link, badge, image }: any) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
            <div className="aspect-video bg-muted relative overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        Image
                    </div>
                )}

                {badge && (
                    <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full z-10">
                        {badge}
                    </span>
                )}
            </div>
            <CardContent className="p-5 flex flex-col flex-1">
                <Link href={link} className="flex-1">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{desc}</p>
                </Link>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
                    <div>
                        <span className="text-xl font-extrabold text-primary">{price}</span>
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through ml-2">{originalPrice}</span>
                        )}
                    </div>
                    <Button asChild size="sm" variant="outline">
                        <Link href={link}>View</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function PromoItem({ name, price, desc, link }: any) {
    return (
        <div className="flex items-start justify-between group">
            <div>
                <Link href={link} className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
                    {name}
                </Link>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <span className="font-bold text-primary whitespace-nowrap bg-primary/10 px-2 py-1 rounded text-sm">
                {price}
            </span>
        </div>
    );
}
