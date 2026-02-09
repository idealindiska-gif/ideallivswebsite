'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    quality?: number;
    fallbackSrc?: string;
}

/**
 * Optimized Image Component
 * 
 * Automatically converts images to WebP format using our custom API route
 * Falls back to original image if WebP conversion fails
 * 
 * Usage:
 * <OptimizedImage 
 *   src="https://crm.ideallivs.com/wp-content/uploads/2024/01/product.png"
 *   alt="Product"
 *   width={400}
 *   height={400}
 *   quality={80}
 * />
 */
export function OptimizedImage({
    src,
    quality = 80,
    fallbackSrc,
    alt,
    ...props
}: OptimizedImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Check if image is from WooCommerce (external)
    const isExternalImage = src.startsWith('http');

    // Generate WebP URL using our API route
    const getOptimizedSrc = (originalSrc: string, width?: number) => {
        if (!isExternalImage) {
            return originalSrc; // Local images don't need optimization
        }

        const params = new URLSearchParams({
            url: originalSrc,
            q: quality.toString(),
        });

        if (width) {
            params.set('w', width.toString());
        }

        return `/api/image?${params.toString()}`;
    };

    // Custom loader for next/image
    const imageLoader = ({ src, width }: { src: string; width: number }) => {
        if (!isExternalImage) {
            return src;
        }
        return getOptimizedSrc(src, width);
    };

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            // Fallback to original image if WebP conversion fails
            setImgSrc(fallbackSrc || src);
        }
    };

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            loader={isExternalImage ? imageLoader : undefined}
            onError={handleError}
            unoptimized={!isExternalImage} // Only optimize external images
        />
    );
}
