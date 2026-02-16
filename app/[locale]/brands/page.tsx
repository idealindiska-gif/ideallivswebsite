import { Link } from "@/lib/navigation";
import Image from "next/image";
import { Container } from "@/components/craft";
import { brandProfile } from "@/config/brand-profile";
import { getAllProductBrands } from "@/lib/woocommerce/brands";
import { Package, TrendingUp } from "lucide-react";
import { BrandsGrid } from "@/components/brands-grid";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { SchemaScript } from "@/lib/schema/schema-script";
import { collectionPageSchema, brandDirectorySchema } from "@/lib/schema/collection";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const titleEn = `135+ Indian & Pakistani Grocery Brands Stockholm | ${brandProfile.name}`;
    const titleSv = `135+ Indiska & Pakistanska Matvaruvarumärken Stockholm | ${brandProfile.name}`;

    const descriptionEn = `Browse 135+ authentic Indian & Pakistani grocery brands in Stockholm. Shop Shan, MDH, Haldiram, National, MTR, TRS, Tilda, Aashirvaad & more at Ideal Indiska Livs. Fast delivery across Sweden.`;
    const descriptionSv = `Bläddra bland 135+ autentiska indiska och pakistanska matvaruvarumärken i Stockholm. Handla Shan, MDH, Haldiram, National, MTR, TRS, Tilda, Aashirvaad & mer hos Ideal Indiska Livs. Snabb leverans i hela Sverige.`;

    return {
        title: locale === 'sv' ? titleSv : titleEn,
        description: locale === 'sv' ? descriptionSv : descriptionEn,
        alternates: {
            canonical: "https://www.ideallivs.com/brands",
        },
        keywords: [
            "top indian brands Stockholm",
            "pakistani grocery stores sweden",
            "best basmati rice brands",
            "halal certified meat brands",
            "shan spices stockholm",
            "haldiram sweets sweden",
            "mtr meals online",
            "ahmed foods supplier",
            "mdh masala sweden",
            "trs foods stockholm",
        ].join(", "),
    };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function ShopByBrandPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('brandsPage');

    const brands = await getAllProductBrands();

    // Get top 10 most popular brands for featured section
    const featuredBrands = [...brands]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-12 md:py-16 border-b border-border/50">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-[1.15] text-foreground tracking-tight mb-6">
                                {t('heroTitle')}
                            </h1>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
                                <Package className="w-4 h-4" />
                                <span>{t('premiumBrands', { count: brands.length })}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t('heroP1')}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('heroP2')}
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Featured Brands Section */}
            <section className="py-12 md:py-16 border-b border-border/50 bg-muted/30">
                <Container>
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-heading font-bold">
                            {t('mostPopular')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
                        {featuredBrands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/brand/${brand.slug}`}
                                className="group"
                            >
                                <article className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 overflow-hidden">
                                    <div className="relative aspect-square bg-white flex items-center justify-center p-4">
                                        {brand.image?.src ? (
                                            <Image
                                                src={brand.image.src}
                                                alt={brand.image.alt || brand.name}
                                                fill
                                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 10vw"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                                                {brand.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 text-center border-t border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                                            {brand.name}
                                        </p>
                                        <p className="text-xs text-primary font-bold">
                                            {brand.count} {t('items')}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            {/* All Brands Grid with Search & Filters */}
            <section className="py-16 md:py-24">
                <Container>
                    <BrandsGrid brands={brands} />
                </Container>
            </section>

            {/* SEO Content Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <Container>
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <h2 className="text-3xl font-heading font-bold mb-6">
                            {t('seoTitle')}
                        </h2>

                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                <strong>{locale === 'sv' ? 'Största urvalet av indiska och pakistanska varumärken i Stockholm:' : 'Largest Selection of Indian and Pakistani Brands in Stockholm:'}</strong>{" "}
                                {t('seoP1')}
                            </p>

                            <p>
                                <strong>{locale === 'sv' ? 'Kvalitet du kan lita på:' : 'Quality You Can Trust:'}</strong> {t('seoP2')}
                            </p>

                            <p>
                                <strong>{locale === 'sv' ? 'Bekväm onlinehandel:' : 'Convenient Online Shopping:'}</strong> {t('seoP3')}
                            </p>

                            <h3 className="text-2xl font-heading font-bold mt-8 mb-4">
                                {t('popularBrandsTitle')}
                            </h3>

                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Shan:</strong> {locale === 'sv' ? 'Pakistans #1 kryddmärke, perfekt för autentiska curryrätter och biryanis' : "Pakistan's #1 spice brand, perfect for authentic curries and biryanis"}</li>
                                <li><strong>Ahmed Foods:</strong> {locale === 'sv' ? 'Premiumkvalitet pickles, kryddor och matprodukter' : 'Premium quality pickles, spices, and food products'}</li>
                                <li><strong>MTR:</strong> {locale === 'sv' ? 'Sydindiska specialiteter och färdiga måltider' : 'South Indian specialties and ready-to-eat meals'}</li>
                                <li><strong>National Foods:</strong> {locale === 'sv' ? 'Pålitliga pakistanska masalor och matprodukter' : 'Trusted Pakistani masalas and food products'}</li>
                                <li><strong>Haldiram&apos;s:</strong> {locale === 'sv' ? 'Indiens favorit snacks och sötsaker' : "India's favorite snacks and sweets"}</li>
                                <li><strong>MDH:</strong> {locale === 'sv' ? 'Premium kryddblandningar och masalor' : 'Premium spice blends and masalas'}</li>
                                <li><strong>TRS Foods:</strong> {locale === 'sv' ? 'Brett utbud av ris, linser och specialingredienser' : 'Wide range of rice, lentils, and specialty ingredients'}</li>
                            </ul>

                            <p className="mt-6">
                                {t('visitStore')}
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Structured Data */}
            <SchemaScript
                id="brands-collection-schema"
                schema={collectionPageSchema({
                    name: "Indian & Pakistani Grocery Brands - Ideal Indiska LIVS",
                    description: "Directory of authentic South Asian grocery brands available in Stockholm.",
                    url: "https://www.ideallivs.com/brands",
                    items: brands.map(brand => ({
                        url: `https://www.ideallivs.com/brand/${brand.slug}`,
                        name: brand.name,
                        image: brand.image?.src || undefined
                    }))
                })}
            />

            {/* Enhanced Brand Directory Schema - uses proper Brand typing */}
            <SchemaScript
                id="brands-directory-schema"
                schema={brandDirectorySchema({
                    name: "Shop by Brand - Premium Indian & Pakistani Grocery Brands",
                    description: `Browse ${brands.length}+ trusted South Asian grocery brands at Ideal Indiska LIVS Stockholm.`,
                    url: "https://www.ideallivs.com/brands",
                    brands: brands.map(brand => ({
                        name: brand.name,
                        slug: brand.slug,
                        image: brand.image?.src,
                        productCount: brand.count
                    })),
                    baseUrl: "https://www.ideallivs.com"
                })}
            />

            {/* Breadcrumb Schema */}
            <SchemaScript
                id="brands-breadcrumb-schema"
                schema={breadcrumbSchema([
                    { name: "Home", url: "https://www.ideallivs.com" },
                    { name: "Brands", url: "https://www.ideallivs.com/brands" }
                ], "https://www.ideallivs.com/brands")}
            />
        </main>
    );
}
