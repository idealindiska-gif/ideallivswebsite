import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n.config';

// next-intl middleware for locale detection and routing
const intlMiddleware = createMiddleware(routing);

/**
 * Handle legacy redirects
 */
function handleLegacyRedirects(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Normalize: strip trailing slash for matching (except root "/")
  const path = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  // ─── 1. Double locale prefix: /sv/sv/*, /no/no/*, /da/da/* ──────────────
  const doubleLocale = path.match(/^\/(sv|no|da)\/(sv|no|da)(\/.*)?$/);
  if (doubleLocale && doubleLocale[1] === doubleLocale[2]) {
    const rest = doubleLocale[3] || '';
    return NextResponse.redirect(new URL(`/${doubleLocale[1]}${rest}`, request.url), 301);
  }

  // ─── 2. /no/* and /da/* product/product-category/brand → English ────────
  // These locales lack real WooCommerce product data; redirect to English canonical
  const noOrDaRoute = path.match(/^\/(no|da)\/(product|product-category|brand)(\/.*)?$/);
  if (noOrDaRoute) {
    const type = noOrDaRoute[2];
    const rest = noOrDaRoute[3] || '';
    return NextResponse.redirect(new URL(`/${type}${rest}`, request.url), 301);
  }

  // ─── 3. /shop/product/* → /product/* ────────────────────────────────────
  if (path.startsWith('/shop/product/')) {
    const slug = path.replace('/shop/product/', '');
    return NextResponse.redirect(new URL(`/product/${slug}`, request.url), 301);
  }

  // ─── 4. /shop/category/* → /product-category/* ──────────────────────────
  if (path.startsWith('/shop/category/')) {
    const slug = path.replace('/shop/category/', '');
    return NextResponse.redirect(new URL(`/product-category/${slug}`, request.url), 301);
  }

  // ─── 5. Known /shop/{category-slug} → /product-category/* ───────────────
  // Must come before the generic /shop/* → /product/* rule below
  const shopCategorySlugs = new Set([
    'lentils-beans-dals', 'spices-masalas', 'frozen-foods', 'rice-grains',
    'snacks', 'fresh-produce',
  ]);
  if (path.startsWith('/shop/') && path !== '/shop') {
    const slug = path.replace('/shop/', '');
    if (!slug.includes('/') && shopCategorySlugs.has(slug)) {
      return NextResponse.redirect(new URL(`/product-category/${slug}`, request.url), 301);
    }
  }

  // ─── 6. /shop/{product-slug} → /product/* ───────────────────────────────
  if (
    path.startsWith('/shop/') &&
    path !== '/shop' &&
    !path.match(/^\/shop\/page\/\d+/)
  ) {
    const slug = path.replace('/shop/', '');
    if (slug && !slug.includes('/')) {
      return NextResponse.redirect(new URL(`/product/${slug}`, request.url), 301);
    }
  }

  // ─── 7. /blog/category/* → /blog ────────────────────────────────────────
  if (path.startsWith('/blog/category/')) {
    const categorySlug = path.replace('/blog/category/', '');
    // Swedish category
    if (categorySlug === 'handla-mat-pa-natet') {
      return NextResponse.redirect(new URL('/sv/blog', request.url), 301);
    }
    return NextResponse.redirect(new URL('/blog', request.url), 301);
  }

  // ─── 8. Old root-level blog article URLs → /blog/* ──────────────────────
  // Swedish articles (no prefix) → /sv/blog/*; English → /blog/*
  const oldBlogArticles: Record<string, string> = {
    '/rice-in-stockholm':                                              '/blog/rice-in-stockholm',
    '/choosing-the-right-rice':                                        '/blog/choosing-the-right-rice',
    '/finding-the-best-indian-pakistani-grocery-store-in-stockholm':   '/blog/finding-the-best-indian-pakistani-grocery-store-in-stockholm',
    '/paneer-butter-masala-recipe':                                    '/blog/paneer-butter-masala-recipe',
    '/swedish-meatballs-vs-kofta-curry-a-delicious-comparison':        '/blog/swedish-meatballs-vs-kofta-curry-a-delicious-comparison',
    '/guide-till-matleverans-i-stockholm':                             '/sv/blog/guide-till-matleverans-i-stockholm',
    '/indiska-livsmedel-i-goteborg':                                   '/sv/blog/indiska-livsmedel-i-goteborg',
  };
  if (oldBlogArticles[path]) {
    return NextResponse.redirect(new URL(oldBlogArticles[path], request.url), 301);
  }

  // ─── 9. Old WooCommerce category slugs at root → /product-category/* ────
  const oldCategoryPaths: Record<string, string> = {
    // ── previously mapped ──
    '/lentils-beans-dals':       '/product-category/lentils-beans-dals',
    '/hair-oils':                '/product-category/hair-oils',
    '/flakes':                   '/product-category/flakes',
    '/paneer-fresh-produce':     '/product-category/paneer-fresh-produce',
    '/tea':                      '/product-category/tea',
    '/indian-snacks':            '/product-category/indian-snacks',
    '/henna':                    '/product-category/henna',
    '/cooking-oil':              '/product-category/cooking-oil',
    '/chakki-fresh':             '/product-category/chakki-fresh',
    '/cooking-ingredients':      '/product-category/cooking-ingredients',
    '/mong-dal':                 '/product-category/mong-dal',
    '/hair-care':                '/product-category/hair-care',
    '/frozen-samosa':            '/product-category/frozen-samosa',
    '/home-essentials':          '/product-category/home-essentials',
    '/jam':                      '/product-category/jam',
    // ── new: crawled category slugs ──
    '/frozen-foods':             '/product-category/frozen-foods',
    '/spices-masalas':           '/product-category/spices-masalas',
    '/fresh-produce':            '/product-category/fresh-produce',
    '/rice-grains':              '/product-category/rice-grains',
    '/snacks':                   '/product-category/snacks',
    '/ready-to-eat':             '/product-category/ready-to-eat',
    '/fruits':                   '/product-category/fruits',
    '/energy-drinks':            '/product-category/energy-drinks',
    '/personal-care':            '/product-category/personal-care',
    '/oils-ghee':                '/product-category/oils-ghee',
    '/instant-noodles':          '/product-category/instant-noodles',
    '/biscuits-cookies':         '/product-category/biscuits-cookies',
    '/asian-rice':               '/product-category/asian-rice',
    '/mango-pickle':             '/product-category/mango-pickle',
    '/electric':                 '/product-category/electric',
    '/masoor-dal':               '/product-category/masoor-dal',
    '/instant-drink-mixes':      '/product-category/instant-drink-mixes',
    '/diwali':                   '/product-category/diwali',
    '/curry-masala':             '/product-category/curry-masala',
    '/food-colours-essences':    '/product-category/food-colours-essences',
    '/frozen-snacks':            '/product-category/frozen-snacks',
    '/sunflower':                '/product-category/sunflower',
    '/others':                   '/product-category/others',
    '/health-drinks-mixes':      '/product-category/health-drinks-mixes',
    '/dessert-mixes':            '/product-category/dessert-mixes',
    '/mango':                    '/product-category/mango',
    '/pure-clarified-butter':    '/product-category/pure-clarified-butter',
    '/meat-alternatives':        '/product-category/meat-alternatives',
    '/juices-soft-drinks':       '/product-category/juices-soft-drinks',
    '/rava-sooji':               '/product-category/rava-sooji',
    '/festival-special':         '/product-category/festival-special',
    '/canned-jarred-goods':      '/product-category/canned-jarred-goods',
    '/chaat-ingredients':        '/product-category/chaat-ingredients',
    '/recipe-mixes':             '/product-category/recipe-mixes',
    '/herbs-roots':              '/product-category/herbs-roots',
    '/spice-blends':             '/product-category/spice-blends',
    '/soaps':                    '/product-category/soaps',
    '/skin-care':                '/product-category/skin-care',
    '/other-grains':             '/product-category/other-grains',
    '/hing':                     '/product-category/hing',
    '/batters':                  '/product-category/batters',
    '/rolls':                    '/product-category/rolls',
    '/fruit-pulps-canned-fruits':'/product-category/fruit-pulps-canned-fruits',
    '/cooked-boiled':            '/product-category/cooked-boiled',
    '/ghee':                     '/product-category/ghee',
    '/noodles-pasta':            '/product-category/noodles-pasta',
    '/agarbatti':                '/product-category/agarbatti',
    '/beard-colour':             '/product-category/beard-colour',
    '/almond-oil':               '/product-category/almond-oil',
    '/baby-care':                '/product-category/baby-care',
    '/sauces':                   '/product-category/sauces',
    '/cooking-pastes':           '/product-category/cooking-pastes',
    '/pooja-items':              '/product-category/pooja-items',
    '/gram-flour':               '/product-category/gram-flour',
    '/rusk':                     '/product-category/rusk',
    '/nuts':                     '/product-category/nuts',
    '/paneer':                   '/product-category/paneer',
    '/seeds':                    '/product-category/seeds',
    '/frozen-bbq':               '/product-category/frozen-bbq',
    '/dry-fruits':               '/product-category/dry-fruits',
    '/kheer':                    '/product-category/kheer',
    '/powdered':                 '/product-category/powdered',
    '/ground-spices':            '/product-category/ground-spices',
    '/garlic-pastes':            '/product-category/garlic-pastes',
    '/sona-masoori':             '/product-category/sona-masoori',
    '/salt-pepper':              '/product-category/salt-pepper',
    '/soft-drinks':              '/product-category/soft-drinks',
    '/flour':                    '/product-category/flour',
    '/chick-peas':               '/product-category/chick-peas',
    '/chapati-flour':            '/product-category/chapati-flour',
    '/chips-crisps':             '/product-category/chips-crisps',
    '/ginger-pastes':            '/product-category/ginger-pastes',
    '/fragrance':                '/product-category/fragrance',
    '/basmati-rice':             '/product-category/basmati-rice',
    '/chick-peas-linser-lentils-11': '/product-category/lentils-beans-dals',
  };
  if (oldCategoryPaths[path]) {
    return NextResponse.redirect(new URL(oldCategoryPaths[path], request.url), 301);
  }

  // ─── 10. Old WooCommerce product slugs at root → /product/* ─────────────
  const oldProductSlugs: Record<string, string> = {
    '/tata-premium-tea-1kg':                              '/product/tata-premium-tea-1kg',
    '/red-label-natural-care-tea-1kg':                    '/product/red-label-natural-care-tea-1kg',
    '/mtr-rasam-powder':                                  '/product/mtr-rasam-powder',
    '/hadeel-chickpeas-2kg':                              '/product/hadeel-chickpeas-2kg',
    '/national-tikka-boti-88g':                           '/product/national-tikka-boti-88g',
    '/national-chana-masala-90gx2':                       '/product/national-chana-masala-90gx2',
    '/shan-tandoori-masala-50g':                          '/product/shan-tandoori-masala-50g',
    '/fortune-kachi-ghani-pure-mustard-oil-1-l':          '/product/fortune-kachi-ghani-pure-mustard-oil-1-l',
    '/ab-gram-flour-1-kg':                                '/product/ab-gram-flour-1-kg',
    '/ig-sona-masoori-rice-5kg-new-pack':                 '/product/ig-sona-masoori-rice-5kg-new-pack',
    '/indian-costus-powder':                              '/product/indian-costus-powder',
    '/bigen-mens-beard-colour-medium-brown':              '/product/bigen-mens-beard-colour-medium-brown',
    '/trs-ragi-flour-1-kg':                               '/product/trs-ragi-flour-1-kg',
    '/shan-biryani-masala-50g':                           '/product/shan-biryani-masala-50g',
    '/regal-cake-rusk-original-22stk':                    '/product/regal-cake-rusk-original-22stk',
    '/sai-gluten-free-jeera-ajwain-cookies-200g':         '/product/sai-gluten-free-jeera-ajwain-cookies-200g',
    '/tang-orange':                                       '/product/tang-orange',
    '/haldiram-aloo-paratha-400gm':                       '/product/haldiram-aloo-paratha-400gm',
    '/al-baker-chakki-fresh-atta':                        '/product/al-baker-chakki-fresh-atta',
    '/fruiti-o-juice-drink':                              '/product/fruiti-o-juice-drink',
    '/fanta-exotic-zero-330ml':                           '/product/fanta-exotic-zero-330ml',
    '/jabsons-peanut-cracker':                            '/product/jabsons-peanut-cracker',
    '/jannat-xxl-1121-basmati-rice-5-kg':                 '/product/jannat-xxl-1121-basmati-rice-5-kg',
    '/organic-cow-ghee':                                  '/product/organic-cow-ghee',
    '/garimaa-gold-long-grain-basmati-rice':              '/product/garimaa-gold-long-grain-basmati-rice',
    '/bikano-kaju-dhoda-burfi-400g':                      '/product/bikano-kaju-dhoda-burfi-400g',
    '/bikano-soan-papdi':                                 '/product/bikano-soan-papdi',
    '/sai-multigrains-gluten-free-atta-1-kg':             '/product/sai-multigrains-gluten-free-atta-1-kg',
    '/swarna-chakki-fresh-atta':                          '/product/swarna-chakki-fresh-atta',
    '/fortune-chakki-fresh-atta-10kg':                    '/product/fortune-chakki-fresh-atta-10kg',
    '/hadeel-mung-dal-2kg':                               '/product/hadeel-mung-dal-2kg',
    '/vatika-naturals-blackseed-clarifying-soap':         '/product/vatika-naturals-blackseed-clarifying-soap',
    '/anmol-electric-tandoor-oven':                       '/product/anmol-electric-tandoor-oven',
    '/vatika-naturals-olive-nourishing-soap':             '/product/vatika-naturals-olive-nourishing-soap',
    '/mer-parondryck-33cl':                               '/product/mer-parondryck-33cl',
    '/taaza-paneer':                                      '/product/taaza-paneer',
    '/garlic-vitlok-500g':                                '/product/garlic-vitlok-500g',
    '/india-gate-premium-basmati-rice-5kg':               '/product/india-gate-premium-basmati-rice-5kg',
    '/chings-schezuan-noodles-240g':                      '/product/chings-schezuan-noodles-240g',
    '/chings-green-chilli-sauce190-gms':                  '/product/chings-green-chilli-sauce190-gms',
    '/chings-hot-garlic-noodles-240-gms':                 '/product/chings-hot-garlic-noodles-240-gms',
    '/mtr-sambar-powder':                                 '/product/mtr-sambar-powder',
    '/chings-veg-hakka-noodles-140g':                     '/product/chings-veg-hakka-noodles-140g',
    '/aqu-aquador-50cl':                                  '/product/aqu-aquador-50cl',
    '/shangrila-peri-peri-sauce-285g':                    '/product/shangrila-peri-peri-sauce-285g',
    '/pataks-mild-curry-paste':                           '/product/pataks-mild-curry-paste',
    '/fresh-pakistani-mangoes':                           '/product/fresh-pakistani-mangoes',
    '/hot-chicken-flavor-ramen':                          '/product/hot-chicken-flavor-ramen',
    '/tikka-masala-paste':                                '/product/tikka-masala-paste',
    '/electric-tandoor-oven':                             '/product/electric-tandoor-oven',
    '/hadeel-whole-mung-dal-2kg':                         '/product/hadeel-whole-mung-dal-2kg',
    '/diwali-diya-set':                                   '/product/diwali-diya-set',
    '/jasmin-ris-aaaaa-jasmine-rice':                     '/product/jasmin-ris-aaaaa-jasmine-rice',
    '/annam-roasted-rava':                                '/product/annam-roasted-rava',
    '/chings-red-chilli-sauce-200-gms':                   '/product/chings-red-chilli-sauce-200-gms',
    '/hadeel-brown-chickpeas-2kg':                        '/product/hadeel-brown-chickpeas-2kg',
    '/annam-upma-rava-1kg':                               '/product/annam-upma-rava-1kg',
    '/sai-gluten-free-desi-ghee-cookies-200g':            '/product/sai-gluten-free-desi-ghee-cookies-200g',
    '/deshi-chinigura-aromatic-rice-1kg':                 '/product/deshi-chinigura-aromatic-rice-1kg',
    '/shan-chicken-tikka-50g':                            '/product/shan-chicken-tikka-50g',
    '/pataks-korma-paste-283-g':                          '/product/pataks-korma-paste-283-g',
    '/maggi-2-minute-masala-noodles':                     '/product/maggi-2-minute-masala-noodles',
    '/vatika-naturals-neem-purifying-soap':               '/product/vatika-naturals-neem-purifying-soap',
    '/kolson-slanty-jalapeno-60g':                        '/product/kolson-slanty-jalapeno-60g',
    '/india-gate-brown-basmati-rice':                     '/product/india-gate-brown-basmati-rice',
    '/haldirams-peanut-gajjak':                           '/product/haldirams-peanut-gajjak',
    '/haldiram-chana-jor-garam':                          '/product/haldiram-chana-jor-garam',
    '/sai-gluten-free-almond-cookies-200-g':              '/product/sai-gluten-free-almond-cookies-200-g',
    '/indian-costus-whole':                               '/product/indian-costus-whole',
    '/kolson-slanty-salted-60g':                          '/product/kolson-slanty-salted-60g',
    '/haldirams-frozen-phulka-roti-360gm':                '/product/haldirams-frozen-phulka-roti-360gm',
    '/jabsons-cocktail-nuts':                             '/product/jabsons-cocktail-nuts',
    '/kolson-slanty-veg-60g':                             '/product/kolson-slanty-veg-60g',
    '/bikano-besan-ladoo':                                '/product/bikano-besan-ladoo',
    '/idhayam-sesame-oil':                                '/product/idhayam-sesame-oil',
    '/haldirams-rajma-raseela-283gms':                    '/product/haldirams-rajma-raseela-283gms',
    '/annam-bombay-rava':                                 '/product/annam-bombay-rava',
    '/sai-gluten-free-butter-cashew-cookies-200-g':       '/product/sai-gluten-free-butter-cashew-cookies-200-g',
    '/hr-long-sev-200gm':                                 '/product/hr-long-sev-200gm',
    '/nestle-cerelac-400-g':                              '/product/nestle-cerelac-400-g',
    '/telephone-sat-ispaghol-200g':                       '/product/telephone-sat-ispaghol-200g',
    '/nestle-nido-milk-powder-400-gm':                    '/product/nestle-nido-milk-powder-400-gm',
    '/annam-peanut-oil-1-liter':                          '/product/annam-peanut-oil-1-liter',
    '/mtr-rice-idli-ready-mix':                           '/product/mtr-rice-idli-ready-mix',
    '/trs-kashmiri-chilli-powder-400g':                   '/product/trs-kashmiri-chilli-powder-400g',
    '/hadeel-split-urid-dal-2kg':                         '/product/hadeel-split-urid-dal-2kg',
    '/mer-apelsindryck-33cl':                             '/product/mer-apelsindryck-33cl',
    '/zingo-apelsin-33cl':                                '/product/zingo-apelsin-33cl',
    '/heera-ragi-flour-1-kg':                             '/product/heera-ragi-flour-1-kg',
    '/annam-unroasted-rava':                              '/product/annam-unroasted-rava',
    '/power-energy-drink-250ml-with-pant':                '/product/power-energy-drink-250ml-with-pant',
    '/bombaywala-motichoor-ladoo':                        '/product/bombaywala-motichoor-ladoo',
    '/bombaywala-kaju-katli':                             '/product/bombaywala-kaju-katli',
    '/tang-mango':                                        '/product/tang-mango',
    '/fresh-brinjal':                                     '/product/fresh-brinjal',
    '/fresh-indian-red-chili':                            '/product/fresh-indian-red-chili',
    '/hadeel-red-split-lentils':                          '/product/hadeel-red-split-lentils',
    '/haldirams-punjabi-choley-283gms':                   '/product/haldirams-punjabi-choley-283gms',
    '/malik-foods-sattu-roasted-gram-flour-chickpea-flour-1kg': '/product/malik-foods-sattu-roasted-gram-flour-chickpea-flour-1kg',
    '/neha-rachni-mehandi':                               '/product/neha-rachni-mehandi',
    '/hadeel-brown-lentils-2kg':                          '/product/hadeel-brown-lentils-2kg',
    '/trs-puffed-rice':                                   '/product/trs-puffed-rice',
    '/power-sugar-free-drink-250ml-with-pant':            '/product/power-sugar-free-drink-250ml-with-pant',
    '/ecobylife-henna-hair-colour-dark-brown':            '/product/ecobylife-henna-hair-colour-dark-brown',
    '/ecobylife-black-henna-svart-henna-hair-colour':     '/product/ecobylife-black-henna-svart-henna-hair-colour',
    '/hadeel-chana-dal-2-kg':                             '/product/hadeel-chana-dal-2-kg',
    '/fortune-gram-flour-1kg':                            '/product/fortune-gram-flour-1kg',
    '/ahmed-apple-cider-vinagar-450ml':                   '/product/ahmed-apple-cider-vinagar-450ml',
    '/fortune-unpolished-chitra-rajma-1kg':               '/product/fortune-unpolished-chitra-rajma-1kg',
    '/hadeel-toor-dal-2kg':                               '/product/hadeel-toor-dal-2kg',
    '/cadbury-bournvita-chocolate':                       '/product/cadbury-bournvita-chocolate',
    '/slanty':                                            '/product/slanty',
  };
  if (oldProductSlugs[path]) {
    return NextResponse.redirect(new URL(oldProductSlugs[path], request.url), 301);
  }

  // ─── 11. Misc legacy page redirects ─────────────────────────────────────
  const miscRedirects: Record<string, string> = {
    '/home':                                                         '/',
    '/shop-by-brand-top-indian-pakistani-grocery-brands-ideal-indiska-stockholm': '/brands',
    '/grocery-delivery-in-goteborg-and-malmo':                      '/delivery-goteborg-malmo',
    '/special-offers':                                               '/deals',
    '/pages/delivery-information':                                   '/europe-delivery',
    '/delivery/goteborg-malmo':                                      '/delivery-goteborg-malmo',
    '/delivery':                                                     '/delivery-information',
  };
  if (miscRedirects[path]) {
    return NextResponse.redirect(new URL(miscRedirects[path], request.url), 301);
  }

  return null;
}

/**
 * Middleware
 *
 * Handles:
 * 1. WWW redirect for SEO
 * 2. Legacy URL redirects (with trailing-slash normalization)
 * 3. next-intl locale routing (English = no prefix, Swedish = /sv/)
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');
  const { pathname } = url;

  // Skip API routes, static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    /\.(ico|png|jpg|jpeg|svg|webp|xml|txt)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // FORCE WWW REDIRECT (SEO)
  if (host === 'ideallivs.com') {
    url.host = 'www.ideallivs.com';
    return NextResponse.redirect(url, 301);
  }

  // LEGACY REDIRECTS (must come before intl middleware)
  const legacyRedirect = handleLegacyRedirects(request);
  if (legacyRedirect) return legacyRedirect;

  // next-intl handles locale detection and routing
  // English: no prefix (/) — Swedish: /sv/ prefix
  const response = intlMiddleware(request);

  // Explicitly set locale header so root layout can always detect it
  const detectedLocale =
    pathname.startsWith('/no') ? 'no' :
    pathname.startsWith('/da') ? 'da' :
    pathname.startsWith('/sv') ? 'sv' : 'en';
  response.headers.set('x-next-intl-locale', detectedLocale);

  return response;
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)' // Exclude API, Next.js internals, and files with extensions
  ],
};
