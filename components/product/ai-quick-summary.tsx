import { Product } from '@/types/woocommerce';
import { decodeHtmlEntities } from '@/lib/utils';
import { Sparkles, Scale, MapPin, Leaf, CheckCircle2 } from 'lucide-react';

interface AiQuickSummaryProps {
    product: Product;
    className?: string; // Optional className prop
}

export function AiQuickSummary({ product, className = '' }: AiQuickSummaryProps) {
    // Extract key attributes for AI summary
    const attributes = product.attributes || [];

    const ingredients = attributes.find(
        attr => ['ingredients', 'innehåll', 'ingredienser'].includes(attr.name.toLowerCase())
    );

    const origin = attributes.find(
        attr => ['origin', 'ursprung', 'country', 'land'].includes(attr.name.toLowerCase())
    );

    const brand = product.brands && product.brands.length > 0 ? product.brands[0].name : null;
    const weight = product.weight ? (parseFloat(product.weight) >= 1000 ? `${parseFloat(product.weight) / 1000}kg` : `${product.weight}g`) : null;

    // Determine key features for "Best for" AI generation
    const isRice = product.categories?.some(c => c.slug.includes('rice') || c.slug.includes('ris'));
    const isSpice = product.categories?.some(c => c.slug.includes('spice') || c.slug.includes('kryddor'));
    const isLentil = product.categories?.some(c => c.slug.includes('lentil') || c.slug.includes('linser'));

    let bestFor = '';
    if (isRice) bestFor = 'Biryani, Pulao, and everyday meals';
    else if (isSpice) bestFor = 'Authentic curries, marinades, and seasoning';
    else if (isLentil) bestFor = 'Dals, soups, and healthy stews';

    // Don't render if we have no useful extracted info
    if (!ingredients && !origin && !bestFor && !weight) return null;

    return (
        <div className={`my-8 border rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 ${className}`}>
            <div className="p-4 border-b bg-white/50 dark:bg-black/20 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-lg text-indigo-950 dark:text-indigo-100">
                    Key Facts
                </h3>
                <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    AI Quick View
                </span>
            </div>

            <div className="p-5 grid gap-4 sm:grid-cols-2">
                {/* Origin & Brand */}
                {(origin || brand) && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <MapPin className="w-4 h-4" /> Origin & Brand
                        </div>
                        <p className="font-medium text-foreground">
                            {brand ? decodeHtmlEntities(brand) : 'Generic'}
                            {origin?.options && ` • From ${origin.options[0]}`}
                        </p>
                    </div>
                )}

                {/* Weight/Size */}
                {weight && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Scale className="w-4 h-4" /> Net Weight
                        </div>
                        <p className="font-medium text-foreground">{weight}</p>
                    </div>
                )}

                {/* Best For (Contextual) */}
                {bestFor && (
                    <div className="space-y-1 sm:col-span-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4" /> Best Used For
                        </div>
                        <p className="font-medium text-foreground">{bestFor}</p>
                    </div>
                )}

                {/* Ingredients (using details/summary for structured data hint) */}
                {ingredients && ingredients.options && (
                    <div className="sm:col-span-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/30">
                        <details className="group">
                            <summary className="flex items-center gap-2 cursor-pointer list-none py-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-800 transition-colors">
                                    <Leaf className="w-4 h-4" /> View Full Ingredients list
                                </div>
                                <span className="ml-auto text-xs text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 text-sm text-foreground/80 leading-relaxed bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                {decodeHtmlEntities(ingredients.options.join(', '))}
                            </p>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
