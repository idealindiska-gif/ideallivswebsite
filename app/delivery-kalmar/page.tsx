import { Metadata } from "next";
import { brandProfile } from "@/config/brand-profile";
import {
    Truck,
    MapPin,
    Package,
    Clock,
    Info,
    ExternalLink,
    ShieldCheck,
    Star,
    CheckCircle2,
    Navigation,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { SchemaScript } from "@/lib/schema/schema-script";
import { kalmarDeliveryServiceSchema } from "@/lib/schema";
import { GoogleMapCompact } from "@/components/shared/google-map";

export const metadata: Metadata = {
    title: "Indian & Pakistani Grocery Delivery Kalmar | Ideal Indiska Livs",
    description:
        "Authentic Indian & Pakistani groceries delivered to Kalmar, Nybro, Torsås and all of Kalmar County via DHL. Home delivery & DHL Service Point pickup available. Order online from Ideal Indiska Livs Stockholm.",
    alternates: {
        canonical: "/delivery-kalmar",
    },
    keywords: [
        "Indian grocery delivery Kalmar",
        "Pakistani grocery Kalmar",
        "Indian spices Kalmar Sweden",
        "halal food delivery Kalmar",
        "basmati rice Kalmar",
        "DHL delivery Kalmar",
        "Ideal Indiska Kalmar",
        "Asian grocery delivery Kalmar",
        "South Indian food Kalmar",
    ],
    openGraph: {
        title: "Indian & Pakistani Grocery Delivery Kalmar | Ideal Indiska Livs",
        description:
            "Authentic Indian & Pakistani groceries delivered to Kalmar via DHL. Home delivery or pick up at the nearest DHL Service Point.",
        type: "website",
        url: "https://www.ideallivs.com/delivery-kalmar",
    },
};

const DHL_OPTIONS = [
    {
        icon: Truck,
        title: "DHL Home Delivery",
        description:
            "Your groceries delivered straight to your front door. DHL Paket delivers throughout Kalmar city and all postcodes in Kalmar County (390–398xx).",
        detail: "2–4 business days",
        highlight: true,
    },
    {
        icon: MapPin,
        title: "DHL Service Point Pickup",
        description:
            "Choose a convenient DHL Service Point near you and collect your parcel at your own pace. Multiple locations in Kalmar city including ICA Supermarket Berga Centrum, Mekonomen Kalmar, and Direkten Tobaksboden.",
        detail: "2–4 business days + self-collect",
        highlight: false,
    },
    {
        icon: Navigation,
        title: "DHL Paket Direkt",
        description:
            "Extra flexibility — the driver will try to meet you at your preferred time. Great for busy families and students at Linnaeus University.",
        detail: "Flexible time window",
        highlight: false,
    },
];

const COVERAGE_AREAS = [
    {
        name: "Kalmar City",
        postcodes: "392 xx – 394 xx",
        places: ["Centrum", "Norrliden", "Berga", "Oxhagen", "Funkabo", "Djurängen"],
    },
    {
        name: "Greater Kalmar",
        postcodes: "385 xx – 388 xx",
        places: ["Nybro", "Emmaboda", "Torsås", "Mönsterås"],
    },
    {
        name: "Kalmar Coast",
        postcodes: "387 xx – 389 xx",
        places: ["Borgholm (Öland)", "Mörbylånga", "Färjestaden"],
    },
];

const POPULAR_PRODUCTS = [
    "Premium Basmati rice (India Gate, Lal Qilla, Falak)",
    "Shan & National masala mixes",
    "Halal chicken & meat marinades",
    "Fresh atta (wheat flour) — 5 kg & 10 kg bags",
    "South Indian specialities — dosa mix, sambhar powder, curry leaves",
    "Pakistani snacks — Nimco, Chanachur, Digestive biscuits",
    "Authentic Indian sweets & mithai",
    "Cooking oils — mustard, coconut, sunflower (large sizes)",
];

const FAQS = [
    {
        q: "How do I order for delivery to Kalmar?",
        a: "Simply shop on our website, enter your Kalmar postcode at checkout, and choose DHL as your shipping method. You can pick Home Delivery or a DHL Service Point — whichever is most convenient.",
    },
    {
        q: "How long does delivery to Kalmar take?",
        a: "DHL typically delivers to Kalmar within 2–4 business days from Stockholm. Orders placed before 12:00 (noon) are usually dispatched the same day.",
    },
    {
        q: "Are there any restricted products for Kalmar delivery?",
        a: "Frozen food and fresh produce are only available for delivery within Stockholm. All dry goods, spices, rice, snacks, and packaged items ship to Kalmar without restriction.",
    },
    {
        q: "Can I track my parcel?",
        a: "Yes. You will receive a DHL tracking number by email as soon as your order is dispatched. Track at dhl.se.",
    },
    {
        q: "Is there a minimum order?",
        a: "No minimum order. Shop as much or as little as you like — shipping is calculated by weight at checkout.",
    },
];

export default function KalmarDeliveryPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/8 via-background to-background border-b">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl">
                        {/* Breadcrumb */}
                        <nav
                            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5"
                            aria-label="Breadcrumb"
                        >
                            <Link href="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link
                                href="/delivery-information"
                                className="hover:text-primary transition-colors"
                            >
                                Delivery
                            </Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">Kalmar</span>
                        </nav>

                        <h1
                            style={{
                                fontSize: "31.25px",
                                fontWeight: 700,
                                lineHeight: 1.47,
                                letterSpacing: "0.02em",
                            }}
                            className="mb-4"
                        >
                            Indian &amp; Pakistani Grocery Delivery to Kalmar
                        </h1>
                        <p
                            className="text-muted-foreground max-w-2xl"
                            style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: 1.52,
                                letterSpacing: "0.03em",
                            }}
                        >
                            Order authentic Indian and Pakistani groceries from Ideal Indiska
                            LIVS in Stockholm, and we send them straight to you in Kalmar via
                            DHL. From Basmati rice to fresh spice mixes — your favourite
                            flavours, delivered to your door or a DHL Service Point near you.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-7">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <Package className="h-4 w-4" />
                                Shop Now
                            </Link>
                            <a
                                href="https://wa.me/46728494801"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                            >
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* DHL Delivery Options */}
            <section className="py-14 border-b">
                <div className="container mx-auto px-4">
                    <h2
                        style={{ fontSize: "25px", fontWeight: 600 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <Truck className="h-6 w-6 text-primary" />
                        DHL Delivery Options to Kalmar
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {DHL_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            return (
                                <div
                                    key={opt.title}
                                    className={`rounded-xl border p-6 space-y-3 ${opt.highlight
                                            ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                                            : "bg-card/50"
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
                                        {opt.title}
                                    </h3>
                                    <p
                                        style={{ fontSize: "14.31px" }}
                                        className="text-muted-foreground leading-relaxed"
                                    >
                                        {opt.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-primary border border-primary/20 rounded-full px-3 py-1 w-fit">
                                        <Clock className="h-3 w-3" />
                                        {opt.detail}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground flex items-start gap-2">
                        <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        At checkout, select your preferred DHL option and optionally choose a
                        specific DHL Service Point from the DHL map. Shipping costs are
                        calculated based on order weight.
                    </p>
                </div>
            </section>

            {/* Main Content & Sidebar */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content (2/3) */}
                        <div className="lg:col-span-2 space-y-14">
                            {/* Coverage */}
                            <section className="space-y-8">
                                <h2
                                    style={{ fontSize: "25px", fontWeight: 600 }}
                                    className="flex items-center gap-3"
                                >
                                    <MapPin className="h-6 w-6 text-primary" />
                                    Areas We Deliver To
                                </h2>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {COVERAGE_AREAS.map((area) => (
                                        <div key={area.name} className="space-y-3">
                                            <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
                                                {area.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                Postcodes: {area.postcodes}
                                            </p>
                                            <ul className="space-y-1.5 text-muted-foreground" style={{ fontSize: "14.31px" }}>
                                                {area.places.map((p) => (
                                                    <li key={p} className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10 p-4 text-sm text-amber-800 dark:text-amber-300"
                                >
                                    <strong>Note:</strong> Frozen foods and fresh produce are
                                    restricted to Stockholm area delivery only. All dry goods,
                                    spices, rice, lentils, oils, and packaged products ship to
                                    Kalmar without restriction.
                                </div>
                            </section>

                            {/* Why Kalmar */}
                            <section className="space-y-5">
                                <h2 style={{ fontSize: "25px", fontWeight: 600 }}>
                                    Why Kalmar Customers Choose Us
                                </h2>
                                <p
                                    style={{ fontSize: "16px", lineHeight: 1.6 }}
                                    className="text-muted-foreground"
                                >
                                    Kalmar is home to Linnaeus University — one of Sweden's fastest
                                    growing universities — with a vibrant student community that
                                    includes many students from India, Pakistan, Bangladesh, and
                                    Sri Lanka. Local supermarkets rarely carry the right lentils,
                                    the right rice, or the right masala mixes. Ideal Indiska LIVS
                                    fills that gap with over 1,000 authentic products, shipped
                                    directly to you via DHL.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                    {[
                                        "Over 1,000 authentic products in stock",
                                        "Tracked DHL shipping to all Kalmar postcodes",
                                        "No minimum order amount",
                                        "Halal-certified products available",
                                        "Swedish & EU customs-free shipping (no duties)",
                                        "Order by 12:00 for same-day dispatch",
                                    ].map((point) => (
                                        <div
                                            key={point}
                                            className="flex items-start gap-3 p-3 rounded-lg border bg-muted/5"
                                        >
                                            <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                            <span style={{ fontSize: "14.31px" }}>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Popular Products */}
                            <section className="space-y-5">
                                <h2 style={{ fontSize: "25px", fontWeight: 600 }}>
                                    Popular Picks for Kalmar
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
                                    {POPULAR_PRODUCTS.map((product) => (
                                        <div
                                            key={product}
                                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/5"
                                        >
                                            <Package className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span style={{ fontSize: "14.31px" }}>{product}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                                >
                                    Browse all products <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </section>

                            {/* FAQ */}
                            <section className="space-y-5">
                                <h2 style={{ fontSize: "25px", fontWeight: 600 }}>
                                    Delivery FAQ — Kalmar
                                </h2>
                                <div className="space-y-4">
                                    {FAQS.map((faq, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl border bg-card/50 p-5 space-y-2"
                                        >
                                            <h3
                                                style={{ fontSize: "15.13px", fontWeight: 600 }}
                                                className="flex items-start gap-2"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                                {faq.q}
                                            </h3>
                                            <p
                                                style={{ fontSize: "14.31px" }}
                                                className="text-muted-foreground leading-relaxed pl-6"
                                            >
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Shipping Info Card */}
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3
                                        style={{ fontSize: "18.91px", fontWeight: 500 }}
                                        className="mb-4"
                                    >
                                        Shipping to Kalmar
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: "13.53px", fontWeight: 500 }}>
                                                    DHL Tracked Delivery
                                                </p>
                                                <p
                                                    style={{ fontSize: "12.8px" }}
                                                    className="text-muted-foreground"
                                                >
                                                    2–4 business days. Full tracking included.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: "13.53px", fontWeight: 500 }}>
                                                    DHL Service Points in Kalmar
                                                </p>
                                                <p
                                                    style={{ fontSize: "12.8px" }}
                                                    className="text-muted-foreground"
                                                >
                                                    Mekonomen, ICA Berga Centrum, Direkten Tobaksboden &amp;
                                                    more.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: "13.53px", fontWeight: 500 }}>
                                                    No Minimum Order
                                                </p>
                                                <p
                                                    style={{ fontSize: "12.8px" }}
                                                    className="text-muted-foreground"
                                                >
                                                    Order as little or as much as you need.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p style={{ fontSize: "13.53px", fontWeight: 500 }}>
                                                    Same-Day Dispatch
                                                </p>
                                                <p
                                                    style={{ fontSize: "12.8px" }}
                                                    className="text-muted-foreground"
                                                >
                                                    Order before 12:00 noon for same-day packing &amp;
                                                    dispatch.
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                    <Link
                                        href="/shop"
                                        className="mt-5 block text-center py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                                    >
                                        Shop &amp; Order Now
                                    </Link>
                                </div>

                                {/* Store Map */}
                                <div className="bg-card">
                                    <GoogleMapCompact />
                                    <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                                        <p className="text-xs text-center text-muted-foreground">
                                            Ships from: {brandProfile.address.street},{" "}
                                            {brandProfile.address.postalCode}{" "}
                                            {brandProfile.address.area}, Stockholm
                                        </p>
                                    </div>
                                </div>

                                {/* WhatsApp Support */}
                                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                                    <h3
                                        style={{ fontSize: "18.91px", fontWeight: 500 }}
                                        className="mb-2"
                                    >
                                        Questions?
                                    </h3>
                                    <p
                                        style={{ fontSize: "13.53px" }}
                                        className="text-muted-foreground mb-4"
                                    >
                                        Chat with us on WhatsApp — we reply in English, Swedish,
                                        Hindi &amp; Urdu.
                                    </p>
                                    <a
                                        href="https://wa.me/46728494801"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
                                    >
                                        WhatsApp Chat
                                    </a>
                                </div>

                                {/* Other Delivery Pages */}
                                <div className="border rounded-lg p-6 bg-card space-y-3">
                                    <h3
                                        style={{ fontSize: "18.91px", fontWeight: 500 }}
                                        className="mb-3"
                                    >
                                        More Delivery Pages
                                    </h3>
                                    {[
                                        {
                                            href: "/delivery-information",
                                            label: "Stockholm & Sweden Delivery",
                                        },
                                        {
                                            href: "/delivery-goteborg-malmo",
                                            label: "Göteborg & Malmö Delivery",
                                        },
                                        { href: "/europe-delivery", label: "Europe-Wide Delivery" },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-primary hover:underline text-sm flex items-center justify-between"
                                        >
                                            {link.label}
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Structured Data */}
            <SchemaScript
                id="kalmar-delivery-schema"
                schema={kalmarDeliveryServiceSchema()}
            />
        </main>
    );
}
