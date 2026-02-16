'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Link } from '@/lib/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/woocommerce';
import { getDiscountPercentage, hasVariations } from '@/lib/woocommerce';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Plus, Check, Eye, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { cn, decodeHtmlEntities } from '@/lib/utils';
import { WishlistToggle } from '@/components/wishlist/wishlist-button';
import { CurrencyPrice, CurrencySalePrice } from '@/components/ui/currency-price';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const discount = getDiscountPercentage(product);
  const { addItem } = useCartStore();
  const [addState, setAddState] = useState<'idle' | 'adding' | 'added'>('idle');
  const t = useTranslations('productCard');

  // Check stock status
  const isOutOfStock = product.stock_status === 'outofstock';
  const isLowStock = product.stock_quantity !== null &&
    product.stock_quantity > 0 &&
    product.stock_quantity <= 5;
  const stockQuantity = product.stock_quantity;

  // Rating
  const hasRating = product.average_rating && parseFloat(product.average_rating) > 0;
  const rating = hasRating ? parseFloat(product.average_rating) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // For variable products, redirect to product page to select variation
    if (hasVariations(product)) {
      window.location.href = `/product/${product.slug}`;
      return;
    }

    if (addState !== 'idle') return;

    setAddState('adding');
    addItem(product);

    setTimeout(() => {
      setAddState('added');
      setTimeout(() => setAddState('idle'), 1500);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={cn("group relative h-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <article className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-xl bg-card border border-border/50",
          "transition-all duration-300 ease-out",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
        )}>

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted/10">
            {product.images && product.images.length > 0 && !imageError ? (
              <>
                <OptimizedImage
                  src={product.images[0].src}
                  alt={`${product.images[0].alt || product.name} | Ideal Indiska LIVS`}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500 ease-out",
                    isHovered && "scale-110"
                  )}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  loading={priority ? "eager" : "lazy"}
                  priority={priority}
                  quality={80}
                  onError={() => setImageError(true)}
                />
                {/* Hover Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                  "opacity-0 transition-opacity duration-300",
                  isHovered && "opacity-100"
                )} />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-muted/20">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShoppingBag className="h-6 w-6 opacity-50" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{t('noImage')}</span>
                </div>
              </div>
            )}

            {/* Wishlist Toggle - Top Right */}
            <div className={cn(
              "absolute top-2 right-2 z-10 transition-all duration-300",
              !isHovered && "opacity-0 translate-y-1",
              isHovered && "opacity-100 translate-y-0"
            )}>
              <WishlistToggle product={product} />
            </div>

            {/* Quick Actions - Bottom */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 p-3 z-10",
              "flex items-center justify-between gap-2",
              "translate-y-full opacity-0 transition-all duration-300",
              isHovered && "translate-y-0 opacity-100"
            )}>
              {/* Quick View Button */}
              <Button
                size="sm"
                variant="secondary"
                className="h-9 flex-1 bg-white/90 backdrop-blur-sm text-foreground hover:bg-white text-xs font-medium shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/product/${product.slug}`;
                }}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                {t('quickView')}
              </Button>

              {/* Add to Cart Button */}
              <Button
                size="sm"
                className={cn(
                  "h-9 flex-1 shadow-sm text-xs font-medium transition-all",
                  addState === 'added'
                    ? "bg-green-500 hover:bg-green-500 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addState === 'adding'}
              >
                <AnimatePresence mode="wait">
                  {addState === 'adding' ? (
                    <motion.span
                      key="adding"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </motion.span>
                  ) : addState === 'added' ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t('added')}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {hasVariations(product) ? t('options') : t('add')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Badges - Top Left */}
            <div className="absolute left-2 top-2 flex flex-col gap-1.5 z-10">
              {product.on_sale && discount > 0 && (
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary shadow-sm border-0 text-[10px] font-bold px-2 py-0.5">
                  -{discount}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-500 shadow-sm border-0 text-[10px] font-bold px-2 py-0.5">
                  <Star className="mr-0.5 h-2.5 w-2.5 fill-current" /> Featured
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="secondary" className="bg-neutral-800 text-white border-0 text-[10px] font-medium px-2 py-0.5">
                  {t('soldOut')}
                </Badge>
              )}
              {isLowStock && !isOutOfStock && (
                <Badge className="bg-orange-500 text-white hover:bg-orange-500 shadow-sm border-0 text-[10px] font-bold px-2 py-0.5">
                  <AlertCircle className="mr-0.5 h-2.5 w-2.5" /> {t('onlyLeft', { count: stockQuantity || 0 })}
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col p-3 sm:p-4">
            {/* Category & Rating Row */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              {product.categories && product.categories.length > 0 && (
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">
                  {decodeHtmlEntities(product.categories[0].name)}
                </p>
              )}
              {hasRating && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
                  {product.rating_count > 0 && (
                    <span className="text-[10px] text-muted-foreground">({product.rating_count})</span>
                  )}
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="mb-2 line-clamp-2 text-sm sm:text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {decodeHtmlEntities(product.name)}
            </h3>

            {/* Price Section */}
            <div className="mt-auto pt-2 border-t border-border/30">
              <div className="flex items-end justify-between gap-2">
                {/* Price */}
                <div className="flex flex-col">
                  {product.on_sale && product.sale_price && product.sale_price !== '' ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        <CurrencyPrice price={product.sale_price} />
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        <CurrencyPrice price={product.regular_price} />
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      {hasVariations(product) && product.price && parseFloat(String(product.price)) > 0 && (
                        <span className="text-[10px] text-muted-foreground">{t('from')}</span>
                      )}
                      <span className="text-lg sm:text-xl font-bold text-foreground">
                        <CurrencyPrice price={product.price} />
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Add Button (always visible) */}
                <Button
                  size="icon"
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 md:hidden transition-all",
                    addState === 'added'
                      ? "bg-green-500 hover:bg-green-500 text-white"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  )}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addState === 'adding'}
                >
                  <AnimatePresence mode="wait">
                    {addState === 'adding' ? (
                      <motion.span
                        key="adding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent block" />
                      </motion.span>
                    ) : addState === 'added' ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
