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
import { ProductCarousel } from './ProductCarousel';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-insta-post-1.png';
const WISH_CARD = 'https://crm.ideallivs.com/wp-content/uploads/2026/02/ramadan-wish-card.png';
const PUBLISH_DATE = '2026-02-12';

// ─── All translated content ───────────────────────────────────────────────────

function getContent(locale: string) {
    const isSv = locale === 'sv';
    const articleUrl = isSv
        ? `${siteConfig.site_domain}/sv/blog/ramadan-2026`
        : `${siteConfig.site_domain}/blog/ramadan-2026`;

    return {
        articleUrl,
        isSv,

        // Metadata
        metaTitle: isSv
            ? 'Din Kompletta Ramadan Matlista för Stockholm | Ideal Indiska'
            : 'Your Essential Ramadan Grocery Checklist for Stockholm | Ideal Indiska',
        metaDescription: isSv
            ? 'Förbered dig inför Ramadan i Stockholm! Vår kompletta matlista hjälper dig hitta dadlar, Rooh Afza, atta, ris, frysta samosas och kebab på Mega Savings hos Ideal Indiska.'
            : 'Getting ready for Ramadan in Stockholm? Our essential grocery checklist has you covered! Find dates, Rooh Afza, atta, rice, frozen samosas & kebabs on mega savings at Ideal Indiska.',

        // Hero
        heroBadge: isSv ? `Ramadan 2026` : `Ramadan 2026`,
        heroTitle: isSv
            ? 'Din Kompletta Ramadan Matlista: Förbered Dig för en Välsignad Månad i Stockholm'
            : 'Your Essential Ramadan Grocery Checklist: Preparing for a Blessed Month in Stockholm',
        heroAuthor: isSv ? 'Ideal Indiska Team' : 'Ideal Indiska Team',

        // Mubarak banner
        mubarakSub: 'رمضان كريم',
        mubarakTitle: 'Ramadan Mubarak!',
        mubarakBody: isSv
            ? 'Från vår familj till er — vi önskar er en månad fylld av välsignelser, fred och vackra stunder runt bordet. Vi är hedrade att få vara en del av era Ramadan-förberedelser.'
            : 'From our family to yours — wishing you a month filled with blessings, peace, and beautiful moments around the table. We\'re honored to be part of your Ramadan preparations.',
        mubarakSign: isSv ? '— Teamet på Ideal Indiska Livs' : '— The Team at Ideal Indiska Livs',

        // Article lead
        leadQuote: isSv
            ? 'I takt med att den heliga månaden Ramadan närmar sig sprids en vacker förväntan i luften. Det är en tid för reflektion, bön, gemenskap och att dela läcker mat med sina nära och kära. Från den tidiga morgonmåltiden Suhoor till den glädjefyllda fastbrytningen vid Iftar — ett välförsett kök är hjärtat i en smidig och välsignad Ramadan.'
            : 'As the holy month of Ramadan approaches, a beautiful sense of anticipation fills the air. It\'s a time for reflection, prayer, community, and sharing delicious food with loved ones. From the pre-dawn meal of Suhoor to the joyous breaking of the fast at Iftar, a well-stocked kitchen is the heart of a smooth and blessed Ramadan.',
        leadBody: isSv
            ? 'Här på Ideal Indiska förstår vi hur viktigt det är att ha alla nödvändiga ingredienser redo. Vi har sammanställt en vänlig matlista inspirerad av våra Ramadan Mega Savings, för att göra det enkelt att hitta allt du behöver i Stockholm.'
            : 'Here at Ideal Indiska, we understand the importance of having all your essential ingredients ready. We\'ve put together a friendly grocery checklist inspired by our Ramadan Mega Savings, making it easier than ever to find everything you need right here in Stockholm.',
        leadBold: isSv ? 'Ramadan Mega Savings' : 'Ramadan Mega Savings',

        // Section 1
        sec1Label: isSv ? 'Sektion 1' : 'Section 1',
        sec1Title: isSv ? 'Iftarbordet: Att Bryta Fastan' : 'The Iftar Table Essentials: Breaking the Fast',
        sec1Body: isSv
            ? 'I det ögonblick solen går ner är fastbrytningen en helig ritual. Profetens tradition att bryta fastan med dadlar, vatten och en nypa salt är både andligt meningsfull och närigsriktig. Dessa varor är absoluta måsten.'
            : 'The moment the sun sets, breaking the fast is a sacred ritual. The Prophet\'s tradition of breaking fast with dates, water and a pinch of salt is both spiritually meaningful and nutritionally wise. These items are absolute must-haves.',
        sec1SubDates: isSv ? 'Dadlar & Salt — Sunnah-startarna' : 'Dates (Khajoor) & Salt — The Sunnah Starters',
        sec1DatesBody: isSv
            ? 'Traditionen att bryta fastan börjar med dadlar och vatten. De är en naturlig energikälla och ger kroppen näring precis när den behöver det som mest. Vi har vackra, saftiga Petra Klass 1 Jordanska Dadlar (900g) på specialerbjudande för ditt Iftarbord.'
            : 'The tradition of breaking the fast begins with dates and water. They are a natural source of energy and nutrients, perfect for gently replenishing the body. We have beautiful, succulent Petra Class 1 Jordanian Dates (900g) on special offer to grace your Iftar table.',
        petraDesc: isSv
            ? 'Mjuka premiumdadlar från Jordanien. Det traditionella sunnah-sättet att bryta fastan — saftiga och naturligt söta.'
            : 'Premium soft Jordanian dates. The traditional sunnah way to break your fast — succulent and naturally sweet.',
        petraBadge: isSv ? 'Sunnah Essentials' : 'Sunnah Essential',
        saltDesc: isSv
            ? 'En nypa salt med vatten ingår i sunnah för att bryta fastan. Ha alltid kvalitetssalt i skafferiet.'
            : 'A pinch of salt with water is part of the sunnah of breaking the fast. Always keep quality salt in your pantry.',
        sec1SubDrinks: isSv ? 'Uppfriskande Drycker (Sharbat)' : 'Refreshing Drinks (Sharbat)',
        sec1DrinksBody: isSv
            ? 'Efter en lång fastedag är återfuktning nyckeln. En klassisk, sval sharbat är det perfekta sättet att göra det.'
            : 'After a long day of fasting, rehydration is key. A classic, cooling sharbat is the perfect way to do it.',
        roohDesc: isSv
            ? 'Den klassiska "röda sharbaten" under Ramadan. Fungerar utmärkt med mjölk, vatten eller yoghurt.'
            : 'The classic \'Red Sharbat\' of Ramadan. Works beautifully with milk, water, or yogurt.',
        roohBadge: isSv ? 'Ramadan Klassiker' : 'Ramadan Classic',
        tangDesc: isSv
            ? 'Omedelbar C-vitaminboost. Barnen älskar det — superuppfriskande serverat iskyllt.'
            : 'Instant Vitamin C boost. Kids love it — super refreshing served ice cold.',
        tangBadge: isSv ? 'Familjefavorit' : 'Family Favourite',

        // Section 2
        sec2Label: isSv ? 'Sektion 2' : 'Section 2',
        sec2Title: isSv ? 'Snabba & Läckra Förätter: Till Stressiga Kvällar' : 'Quick & Delicious Appetizers: For When You\'re Short on Time',
        sec2Body: isSv
            ? 'Iftar är en tid för samvaro och snabba, läckra tilltugg. Vårt frysta sortiment går från frys till tallrik på några minuter.'
            : 'Iftar is a time for gathering and quick, delicious appetizers. Our frozen selection goes from freezer to plate in minutes.',
        chickenSamosaDesc: isSv
            ? 'Krispiga, gyllene samosas med generös kycklingfyllning. Fritera eller luftfritera och servera.'
            : 'Crispy golden samosas with generous chicken filling. Just fry or air-fry and serve.',
        chickenSamosaBadge: isSv ? 'Storsäljare' : 'Hot Seller',
        vegSamosaDesc: isSv
            ? 'Klassiska vegsamosas med perfekt kryddad potatis- och ärtkräm.'
            : 'Classic veg samosas — perfectly spiced potato and pea filling.',
        reshmiDesc: isSv
            ? 'Möra, krämiga Reshmi-kebab. Restaurangkvalitet hemma — servera med myntachutney.'
            : 'Tender, creamy Reshmi kebabs. Restaurant quality at home with mint chutney.',
        alsoGreatTitle: isSv ? 'Också Perfekt till Iftar — Gör det Hemma' : 'Also Great for Iftar — Make It Fresh',
        alsoGreatSub: isSv
            ? 'Klassiska hemlagade Iftarrätter med allt du behöver för att göra dem.'
            : 'Classic homemade Iftar dishes with everything you need to make them.',
        dahiBhalay: isSv ? 'Dahi Bhalay' : 'Dahi Bhalay',
        phulkiDesc: isSv ? 'Den oumbärliga basen för Dahi Bhalay — mjuk, svampig, redo att blöta.' : 'The essential base for Dahi Bhalay — soft, spongy, ready to soak.',
        pakoray: isSv ? 'Pakoray (Pakoras)' : 'Pakoray (Pakoras)',
        alibabaFlour1Desc: isSv
            ? 'Bra vardagsalternativ — superfin textur för krispiga pakoras.'
            : 'Great value option — super fine for crispy pakoras.',
        alibabaFlour2Desc: isSv
            ? 'Storpack — bäst värde för hela månaden.'
            : 'Bulk pack — best value for the whole month.',
        trsFlourDesc: isSv
            ? 'Premiumkvalitet, ultrafin textur — utmärkt för lätta, krispiga smet.'
            : 'Premium quality, ultra-fine texture — excellent for light, crispy batters.',
        homeSamosa: isSv ? 'Hemlagad Samosa' : 'Homemade Samosa',
        springRoll30Desc: isSv
            ? 'Perfekt tunna ark för dina egna hemlagade samosas och vårrullar.'
            : 'Perfectly thin sheets for your own homemade samosas and spring rolls.',
        springRoll40Desc: isSv
            ? 'Mellanstor — idealisk för mindre, munsbitssamosas.'
            : 'Medium size — ideal for smaller, bite-sized samosas.',
        forAllFrying: isSv ? 'Till all fritering' : 'For all frying',
        alwaidDesc: isSv
            ? 'Ren solrosolja — storpack för alla dina Iftar-friteringsbehov.'
            : 'Pure sunflower oil — value pack for all your Iftar frying needs.',

        // Section 3
        sec3Label: isSv ? 'Sektion 3' : 'Section 3',
        sec3Title: isSv ? 'Skafferivaror för Suhoor & Iftar' : 'Pantry Staples for Suhoor & Iftar Meals',
        sec3Body: isSv
            ? 'Ett välförsett skafferi är din bästa vän under Ramadan. Dessa bulkvaror räcker hela månaden utan sista-minuten-shoppingturer.'
            : 'A well-stocked pantry is your best friend during Ramadan. These bulk items will see you through the entire month.',
        attaTitle: isSv ? 'Atta — Fullkornsvetemjöl' : 'Atta — Whole Wheat Flour',
        attaBody: isSv
            ? 'För mjuka, färska rotis och parathas till dina Suhoor- och Iftarcurries.'
            : 'For soft, fresh rotis and parathas to accompany your Suhoor and Iftar curries.',
        fortuneDesc: isSv
            ? 'Stenmalet fullkornsvete för de mjukaste, smidigaste rotis.'
            : 'Stone-ground whole wheat for the softest, most pliable rotis.',
        elephantDesc: isSv
            ? 'Guldstandarden för familjer. En 25 kg-säck räcker hela månaden — nu på specialpris.'
            : 'The gold standard for families. A 25kg bag lasts the whole month — on special offer now.',
        elephantBadge: isSv ? 'Storpack' : 'Bulk Deal',
        riceTitle: isSv ? 'Basmatiris — Det Festliga Spannmålet' : 'Basmati Rice — The Festive Grain',
        riceBody: isSv
            ? 'Ingen festmåltid är komplett utan doftande basmatiris. Grunden för Pulao, Biryani eller serverat med en rik curry.'
            : 'No festive meal is complete without fragrant basmati rice. The foundation for Pulao, Biryani, or served simply with a rich curry.',
        guardRiceDesc: isSv
            ? 'Premium långkornigt basmatiris med vacker doft. Perfekt för biryani och pulao.'
            : 'Premium long-grain basmati with a beautiful aroma. Perfect for biryani and pulao.',
        kaalarDesc: isSv
            ? 'Aromatiskt extra-långkornigt basmatiris — fluffigt, doftande och vackert icke-klibbigt.'
            : 'Aromatic extra-long grain basmati — fluffy, fragrant, and beautifully non-sticky.',
        fryKitTitle: isSv ? 'Iftar-friteringskit' : 'The Iftar Fry-Up Kit',
        fryKitBody: isSv
            ? 'Är det verkligen Iftar utan pakoras? Kikärtsmjöl (Besan) är själen i Ramadan-snacksen, och bra olja gör all skillnad.'
            : 'Is it really Iftar without pakoras? Gram flour (Besan) is the soul of Ramadan snacking, and good oil makes all the difference.',
        fryKitBoxTitle: isSv ? '✦ Kikärtsmjöl (Besan) & Oljaerbjudanden' : '✦ Gram Flour (Besan) & Oil Deals',
        alwaidFryDesc: isSv
            ? 'Ren solrosolja — med all fritering du ska göra, fyll på nu.'
            : 'Pure sunflower oil — with all the frying you\'ll be doing, stock up now.',

        // Product Carousel
        carouselLabel: isSv ? 'Ramadan Mega Savings' : 'Ramadan Mega Savings',
        carouselTitle: isSv ? 'Produkter på Kampanj Just Nu' : 'Products On Promotion Right Now',

        // Section 4
        sec4Label: isSv ? 'Sektion 4' : 'Section 4',
        sec4Title: isSv ? 'Glöm Inte Tilltuggarna!' : 'Don\'t Forget the Snacks!',
        sec4Body: isSv
            ? 'För lättare suget mellan bönerna eller för att servera gäster är det alltid bra att ha färdiga snacks till hands. En skål klassisk Namkeen/Savouries är perfekt att ha nära hela månaden.'
            : 'For lighter cravings between prayers or to serve to guests, having some ready-to-eat snacks is always a good idea. A bowl of classic Namkeen / Savouries is perfect to have on hand throughout the month.',
        namkeenDesc: isSv
            ? 'Klassisk sydasiatisk mix — lätt, kryddad och perfekt för gäster eller mellan bönerna.'
            : 'Classic South Asian mix — light, spiced, and perfect for guests or between prayers.',
        namkeenBadge: isSv ? 'Gästfavorit' : 'Crowd Favourite',
        qarshiDesc: isSv
            ? 'En nostalgisk örtdryck — omtyckt av generationer för Iftar.'
            : 'A nostalgic herbal sherbet — beloved across generations for Iftar.',

        // Final CTA
        ctaSub: isSv ? 'Glöm Inte Sunnahen' : 'Don\'t Forget the Sunnah',
        ctaTitle: isSv ? 'Bryt Fastan på Traditionellt Sätt' : 'Break Your Fast the Traditional Way',
        ctaBody: isSv
            ? 'Vi har premiumdadlar från Jordanien i lager, redo för ditt Iftarbord. Börja med en dadel, ett glas vatten och en bön.'
            : 'We have premium soft Jordanian dates in stock, ready for your Iftar table. Start with a date, a glass of water, and a prayer.',
        ctaShopDates: isSv ? 'Köp Dadlar' : 'Shop Dates',
        ctaAllDeals: isSv ? 'Alla Ramadan-erbjudanden' : 'All Ramadan Deals',

        // Sign off
        signOff1: isSv
            ? 'Vi på Ideal Indiska är hedrade att få vara en del av era Ramadan-förberedelser. Våra Ramadan Mega Savings är här för att hjälpa er fylla köket med autentiska, högkvalitativa ingredienser utan att spräcka budgeten.'
            : 'We at Ideal Indiska are honoured to be a part of your Ramadan preparations. Our Ramadan Mega Savings are here to help you stock your kitchen with authentic, high-quality ingredients without breaking your budget.',
        signOff2En: 'Visit us at our store in Bandhagen Centrum, or shop online at ',
        signOff2Sv: 'Besök oss i vår butik i Bandhagen Centrum, eller handla online på ',
        signOff2b: isSv ? '. Kontakta oss även på WhatsApp: ' : '. You can also reach us on WhatsApp at ',
        signOff3: isSv
            ? 'Vi önskar er och er familj en fridfull, välsignad och läcker Ramadan!'
            : 'Wishing you and your family a peaceful, blessed, and delicious Ramadan!',

        // Sidebar
        sidebarDealsTitle: isSv ? 'Aktuella Erbjudanden' : 'Trending Deals',
        sidebarDealsSubtitle: isSv ? 'Produkter på kampanj just nu' : 'Products on promotion right now',
        sidebarDealsBtn: isSv ? 'Se Alla Erbjudanden' : 'View All Deals',
        checklistTitle: isSv ? 'Snabb Checklista' : 'Quick Checklist',
        checklistItems: isSv
            ? [
                'Petra Jordanska Dadlar (900g)',
                'Tata Salt (1kg)',
                'Rooh Afza / Tang',
                'Elephant Atta (25kg)',
                'Basmatiris (5kg)',
                'Kikärtsmjöl / Besan',
                'Kycklingsamosas (20st)',
                'Seekh / Reshmi Kebab',
                'Solrosolja (5L)',
                'Phulki (Dahi Bhalay)',
                'Vårrullsark',
                'Namkeen Snacks',
            ]
            : [
                'Petra Jordanian Dates (900g)',
                'Tata Salt (1kg)',
                'Rooh Afza / Tang',
                'Elephant Atta (25kg)',
                'Basmati Rice (5kg)',
                'Gram Flour / Besan',
                'Chicken Samosas (20pcs)',
                'Seekh / Reshmi Kebabs',
                'Sunflower Oil (5L)',
                'Phulki (Dahi Bhalay)',
                'Spring Roll Pastry',
                'Namkeen Snacks',
            ],
        checklistBtn: isSv ? 'Handla Alla Varor' : 'Shop All Items',
        storeTitle: isSv ? 'Butikens Plats' : 'Store Location',
        storeHours: isSv ? 'Öppet dagligen 10:00 – 20:00' : 'Open Daily 10:00 – 20:00',
    };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const c = getContent(locale);

    return {
        title: c.metaTitle,
        description: c.metaDescription,
        alternates: {
            canonical: locale === 'sv' ? '/sv/blog/ramadan-2026' : '/blog/ramadan-2026',
            languages: {
                en: '/blog/ramadan-2026',
                sv: '/sv/blog/ramadan-2026',
            },
        },
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Ramadan 2026 – Ideal Indiska Livs' }],
            type: 'article',
            locale: locale === 'sv' ? 'sv_SE' : 'en_SE',
        },
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RamadanBlogPost({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const c = getContent(locale);

    let carouselProducts: any[] = [];
    let promotionProducts: any[] = [];

    try {
        const { data: saleProducts } = await getProducts({ per_page: 16, on_sale: true, orderby: 'date', order: 'desc' });
        promotionProducts = saleProducts.slice(0, 5);
        carouselProducts = saleProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    const schemaData = articleSchema({
        title: c.metaTitle,
        description: c.metaDescription,
        content: c.metaDescription,
        url: c.articleUrl,
        authorName: 'Ideal Indiska LIVS Team',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: `${PUBLISH_DATE}T08:00:00+01:00`,
        dateModified: `${PUBLISH_DATE}T08:00:00+01:00`,
        category: 'Guides',
        tags: ['Ramadan 2026', 'Grocery Guide', 'Suhoor', 'Iftar', 'Stockholm'],
        featuredImage: FEATURE_IMAGE,
    });

    const shareText = c.isSv ? 'Kolla in den här Ramadan-guiden: ' : 'Check this Ramadan guide: ';

    return (
        <div className="min-h-screen bg-background">

            {/* ─── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden min-h-[560px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
                </div>

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl h-full flex flex-col justify-end pb-20 pt-16 text-white">
                    <nav className="mb-5" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-white/60 font-medium">
                            <li><Link href="/" className="hover:text-white transition-colors">{c.isSv ? 'Hem' : 'Home'}</Link></li>
                            <li>/</li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li>/</li>
                            <li className="text-white/80">{c.isSv ? 'Säsongsguider' : 'Seasonal Guides'}</li>
                        </ol>
                    </nav>

                    <Badge className="w-fit mb-5 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        {c.heroBadge}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 max-w-4xl tracking-tight leading-[1.1] text-white">
                        {c.heroTitle}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-full border-2 border-white/20 overflow-hidden shrink-0 bg-white/10">
                                <Image src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png" alt="Ideal Indiska" fill className="object-contain p-2" />
                            </div>
                            <div>
                                <p className="font-semibold text-white leading-tight">{c.heroAuthor}</p>
                                <p className="text-xs text-white/55 flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(PUBLISH_DATE).toLocaleDateString(c.isSv ? 'sv-SE' : 'en-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button asChild size="sm" className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full px-5 h-9 border-0 text-sm font-semibold">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(c.articleUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-3.5 w-3.5 mr-1.5" /> {c.isSv ? 'Dela' : 'Share'}
                                </a>
                            </Button>
                            <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-5 h-9 border-0 text-sm font-semibold">
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + c.articleUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Mubarak Banner ──────────────────────────────────── */}
            <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 overflow-hidden border-t border-emerald-800/40">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-0 md:gap-8">
                        <div className="relative w-full md:w-80 lg:w-96 shrink-0 aspect-[4/3] md:aspect-square">
                            <Image src={WISH_CARD} alt="Ramadan Mubarak – Ideal Indiska Livs" fill className="object-contain object-center" sizes="(max-width: 768px) 100vw, 384px" />
                        </div>
                        <div className="py-10 md:py-0 text-center md:text-left">
                            <p className="text-yellow-400 font-bold text-sm uppercase tracking-[0.2em] mb-3">{c.mubarakSub}</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">{c.mubarakTitle}</h2>
                            <p className="text-emerald-100/80 text-lg leading-relaxed max-w-xl">{c.mubarakBody}</p>
                            <p className="text-yellow-400/80 font-semibold mt-4 text-base">{c.mubarakSign}</p>
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
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">

                                <p className="text-xl md:text-2xl text-foreground font-medium border-l-4 border-primary pl-6 py-1 not-italic leading-relaxed mb-10">
                                    {c.leadQuote}
                                </p>
                                <p>
                                    {c.leadBody.replace(c.leadBold, '')}
                                    <strong>{c.leadBold}</strong>
                                    {c.isSv ? ', för att göra det enkelt att hitta allt du behöver i Stockholm.' : ', making it easier than ever to find everything you need right here in Stockholm.'}
                                </p>

                                {/* Section 1 */}
                                <SectionHeading icon={<Clock className="w-7 h-7" />} iconBg="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" label={c.sec1Label} title={c.sec1Title} />
                                <p>{c.sec1Body}</p>
                                <h3>{c.sec1SubDates}</h3>
                                <p>{c.sec1DatesBody}</p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
                                    <FeaturedProductCard title="Petra Class 1 Jordanian Dates (900g)" desc={c.petraDesc} badge={c.petraBadge} badgeColor="amber" link="/product/petra-class-1-jordanian-dates" icon={<Star className="w-8 h-8" />} iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Tata Salt (1kg)" desc={c.saltDesc} link="/product/tata-salt-1-kg" icon={<Star className="w-8 h-8" />} iconBg="bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                </div>

                                <h3>{c.sec1SubDrinks}</h3>
                                <p>{c.sec1DrinksBody}</p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
                                    <FeaturedProductCard title="Hamdard Rooh Afza (800ml)" desc={c.roohDesc} badge={c.roohBadge} badgeColor="primary" link="/product/hamdard-rooh-afza-syrup-800-ml" icon={<Utensils className="w-8 h-8" />} iconBg="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Tang Mango (750g)" desc={c.tangDesc} badge={c.tangBadge} badgeColor="orange" link="/product/tang-mango" icon={<Utensils className="w-8 h-8" />} iconBg="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                </div>

                                {/* Section 2 */}
                                <SectionHeading icon={<ShoppingBag className="w-7 h-7" />} iconBg="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" label={c.sec2Label} title={c.sec2Title} />
                                <p>{c.sec2Body}</p>

                                <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
                                    <FeaturedProductCard title="Crown Chicken Samosa (20 pcs)" desc={c.chickenSamosaDesc} badge={c.chickenSamosaBadge} badgeColor="primary" link="/product/crown-chicken-samosa-20-st" icon={<Drumstick className="w-8 h-8" />} iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Crown Veg Samosa (20 pcs)" desc={c.vegSamosaDesc} link="/product/crown-veg-samosa-20-st" icon={<Drumstick className="w-8 h-8" />} iconBg="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Crown Reshmi Kebab (15 pcs)" desc={c.reshmiDesc} link="/product/crown-reshmi-kebab-chicken-15stk" icon={<Drumstick className="w-8 h-8" />} iconBg="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                </div>

                                {/* Also Great for Iftar */}
                                <div className="not-prose bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-border/50 rounded-3xl p-7 my-8">
                                    <h4 className="font-heading font-bold text-lg text-foreground mb-2 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-xs font-bold">✦</span>
                                        {c.alsoGreatTitle}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-6">{c.alsoGreatSub}</p>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary inline-block" /> {c.dahiBhalay}
                                            </p>
                                            <div className="space-y-2 pl-4">
                                                <PromoItem name="Phulki (250g)" desc={c.phulkiDesc} link="/product/phulki-250-gsm" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary inline-block" /> {c.pakoray}
                                            </p>
                                            <div className="space-y-2 pl-4">
                                                <PromoItem name={c.isSv ? "Alibaba Premium Kikärtsmjöl / Besan (1kg)" : "Alibaba Premium Gram Flour / Besan (1kg)"} desc={c.alibabaFlour1Desc} link="/product/ab-premium-gram-flour" />
                                                <PromoItem name={c.isSv ? "Alibaba Premium Kikärtsmjöl / Besan (2kg)" : "Alibaba Premium Gram Flour / Besan (2kg)"} desc={c.alibabaFlour2Desc} link="/product/ab-premium-gram-flour-2-kg" />
                                                <PromoItem name={c.isSv ? "TRS Kikärtsmjöl / Besan (2kg)" : "TRS Gram Flour / Besan (2kg)"} desc={c.trsFlourDesc} link="/product/trs-gram-flour-2-kg" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary inline-block" /> {c.homeSamosa}
                                            </p>
                                            <div className="space-y-2 pl-4">
                                                <PromoItem name="Spring Home TYJ Spring Roll Pastry (30 sheets)" desc={c.springRoll30Desc} link="/product/tjy-spring-rolls-250-mm-30-sheets" />
                                                <PromoItem name="Spring Home TYJ Spring Roll Pastry (40 sheets)" desc={c.springRoll40Desc} link="/product/tjy-spring-rolls-215-mm-40-sheets" />
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-border/30">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{c.forAllFrying}</p>
                                            <PromoItem name="Alwaid Solrosolja (Sunflower Oil) 5 Litre" desc={c.alwaidDesc} link="/product/alwaid-solrosolja-5-lit" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3 */}
                                <SectionHeading icon={<Wheat className="w-7 h-7" />} iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" label={c.sec3Label} title={c.sec3Title} />
                                <p>{c.sec3Body}</p>
                                <h3>{c.attaTitle}</h3>
                                <p>{c.attaBody}</p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-6">
                                    <FeaturedProductCard title="Fortune Chakki Fresh Atta (5kg)" desc={c.fortuneDesc} link="/product/fortune-chakki-fresh-atta-5-kg" icon={<Wheat className="w-8 h-8" />} iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Elephant Atta Medium (25kg)" desc={c.elephantDesc} badge={c.elephantBadge} badgeColor="primary" link="/product/elephant-atta-medium-25-kg" icon={<Wheat className="w-8 h-8" />} iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                </div>

                                <h3>{c.riceTitle}</h3>
                                <p>{c.riceBody}</p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-6">
                                    <FeaturedProductCard title="Guard Ultimate Basmati Rice (5kg)" desc={c.guardRiceDesc} link="/product/guard-ultimate-basmati-rice-5-kg" icon={<ShoppingBag className="w-8 h-8" />} iconBg="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Kaalar Extra Long Grain Steam Basmati (5kg)" desc={c.kaalarDesc} link="/product/kaalar-extra-long-grain-steam-rice-5kg" icon={<ShoppingBag className="w-8 h-8" />} iconBg="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                </div>

                                <h3>{c.fryKitTitle}</h3>
                                <p>{c.fryKitBody}</p>

                                <div className="not-prose bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/40 rounded-3xl p-7 my-8">
                                    <h4 className="text-lg font-heading font-bold mb-5 text-foreground">{c.fryKitBoxTitle}</h4>
                                    <div className="space-y-3">
                                        <PromoItem name={c.isSv ? "Alibaba Premium Kikärtsmjöl (1kg)" : "Alibaba Premium Gram Flour (1kg)"} desc={c.alibabaFlour1Desc} link="/product/ab-premium-gram-flour" />
                                        <PromoItem name={c.isSv ? "Alibaba Premium Kikärtsmjöl (2kg)" : "Alibaba Premium Gram Flour (2kg)"} desc={c.alibabaFlour2Desc} link="/product/ab-premium-gram-flour-2-kg" />
                                        <PromoItem name={c.isSv ? "TRS Kikärtsmjöl (2kg)" : "TRS Gram Flour (2kg)"} desc={c.trsFlourDesc} link="/product/trs-gram-flour-2-kg" />
                                    </div>
                                    <div className="mt-5 pt-5 border-t border-orange-200 dark:border-orange-800/30">
                                        <PromoItem name="Alwaid Solrosolja (Sunflower Oil) 5 Litre" desc={c.alwaidFryDesc} link="/product/alwaid-solrosolja-5-lit" />
                                    </div>
                                </div>
                            </div>

                            {/* Product Carousel */}
                            <div className="mt-4">
                                <ProductCarousel products={carouselProducts} label={c.carouselLabel} title={c.carouselTitle} viewAllLabel={c.isSv ? 'Se alla Ramadan-erbjudanden' : 'View all Ramadan deals'} />
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline mt-4">

                                {/* Section 4 */}
                                <SectionHeading icon={<CheckCircle2 className="w-7 h-7" />} iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" label={c.sec4Label} title={c.sec4Title} />
                                <p>{c.sec4Body}</p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 my-8">
                                    <FeaturedProductCard title={c.isSv ? "Namkeen & Savouries" : "Namkeen & Savouries"} desc={c.namkeenDesc} link="/product-category/indian-snacks" badge={c.namkeenBadge} badgeColor="primary" icon={<Star className="w-8 h-8" />} iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                    <FeaturedProductCard title="Qarshi Jam-e-Shirin (800ml)" desc={c.qarshiDesc} link="/product/qarshi-jam-e-shirin-syrup-800ml" icon={<Utensils className="w-8 h-8" />} iconBg="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" viewLabel={c.isSv ? 'Visa produkt' : 'View product'} />
                                </div>

                                {/* Final CTA */}
                                <div className="not-prose relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-[2.5rem] border border-primary/15 p-10 md:p-14 text-center mt-16">
                                    <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                                    <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{c.ctaSub}</p>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 relative z-10">{c.ctaTitle}</h2>
                                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed relative z-10">{c.ctaBody}</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Button asChild size="lg" className="rounded-full h-13 px-8 text-base font-bold shadow-lg shadow-primary/20">
                                            <Link href="/product/petra-class-1-jordanian-dates" className="flex items-center gap-2">
                                                {c.ctaShopDates} <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="rounded-full h-13 px-8 text-base font-bold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all">
                                            <Link href="/deals" className="flex items-center gap-2">
                                                {c.ctaAllDeals} <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Sign off */}
                                <div className="not-prose mt-14 pt-10 border-t border-border/40">
                                    <p className="text-lg text-muted-foreground leading-relaxed">{c.signOff1}</p>
                                    <p className="text-muted-foreground mt-4 leading-relaxed">
                                        {c.isSv ? c.signOff2Sv : c.signOff2En}
                                        <a href="https://www.ideallivs.com" className="text-primary font-semibold hover:underline">www.ideallivs.com</a>
                                        {c.signOff2b}
                                        <a href="https://wa.me/46728494801" className="text-primary font-semibold hover:underline">+46 728 494 801</a>.
                                    </p>
                                    <p className="mt-6 text-foreground font-semibold">{c.signOff3}</p>
                                    <p className="text-primary font-bold mt-1">{c.mubarakSign} 🌙</p>
                                </div>
                            </div>
                        </article>

                        {/* ── Sidebar ── */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8">

                                {/* Feature image */}
                                <div className="rounded-3xl overflow-hidden border border-border/30 shadow-sm">
                                    <Image src={FEATURE_IMAGE} alt="Ramadan 2026 – Ideal Indiska Livs" width={600} height={600} className="w-full object-cover" />
                                </div>

                                {/* Trending Deals */}
                                {promotionProducts.length > 0 && (
                                    <div className="bg-card border border-border/50 rounded-3xl p-7 shadow-sm">
                                        <h3 className="text-lg font-heading font-bold text-foreground mb-1 tracking-tight">{c.sidebarDealsTitle}</h3>
                                        <p className="text-xs text-muted-foreground mb-6">{c.sidebarDealsSubtitle}</p>
                                        <div className="space-y-5">
                                            {promotionProducts.map((product) => (
                                                <Link key={product.id} href={`/product/${product.slug}`} className="flex gap-4 group items-center">
                                                    <div className="relative w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/20">
                                                        {product.images?.[0] && (
                                                            <Image src={product.images[0].src} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="56px" />
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
                                            <Link href="/deals">{c.sidebarDealsBtn}</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Checklist */}
                                <div className="bg-card border border-border/50 rounded-3xl p-7 shadow-sm">
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-5 tracking-tight">{c.checklistTitle}</h3>
                                    <ul className="space-y-2.5">
                                        {c.checklistItems.map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span className="w-4 h-4 rounded border-2 border-primary/40 shrink-0 flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className="w-full mt-7 rounded-full h-11 font-semibold text-sm">
                                        <Link href="/deals">{c.checklistBtn}</Link>
                                    </Button>
                                </div>

                                {/* Store Location */}
                                <div className="bg-card border border-border/50 rounded-3xl p-7 shadow-sm overflow-hidden">
                                    <h3 className="text-lg font-heading font-bold text-foreground mb-5 flex items-center gap-2 tracking-tight">
                                        <MapPin className="h-4 w-4 text-primary" /> {c.storeTitle}
                                    </h3>
                                    <div className="rounded-2xl overflow-hidden mb-5 h-[180px] border border-border/10">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.769278826918!2d18.048690399999998!3d59.2700036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77d07b5889cf%3A0xd20e7ba594e09663!2sIdeal%20Indiska%20Livs%20Bandhagen!5e0!3m2!1sen!2s!4v1765922506900!5m2!1sen!2s"
                                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ideal Indiska Livs location"
                                        />
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p className="text-foreground font-bold text-base">Ideal Indiska Livs</p>
                                        <p>Bandhagsplan 4, 12432 Bandhagen</p>
                                        <p className="text-primary font-semibold pt-2">{c.storeHours}</p>
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

function SectionHeading({ icon, iconBg, label, title }: {
    icon: React.ReactNode; iconBg: string; label: string; title: string;
}) {
    return (
        <div className="not-prose flex items-start gap-4 mt-16 mb-6">
            <div className={`p-3 rounded-2xl shrink-0 ${iconBg}`}>{icon}</div>
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">{title}</h2>
            </div>
        </div>
    );
}

function FeaturedProductCard({ title, desc, link, badge, badgeColor = 'primary', icon, iconBg, viewLabel = 'View product' }: {
    title: string; desc: string; link: string; badge?: string;
    badgeColor?: 'primary' | 'amber' | 'orange' | 'green';
    icon: React.ReactNode; iconBg: string; viewLabel?: string;
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
                    <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>{icon}</div>
                    {badge && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClasses[badgeColor]} shrink-0`}>{badge}</span>}
                </div>
                <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-primary text-xs font-bold">
                    {viewLabel} <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </Link>
    );
}

function PromoItem({ name, desc, link }: { name: string; desc: string; link: string }) {
    return (
        <Link href={link} className="flex items-start justify-between gap-4 group p-3.5 rounded-xl hover:bg-background/70 hover:shadow-sm transition-all border border-transparent hover:border-border/30">
            <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block mb-0.5 leading-snug">{name}</span>
                <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
        </Link>
    );
}
