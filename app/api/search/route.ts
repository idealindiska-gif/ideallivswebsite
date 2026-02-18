import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

// ─── South Asian Grocery Synonym Dictionary ───────────────────────────────────
// Maps common South Asian / customer-friendly terms to the actual product names
// used in WooCommerce. When a query matches a key, we ALSO search for its values.
const SYNONYMS: Record<string, string[]> = {
    // ── Grains & Flour
    besan: ['gram flour', 'chickpea flour'],
    'gram flour': ['besan', 'chickpea'],
    atta: ['wheat flour', 'chakki', 'whole wheat', 'flour'],
    chakki: ['atta', 'wheat flour', 'flour'],
    maida: ['all purpose flour', 'plain flour', 'flour'],
    suji: ['semolina', 'rava'],
    rava: ['semolina', 'suji'],
    semolina: ['suji', 'rava'],
    flour: ['atta', 'besan', 'maida', 'chakki', 'wheat'],

    // ── Rice
    rice: ['basmati', 'long grain', 'chawal'],
    basmati: ['rice', 'long grain'],
    chawal: ['rice', 'basmati'],

    // ── Oils & Fats
    ghee: ['clarified butter', 'desi ghee'],
    oil: ['cooking oil', 'vegetable oil', 'sunflower', 'solrosolja'],
    'cooking oil': ['sunflower', 'solrosolja', 'vegetable oil', 'oil'],
    sunflower: ['oil', 'solrosolja', 'cooking oil'],
    solrosolja: ['sunflower', 'oil'],

    // ── Drinks & Syrups
    chai: ['tea'],
    tea: ['chai', 'black tea', 'green tea'],
    sharbat: ['syrup', 'drink', 'rooh afza', 'jam-e-shirin'],
    'rooh afza': ['sharbat', 'syrup', 'drink'],
    'jam-e-shirin': ['sharbat', 'syrup', 'drink', 'rooh afza'],
    'jam e shirin': ['sharbat', 'syrup', 'drink'],
    tang: ['drink', 'mango drink'],
    juice: ['drink', 'nectar'],

    // ── Pulses & Lentils
    dal: ['lentil', 'pulse', 'dhal'],
    dhal: ['lentil', 'dal', 'pulse'],
    lentil: ['dal', 'dhal', 'pulse'],
    chana: ['chickpea', 'chole'],
    chickpea: ['chana', 'chole', 'gram'],
    masoor: ['red lentil', 'lentil'],
    moong: ['mung', 'green lentil', 'lentil'],
    urad: ['black lentil', 'dal makhani'],

    // ── Spices & Seasonings
    haldi: ['turmeric'],
    turmeric: ['haldi'],
    jeera: ['cumin'],
    zeera: ['cumin', 'jeera'],
    cumin: ['jeera', 'zeera'],
    dhania: ['coriander', 'cilantro'],
    coriander: ['dhania', 'cilantro'],
    mirch: ['chili', 'chilli', 'pepper'],
    chili: ['mirch', 'chilli', 'pepper'],
    chilli: ['mirch', 'chili', 'pepper'],
    masala: ['spice', 'seasoning', 'spice mix'],
    spice: ['masala', 'seasoning'],
    'garam masala': ['spice mix', 'masala'],
    'black pepper': ['kali mirch', 'pepper'],
    'kali mirch': ['black pepper', 'pepper'],
    namak: ['salt'],
    salt: ['namak'],

    // ── Sweets, Dates & Snacks
    khajoor: ['dates', 'khurma'],
    khurma: ['dates', 'khajoor'],
    dates: ['khajoor', 'khurma'],
    samosa: ['samosas', 'snack', 'frozen snack'],
    samosas: ['samosa', 'snack'],
    namkeen: ['savory snack', 'snacks', 'crisps'],
    mithai: ['sweet', 'sweets'],
    'gulab jamun': ['sweet', 'dessert'],
    halwa: ['sweet', 'dessert'],

    // ── Dairy
    dahi: ['yogurt', 'yoghurt', 'curd'],
    yogurt: ['dahi', 'curd', 'yoghurt'],
    yoghurt: ['dahi', 'curd', 'yogurt'],
    paneer: ['cottage cheese'],
    doodh: ['milk'],
    milk: ['doodh'],
    khoya: ['mawa', 'milk solid'],
    mawa: ['khoya', 'milk solid'],

    // ── Meat, Kebabs & Frozen
    kebab: ['seekh kebab', 'kabab', 'frozen'],
    kabab: ['kebab', 'seekh kebab'],
    seekh: ['kebab', 'seekh kebab'],
    keema: ['mince', 'minced meat'],

    // ── Sauces, Pickles & Condiments
    achaar: ['pickle', 'achar'],
    achar: ['pickle', 'achaar'],
    pickle: ['achaar', 'achar'],
    chutney: ['sauce', 'dip'],

    // ── Bread
    roti: ['bread', 'chapati', 'flatbread'],
    chapati: ['roti', 'flatbread'],
    naan: ['bread', 'flatbread'],
    paratha: ['bread', 'flatbread'],

    // ── Common grocery category terms
    frozen: ['samosa', 'kebab', 'seekh', 'spring roll'],
    'spring roll': ['frozen', 'snack'],
    sugar: ['shakkar', 'socker'],
    shakkar: ['sugar'],
};

// ─── Helper: escape regex special chars ──────────────────────────────────────
function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Expand search terms using synonym map ────────────────────────────────────
// Returns the original query plus the best synonym to also search with.
function expandQuery(query: string): string[] {
    const lower = query.toLowerCase().trim();
    const syns = SYNONYMS[lower];
    if (syns && syns.length > 0) {
        return [lower, syns[0]];   // search original + primary synonym
    }
    return [lower];
}

// ─── Relevance Scoring ────────────────────────────────────────────────────────
function calculateRelevance(product: any, query: string): number {
    let score = 0;
    const lower = query.toLowerCase().trim();
    const lowerName = product.name.toLowerCase();
    const combined = [
        product.description || '',
        product.short_description || '',
    ].join(' ').toLowerCase();

    // ── 1. Title matching (primary signal) ──────────────────────
    if (lowerName === lower) {
        score += 100;          // exact full match
    } else if (lowerName.startsWith(lower)) {
        score += 90;           // title starts with query
    } else if (new RegExp(`\\b${escapeRegex(lower)}\\b`).test(lowerName)) {
        score += 85;           // whole-word match in title
    } else if (lowerName.includes(lower)) {
        score += 70;           // substring match in title
    } else {
        // Multi-word: score each query word independently
        const queryWords = lower.split(/\s+/).filter((w) => w.length > 1);
        if (queryWords.length > 0) {
            let matched = 0;
            for (const qw of queryWords) {
                if (lowerName.includes(qw)) matched++;
            }
            if (matched > 0) score += (matched / queryWords.length) * 55;
        }

        // Synonym title match: check if product name contains any synonym
        const syns = SYNONYMS[lower] || [];
        for (const syn of syns) {
            if (lowerName.includes(syn)) {
                score += 60;   // product name contains a known synonym of the query
                break;
            }
        }
    }

    // ── 2. Description match (secondary signal) ──────────────────
    if (combined.includes(lower)) {
        score += 10;
    } else {
        const syns = SYNONYMS[lower] || [];
        if (syns.some((s) => combined.includes(s))) score += 5;
    }

    // ── 3. Stock status (critical for UX) ────────────────────────
    if (product.stock_status === 'instock') {
        score += 20;   // strongly prefer in-stock items
    } else if (product.stock_status === 'outofstock') {
        score -= 40;   // push out-of-stock to the bottom
    }

    // ── 4. Minor boosts ──────────────────────────────────────────
    if (product.sale_price && parseFloat(product.sale_price) > 0) score += 5;
    if (product.images?.[0]?.src) score += 3;

    // ── NOTE: The old "grocery penalty" (-30 pts for grocery category)
    //    has been removed. This is a grocery store — grocery products
    //    should never be penalized.

    return score;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        console.log('[Search API] Query:', query);

        const searchTerms = expandQuery(query);
        const seen = new Map<number, any>();

        // ── Search with primary term (original query)
        const { data: primary } = await getProducts({
            search: searchTerms[0],
            per_page: 50,     // cast a wider net for better scoring
        });
        primary.forEach((p) => seen.set(p.id, p));

        // ── If few results and we have a synonym, search with that too
        if (seen.size < 6 && searchTerms[1]) {
            console.log('[Search API] Trying synonym:', searchTerms[1]);
            const { data: secondary } = await getProducts({
                search: searchTerms[1],
                per_page: 30,
            });
            secondary.forEach((p) => {
                if (!seen.has(p.id)) seen.set(p.id, p);
            });
        }

        console.log('[Search API] Candidates:', seen.size);

        // ── Score, sort, return top 10
        const results = Array.from(seen.values())
            .map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                regular_price: product.regular_price,
                sale_price: product.sale_price,
                stock_status: product.stock_status,
                image: product.images?.[0]?.src,
                categories: product.categories?.map((c: any) => c.name) || [],
                relevance: calculateRelevance(product, query),
            }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 10);

        console.log('[Search API] Results:', results.length);

        return NextResponse.json({ results }, {
            headers: {
                // 5-minute CDN cache (was 15 min — shorter = fresher results)
                'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error: any) {
        console.error('[Search API] Error:', error?.message);
        return NextResponse.json({
            results: [],
            error: error?.message || 'Search failed',
        }, { status: 500 });
    }
}
