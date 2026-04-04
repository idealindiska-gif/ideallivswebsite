import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Truck, Package, CheckCircle2, ArrowRight, ChevronRight, ShoppingBag, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';
import { articleSchema } from '@/lib/schema/article';
import { getAlternates } from '@/lib/seo/metadata';

export const revalidate = 86400;

const FEATURE_IMAGE = 'https://crm.ideallivs.com/wp-content/uploads/2025/10/ideal-indiska-delivers-in-goteborg.jpg';
const PUBLISH_DATE = '2026-04-05';

// ─── Bilingual content ────────────────────────────────────────────────────────

function getContent(locale: string) {
    const isDa = locale === 'da';
    const isSv = locale === 'sv';
    const localePrefix = locale !== 'en' ? `/${locale}` : '';
    const articleUrl = `${siteConfig.site_domain}${localePrefix}/blog/indisk-mad-online-danmark`;

    // Danish and Swedish content — English fallback for no locale
    const t = {
        metaTitle: isDa
            ? 'Indiske Dagligvarer Online til Danmark | Bestil fra Sverige med DHL'
            : isSv
                ? 'Indisk Mat Online till Danmark | Beställ från Sverige med DHL'
                : 'Indian Groceries Online to Denmark | Order from Sweden with DHL',
        metaDescription: isDa
            ? 'Bestil autentiske indiske og pakistanske dagligvarer online og få leveret til Danmark med DHL. Ingen told ved EU-forsendelse. Over 1.500 produkter fra Ideal Indiska Livs i Stockholm.'
            : isSv
                ? 'Beställ autentiska indiska och pakistanska livsmedel online och få leverans till Danmark via DHL. Ingen tull inom EU. Över 1 500 produkter från Ideal Indiska Livs i Stockholm.'
                : 'Order authentic Indian and Pakistani groceries online and get delivery to Denmark via DHL. No customs within the EU. Over 1,500 products from Ideal Indiska Livs in Stockholm.',

        heroBadge: isDa ? 'Levering til Danmark · DHL · Ingen told' : isSv ? 'Leverans till Danmark · DHL · Ingen tull' : 'Delivery to Denmark · DHL · No customs',
        heroTitle: isDa
            ? 'Indiske Dagligvarer til Danmark: Bestil Online fra Stockholm'
            : isSv
                ? 'Indisk Mat till Danmark: Beställ Online från Stockholm'
                : 'Indian Groceries to Denmark: Order Online from Stockholm',
        heroSubtitle: isDa
            ? 'Autentiske indiske og pakistanske varer leveret direkte til din dør i Danmark via DHL — uden told og med over 1.500 produkter at vælge imellem.'
            : isSv
                ? 'Autentiska indiska och pakistanska varor levererade direkt till din dörr i Danmark via DHL — utan tull och med över 1 500 produkter att välja bland.'
                : 'Authentic Indian and Pakistani products delivered straight to your door in Denmark via DHL — no customs and over 1,500 products to choose from.',

        // TL;DR
        tldrLabel: isDa
            ? 'Hurtige Fakta — Indisk Mad Online til Danmark'
            : isSv
                ? 'Snabbfakta — Indisk Mat Online till Danmark'
                : 'Quick Facts — Indian Groceries Online to Denmark',
        tldrItems: isDa ? [
            '🇩🇰 <strong>Levering til Danmark:</strong> Vi sender med DHL til hele Danmark — typisk 2–4 hverdage fra Stockholm.',
            '✅ <strong>Ingen told:</strong> Vi sender fra Sverige (EU), så du betaler ingen told eller importafgift på dine varer.',
            '📦 <strong>Ingen minimumsordre:</strong> Bestil for præcis det beløb, du ønsker — ingen minimumsordre for DHL-forsendelse.',
            '🛒 <strong>1.500+ produkter:</strong> Basmatiris, krydderier, mel, dåsevarer, frosne snacks og meget mere fra mærker som India Gate, Shan, Haldiram\'s og MDH.',
            '💳 <strong>Betal med kort, Apple Pay eller Klarna</strong> — sikker betaling online på ideallivs.com.',
        ] : isSv ? [
            '🇩🇰 <strong>Leverans till Danmark:</strong> Vi skickar med DHL till hela Danmark — normalt 2–4 arbetsdagar från Stockholm.',
            '✅ <strong>Ingen tull:</strong> Vi skickar från Sverige (EU), så du betalar ingen tull eller importavgift.',
            '📦 <strong>Ingen minimibeställning:</strong> Beställ för exakt det belopp du vill — ingen minimibeställning för DHL-leverans.',
            '🛒 <strong>1 500+ produkter:</strong> Basmatiris, kryddor, mjöl, konserver, frysta snacks och mer från märken som India Gate, Shan, Haldiram\'s och MDH.',
            '💳 <strong>Betala med kort, Apple Pay eller Klarna</strong> — säker betalning online på ideallivs.com.',
        ] : [
            '🇩🇰 <strong>Delivery to Denmark:</strong> We ship via DHL to all of Denmark — typically 2–4 business days from Stockholm.',
            '✅ <strong>No customs:</strong> We ship from Sweden (EU), so you pay zero customs or import duties on your order.',
            '📦 <strong>No minimum order:</strong> Order for exactly how much you want — no minimum for DHL shipping.',
            '🛒 <strong>1,500+ products:</strong> Basmati rice, spices, flour, canned goods, frozen snacks and more from brands like India Gate, Shan, Haldiram\'s and MDH.',
            '💳 <strong>Pay by card, Apple Pay or Klarna</strong> — secure online payment at ideallivs.com.',
        ],

        // Why us
        whyTitle: isDa
            ? 'Hvorfor bestille indisk mad fra Ideal Indiska Livs?'
            : isSv
                ? 'Varför beställa indisk mat från Ideal Indiska Livs?'
                : 'Why order Indian groceries from Ideal Indiska Livs?',
        whyBody: isDa
            ? 'I Danmark kan det være svært at finde et bredt udvalg af autentiske indiske og pakistanske varer. Specialbutikker er sjældne, og supermarkeder bærer kun et begrænset udvalg. Ideal Indiska Livs i Bandhagen, Stockholm, har siden 2020 leveret over 1.500 sydasiatiske produkter til kunder i hele Norden og Europa — nu også til dig i Danmark.'
            : isSv
                ? 'I Danmark kan det vara svårt att hitta ett brett utbud av autentiska indiska och pakistanska varor. Specialbutiker är sällsynta och snabbköpen har bara ett begränsat sortiment. Ideal Indiska Livs i Bandhagen, Stockholm, har sedan 2020 levererat över 1 500 sydasiatiska produkter till kunder i hela Norden och Europa — nu även till dig i Danmark.'
                : 'In Denmark, finding a wide range of authentic Indian and Pakistani groceries can be difficult. Speciality shops are rare and supermarkets carry only a limited selection. Ideal Indiska Livs in Bandhagen, Stockholm, has been delivering over 1,500 South Asian products to customers across Scandinavia and Europe since 2020 — now including you in Denmark.',

        reasons: isDa ? [
            { icon: '🇪🇺', title: 'Ingen told fra EU', desc: 'Vi sender fra Sverige, der er EU-land. Det betyder ingen told, ingen importafgift og ingen ubehagelige overraskelser ved leveringen.' },
            { icon: '📦', title: 'DHL levering 2–4 hverdage', desc: 'Din ordre pakkes og sendes fra Stockholm med DHL Express eller DHL Parcel til hele Danmark — inkl. Sjælland, Jylland og Fyn.' },
            { icon: '🛒', title: '1.500+ produkter', desc: 'Basmatiris, krydderier, mel, dåsevarer, frosne snacks, saucer, drikkevarer og meget mere — alt på ét sted.' },
            { icon: '⭐', title: '4,7/5 på Google', desc: 'Tusindevis af tilfredse kunder i hele Norden og Europa stoler på os til deres sydasiatiske dagligvarer.' },
        ] : isSv ? [
            { icon: '🇪🇺', title: 'Ingen tull från EU', desc: 'Vi skickar från Sverige, ett EU-land. Det innebär ingen tull, ingen importavgift och inga obehagliga överraskningar vid leveransen.' },
            { icon: '📦', title: 'DHL-leverans 2–4 arbetsdagar', desc: 'Din beställning packas och skickas från Stockholm med DHL till hela Danmark — inklusive Sjælland, Jylland och Fyn.' },
            { icon: '🛒', title: '1 500+ produkter', desc: 'Basmatiris, kryddor, mjöl, konserver, frysta snacks, såser, drycker och mer — allt på ett ställe.' },
            { icon: '⭐', title: '4,7/5 på Google', desc: 'Tusentals nöjda kunder i hela Norden och Europa litar på oss för sina sydasiatiska livsmedel.' },
        ] : [
            { icon: '🇪🇺', title: 'No customs from EU', desc: 'We ship from Sweden, an EU member state. That means zero customs, zero import duties, and no unpleasant surprises at delivery.' },
            { icon: '📦', title: 'DHL delivery in 2–4 business days', desc: 'Your order is packed and shipped from Stockholm with DHL to all of Denmark — including Zealand, Jutland, and Funen.' },
            { icon: '🛒', title: '1,500+ products', desc: 'Basmati rice, spices, flour, canned goods, frozen snacks, sauces, drinks and more — all in one place.' },
            { icon: '⭐', title: '4.7/5 on Google', desc: 'Thousands of satisfied customers across Scandinavia and Europe trust us for their South Asian groceries.' },
        ],

        // Popular categories
        categoriesTitle: isDa
            ? 'Populære kategorier til Danmark'
            : isSv
                ? 'Populära kategorier till Danmark'
                : 'Popular categories for Denmark',
        categories: isDa ? [
            { name: 'Basmatiris', desc: 'India Gate, Guard, Kaalar — fra 1 kg til 10 kg poser', link: '/product-category/rice-grains', emoji: '🍚' },
            { name: 'Krydderier & Masala', desc: 'MDH, Shan, National Foods — komplette krydderiblande', link: '/product-category/spices-masalas', emoji: '🌶️' },
            { name: 'Mel & Gryn', desc: 'Atta, besan, suji, semolina — alt til roti og bagning', link: '/product-category/flour', emoji: '🌾' },
            { name: 'Snacks & Frosne retter', desc: 'Samosas, kebab, paratha, chips og namkeen — klar på minutter', link: '/product-category/snacks', emoji: '🥟' },
            { name: 'Linser & Bælgfrugter', desc: 'Chana dal, urad dal, moong dal, toor dal — basen i det indiske køkken', link: '/product-category/lentils-beans-dals', emoji: '🫘' },
            { name: 'Pickles & Chutneys', desc: 'Mango pickle, lime pickle, tamarind chutney og meer', link: '/product-category/pickles-chutneys-pastes', emoji: '🥫' },
        ] : isSv ? [
            { name: 'Basmatiris', desc: 'India Gate, Guard, Kaalar — från 1 kg till 10 kg', link: '/product-category/rice-grains', emoji: '🍚' },
            { name: 'Kryddor & Masala', desc: 'MDH, Shan, National Foods — kompletta kryddblandningar', link: '/product-category/spices-masalas', emoji: '🌶️' },
            { name: 'Mjöl & Gryn', desc: 'Atta, besan, suji, semolina — allt till roti och bakning', link: '/product-category/flour', emoji: '🌾' },
            { name: 'Snacks & Frysta rätter', desc: 'Samosas, kebab, paratha, chips och namkeen — klara på minuter', link: '/product-category/snacks', emoji: '🥟' },
            { name: 'Linser & Baljväxter', desc: 'Chana dal, urad dal, moong dal, toor dal — basen i det indiska köket', link: '/product-category/lentils-beans-dals', emoji: '🫘' },
            { name: 'Pickles & Chutneys', desc: 'Mango pickle, lime pickle, tamarind chutney och mer', link: '/product-category/pickles-chutneys-pastes', emoji: '🥫' },
        ] : [
            { name: 'Basmati Rice', desc: 'India Gate, Guard, Kaalar — from 1 kg to 10 kg bags', link: '/product-category/rice-grains', emoji: '🍚' },
            { name: 'Spices & Masala', desc: 'MDH, Shan, National Foods — complete spice blends', link: '/product-category/spices-masalas', emoji: '🌶️' },
            { name: 'Flour & Grains', desc: 'Atta, besan, suji, semolina — everything for roti and baking', link: '/product-category/flour', emoji: '🌾' },
            { name: 'Snacks & Frozen', desc: 'Samosas, kebab, paratha, chips and namkeen — ready in minutes', link: '/product-category/snacks', emoji: '🥟' },
            { name: 'Lentils & Dals', desc: 'Chana dal, urad dal, moong dal, toor dal — the base of Indian cooking', link: '/product-category/lentils-beans-dals', emoji: '🫘' },
            { name: 'Pickles & Chutneys', desc: 'Mango pickle, lime pickle, tamarind chutney and more', link: '/product-category/pickles-chutneys-pastes', emoji: '🥫' },
        ],

        // How to order
        howTitle: isDa
            ? 'Sådan bestiller du: Trin for trin'
            : isSv
                ? 'Så här beställer du: Steg för steg'
                : 'How to order: Step by step',
        steps: isDa ? [
            { n: '1', title: 'Gennemse sortimentet', desc: 'Gå til ideallivs.com/shop og gennemse over 1.500 produkter. Filtrer efter kategori, mærke eller pris.' },
            { n: '2', title: 'Tilføj til kurv', desc: 'Tilføj dine yndlingsprodukter til kurven. Ingen minimumsordre — bestil for præcis det beløb, du ønsker.' },
            { n: '3', title: 'Vælg DHL-levering', desc: 'Vælg DHL-forsendelse ved checkout. Fragtprisen beregnes automatisk baseret på din adresse og ordrens vægt.' },
            { n: '4', title: 'Betal sikkert', desc: 'Betal med kort, Apple Pay, Google Pay eller Klarna. Din betaling er krypteret og sikker.' },
            { n: '5', title: 'Modtag din ordre', desc: 'Din ordre pakkes i Stockholm og sendes med DHL. Forventet leveringstid: 2–4 hverdage til Danmark.' },
        ] : isSv ? [
            { n: '1', title: 'Bläddra i sortimentet', desc: 'Gå till ideallivs.com/shop och bläddra bland över 1 500 produkter. Filtrera efter kategori, märke eller pris.' },
            { n: '2', title: 'Lägg i korgen', desc: 'Lägg dina favoritprodukter i korgen. Ingen minimibeställning — beställ för exakt det belopp du vill.' },
            { n: '3', title: 'Välj DHL-leverans', desc: 'Välj DHL-frakt i kassan. Fraktpriset beräknas automatiskt baserat på din adress och orderns vikt.' },
            { n: '4', title: 'Betala säkert', desc: 'Betala med kort, Apple Pay, Google Pay eller Klarna. Din betalning är krypterad och säker.' },
            { n: '5', title: 'Ta emot din order', desc: 'Din order packas i Stockholm och skickas med DHL. Förväntad leveranstid: 2–4 arbetsdagar till Danmark.' },
        ] : [
            { n: '1', title: 'Browse the range', desc: 'Visit ideallivs.com/shop and browse over 1,500 products. Filter by category, brand, or price.' },
            { n: '2', title: 'Add to cart', desc: 'Add your favourite products to the cart. No minimum order — order for exactly how much you want.' },
            { n: '3', title: 'Choose DHL delivery', desc: 'Select DHL shipping at checkout. Shipping is calculated automatically based on your address and order weight.' },
            { n: '4', title: 'Pay securely', desc: 'Pay by card, Apple Pay, Google Pay, or Klarna. Your payment is encrypted and secure.' },
            { n: '5', title: 'Receive your order', desc: 'Your order is packed in Stockholm and sent with DHL. Expected delivery time: 2–4 business days to Denmark.' },
        ],

        // FAQ
        faqTitle: isDa
            ? 'Ofte Stillede Spørgsmål om Levering til Danmark'
            : isSv
                ? 'Vanliga frågor om leverans till Danmark'
                : 'Frequently Asked Questions about Delivery to Denmark',
        faqs: isDa ? [
            {
                q: 'Sender I til alle adresser i Danmark?',
                a: 'Ja, vi sender med DHL til alle adresser i Danmark — inkl. Sjælland, Jylland, Fyn og øerne.',
            },
            {
                q: 'Betaler jeg told eller importafgift?',
                a: 'Nej. Da vi sender fra Sverige, der er et EU-land, gælder de frie varebevægelser inden for EU. Du betaler ingen told, moms eller importafgift ud over det, der allerede er inkluderet i prisen.',
            },
            {
                q: 'Hvad koster forsendelsen til Danmark?',
                a: 'Fragtprisen beregnes automatisk ved checkout baseret på ordrens vægt og din leveringsadresse. Du kan se den nøjagtige pris, inden du afslutter købet.',
            },
            {
                q: 'Hvor lang tid tager leveringen til Danmark?',
                a: 'Forventet leveringstid med DHL er 2–4 hverdage fra Stockholm til din adresse i Danmark.',
            },
            {
                q: 'Kan jeg bestille frosne produkter til Danmark?',
                a: 'I øjeblikket sender vi kun tørre og ikke-kølede produkter. Frosne varer kan ikke sendes med DHL til Danmark.',
            },
            {
                q: 'Hvad sker der, hvis min pakke mangler en vare?',
                a: 'Kontakt os på hello@ideallivs.com, og vi løser problemet hurtigt. Vi stræber efter fuld tilfredshed ved hver ordre.',
            },
        ] : isSv ? [
            {
                q: 'Levererar ni till alla adresser i Danmark?',
                a: 'Ja, vi levererar med DHL till alla adresser i Danmark — inklusive Sjælland, Jylland, Fyn och öarna.',
            },
            {
                q: 'Betalar jag tull eller importavgift?',
                a: 'Nej. Eftersom vi skickar från Sverige, ett EU-land, gäller fri rörlighet för varor inom EU. Du betalar ingen tull, moms eller importavgift utöver det som redan ingår i priset.',
            },
            {
                q: 'Vad kostar frakten till Danmark?',
                a: 'Fraktpriset beräknas automatiskt i kassan baserat på orderns vikt och din leveransadress. Du kan se det exakta priset innan du slutför köpet.',
            },
            {
                q: 'Hur lång tid tar leveransen till Danmark?',
                a: 'Förväntad leveranstid med DHL är 2–4 arbetsdagar från Stockholm till din adress i Danmark.',
            },
            {
                q: 'Kan jag beställa frysta produkter till Danmark?',
                a: 'För tillfället skickar vi endast torra och icke-kylda produkter. Frysta varor kan inte skickas med DHL till Danmark.',
            },
            {
                q: 'Vad händer om min order saknar en vara?',
                a: 'Kontakta oss på hello@ideallivs.com så löser vi problemet snabbt. Vi strävar efter full tillfredsställelse vid varje order.',
            },
        ] : [
            {
                q: 'Do you deliver to all addresses in Denmark?',
                a: 'Yes, we ship via DHL to all addresses in Denmark — including Zealand, Jutland, Funen, and the islands.',
            },
            {
                q: 'Do I pay customs or import duties?',
                a: 'No. Since we ship from Sweden, an EU member state, the free movement of goods within the EU applies. You pay zero customs, no VAT surcharge, and no import duties beyond what is already included in the product price.',
            },
            {
                q: 'How much does shipping to Denmark cost?',
                a: 'Shipping is calculated automatically at checkout based on your order weight and delivery address. You can see the exact price before completing your purchase.',
            },
            {
                q: 'How long does delivery to Denmark take?',
                a: 'Expected delivery time with DHL is 2–4 business days from Stockholm to your address in Denmark.',
            },
            {
                q: 'Can I order frozen products to Denmark?',
                a: 'Currently we only ship dry and non-refrigerated products. Frozen items cannot be shipped via DHL to Denmark.',
            },
            {
                q: 'What if my order is missing an item?',
                a: 'Contact us at hello@ideallivs.com and we will resolve the issue promptly. We strive for full satisfaction with every order.',
            },
        ],

        ctaTitle: isDa ? 'Klar til at bestille?' : isSv ? 'Redo att beställa?' : 'Ready to order?',
        ctaBody: isDa
            ? 'Gennemse vores komplette sortiment og oplev autentiske indiske og pakistanske smagsnuancer leveret direkte til din dør i Danmark.'
            : isSv
                ? 'Bläddra bland vårt kompletta sortiment och upplev autentiska indiska och pakistanska smaker levererade direkt till din dörr i Danmark.'
                : 'Browse our complete range and experience authentic Indian and Pakistani flavours delivered straight to your door in Denmark.',
        ctaButton: isDa ? 'Gå til butikken' : isSv ? 'Gå till butiken' : 'Go to the shop',
        deliveryPageLabel: isDa ? 'Se leveringsinfo for Danmark' : isSv ? 'Se leveransinformation för Danmark' : 'See Denmark delivery info',
    };

    return t;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const c = getContent(locale);
    const ogLocale = locale === 'da' ? 'da_DK' : locale === 'sv' ? 'sv_SE' : locale === 'no' ? 'nb_NO' : 'en_SE';

    return {
        title: c.metaTitle,
        description: c.metaDescription,
        alternates: getAlternates('/blog/indisk-mad-online-danmark', locale),
        openGraph: {
            title: c.metaTitle,
            description: c.metaDescription,
            images: [{ url: FEATURE_IMAGE, width: 1200, height: 630, alt: 'Indiske dagligvarer online til Danmark – Ideal Indiska Livs' }],
            type: 'article',
            locale: ogLocale,
        },
        keywords: locale === 'da'
            ? ['indiske dagligvarer online danmark', 'bestil indisk mad danmark', 'indiske krydderier levering danmark', 'online indisk supermarked danmark', 'sydasiatisk mad bestil online']
            : ['indian groceries online denmark', 'order indian food denmark', 'indian spices delivery denmark', 'south asian groceries denmark online'],
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function IndiskMadDanmarkPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const c = getContent(locale);

    const schema = articleSchema({
        title: c.metaTitle,
        description: c.metaDescription,
        content: c.metaDescription,
        url: `${siteConfig.site_domain}${locale !== 'en' ? `/${locale}` : ''}/blog/indisk-mad-online-danmark`,
        authorName: 'Ideal Chef',
        publisherName: 'Ideal Indiska LIVS',
        publisherLogo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        datePublished: `${PUBLISH_DATE}T08:00:00+02:00`,
        dateModified: `${PUBLISH_DATE}T08:00:00+02:00`,
        category: 'Delivery',
        tags: ['Indian groceries Denmark', 'Indiske dagligvarer Danmark', 'DHL levering', 'Online bestilling', 'Ingen told'],
        featuredImage: FEATURE_IMAGE,
        language: locale === 'da' ? 'da-DK' : locale === 'sv' ? 'sv-SE' : 'en-SE',
    });

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    return (
        <div className="min-h-screen bg-background">

            {/* ─── Hero ───────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80">
                <div className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl py-16 md:py-24 text-white">
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-white/60 flex-wrap">
                            <li><Link href="/" className="hover:text-white transition-colors">{locale === 'da' ? 'Hjem' : locale === 'sv' ? 'Hem' : 'Home'}</Link></li>
                            <li><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><ChevronRight className="h-3.5 w-3.5" /></li>
                            <li className="text-white/80">{locale === 'da' ? 'Danmark' : locale === 'sv' ? 'Danmark' : 'Denmark'}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div>
                            <span className="inline-block mb-5 bg-white/20 text-white border border-white/30 text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
                                🇩🇰 {c.heroBadge}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight text-white">
                                {c.heroTitle}
                            </h1>
                            <p className="text-white/80 text-lg mb-8 leading-relaxed">{c.heroSubtitle}</p>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-8">
                                    <Link href="/shop">
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        {c.ctaButton}
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8">
                                    <Link href="/denmark-delivery">
                                        <Truck className="h-4 w-4 mr-2" />
                                        {c.deliveryPageLabel}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-3">
                            {[
                                { icon: '🇪🇺', label: locale === 'da' ? 'Ingen told' : locale === 'sv' ? 'Ingen tull' : 'No customs' },
                                { icon: '📦', label: locale === 'da' ? '2–4 hverdage' : locale === 'sv' ? '2–4 arbetsdagar' : '2–4 business days' },
                                { icon: '🛒', label: locale === 'da' ? '1.500+ produkter' : locale === 'sv' ? '1 500+ produkter' : '1,500+ products' },
                                { icon: '⭐', label: locale === 'da' ? '4,7/5 på Google' : '4.7/5 on Google' },
                            ].map(b => (
                                <div key={b.label} className="bg-white/10 rounded-2xl p-5 border border-white/20 text-center">
                                    <p className="text-3xl mb-2">{b.icon}</p>
                                    <p className="text-sm font-bold text-white">{b.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Main Content ────────────────────────────────────────────────── */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl">
                    <div className="grid lg:grid-cols-12 gap-12">

                        <article className="lg:col-span-8 space-y-12">

                            {/* TL;DR */}
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{c.tldrLabel}</p>
                                <ul className="space-y-2">
                                    {c.tldrItems.map((item, i) => (
                                        <li key={i} className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            </div>

                            {/* Why us */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{c.whyTitle}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">{c.whyBody}</p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {c.reasons.map(r => (
                                        <div key={r.title} className="p-5 rounded-2xl border bg-card">
                                            <p className="text-2xl mb-2">{r.icon}</p>
                                            <p className="font-bold text-foreground text-sm mb-1">{r.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Popular categories */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{c.categoriesTitle}</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {c.categories.map(cat => (
                                        <Link key={cat.name} href={cat.link} className="flex items-start gap-4 p-5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all group">
                                            <span className="text-2xl shrink-0">{cat.emoji}</span>
                                            <div>
                                                <p className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{cat.name}</p>
                                                <p className="text-xs text-muted-foreground">{cat.desc}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto shrink-0 self-center transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* How to order */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{c.howTitle}</h2>
                                <div className="space-y-4">
                                    {c.steps.map(s => (
                                        <div key={s.n} className="flex gap-5 items-start p-5 rounded-2xl border bg-card">
                                            <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                                                {s.n}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm mb-1">{s.title}</p>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                                            </div>
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
                                {/* CTA */}
                                <div className="rounded-2xl border bg-card p-6">
                                    <h3 className="font-heading font-bold text-lg text-foreground mb-3">{c.ctaTitle}</h3>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{c.ctaBody}</p>
                                    <Button asChild className="w-full rounded-full font-bold mb-3">
                                        <Link href="/shop">
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            {c.ctaButton} <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full rounded-full">
                                        <Link href="/denmark-delivery">
                                            <Truck className="h-4 w-4 mr-2" />
                                            {c.deliveryPageLabel}
                                        </Link>
                                    </Button>
                                </div>

                                {/* Delivery highlights */}
                                <div className="rounded-2xl border bg-primary/5 p-6 space-y-3">
                                    <p className="font-bold text-sm text-foreground">🇩🇰 {locale === 'da' ? 'Levering til Danmark' : locale === 'sv' ? 'Leverans till Danmark' : 'Delivery to Denmark'}</p>
                                    {[
                                        { icon: <Truck className="h-4 w-4" />, label: 'DHL' },
                                        { icon: <Clock className="h-4 w-4" />, label: locale === 'da' ? '2–4 hverdage' : '2–4 business days' },
                                        { icon: <Package className="h-4 w-4" />, label: locale === 'da' ? 'Ingen minimumsordre' : 'No minimum order' },
                                        { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, label: locale === 'da' ? 'Ingen told (EU)' : 'No customs (EU)' },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="text-primary">{row.icon}</span> {row.label}
                                        </div>
                                    ))}
                                </div>

                                {/* Related */}
                                <div className="rounded-2xl border bg-card p-6">
                                    <p className="font-bold text-sm text-foreground mb-4">{locale === 'da' ? 'Relaterede artikler' : locale === 'sv' ? 'Relaterade artiklar' : 'Related articles'}</p>
                                    <div className="space-y-3">
                                        <Link href="/blog/no-customs-indian-grocery-europe" className="flex items-center gap-3 group">
                                            <Star className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {locale === 'da' ? 'Ingen told på indiske varer i Europa' : 'No customs on Indian groceries in Europe'}
                                            </span>
                                        </Link>
                                        <Link href="/denmark-delivery" className="flex items-center gap-3 group">
                                            <Star className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {locale === 'da' ? 'Leveringsinformation Danmark' : 'Denmark delivery information'}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <SchemaScript id="denmark-article-schema" schema={schema} />
            <SchemaScript id="denmark-faq-schema" schema={faqSchema} />
        </div>
    );
}
