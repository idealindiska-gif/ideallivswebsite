import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar, Facebook, MessageCircle, MapPin, Clock, Star,
    CheckCircle2, ArrowRight, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { getAlternates } from '@/lib/seo/metadata';
import { getProducts } from '@/lib/woocommerce/products-direct';
import { getAllPosts } from '@/lib/wordpress';
import { decodeHtmlEntities } from '@/lib/utils';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2026/03/Eid-Celebration-in-Sweden.jpg';
const PUBLISH_DATE = '2026-03-15';
const MODIFY_DATE = '2026-03-19';

// ─── All translated content ───────────────────────────────────────────────────

function getContent(locale: string) {
    const isSv = locale === 'sv';
    const localePrefix = isSv ? '/sv' : '';
    const articleUrl = `${siteConfig.site_domain}${localePrefix}/blog/eid-al-fitr-2026-sweden`;

    return {
        articleUrl,
        isSv,

        // Metadata
        metaTitle: isSv
            ? 'Eid bönstider i Sverige 2026 | Komplett Guide Stockholm & mer'
            : 'Eid Prayer Timings in Sweden 2026 | Complete Guide Stockholm & More',
        metaDescription: isSv
            ? 'Bekräftade Eid al-Fitr bönetider 2026 för Stockholm, Göteborg, Malmö och Uppsala. Bönescheman, firande tips och var du handlar Eid-mat i Stockholm.'
            : 'Confirmed Eid al-Fitr prayer timings 2026 for Stockholm, Gothenburg, Malmö and Uppsala. Prayer schedules, celebration tips, and where to shop for Eid groceries in Stockholm.',

        // Hero
        heroBadge: isSv ? 'Eid al-Fitr 2026 · Fredag 20 mars' : 'Eid al-Fitr 2026 · Friday, March 20',
        heroTitle: isSv
            ? 'Eid Bönestider i Sverige 2026: Den Kompletta Guiden för Firande'
            : 'Eid Prayer Timings in Sweden 2026: The Complete Celebration Guide',
        heroCategory: isSv ? 'Eid & Festivaler' : 'Eid & Festivals',

        // TL;DR
        tldrLabel: isSv ? 'Snabbfakta — Eid 2026 Sverige' : 'Quick Facts — Eid 2026 Sweden',
        tldrItems: isSv ? [
            '🗓️ <strong>Datum:</strong> Fredagen den 20 mars 2026 (Eid al-Fitr 1447 AH) — bekräftat av islamiska förbundet.',
            '🕌 <strong>Stockholms Moske:</strong> Bönetider kl. 07:00, 08:00, 09:00 (bekräftade).',
            '🌅 <strong>Göteborg, Malmö, Uppsala:</strong> Bönetider från 07:07–10:30 beroende på moské (se tabell nedan).',
            '🛍️ <strong>Handla Eid-mat:</strong> Basmatiris, dadlar, kryddor och snacks finns hos <strong>Ideal Indiska Livs, Bandhagen</strong>.',
            '📍 <strong>Kontrollera alltid</strong> din lokala moskés webbplats — exakta tider meddelas kvällen innan Eid.',
        ] : [
            '🗓️ <strong>Date:</strong> Friday, March 20, 2026 (Eid al-Fitr 1447 AH) — confirmed by Islamic authorities.',
            '🕌 <strong>Stockholm Grand Mosque:</strong> Prayer sessions at 07:00, 08:00, 09:00 (confirmed).',
            '🌅 <strong>Gothenburg, Malmö, Uppsala:</strong> Prayer times from 07:07–10:30 depending on mosque (see table below).',
            '🛍️ <strong>Shop for Eid:</strong> Basmati rice, dates, spices & snacks available at <strong>Ideal Indiska Livs, Bandhagen</strong>.',
            '📍 <strong>Always verify</strong> with your local mosque website — exact times are announced the evening before Eid.',
        ],

        // Article Lead
        leadQuote: isSv
            ? 'Eid al-Fitr — Fastbrytandets Festival — markerar slutet på den heliga månaden Ramadan och är en av de mest firade högtiderna för muslimer världen över. I Sverige samlar den växande muslimska befolkningen på cirka 800 000 personer sig vid moskéer och gemenskapscenter för böner, festmåltider och gemenskap.'
            : 'Eid al-Fitr — the Festival of Breaking the Fast — marks the end of the holy month of Ramadan and is one of the most celebrated occasions for Muslims worldwide. In Sweden, the growing Muslim population of approximately 800,000 gathers at mosques and community centers for prayers, feasts, and fellowship.',
        leadBody: isSv
            ? 'Den här guiden ger dig allt du behöver för att planera din Eid-firande i Sverige: bekräftade och förväntade bönetider vid moskéer i Stockholm, Göteborg, Malmö och Uppsala, praktiska tips och var du hittar autentiska Eid-ingredienser i Stockholm.'
            : 'This guide gives you everything you need to plan your Eid celebration in Sweden: confirmed and expected prayer timings at mosques in Stockholm, Gothenburg, Malmö and Uppsala, practical preparation tips, and where to find authentic Eid ingredients in Stockholm.',

        // Section: When
        whenTitle: isSv ? 'När är Eid al-Fitr 2026 i Sverige?' : 'When is Eid Al-Fitr 2026 in Sweden?',
        whenBody1: isSv
            ? 'Den islamiska kalendern följer månacykeln, vilket innebär att det exakta datumet beror på månobservationen. Astronomiska beräkningar och tillkännagivanden från Europeiska Fatwarådet och Islamiska Förbundet i Sverige har bekräftat att <strong>Eid al-Fitr 2026 infaller fredagen den 20 mars 2026</strong>.'
            : 'The Islamic calendar follows the lunar cycle, meaning the exact date depends on the moon sighting. Astronomical calculations and announcements from the European Fatwa Council and the Islamic Association of Sweden (Islamiska Förbundet) have confirmed that <strong>Eid al-Fitr 2026 falls on Friday, March 20, 2026</strong>.',
        whenBody2: isSv
            ? 'Att Eid infaller på en fredag (Jumu\'ah) har särskild betydelse i islamisk tradition och kombinerar glädje med fredagsbönen välsignelser. Många moskéer anpassar sina scheman och erbjuder kombinerade Eid- och Jumu\'ah-böner.'
            : 'Eid falling on a Friday (Jumu\'ah) carries special significance in Islamic tradition, combining the joy of Eid with the blessings of Friday prayers. Many mosques will adjust their schedules accordingly, with some offering combined Eid and Jumu\'ah prayers.',

        // Section: Prayer Timings
        prayerTitle: isSv ? 'Eid Bönetider i Sverige 2026' : 'Eid Prayer Timings in Sweden 2026',
        prayerIntro: isSv
            ? 'Nedan hittar du bekräftade och förväntade bönetider vid moskéer runtom i Sverige. Observera att exakta tider vanligtvis meddelas av varje moské kvällen före Eid — kontrollera alltid deras officiella webbplats eller sociala medier för de senaste uppdateringarna.'
            : 'Below you will find confirmed and expected prayer timings at mosques across Sweden. Note that exact timings are typically announced by each mosque the evening before Eid — always check their official website or social media for the latest updates.',
        stockholmTitle: isSv ? 'Stockholm & Omgivningar' : 'Stockholm & Surrounding Areas',
        outsideTitle: isSv ? 'Övriga Svenska Städer' : 'Other Swedish Cities',
        noteLabel: isSv ? 'Viktigt:' : 'Important:',
        noteText: isSv
            ? 'Bekräftade tider är markerade med ✅. Övriga baseras på 2025 års schema — kontrollera din moskés webbplats kvällen före Eid för slutliga tider. Vi uppdaterar sidan löpande!'
            : 'Timings marked ✅ are confirmed for 2026. Others are based on 2025 schedules — always check your mosque\'s website the evening before Eid for final times. We keep this page updated!',

        // Section: Prepare
        prepareTitle: isSv ? 'Så Förbereder Du Dig för Eid i Sverige' : 'How to Prepare for Eid in Sweden',
        bringTitle: isSv ? 'Vad du bör ta med till Eid-bönen' : 'What to Bring to Eid Prayers',
        transportTitle: isSv ? 'Transporttips' : 'Transportation Tips',

        // Section: Food
        foodTitle: isSv ? 'Traditionell Eid-mat och Var du Handlar Ingredienser' : 'Traditional Eid Foods & Where to Buy Ingredients',
        foodIntro: isSv
            ? 'Ingen Eid-firande är komplett utan läcker traditionell mat. För pakistanska och indiska familjer i Sverige är tillagning av autentiska rätter en viktig del av firandet.'
            : 'No Eid celebration is complete without delicious traditional foods. For Pakistani and Indian families in Sweden, preparing authentic dishes is an important part of the celebration.',

        // CTA
        ctaTitle: isSv ? 'Handla Eid-mat hos Ideal Indiska' : 'Shop Eid Groceries at Ideal Indiska',
        ctaBody: isSv
            ? 'Besök oss i Bandhagen eller handla online för allt du behöver till din Eid-firande. Vi erbjuder snabb leverans i Stockholm med omnejd!'
            : 'Visit us in Bandhagen or shop online for everything you need for your Eid celebration. We offer fast delivery across Stockholm and surrounding areas!',
        ctaShop: isSv ? 'Handla Online' : 'Shop Online',
        ctaStore: isSv ? 'Hitta Butiken' : 'Find Our Store',

        // FAQ
        faqTitle: isSv ? 'Vanliga Frågor om Eid 2026 i Sverige' : 'Frequently Asked Questions: Eid 2026 in Sweden',
        faqs: isSv ? [
            {
                q: 'Vilket datum är Eid al-Fitr 2026 i Sverige?',
                a: 'Eid al-Fitr 2026 firas fredagen den 20 mars 2026 i Sverige, bekräftat av Europeiska Fatwarådet och Islamiska Förbundet.'
            },
            {
                q: 'Vilka är bönetiderna för Eid i Stockholm 2026?',
                a: 'Stockholms Moske (Medborgarplatsen) har bekräftat bönetiderna 07:00, 08:00 och 09:00. Flemingsberg Moske: 06:15, 07:15, 08:15. Khadija Center Kista: 07:00, 07:30, 08:00. Alby Moske: 06:30, 07:15, 08:00, 08:45. Rågsved Moske: 06:30, 08:00, 09:30. Minhaj al Quran Norsborg: 07:30, 09:30. Se hela tabellen ovan för fler moskéer.'
            },
            {
                q: 'Vilka är bönetiderna för Eid i Göteborg 2026?',
                a: 'Göteborg Moske (Myntgatan 4) har bekräftat Eid-böner kl. 07:00, 08:00, 09:00 och 10:00. Ta med din egen bönematta och en påse för skorna.'
            },
            {
                q: 'Vilka är bönetiderna för Eid i Malmö 2026?',
                a: 'Malmö Mosken (Jägersrovägen 90) har bekräftat bönetid kl. 07:00. Malmö Diyanet Camii (Sallerupsvägen 148) kl. 06:53. Ahmadiyya Muslim Jamaat Malmö håller Eid-bön kl. 10:30.'
            },
            {
                q: 'Var kan jag köpa autentisk Eid-mat i Stockholm?',
                a: 'Ideal Indiska Livs i Bandhagen, Stockholm erbjuder ett brett sortiment av basmatiris, dadlar, kryddor och Eid-godis. Du kan också beställa hem leverans online via ideallivs.com.'
            },
            {
                q: 'Behöver jag ta med bönematta till Eid-bönen i Sverige?',
                a: 'Det beror på moskén. Utomhuslokaler och idrottshallar kräver vanligtvis att du tar med egen bönematta eller lakan. Kontrollera din moskés hemsida för specifika instruktioner.'
            },
        ] : [
            {
                q: 'What date is Eid al-Fitr 2026 in Sweden?',
                a: 'Eid al-Fitr 2026 is on Friday, March 20, 2026 in Sweden, confirmed by the European Fatwa Council and the Islamic Association of Sweden (Islamiska Förbundet).'
            },
            {
                q: 'What are the Eid prayer timings in Stockholm 2026?',
                a: 'Stockholm Grand Mosque (Medborgarplatsen) has confirmed prayer sessions at 07:00, 08:00, and 09:00. Flemingsberg Mosque: 06:15, 07:15, 08:15. Khadija Center Kista: 07:00, 07:30, 08:00. Alby Mosque: 06:30, 07:15, 08:00, 08:45. Rågsved Mosque: 06:30, 08:00, 09:30. Minhaj al Quran Norsborg: 07:30, 09:30. See the full table above for more mosques.'
            },
            {
                q: 'What are the Eid prayer timings in Gothenburg 2026?',
                a: 'Göteborg Mosque (Myntgatan 4) has confirmed Eid prayers at 07:00, 08:00, 09:00, and 10:00. Please bring your own prayer mat and a bag for shoes.'
            },
            {
                q: 'What are the Eid prayer timings in Malmö 2026?',
                a: 'Malmö Mosken (Jägersrovägen 90) has confirmed Eid prayers at 07:00. Malmö Diyanet Camii (Sallerupsvägen 148) holds prayers at 06:53. Ahmadiyya Muslim Jamaat Malmö holds Eid prayers at 10:30.'
            },
            {
                q: 'Where can I buy authentic Eid groceries in Stockholm?',
                a: 'Ideal Indiska Livs in Bandhagen, Stockholm carries a wide range of basmati rice, dates, spices, and Eid sweets. You can also order online for delivery via ideallivs.com.'
            },
            {
                q: 'Do I need to bring a prayer mat to Eid prayers in Sweden?',
                a: 'It depends on the mosque. Outdoor venues and sports halls typically require you to bring your own prayer mat or sheets. Check your mosque\'s website for specific instructions.'
            },
        ],

        // Closing wish
        wishTitle: isSv ? 'Eid Mubarak från Ideal Indiska Livs!' : 'Eid Mubarak from Ideal Indiska Livs!',
        wishBody: isSv
            ? 'Vi på Ideal Indiska Livs önskar dig och din familj allt det bästa under Eid al-Fitr 2026. Må denna välsignade högtid fylla ert hem med glädje, frid och välstånd. Vi är stolta över att vara er pålitliga källa för autentiska indo-pakistanska livsmedel i Stockholm.'
            : 'We at Ideal Indiska Livs extend our warmest wishes to you and your family for Eid al-Fitr 2026. May this blessed occasion fill your home with joy, peace, and prosperity. We are proud to be your trusted source for authentic Indo-Pakistani groceries in Stockholm.',
    };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const c = getContent(locale);
    return {
        title: c.metaTitle,
        description: c.metaDescription,
        alternates: getAlternates('/blog/eid-al-fitr-2026-sweden', locale),
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Eid al-Fitr 2026 Sweden' }],
        },
        keywords: locale === 'sv'
            ? ['eid bönestider Sverige 2026', 'eid al-fitr 2026 Sverige', 'eid bönetid Stockholm', 'när är eid 2026', 'eid firande Sverige']
            : ['eid prayer timings Sweden 2026', 'eid al-fitr 2026 Sweden', 'eid prayer time Stockholm', 'when is eid 2026 Sweden', 'eid celebration Sweden'],
    };
}

// ─── Prayer Timings Data ───────────────────────────────────────────────────────

const stockholmMosques = [
    { name: 'Stockholms Moske (Medborgarplatsen)', times: '07:00, 08:00, 09:00', note: '✅ Confirmed 2026', href: 'https://stockholmsmoske.se' },
    { name: 'Flemingsberg Mosque (Prayer at moske)', times: '06:15, 07:15, 08:15', note: '✅ Confirmed 2026', href: null },
    { name: 'Fisksätra Mosque (Fisksätra Multihallen)', times: '07:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Khadija Center Kista (near Kista Gallerian)', times: '07:00, 07:30, 08:00', note: '✅ Confirmed 2026', href: 'https://khadijacenter.se' },
    { name: 'Fitja Moske', times: '06:36, 08:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Farsta Moske (Färnebogatan 64, Farsta)', times: '08:30, 09:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Rågsved Moske', times: '06:30, 08:00, 09:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Alby Moske (Alby Idrottplats, Albyvägen 16)', times: '06:30, 07:15, 08:00, 08:45', note: '✅ Confirmed — bring mat', href: 'https://albymoske.se' },
    { name: 'Aysha Moske (Prayer at Aysha Masjid)', times: '07:00, 08:30, 10:00', note: '✅ Confirmed 2026', href: 'https://aysha.se' },
    { name: 'Imam Ali Islamic Center (Järfälla)', times: '08:00, 10:00 (Stora salen)', note: '✅ Confirmed 2026', href: 'https://imamalicenter.se' },
    { name: 'Masjid Ahl al Bait Märsta (Valsta Sportshall)', times: '07:00', note: '✅ Confirmed 2026', href: null },
    { name: 'Märsta Moske (Forum, Cabinen)', times: '09:00, 10:00', note: 'Follows Saudi Arabia (19 or 20 Mar)', href: null },
    { name: 'Minhaj al Quran (Kumla Gårdsväg 26A, Norsborg)', times: '07:30, 09:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Järfälla Moske (Delfinparken)', times: '08:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Södertälje Moske (Västergård Arena, Västergatan 2)', times: '08:00, 09:00', note: '✅ Confirmed 2026', href: 'https://sodertaljemoske.se' },
];

const otherCities = [
    { name: 'Uppsala Mosque (Sportfältsvägen 1, Uppsala)', times: '08:30, 10:00', note: '✅ Confirmed 2026', href: null },
    { name: 'Malmö Mosken (Jägersrovägen 90)', times: '07:00', note: '✅ Confirmed 2026', href: 'https://mosken.se' },
    { name: 'Malmö Diyanet Camii (Sallerupsvägen 148, Malmö)', times: '06:53', note: '✅ Confirmed 2026', href: null },
    { name: 'Ahmadiyya Muslim Jamaat Malmö', times: '10:30', note: '✅ Confirmed 2026', href: 'https://ahmadiyya-islam.org' },
    { name: 'Göteborg Mosque (Myntgatan 4)', times: '07:00, 08:00, 09:00, 10:00', note: '✅ Confirmed — bring mat & shoe bag', href: null },
    { name: 'Al-Rahma Moske Västerås (Malmabergsgatan 23-25)', times: '06:30, 07:30', note: '✅ Confirmed 2026', href: null },
    { name: 'Karlstad Moske (Fröding Arena)', times: '08:00', note: '✅ Confirmed 2026', href: null },
    { name: 'Sundsvalls Moske (Nordic Hallen)', times: '08:30', note: '✅ Confirmed 2026', href: null },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function EidPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const c = getContent(locale);

    let promotionProducts: any[] = [];
    let recentPosts: any[] = [];

    try {
        const [{ data: products }, posts] = await Promise.all([
            getProducts({ per_page: 4, on_sale: true, orderby: 'date', order: 'desc' }),
            getAllPosts().catch(() => [])
        ]);
        promotionProducts = products;
        recentPosts = posts;
    } catch {
        // Sidebar data is non-critical
    }

    const publishDateDisplay = c.isSv ? '15 mars 2026' : 'March 15, 2026';

    // ─── Schema ───────────────────────────────────────────────────────────────

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": c.metaTitle,
        "image": FEATURE_IMAGE,
        "datePublished": PUBLISH_DATE,
        "dateModified": MODIFY_DATE,
        "author": {
            "@type": "Person",
            "@id": "https://www.ideallivs.com/#ideal-chef",
            "name": "Ideal Chef",
            "url": `${siteConfig.site_domain}/about`,
        },
        "publisher": {
            "@type": "Organization",
            "name": "Ideal Indiska Livs",
            "logo": { "@type": "ImageObject", "url": `${siteConfig.site_domain}/logo.png` }
        },
        "description": c.metaDescription,
        "url": c.articleUrl,
        "inLanguage": c.isSv ? "sv" : "en",
        "about": { "@type": "Event", "name": "Eid al-Fitr 2026", "startDate": "2026-03-20", "location": { "@type": "Country", "name": "Sweden" } },
        "keywords": c.isSv
            ? "eid bönestider Sverige 2026, eid al-fitr 2026 Sverige, eid bönetid Stockholm"
            : "eid prayer timings Sweden 2026, eid al-fitr 2026 Sweden, eid prayer time Stockholm",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": c.faqs.map((faq, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": faq.q,
                "description": faq.a,
            })),
        },
    };

    const eventSchema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": c.isSv ? "Eid al-Fitr 2026 i Sverige" : "Eid al-Fitr 2026 in Sweden",
        "startDate": "2026-03-20",
        "endDate": "2026-03-20",
        "description": c.metaDescription,
        "location": { "@type": "Country", "name": "Sweden", "addressCountry": "SE" },
        "organizer": { "@type": "Organization", "name": "Islamiska Förbundet" },
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden blog-hero">
                <div className="absolute inset-0 h-full w-full">
                    <Image
                        src={FEATURE_IMAGE}
                        alt={c.heroTitle}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl py-24 md:py-32 lg:py-40 text-white">
                    <nav className="mb-6 opacity-90">
                        <ol className="flex items-center gap-2 text-sm">
                            <li><Link href="/" className="hover:text-primary transition-colors">{c.isSv ? 'Hem' : 'Home'}</Link></li>
                            <li>/</li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li>/</li>
                            <li>{c.heroCategory}</li>
                        </ol>
                    </nav>

                    <div className="inline-flex items-center gap-2 bg-primary/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        <Star className="w-3 h-3" />
                        {c.heroBadge}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 max-w-4xl tracking-tight leading-[1.1]">
                        {c.heroTitle}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden shrink-0 shadow-lg bg-primary/20 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">II</span>
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Ideal Indiska Editorial</p>
                                <p className="text-sm text-white/70 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {publishDateDisplay}
                                </p>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full px-6 h-11">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(c.articleUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-4 w-4 mr-2" /> Facebook
                                </a>
                            </Button>
                            <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-6 h-11">
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(c.heroTitle + ' ' + c.articleUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main Content ──────────────────────────────────────────────── */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-2xl">
                    <div className="grid lg:grid-cols-12 gap-16">

                        {/* Article */}
                        <article className="lg:col-span-8">

                            {/* TL;DR */}
                            <div className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/20 not-prose">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{c.tldrLabel}</p>
                                <ul className="space-y-2 text-sm text-foreground">
                                    {c.tldrItems.map((item, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-primary prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground">

                                {/* Lead */}
                                <p className="text-xl text-foreground font-medium mb-8 leading-relaxed border-l-4 border-primary pl-6 py-2 italic opacity-90">
                                    {c.leadQuote}
                                </p>
                                <p>{c.leadBody}</p>

                                {/* ── When is Eid ──────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.whenTitle}</h2>
                                <p dangerouslySetInnerHTML={{ __html: c.whenBody1 }} />
                                <p>{c.whenBody2}</p>

                                {/* Date highlight box */}
                                <div className="not-prose my-8 p-6 bg-primary text-white rounded-2xl text-center shadow-lg shadow-primary/20">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                                        {c.isSv ? 'Bekräftat datum' : 'Confirmed Date'}
                                    </p>
                                    <p className="text-3xl font-heading font-bold">
                                        {c.isSv ? 'Fredag 20 mars 2026' : 'Friday, March 20, 2026'}
                                    </p>
                                    <p className="text-sm opacity-80 mt-1">Eid al-Fitr 1447 AH</p>
                                </div>

                                {/* ── Prayer Timings ───────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-4 tracking-tight">{c.prayerTitle}</h2>
                                <p>{c.prayerIntro}</p>

                                {/* Stockholm table */}
                                <h3 className="text-2xl mt-10 mb-4">{c.stockholmTitle}</h3>
                                <div className="not-prose overflow-x-auto rounded-2xl border border-border/60 shadow-sm mb-2">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-primary/10 text-foreground">
                                                <th className="text-left px-4 py-3 font-bold">{c.isSv ? 'Moské / Plats' : 'Mosque / Location'}</th>
                                                <th className="text-left px-4 py-3 font-bold">{c.isSv ? 'Bönetider' : 'Prayer Times'}</th>
                                                <th className="text-left px-4 py-3 font-bold hidden sm:table-cell">{c.isSv ? 'Status' : 'Status'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockholmMosques.map((mosque, i) => (
                                                <tr key={i} className={`border-t border-border/40 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                                                    <td className="px-4 py-3 font-medium text-foreground">
                                                        {mosque.href
                                                            ? <a href={mosque.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{mosque.name}</a>
                                                            : mosque.name
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-primary tabular-nums">{mosque.times}</td>
                                                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{mosque.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-muted-foreground italic not-prose mb-8">
                                    {c.isSv ? 'Tabell 1: Stockholm Eid 2026 Bönetider' : 'Table 1: Stockholm Eid 2026 Prayer Timings'}
                                </p>

                                {/* Other cities table */}
                                <h3 className="text-2xl mt-10 mb-4">{c.outsideTitle}</h3>
                                <div className="not-prose overflow-x-auto rounded-2xl border border-border/60 shadow-sm mb-2">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-primary/10 text-foreground">
                                                <th className="text-left px-4 py-3 font-bold">{c.isSv ? 'Stad / Moské' : 'City / Mosque'}</th>
                                                <th className="text-left px-4 py-3 font-bold">{c.isSv ? 'Bönetider' : 'Prayer Times'}</th>
                                                <th className="text-left px-4 py-3 font-bold hidden sm:table-cell">{c.isSv ? 'Notering' : 'Note'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {otherCities.map((city, i) => (
                                                <tr key={i} className={`border-t border-border/40 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                                                    <td className="px-4 py-3 font-medium text-foreground">{city.name}</td>
                                                    <td className="px-4 py-3 font-bold text-primary tabular-nums">{city.times}</td>
                                                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{city.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-muted-foreground italic not-prose mb-8">
                                    {c.isSv ? 'Tabell 2: Andra svenska städer Eid 2026 Bönetider' : 'Table 2: Other Swedish Cities Eid 2026 Prayer Timings'}
                                </p>

                                {/* Important note */}
                                <div className="not-prose p-5 rounded-xl bg-muted/60 border border-border my-8">
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="font-bold">{c.noteLabel}</strong>{' '}{c.noteText}
                                    </p>
                                </div>

                                {/* ── How to Prepare ───────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.prepareTitle}</h2>

                                <h3 className="text-2xl mt-8 mb-4">{c.bringTitle}</h3>
                                <ul className="space-y-2 not-prose text-muted-foreground list-none pl-0">
                                    {(c.isSv ? [
                                        ['Bönematta eller lakan', 'Många moskéer, särskilt de i idrottshallar eller utomhus, kräver att du tar med din egen bönematta.'],
                                        ['Påse för skor', 'Med hundratals besökare kan skoförvaring vara utmanande. Ta med en återanvändbar kasse.'],
                                        ['Lager med kläder', 'Marsvädret i Sverige kan vara oförutsägbart — klä dig varmt, särskilt vid utomhuslokaler.'],
                                        ['Paraply', 'Var beredd på regn vid utomhusbönelokaler.'],
                                        ['Kontanter för sadaqah', 'Många moskéer samlar in donationer under Eid.'],
                                    ] : [
                                        ['Prayer mat or sheets', 'Many mosques — especially sports halls and outdoor venues — require you to bring your own prayer mat.'],
                                        ['Bag for shoes', 'With hundreds of worshippers, shoe storage can be challenging. Bring a reusable bag.'],
                                        ['Layered clothing', 'March weather in Sweden can be unpredictable. Dress warmly, especially for outdoor venues.'],
                                        ['Umbrella', 'Be prepared for potential rain at outdoor prayer venues.'],
                                        ['Cash for sadaqah (donations)', 'Many mosques collect donations during Eid.'],
                                    ]).map(([title, desc], i) => (
                                        <li key={i} className="flex gap-3 items-start py-2 border-b border-border/30 last:border-0">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span><strong className="text-foreground">{title}:</strong> {desc}</span>
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="text-2xl mt-10 mb-4">{c.transportTitle}</h3>
                                <div className="not-prose p-6 rounded-2xl bg-muted/40 border border-border/40 space-y-3 text-sm text-muted-foreground">
                                    {(c.isSv ? [
                                        '🚇 Använd kollektivtrafik — SL-nätverket förbinder alla större moskéer i Stockholm effektivt.',
                                        '⏰ Anländ minst 30 minuter tidigt för att säkra en plats och undvika köer.',
                                        '🚗 Samåk med familj eller vänner om bil krävs — parkeringsplatser är begränsade.',
                                        '📱 Kontrollera SL-appen eller din moské för eventuella specialarrangemang.',
                                    ] : [
                                        '🚇 Use public transport — Stockholm\'s SL network connects all major mosques efficiently.',
                                        '⏰ Arrive at least 30 minutes early to secure a good spot and avoid crowds.',
                                        '🚗 Carpool with family or friends if driving — parking is often very limited.',
                                        '📱 Check the SL app or your mosque\'s website for any special transport arrangements.',
                                    ]).map((tip, i) => <p key={i}>{tip}</p>)}
                                </div>

                                {/* ── Eid Food ─────────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.foodTitle}</h2>
                                <p>{c.foodIntro}</p>

                                {/* Food grid */}
                                <div className="not-prose grid sm:grid-cols-2 gap-4 my-8">
                                    {(c.isSv ? [
                                        { emoji: '🍮', name: 'Sheer Khurma', desc: 'Den klassiska Eid-desserten med vermicelli, mjölk, dadlar och nötter — en tradition i varje pakistanskt och indiskt hem.' },
                                        { emoji: '🍚', name: 'Biryani', desc: 'En aromatisk risprätt med kryddor och basmatiris — ofta mittpunkten på Eid-middagen. Kräver premium basmatiris.' },
                                        { emoji: '🍬', name: 'Mithai (sötsaker)', desc: 'Barfi, Gulab Jamun, Ladoo och Halwa — du hittar Anmol-sötsaker och andra traditionella märken hos oss i Bandhagen.' },
                                        { emoji: '🥟', name: 'Frysta Snacks & Samosas', desc: 'Populära förrätter till Eid-samlingar — frysta samosas och snacks finns redo i vår frysdisk.' },
                                    ] : [
                                        { emoji: '🍮', name: 'Sheer Khurma', desc: 'The quintessential Eid dessert made with vermicelli, milk, dates and nuts — a tradition in every Pakistani and Indian household.' },
                                        { emoji: '🍚', name: 'Biryani', desc: 'A fragrant rice dish with aromatic spices and premium basmati rice — often the centrepiece of the Eid lunch or dinner.' },
                                        { emoji: '🍬', name: 'Mithai (Sweets)', desc: 'Barfi, Gulab Jamun, Ladoo and Halwa — you can find Anmol sweets and other traditional brands at our Bandhagen store.' },
                                        { emoji: '🥟', name: 'Frozen Snacks & Samosas', desc: 'Popular appetizers for Eid gatherings — frozen samosas and snacks available ready-to-cook from our freezer aisle.' },
                                    ]).map((food, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-colors">
                                            <p className="text-3xl mb-2">{food.emoji}</p>
                                            <h4 className="font-heading font-bold text-foreground mb-1">{food.name}</h4>
                                            <p className="text-sm text-muted-foreground">{food.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* EID Promotions — Deals */}
                                <div className="not-prose my-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">
                                        {c.isSv ? '🎉 Eid Erbjudanden — Handla Nu' : '🎉 Eid Special Offers — Shop Now'}
                                    </p>
                                    <p className="text-sm text-foreground font-semibold mb-4">
                                        {c.isSv
                                            ? 'Fira Eid med dina favoriter! Dessa populära produkter finns på rea just nu:'
                                            : 'Celebrate Eid with your favourites! These popular products are on promotion right now:'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: 'Laziza Kheer Mix', emoji: '🍮' },
                                            { label: 'Ahmed Kheer Mix', emoji: '🥛' },
                                            { label: c.isSv ? 'Custard' : 'Custard', emoji: '🍮' },
                                            { label: c.isSv ? 'Gelé & Jellies' : 'Jellies', emoji: '🍬' },
                                            { label: 'Regal Rusks', emoji: '🍞' },
                                            { label: 'Crown Kebabs', emoji: '🥩' },
                                        ].map((item, i) => (
                                            <Link key={i} href="/deals"
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold bg-amber-100 dark:bg-amber-900/40 hover:bg-primary hover:text-white text-amber-800 dark:text-amber-300 px-4 py-2 rounded-full transition-colors border border-amber-200 dark:border-amber-700/40">
                                                <span>{item.emoji}</span> {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        {c.isSv
                                            ? <><Link href="/deals" className="text-primary font-semibold underline underline-offset-2">Se alla Eid-deals →</Link> Erbjudanden gäller medan lagret räcker.</>
                                            : <><Link href="/deals" className="text-primary font-semibold underline underline-offset-2">View all Eid deals →</Link> Offers valid while stocks last.</>
                                        }
                                    </p>
                                </div>

                                {/* Shop CTA inline */}
                                <div className="not-prose p-6 rounded-2xl bg-primary/5 border border-primary/20 my-8">
                                    <div className="flex items-start gap-4">
                                        <ShoppingBag className="w-6 h-6 text-primary shrink-0 mt-1" />
                                        <div>
                                            <p className="font-bold text-foreground mb-1">
                                                {c.isSv
                                                    ? 'Hitta allt för Eid hos Ideal Indiska Livs i Bandhagen:'
                                                    : 'Find everything for Eid at Ideal Indiska Livs in Bandhagen:'}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {[
                                                    { label: c.isSv ? 'Basmatiris' : 'Basmati Rice', href: '/product-category/basmati-rice' },
                                                    { label: c.isSv ? 'Kryddor & Masala' : 'Spices & Masala', href: '/product-category/spice-blends' },
                                                    { label: c.isSv ? 'Dadlar & Nötter' : 'Dates & Dry Fruits', href: '/product-category/dry-fruits' },
                                                    { label: c.isSv ? 'Frysta Snacks' : 'Frozen Snacks', href: '/product-category/frozen-snacks' },
                                                    { label: c.isSv ? 'Vermicelli' : 'Vermicelli', href: '/product-category/vermicelli' },
                                                    { label: c.isSv ? 'Sötsaker' : 'Indian Sweets', href: '/product-category/sweets' },
                                                ].map((item, i) => (
                                                    <Link key={i} href={item.href}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 hover:bg-primary hover:text-white text-primary px-3 py-1.5 rounded-full transition-colors">
                                                        <ArrowRight className="w-3 h-3" /> {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-3">
                                                {c.isSv
                                                    ? <>Planerar du Ramadan? Läs vår <Link href="/blog/ramadan-2026" className="text-primary underline underline-offset-2">Ramadan Matlista 2026</Link> för fler tips.</>
                                                    : <>Planning for Ramadan too? Read our <Link href="/blog/ramadan-2026" className="text-primary underline underline-offset-2">Ramadan Grocery Checklist 2026</Link> for more tips.</>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Community Resources ───────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">
                                    {c.isSv ? 'Resurser & Användbara Länkar' : 'Community Resources & Useful Links'}
                                </h2>

                                <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
                                    {[
                                        { title: 'Stockholms Moske', url: 'stockholmsmoske.se', desc: c.isSv ? 'Officiella tillkännagivanden och bönetider' : 'Official announcements and prayer times' },
                                        { title: 'Islamiska Förbundet', url: 'islamiskaforbundet.se', desc: c.isSv ? 'Enhetliga bönetider för Sverige' : 'Unified prayer timetables for Sweden' },
                                        { title: 'Muslim Pro', url: 'muslimpro.com', desc: c.isSv ? 'App för bönetider, Koranen och islamisk kalender' : 'Prayer times, Quran and Islamic calendar app' },
                                        { title: 'IslamicFinder', url: 'islamicfinder.org', desc: c.isSv ? 'Bönetider och Ramadankalendrar' : 'Prayer times and Ramadan calendars' },
                                    ].map((res, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-card border border-border/50">
                                            <p className="font-bold text-foreground text-sm">{res.title}</p>
                                            <p className="text-xs text-primary mb-1">{res.url}</p>
                                            <p className="text-xs text-muted-foreground">{res.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* ── CTA Banner ───────────────────────────────── */}
                                <div className="not-prose mt-16 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/20 text-center shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 relative z-10">Ideal Indiska Livs · Bandhagen</p>
                                    <h3 className="text-3xl font-heading font-bold text-foreground mb-4 relative z-10">{c.ctaTitle}</h3>
                                    <p className="text-lg mb-8 text-muted-foreground relative z-10 max-w-xl mx-auto">{c.ctaBody}</p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 rounded-full text-lg h-14 shadow-lg shadow-primary/20">
                                            <Link href="/shop">{c.ctaShop}</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="px-10 rounded-full text-lg h-14 bg-background border-primary/30 text-primary hover:bg-primary/5 transition-all">
                                            <Link href="/contact">{c.ctaStore}</Link>
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-6 relative z-10">
                                        {c.isSv
                                            ? <>Njuter du av deals? Kolla in vår <Link href="/deals" className="text-primary underline underline-offset-2">Veckans Deals</Link> för extra besparingar.</>
                                            : <>Looking for savings? Check out our <Link href="/deals" className="text-primary underline underline-offset-2">Weekly Deals</Link> for extra discounts.</>
                                        }
                                    </p>
                                </div>

                                {/* ── FAQ Section ──────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-8 tracking-tight">{c.faqTitle}</h2>
                                <div className="not-prose space-y-4">
                                    {c.faqs.map((faq, i) => (
                                        <details key={i} className="group border border-border/60 rounded-2xl bg-card overflow-hidden">
                                            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-foreground text-base list-none hover:bg-primary/5 transition-colors">
                                                <span>{faq.q}</span>
                                                <span className="text-primary ml-4 shrink-0 group-open:rotate-180 transition-transform">▼</span>
                                            </summary>
                                            <div className="px-6 pb-5 pt-1 text-muted-foreground text-sm leading-relaxed border-t border-border/40">
                                                {faq.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>

                                {/* ── Eid Mubarak closing ───────────────────────── */}
                                <div className="not-prose mt-16 p-8 rounded-2xl bg-primary text-white text-center shadow-xl shadow-primary/20">
                                    <p className="text-2xl font-heading font-bold mb-2">{c.wishTitle}</p>
                                    <p className="text-4xl mb-4">عيد مبارك</p>
                                    <p className="text-white/80 max-w-2xl mx-auto">{c.wishBody}</p>
                                </div>

                            </div>

                            {/* Author Section */}
                            <div className="mt-20 pt-12 border-t border-border/60">
                                <div className="bg-muted/40 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-start border border-border/40 hover:border-primary/20 transition-colors group">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-background shadow-xl bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-bold text-2xl">II</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-2xl font-heading font-bold mb-1">Ideal Indiska Editorial Team</h4>
                                            <p className="text-sm text-primary font-bold tracking-[0.15em] uppercase">
                                                {c.isSv ? 'Indo-Pakistansk Mat & Kultur' : 'Indo-Pakistani Food & Culture'}
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed italic">
                                            {c.isSv
                                                ? '"Vi för autentiska smaker från subkontinenten till hjärtat av Sverige och hjälper det indo-pakistanska samfundet att fira sina traditioner med rätt ingredienser."'
                                                : '"Bringing authentic flavours from the subcontinent to the heart of Sweden — helping the Indo-Pakistani community celebrate their traditions with the right ingredients."'
                                            }
                                        </p>
                                        <div className="flex gap-6">
                                            <Link href="/about" className="text-sm font-bold text-primary uppercase tracking-widest hover:tracking-[0.3em] transition-all">
                                                {c.isSv ? 'Vår Historia' : 'Our Story'}
                                            </Link>
                                            <Link href="/contact" className="text-sm font-bold text-primary uppercase tracking-widest hover:tracking-[0.3em] transition-all">
                                                {c.isSv ? 'Kontakta Oss' : 'Contact Us'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="mt-20 pt-12 border-t border-border/60">
                                <div className="flex items-center gap-6 mb-10">
                                    <h3 className="text-2xl font-heading font-bold text-foreground tracking-tight">
                                        {c.isSv ? 'Gemenskapens Tankar' : 'Community Thoughts'}
                                    </h3>
                                    <div className="h-px flex-1 bg-border/40" />
                                </div>
                                <div className="bg-background border border-border/50 rounded-[2rem] p-12 text-center shadow-sm">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-primary mb-6">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-heading font-bold mb-2">
                                        {c.isSv ? 'Dela din Eid-upplevelse!' : 'Share your Eid experience!'}
                                    </h4>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm">
                                        {c.isSv
                                            ? 'Hur firar du Eid i Sverige? Dela dina tips med gemenskapen.'
                                            : 'How do you celebrate Eid in Sweden? Share your tips with the community.'}
                                    </p>
                                    <Button variant="outline" className="rounded-full px-10 h-12 border-primary/20 text-primary hover:bg-primary/5">
                                        {c.isSv ? 'Skriv en kommentar' : 'Write a Comment'}
                                    </Button>
                                </div>
                            </div>
                        </article>

                        {/* ── Sidebar ───────────────────────────────────────── */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-10">

                                {/* Quick Prayer Times widget */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-primary mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {c.isSv ? 'Bönetider Stockholm 2026' : 'Stockholm Prayer Times 2026'}
                                    </h3>
                                    <div className="space-y-2">
                                        {stockholmMosques.slice(0, 4).map((m, i) => (
                                            <div key={i} className="flex justify-between items-start text-xs gap-2 border-b border-border/30 pb-2 last:border-0">
                                                <span className="text-muted-foreground leading-tight">{m.name.split('(')[0].trim()}</span>
                                                <span className="font-bold text-primary shrink-0 tabular-nums">{m.times.split(',')[0]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 italic">
                                        {c.isSv ? '* Kontrollera alltid din moskés webbplats.' : '* Always verify with your mosque.'}
                                    </p>
                                </div>

                                {/* Deals / promotions */}
                                {promotionProducts.length > 0 && (
                                    <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                        <h3 className="text-base font-heading font-bold text-primary mb-6 border-b border-primary/10 pb-3">
                                            {c.isSv ? 'Eid-erbjudanden' : 'Eid Special Offers'}
                                        </h3>
                                        <div className="space-y-4">
                                            {promotionProducts.map((product) => (
                                                <Link key={product.id} href={`/product/${product.slug}`} className="flex gap-3 group items-center">
                                                    <div className="relative w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/20">
                                                        {product.images[0] && (
                                                            <Image src={product.images[0].src} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="56px" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
                                                            {decodeHtmlEntities(product.name)}
                                                        </h4>
                                                        <p className="text-primary font-bold text-sm">{product.price} SEK</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <Button asChild variant="outline" className="w-full mt-6 rounded-full h-10 border-primary/20 text-primary hover:bg-primary/5 text-sm">
                                            <Link href="/deals">{c.isSv ? 'Se Alla Deals' : 'View All Deals'}</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Map */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm overflow-hidden">
                                    <h3 className="text-base font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {c.isSv ? 'Vår Butik' : 'Our Store'}
                                    </h3>
                                    <div className="rounded-[1.5rem] overflow-hidden mb-4 h-[200px] border border-border/10">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.769278826918!2d18.048690399999998!3d59.2700036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77d07b5889cf%3A0xd20e7ba594e09663!2sIdeal%20Indiska%20Livs%20Bandhagen!5e0!3m2!1sen!2s!4v1765922506900!5m2!1sen!2s"
                                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    <p className="font-bold text-sm text-foreground">Ideal Indiska Livs</p>
                                    <p className="text-xs text-muted-foreground">Bandhagsplan 4, 12432 Bandhagen, Stockholm</p>
                                </div>

                                {/* Related Posts */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-foreground mb-6 border-b border-border/10 pb-3">
                                        {c.isSv ? 'Relaterade Artiklar' : 'Related Articles'}
                                    </h3>
                                    <div className="space-y-5">
                                        <Link href="/blog/ramadan-2026" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Din Kompletta Ramadan Matlista för Stockholm 2026' : 'Your Essential Ramadan Grocery Checklist Stockholm 2026'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Livsmedelstips & Recept' : 'Grocery Tips & Recipes'}</p>
                                        </Link>
                                        <Link href="/blog/ramadan-grocery-checklist-2026" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Komplett Ramadan Checklista 2026' : 'Complete Ramadan Checklist 2026'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Förberedelser & Guide' : 'Preparation & Guide'}</p>
                                        </Link>
                                        <Link href="/blog/the-indian-fika" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Indian Fika: 5 Indiska Mellanmål till Ditt Te' : 'The Indian Fika: 5 Savory Snacks for Your Tea'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Kultur & Mat' : 'Culture & Food'}</p>
                                        </Link>
                                        {recentPosts.slice(0, 2).map((post: any) => (
                                            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                                                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                    {decodeHtmlEntities(post.title.rendered)}
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(post.date).toLocaleDateString()}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* ── Schema Scripts ────────────────────────────────────────────── */}
            <SchemaScript id="eid-article-schema" schema={articleSchema} />
            <SchemaScript id="eid-faq-schema" schema={faqSchema} />
            <SchemaScript id="eid-event-schema" schema={eventSchema} />
        </div>
    );
}
