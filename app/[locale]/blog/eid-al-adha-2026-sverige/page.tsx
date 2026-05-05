import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar, Facebook, MessageCircle, MapPin, Clock, Star,
    CheckCircle2, ArrowRight, ShoppingBag, Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { getAlternates } from '@/lib/seo/metadata';
import { getAllPosts } from '@/lib/wordpress';
import { decodeHtmlEntities } from '@/lib/utils';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2026/05/eid-ul-adha-in-sweden-scaled.jpeg';
const PUBLISH_DATE = '2026-05-05';
const MODIFY_DATE = '2026-05-05';

// ─── All translated content ───────────────────────────────────────────────────

function getContent(locale: string) {
    const isSv = locale === 'sv';
    const localePrefix = isSv ? '/sv' : '';
    const articleUrl = `${siteConfig.site_domain}${localePrefix}/blog/eid-al-adha-2026-sverige`;

    return {
        articleUrl,
        isSv,

        // Metadata
        metaTitle: isSv
            ? 'Eid al-Adha 2026 Sverige — Datum, Bönetider & Offerfestens Mat'
            : 'Eid al-Adha 2026 Sweden — Date, Prayer Times & Festival Food Guide',
        metaDescription: isSv
            ? 'Eid al-Adha 2026 infaller runt 27 maj i Sverige. Hitta bönetider för Stockholm, Göteborg och Malmö, lär dig om Qurban-traditionen och få tips på bästa maten — kebab, biryani och orientaliska sötsaker.'
            : 'Eid al-Adha 2026 falls around May 27 in Sweden. Find prayer times for Stockholm, Gothenburg and Malmö, learn about the Qurban tradition and discover the best festive foods.',

        // Hero
        heroBadge: isSv ? 'Eid al-Adha 2026 · Offerfesten · ~27 maj' : 'Eid al-Adha 2026 · Festival of Sacrifice · ~May 27',
        heroTitle: isSv
            ? 'Eid al-Adha 2026 i Sverige: Datum, Bönetider & Festmaten'
            : 'Eid al-Adha 2026 in Sweden: Date, Prayer Times & Festive Food',
        heroCategory: isSv ? 'Eid & Festivaler' : 'Eid & Festivals',

        // TL;DR
        tldrLabel: isSv ? 'Snabbfakta — Eid al-Adha 2026 Sverige' : 'Quick Facts — Eid al-Adha 2026 Sweden',
        tldrItems: isSv ? [
            '🗓️ <strong>Datum:</strong> Runt onsdagen 27 maj 2026 (beror på månobservation — bekräftas av Islamiska Förbundet).',
            '🕌 <strong>Bönetider:</strong> Moskéerna meddelar tider 1–2 dagar före Eid — se tabell nedan för förväntade tider.',
            '🐑 <strong>Qurban i Sverige:</strong> Hemslakt är ej tillåtet — boka via halal-slakteri eller donera via välgörenhetsorganisation.',
            '🍢 <strong>Festmat:</strong> Crown Kebab (seekh, reshmi, chapli), biryani med Shan masala, Rooh Afza-sharbat och sötsaker från Anmol.',
            '🛍️ <strong>Handla hos oss:</strong> Allt för Eid-bordet finns hos <strong>Ideal Indiska Livs, Bandhagen</strong> — och online med leverans.',
        ] : [
            '🗓️ <strong>Date:</strong> Around Wednesday, May 27, 2026 (subject to moon sighting — confirmed by Islamic authorities).',
            '🕌 <strong>Prayer Times:</strong> Mosques announce times 1–2 days before Eid — see the table below for expected times.',
            '🐑 <strong>Qurban in Sweden:</strong> Home slaughter is not permitted — book via a halal slaughterhouse or donate through a charity.',
            '🍢 <strong>Festive Food:</strong> Crown Kebabs (seekh, reshmi, chapli), biryani with Shan masala, Rooh Afza sharbat and Anmol sweets.',
            '🛍️ <strong>Shop with us:</strong> Everything for the Eid table at <strong>Ideal Indiska Livs, Bandhagen</strong> — and online with delivery.',
        ],

        // Lead
        leadQuote: isSv
            ? 'Eid al-Adha — Offerfesten — är en av islams allra heligaste högtider. Den firas av muslimer världen över den tionde dagen av månaden Dhul Hijjah och minns profeten Ibrahims villighet att offra sin son som ett lydnadstest från Gud.'
            : 'Eid al-Adha — the Festival of Sacrifice — is one of the holiest occasions in Islam. Celebrated worldwide on the tenth day of Dhul Hijjah, it commemorates Prophet Ibrahim\'s willingness to sacrifice his son as an act of obedience to God.',
        leadBody: isSv
            ? 'I Sverige samlar sig det muslimska samfundet — drygt 800 000 personer — vid moskéer och idrottshallar för morgonbön, och sedan hemma vid festbord fyllda av kebab, biryani, sötsaker och traditionella drycker. Den här guiden ger dig allt du behöver: datum, bönetider för de stora städerna, tips om Qurban-traditionen i Sverige och var du handlar allt du behöver till en autentisk Eid-middag.'
            : 'In Sweden, the Muslim community gathers at mosques and sports halls for morning prayers, then around festive tables filled with kebabs, biryani, sweets and traditional drinks. This guide gives you everything: the date, prayer times for major cities, how Qurban works in Sweden, and where to shop for an authentic Eid feast.',

        // When
        whenTitle: isSv ? 'När är Eid al-Adha 2026 i Sverige?' : 'When is Eid al-Adha 2026 in Sweden?',
        whenBody1: isSv
            ? 'Eid al-Adha 2026 förväntas infalla <strong>runt onsdagen den 27 maj 2026</strong>, vilket motsvarar 10 Dhul Hijjah 1447 AH i den islamiska kalendern. Det exakta datumet beror på observationen av den nya månen för Dhul Hijjah — Islamiska Förbundet i Sverige och europeiska islamiska rådet bekräftar det officiella datumet vanligtvis 1–2 dagar i förväg.'
            : 'Eid al-Adha 2026 is expected to fall <strong>around Wednesday, May 27, 2026</strong>, corresponding to 10 Dhul Hijjah 1447 AH. The exact date depends on the sighting of the new moon for Dhul Hijjah — the Islamic Association of Sweden confirms the official date 1–2 days in advance.',
        whenBody2: isSv
            ? 'Till skillnad från Eid al-Fitr (som markerar slutet på Ramadan) infaller Eid al-Adha under Hajj-pilgrimsmånaden. Muslimer som inte är på hajj firar också högtiden med bön, Qurban-offret och gemenskap med familj och vänner.'
            : 'Unlike Eid al-Fitr (which marks the end of Ramadan), Eid al-Adha falls during the Hajj pilgrimage month. Muslims who are not on Hajj also celebrate with prayers, the Qurban sacrifice, and gathering with family and friends.',

        // Eid vs Eid
        differenceTitle: isSv ? 'Eid al-Adha vs Eid al-Fitr — Vad är skillnaden?' : 'Eid al-Adha vs Eid al-Fitr — What is the Difference?',

        // Prayer
        prayerTitle: isSv ? 'Eid al-Adha Bönetider i Sverige 2026' : 'Eid al-Adha Prayer Times in Sweden 2026',
        prayerIntro: isSv
            ? 'Bönetiderna för Eid al-Adha meddelas av varje moské vanligtvis 1–2 dagar före högtiden. Tabellen nedan visar förväntade tider baserade på tidigare år och de bekräftade tider som finns tillgängliga just nu. Kontrollera alltid din lokala moskés webbplats eller sociala medier för de slutliga tiderna.'
            : 'Eid al-Adha prayer times are announced by each mosque typically 1–2 days before the celebration. The table below shows expected times based on previous years and any confirmed times currently available. Always check your mosque\'s website for the final schedule.',
        stockholmTitle: isSv ? 'Stockholm & Omgivningar' : 'Stockholm & Surrounding Areas',
        outsideTitle: isSv ? 'Göteborg, Malmö & Övriga Städer' : 'Gothenburg, Malmö & Other Cities',
        noteLabel: isSv ? 'Obs:' : 'Note:',
        noteText: isSv
            ? 'Tider med ✅ är bekräftade. Tider med 🕐 är förväntade baserat på historiska mönster. Uppdateras löpande — kontrollera din moské kvällen före Eid.'
            : 'Times marked ✅ are confirmed. Times marked 🕐 are expected based on historical patterns. Updated continuously — always check your mosque the evening before Eid.',

        // Qurban
        qurbanTitle: isSv ? 'Qurban (Offret) i Sverige 2026 — Vad du behöver veta' : 'Qurban (the Sacrifice) in Sweden 2026 — What You Need to Know',
        qurbanBody1: isSv
            ? 'Qurban — även kallat Udhiya — är skyldigheten att offra ett djur (get, lamm, ko eller kamel) under Eid al-Adha-dagarna för varje muslim som har ekonomisk möjlighet. Köttet delas i tre lika delar: en tredjedel till familjen, en tredjedel till vänner och släkt, och en tredjedel till de behövande.'
            : 'Qurban — also called Udhiya — is the obligation to sacrifice an animal (goat, sheep, cow or camel) during the Eid al-Adha days for every Muslim who is financially able. The meat is divided into three equal parts: one for the family, one for friends and relatives, and one for those in need.',
        qurbanBody2: isSv
            ? 'I Sverige är hemslakt inte tillåtet enligt djurskyddslagen. Det finns tre vanliga alternativ för svenska muslimer:'
            : 'In Sweden, home slaughter is not permitted under animal welfare legislation. There are three common options for Swedish Muslims:',
        qurbanOptions: isSv ? [
            { title: 'Beställ via ett halal-slakteri', desc: 'Kontakta ett godkänt halal-slakteri i Sverige i god tid — kapaciteten är begränsad och det bokas snabbt inför Eid al-Adha.' },
            { title: 'Donera via välgörenhetsorganisation', desc: 'Islamic Relief Sverige, Human Appeal och liknande organisationer genomför Qurban i fattiga länder å dina vägnar och delar ut köttet till behövande.' },
            { title: 'Dela en andel (Aqeeqah-modellen)', desc: 'Flera familjer kan dela på en ko — sju andelar per ko är tillåtet enligt islamisk juridik. Samordna med din moské.' },
        ] : [
            { title: 'Order from a halal slaughterhouse', desc: 'Contact an approved halal slaughterhouse in Sweden well in advance — capacity is limited and books up quickly around Eid al-Adha.' },
            { title: 'Donate via a charity', desc: 'Islamic Relief Sweden, Human Appeal and similar organisations perform Qurban in poorer countries on your behalf and distribute the meat to those in need.' },
            { title: 'Share a portion (bovine model)', desc: 'Several families can share one cow — seven shares per cow is permitted under Islamic jurisprudence. Coordinate through your local mosque.' },
        ],

        // Food
        foodTitle: isSv ? 'Traditionell Eid al-Adha Mat — Festbordet för Offerfesten' : 'Traditional Eid al-Adha Food — The Festive Table for the Festival of Sacrifice',
        foodIntro: isSv
            ? 'Eid al-Adha-bordet är rikt på köttiga rätter — kebab, biryani, karahi och curries — samt sötsaker, drycker och traditionella bakverk. Eftersom högtiden kretsar kring köttoffer är de bästa festmenyerna just nu de som lyfter fram kvalitetskött tillagat med autentiska kryddor.'
            : 'The Eid al-Adha table is rich with meat dishes — kebabs, biryani, karahi and curries — alongside sweets, drinks and traditional pastries. Since the festival revolves around the meat offering, the best festive menus are those that celebrate quality meat cooked with authentic spices.',

        // CTA
        ctaTitle: isSv ? 'Handla Eid al-Adha-mat hos Ideal Indiska' : 'Shop Eid al-Adha Groceries at Ideal Indiska',
        ctaBody: isSv
            ? 'Besök oss i Bandhagen eller beställ online — snabb leverans i Stockholm och resten av Sverige!'
            : 'Visit us in Bandhagen or order online — fast delivery across Stockholm and all of Sweden!',
        ctaShop: isSv ? 'Handla Online' : 'Shop Online',
        ctaStore: isSv ? 'Hitta Butiken' : 'Find Our Store',

        // FAQ
        faqTitle: isSv ? 'Vanliga Frågor om Eid al-Adha 2026 i Sverige' : 'Frequently Asked Questions: Eid al-Adha 2026 in Sweden',
        faqs: isSv ? [
            {
                q: 'Vilket datum är Eid al-Adha 2026 i Sverige?',
                a: 'Eid al-Adha 2026 förväntas infalla runt onsdagen den 27 maj 2026, vilket motsvarar 10 Dhul Hijjah 1447 AH. Det exakta datumet bekräftas av Islamiska Förbundet i Sverige baserat på månobservationen.',
            },
            {
                q: 'Vad är skillnaden mellan Eid al-Adha och Eid al-Fitr?',
                a: 'Eid al-Fitr firas i slutet av Ramadan (fastedagen är slut). Eid al-Adha firas 70 dagar senare, under Hajj-månaden Dhul Hijjah, och minns profeten Ibrahims offer. Eid al-Adha räknas som den större av de två Eid-högtiderna i islamisk tradition.',
            },
            {
                q: 'Vilka är bönetiderna för Eid al-Adha i Stockholm 2026?',
                a: 'Bönetiderna meddelas av respektive moské vanligen 1–2 dagar före Eid. Stockholms Moske brukar ha tre pass: 07:00, 08:00 och 09:00. Khadija Center Kista och Alby Moske följer liknande mönster. Kontrollera alltid din moskés webbplats eller sociala medier.',
            },
            {
                q: 'Hur gör man Qurban i Sverige?',
                a: 'Hemslakt är inte tillåtet i Sverige. Du kan antingen beställa Qurban via ett godkänt halal-slakteri i god tid, eller donera via välgörenhetsorganisationer som Islamic Relief Sverige som genomför offret i fattiga länder å dina vägnar.',
            },
            {
                q: 'Vad äter man på Eid al-Adha?',
                a: 'Traditionella rätter inkluderar kebab (seekh, chapli, reshmi), biryani, haleem, karahi och verschiedene curries. Till efterrätt serveras gulab jamun, laddu, barfi och sheer khurma. Att dricka Rooh Afza-sharbat är en älskad tradition. Allt detta hittar du hos Ideal Indiska Livs i Bandhagen.',
            },
            {
                q: 'Var köper man halal kebab och Eid-mat i Stockholm?',
                a: 'Ideal Indiska Livs i Bandhagen erbjuder ett stort urval av Crown-kebab (seekh, reshmi, chapli), Shan-kryddor, Laziza-desserter och färska sötsaker från Anmol Sweets. Du kan handla i butik eller beställa online med leverans.',
            },
        ] : [
            {
                q: 'What date is Eid al-Adha 2026 in Sweden?',
                a: 'Eid al-Adha 2026 is expected around Wednesday, May 27, 2026, corresponding to 10 Dhul Hijjah 1447 AH. The exact date is confirmed by the Islamic Association of Sweden based on moon sighting.',
            },
            {
                q: 'What is the difference between Eid al-Adha and Eid al-Fitr?',
                a: 'Eid al-Fitr is celebrated at the end of Ramadan (end of fasting). Eid al-Adha comes 70 days later during the Hajj month of Dhul Hijjah and commemorates Prophet Ibrahim\'s sacrifice. Eid al-Adha is considered the greater of the two Eid celebrations in Islamic tradition.',
            },
            {
                q: 'What are the Eid al-Adha prayer times in Stockholm 2026?',
                a: 'Prayer times are announced by each mosque 1–2 days before Eid. Stockholm Grand Mosque typically holds three sessions: 07:00, 08:00 and 09:00. Khadija Center Kista and Alby Mosque follow similar patterns. Always verify on your mosque\'s website or social media.',
            },
            {
                q: 'How do you perform Qurban in Sweden?',
                a: 'Home slaughter is not permitted in Sweden. You can either book Qurban through an approved halal slaughterhouse well in advance, or donate through organisations such as Islamic Relief Sweden who perform the sacrifice in poorer countries on your behalf.',
            },
            {
                q: 'What food is eaten on Eid al-Adha?',
                a: 'Traditional dishes include kebabs (seekh, chapli, reshmi), biryani, haleem, karahi and various curries. For dessert: gulab jamun, laddu, barfi and sheer khurma. Drinking Rooh Afza sharbat is a beloved tradition. Find everything at Ideal Indiska Livs in Bandhagen.',
            },
            {
                q: 'Where to buy halal kebab and Eid food in Stockholm?',
                a: 'Ideal Indiska Livs in Bandhagen stocks a wide range of Crown kebabs (seekh, reshmi, chapli), Shan spices, Laziza dessert mixes and fresh sweets from Anmol Sweets. Shop in store or order online with delivery.',
            },
        ],

        // Closing
        wishTitle: isSv ? 'Eid al-Adha Mubarak från Ideal Indiska Livs!' : 'Eid al-Adha Mubarak from Ideal Indiska Livs!',
        wishBody: isSv
            ? 'Vi på Ideal Indiska Livs önskar dig och hela din familj en välsignad och glädjefylld Eid al-Adha 2026. Må offerfesten fylla ert hem med tacksamhet, kärlek och läckra måltider. Vi är stolta över att vara ert pålitliga val för autentiska indo-pakistanska livsmedel i Stockholm.'
            : 'We at Ideal Indiska Livs wish you and your entire family a blessed and joyful Eid al-Adha 2026. May the Festival of Sacrifice fill your home with gratitude, love and delicious meals. We are proud to be your trusted choice for authentic Indo-Pakistani groceries in Stockholm.',
    };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const c = getContent(locale);
    return {
        title: c.metaTitle,
        description: c.metaDescription,
        alternates: getAlternates('/blog/eid-al-adha-2026-sverige', locale),
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Eid al-Adha 2026 Sverige' }],
        },
        keywords: locale === 'sv'
            ? ['eid al adha 2026 sverige', 'offerfesten 2026', 'eid al adha datum 2026', 'bönetider eid al adha stockholm', 'qurban sverige 2026', 'eid al adha mat']
            : ['eid al adha 2026 sweden', 'festival of sacrifice 2026 sweden', 'eid al adha prayer times stockholm', 'qurban sweden 2026'],
    };
}

// ─── Prayer Times Data ────────────────────────────────────────────────────────

const stockholmMosques = [
    { name: 'Stockholms Moske (Medborgarplatsen)', times: '07:00, 08:00, 09:00', note: '🕐 Förväntat — bekräftas nästan', href: 'https://stockholmsmoske.se' },
    { name: 'Khadija Center Kista (nära Kista Gallerian)', times: '07:00, 07:30, 08:00', note: '🕐 Förväntat', href: 'https://khadijacenter.se' },
    { name: 'Alby Moske (Alby Idrottsplats, Albyvägen 16)', times: '06:30, 07:15, 08:00, 08:45', note: '🕐 Förväntat — ta med bönematta', href: 'https://albymoske.se' },
    { name: 'Flemingsberg Moske', times: '06:15, 07:15, 08:15', note: '🕐 Förväntat', href: null },
    { name: 'Rågsved Moske', times: '06:30, 08:00, 09:30', note: '🕐 Förväntat', href: null },
    { name: 'Aysha Moske', times: '07:00, 08:30, 10:00', note: '🕐 Förväntat', href: 'https://aysha.se' },
    { name: 'Imam Ali Islamic Center (Järfälla)', times: '08:00, 10:00', note: '🕐 Förväntat', href: 'https://imamalicenter.se' },
    { name: 'Minhaj al Quran (Kumla Gårdsväg 26A, Norsborg)', times: '07:30, 09:30', note: '🕐 Förväntat', href: null },
    { name: 'Södertälje Moske (Västergård Arena)', times: '08:00, 09:00', note: '🕐 Förväntat', href: 'https://sodertaljemoske.se' },
    { name: 'Järfälla Moske (Delfinparken)', times: '08:30', note: '🕐 Förväntat', href: null },
];

const otherCities = [
    { name: 'Göteborg Moske (Myntgatan 4)', times: '07:00, 08:00, 09:00, 10:00', note: '🕐 Förväntat — ta med bönematta' },
    { name: 'Malmö Mosken (Jägersrovägen 90)', times: '07:00', note: '🕐 Förväntat' },
    { name: 'Malmö Diyanet Camii (Sallerupsvägen 148)', times: '06:53', note: '🕐 Förväntat' },
    { name: 'Uppsala Mosque (Sportfältsvägen 1)', times: '08:30, 10:00', note: '🕐 Förväntat' },
    { name: 'Al-Rahma Moske Västerås (Malmabergsgatan 23-25)', times: '06:30, 07:30', note: '🕐 Förväntat' },
    { name: 'Karlstad Moske (Fröding Arena)', times: '08:00', note: '🕐 Förväntat' },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function EidAlAdhaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const c = getContent(locale);

    let recentPosts: any[] = [];
    try {
        recentPosts = await getAllPosts().catch(() => []);
    } catch {
        // Non-critical
    }

    const publishDateDisplay = c.isSv ? '5 maj 2026' : 'May 5, 2026';

    // ─── Schema ───────────────────────────────────────────────────────────────

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: c.metaTitle,
        image: FEATURE_IMAGE,
        datePublished: PUBLISH_DATE,
        dateModified: MODIFY_DATE,
        author: {
            '@type': 'Person',
            '@id': 'https://www.ideallivs.com/#ideal-chef',
            name: 'Ideal Chef',
            url: `${siteConfig.site_domain}/about`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Ideal Indiska Livs',
            logo: { '@type': 'ImageObject', url: `${siteConfig.site_domain}/logo.png` },
        },
        description: c.metaDescription,
        url: c.articleUrl,
        inLanguage: c.isSv ? 'sv' : 'en',
        about: {
            '@type': 'Event',
            name: 'Eid al-Adha 2026',
            startDate: '2026-05-27',
            location: { '@type': 'Country', name: 'Sweden' },
        },
        keywords: c.isSv
            ? 'eid al adha 2026 sverige, offerfesten 2026, eid al adha bönetider stockholm, qurban sverige'
            : 'eid al adha 2026 sweden, festival of sacrifice sweden 2026, eid al adha prayer times stockholm',
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
    };

    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: c.isSv ? 'Eid al-Adha 2026 i Sverige' : 'Eid al-Adha 2026 in Sweden',
        startDate: '2026-05-27',
        endDate: '2026-05-27',
        description: c.metaDescription,
        location: { '@type': 'Country', name: 'Sweden', addressCountry: 'SE' },
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* ── Hero ────────────────────────────────────────────────────────── */}
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

            {/* ── Main Content ─────────────────────────────────────────────────── */}
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

                                {/* ── When is Eid al-Adha ─────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.whenTitle}</h2>
                                <p dangerouslySetInnerHTML={{ __html: c.whenBody1 }} />
                                <p>{c.whenBody2}</p>

                                {/* Date highlight box */}
                                <div className="not-prose my-8 p-6 bg-primary text-white rounded-2xl text-center shadow-lg shadow-primary/20">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                                        {c.isSv ? 'Förväntat datum' : 'Expected Date'}
                                    </p>
                                    <p className="text-3xl font-heading font-bold">
                                        {c.isSv ? 'Onsdag 27 maj 2026' : 'Wednesday, May 27, 2026'}
                                    </p>
                                    <p className="text-sm opacity-80 mt-1">Eid al-Adha · 10 Dhul Hijjah 1447 AH</p>
                                    <p className="text-xs opacity-70 mt-2">
                                        {c.isSv
                                            ? '* Bekräftas av Islamiska Förbundet vid månobservationen'
                                            : '* Confirmed by Islamic Association upon moon sighting'}
                                    </p>
                                </div>

                                {/* Eid al-Adha vs Eid al-Fitr */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.differenceTitle}</h2>
                                <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
                                    {[
                                        {
                                            title: 'Eid al-Fitr',
                                            emoji: '🌙',
                                            points: c.isSv
                                                ? ['Firas i slutet av Ramadan', 'Kallas "Söta Eid" — markerar slutet på fastan', 'Fokus på gemenskap och tacksamhet', 'Sheer Khurma och sötsaker dominerar bordet']
                                                : ['Celebrated at the end of Ramadan', 'Called "Sweet Eid" — marks the end of fasting', 'Focus on community and gratitude', 'Sheer Khurma and sweets dominate the table'],
                                        },
                                        {
                                            title: 'Eid al-Adha',
                                            emoji: '🐑',
                                            points: c.isSv
                                                ? ['Firas under Hajj-månaden Dhul Hijjah', 'Kallas "Stora Eid" — den viktigaste av de två', 'Fokus på offret (Qurban) och generositet', 'Kebab, biryani och kötträtter i centrum']
                                                : ['Celebrated during the Hajj month of Dhul Hijjah', 'Called "Greater Eid" — the more significant of the two', 'Focus on the sacrifice (Qurban) and generosity', 'Kebabs, biryani and meat dishes take centre stage'],
                                        },
                                    ].map((card, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-card border border-border/60">
                                            <p className="text-3xl mb-2">{card.emoji}</p>
                                            <h4 className="font-heading font-bold text-foreground text-lg mb-3">{card.title}</h4>
                                            <ul className="space-y-1.5">
                                                {card.points.map((pt, j) => (
                                                    <li key={j} className="flex gap-2 items-start text-sm text-muted-foreground">
                                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                        {pt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Prayer Times ─────────────────────────────────── */}
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
                                                            : mosque.name}
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-primary tabular-nums">{mosque.times}</td>
                                                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{mosque.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-muted-foreground italic not-prose mb-8">
                                    {c.isSv ? 'Tabell 1: Stockholm Eid al-Adha 2026 — förväntade bönetider' : 'Table 1: Stockholm Eid al-Adha 2026 — expected prayer times'}
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
                                    {c.isSv ? 'Tabell 2: Andra svenska städer — förväntade tider' : 'Table 2: Other Swedish cities — expected times'}
                                </p>

                                {/* Important note */}
                                <div className="not-prose p-5 rounded-xl bg-muted/60 border border-border my-8">
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="font-bold">{c.noteLabel}</strong>{' '}{c.noteText}
                                    </p>
                                </div>

                                {/* ── Qurban Section ───────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.qurbanTitle}</h2>
                                <p>{c.qurbanBody1}</p>
                                <p>{c.qurbanBody2}</p>

                                <div className="not-prose space-y-4 my-6">
                                    {c.qurbanOptions.map((opt, i) => (
                                        <div key={i} className="flex gap-4 p-5 rounded-2xl bg-card border border-border/60 items-start">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground mb-1">{opt.title}</p>
                                                <p className="text-sm text-muted-foreground">{opt.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Food Section ─────────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.foodTitle}</h2>
                                <p>{c.foodIntro}</p>

                                {/* Crown Kebabs block */}
                                <div className="not-prose my-8 p-6 rounded-2xl bg-card border border-border/60">
                                    <div className="flex items-center gap-3 mb-5">
                                        <Utensils className="w-5 h-5 text-primary" />
                                        <h3 className="font-heading font-bold text-foreground text-xl">
                                            {c.isSv ? 'Crown Kebab — Eid-favoriten i frysdisken' : 'Crown Kebab — The Eid Favourite from the Freezer'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-5">
                                        {c.isSv
                                            ? 'Crown är ett av de mest älskade märkena för frysta kebab i den indo-pakistanska gemenskapen i Sverige. Perfekta för Eid-bordet — grilla, stek eller tillaga i ugn direkt från frysen.'
                                            : 'Crown is one of the most beloved brands for frozen kebabs in the Indo-Pakistani community in Sweden. Perfect for the Eid table — grill, fry or bake straight from frozen.'}
                                    </p>
                                    <div className="grid sm:grid-cols-3 gap-3 mb-5">
                                        {[
                                            {
                                                href: '/product/crown-seekh-kebab-lamb-15-pcs',
                                                emoji: '🥩',
                                                name: 'Crown Seekh Kebab Lamm',
                                                desc: c.isSv ? '15 st · Lammfärs med traditionella kryddor' : '15 pcs · Minced lamb with traditional spices',
                                            },
                                            {
                                                href: '/product/crown-reshmi-kebab-chicken-15stk',
                                                emoji: '🍗',
                                                name: 'Crown Reshmi Kebab Kyckling',
                                                desc: c.isSv ? '15 st · Mjuk och krämig kycklingkebab' : '15 pcs · Soft and creamy chicken kebab',
                                            },
                                            {
                                                href: '/product/crown-chapli-kebab-chicken-12-st',
                                                emoji: '🍔',
                                                name: 'Crown Chapli Kebab Kyckling',
                                                desc: c.isSv ? '12 st · Pashtunsk platt kebab med hela kryddor' : '12 pcs · Pashtun flat kebab with whole spices',
                                            },
                                        ].map((kebab, i) => (
                                            <Link key={i} href={kebab.href} className="block p-4 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors group">
                                                <p className="text-2xl mb-2">{kebab.emoji}</p>
                                                <p className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{kebab.name}</p>
                                                <p className="text-xs text-muted-foreground">{kebab.desc}</p>
                                                <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
                                                    <ArrowRight className="w-3 h-3" />
                                                    {c.isSv ? 'Se produkt' : 'View product'}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href="/brand/crown" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                                        <ArrowRight className="w-4 h-4" />
                                        {c.isSv ? 'Se alla Crown-produkter →' : 'See all Crown products →'}
                                    </Link>
                                </div>

                                {/* Shan Spices block */}
                                <div className="not-prose my-8 p-6 rounded-2xl bg-card border border-border/60">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">🌶️</span>
                                        <h3 className="font-heading font-bold text-foreground text-xl">
                                            {c.isSv ? 'Shan Masala — Rätt krydda gör hela biryani' : 'Shan Masala — The Right Spice Makes the Biryani'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {c.isSv
                                            ? 'Ingen Eid-biryani är komplett utan Shan. Shan-märket erbjuder ett komplett sortiment av färdigblandade masalas för biryani, karahi, haleem och mycket mer — perfekt för att laga autentisk Eid-mat hemma utan att kompromissa med smaken.'
                                            : 'No Eid biryani is complete without Shan. The Shan brand offers a complete range of ready-mixed masalas for biryani, karahi, haleem and much more — perfect for cooking authentic Eid food at home without compromising on flavour.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(c.isSv
                                            ? ['Shan Biryani Masala', 'Shan Haleem Mix', 'Shan Nihari Masala', 'Shan Karahi Masala', 'Shan Seekh Kebab Masala', 'Shan Qorma Masala']
                                            : ['Shan Biryani Masala', 'Shan Haleem Mix', 'Shan Nihari Masala', 'Shan Karahi Masala', 'Shan Seekh Kebab Masala', 'Shan Qorma Masala']
                                        ).map((item, i) => (
                                            <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold">{item}</span>
                                        ))}
                                    </div>
                                    <Link href="/brand/shan" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                                        <ArrowRight className="w-4 h-4" />
                                        {c.isSv ? 'Utforska alla Shan-produkter →' : 'Explore all Shan products →'}
                                    </Link>
                                </div>

                                {/* Drinks block */}
                                <div className="not-prose my-8 p-6 rounded-2xl bg-card border border-border/60">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">🥤</span>
                                        <h3 className="font-heading font-bold text-foreground text-xl">
                                            {c.isSv ? 'Eid-drycker — Rooh Afza & Tang' : 'Eid Drinks — Rooh Afza & Tang'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-5">
                                        {c.isSv
                                            ? 'Att servera kalla drycker till Eid-gästerna är en älskad tradition. Rooh Afza-sharbat är den klassiska festdrycken i varje indo-pakistanskt hem, och Tang är ett fräscht alternativ för barn och vuxna.'
                                            : 'Serving cold drinks to Eid guests is a beloved tradition. Rooh Afza sharbat is the classic festive drink in every Indo-Pakistani household, and Tang is a refreshing choice for children and adults alike.'}
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {[
                                            {
                                                href: '/product/hamdard-rooh-afza-syrup-800-ml',
                                                emoji: '🍓',
                                                name: 'Hamdard Rooh Afza Syrup 800ml',
                                                desc: c.isSv
                                                    ? 'Det ikoniska rose-sherbet-koncentratet — blanda med vatten, mjölk eller yoghurt. En Eid-klassiker sedan 1907.'
                                                    : 'The iconic rose sherbet concentrate — mix with water, milk or yoghurt. An Eid classic since 1907.',
                                            },
                                            {
                                                href: '/product/tang-orange',
                                                emoji: '🍊',
                                                name: 'Tang Orange',
                                                desc: c.isSv
                                                    ? 'Klassisk apelsinpulverdryck älskad av barn och vuxna. Perfekt att servera kyld till Eid-gästerna.'
                                                    : 'Classic orange powder drink loved by children and adults. Perfect served chilled to Eid guests.',
                                            },
                                        ].map((drink, i) => (
                                            <Link key={i} href={drink.href} className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors group items-start">
                                                <span className="text-3xl shrink-0">{drink.emoji}</span>
                                                <div>
                                                    <p className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{drink.name}</p>
                                                    <p className="text-xs text-muted-foreground">{drink.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Desserts & Sweets block */}
                                <div className="not-prose my-8 p-6 rounded-2xl bg-card border border-border/60">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">🍬</span>
                                        <h3 className="font-heading font-bold text-foreground text-xl">
                                            {c.isSv ? 'Sötsaker & Desserter — Laziza, Anmol & mer' : 'Sweets & Desserts — Laziza, Anmol & More'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-5">
                                        {c.isSv
                                            ? 'Eid utan sötsaker är ingen Eid. Bjud dina gäster på färska orientaliska sötsaker och enkla desserter som du gör hemma med Laziza-mixes.'
                                            : 'Eid without sweets is no Eid. Treat your guests to fresh oriental sweets and easy desserts made at home with Laziza mixes.'}
                                    </p>

                                    {/* Laziza */}
                                    <div className="mb-5 p-4 rounded-xl bg-muted/40 border border-border/40">
                                        <p className="font-bold text-foreground mb-1 text-sm">
                                            {c.isSv ? 'Laziza Desserter — Hemlagat på 15 minuter' : 'Laziza Desserts — Homemade in 15 Minutes'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {c.isSv
                                                ? 'Laziza erbjuder färdigblandade desserter som Kheer, Custard, Sheer Khurma och Jelly — autentisk smak utan krångel. Perfekta när gästerna är på väg.'
                                                : 'Laziza offers ready-mixed desserts like Kheer, Custard, Sheer Khurma and Jelly — authentic taste without the hassle. Perfect when guests are on their way.'}
                                        </p>
                                        <Link href="/brand/laziza" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                                            <ArrowRight className="w-3 h-3" />
                                            {c.isSv ? 'Se alla Laziza-produkter →' : 'See all Laziza products →'}
                                        </Link>
                                    </div>

                                    {/* Anmol Sweets */}
                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                                        <p className="font-bold text-foreground mb-1 text-sm">
                                            {c.isSv ? 'Anmol Sweets — Färska orientaliska sötsaker från Stockholm' : 'Anmol Sweets — Fresh Oriental Sweets from Stockholm'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            {c.isSv
                                                ? 'Gulab Jamun, Laddu, Barfi och mycket mer — handgjorda färska sötsaker tillgängliga direkt hos oss i Bandhagen. Perfekta att bjuda på eller ta med som gåva till Eid-besök.'
                                                : 'Gulab Jamun, Laddu, Barfi and much more — handmade fresh sweets available at our Bandhagen store. Perfect to serve or bring as a gift on Eid visits.'}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {['Gulab Jamun', 'Laddu', 'Barfi', 'Halwa'].map((sweet, i) => (
                                                <span key={i} className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full font-semibold border border-amber-200 dark:border-amber-700/40">{sweet}</span>
                                            ))}
                                        </div>
                                        <Link href="/product/laddu-gulab-jamun-barfi-sweets" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                                            <ArrowRight className="w-3 h-3" />
                                            {c.isSv ? 'Beställ Anmol Sweets →' : 'Order Anmol Sweets →'}
                                        </Link>
                                    </div>

                                    <div className="mt-4">
                                        <Link href="/product-category/sweets" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                                            <ArrowRight className="w-4 h-4" />
                                            {c.isSv ? 'Bläddra bland alla sötsaker →' : 'Browse all sweets →'}
                                        </Link>
                                    </div>
                                </div>

                                {/* ── Eid Tips ─────────────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">
                                    {c.isSv ? 'Tips för Eid al-Adha-firandet i Sverige' : 'Tips for Celebrating Eid al-Adha in Sweden'}
                                </h2>

                                <ul className="space-y-2 not-prose text-muted-foreground list-none pl-0">
                                    {(c.isSv ? [
                                        ['Ta med bönematta', 'Många moskéer — särskilt de i idrottshallar — kräver att du tar med din egen bönematta. Ta även med en plastpåse för skorna.'],
                                        ['Anländ tidigt', 'Eid al-Adha-bönen är populär — anländ minst 30 minuter före utsatt tid för att få en bra plats.'],
                                        ['Klä dig i festkläder', 'Det är sunnah att bära sina bästa kläder på Eid. Maj-väder i Sverige kan variera — ta med ett lager extra.'],
                                        ['Planera Qurban i förväg', 'Halal-slakterier i Sverige är bokade snabbt inför Eid al-Adha — boka din Qurban så tidigt som möjligt.'],
                                        ['Handla tidigt', 'Crown-kebab, Shan-masala och färska sötsaker från Anmol går åt snabbt inför Eid. Handla hos Ideal Indiska Livs i god tid eller beställ online.'],
                                    ] : [
                                        ['Bring a prayer mat', 'Many mosques — especially those held in sports halls — require you to bring your own prayer mat. Also bring a bag for your shoes.'],
                                        ['Arrive early', 'Eid al-Adha prayers are popular — arrive at least 30 minutes before the scheduled time to get a good spot.'],
                                        ['Dress in festive clothes', 'It is sunnah to wear your best clothes on Eid. May weather in Sweden can vary — bring an extra layer.'],
                                        ['Plan Qurban in advance', 'Halal slaughterhouses in Sweden book up quickly ahead of Eid al-Adha — reserve your Qurban as early as possible.'],
                                        ['Shop early', 'Crown kebabs, Shan masala and fresh Anmol sweets go quickly before Eid. Shop at Ideal Indiska Livs in good time or order online.'],
                                    ]).map(([title, desc], i) => (
                                        <li key={i} className="flex gap-3 items-start py-2 border-b border-border/30 last:border-0">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span><strong className="text-foreground">{title}:</strong> {desc}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* ── Deals Banner ─────────────────────────────────── */}
                                <div className="not-prose my-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">
                                        {c.isSv ? '🎉 Eid al-Adha Specialerbjudanden' : '🎉 Eid al-Adha Special Offers'}
                                    </p>
                                    <p className="font-bold text-foreground mb-1">
                                        {c.isSv
                                            ? 'Håll utkik — kampanjerna startar ungefär en vecka före Eid!'
                                            : 'Watch this space — promotions go live approximately one week before Eid!'}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {c.isSv
                                            ? 'Vi brukar sätta ut specialpriser på Crown-kebab, Shan masala, Rooh Afza, Laziza-desserter och mycket mer inför Eid al-Adha. Missa inte dina favoriter.'
                                            : 'We typically offer special prices on Crown kebabs, Shan masala, Rooh Afza, Laziza desserts and much more ahead of Eid al-Adha. Don\'t miss your favourites.'}
                                    </p>
                                    <Link href="/deals"
                                        className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                        {c.isSv ? 'Gå till Deals-sidan →' : 'Go to Deals page →'}
                                    </Link>
                                </div>

                                {/* ── Shop CTA ─────────────────────────────────────── */}
                                <div className="not-prose p-6 rounded-2xl bg-primary/5 border border-primary/20 my-12">
                                    <div className="flex items-start gap-4">
                                        <ShoppingBag className="w-6 h-6 text-primary shrink-0 mt-1" />
                                        <div>
                                            <p className="font-bold text-foreground mb-1">
                                                {c.isSv
                                                    ? 'Hitta allt för Eid al-Adha hos Ideal Indiska Livs i Bandhagen:'
                                                    : 'Find everything for Eid al-Adha at Ideal Indiska Livs in Bandhagen:'}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {[
                                                    { label: c.isSv ? 'Crown Kebab' : 'Crown Kebabs', href: '/brand/crown' },
                                                    { label: c.isSv ? 'Shan Kryddor' : 'Shan Spices', href: '/brand/shan' },
                                                    { label: 'Laziza', href: '/brand/laziza' },
                                                    { label: 'Rooh Afza', href: '/product/hamdard-rooh-afza-syrup-800-ml' },
                                                    { label: c.isSv ? 'Sötsaker' : 'Sweets', href: '/product-category/sweets' },
                                                    { label: c.isSv ? 'Basmatiris' : 'Basmati Rice', href: '/product-category/basmati-rice' },
                                                ].map((item, i) => (
                                                    <Link key={i} href={item.href}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 hover:bg-primary hover:text-white text-primary px-3 py-1.5 rounded-full transition-colors">
                                                        <ArrowRight className="w-3 h-3" /> {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── CTA Banner ───────────────────────────────────── */}
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
                                    <p className="text-xs text-muted-foreground mt-6 relative z-10 text-center">
                                        {c.isSv
                                            ? <>🎉 Håll utkik på vår <Link href="/deals" className="text-primary font-semibold underline underline-offset-2">Deals-sida</Link> — vi lägger ut specialerbjudanden för Eid al-Adha ungefär en vecka innan högtiden.</>
                                            : <>🎉 Keep an eye on our <Link href="/deals" className="text-primary font-semibold underline underline-offset-2">Deals page</Link> — we publish special Eid al-Adha promotions around one week before the celebration.</>
                                        }
                                    </p>
                                </div>

                                {/* ── FAQ ──────────────────────────────────────────── */}
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

                                {/* ── Eid Mubarak closing ───────────────────────────── */}
                                <div className="not-prose mt-16 p-8 rounded-2xl bg-primary text-white text-center shadow-xl shadow-primary/20">
                                    <p className="text-2xl font-heading font-bold mb-2">{c.wishTitle}</p>
                                    <p className="text-4xl mb-4">عيد أضحى مبارك</p>
                                    <p className="text-white/80 max-w-2xl mx-auto">{c.wishBody}</p>
                                </div>

                            </div>

                            {/* Author */}
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
                                                : '"Bringing authentic flavours from the subcontinent to the heart of Sweden — helping the Indo-Pakistani community celebrate their traditions with the right ingredients."'}
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

                            {/* Comments placeholder */}
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
                                        {c.isSv ? 'Hur firar du Eid al-Adha?' : 'How do you celebrate Eid al-Adha?'}
                                    </h4>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm">
                                        {c.isSv
                                            ? 'Dela dina traditioner, recept och tips med gemenskapen!'
                                            : 'Share your traditions, recipes and tips with the community!'}
                                    </p>
                                    <Button variant="outline" className="rounded-full px-10 h-12 border-primary/20 text-primary hover:bg-primary/5">
                                        {c.isSv ? 'Skriv en kommentar' : 'Write a Comment'}
                                    </Button>
                                </div>
                            </div>
                        </article>

                        {/* ── Sidebar ───────────────────────────────────────────── */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-10">

                                {/* Quick date widget */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-primary mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {c.isSv ? 'Eid al-Adha 2026 · Snabbinfo' : 'Eid al-Adha 2026 · Quick Info'}
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        {(c.isSv ? [
                                            ['📅 Datum', '~27 maj 2026'],
                                            ['📿 Islamisk dag', '10 Dhul Hijjah 1447'],
                                            ['🕌 Bönetider', 'Meddelas ~25 maj'],
                                            ['🐑 Qurban', 'Boka slakteri tidigt'],
                                            ['🛍️ Handla', 'Bandhagen + online'],
                                        ] : [
                                            ['📅 Date', '~May 27, 2026'],
                                            ['📿 Islamic Day', '10 Dhul Hijjah 1447'],
                                            ['🕌 Prayer Times', 'Announced ~May 25'],
                                            ['🐑 Qurban', 'Book slaughterhouse early'],
                                            ['🛍️ Shop', 'Bandhagen + online'],
                                        ]).map(([label, val], i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-border/30 pb-2 last:border-0 gap-2">
                                                <span className="text-muted-foreground">{label}</span>
                                                <span className="font-bold text-foreground text-right">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Featured products */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-primary mb-6 border-b border-primary/10 pb-3">
                                        {c.isSv ? 'Eid al-Adha Favoriter' : 'Eid al-Adha Favourites'}
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Crown Seekh Kebab Lamm', emoji: '🥩', href: '/product/crown-seekh-kebab-lamb-15-pcs' },
                                            { label: 'Crown Reshmi Kebab Kyckling', emoji: '🍗', href: '/product/crown-reshmi-kebab-chicken-15stk' },
                                            { label: 'Crown Chapli Kebab Kyckling', emoji: '🍔', href: '/product/crown-chapli-kebab-chicken-12-st' },
                                            { label: 'Hamdard Rooh Afza 800ml', emoji: '🍓', href: '/product/hamdard-rooh-afza-syrup-800-ml' },
                                            { label: 'Tang Orange', emoji: '🍊', href: '/product/tang-orange' },
                                            { label: c.isSv ? 'Anmol Sweets (Gulab Jamun, Laddu, Barfi)', emoji: '🍬', href: '/product/laddu-gulab-jamun-barfi-sweets' },
                                        ].map((item, i) => (
                                            <Link key={i} href={item.href} className="flex gap-3 group items-center hover:opacity-80 transition-opacity">
                                                <span className="text-2xl shrink-0">{item.emoji}</span>
                                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{item.label}</p>
                                            </Link>
                                        ))}
                                    </div>
                                    <Button asChild variant="outline" className="w-full mt-6 rounded-full h-10 border-primary/20 text-primary hover:bg-primary/5 text-sm">
                                        <Link href="/shop">{c.isSv ? 'Se hela sortimentet' : 'Browse full range'}</Link>
                                    </Button>
                                </div>

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

                                {/* Related posts */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-foreground mb-6 border-b border-border/10 pb-3">
                                        {c.isSv ? 'Relaterade Artiklar' : 'Related Articles'}
                                    </h3>
                                    <div className="space-y-5">
                                        <Link href="/blog/eid-al-fitr-2026-sweden" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Eid al-Fitr 2026: Bönetider i Sverige' : 'Eid al-Fitr 2026: Prayer Times in Sweden'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Eid & Festivaler' : 'Eid & Festivals'}</p>
                                        </Link>
                                        <Link href="/blog/ramadan-kalender-2026" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Ramadan Kalender 2026 — Iftar & Suhoor Tider' : 'Ramadan Calendar 2026 — Iftar & Suhoor Times'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Ramadan & Bönetider' : 'Ramadan & Prayer Times'}</p>
                                        </Link>
                                        <Link href="/blog/ramadan-grocery-checklist-2026" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Komplett Ramadan Matlista 2026' : 'Complete Ramadan Grocery Checklist 2026'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Mathandling & Tips' : 'Grocery Tips'}</p>
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

            {/* ── Schema Scripts ──────────────────────────────────────────────── */}
            <SchemaScript id="eid-al-adha-article-schema" schema={articleSchema} />
            <SchemaScript id="eid-al-adha-faq-schema" schema={faqSchema} />
            <SchemaScript id="eid-al-adha-event-schema" schema={eventSchema} />
        </div>
    );
}
