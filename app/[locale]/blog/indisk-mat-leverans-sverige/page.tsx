import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
    Calendar, Facebook, MessageCircle, MapPin, Clock, Star,
    CheckCircle2, ArrowRight, ShoppingBag, Truck, Package, Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { getAlternates } from '@/lib/seo/metadata';
import { getAllPosts } from '@/lib/wordpress';
import { decodeHtmlEntities } from '@/lib/utils';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2026/01/Delivey-Post-scaled-e1768345875656.jpg';
const PUBLISH_DATE = '2026-05-05';
const MODIFY_DATE = '2026-05-06';

// ─── Content ──────────────────────────────────────────────────────────────────

function getContent(locale: string) {
    const isSv = locale === 'sv';
    const localePrefix = isSv ? '/sv' : '';
    const articleUrl = `${siteConfig.site_domain}${localePrefix}/blog/indisk-mat-leverans-sverige`;

    return {
        articleUrl,
        isSv,

        metaTitle: isSv
            ? 'Indisk Mat Leverans Sverige — Stockholm, Södertälje Gratis & DHL Hela Sverige'
            : 'Indian Food Delivery Sweden — Stockholm, Södertälje Free Delivery & DHL Nationwide',
        metaDescription: isSv
            ? 'Beställ autentiska indiska och pakistanska livsmedel online. Samma-dagleverans i Stockholm, gratis leverans till Södertälje (postnr 151–152, order 1 000+ kr), gratis helgleverans till Järfälla & Upplands-Bro (500+ kr), och DHL till hela Sverige.'
            : 'Order authentic Indian and Pakistani groceries online. Same-day delivery in Stockholm, free delivery to Södertälje (postcodes 151–152, orders 1,000+ SEK), free weekend delivery to Järfälla & Upplands-Bro (500+ SEK), and DHL across Sweden.',

        heroBadge: isSv ? 'Leveransguide · Hela Sverige' : 'Delivery Guide · All of Sweden',
        heroTitle: isSv
            ? 'Indisk Mat Leverans i Sverige — Hur det Fungerar'
            : 'Indian Food Delivery in Sweden — How It Works',
        heroCategory: isSv ? 'Leverans & Handla Online' : 'Delivery & Online Shopping',

        tldrLabel: isSv ? 'Snabbguide — Alla Leveransalternativ' : 'Quick Guide — All Delivery Options',
        tldrItems: isSv ? [
            '🚀 <strong>Samma-dagleverans Stockholm:</strong> Bandhagen och omgivande stadsdelar — lägg order före kl. 16:00.',
            '📍 <strong>Gratis leverans — Södertälje (postnr 151–152):</strong> Beställ för 1 000 kr eller mer och leveransen är gratis.',
            '🎉 <strong>Gratis helgleverans:</strong> Järfälla, Kungsängen & Upplands-Bro — beställ lördag–söndag, order 500 kr+.',
            '🚚 <strong>DHL — hela Sverige:</strong> Leverans till din dörr oavsett stad — pris beräknas i kassan.',
            '🏪 <strong>Hämta i butik:</strong> Gratis upphämtning på Bandhagsplan 4, Bandhagen, Stockholm.',
            '📦 <strong>Över 1 500 produkter:</strong> Basmatiris, kryddor, frysta snacks, sötsaker, drycker och mycket mer.',
        ] : [
            '🚀 <strong>Same-day delivery Stockholm:</strong> Bandhagen and surrounding districts — order before 16:00.',
            '📍 <strong>Free delivery — Södertälje (postcodes 151–152):</strong> Order 1,000 SEK or more and delivery is free.',
            '🎉 <strong>Free weekend delivery:</strong> Järfälla, Kungsängen & Upplands-Bro — Sat–Sun, orders 500 SEK+.',
            '🚚 <strong>DHL — all of Sweden:</strong> Door-to-door delivery anywhere — price calculated at checkout.',
            '🏪 <strong>Store pickup:</strong> Free collection at Bandhagsplan 4, Bandhagen, Stockholm.',
            '📦 <strong>Over 1,500 products:</strong> Basmati rice, spices, frozen snacks, sweets, drinks and much more.',
        ],

        leadQuote: isSv
            ? 'Saknar du autentiska indiska och pakistanska livsmedel men bor inte i närheten av en desi-butik? Ideal Indiska Livs i Bandhagen levererar nu till hela Sverige — och för dig som bor i rätt område finns till och med gratis leverans.'
            : 'Missing authentic Indian and Pakistani groceries but not near a desi store? Ideal Indiska Livs in Bandhagen now delivers across all of Sweden — and for those in the right area, free delivery is an option.',
        leadBody: isSv
            ? 'Den här guiden förklarar exakt hur vår leverans fungerar, vilka zoner som ingår och hur du beställer — steg för steg. Oavsett om du är i centrala Stockholm, i en förort norr om stan eller i Göteborg kan vi se till att din indiska matvaruhandel hamnar hemma hos dig.'
            : 'This guide explains exactly how our delivery works, which zones are covered and how to place an order — step by step. Whether you\'re in central Stockholm, a northern suburb or Gothenburg, we can get your Indian grocery shop to your door.',

        // Section titles
        optionsTitle: isSv ? 'Tre sätt att få din indiska mat levererad' : 'Three ways to get your Indian groceries delivered',
        stockholmTitle: isSv ? '1. Samma-dagleverans — Stockholm & Omgivningar' : '1. Same-Day Delivery — Stockholm & Surroundings',
        weekendTitle: isSv ? '2. Gratis Helgleverans — Järfälla, Kungsängen & Upplands-Bro' : '2. Free Weekend Delivery — Järfälla, Kungsängen & Upplands-Bro',
        dhlTitle: isSv ? '3. DHL Leverans — Hela Sverige' : '3. DHL Delivery — All of Sweden',
        howTitle: isSv ? 'Hur du beställer — steg för steg' : 'How to order — step by step',
        popularTitle: isSv ? 'Populärt att beställa hem' : 'Popular items to order',
        faqTitle: isSv ? 'Vanliga frågor om leverans' : 'Frequently asked questions about delivery',

        // Stockholm zone content
        stockholmBody: isSv
            ? 'Vi erbjuder lokal leverans med samma dag i Stockholm och angränsande stadsdelar. Lägg din beställning senast kl. 16:00 för leverans till kvällen samma dag.'
            : 'We offer local same-day delivery in Stockholm and surrounding districts. Place your order by 16:00 for evening delivery the same day.',
        stockholmZones: [
            'Bandhagen', 'Hagsätra', 'Rågsved', 'Högdalen', 'Farsta', 'Enskede',
            'Huddinge', 'Solna', 'Sundbyberg', 'Älvsjö', 'Hägersten', 'Skärholmen',
            'Södertälje',
        ],
        stockholmNote: isSv
            ? 'Leveransavgift tillkommer. Minimibeställning 300 kr. Är du osäker på om din adress ingår — ring oss eller skriv i WhatsApp så kontrollerar vi.'
            : 'Delivery fee applies. Minimum order 300 SEK. Unsure if your address is covered — call or WhatsApp us and we\'ll check.',

        sodertaljeTitle: isSv
            ? 'Nytt: Gratis leverans till Södertälje (postnr 151 00–152 99) vid beställning för 1 000 kr+'
            : 'New: Free Delivery to Södertälje (postcodes 151 00–152 99) on Orders 1,000 SEK+',
        sodertaljeBody: isSv
            ? 'Vi levererar nu till Södertälje och kringliggande områden. Beställ för 1 000 kr eller mer och leveransen är helt gratis. Beställningar under 1 000 kr debiteras ordinarie leveransavgift. Ange ditt postnummer (151 xx eller 152 xx) i kassan så beräknas rätt leveransalternativ automatiskt.'
            : 'We now deliver to Södertälje and surrounding areas. Order 1,000 SEK or more and delivery is completely free. Orders below 1,000 SEK are charged the standard delivery fee. Enter your postcode (151 xx or 152 xx) at checkout and the correct delivery option is calculated automatically.',

        // Weekend zone content
        weekendBody: isSv
            ? 'Bor du i Järfälla, Kungsängen eller Upplands-Bro? Vi kör helgleverans till dessa områden på lördagar och söndagar. Beställ för 500 kr eller mer och leveransen är helt gratis.'
            : 'Do you live in Järfälla, Kungsängen or Upplands-Bro? We run weekend deliveries to these areas on Saturdays and Sundays. Order for 500 SEK or more and delivery is completely free.',
        weekendZones: [
            { area: 'Järfälla', desc: isSv ? 'Inkl. Jakobsberg, Kallhäll, Skälby, Viksjö' : 'Incl. Jakobsberg, Kallhäll, Skälby, Viksjö' },
            { area: 'Kungsängen', desc: isSv ? 'Inkl. centrala Kungsängen och Brunna' : 'Incl. central Kungsängen and Brunna' },
            { area: 'Upplands-Bro', desc: isSv ? 'Inkl. Bro, Håbo-Tibble och Kungsängen' : 'Incl. Bro, Håbo-Tibble and Kungsängen' },
        ],
        weekendRules: isSv ? [
            ['📅 Dagar', 'Lördag & Söndag'],
            ['💰 Minimum', '500 kr'],
            ['🚚 Leveransavgift', 'Gratis (vid 500 kr+)'],
            ['⏰ Beställningsfrist', 'Beställ helgen, leverans samma helgdag'],
        ] : [
            ['📅 Days', 'Saturday & Sunday'],
            ['💰 Minimum', '500 SEK'],
            ['🚚 Delivery fee', 'Free (orders 500 SEK+)'],
            ['⏰ Order deadline', 'Order on the weekend, delivery same day'],
        ],
        weekendNote: isSv
            ? 'Bor du utanför dessa zoner men i norra Stockholmsregionen? Hör av dig — vi expanderar löpande och kan ibland ordna specialleveranser.'
            : 'Live outside these zones but in the northern Stockholm region? Get in touch — we\'re expanding and can sometimes arrange special deliveries.',

        // DHL content
        dhlBody: isSv
            ? 'Levererar du till en adress utanför Stockholm? Inga problem — vi skickar via DHL till hela Sverige. Fraktkostnaden beräknas automatiskt i kassan baserat på din postadress och din beställnings vikt. Leveranstid är normalt 1–3 arbetsdagar.'
            : 'Delivering to an address outside Stockholm? No problem — we ship via DHL to all of Sweden. The shipping cost is calculated automatically at checkout based on your postcode and order weight. Delivery time is normally 1–3 working days.',
        dhlHighlights: isSv ? [
            ['🌍 Täckning', 'Hela Sverige — alla postnummer'],
            ['⏱️ Leveranstid', '1–3 arbetsdagar'],
            ['📦 Spårning', 'DHL-spårningsnummer skickas via e-post'],
            ['💳 Betalning', 'Klarna, Visa, Mastercard, Swish, Apple Pay'],
            ['🇪🇺 Europa', 'Vi levererar även till EU — ingen tull inom unionen'],
        ] : [
            ['🌍 Coverage', 'All of Sweden — every postcode'],
            ['⏱️ Delivery time', '1–3 working days'],
            ['📦 Tracking', 'DHL tracking number sent by email'],
            ['💳 Payment', 'Klarna, Visa, Mastercard, Swish, Apple Pay'],
            ['🇪🇺 Europe', 'We also deliver to the EU — no customs duties within the union'],
        ],

        // How to order steps
        steps: isSv ? [
            { n: '1', title: 'Gå till vår webshop', desc: 'Besök ideallivs.com och bläddra bland över 1 500 produkter — ris, kryddor, frysta snacks, sötsaker, drycker och mycket mer.' },
            { n: '2', title: 'Lägg till produkter i varukorgen', desc: 'Välj dina varor, justera antal och klicka på "Lägg i varukorg". Du kan filtrera efter kategori, märke eller sökord.' },
            { n: '3', title: 'Välj leveransalternativ i kassan', desc: 'I kassan väljer du mellan lokal leverans (Stockholm), helgleverans (Järfälla/Kungsängen/Upplands-Bro) eller DHL. Fraktkostnaden beräknas automatiskt.' },
            { n: '4', title: 'Betala säkert', desc: 'Vi accepterar Klarna, Swish, Visa, Mastercard, Apple Pay och Google Pay. Betala tryggt med krypterad betalning.' },
            { n: '5', title: 'Ta emot din leverans', desc: 'Din beställning packas omsorgsfullt i Bandhagen och levereras. Du får en bekräftelse och, för DHL-leveranser, ett spårningsnummer.' },
        ] : [
            { n: '1', title: 'Go to our webshop', desc: 'Visit ideallivs.com and browse over 1,500 products — rice, spices, frozen snacks, sweets, drinks and much more.' },
            { n: '2', title: 'Add products to your cart', desc: 'Select your items, adjust quantities and click "Add to cart". You can filter by category, brand or keyword.' },
            { n: '3', title: 'Choose your delivery option at checkout', desc: 'At checkout choose between local delivery (Stockholm), weekend delivery (Järfälla/Kungsängen/Upplands-Bro) or DHL. Shipping is calculated automatically.' },
            { n: '4', title: 'Pay securely', desc: 'We accept Klarna, Swish, Visa, Mastercard, Apple Pay and Google Pay. Safe encrypted payment.' },
            { n: '5', title: 'Receive your delivery', desc: 'Your order is carefully packed in Bandhagen and dispatched. You\'ll receive a confirmation and, for DHL orders, a tracking number.' },
        ],

        // Popular products
        popularProducts: [
            { emoji: '🍚', name: isSv ? 'Basmatiris' : 'Basmati Rice', desc: isSv ? 'India Gate, Guard, Kaalar, Ocean Pearl — alla ledande märken' : 'India Gate, Guard, Kaalar, Ocean Pearl — all leading brands', href: '/product-category/basmati-rice' },
            { emoji: '🌶️', name: isSv ? 'Kryddor & Masala' : 'Spices & Masala', desc: isSv ? 'MDH, Shan, National — hela sortimentet' : 'MDH, Shan, National — the full range', href: '/product-category/spice-blends' },
            { emoji: '🍢', name: isSv ? 'Frysta Kebab & Snacks' : 'Frozen Kebabs & Snacks', desc: isSv ? 'Crown kebab, samosas, paratha — redo att tillaga' : 'Crown kebabs, samosas, paratha — ready to cook', href: '/product-category/frozen-snacks' },
            { emoji: '🍬', name: isSv ? 'Sötsaker & Desserter' : 'Sweets & Desserts', desc: isSv ? 'Anmol färska sötsaker, Laziza mix, Haldirams' : 'Anmol fresh sweets, Laziza mix, Haldirams', href: '/product-category/sweets' },
            { emoji: '🍓', name: isSv ? 'Drycker' : 'Drinks', desc: isSv ? 'Rooh Afza, Tang, Zingo och mer' : 'Rooh Afza, Tang, Zingo and more', href: '/product-category/drinks' },
            { emoji: '🫓', name: isSv ? 'Mjöl & Atta' : 'Flour & Atta', desc: isSv ? 'Elephant Atta, Al Baker, Pillsbury — stora förpackningar' : 'Elephant Atta, Al Baker, Pillsbury — large packs', href: '/product-category/flour-atta' },
        ],

        // FAQs
        faqs: isSv ? [
            {
                q: 'Levererar Ideal Indiska Livs till hela Stockholm?',
                a: 'Ja, vi erbjuder lokal leverans i hela Stockholm och angränsande stadsdelar. Lägg din beställning senast kl. 16:00 för leverans samma kväll. Kontakta oss om du är osäker på om din adress ingår.',
            },
            {
                q: 'Är helgleveransen till Järfälla verkligen gratis?',
                a: 'Ja — vi kör gratis helgleverans till Järfälla, Kungsängen och Upplands-Bro på lördagar och söndagar för beställningar på 500 kr eller mer. Under veckan gäller vanliga DHL-taxor för dessa områden.',
            },
            {
                q: 'Hur lång tid tar DHL-leveransen till resten av Sverige?',
                a: 'Normalt 1–3 arbetsdagar. Du får ett DHL-spårningsnummer via e-post när din beställning skickas, så du kan följa paketet i realtid.',
            },
            {
                q: 'Kan jag hämta min order i butiken i Bandhagen?',
                a: 'Absolut! Gratis upphämtning är tillgänglig på Bandhagsplan 4, 124 32 Bandhagen. Välj "Hämta i butik" i kassan så har vi din order redo.',
            },
            {
                q: 'Vad är minimibeställningen för Stockholm-leverans?',
                a: 'Minimibeställning för lokal leverans i Stockholm är 300 kr. För gratis helgleverans till Järfälla, Kungsängen och Upplands-Bro gäller 500 kr.',
            },
            {
                q: 'Levererar ni indiska livsmedel till Södertälje?',
                a: 'Ja! Vi levererar nu till Södertälje (postnummer 151 00–152 99). Beställningar på 1 000 kr eller mer berättigar till helt gratis leverans — utan extra kostnad. För beställningar under 1 000 kr tillkommer ordinarie leveransavgift. Ange ditt postnummer i kassan så beräknas rätt alternativ automatiskt.',
            },
            {
                q: 'Levererar ni indiska livsmedel till Göteborg och Malmö?',
                a: 'Ja, vi levererar till hela Sverige via DHL — inklusive Göteborg, Malmö, Uppsala, Västerås, Örebro och alla andra städer. Vi har en specifik guide för Göteborg och Malmö-leverans.',
            },
            {
                q: 'Vilka betalningsmetoder accepterar ni?',
                a: 'Vi accepterar Klarna (faktura & delbetalning), Swish, Visa, Mastercard, Apple Pay och Google Pay. Kontant betalning vid lokal leverans i Stockholm.',
            },
        ] : [
            {
                q: 'Does Ideal Indiska Livs deliver to all of Stockholm?',
                a: 'Yes, we offer local delivery across Stockholm and surrounding districts. Place your order by 16:00 for same-evening delivery. Contact us if you\'re unsure whether your address is covered.',
            },
            {
                q: 'Is the weekend delivery to Järfälla really free?',
                a: 'Yes — we run free weekend delivery to Järfälla, Kungsängen and Upplands-Bro on Saturdays and Sundays for orders of 500 SEK or more. On weekdays, standard DHL rates apply to these areas.',
            },
            {
                q: 'How long does DHL delivery take to the rest of Sweden?',
                a: 'Normally 1–3 working days. You\'ll receive a DHL tracking number by email when your order is dispatched so you can follow the parcel in real time.',
            },
            {
                q: 'Can I collect my order from the Bandhagen store?',
                a: 'Absolutely! Free collection is available at Bandhagsplan 4, 124 32 Bandhagen. Select "Store Pickup" at checkout and we\'ll have your order ready.',
            },
            {
                q: 'What is the minimum order for Stockholm delivery?',
                a: 'Minimum order for local Stockholm delivery is 300 SEK. For free weekend delivery to Järfälla, Kungsängen and Upplands-Bro, the minimum is 500 SEK.',
            },
            {
                q: 'Do you deliver Indian groceries to Södertälje?',
                a: 'Yes! We now deliver to Södertälje (postcodes 151 00–152 99). Orders of 1,000 SEK or more qualify for completely free delivery — no extra charge. For orders below 1,000 SEK, our standard delivery fee applies. Enter your postcode at checkout and the correct option is calculated automatically.',
            },
            {
                q: 'Do you deliver Indian groceries to Gothenburg and Malmö?',
                a: 'Yes, we deliver to all of Sweden via DHL — including Gothenburg, Malmö, Uppsala, Västerås, Örebro and all other cities. We have a dedicated guide for Gothenburg and Malmö delivery.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept Klarna (invoice & instalment), Swish, Visa, Mastercard, Apple Pay and Google Pay. Cash on delivery for local Stockholm orders.',
            },
        ],

        ctaTitle: isSv ? 'Redo att beställa? Börja handla nu!' : 'Ready to order? Start shopping now!',
        ctaBody: isSv
            ? 'Välj bland över 1 500 autentiska indiska och pakistanska produkter och få dem levererade direkt till din dörr.'
            : 'Choose from over 1,500 authentic Indian and Pakistani products and have them delivered right to your door.',
        ctaShop: isSv ? 'Handla Online' : 'Shop Online',
        ctaDelivery: isSv ? 'Leveransinformation' : 'Delivery Information',

        wishTitle: isSv ? 'Hej från Ideal Indiska Livs i Bandhagen!' : 'Hello from Ideal Indiska Livs in Bandhagen!',
        wishBody: isSv
            ? 'Vi är stolta över att vara Stockholms ledande indisk-pakistanska livsmedelsbutik. Vårt mål är enkelt: du ska aldrig behöva kompromissa med autenticiteten i din matlagning, oavsett var i Sverige du bor. Tveka inte att höra av dig om du har frågor om leverans till ditt område.'
            : 'We\'re proud to be Stockholm\'s leading Indian-Pakistani grocery store. Our goal is simple: you should never have to compromise on authenticity in your cooking, wherever in Sweden you live. Don\'t hesitate to reach out if you have questions about delivery to your area.',
    };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const c = getContent(locale);
    return {
        title: c.metaTitle,
        description: c.metaDescription,
        alternates: getAlternates('/blog/indisk-mat-leverans-sverige', locale),
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Indisk mat leverans Sverige' }],
        },
        keywords: locale === 'sv'
            ? ['indisk mat leverans sverige', 'indisk mat leverans stockholm', 'indian food delivery sweden', 'indian grocery delivery stockholm', 'grocery delivery stockholm', 'indisk matbutik leverans', 'helgleverans järfälla', 'indisk leverans samma dag', 'indisk leverans södertälje', 'leverans södertälje', 'gratis leverans södertälje']
            : ['indian food delivery sweden', 'indian grocery delivery stockholm', 'indian food delivery', 'grocery delivery stockholm', 'indian grocery delivery södertälje', 'södertälje grocery delivery', 'free delivery södertälje'],
    };
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function DeliveryGuidePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const c = getContent(locale);

    let recentPosts: any[] = [];
    try {
        recentPosts = await getAllPosts().catch(() => []);
    } catch { /* non-critical */ }

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
        keywords: 'indisk mat leverans sverige, indian food delivery sweden, grocery delivery stockholm, indisk leverans södertälje, södertälje grocery delivery',
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

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: c.isSv ? 'Indisk Mat Leverans — Ideal Indiska Livs' : 'Indian Grocery Delivery — Ideal Indiska Livs',
        provider: {
            '@type': 'LocalBusiness',
            name: 'Ideal Indiska Livs',
            address: { '@type': 'PostalAddress', streetAddress: 'Bandhagsplan 4', addressLocality: 'Bandhagen', postalCode: '124 32', addressCountry: 'SE' },
        },
        areaServed: [
            { '@type': 'City', name: 'Stockholm' },
            { '@type': 'City', name: 'Södertälje' },
            { '@type': 'City', name: 'Järfälla' },
            { '@type': 'City', name: 'Kungsängen' },
            { '@type': 'City', name: 'Upplands-Bro' },
            { '@type': 'Country', name: 'Sweden' },
        ],
        description: c.metaDescription,
        url: c.articleUrl,
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* ── Hero ────────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden blog-hero">
                <div className="absolute inset-0 h-full w-full">
                    <Image src={FEATURE_IMAGE} alt={c.heroTitle} fill className="object-cover" priority />
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
                        <Truck className="w-3 h-3" />
                        {c.heroBadge}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 max-w-4xl tracking-tight leading-[1.1]">
                        {c.heroTitle}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full border-2 border-white/20 shrink-0 shadow-lg bg-primary/20 flex items-center justify-center">
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

                                {/* ── Three options overview ───────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.optionsTitle}</h2>

                                <div className="not-prose grid sm:grid-cols-3 gap-4 my-8">
                                    {[
                                        {
                                            icon: <Truck className="w-6 h-6" />,
                                            badge: c.isSv ? 'Alternativ 1' : 'Option 1',
                                            title: c.isSv ? 'Samma dag' : 'Same Day',
                                            sub: c.isSv ? 'Stockholm & omgivningar' : 'Stockholm & surroundings',
                                            color: 'bg-primary/10 text-primary border-primary/20',
                                        },
                                        {
                                            icon: <Gift className="w-6 h-6" />,
                                            badge: c.isSv ? 'Alternativ 2' : 'Option 2',
                                            title: c.isSv ? 'Gratis helg' : 'Free Weekend',
                                            sub: c.isSv ? 'Järfälla · Kungsängen · Upplands-Bro' : 'Järfälla · Kungsängen · Upplands-Bro',
                                            color: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40',
                                        },
                                        {
                                            icon: <Package className="w-6 h-6" />,
                                            badge: c.isSv ? 'Alternativ 3' : 'Option 3',
                                            title: 'DHL',
                                            sub: c.isSv ? 'Hela Sverige' : 'All of Sweden',
                                            color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
                                        },
                                    ].map((opt, i) => (
                                        <div key={i} className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-2 ${opt.color}`}>
                                            {opt.icon}
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{opt.badge}</p>
                                            <p className="font-heading font-bold text-lg leading-tight">{opt.title}</p>
                                            <p className="text-xs opacity-80">{opt.sub}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Delivery Zone Map ────────────────────────────── */}
                                <div className="not-prose my-10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                                        {c.isSv ? 'Leveranskarta — Stockholmsregionen' : 'Delivery Map — Stockholm Region'}
                                    </p>
                                    <div className="rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                                        <svg
                                            viewBox="0 0 700 430"
                                            className="w-full"
                                            role="img"
                                            aria-label={c.isSv ? 'Karta över leveranszoner' : 'Delivery zone map'}
                                        >
                                            {/* Water background */}
                                            <rect width="700" height="430" fill="#dbeafe" />

                                            {/* Land mass — greater Stockholm region */}
                                            <path
                                                d="M 80 60 Q 180 20 340 30 Q 500 40 610 110 Q 670 180 660 310 Q 650 400 560 425 Q 450 445 350 435 Q 240 435 160 405 Q 90 370 70 290 Q 50 210 80 130 Z"
                                                fill="#f0f4f0"
                                                stroke="#d1d9d1"
                                                strokeWidth="1.5"
                                            />

                                            {/* Lake Mälaren — simplified */}
                                            <path
                                                d="M 200 215 Q 230 195 270 200 Q 330 205 360 215 Q 390 220 400 230 Q 395 245 370 248 Q 330 250 280 245 Q 230 240 205 232 Z"
                                                fill="#bfdbfe"
                                                stroke="#93c5fd"
                                                strokeWidth="1"
                                            />
                                            <text x="290" y="233" textAnchor="middle" fontSize="10" fill="#60a5fa" fontStyle="italic">Mälaren</text>

                                            {/* DHL — whole Sweden indicator */}
                                            <rect x="8" y="8" width="684" height="414" rx="16"
                                                fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="10,5" />

                                            {/* Stockholm same-day zone */}
                                            <ellipse cx="450" cy="305" rx="115" ry="95"
                                                fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="2.5" />

                                            {/* Weekend zone — northwest suburbs */}
                                            <ellipse cx="245" cy="205" rx="110" ry="70"
                                                fill="rgba(37,99,235,0.12)" stroke="#2563eb" strokeWidth="2"
                                                strokeDasharray="6,3" />

                                            {/* Store pin — Bandhagen */}
                                            <g transform="translate(455,325)">
                                                <circle r="13" fill="#16a34a" />
                                                <circle r="13" fill="none" stroke="white" strokeWidth="2.5" />
                                                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">★</text>
                                            </g>

                                            {/* Zone labels */}
                                            <text x="450" y="272" textAnchor="middle" fontSize="13" fontWeight="700" fill="#15803d">
                                                {c.isSv ? 'Stockholm' : 'Stockholm'}
                                            </text>
                                            <text x="450" y="288" textAnchor="middle" fontSize="10" fill="#16a34a">
                                                {c.isSv ? 'Samma dag · före kl. 16:00' : 'Same day · before 16:00'}
                                            </text>
                                            <text x="476" y="344" textAnchor="start" fontSize="11" fill="#15803d" fontWeight="600">Bandhagen</text>

                                            <text x="245" y="195" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e40af">Järfälla</text>
                                            <text x="195" y="215" textAnchor="middle" fontSize="10" fill="#1d4ed8">Kungsängen</text>
                                            <text x="245" y="230" textAnchor="middle" fontSize="10" fill="#1d4ed8">Upplands-Bro</text>
                                            <text x="245" y="245" textAnchor="middle" fontSize="9" fill="#3b82f6">
                                                {c.isSv ? '(Gratis helg · 500 kr+)' : '(Free weekend · 500 SEK+)'}
                                            </text>

                                            {/* Södertälje delivery zone */}
                                            <ellipse cx="390" cy="400" rx="60" ry="22"
                                                fill="rgba(234,88,12,0.15)" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="4,2" />
                                            <text x="390" y="397" textAnchor="middle" fontSize="11" fontWeight="700" fill="#c2410c">Södertälje</text>
                                            <text x="390" y="411" textAnchor="middle" fontSize="9" fill="#c2410c">
                                                {c.isSv ? 'Gratis vid 1 000 kr+ · 151–152' : 'Free on 1,000 SEK+ · 151–152'}
                                            </text>

                                            {/* DHL label */}
                                            <text x="22" y="30" fontSize="11" fill="#d97706" fontWeight="700">
                                                {c.isSv ? '🚚 DHL — Hela Sverige (1–3 arbetsdagar)' : '🚚 DHL — All of Sweden (1–3 working days)'}
                                            </text>
                                        </svg>

                                        {/* Legend */}
                                        <div className="px-4 py-3 border-t border-border/60 bg-card flex flex-wrap gap-4 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-green-600 shrink-0" />
                                                <span className="font-semibold text-foreground">{c.isSv ? '★ Vår butik — Bandhagen' : '★ Our store — Bandhagen'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded border-2 border-green-600 bg-green-100 dark:bg-green-900/30 shrink-0" />
                                                <span className="text-muted-foreground">{c.isSv ? 'Samma-dagleverans' : 'Same-day delivery'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded border-2 border-dashed border-blue-600 bg-blue-100 dark:bg-blue-900/30 shrink-0" />
                                                <span className="text-muted-foreground">{c.isSv ? 'Gratis helgleverans' : 'Free weekend delivery'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded border-2 border-dashed border-orange-500 bg-orange-100 dark:bg-orange-900/30 shrink-0" />
                                                <span className="text-muted-foreground">{c.isSv ? 'Södertälje — Gratis vid 1 000 kr+' : 'Södertälje — Free on 1,000 SEK+'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded border-2 border-dashed border-amber-500 shrink-0" />
                                                <span className="text-muted-foreground">{c.isSv ? 'DHL — hela Sverige' : 'DHL — all of Sweden'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Stockholm same-day ───────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-4 tracking-tight flex items-center gap-3">
                                    <Truck className="w-7 h-7 text-primary inline-block" />
                                    {c.stockholmTitle}
                                </h2>
                                <p>{c.stockholmBody}</p>

                                <div className="not-prose my-6">
                                    <p className="text-sm font-bold text-foreground mb-3">
                                        {c.isSv ? 'Stadsdelar som ingår (urval):' : 'Included districts (selection):'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {c.stockholmZones.map((zone) => (
                                            <span key={zone} className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/20">
                                                <MapPin className="w-3 h-3" /> {zone}
                                            </span>
                                        ))}
                                        <span className="inline-flex items-center text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-semibold">
                                            {c.isSv ? '+ fler områden' : '+ more areas'}
                                        </span>
                                    </div>
                                </div>

                                <div className="not-prose flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm my-4">
                                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-foreground mb-0.5">
                                            {c.isSv ? 'Beställ senast kl. 16:00 för leverans samma kväll' : 'Order by 16:00 for same-evening delivery'}
                                        </p>
                                        <p className="text-muted-foreground">{c.stockholmNote}</p>
                                    </div>
                                </div>

                                {/* ── Södertälje highlight ──────────────────────────── */}
                                <div className="not-prose flex items-start gap-3 p-5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-sm my-4">
                                    <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-foreground mb-1">{c.sodertaljeTitle}</p>
                                        <p className="text-muted-foreground">{c.sodertaljeBody}</p>
                                    </div>
                                </div>

                                {/* ── Weekend free delivery ────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-4 tracking-tight flex items-center gap-3">
                                    <Gift className="w-7 h-7 text-green-600 inline-block" />
                                    {c.weekendTitle}
                                </h2>
                                <p>{c.weekendBody}</p>

                                {/* Zone cards */}
                                <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
                                    {c.weekendZones.map((zone) => (
                                        <div key={zone.area} className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40">
                                            <p className="font-heading font-bold text-green-800 dark:text-green-300 text-lg mb-1 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> {zone.area}
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-400">{zone.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Weekend rules table */}
                                <div className="not-prose overflow-x-auto rounded-2xl border border-border/60 shadow-sm my-6">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-green-50 dark:bg-green-950/30">
                                                <th className="text-left px-4 py-3 font-bold text-green-800 dark:text-green-300">
                                                    {c.isSv ? 'Villkor' : 'Conditions'}
                                                </th>
                                                <th className="text-left px-4 py-3 font-bold text-green-800 dark:text-green-300">
                                                    {c.isSv ? 'Detalj' : 'Detail'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {c.weekendRules.map(([label, val], i) => (
                                                <tr key={i} className={`border-t border-border/40 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                                                    <td className="px-4 py-3 font-semibold text-foreground">{label}</td>
                                                    <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">{val}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="not-prose flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-sm my-4">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-green-800 dark:text-green-300">{c.weekendNote}</p>
                                </div>

                                {/* ── DHL Sweden ───────────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-4 tracking-tight flex items-center gap-3">
                                    <Package className="w-7 h-7 text-amber-600 inline-block" />
                                    {c.dhlTitle}
                                </h2>
                                <p>{c.dhlBody}</p>

                                <div className="not-prose overflow-x-auto rounded-2xl border border-border/60 shadow-sm my-6">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {c.dhlHighlights.map(([label, val], i) => (
                                                <tr key={i} className={`border-t border-border/40 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                                                    <td className="px-4 py-3 font-semibold text-foreground w-40">{label}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{val}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="not-prose my-6 p-5 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground">
                                    {c.isSv
                                        ? <>Levererar du till Danmark, Norge eller resten av Europa? Vi erbjuder DHL-frakt utan tullavgifter inom EU. Läs vår <Link href="/blog/no-customs-indian-grocery-europe" className="text-primary font-semibold underline underline-offset-2">guide om tullfri leverans i Europa</Link>.</>
                                        : <>Delivering to Denmark, Norway or the rest of Europe? We offer DHL shipping with no customs duties within the EU. Read our <Link href="/blog/no-customs-indian-grocery-europe" className="text-primary font-semibold underline underline-offset-2">guide on customs-free delivery in Europe</Link>.</>
                                    }
                                </div>

                                {/* ── How to order ─────────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.howTitle}</h2>
                                <div className="not-prose space-y-4 my-6">
                                    {c.steps.map((step) => (
                                        <div key={step.n} className="flex gap-4 p-5 rounded-2xl bg-card border border-border/60 items-start">
                                            <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm shadow-primary/30">
                                                {step.n}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground mb-1">{step.title}</p>
                                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Popular products ─────────────────────────────── */}
                                <h2 className="text-3xl mt-16 mb-6 tracking-tight">{c.popularTitle}</h2>
                                <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
                                    {c.popularProducts.map((prod) => (
                                        <Link key={prod.href} href={prod.href}
                                            className="flex gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors group items-start">
                                            <span className="text-3xl shrink-0">{prod.emoji}</span>
                                            <div>
                                                <p className="font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{prod.name}</p>
                                                <p className="text-xs text-muted-foreground">{prod.desc}</p>
                                                <p className="text-xs text-primary font-semibold mt-1.5 flex items-center gap-1">
                                                    <ArrowRight className="w-3 h-3" />
                                                    {c.isSv ? 'Se sortiment' : 'Browse range'}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* ── CTA Banner ───────────────────────────────────── */}
                                <div className="not-prose mt-12 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/20 text-center shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 relative z-10">Ideal Indiska Livs · Bandhagen</p>
                                    <h3 className="text-3xl font-heading font-bold text-foreground mb-4 relative z-10">{c.ctaTitle}</h3>
                                    <p className="text-lg mb-8 text-muted-foreground relative z-10 max-w-xl mx-auto">{c.ctaBody}</p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 rounded-full text-lg h-14 shadow-lg shadow-primary/20">
                                            <Link href="/shop"><ShoppingBag className="w-5 h-5 mr-2" />{c.ctaShop}</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="px-10 rounded-full text-lg h-14 bg-background border-primary/30 text-primary hover:bg-primary/5 transition-all">
                                            <Link href="/delivery-information"><Truck className="w-5 h-5 mr-2" />{c.ctaDelivery}</Link>
                                        </Button>
                                    </div>
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

                                {/* ── Closing ──────────────────────────────────────── */}
                                <div className="not-prose mt-16 p-8 rounded-2xl bg-primary text-white text-center shadow-xl shadow-primary/20">
                                    <p className="text-2xl font-heading font-bold mb-3">{c.wishTitle}</p>
                                    <p className="text-white/80 max-w-2xl mx-auto">{c.wishBody}</p>
                                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                                        <a href="https://api.whatsapp.com/send?phone=46000000000" target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
                                            <MessageCircle className="w-4 h-4" />
                                            {c.isSv ? 'WhatsApp oss' : 'WhatsApp us'}
                                        </a>
                                        <Link href="/contact"
                                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                            {c.isSv ? 'Kontakta oss' : 'Contact us'}
                                        </Link>
                                    </div>
                                </div>

                            </div>

                            {/* Author */}
                            <div className="mt-20 pt-12 border-t border-border/60">
                                <div className="bg-muted/40 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-start border border-border/40">
                                    <div className="w-24 h-24 rounded-full shrink-0 border-4 border-background shadow-xl bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-bold text-2xl">II</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-2xl font-heading font-bold mb-1">Ideal Indiska Editorial Team</h4>
                                            <p className="text-sm text-primary font-bold tracking-[0.15em] uppercase">
                                                {c.isSv ? 'Indo-Pakistansk Mat & Leverans' : 'Indo-Pakistani Food & Delivery'}
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed italic">
                                            {c.isSv
                                                ? '"Vi tror att autentisk sydastiatisk mat ska vara tillgänglig för alla i Sverige — oavsett var du bor."'
                                                : '"We believe authentic South Asian food should be accessible to everyone in Sweden — wherever you live."'}
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
                        </article>

                        {/* ── Sidebar ───────────────────────────────────────────── */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-10">

                                {/* Delivery options quick ref */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="text-base font-heading font-bold text-primary mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        {c.isSv ? 'Leveransöversikt' : 'Delivery Overview'}
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Stockholm */}
                                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                                            <p className="font-bold text-foreground text-sm mb-1">🚀 {c.isSv ? 'Samma dag — Stockholm' : 'Same Day — Stockholm'}</p>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Order före 16:00 · Min. 300 kr' : 'Order by 16:00 · Min. 300 SEK'}</p>
                                        </div>
                                        {/* Södertälje */}
                                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40">
                                            <p className="font-bold text-green-800 dark:text-green-300 text-sm mb-1">📍 {c.isSv ? 'Gratis — Södertälje' : 'Free — Södertälje'}</p>
                                            <p className="text-xs text-green-700 dark:text-green-400">{c.isSv ? 'Postnr 151–152 · Min. 1 000 kr · Gratis frakt' : 'Postcode 151–152 · Min. 1,000 SEK · Free shipping'}</p>
                                        </div>
                                        {/* Weekend */}
                                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40">
                                            <p className="font-bold text-green-800 dark:text-green-300 text-sm mb-1">🎉 {c.isSv ? 'Gratis helg — Järfälla m.fl.' : 'Free Weekend — Järfälla etc.'}</p>
                                            <p className="text-xs text-green-700 dark:text-green-400">{c.isSv ? 'Lör–Sön · Min. 500 kr · Gratis frakt' : 'Sat–Sun · Min. 500 SEK · Free shipping'}</p>
                                        </div>
                                        {/* DHL */}
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                                            <p className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-1">📦 DHL — {c.isSv ? 'Hela Sverige' : 'All of Sweden'}</p>
                                            <p className="text-xs text-amber-700 dark:text-amber-400">{c.isSv ? '1–3 arbetsdagar · Pris i kassan' : '1–3 working days · Price at checkout'}</p>
                                        </div>
                                        {/* Pickup */}
                                        <div className="p-3 rounded-xl bg-muted/60 border border-border">
                                            <p className="font-bold text-foreground text-sm mb-1">🏪 {c.isSv ? 'Hämta i butik — Gratis' : 'Store Pickup — Free'}</p>
                                            <p className="text-xs text-muted-foreground">Bandhagsplan 4, Bandhagen</p>
                                        </div>
                                    </div>
                                    <Button asChild className="w-full mt-5 rounded-full h-10 bg-primary hover:bg-primary/90 text-white text-sm">
                                        <Link href="/shop"><ShoppingBag className="w-4 h-4 mr-2" />{c.isSv ? 'Handla Nu' : 'Shop Now'}</Link>
                                    </Button>
                                </div>

                                {/* Map */}
                                <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm overflow-hidden">
                                    <h3 className="text-base font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {c.isSv ? 'Vår Butik — Bandhagen' : 'Our Store — Bandhagen'}
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
                                        {c.isSv ? 'Relaterade Guider' : 'Related Guides'}
                                    </h3>
                                    <div className="space-y-5">
                                        <Link href="/delivery-information" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Leveransinformation — Priser & Zoner' : 'Delivery Information — Prices & Zones'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Officiell leveranssida' : 'Official delivery page'}</p>
                                        </Link>
                                        <Link href="/delivery-goteborg-malmo" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Leverans Göteborg & Malmö' : 'Delivery to Gothenburg & Malmö'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'Södra Sverige-guide' : 'Southern Sweden guide'}</p>
                                        </Link>
                                        <Link href="/blog/no-customs-indian-grocery-europe" className="block group">
                                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                                                {c.isSv ? 'Tullfri leverans till Europa' : 'Customs-Free Delivery to Europe'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">{c.isSv ? 'EU-leveransguide' : 'EU delivery guide'}</p>
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

            {/* ── Schema ──────────────────────────────────────────────────────── */}
            <SchemaScript id="delivery-guide-article" schema={articleSchema} />
            <SchemaScript id="delivery-guide-faq" schema={faqSchema} />
            <SchemaScript id="delivery-guide-service" schema={serviceSchema} />
        </div>
    );
}
