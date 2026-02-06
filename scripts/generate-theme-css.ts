/**
 * Theme CSS Generator Script
 *
 * Generates theme-variables.css from theme config.
 * Run with: npx tsx scripts/generate-theme-css.ts
 *
 * This script:
 * 1. Reads the theme configuration
 * 2. Converts colors to HSL format for CSS variables
 * 3. Generates both light and dark mode CSS
 * 4. Writes to app/theme-variables.css
 */

import * as fs from 'fs';
import * as path from 'path';

// Theme types (inline to avoid import issues)
interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

interface ThemeColors {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
}

interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  borderRadius: Record<string, string>;
  effects: {
    shadow: Record<string, string>;
    transition: Record<string, string>;
  };
  spacing: {
    container: {
      maxWidth: string;
      padding: { mobile: string; tablet: string; desktop: string };
    };
    section: {
      paddingY: { mobile: string; tablet: string; desktop: string };
    };
  };
}

// Hex to RGB conversion
function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Hex to HSL conversion
function hexToHSL(hex: string): string | null {
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

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Fresh Grocery Theme (default)
const freshGroceryTheme: ThemeConfig = {
  name: 'Fresh Grocery',
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#15803d',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    secondary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#f8f9fa',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#15803d',
    card: '#ffffff',
    cardForeground: '#0f172a',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  effects: {
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
    transition: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  spacing: {
    container: {
      maxWidth: '1440px',
      padding: { mobile: '1rem', tablet: '2rem', desktop: '3rem' },
    },
    section: {
      paddingY: { mobile: '3rem', tablet: '4rem', desktop: '5rem' },
    },
  },
};

// Generate CSS variables from theme
function generateThemeCSS(theme: ThemeConfig): string {
  const lines: string[] = [];

  lines.push('/**');
  lines.push(' * Theme Variables CSS');
  lines.push(' *');
  lines.push(` * Generated from ${theme.name} theme config.`);
  lines.push(' * These CSS variables power the theme system.');
  lines.push(' * Light mode (default) uses the freshGrocery theme.');
  lines.push(' * Dark mode overrides are included below.');
  lines.push(' *');
  lines.push(' * To regenerate: npm run theme:generate');
  lines.push(' */');
  lines.push('');
  lines.push(':root {');

  // Primary colors
  lines.push('  /* Primary Colors - Forest Green */');
  const primaryHsl = hexToHSL(theme.colors.primary[500]);
  if (primaryHsl) lines.push(`  --primary: ${primaryHsl};`);
  lines.push('  --primary-foreground: 210 40% 98%;');
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    if (hsl) lines.push(`  --primary-${key}: ${hsl};`);
  });
  lines.push('');

  // Secondary colors
  lines.push('  /* Secondary Colors - Vibrant Red */');
  const secondaryHsl = hexToHSL(theme.colors.secondary[500]);
  if (secondaryHsl) lines.push(`  --secondary: ${secondaryHsl};`);
  lines.push('  --secondary-foreground: 210 40% 98%;');
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    if (hsl) lines.push(`  --secondary-${key}: ${hsl};`);
  });
  lines.push('');

  // Neutral colors
  lines.push('  /* Neutral Colors - Slate */');
  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    const hsl = hexToHSL(value);
    if (hsl) lines.push(`  --neutral-${key}: ${hsl};`);
  });
  lines.push('');

  // Semantic colors
  lines.push('  /* Semantic Colors */');
  const successHsl = hexToHSL(theme.colors.success);
  const warningHsl = hexToHSL(theme.colors.warning);
  const errorHsl = hexToHSL(theme.colors.error);
  const infoHsl = hexToHSL(theme.colors.info);
  if (successHsl) lines.push(`  --success: ${successHsl};`);
  if (warningHsl) lines.push(`  --warning: ${warningHsl};`);
  if (errorHsl) {
    lines.push(`  --error: ${errorHsl};`);
    lines.push(`  --destructive: ${errorHsl};`);
  }
  lines.push('  --destructive-foreground: 210 40% 98%;');
  if (infoHsl) lines.push(`  --info: ${infoHsl};`);
  lines.push('');

  // Background & Foreground
  lines.push('  /* Background & Foreground */');
  const bgHsl = hexToHSL(theme.colors.background);
  const fgHsl = hexToHSL(theme.colors.foreground);
  if (bgHsl) lines.push(`  --background: ${bgHsl};`);
  if (fgHsl) lines.push(`  --foreground: ${fgHsl};`);
  lines.push('');

  // Muted
  lines.push('  /* Muted */');
  const mutedHsl = hexToHSL(theme.colors.muted);
  const mutedFgHsl = hexToHSL(theme.colors.mutedForeground);
  if (mutedHsl) lines.push(`  --muted: ${mutedHsl};`);
  if (mutedFgHsl) lines.push(`  --muted-foreground: ${mutedFgHsl};`);
  lines.push('');

  // UI Elements
  lines.push('  /* UI Elements */');
  const borderHsl = hexToHSL(theme.colors.border);
  const inputHsl = hexToHSL(theme.colors.input);
  const ringHsl = hexToHSL(theme.colors.ring);
  if (borderHsl) lines.push(`  --border: ${borderHsl};`);
  if (inputHsl) lines.push(`  --input: ${inputHsl};`);
  if (ringHsl) lines.push(`  --ring: ${ringHsl};`);
  lines.push('');

  // Card
  lines.push('  /* Card */');
  const cardHsl = hexToHSL(theme.colors.card);
  const cardFgHsl = hexToHSL(theme.colors.cardForeground);
  if (cardHsl) lines.push(`  --card: ${cardHsl};`);
  if (cardFgHsl) lines.push(`  --card-foreground: ${cardFgHsl};`);
  lines.push('');

  // Popover
  lines.push('  /* Popover */');
  if (cardHsl) lines.push(`  --popover: ${cardHsl};`);
  if (cardFgHsl) lines.push(`  --popover-foreground: ${cardFgHsl};`);
  lines.push('');

  // Accent
  lines.push('  /* Accent */');
  if (mutedHsl) lines.push(`  --accent: ${mutedHsl};`);
  if (fgHsl) lines.push(`  --accent-foreground: ${fgHsl};`);
  lines.push('');

  // Border Radius
  lines.push('  /* Border Radius */');
  lines.push(`  --radius: ${theme.borderRadius.lg};`);
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    lines.push(`  --radius-${key}: ${value};`);
  });
  lines.push('');

  // Shadows
  lines.push('  /* Shadows */');
  Object.entries(theme.effects.shadow).forEach(([key, value]) => {
    lines.push(`  --shadow-${key}: ${value};`);
  });
  lines.push('');

  // Transitions
  lines.push('  /* Transitions */');
  Object.entries(theme.effects.transition).forEach(([key, value]) => {
    lines.push(`  --transition-${key}: ${value};`);
  });
  lines.push('');

  // Spacing
  lines.push('  /* Spacing */');
  lines.push(`  --container-max-width: ${theme.spacing.container.maxWidth};`);
  lines.push(`  --container-padding-mobile: ${theme.spacing.container.padding.mobile};`);
  lines.push(`  --container-padding-tablet: ${theme.spacing.container.padding.tablet};`);
  lines.push(`  --container-padding-desktop: ${theme.spacing.container.padding.desktop};`);
  lines.push(`  --section-padding-y-mobile: ${theme.spacing.section.paddingY.mobile};`);
  lines.push(`  --section-padding-y-tablet: ${theme.spacing.section.paddingY.tablet};`);
  lines.push(`  --section-padding-y-desktop: ${theme.spacing.section.paddingY.desktop};`);

  lines.push('}');
  lines.push('');

  // Dark mode
  lines.push('/* Dark Mode Overrides */');
  lines.push('.dark {');

  const darkBgHsl = hexToHSL(theme.colors.neutral[950]);
  const darkFgHsl = hexToHSL(theme.colors.neutral[50]);
  const darkMutedHsl = hexToHSL(theme.colors.neutral[900]);
  const darkMutedFgHsl = hexToHSL(theme.colors.neutral[400]);
  const darkBorderHsl = hexToHSL(theme.colors.neutral[800]);
  const darkPrimaryHsl = hexToHSL(theme.colors.primary[400]);

  lines.push('  /* Background & Foreground */');
  if (darkBgHsl) lines.push(`  --background: ${darkBgHsl};`);
  if (darkFgHsl) lines.push(`  --foreground: ${darkFgHsl};`);
  lines.push('');

  lines.push('  /* Card */');
  if (darkBgHsl) lines.push(`  --card: ${darkBgHsl};`);
  if (darkFgHsl) lines.push(`  --card-foreground: ${darkFgHsl};`);
  lines.push('');

  lines.push('  /* Popover */');
  if (darkBgHsl) lines.push(`  --popover: ${darkBgHsl};`);
  if (darkFgHsl) lines.push(`  --popover-foreground: ${darkFgHsl};`);
  lines.push('');

  lines.push('  /* Primary - Brighter for dark mode */');
  if (darkPrimaryHsl) lines.push(`  --primary: ${darkPrimaryHsl};`);
  if (darkBgHsl) lines.push(`  --primary-foreground: ${darkBgHsl};`);
  lines.push('');

  lines.push('  /* Secondary */');
  const darkSecondaryHsl = hexToHSL(theme.colors.secondary[900]);
  if (darkSecondaryHsl) lines.push(`  --secondary: ${darkSecondaryHsl};`);
  if (darkFgHsl) lines.push(`  --secondary-foreground: ${darkFgHsl};`);
  lines.push('');

  lines.push('  /* Muted */');
  if (darkMutedHsl) lines.push(`  --muted: ${darkMutedHsl};`);
  if (darkMutedFgHsl) lines.push(`  --muted-foreground: ${darkMutedFgHsl};`);
  lines.push('');

  lines.push('  /* Accent */');
  if (darkMutedHsl) lines.push(`  --accent: ${darkMutedHsl};`);
  if (darkFgHsl) lines.push(`  --accent-foreground: ${darkFgHsl};`);
  lines.push('');

  lines.push('  /* Destructive */');
  if (darkSecondaryHsl) lines.push(`  --destructive: ${darkSecondaryHsl};`);
  if (darkFgHsl) lines.push(`  --destructive-foreground: ${darkFgHsl};`);
  lines.push('');

  lines.push('  /* UI Elements */');
  if (darkBorderHsl) {
    lines.push(`  --border: ${darkBorderHsl};`);
    lines.push(`  --input: ${darkBorderHsl};`);
  }
  if (darkPrimaryHsl) lines.push(`  --ring: ${darkPrimaryHsl};`);

  lines.push('}');

  return lines.join('\n');
}

// Main execution
function main() {
  const outputPath = path.join(process.cwd(), 'app', 'theme-variables.css');
  const css = generateThemeCSS(freshGroceryTheme);

  fs.writeFileSync(outputPath, css, 'utf-8');
  console.log(`✅ Theme CSS generated: ${outputPath}`);
  console.log(`   Theme: ${freshGroceryTheme.name}`);
}

main();
