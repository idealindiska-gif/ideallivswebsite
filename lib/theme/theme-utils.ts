/**
 * Theme Utilities
 *
 * Helper functions for working with themes, generating CSS variables,
 * and applying theme configurations.
 */

import type { ThemeConfig } from '@/config/theme.config';

/**
 * Convert hex color to HSL values (without hsl() wrapper)
 * Returns format: "h s% l%" for CSS variable use with hsl()
 */
export function hexToHSL(hex: string): string | null {
  const rgb = hexToRGB(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  // Return HSL values without the hsl() wrapper for CSS variable compatibility
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Convert theme config to Tailwind-compatible CSS custom properties
 * Outputs HSL values without wrapper for use with hsl(var(--color))
 */
export function themeToCSSVariables(theme: ThemeConfig): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Primary colors - full scale for Tailwind
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    if (hsl) {
      cssVars[`--primary-${key}`] = hsl;
    }
  });
  // Main primary color (500) as --primary for Tailwind DEFAULT
  const primaryHsl = hexToHSL(theme.colors.primary[500]);
  if (primaryHsl) {
    cssVars['--primary'] = primaryHsl;
  }

  // Secondary colors - full scale
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    if (hsl) {
      cssVars[`--secondary-${key}`] = hsl;
    }
  });
  // Main secondary color (500) as --secondary for Tailwind DEFAULT
  const secondaryHsl = hexToHSL(theme.colors.secondary[500]);
  if (secondaryHsl) {
    cssVars['--secondary'] = secondaryHsl;
  }

  // Neutral colors - full scale
  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    if (hsl) {
      cssVars[`--neutral-${key}`] = hsl;
    }
  });

  // Semantic colors
  const successHsl = hexToHSL(theme.colors.success);
  const warningHsl = hexToHSL(theme.colors.warning);
  const errorHsl = hexToHSL(theme.colors.error);
  const infoHsl = hexToHSL(theme.colors.info);

  if (successHsl) cssVars['--success'] = successHsl;
  if (warningHsl) cssVars['--warning'] = warningHsl;
  if (errorHsl) {
    cssVars['--error'] = errorHsl;
    cssVars['--destructive'] = errorHsl; // Alias for shadcn/ui
  }
  if (infoHsl) cssVars['--info'] = infoHsl;

  // Background colors - Tailwind compatible
  const bgHsl = hexToHSL(theme.colors.background);
  const fgHsl = hexToHSL(theme.colors.foreground);
  const mutedHsl = hexToHSL(theme.colors.muted);
  const mutedFgHsl = hexToHSL(theme.colors.mutedForeground);

  if (bgHsl) cssVars['--background'] = bgHsl;
  if (fgHsl) cssVars['--foreground'] = fgHsl;
  if (mutedHsl) cssVars['--muted'] = mutedHsl;
  if (mutedFgHsl) cssVars['--muted-foreground'] = mutedFgHsl;

  // Primary/Secondary foregrounds (light text for dark backgrounds)
  const primaryFgHsl = hexToHSL('#f8fafc'); // Light foreground
  const secondaryFgHsl = hexToHSL('#f8fafc');
  if (primaryFgHsl) cssVars['--primary-foreground'] = primaryFgHsl;
  if (secondaryFgHsl) cssVars['--secondary-foreground'] = secondaryFgHsl;
  if (primaryFgHsl) cssVars['--destructive-foreground'] = primaryFgHsl;

  // UI colors
  const borderHsl = hexToHSL(theme.colors.border);
  const inputHsl = hexToHSL(theme.colors.input);
  const ringHsl = hexToHSL(theme.colors.ring);

  if (borderHsl) cssVars['--border'] = borderHsl;
  if (inputHsl) cssVars['--input'] = inputHsl;
  if (ringHsl) cssVars['--ring'] = ringHsl;

  // Card colors
  const cardHsl = hexToHSL(theme.colors.card);
  const cardFgHsl = hexToHSL(theme.colors.cardForeground);

  if (cardHsl) cssVars['--card'] = cardHsl;
  if (cardFgHsl) cssVars['--card-foreground'] = cardFgHsl;

  // Popover (same as card by default)
  if (cardHsl) cssVars['--popover'] = cardHsl;
  if (cardFgHsl) cssVars['--popover-foreground'] = cardFgHsl;

  // Accent (use muted by default)
  if (mutedHsl) cssVars['--accent'] = mutedHsl;
  if (fgHsl) cssVars['--accent-foreground'] = fgHsl;

  // Typography
  cssVars['--font-sans'] = theme.typography.fontFamily.sans.join(', ');
  cssVars['--font-serif'] = theme.typography.fontFamily.serif.join(', ');
  cssVars['--font-mono'] = theme.typography.fontFamily.mono.join(', ');
  cssVars['--font-heading'] = theme.typography.fontFamily.heading.join(', ');

  // Font sizes
  Object.entries(theme.typography.fontSize).forEach(([key, [size, config]]) => {
    cssVars[`--font-size-${key}`] = size;
    cssVars[`--line-height-${key}`] = config.lineHeight;
    if (config.letterSpacing) {
      cssVars[`--letter-spacing-${key}`] = config.letterSpacing;
    }
  });

  // Spacing
  cssVars['--container-max-width'] = theme.spacing.container.maxWidth;
  cssVars['--container-padding-mobile'] = theme.spacing.container.padding.mobile;
  cssVars['--container-padding-tablet'] = theme.spacing.container.padding.tablet;
  cssVars['--container-padding-desktop'] = theme.spacing.container.padding.desktop;

  cssVars['--section-padding-y-mobile'] = theme.spacing.section.paddingY.mobile;
  cssVars['--section-padding-y-tablet'] = theme.spacing.section.paddingY.tablet;
  cssVars['--section-padding-y-desktop'] = theme.spacing.section.paddingY.desktop;

  // Border radius
  cssVars['--radius'] = theme.borderRadius.lg; // Base radius for shadcn/ui
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });

  // Effects
  Object.entries(theme.effects.shadow).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });

  Object.entries(theme.effects.transition).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value;
  });

  return cssVars;
}

/**
 * Generate CSS string from theme
 */
export function generateThemeCSS(theme: ThemeConfig, selector: string = ':root'): string {
  const cssVars = themeToCSSVariables(theme);

  const lines = Object.entries(cssVars).map(
    ([key, value]) => `  ${key}: ${value};`
  );

  return `${selector} {\n${lines.join('\n')}\n}`;
}

/**
 * Generate dark mode variants with Tailwind-compatible HSL values
 */
export function generateDarkModeCSS(theme: ThemeConfig): string {
  const darkColors: Record<string, string> = {};

  // Convert dark mode hex colors to HSL
  const bgHsl = hexToHSL(theme.colors.neutral[950]);
  const fgHsl = hexToHSL(theme.colors.neutral[50]);
  const mutedHsl = hexToHSL(theme.colors.neutral[900]);
  const mutedFgHsl = hexToHSL(theme.colors.neutral[400]);
  const borderHsl = hexToHSL(theme.colors.neutral[800]);
  const cardHsl = hexToHSL(theme.colors.neutral[900]);
  const cardFgHsl = hexToHSL(theme.colors.neutral[50]);

  // Primary adjustments for dark mode (brighter)
  const primaryDarkHsl = hexToHSL(theme.colors.primary[400]);
  const primaryFgDarkHsl = hexToHSL(theme.colors.neutral[950]);

  if (bgHsl) darkColors['--background'] = bgHsl;
  if (fgHsl) darkColors['--foreground'] = fgHsl;
  if (mutedHsl) darkColors['--muted'] = mutedHsl;
  if (mutedFgHsl) darkColors['--muted-foreground'] = mutedFgHsl;
  if (borderHsl) {
    darkColors['--border'] = borderHsl;
    darkColors['--input'] = borderHsl;
  }
  if (cardHsl) {
    darkColors['--card'] = cardHsl;
    darkColors['--popover'] = cardHsl;
    darkColors['--accent'] = cardHsl;
  }
  if (cardFgHsl) {
    darkColors['--card-foreground'] = cardFgHsl;
    darkColors['--popover-foreground'] = cardFgHsl;
    darkColors['--accent-foreground'] = cardFgHsl;
  }
  if (primaryDarkHsl) darkColors['--primary'] = primaryDarkHsl;
  if (primaryFgDarkHsl) darkColors['--primary-foreground'] = primaryFgDarkHsl;

  const lines = Object.entries(darkColors).map(
    ([key, value]) => `  ${key}: ${value};`
  );

  return `.dark {\n${lines.join('\n')}\n}`;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const cssVars = themeToCSSVariables(theme);

  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

/**
 * Load Google Fonts dynamically
 */
export function loadGoogleFonts(fontFamilies: string[]): void {
  if (typeof document === 'undefined') return;

  // Remove existing Google Fonts link
  const existingLink = document.getElementById('google-fonts');
  if (existingLink) {
    existingLink.remove();
  }

  // Create new link
  const fontParams = fontFamilies
    .map((font) => {
      // Convert font name to Google Fonts format
      const fontName = font.replace(/\s+/g, '+');
      return `family=${fontName}:wght@300;400;500;600;700;800;900`;
    })
    .join('&');

  const link = document.createElement('link');
  link.id = 'google-fonts';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Get all unique fonts from theme
 */
export function getThemeFonts(theme: ThemeConfig): string[] {
  const fonts = new Set<string>();

  Object.values(theme.typography.fontFamily).forEach((family) => {
    family.forEach((font) => {
      // Only add non-system fonts
      if (
        !font.includes('system') &&
        !font.includes('serif') &&
        !font.includes('sans-serif') &&
        !font.includes('monospace')
      ) {
        fonts.add(font);
      }
    });
  });

  return Array.from(fonts);
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert hex to RGB
 */
export function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHexColor(hex)) return null;

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate color contrast ratio (WCAG)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRGB(color1);
  const rgb2 = hexToRGB(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if color combination meets WCAG AA standard
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA for normal text
}

/**
 * Check if color combination meets WCAG AAA standard
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 7; // WCAG AAA for normal text
}

/**
 * Export theme as JSON
 */
export function exportTheme(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import theme from JSON
 */
export function importTheme(json: string): ThemeConfig | null {
  try {
    return JSON.parse(json) as ThemeConfig;
  } catch {
    return null;
  }
}
