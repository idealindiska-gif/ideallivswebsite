import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Calendar, ShoppingBag, Star, CheckCircle2, ArrowRight, ChevronRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { articleSchema } from '@/lib/schema/article';
import { getAlternates } from '@/lib/seo/metadata';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2025/10/edited_3.png';
const DIWALI_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2025/04/happy-diwali-1.jpg';
const PUBLISH_DATE = '2026-04-05';

// ─── Bilingual content ────────────────────────────────────────────────────────

function getContent(locale: string) {
    const isSv = locale === 'sv';
    const localePrefix = locale !== 'en' ? `/${locale}` : '';
    const articleUrl = `${siteConfig.site_domain}${localePrefix}/blog/diwali-2026-sverige`;

    return {
        isSv,
        articleUrl,

        // ── Metadata ──────────────────────────────────────────────────────────
        metaTitle: isSv
            ? 'Diwali 2026 i Sverige – Datum, Firande & Indisk Mat | Ideal Indiska Livs'
            : 'Diwali 2026 in Sweden – Date, Celebration & Indian Food Guide',
        metaDescription: isSv
            ? 'Diwali 2026 infaller den 8 november. Komplett guide för att fira Diwali i Sverige: traditioner, mat, sötsaker och var du handlar autentiska ingredienser i Stockholm.'
            : 'Diwali 2026 falls on November 8. Complete guide to celebrating Diwali in Sweden: traditions, food, sweets, and where to shop authentic ingredients in Stockholm.',

        // ── Hero ──────────────────────────────────────────────────────────────
        heroBadge: isSv ? 'Diwali 2026 · 8 november' : 'Diwali 2026 · November 8',
        heroTitle: isSv
            ? 'Diwali 2026 i Sverige: Din Kompletta Guide till Ljusets Festival'
            : 'Diwali 2026 in Sweden: Your Complete Guide to the Festival of Lights',
        heroSubtitle: isSv
            ? 'Datum, traditioner, recept på Diwali-sötsaker och allt du behöver handla till firandet'
            : 'Date, traditions, Diwali sweet recipes, and everything you need to shop for the celebration',

        // ── TL;DR ─────────────────────────────────────────────────────────────
        tldrLabel: isSv ? 'Snabbfakta — Diwali 2026 Sverige' : 'Quick Facts — Diwali 2026 Sweden',
        tldrItems: isSv ? [
            '🪔 <strong>Datum:</strong> Diwali 2026 infaller <strong>söndagen den 8 november 2026</strong> (femte dagen = Bhai Dooj den 10 november).',
            '✨ <strong>Vad är Diwali?</strong> Ljusets festival — fem dagar av lampor, böner, sötsaker och gemenskap. Firas av hinduer, sikher och jainer världen över.',
            '🍬 <strong>Klassiska Diwali-sötsaker:</strong> Kaju katli, gulab jamun, ladoo, barfi och kheer — alla ingredienser finns hos Ideal Indiska Livs.',
            '🛍️ <strong>Handla i Stockholm:</strong> Bandhagsplan 4, Bandhagen (mån–fre 10–20, lör–sön 11–19) eller beställ online med leverans till hela Sverige.',
            '📦 <strong>Leverans:</strong> Leverans till hela Sverige via DHL. Stockholmsleverans samma dag för beställningar innan kl. 16:00.',
        ] : [
            '🪔 <strong>Date:</strong> Diwali 2026 falls on <strong>Sunday, November 8, 2026</strong> (fifth day = Bhai Dooj on November 10).',
            '✨ <strong>What is Diwali?</strong> The Festival of Lights — five days of lamps, prayers, sweets, and togetherness. Celebrated by Hindus, Sikhs, and Jains worldwide.',
            '🍬 <strong>Classic Diwali sweets:</strong> Kaju katli, gulab jamun, ladoo, barfi, and kheer — all ingredients available at Ideal Indiska Livs.',
            '🛍️ <strong>Shop in Stockholm:</strong> Bandhagsplan 4, Bandhagen (Mon–Fri 10–20, Sat–Sun 11–19) or order online with delivery across Sweden.',
            '📦 <strong>Delivery:</strong> Delivery across all of Sweden via DHL. Same-day Stockholm delivery for orders before 16:00.',
        ],

        // ── Intro ─────────────────────────────────────────────────────────────
        introTitle: isSv ? 'Vad är Diwali?' : 'What is Diwali?',
        introBody1: isSv
            ? 'Diwali — även känt som Deepavali — är en av de mest älskade festivalerna i den indiska kulturen. Ordet "Deepavali" kommer från sanskrit och betyder "rad av ljus" (deepa = lampa, avali = rad). Festivalen firas under fem dagar och symboliserar ljusets seger över mörkret, kunskapens seger över okunnighet och godhetens seger över ondska.'
            : 'Diwali — also known as Deepavali — is one of the most beloved festivals in Indian culture. The word "Deepavali" comes from Sanskrit meaning "row of lights" (deepa = lamp, avali = row). The festival is celebrated over five days and symbolises the triumph of light over darkness, knowledge over ignorance, and good over evil.',
        introBody2: isSv
            ? 'I Sverige firas Diwali av den växande indiska och sydasiatiska diasporan, som består av uppskattningsvis 30 000–40 000 personer. Festivalen samlar familjer, vänner och hela gemenskaper för böner, ljussättning, fyrverkeri och framför allt — en överflöd av hemlagade sötsaker.'
            : 'In Sweden, Diwali is celebrated by the growing Indian and South Asian diaspora, estimated at 30,000–40,000 people. The festival brings families, friends, and whole communities together for prayers, illuminations, fireworks, and above all — an abundance of homemade sweets.',

        // ── Dates ─────────────────────────────────────────────────────────────
        datesTitle: isSv ? 'När är Diwali 2026?' : 'When is Diwali 2026?',
        datesBody: isSv
            ? 'Diwali infaller på den 15:e dagen i månaden Kartik i den hinduiska månkalendern, vilket varierar varje år i den gregorianska kalendern. År 2026 infaller Diwali <strong>söndagen den 8 november 2026</strong>.'
            : 'Diwali falls on the 15th day of the Hindu lunar month of Kartik, which varies each year in the Gregorian calendar. In 2026, Diwali falls on <strong>Sunday, November 8, 2026</strong>.',
        diwaliDays: isSv ? [
            { day: 'Dag 1 — 5 nov', name: 'Dhanteras', desc: 'Köp av guld, silver och köksredskap för välstånd.' },
            { day: 'Dag 2 — 6 nov', name: 'Choti Diwali (Naraka Chaturdashi)', desc: 'Rengöring, dekorationer och förberedelse av sötsaker.' },
            { day: 'Dag 3 — 7–8 nov', name: 'Diwali Amavasya', desc: 'Huvudfirandet: lampor, Lakshmi-puja, fyrverkeri och festmåltider.' },
            { day: 'Dag 4 — 9 nov', name: 'Govardhan Puja', desc: 'Tacksägelse för grödor och naturen.' },
            { day: 'Dag 5 — 10 nov', name: 'Bhai Dooj', desc: 'Firande av bande mellan syskon — syskondag.' },
        ] : [
            { day: 'Day 1 — Nov 5', name: 'Dhanteras', desc: 'Purchase of gold, silver, and utensils for prosperity.' },
            { day: 'Day 2 — Nov 6', name: 'Choti Diwali (Naraka Chaturdashi)', desc: 'Cleaning, decorations, and preparing sweets.' },
            { day: 'Day 3 — Nov 7–8', name: 'Diwali Amavasya', desc: 'Main celebration: lamps, Lakshmi puja, fireworks, and feasts.' },
            { day: 'Day 4 — Nov 9', name: 'Govardhan Puja', desc: 'Thanksgiving for crops and nature.' },
            { day: 'Day 5 — Nov 10', name: 'Bhai Dooj', desc: 'Celebration of the sibling bond — brother-sister day.' },
        ],

        // ── Food section ──────────────────────────────────────────────────────
        foodTitle: isSv ? 'Diwali-mat och sötsaker: Klassiska recept' : 'Diwali Food & Sweets: Classic Recipes',
        foodIntro: isSv
            ? 'Diwali är lika mycket en matfestival som en ljusfestival. Att dela sötsaker (mithai) med grannar, kollegor och familj är en central tradition. Här är de mest älskade Diwali-sötsakerna och hur du lagar dem hemma med ingredienser från Ideal Indiska Livs.'
            : 'Diwali is as much a food festival as a festival of lights. Sharing sweets (mithai) with neighbours, colleagues, and family is a central tradition. Here are the most beloved Diwali sweets and how to make them at home with ingredients from Ideal Indiska Livs.',
        sweets: isSv ? [
            {
                name: 'Besan Ladoo',
                desc: 'Runda sötsaker gjorda på kikärtssmör, ghee och socker. En av de mest klassiska Diwali-sötsakerna — perfekt att göra hemma.',
                ingredients: 'Besan (kikärtsmjöl), ghee, florsocker, kardemumma',
                link: '/product-category/flour',
            },
            {
                name: 'Gulab Jamun',
                desc: 'Mjuka degbollar dränkta i sockerlag med rosenvatten och saffran. Serveras varma eller ljumma.',
                ingredients: 'Gulab jamun-mix (Gits eller MTR), mjölkpulver, ghee',
                link: '/product-category/snacks',
            },
            {
                name: 'Kheer (Risgrynspudding)',
                desc: 'Krämig indisk rispudding med mjölk, socker, kardemumma och saffran — garnerad med mandel och pistage.',
                ingredients: 'Basmatiris, helmjölk, socker, kardemumma, saffran, mandel',
                link: '/product-category/rice-grains',
            },
            {
                name: 'Mathri (Kryddiga kex)',
                desc: 'Lätta, knapriga kex med ajwain och spiskummin — perfekt tilltugg under Diwali-firandet.',
                ingredients: 'Vetemjöl, ajwain, spiskummin, ghee',
                link: '/product-category/snacks',
            },
            {
                name: 'Bikano Soan Papdi',
                desc: 'Den klassiska Diwali-godsaken — lätt, flagnande och söt. Perfekt att ge bort som en Diwali-present till vänner och familj.',
                ingredients: 'Gramsmjöl, socker, ghee, kardemumma, pistagenötter',
                link: '/product/bikano-soan-papdi',
            },
        ] : [
            {
                name: 'Besan Ladoo',
                desc: 'Round sweets made from chickpea flour, ghee, and sugar. One of the most classic Diwali sweets — perfect to make at home.',
                ingredients: 'Besan (chickpea flour), ghee, powdered sugar, cardamom',
                link: '/product-category/flour',
            },
            {
                name: 'Gulab Jamun',
                desc: 'Soft dough balls soaked in sugar syrup with rose water and saffron. Served warm or at room temperature.',
                ingredients: 'Gulab jamun mix (Gits or MTR), milk powder, ghee',
                link: '/product-category/snacks',
            },
            {
                name: 'Kheer (Rice Pudding)',
                desc: 'Creamy Indian rice pudding with milk, sugar, cardamom, and saffron — garnished with almonds and pistachios.',
                ingredients: 'Basmati rice, whole milk, sugar, cardamom, saffron, almonds',
                link: '/product-category/rice-grains',
            },
            {
                name: 'Mathri (Spiced Crackers)',
                desc: 'Light, crispy crackers flavoured with ajwain and cumin — the perfect snack during Diwali celebrations.',
                ingredients: 'Wheat flour, ajwain, cumin, ghee',
                link: '/product-category/snacks',
            },
            {
                name: 'Bikano Soan Papdi',
                desc: 'The iconic Diwali gift sweet — light, flaky, and delicately sweet. Perfect to give to friends and family as a Diwali gift box.',
                ingredients: 'Gram flour, sugar, ghee, cardamom, pistachio',
                link: '/product/bikano-soan-papdi',
            },
        ],

        // ── Shopping guide ────────────────────────────────────────────────────
        shoppingTitle: isSv
            ? 'Diwali-shoppinglista: Allt du behöver'
            : 'Diwali Shopping List: Everything You Need',
        shoppingCategories: isSv ? [
            {
                cat: 'Sötsaker & Desserter',
                link: '/product-category/snacks',
                items: ['Gulab jamun-mix (Gits)', 'Rasgulla på burk', 'Haldiram\'s Kaju Katli', 'Bikano Soan Papdi'],
            },
            {
                cat: 'Basmati ris & Mjöl',
                link: '/product-category/rice-grains',
                items: ['India Gate Basmati (5 kg)', 'Besan (kikärtsmjöl)', 'Semolina (suji)', 'Vetemjöl (atta)'],
            },
            {
                cat: 'Kryddor & Aromer',
                link: '/product-category/spices-masalas',
                items: ['Gröna kardemummakapslar', 'Saffran', 'Rosenvatten', 'Kardemummapulver', 'Muskotnöt'],
            },
            {
                cat: 'Ghee & Oljor',
                link: '/product-category/oils-ghee',
                items: ['Amul Ghee (1 kg)', 'Gowardhan Ghee', 'Kokosolja för fritering'],
            },
            {
                cat: 'Linser & Baljväxter',
                link: '/product-category/lentils-beans-dals',
                items: ['Chana dal', 'Urad dal', 'Moong dal', 'Toor dal'],
            },
            {
                cat: 'Diyas & Dekorationer',
                link: '/product/diwali-diya-set',
                items: ['Diwali Diya Set', 'LED-lampor i orange/gult', 'Rangoli-pulver', 'Rökelsepinnar'],
            },
        ] : [
            {
                cat: 'Sweets & Desserts',
                link: '/product-category/snacks',
                items: ['Gulab jamun mix (Gits)', 'Rasgulla (canned)', 'Haldiram\'s Kaju Katli', 'Bikano Soan Papdi'],
            },
            {
                cat: 'Basmati Rice & Flour',
                link: '/product-category/rice-grains',
                items: ['India Gate Basmati (5 kg)', 'Besan (chickpea flour)', 'Semolina (suji)', 'Wheat flour (atta)'],
            },
            {
                cat: 'Spices & Aromatics',
                link: '/product-category/spices-masalas',
                items: ['Green cardamom pods', 'Saffron', 'Rose water', 'Cardamom powder', 'Nutmeg'],
            },
            {
                cat: 'Ghee & Oils',
                link: '/product-category/oils-ghee',
                items: ['Amul Ghee (1 kg)', 'Gowardhan Ghee', 'Coconut oil for frying'],
            },
            {
                cat: 'Lentils & Dals',
                link: '/product-category/lentils-beans-dals',
                items: ['Chana dal', 'Urad dal', 'Moong dal', 'Toor dal'],
            },
            {
                cat: 'Diyas & Decorations',
                link: '/product/diwali-diya-set',
                items: ['Diwali Diya Set', 'LED lights (orange/yellow)', 'Rangoli powder', 'Incense sticks'],
            },
        ],

        // ── Celebrate in Sweden ───────────────────────────────────────────────
        swedenTitle: isSv
            ? 'Diwali-firande i Sverige: Tips & Traditioner'
            : 'Celebrating Diwali in Sweden: Tips & Traditions',
        swedenBody: isSv
            ? 'Att fira Diwali i Sverige innebär att kombinera autentiska traditioner med det svenska klimatets verklighet. I november är det mörkt tidigt — vilket faktiskt gör ljussättningen ännu mer magisk! Här är praktiska tips för att skapa en minnesvärd Diwali i Sverige.'
            : 'Celebrating Diwali in Sweden means blending authentic traditions with the reality of the Swedish climate. In November, darkness falls early — which actually makes the lighting even more magical! Here are practical tips for creating a memorable Diwali in Sweden.',
        tips: isSv ? [
            { icon: '🪔', title: 'Diyas och LED-ljus', desc: 'Traditionella lerlampor (diyas) med olja är svåra att hitta i Sverige — använd LED-ljus i orange och gult istället, eller beställ diyas online. Skapa ett vackert mönster (rangoli) av ris eller mjöl framför dörren.' },
            { icon: '🎇', title: 'Fyrverkeri i Sverige', desc: 'Kontrollera lokala regler — i Stockholm är fyrverkeri tillåtet för privatpersoner den 8 november. Knallskott och bengaliska ljus är populära alternativ på balkongen.' },
            { icon: '🎁', title: 'Mithai-gåvor', desc: 'Paketera hemlagade sötsaker i dekorativa lådor — en älskad Diwali-tradition. Ge till grannar, kollegor och vänner. Haldiram\'s boxar med blandade sötsaker är ett perfekt köpt alternativ.' },
            { icon: '🙏', title: 'Lakshmi Puja', desc: 'Tvätta och dekorera hemmet väl. Tänd lampor vid ingången för att välkomna gudinnan Lakshmi av välstånd och lycka. Läs mantras eller spela bhajans hemma.' },
        ] : [
            { icon: '🪔', title: 'Diyas and LED lights', desc: 'Traditional clay oil lamps (diyas) are hard to find in Sweden — use LED lights in orange and yellow instead, or order diyas online. Create a beautiful rangoli pattern of rice or flour at the entrance.' },
            { icon: '🎇', title: 'Fireworks in Sweden', desc: 'Check local rules — in Stockholm, fireworks are permitted for private individuals on November 8. Sparklers and Bengal lights are popular balcony alternatives.' },
            { icon: '🎁', title: 'Mithai gifts', desc: 'Pack homemade sweets in decorative boxes — a cherished Diwali tradition. Give to neighbours, colleagues, and friends. Haldiram\'s boxes of mixed sweets are a perfect ready-made option.' },
            { icon: '🙏', title: 'Lakshmi Puja', desc: 'Clean and decorate the home well. Light lamps at the entrance to welcome goddess Lakshmi of prosperity and good fortune. Recite mantras or play bhajans at home.' },
        ],

        // ── Shop CTA ──────────────────────────────────────────────────────────
        shopTitle: isSv
            ? 'Handla Diwali-ingredienser hos Ideal Indiska Livs'
            : 'Shop Diwali Ingredients at Ideal Indiska Livs',
        shopBody: isSv
            ? 'Ideal Indiska Livs i Bandhagen, Stockholm är din kompletta Diwali-butik. Vi lagerför allt du behöver — från ghee och besan till Haldiram\'s sötsaker, kardemumma och saffran. Beställ online och få leverans till hela Sverige via DHL, eller besök oss i butiken.'
            : 'Ideal Indiska Livs in Bandhagen, Stockholm is your one-stop Diwali shop. We stock everything you need — from ghee and besan to Haldiram\'s sweets, cardamom, and saffron. Order online for delivery across Sweden via DHL, or visit us in store.',

        // ── FAQ ───────────────────────────────────────────────────────────────
        faqTitle: isSv
            ? 'Vanliga frågor om Diwali 2026 i Sverige'
            : 'Frequently Asked Questions about Diwali 2026 in Sweden',
        faqs: isSv ? [
            {
                q: 'När är Diwali 2026 i Sverige?',
                a: 'Diwali 2026 infaller söndagen den 8 november 2026. Femtedagarsfestivalen börjar den 5 november och avslutas med Bhai Dooj den 10 november.',
            },
            {
                q: 'Vad äter man under Diwali?',
                a: 'Diwali-maten inkluderar sötsaker som gulab jamun, besan ladoo, kaju katli och kheer. Till middag serveras ofta poori med sabzi, dal makhani, biryani och paneer-rätter.',
            },
            {
                q: 'Kan man fira Diwali i Sverige med fyrverkeri?',
                a: 'I Sverige är fyrverkeri för privatpersoner tillåtet under nyårsnatten och Diwali (8 november). Kontrollera alltid lokala regler i din kommun.',
            },
            {
                q: 'Var köper man indiska Diwali-ingredienser i Stockholm?',
                a: 'Ideal Indiska Livs i Bandhagen (Bandhagsplan 4) har ett komplett sortiment av Diwali-ingredienser: ghee, besan, kardemumma, saffran, Haldiram\'s sötsaker och mer. Du kan även beställa online på ideallivs.com.',
            },
            {
                q: 'Är Diwali en allmän helgdag i Sverige?',
                a: 'Nej, Diwali är inte en allmän helgdag i Sverige. Det är en kulturell och religiös högtid som firas privat av den indiska och hinduiska diasporan.',
            },
        ] : [
            {
                q: 'When is Diwali 2026 in Sweden?',
                a: 'Diwali 2026 falls on Sunday, November 8, 2026. The five-day festival begins on November 5 and ends with Bhai Dooj on November 10.',
            },
            {
                q: 'What do you eat during Diwali?',
                a: 'Diwali food includes sweets such as gulab jamun, besan ladoo, kaju katli, and kheer. For dinner, popular dishes include poori with sabzi, dal makhani, biryani, and paneer dishes.',
            },
            {
                q: 'Can you celebrate Diwali in Sweden with fireworks?',
                a: 'In Sweden, fireworks for private individuals are permitted on New Year\'s Eve and Diwali (November 8). Always check local rules in your municipality.',
            },
            {
                q: 'Where can you buy Indian Diwali ingredients in Stockholm?',
                a: 'Ideal Indiska Livs in Bandhagen (Bandhagsplan 4) stocks a complete range of Diwali ingredients: ghee, besan, cardamom, saffron, Haldiram\'s sweets and more. You can also order online at ideallivs.com.',
            },
            {
                q: 'Is Diwali a public holiday in Sweden?',
                a: 'No, Diwali is not a public holiday in Sweden. It is a cultural and religious festival celebrated privately by the Indian and Hindu diaspora.',
            },
        ],

        // ── Sharing ───────────────────────────────────────────────────────────
        shareText: isSv ? 'Diwali 2026 i Sverige — guide till firandet: ' : 'Diwali 2026 in Sweden — celebration guide: ',
    };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const c = getContent(locale);
    const ogLocale = locale === 'sv' ? 'sv_SE' : locale === 'no' ? 'nb_NO' : locale === 'da' ? 'da_DK' : 'en_SE';

    return {
        title: c.metaTitle,
        description: c.metaDescription,
        alternates: getAlternates('/blog/diwali-2026-sverige', locale),
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Diwali 2026 Sverige – Ideal Indiska Livs' }],
            type: 'article',
            locale: ogLocale,
        },
        keywords: c.isSv
            ? ['diwali 2026 sverige', 'diwali datum 2026', 'diwali firande sverige', 'indisk mat diwali', 'diwali sötsaker stockholm', 'deepavali 2026']
            : ['diwali 2026 sweden', 'when is diwali 2026', 'diwali celebration sweden', 'diwali food sweden', 'deepavali 2026 sweden'],
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DiwaliPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const c = getContent(locale);

    const schema = articleSchema({
        title: c.metaTitle,
        description: c.metaDescription,
        content: c.metaDescription,
        url: c.articleUrl,
        authorName: 'Ideal Chef',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: `${PUBLISH_DATE}T08:00:00+02:00`,
        dateModified: `${PUBLISH_DATE}T08:00:00+02:00`,
        category: 'Festivals',
        tags: ['Diwali 2026', 'Diwali Sverige', 'Indisk mat', 'Deepavali', 'Stockholm'],
        featuredImage: FEATURE_IMAGE,
        language: locale === 'sv' ? 'sv-SE' : 'en-SE',
    });

    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: c.isSv ? 'Diwali 2026 – Ljusets Festival' : 'Diwali 2026 – Festival of Lights',
        startDate: '2026-11-05',
        endDate: '2026-11-10',
        eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'Country', name: 'Sweden' },
        description: c.isSv
            ? 'Diwali 2026 firas den 5–10 november i Sverige med huvuddagen den 8 november. Femdagarsfestivalen inkluderar böner, lampor, sötsaker och gemenskap.'
            : 'Diwali 2026 is celebrated November 5–10 in Sweden, with the main day on November 8. The five-day festival includes prayers, lights, sweets, and community.',
        organizer: { '@type': 'Organization', name: 'Ideal Indiska LIVS', url: siteConfig.site_domain },
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: c.faqs.map((f, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: f.q,
                description: f.a,
            })),
        },
    };

    return (
        <div className="min-h-screen bg-background">

            {/* ─── Hero ───────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-700 via-orange-600 to-yellow-600">
                <div className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-yellow-400/30 blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl py-16 md:py-24 text-white">
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-white/60 flex-wrap">
                            <li><Link href="/" className="hover:text-white transition-colors">{c.isSv ? 'Hem' : 'Home'}</Link></li>
                            <li><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li className="text-white/80">{c.isSv ? 'Diwali 2026' : 'Diwali 2026'}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div>
                            <span className="inline-block mb-5 bg-yellow-400/20 text-yellow-200 border border-yellow-400/30 text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
                                🪔 {c.heroBadge}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight text-white">
                                {c.heroTitle}
                            </h1>
                            <p className="text-orange-100 text-lg mb-8 leading-relaxed">{c.heroSubtitle}</p>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="relative w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shrink-0 bg-white/10">
                                    <Image src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png" alt="Ideal Indiska" fill className="object-contain p-1.5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">Ideal Chef</p>
                                    <p className="text-xs text-white/55 flex items-center gap-1.5 mt-0.5">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(PUBLISH_DATE).toLocaleDateString(c.isSv ? 'sv-SE' : 'en-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <Button asChild size="lg" className="bg-white text-orange-700 hover:bg-orange-50 font-bold rounded-full px-8">
                                <Link href="/shop">{c.isSv ? '🛍️ Handla Diwali-produkter' : '🛍️ Shop Diwali Products'}</Link>
                            </Button>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hidden lg:block">
                            <Image
                                src={FEATURE_IMAGE}
                                alt={c.isSv ? 'Diwali 2026 i Sverige – lampor, sötsaker och firande' : 'Diwali 2026 in Sweden – lights, sweets and celebration'}
                                width={600}
                                height={400}
                                className="w-full object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Main Content ────────────────────────────────────────────────── */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl">
                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* Article */}
                        <article className="lg:col-span-8 space-y-12">

                            {/* TL;DR */}
                            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-2xl p-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{c.tldrLabel}</p>
                                <ul className="space-y-2">
                                    {c.tldrItems.map((item, i) => (
                                        <li key={i} className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>

                            {/* What is Diwali */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{c.introTitle}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">{c.introBody1}</p>
                                <p className="text-muted-foreground leading-relaxed">{c.introBody2}</p>
                            </div>

                            {/* Dates */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{c.datesTitle}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: c.datesBody }} />
                                <div className="space-y-3">
                                    {c.diwaliDays.map((d, i) => (
                                        <div key={i} className="flex gap-4 items-start p-4 rounded-xl border bg-card">
                                            <div className="shrink-0 w-2 h-2 mt-2 rounded-full bg-orange-500" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium mb-0.5">{d.day}</p>
                                                <p className="font-bold text-foreground text-sm">{d.name}</p>
                                                <p className="text-sm text-muted-foreground mt-0.5">{d.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Diwali image */}
                            <div className="relative rounded-2xl overflow-hidden">
                                <Image
                                    src={DIWALI_IMAGE}
                                    alt={c.isSv ? 'Glad Diwali – lampor och firande' : 'Happy Diwali – lights and celebration'}
                                    width={800}
                                    height={450}
                                    className="w-full object-cover rounded-2xl"
                                />
                            </div>

                            {/* Food & Sweets */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{c.foodTitle}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">{c.foodIntro}</p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {c.sweets.map((s) => (
                                        <Link key={s.name} href={s.link} className="block p-5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all group">
                                            <div className="flex items-start gap-3">
                                                <Flame className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{s.name}</p>
                                                    <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
                                                    <p className="text-xs text-primary/70">{c.isSv ? 'Ingredienser: ' : 'Ingredients: '}{s.ingredients}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Shopping List */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{c.shoppingTitle}</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {c.shoppingCategories.map((cat) => (
                                        <Link key={cat.cat} href={cat.link} className="block p-5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all group">
                                            <p className="font-bold text-foreground text-sm mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                                                <ShoppingBag className="h-4 w-4 text-primary" /> {cat.cat}
                                            </p>
                                            <ul className="space-y-1.5">
                                                {cat.items.map(item => (
                                                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <Button asChild size="lg" className="rounded-full px-8 font-bold">
                                        <Link href="/shop">
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            {c.isSv ? 'Handla allt på en gång' : 'Shop everything at once'}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Celebrate in Sweden */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{c.swedenTitle}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">{c.swedenBody}</p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {c.tips.map((tip) => (
                                        <div key={tip.title} className="p-5 rounded-2xl border bg-card">
                                            <p className="text-2xl mb-2">{tip.icon}</p>
                                            <p className="font-bold text-foreground text-sm mb-1">{tip.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{c.faqTitle}</h2>
                                <div className="space-y-4">
                                    {c.faqs.map((f, i) => (
                                        <div key={i} className="p-5 rounded-2xl border bg-card">
                                            <p className="font-bold text-foreground text-sm mb-2">{f.q}</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-24 space-y-6">
                                {/* Shop CTA */}
                                <div className="rounded-2xl border bg-card p-6">
                                    <h3 className="font-heading font-bold text-lg text-foreground mb-3">{c.shopTitle}</h3>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{c.shopBody}</p>
                                    <Button asChild className="w-full rounded-full font-bold">
                                        <Link href="/shop">
                                            {c.isSv ? 'Handla nu' : 'Shop Now'} <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>

                                {/* Store info */}
                                <div className="rounded-2xl border bg-orange-50 dark:bg-orange-950/20 p-6">
                                    <p className="font-bold text-sm text-foreground mb-3">📍 {c.isSv ? 'Besök oss i butiken' : 'Visit us in store'}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Bandhagsplan 4, 124 32 Bandhagen<br />
                                        {c.isSv ? 'Mån–Fre: 10:00–20:00' : 'Mon–Fri: 10:00–20:00'}<br />
                                        {c.isSv ? 'Lör–Sön: 11:00–19:00' : 'Sat–Sun: 11:00–19:00'}
                                    </p>
                                </div>

                                {/* Related posts */}
                                <div className="rounded-2xl border bg-card p-6">
                                    <p className="font-bold text-sm text-foreground mb-4">{c.isSv ? 'Relaterade artiklar' : 'Related articles'}</p>
                                    <div className="space-y-3">
                                        <Link href="/blog/ramadan-2026" className="flex items-center gap-3 group">
                                            <Star className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {c.isSv ? 'Ramadan 2026 i Sverige' : 'Ramadan 2026 in Sweden'}
                                            </span>
                                        </Link>
                                        <Link href="/blog/the-indian-fika" className="flex items-center gap-3 group">
                                            <Star className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">The Indian Fika</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <SchemaScript id="diwali-article-schema" schema={schema} />
            <SchemaScript id="diwali-event-schema" schema={eventSchema} />
            <SchemaScript id="diwali-faq-schema" schema={faqSchema} />
        </div>
    );
}
