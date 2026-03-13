import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar, Facebook, MessageCircle,
    MapPin, Moon, Sun, Clock, ArrowRight, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { articleSchema } from '@/lib/schema/article';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';

export const revalidate = 86400;

const CALENDAR_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-Calendar-A4-ideal.jpg';
const PUBLISH_DATE = '2026-02-19';

// ─── Bilingual content ────────────────────────────────────────────────────────

function getContent(locale: string) {
    const isSv = locale === 'sv';
    const articleUrl = isSv
        ? `${siteConfig.site_domain}/sv/blog/ramadan-kalender-2026`
        : `${siteConfig.site_domain}/blog/ramadan-kalender-2026`;

    return {
        isSv,
        articleUrl,

        // ── Metadata ──────────────────────────────────────────────────────────
        metaTitle: isSv
            ? 'Ramadan Kalender 2026 Stockholm – Iftar & Suhoor Tider | Masjid Ayesha'
            : 'Ramadan Calendar 2026 Stockholm – Iftar & Suhoor Times | Masjid Ayesha',
        metaDescription: isSv
            ? 'Ladda ner Ramadan Kalender 2026 för Stockholm med dagliga Iftar- och Suhoor-tider baserade på Masjid Ayesha Sveriges officiella bönetider. Ramadan Kareem!'
            : 'Download the Ramadan Calendar 2026 for Stockholm with daily Iftar and Suhoor times based on Masjid Ayesha Sweden\'s official prayer schedule. Ramadan Kareem!',

        // ── Hero ──────────────────────────────────────────────────────────────
        heroBadge: isSv ? 'Ramadan 2026 · Stockholm' : 'Ramadan 2026 · Stockholm',
        heroTitle: isSv
            ? 'Ramadan Kalender 2026 – Iftar & Suhoor Tider för Stockholm'
            : 'Ramadan Calendar 2026 – Iftar & Suhoor Times for Stockholm',
        heroSubtitle: isSv
            ? 'Baserad på Masjid Ayesha Sveriges officiella bönetider'
            : 'Based on Masjid Ayesha Sweden\'s official prayer schedule',

        // ── Intro ─────────────────────────────────────────────────────────────
        introTitle: isSv ? 'Om Ramadan Kalender 2026' : 'About the Ramadan Calendar 2026',
        introBody1: isSv
            ? 'Ramadan 2026 är en helig och välsignad månad för muslimer världen över. Under denna månad fastar man dagligen från gryning (Fajr) till solnedgång (Maghrib). Att följa rätt tider är avgörande för att fastan ska vara giltig.'
            : 'Ramadan 2026 is a sacred and blessed month for Muslims around the world. During this month, fasting is observed daily from dawn (Fajr) until sunset (Maghrib). Following the correct times is essential for a valid fast.',
        introBody2: isSv
            ? 'Vår Ramadan Kalender 2026 är baserad på Masjid Ayesha Sveriges fastställda bönetider för Stockholm och ger dig korrekta dagliga tider för Fajr (Suhoor-slut) och Maghrib (Iftar-start) under hela den heliga månaden.'
            : 'Our Ramadan Calendar 2026 is based on Masjid Ayesha Sweden\'s established prayer times for Stockholm, providing you with accurate daily times for Fajr (end of Suhoor) and Maghrib (start of Iftar) throughout the holy month.',

        // ── What's in the calendar ────────────────────────────────────────────
        calendarContentsTitle: isSv ? 'Vad innehåller kalendern?' : 'What does the calendar include?',
        calendarItems: isSv
            ? [
                { icon: '🌙', label: 'Dagliga Suhoor-tider (Fajr)', desc: 'Exakt tid för när fastan börjar varje dag' },
                { icon: '🌅', label: 'Dagliga Iftar-tider (Maghrib)', desc: 'Exakt tid för fastbrytning varje kväll' },
                { icon: '📍', label: 'Anpassade tider för Stockholm', desc: 'Beräknade specifikt för Stockholms latitud' },
                { icon: '🕌', label: 'Masjid Ayesha Sveriges beräkningar', desc: 'Officiellt godkänd kalender för Sverige' },
            ]
            : [
                { icon: '🌙', label: 'Daily Suhoor Times (Fajr)', desc: 'Exact time when fasting begins each day' },
                { icon: '🌅', label: 'Daily Iftar Times (Maghrib)', desc: 'Exact time to break the fast each evening' },
                { icon: '📍', label: 'Tailored for Stockholm', desc: 'Calculated specifically for Stockholm\'s latitude' },
                { icon: '🕌', label: 'Masjid Ayesha Sweden Calculations', desc: 'Officially approved calendar for Sweden' },
            ],

        // ── Calendar image section ────────────────────────────────────────────
        calendarImageTitle: isSv
            ? 'Ramadan Kalender 2026 – Stockholm'
            : 'Ramadan Calendar 2026 – Stockholm',
        calendarImageCaption: isSv
            ? 'Klicka på kalendern för att öppna i full storlek. Spara eller skriv ut för enkel åtkomst under Ramadan.'
            : 'Click the calendar to open in full size. Save or print for easy access throughout Ramadan.',
        calendarNote: isSv
            ? '⚠️ Vi rekommenderar att du regelbundet kontrollerar med din lokala moské för eventuella uppdateringar av tiderna.'
            : '⚠️ We recommend regularly checking with your local mosque for any updates to the times.',

        // ── Suhoor & Iftar explainer ──────────────────────────────────────────
        explainerTitle: isSv ? 'Suhoor & Iftar – Vad är det?' : 'Suhoor & Iftar – What Are They?',
        suhoorTitle: isSv ? 'Suhoor (السحور)' : 'Suhoor (السحور)',
        suhoorBody: isSv
            ? 'Suhoor är måltiden som äts före gryningen (Fajr) innan fastan börjar. Det är en sunnah att äta Suhoor, och Profeten (frid vare med honom) uppmuntrade starkt till det. En god Suhoor ger energi och uthållighet under den långa fastedagen.'
            : 'Suhoor is the pre-dawn meal eaten before Fajr prayer, before fasting begins. It is a Sunnah to eat Suhoor, and the Prophet (peace be upon him) strongly encouraged it. A good Suhoor provides energy and endurance throughout the long fasting day.',
        iftarTitle: isSv ? 'Iftar (الإفطار)' : 'Iftar (الإفطار)',
        iftarBody: isSv
            ? 'Iftar är måltiden som bryter fastan vid solnedgång (Maghrib). Traditionen är att bryta fastan med dadlar och vatten, precis som Profeten (frid vare med honom) gjorde. Iftar är en tid för tacksamhet, gemenskap och välsignelse.'
            : 'Iftar is the meal that breaks the fast at sunset (Maghrib). The tradition is to break the fast with dates and water, just as the Prophet (peace be upon him) did. Iftar is a time of gratitude, community, and blessings.',

        // ── Prep section ──────────────────────────────────────────────────────
        prepTitle: isSv
            ? 'Förbered dig för Ramadan – Handla hos Ideal Indiska Livs'
            : 'Prepare for Ramadan – Shop at Ideal Indiska Livs',
        prepBody: isSv
            ? 'Under Ramadan är planering viktigt. Hos Ideal Indiska Livs i Bandhagen, Stockholm hittar du allt du behöver för Suhoor och Iftar — från dadlar och Rooh Afza till halal kyckling, samosas och basmatiris.'
            : 'During Ramadan, planning is key. At Ideal Indiska Livs in Bandhagen, Stockholm, you\'ll find everything you need for Suhoor and Iftar — from dates and Rooh Afza to halal chicken, samosas, and basmati rice.',
        prepNote: isSv
            ? 'Vi erbjuder även onlinebeställning med leverans till hela Sverige.'
            : 'We also offer online ordering with delivery across Sweden.',

        // ── Product links (subtle, contextual) ───────────────────────────────
        products: isSv
            ? [
                { name: 'Hamdard Rooh Afza (800ml)', desc: 'Den klassiska Ramadan-sharbaten', link: '/product/hamdard-rooh-afza-syrup-800-ml' },
                { name: 'Tang Mango (750g)', desc: 'Uppfriskande dryck för Iftar', link: '/product/tang-mango' },
                { name: 'Tang Orange (750g)', desc: 'C-vitaminboost vid fastbrytning', link: '/product/tang-orange' },
                { name: 'Crown Chicken Samosa (20 st)', desc: 'Krispiga samosas – klar på minuter', link: '/product/crown-chicken-samosa-20-st' },
                { name: 'Crown Veg Samosa (20 st)', desc: 'Vegetariska samosas för hela familjen', link: '/product/crown-veg-samosa-20-st' },
                { name: 'Crown Reshmi Kebab (15 st)', desc: 'Möra kycklingkebab – restaurangkvalitet', link: '/product/crown-reshmi-kebab-chicken-15stk' },
                { name: 'Kaalar Basmatiris (5kg)', desc: 'Aromatiskt extra-långkornigt ris', link: '/product/kaalar-extra-long-grain-steam-rice-5kg' },
                { name: 'India Gate Exotic Basmati (5kg)', desc: 'Premium basmatiris för biryani', link: '/product/ig-exotic-basmati-rice-5kg' },
                { name: 'Fortune Chakki Fresh Atta (5kg)', desc: 'Stenmalet vetemjöl för mjuka rotis', link: '/product/fortune-chakki-fresh-atta-5-kg' },
                { name: 'Alwaid Solrosolja (5 liter)', desc: 'Ren solrosolja för all fritering', link: '/product/alwaid-solrosolja-5-lit' },
            ]
            : [
                { name: 'Hamdard Rooh Afza (800ml)', desc: 'The classic Ramadan sharbat', link: '/product/hamdard-rooh-afza-syrup-800-ml' },
                { name: 'Tang Mango (750g)', desc: 'Refreshing Iftar drink', link: '/product/tang-mango' },
                { name: 'Tang Orange (750g)', desc: 'Vitamin C boost at Iftar', link: '/product/tang-orange' },
                { name: 'Crown Chicken Samosa (20 pcs)', desc: 'Crispy samosas ready in minutes', link: '/product/crown-chicken-samosa-20-st' },
                { name: 'Crown Veg Samosa (20 pcs)', desc: 'Vegetarian samosas for the whole family', link: '/product/crown-veg-samosa-20-st' },
                { name: 'Crown Reshmi Kebab (15 pcs)', desc: 'Tender chicken kebabs – restaurant quality', link: '/product/crown-reshmi-kebab-chicken-15stk' },
                { name: 'Kaalar Basmati Rice (5kg)', desc: 'Aromatic extra-long grain rice', link: '/product/kaalar-extra-long-grain-steam-rice-5kg' },
                { name: 'India Gate Exotic Basmati (5kg)', desc: 'Premium basmati rice for biryani', link: '/product/ig-exotic-basmati-rice-5kg' },
                { name: 'Fortune Chakki Fresh Atta (5kg)', desc: 'Stone-ground wheat flour for soft rotis', link: '/product/fortune-chakki-fresh-atta-5-kg' },
                { name: 'Alwaid Sunflower Oil (5 litre)', desc: 'Pure sunflower oil for all frying', link: '/product/alwaid-solrosolja-5-lit' },
            ],

        // ── FAQ ───────────────────────────────────────────────────────────────
        faqTitle: isSv
            ? 'Vanliga frågor om Ramadan 2026 i Stockholm'
            : 'Frequently Asked Questions about Ramadan 2026 in Stockholm',
        faqs: isSv
            ? [
                {
                    q: 'När börjar Ramadan 2026 i Sverige?',
                    a: 'Startdatumet för Ramadan 2026 beror på månobservation och officiellt tillkännagivande. Kontrollera med din lokala moské, exempelvis Masjid Ayesha, för bekräftelse av det exakta startdatumet.',
                },
                {
                    q: 'Var hittar jag Iftar-tider för Stockholm 2026?',
                    a: 'Iftar-tiderna (Maghrib) finns i Ramadan Kalender 2026 ovan, baserad på Masjid Ayesha Sveriges bönetider för Stockholm. Du kan även kontakta Masjid Ayesha direkt för de senaste tiderna.',
                },
                {
                    q: 'Vad är Suhoor och när ska man äta det?',
                    a: 'Suhoor är måltiden som äts före gryningen (Fajr) innan fastan börjar. Suhoor-sluttiden i kalendern visar den sista tidpunkten du kan äta och dricka innan fastan börjar för dagen.',
                },
                {
                    q: 'Vad är Iftar och hur bryter man fastan?',
                    a: 'Iftar är måltiden som bryter fastan vid solnedgång (Maghrib). Traditionen är att bryta fastan med dadlar och vatten, precis som Profeten (frid vare med honom) gjorde. Iftar-tider i kalendern visar när Maghrib-bönen infaller.',
                },
                {
                    q: 'Var kan jag köpa halal mat inför Ramadan i Stockholm?',
                    a: 'Du kan handla halal- och sydasiatiska livsmedel hos Ideal Indiska Livs i Bandhagen (Bandhagsplan 4) eller beställa online via www.ideallivs.com med leverans till hela Sverige.',
                },
                {
                    q: 'Är Ramadan Kalender 2026 gratis att ladda ner?',
                    a: 'Ja, vår Ramadan Kalender 2026 för Stockholm är helt gratis. Du kan spara bilden eller skriva ut den för enkel åtkomst under hela Ramadan.',
                },
            ]
            : [
                {
                    q: 'When does Ramadan 2026 start in Sweden?',
                    a: 'The start date of Ramadan 2026 depends on the moon sighting and official announcement. Please check with your local mosque, such as Masjid Ayesha, for confirmation of the exact start date.',
                },
                {
                    q: 'Where can I find Iftar times for Stockholm 2026?',
                    a: 'Iftar times (Maghrib) are listed in the Ramadan Calendar 2026 above, based on Masjid Ayesha Sweden\'s prayer times for Stockholm. You can also contact Masjid Ayesha directly for the latest times.',
                },
                {
                    q: 'What is Suhoor and when should I eat it?',
                    a: 'Suhoor is the pre-dawn meal eaten before Fajr prayer, before fasting begins. The Suhoor end time in the calendar shows the last moment you can eat and drink before the fast begins for the day.',
                },
                {
                    q: 'What is Iftar and how do you break the fast?',
                    a: 'Iftar is the meal that breaks the fast at sunset (Maghrib). The tradition is to break the fast with dates and water, just as the Prophet (peace be upon him) did. Iftar times in the calendar show when the Maghrib prayer falls.',
                },
                {
                    q: 'Where can I buy halal food for Ramadan in Stockholm?',
                    a: 'You can shop for halal and South Asian groceries at Ideal Indiska Livs in Bandhagen (Bandhagsplan 4) or order online at www.ideallivs.com with delivery across Sweden.',
                },
                {
                    q: 'Is the Ramadan Calendar 2026 free to download?',
                    a: 'Yes, our Ramadan Calendar 2026 for Stockholm is completely free. You can save the image or print it for easy access throughout Ramadan.',
                },
            ],

        // ── Sign off ──────────────────────────────────────────────────────────
        signOffTitle: isSv ? 'Ramadan Kareem från Ideal Indiska Livs' : 'Ramadan Kareem from Ideal Indiska Livs',
        signOffBody: isSv
            ? 'Vi önskar er och er familj en fridfull, välsignad och läcker Ramadan! Besök oss i Bandhagen eller handla online — vi är här för att göra er Ramadan enklare.'
            : 'Wishing you and your family a peaceful, blessed, and delicious Ramadan! Visit us in Bandhagen or shop online — we\'re here to make your Ramadan easier.',
        signOffAddress: 'Bandhagsplan 4, 12432 Bandhagen, Stockholm',
        signOffHours: isSv ? 'Öppet dagligen 10:00 – 20:00' : 'Open Daily 10:00 – 20:00',
        shopBtn: isSv ? 'Handla Ramadan-varor' : 'Shop Ramadan Essentials',
        allDealsBtn: isSv ? 'Se alla erbjudanden' : 'View all deals',

        // ── Sidebar ───────────────────────────────────────────────────────────
        sidebarCalTitle: isSv ? 'Snabblänkar' : 'Quick Links',
        sidebarRelatedTitle: isSv ? 'Relaterade artiklar' : 'Related Articles',
        relatedPosts: isSv
            ? [
                { title: 'Din kompletta Ramadan matlista 2026', link: '/blog/ramadan-2026' },
                { title: 'Ramadan Grocery Shortlist – Suhoor & Iftar', link: '/blog/ramadan-grocery-checklist-2026' },
            ]
            : [
                { title: 'Your Complete Ramadan Grocery List 2026', link: '/blog/ramadan-2026' },
                { title: 'Ramadan Grocery Shortlist – Suhoor & Iftar', link: '/blog/ramadan-grocery-checklist-2026' },
            ],
        storeTitle: isSv ? 'Butikens Plats' : 'Store Location',
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
            canonical: locale === 'sv' ? '/sv/blog/ramadan-kalender-2026' : locale === 'no' ? '/no/blog/ramadan-kalender-2026' : locale === 'da' ? '/da/blog/ramadan-kalender-2026' : '/blog/ramadan-kalender-2026',
            languages: {
                en: '/blog/ramadan-kalender-2026',
                sv: '/sv/blog/ramadan-kalender-2026',
                nb: '/no/blog/ramadan-kalender-2026',
                da: '/da/blog/ramadan-kalender-2026',
                'x-default': '/blog/ramadan-kalender-2026',
            },
        },
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: CALENDAR_IMAGE, width: 1200, height: 1697, alt: 'Ramadan Calendar 2026 Stockholm – Ideal Indiska Livs' }],
            type: 'article',
            locale: locale === 'sv' ? 'sv_SE' : 'en_SE',
        },
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RamadanCalendarPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const c = getContent(locale);

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
        category: 'Ramadan',
        tags: ['Ramadan 2026', 'Ramadan Calendar', 'Stockholm', 'Iftar', 'Suhoor', 'Masjid Ayesha'],
        featuredImage: CALENDAR_IMAGE,
    });

    const shareText = c.isSv ? 'Ramadan Kalender 2026 Stockholm: ' : 'Ramadan Calendar 2026 Stockholm: ';

    return (
        <div className="min-h-screen bg-background">

            {/* ─── Hero Header – green background, white text ─────────────── */}
            <section className="relative overflow-hidden bg-emerald-800">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-600/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl py-16 md:py-24 text-white">
                    {/* Breadcrumb */}
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-white/60 font-medium flex-wrap">
                            <li><Link href="/" className="hover:text-white transition-colors">{c.isSv ? 'Hem' : 'Home'}</Link></li>
                            <li><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li className="text-white/80">{c.isSv ? 'Ramadan 2026' : 'Ramadan 2026'}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Left: Text */}
                        <div>
                            <Badge className="w-fit mb-5 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
                                {c.heroBadge}
                            </Badge>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight text-white">
                                {c.heroTitle}
                            </h1>
                            <p className="text-emerald-200 text-lg mb-8 leading-relaxed">
                                {c.heroSubtitle}
                            </p>

                            {/* Author + Date */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="relative w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shrink-0 bg-white/10">
                                    <Image src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png" alt="Ideal Indiska" fill className="object-contain p-1.5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm leading-tight">Ideal Indiska LIVS Team</p>
                                    <p className="text-xs text-white/55 flex items-center gap-1.5 mt-0.5">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(PUBLISH_DATE).toLocaleDateString(c.isSv ? 'sv-SE' : 'en-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Share buttons */}
                            <div className="flex flex-wrap items-center gap-3">
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

                        {/* Right: Calendar image preview */}
                        <div className="relative">
                            <a href={CALENDAR_IMAGE} target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border-4 border-white/10 group-hover:border-yellow-400/40 transition-all duration-300">
                                    <Image
                                        src={CALENDAR_IMAGE}
                                        alt="Ramadan Calendar 2026 Stockholm – Masjid Ayesha"
                                        width={600}
                                        height={849}
                                        className="w-full object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-emerald-900 font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                                            {c.isSv ? '🔍 Öppna i full storlek' : '🔍 Open full size'}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <p className="text-center text-white/50 text-xs mt-3">{c.calendarImageCaption}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Main Content ──────────────────────────────────────────────── */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* ── Article ── */}
                        <article className="lg:col-span-8">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">

                                {/* ── Intro ── */}
                                <CalendarSection
                                    icon={<Moon className="w-6 h-6" />}
                                    iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                    title={c.introTitle}
                                >
                                    <p>{c.introBody1}</p>
                                    <p>{c.introBody2}</p>
                                </CalendarSection>

                                {/* ── What's in the calendar ── */}
                                <CalendarSection
                                    icon={<Calendar className="w-6 h-6" />}
                                    iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                    title={c.calendarContentsTitle}
                                >
                                    <div className="not-prose grid sm:grid-cols-2 gap-4 mt-2">
                                        {c.calendarItems.map((item) => (
                                            <div key={item.label} className="flex items-start gap-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5">
                                                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                                                <div>
                                                    <p className="font-bold text-foreground text-sm leading-snug mb-1">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="not-prose mt-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 text-sm text-amber-800 dark:text-amber-300">
                                        {c.calendarNote}
                                    </div>
                                </CalendarSection>

                                {/* ── Full Calendar Image (large, in article) ── */}
                                <div className="not-prose my-10">
                                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-5 tracking-tight">
                                        {c.calendarImageTitle}
                                    </h2>
                                    <a href={CALENDAR_IMAGE} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-900/50 shadow-lg group-hover:shadow-xl group-hover:border-emerald-400/60 transition-all duration-300">
                                            <Image
                                                src={CALENDAR_IMAGE}
                                                alt="Ramadan Calendar 2026 Stockholm – Masjid Ayesha Sweden"
                                                width={900}
                                                height={1273}
                                                className="w-full object-cover"
                                            />
                                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-900/80 to-transparent p-6 flex items-end justify-between">
                                                <p className="text-white font-semibold text-sm">Ramadan Calendar 2026 · Stockholm · Masjid Ayesha</p>
                                                <span className="bg-white text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-full">
                                                    {c.isSv ? '↗ Öppna' : '↗ Open'}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                    <p className="text-center text-muted-foreground text-sm mt-3">{c.calendarImageCaption}</p>
                                </div>

                                {/* ── Suhoor & Iftar Explainer ── */}
                                <CalendarSection
                                    icon={<Clock className="w-6 h-6" />}
                                    iconBg="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                                    title={c.explainerTitle}
                                >
                                    <div className="not-prose grid sm:grid-cols-2 gap-6 mt-2">
                                        {/* Suhoor card */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">🌙</span>
                                                <h3 className="font-heading font-bold text-lg text-foreground">{c.suhoorTitle}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{c.suhoorBody}</p>
                                        </div>
                                        {/* Iftar card */}
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">🌅</span>
                                                <h3 className="font-heading font-bold text-lg text-foreground">{c.iftarTitle}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{c.iftarBody}</p>
                                        </div>
                                    </div>
                                </CalendarSection>

                                {/* ── Prep / Shopping section ── */}
                                <CalendarSection
                                    icon={<Sun className="w-6 h-6" />}
                                    iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                    title={c.prepTitle}
                                >
                                    <p>{c.prepBody}</p>
                                    <p className="text-sm italic">{c.prepNote}</p>

                                    {/* Product links – clean, contextual list */}
                                    <div className="not-prose mt-6 bg-card border border-border/50 rounded-2xl overflow-hidden">
                                        <div className="bg-emerald-800 px-6 py-4">
                                            <p className="text-white font-bold text-sm uppercase tracking-widest">
                                                {c.isSv ? 'Ramadan Essentials – Handla Online' : 'Ramadan Essentials – Shop Online'}
                                            </p>
                                        </div>
                                        <div className="divide-y divide-border/30">
                                            {c.products.map((product) => (
                                                <Link
                                                    key={product.link}
                                                    href={product.link}
                                                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group"
                                                >
                                                    <div>
                                                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block leading-snug">{product.name}</span>
                                                        <span className="text-xs text-muted-foreground">{product.desc}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </CalendarSection>

                                {/* ── FAQ ── */}
                                <CalendarSection
                                    icon={<MessageCircle className="w-6 h-6" />}
                                    iconBg="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                                    title={c.faqTitle}
                                >
                                    <div className="not-prose space-y-4 mt-2">
                                        {c.faqs.map((faq, i) => (
                                            <details key={i} className="group border border-border/50 rounded-2xl overflow-hidden">
                                                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-semibold text-foreground text-sm hover:bg-muted/30 transition-colors list-none">
                                                    <span>{faq.q}</span>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-90 transition-transform" />
                                                </summary>
                                                <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/30 bg-muted/10">
                                                    {faq.a}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </CalendarSection>

                                {/* ── Sign off / CTA ── */}
                                <div className="not-prose relative overflow-hidden bg-emerald-800 rounded-3xl p-10 md:p-14 text-center mt-16">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                                    />
                                    <p className="text-yellow-300 font-bold text-sm uppercase tracking-widest mb-3">رمضان كريم</p>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 relative z-10">{c.signOffTitle}</h2>
                                    <p className="text-emerald-100/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed relative z-10">{c.signOffBody}</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Button asChild size="lg" className="rounded-full h-12 px-8 text-base font-bold bg-white text-emerald-900 hover:bg-white/90 shadow-lg">
                                            <Link href="/deals" className="flex items-center gap-2">
                                                {c.shopBtn} <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-8 text-base font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                                            <Link href="/shop" className="flex items-center gap-2">
                                                {c.allDealsBtn} <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/20 text-emerald-200/70 text-sm relative z-10 space-y-1">
                                        <p className="flex items-center justify-center gap-2"><MapPin className="w-3.5 h-3.5" /> {c.signOffAddress}</p>
                                        <p>{c.signOffHours}</p>
                                        <p>
                                            <a href="https://www.ideallivs.com" className="text-yellow-300 hover:underline font-semibold">www.ideallivs.com</a>
                                            {' · '}
                                            <a href="https://wa.me/46728494801" className="text-yellow-300 hover:underline font-semibold">WhatsApp: +46 728 494 801</a>
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </article>

                        {/* ── Sidebar ── */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8">

                                {/* Calendar download card */}
                                <div className="bg-emerald-800 rounded-3xl p-6 text-white shadow-lg">
                                    <p className="text-yellow-300 font-bold text-xs uppercase tracking-widest mb-3">
                                        {c.isSv ? 'Ladda ner kalender' : 'Download Calendar'}
                                    </p>
                                    <a href={CALENDAR_IMAGE} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-yellow-400/40 transition-all mb-4">
                                            <Image
                                                src={CALENDAR_IMAGE}
                                                alt="Ramadan Calendar 2026"
                                                width={400}
                                                height={566}
                                                className="w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full py-2.5 text-sm font-bold">
                                            {c.isSv ? '↓ Öppna & Spara Kalender' : '↓ Open & Save Calendar'}
                                        </div>
                                    </a>
                                </div>

                                {/* Related articles */}
                                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-foreground mb-4 tracking-tight">{c.sidebarRelatedTitle}</h3>
                                    <div className="space-y-3">
                                        {c.relatedPosts.map((post) => (
                                            <Link
                                                key={post.link}
                                                href={post.link}
                                                className="flex items-start gap-3 group p-3 rounded-xl hover:bg-muted/40 transition-colors"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                                                <span className="text-sm text-foreground group-hover:text-primary transition-colors font-medium leading-snug">{post.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Store Location */}
                                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm overflow-hidden">
                                    <h3 className="text-base font-heading font-bold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                                        <MapPin className="h-4 w-4 text-primary" /> {c.storeTitle}
                                    </h3>
                                    <div className="rounded-2xl overflow-hidden mb-4 h-[180px] border border-border/10">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.769278826918!2d18.048690399999998!3d59.2700036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77d07b5889cf%3A0xd20e7ba594e09663!2sIdeal%20Indiska%20Livs%20Bandhagen!5e0!3m2!1sen!2s!4v1765922506900!5m2!1sen!2s"
                                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ideal Indiska Livs location"
                                        />
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p className="text-foreground font-bold text-base">Ideal Indiska Livs</p>
                                        <p>Bandhagsplan 4, 12432 Bandhagen</p>
                                        <p className="text-primary font-semibold pt-1">{c.signOffHours}</p>
                                    </div>
                                </div>

                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <SchemaScript id="ramadan-calendar-article-schema" schema={schemaData} />
        </div>
    );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function CalendarSection({
    icon, iconBg, title, children,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-14">
            <div className="not-prose flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground leading-tight">{title}</h2>
            </div>
            {children}
        </div>
    );
}
