# Nordic Theme Redesign — Master Plan
**Project:** Ideal Indiska LIVS — Frontend Redesign  
**Date started:** 2026-04-30  
**Branch:** `redesign/nordic-theme` (create before any work begins)  
**Rollback:** `git checkout master` to restore original state instantly

---

## Skills Referenced in This Project

| Skill | Location | Purpose |
|---|---|---|
| `nextjs-developer` | `D:\Visual codes\claude-skills-main\...\skills\nextjs-developer` | App Router, RSC, Server Actions, ISR |
| `react-expert` | `D:\Visual codes\claude-skills-main\...\skills\react-expert` | Component architecture, client/server split |
| `typescript-pro` | `D:\Visual codes\claude-skills-main\...\skills\typescript-pro` | Type safety across new components |
| `wordpress-pro` | `D:\Visual codes\claude-skills-main\...\skills\wordpress-pro` | WooCommerce API: category images, products |
| `secure-code-guardian` | `D:\Visual codes\claude-skills-main\...\skills\secure-code-guardian` | No XSS, safe data handling |
| `fullstack-guardian` | `D:\Visual codes\claude-skills-main\...\skills\fullstack-guardian` | Full-stack consistency |
| **Claude SEO** | `D:\Visual codes\grocery-template\skills\claude-seo` | SEO preservation, schema, hreflang, local SEO |

> **Load the nextjs-developer and claude-seo skills before starting any phase.**

---

## Design Direction: Nordic Fresh (Direction B only)

All other directions (A: Spice & Heritage, C: Jewel Market) are **discarded**.

### Design Token Mapping — HTML Prototype → Tailwind CSS Variables

| Design HTML var | Tailwind equivalent | HSL value |
|---|---|---|
| `--green: #2d5a3d` | `bg-primary` | `142 64% 24%` |
| `--green-dark: #1f3f2c` | `bg-primary-800` | `143 64% 20%` |
| `--green-light: #e4eeea` | `bg-primary-100` | `141 84% 93%` |
| `--green-mid: #4a7c5f` | `bg-primary-600` | `142 76% 36%` |
| `--night: #0f1f16` | `text-foreground` | `222 47% 11%` |
| `--parchment: #f8f6f3` | `bg-background` | `127 50% 97%` |
| `--white: #ffffff` | `bg-card` or `bg-white` | — |
| `--muted: #6b8070` | `text-muted-foreground` | `215 16% 47%` |
| `--border: #e5ede9` | `border-border` | `214 32% 91%` |
| `--red: #d94f3d` | `text-destructive` / `bg-secondary` | `0 84% 60%` |
| `--gold: #c9a227` | custom `--gold` CSS var | no tailwind equiv — add manually |

**Font:** Design uses Inter throughout (replaces current Montserrat for headings). Keep `font-sans` (Inter) as primary. `font-heading` can stay Montserrat for page titles only where needed.

---

## ⛔ CHECKOUT — DO NOT MODIFY

The checkout system is custom-built and complex. It must NOT be restyled or restructured.

### Checkout Architecture (documented for reference)

**Location:** `app/[locale]/(shop)/checkout/page.tsx`

**Two-step flow:**
- **Step 1 (`information`)**: Shipping form + billing form + email capture
- **Step 2 (`shipping-payment`)**: Shipping method selector + payment method + order placement

**Payment methods supported:**
| ID | Method | Notes |
|---|---|---|
| `cod` | Cash on Delivery | |
| `bacs` | Bank Transfer | |
| `stripe` / `stripe_cc` | Credit/Debit cards | Requires `StripeProvider` + `StripePaymentForm` |
| `swish` | Swish (Swedish) | |
| `klarna` / `stripe_klarna` | Klarna BNPL | |
| `link` | Stripe Link | |

**Critical checkout features (DO NOT BREAK):**
1. **Abandoned cart tracking** — on email blur, POST to `/api/abandoned-cart`; updates on Step 1 complete
2. **Stock validation** — `validateCartStockAction` before order creation
3. **Shipping restrictions** — `validateShippingRestrictions` (some products can't ship certain zones)
4. **Blocked customers** — `checkCustomerBlockedAction`
5. **Stripe payment form** — `StripeProvider` wraps checkout when stripe method selected; `stripeClientSecret` drives the form
6. **Order deduplication** — `checkoutOrderId` is reused across back/forward navigation to prevent duplicate WC orders
7. **Recovery flow** — `/checkout/recover` pre-fills form from `sessionStorage abandoned_cart_recovery`
8. **WhatsApp order button** — `WhatsAppOrderButton` component visible alongside payment

**Checkout components (do not restructure):**
- `components/checkout/billing-form.tsx`
- `components/checkout/shipping-form.tsx`
- `components/checkout/shipping-method-selector.tsx`
- `components/checkout/payment-method-selector.tsx`
- `components/checkout/stripe-payment-form.tsx`
- `components/checkout/stripe-express-checkout.tsx`
- `components/checkout/order-summary.tsx`
- `components/checkout/coupon-input.tsx`

---

## Rollback Procedure

```bash
# Before ANY work: create the branch
git checkout -b redesign/nordic-theme

# If anything goes wrong, rollback is simply:
git checkout master

# To see what changed at any point:
git diff master..redesign/nordic-theme

# To bring a single file back from master:
git checkout master -- components/layout/header.tsx
```

**Commit after each phase completes** so rollback granularity is phase-level.

---

## Current Component Inventory

### Components to REPLACE with new design:
| Component | File | What changes |
|---|---|---|
| Header | `components/layout/header.tsx` | New sticky header with search bar integrated, category nav strip below |
| Top Info Bar | `components/layout/top-info-bar.tsx` | New dark green topbar with delivery info + language switcher |
| Footer | `components/layout/footer.tsx` | New 4-col dark footer |
| Hero | `components/home/hero.tsx` | New 2-col hero (main banner + 2 side cards), dynamic from WP ACF or static |
| CategoryGrid | `components/home/category-grid.tsx` | 7-col grid with WP category images (fallback: color bg) |
| ProductShowcase | `components/home/product-showcase.tsx` | New "Today's Best Deals" 5-col grid with filter tabs |
| PromotionGrid | `components/home/promotion-grid.tsx` | New limited stock section with stock bars |
| BannerStrip | `components/home/banner-strip.tsx` | Convert to brands strip |
| Product Card | `components/product/` | New card design: category > name > weight > rating > price + add btn |
| Product Listing | `app/[locale]/(shop)/shop/` | New sidebar + 4-col grid + toolbar |

### Components to KEEP AS-IS (do not redesign):
- All checkout components (`components/checkout/`)
- Cart drawer (`components/cart/cart-drawer.tsx`)
- Auth components (`components/auth/`)
- Search modal (`components/search/search-modal.tsx`) — keep logic, may restyle wrapper
- WishlistIcon, CartIcon — keep, may restyle
- AI chat widget (`components/ai/`)
- WhatsApp button (`components/whatsapp/`)
- All SEO/schema components (`components/seo/`, `lib/schema/`)
- All page-level metadata (`generateMetadata` in page.tsx files)

---

## Dynamic Data Strategy (No Hardcoding)

### Category Images
- Source: WooCommerce REST API `GET /wp-json/wc/v3/products/categories`
- Field: `image.src` on each category object
- Fallback: color container using category's `bg` color map (no emoji, no placeholder text)
- Already fetched via `getProductCategories()` in `lib/woocommerce.ts`

### Hero Banners
- Option A: WordPress ACF custom fields on a "Homepage Settings" page
- Option B: Static content in translation files (`messages/en.json`, `messages/sv.json`)
- Start with Option B (faster), plan for Option A later
- No hardcoded seasonal text (remove "Summer Deals", "Ramadan" references from design)

### Products
- Already fetched from WooCommerce via `getProducts()` — reuse
- "Today's Deals" = products with `on_sale: true`
- "Best Sellers" = products sorted by `popularity`
- "New Arrivals" = products sorted by `date` desc
- "Limited Stock" = products with `stock_quantity < 10` and `manage_stock: true`

### Brands Strip
- Already in `brands-data.json` — reuse existing data
- Brand logo images: use existing WC brand images from `crm.ideallivs.com`

---

## SEO Preservation Rules (from claude-seo skill)

1. **Never change page URLs** — all routes stay the same
2. **Keep all `generateMetadata` exports** — do not remove or simplify
3. **Keep all `SchemaScript` injections** — schemas must remain in initial HTML
4. **Keep all `alternates.canonical` and `alternates.languages`** — hreflang preserved
5. **`revalidate` values** — do not change ISR timing
6. **FAQ sections** — HomeFAQ, delivery FAQ etc. must remain visible (not hidden in accordions by default)
7. **Breadcrumbs** — must stay in product category and product detail pages
8. **`getAlternates(path, locale)`** pattern — must be preserved in all locale pages
9. Do NOT use CSS `display:none` on content that contains schema-linked text

---

## Implementation Phases

### Phase 1 — Foundation (Theme + Top/Bottom Shell) ✅ COMPLETE
- [x] Create `redesign/nordic-theme` git branch
- [x] Update `theme-variables.css` — added `--gold` / `--gold-light` CSS variables
- [x] New **Top Info Bar** (`top-info-bar.tsx`) — dark #1f3f2c, "We ship across Sweden & Europe", live store status dot
- [x] New **Content Header** (`content-header.tsx`) — white sticky 72px, logo+search+icons, mobile hamburger+QuickNav strip
- [x] New **Category Nav Strip** (`category-nav-strip.tsx`) — desktop sticky scrollable row, dynamic WC categories
- [x] New **Footer** (`footer.tsx`) — dark #0f1f16, 4-col clean layout, removed glassmorphism
- [x] Update `app/layout.tsx` — remove VerticalSidebar+lg:ml-64, wire categories to ContentHeader+CategoryNavStrip
- [x] Build passes: `npx next build` — 0 errors, 0 TS errors

### Phase 2 — Homepage Sections ✅ COMPLETE
- [x] New **Hero** — 2-col layout, green main card + 2 side cards (dark green / gold)
- [x] New **CategoryGrid** — 7-col tile grid, WC images, color fallback (no emoji)
- [x] New **DealsSection** — client-side filter tabs + auto-fill grid
- [x] New **BrandsStrip** — scrollable brand name list in white card
- [x] New **ReviewsSection** — static 3-col reviews with star ratings
- [x] Update `app/[locale]/page.tsx` — wired new sections, removed PromotionGrid/BannerStrip, all schemas+FAQ preserved
- [x] Build passes: 0 errors

### Phase 3 — Product Card & Listing Page ✅ COMPLETE
- [x] New **CategoryHeroStrip** — green banner with category name, count, WC image
- [x] **ProductGrid** gap: `gap-6` → `gap-3` for tighter Nordic grid
- [x] **ArchiveTemplate** — `headerContent` prop added, renders CategoryHeroStrip
- [x] **Category page** — passes CategoryHeroStrip, preserves all filters/sort/pagination
- [x] Build passes: 0 errors

### Phase 4 — Product Detail Page ✅ COMPLETE
- [x] **ProductTemplate** layout: 3-col → 2-col `[1fr_380px]` (gallery | info)
- [x] **Related products** moved to horizontal scroll strip below main content
- [x] All sub-components untouched: AddToCart, Variations, QuantitySelector, StripeExpress, WhatsApp, Bundles, Reviews, FAQ, AI Summary
- [x] Schema scripts untouched
- [x] Build passes: 0 errors

### Phase 5 — QA & Polish ✅ COMPLETE
- [x] Checkout page: 0 lines changed (confirmed with `git diff`)
- [x] VerticalSidebar + lg:ml-64: fully removed, no stale refs
- [x] Schema scripts: 4 scripts preserved on homepage
- [x] Mobile classes: all components have lg:/sm:/md: breakpoints
- [x] Free shipping text: removed from all user-facing components
- [x] `app/page.tsx` (root EN page): updated to match new section structure
- [x] Build: 275/275 static pages, 0 TypeScript errors, 0 compile errors

### Phase 6 — Merge & Deploy ⏳ READY FOR USER
- [ ] User: test locally (`npm run dev`) and verify on all pages
- [ ] User: confirm checkout flow end-to-end
- [ ] Merge `redesign/nordic-theme` → `master`
- [ ] Deploy to Vercel / push to production

---

## New Features — Suggestions for Future Phases

These are NOT in scope for the initial redesign but are ready to build after:

### High Impact (do soon)
| Feature | Why | Effort |
|---|---|---|
| **Free shipping progress bar in header/cart** | Shows "Add 89 kr more for free delivery" — proven conversion driver | Low |
| **Recently Viewed Products** | Persistent via localStorage, shown on PDP and cart drawer | Low |
| **Back-in-stock email capture** | "Notify me" on OOS products → email list building | Medium |
| **Quick-view modal on product cards** | Open product details without leaving listing page | Medium |
| **Smart Search with live suggestions** | Type-ahead from WooCommerce products, show top results inline | Medium |

### Medium Impact (next quarter)
| Feature | Why | Effort |
|---|---|---|
| **"Frequently Bought Together"** | On PDP, bundle 2-3 complementary products → AOV increase | Medium |
| **Recipe-to-cart** | Blog posts link to ingredient products with "Buy all ingredients" button | Medium |
| **Subscription/repeat order** | "Set up auto-delivery every 4 weeks" for Basmati, atta, etc. | High |
| **Product comparison** | Compare up to 3 products side-by-side | Medium |
| **WhatsApp order integration** (better UX) | Existing feature, make it more prominent on mobile | Low |

### SEO Features
| Feature | Why | Effort |
|---|---|---|
| **Category landing page content blocks** | Add curated text/image blocks below product grid for SEO | Low |
| **"As seen in / trusted by" strip** | Social proof + brand recognition | Low |
| **Structured review import** | Pull Google reviews via API, display with schema | Medium |

---

## Key Files Reference

```
app/[locale]/page.tsx                          — Homepage (FAQs + schema — preserve)
app/[locale]/(shop)/checkout/page.tsx          — Checkout (DO NOT TOUCH)
app/[locale]/(shop)/shop/page.tsx              — Product listing
app/[locale]/product-category/               — Category pages
components/layout/header.tsx                   — Replace Phase 1
components/layout/footer.tsx                   — Replace Phase 1
components/layout/top-info-bar.tsx             — Replace Phase 1
components/home/hero.tsx                       — Replace Phase 2
components/home/category-grid.tsx              — Replace Phase 2
components/home/product-showcase.tsx           — Replace Phase 2
components/home/promotion-grid.tsx             — Replace Phase 2
app/theme-variables.css                        — Add --gold, adjust parchment bg
tailwind.config.ts                             — No structural changes needed
lib/woocommerce.ts                             — No changes, reuse existing functions
messages/en.json + messages/sv.json            — Add new translation keys for redesigned sections
```

---

## Progress Tracker

| Phase | Status | Branch commit | Notes |
|---|---|---|---|
| Phase 1 — Shell | ✅ Complete | `7606bc0` | TopInfoBar, ContentHeader, CategoryNavStrip, Footer, layout.tsx — build passes |
| Phase 2 — Homepage | ✅ Complete | `998cbb2` | Hero, CategoryGrid, DealsSection, BrandsStrip, ReviewsSection — build passes |
| Phase 3 — Product Listing | ✅ Complete | `38726ea` | CategoryHeroStrip, ProductGrid gap, ArchiveTemplate headerContent |
| Phase 4 — Product Detail | ✅ Complete | `38726ea` | 2-col layout, related products horizontal strip below |
| Phase 5 — QA & Polish | ✅ Complete | `2ada8ec` | Build 275/275 clean, checkout untouched, schemas preserved |
| Phase 6 — Merge & Deploy | ⏳ Ready | — | User: test locally, confirm checkout, then merge + deploy |

**Update this table as work progresses.**
