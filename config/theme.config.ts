/**
 * Global Theme Configuration
 *
 * Centralized theme settings for colors, typography, spacing, and layout.
 * Uses golden ratio (1.618) for typography scale and modern e-commerce design principles.
 */

export interface ThemeConfig {
  name: string;
  colors: {
    // Primary brand colors
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string; // Main primary color
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    // Secondary/accent colors
    secondary: {
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
    };
    // Neutral colors (grays)
    neutral: {
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
    };
    // Semantic colors
    success: string;
    warning: string;
    error: string;
    info: string;
    // Background colors
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    // UI element colors
    border: string;
    input: string;
    ring: string;
    // Card colors
    card: string;
    cardForeground: string;
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
      heading: string[];
    };
    fontSize: {
      // Golden ratio scale (base 16px)
      xs: [string, { lineHeight: string; letterSpacing?: string }];
      sm: [string, { lineHeight: string; letterSpacing?: string }];
      base: [string, { lineHeight: string; letterSpacing?: string }];
      lg: [string, { lineHeight: string; letterSpacing?: string }];
      xl: [string, { lineHeight: string; letterSpacing?: string }];
      '2xl': [string, { lineHeight: string; letterSpacing?: string }];
      '3xl': [string, { lineHeight: string; letterSpacing?: string }];
      '4xl': [string, { lineHeight: string; letterSpacing?: string }];
      '5xl': [string, { lineHeight: string; letterSpacing?: string }];
      '6xl': [string, { lineHeight: string; letterSpacing?: string }];
      '7xl': [string, { lineHeight: string; letterSpacing?: string }];
      '8xl': [string, { lineHeight: string; letterSpacing?: string }];
      '9xl': [string, { lineHeight: string; letterSpacing?: string }];
    };
    fontWeight: {
      thin: string;
      extralight: string;
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
      black: string;
    };
  };
  spacing: {
    container: {
      maxWidth: string;
      padding: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
    };
    section: {
      paddingY: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  effects: {
    shadow: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    transition: {
      fast: string;
      base: string;
      slow: string;
    };
  };
}

/**
 * Default Modern E-commerce Theme
 *
 * Features:
 * - Vibrant primary color (Indigo) for trust and sophistication
 * - Warm accent color (Amber) for calls-to-action
 * - Golden ratio typography scale
 * - 1440px max container width
 * - Modern spacing and effects
 */
export const defaultTheme: ThemeConfig = {
  name: 'Modern E-commerce',

  colors: {
    // Primary: Indigo - Professional, trustworthy, modern
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Main
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },

    // Secondary: Amber - Warm, appetizing, attention-grabbing
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },

    // Neutral: Slate - Clean, modern gray scale
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

    // Semantic colors
    success: '#10b981', // Green
    warning: '#f59e0b', // Amber
    error: '#ef4444',   // Red
    info: '#3b82f6',    // Blue

    // Background colors (light mode)
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',

    // UI elements
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#6366f1',

    // Card
    card: '#ffffff',
    cardForeground: '#0f172a',
  },

  typography: {
    fontFamily: {
      sans: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
      serif: [
        'Merriweather',
        'Georgia',
        'Cambria',
        'Times New Roman',
        'serif',
      ],
      mono: [
        'JetBrains Mono',
        'Fira Code',
        'Consolas',
        'Monaco',
        'monospace',
      ],
      heading: [
        'Plus Jakarta Sans',
        'Inter',
        'system-ui',
        'sans-serif',
      ],
    },

    // Golden Ratio Typography Scale (φ = 1.618)
    // Base size: 16px (1rem)
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],     // 14px
      base: ['1rem', { lineHeight: '1.618', letterSpacing: '0' }],          // 16px (φ line-height)
      lg: ['1.125rem', { lineHeight: '1.618', letterSpacing: '0' }],        // 18px
      xl: ['1.25rem', { lineHeight: '1.618', letterSpacing: '-0.01em' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],   // 24px
      '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],  // 36px
      '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],     // 48px (base × φ²)
      '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 60px
      '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],   // 72px
      '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],       // 96px
      '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],       // 128px
    },

    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },

  spacing: {
    container: {
      maxWidth: '1440px', // Modern wide layout
      padding: {
        mobile: '1rem',    // 16px
        tablet: '2rem',    // 32px
        desktop: '3rem',   // 48px
      },
    },
    section: {
      paddingY: {
        mobile: '3rem',    // 48px
        tablet: '4rem',    // 64px
        desktop: '5rem',   // 80px
      },
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
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
};

/**
 * Restaurant/Food Theme Preset
 * Warm, appetizing colors
 */
export const restaurantTheme: ThemeConfig = {
  ...defaultTheme,
  name: 'Restaurant',

  colors: {
    ...defaultTheme.colors,
    // Primary: Warm Red/Orange for appetite appeal
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    // Secondary: Golden/Amber for luxury feel
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
  },
};

/**
 * Minimalist Theme Preset
 * Clean, monochromatic design
 */
export const minimalistTheme: ThemeConfig = {
  ...defaultTheme,
  name: 'Minimalist',

  colors: {
    ...defaultTheme.colors,
    // Primary: Pure Black
    primary: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    // Secondary: Subtle Gray
    secondary: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },
};

/**
 * Royal Heritage Theme - Luxury Restaurant Theme
 *
 * Features:
 * - Deep Burgundy primary for royalty and tradition
 * - Royal Gold secondary for luxury and premium feel
 * - Saffron Orange accent for warmth and appetite appeal
 * - Warm gray neutrals for elegance and readability
 * - Designed for Indo-Pakistani luxury restaurant experience
 */
export const royalHeritageTheme: ThemeConfig = {
  ...defaultTheme,
  name: 'Royal Heritage',

  colors: {
    ...defaultTheme.colors,

    // Primary: Deep Burgundy/Maroon - Represents royalty, tradition, premium quality
    primary: {
      50: '#fef2f2',   // Lightest - subtle backgrounds
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#9f1239',  // Main burgundy red
      600: '#881337',
      700: '#881337',  // Dark - text, borders
      800: '#7f1d1d',
      900: '#7f1d1d',
      950: '#450a0a',  // Darkest - deep accents
    },

    // Secondary: Royal Gold - Represents luxury, celebration, premium, tradition
    secondary: {
      50: '#fefce8',   // Light gold tint
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',  // Rich gold
      600: '#ca8a04',
      700: '#a16207',  // Deep gold
      800: '#854d0e',
      900: '#713f12',  // Bronze
      950: '#422006',
    },

    // Neutral: Warm Grays - Represents elegance, sophistication, readability
    neutral: {
      50: '#fafaf9',   // Off-white backgrounds
      100: '#f5f5f4',  // Subtle sections
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',  // Medium text
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',  // Primary text
      950: '#0c0a09',
    },

    // Semantic colors - adjusted for luxury theme
    success: '#059669', // Emerald green
    warning: '#f59e0b', // Amber
    error: '#dc2626',   // Red
    info: '#0891b2',    // Cyan

    // Background colors (light mode) - warm tones
    background: '#fafaf9',      // Warm off-white
    foreground: '#1c1917',      // Warm dark gray
    muted: '#f5f5f4',          // Subtle warm gray
    mutedForeground: '#57534e', // Warm medium gray

    // UI elements - gold accents
    border: '#e7e5e4',
    input: '#e7e5e4',
    ring: '#eab308',           // Gold ring for focus states

    // Card - subtle warm background
    card: '#ffffff',
    cardForeground: '#1c1917',
  },
};

/**
 * Fresh Grocery Theme - Default for this project
 *
 * Features:
 * - Forest green primary (#15803d) for fresh, natural appeal
 * - Vibrant red secondary (#ef4444) for sales badges and CTAs
 * - Clean, trustworthy, fresh produce aisle aesthetic
 * - Matches current globals.css color scheme
 */
export const freshGroceryTheme: ThemeConfig = {
  ...defaultTheme,
  name: 'Fresh Grocery',

  colors: {
    ...defaultTheme.colors,

    // Primary: Deep Forest Green - Fresh, natural, trustworthy
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#15803d', // Main - matches current --primary
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },

    // Secondary: Vibrant Red - Sales, urgency, appetite appeal
    secondary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main - matches current --secondary
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },

    // Neutral: Slate - Clean, modern
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

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Background: Light mint green
    background: '#f2fbf3',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',

    // UI elements
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#15803d',

    // Card: Soft mint green
    card: '#e1f7e4',
    cardForeground: '#0f172a',
  },
};

/**
 * Market Fresh Theme - Artisanal, farmers market aesthetic
 *
 * Features:
 * - Terracotta orange for warmth and handcrafted feel
 * - Olive green for organic, natural appeal
 * - Warm tones evoke farmers market experience
 */
export const marketFreshTheme: ThemeConfig = {
  ...defaultTheme,
  name: 'Market Fresh',

  colors: {
    ...defaultTheme.colors,

    // Primary: Terracotta - Warm, artisanal, handcrafted
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#b45309', // Main terracotta
      600: '#92400e',
      700: '#78350f',
      800: '#451a03',
      900: '#422006',
      950: '#1c0a00',
    },

    // Secondary: Olive Green - Organic, natural
    secondary: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#4d7c0f', // Main olive
      600: '#3f6212',
      700: '#365314',
      800: '#1a2e05',
      900: '#14532d',
      950: '#052e16',
    },

    // Neutral: Warm Stone
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },

    // Semantic colors
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2',

    // Background: Warm off-white
    background: '#faf9f7',
    foreground: '#1c1917',
    muted: '#f5f5f4',
    mutedForeground: '#57534e',

    // UI elements
    border: '#e7e5e4',
    input: '#e7e5e4',
    ring: '#b45309',

    // Card
    card: '#ffffff',
    cardForeground: '#1c1917',
  },

  typography: {
    ...defaultTheme.typography,
    fontFamily: {
      ...defaultTheme.typography.fontFamily,
      heading: ['DM Serif Display', 'Georgia', 'serif'],
    },
  },
};

/**
 * Premium Natural Theme - Upscale organic, whole foods aesthetic
 *
 * Features:
 * - Deep teal for sophistication and trust
 * - Soft gold for premium, luxury feel
 * - Elegant typography with Playfair Display
 */
export const premiumNaturalTheme: ThemeConfig = {
  ...defaultTheme,
  name: 'Premium Natural',

  colors: {
    ...defaultTheme.colors,

    // Primary: Deep Teal - Sophisticated, trustworthy, premium
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#0d9488', // Main teal
      600: '#0f766e',
      700: '#115e59',
      800: '#134e4a',
      900: '#042f2e',
      950: '#021a19',
    },

    // Secondary: Soft Gold - Premium, luxury
    secondary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#ca8a04', // Main gold
      600: '#a16207',
      700: '#854d0e',
      800: '#713f12',
      900: '#422006',
      950: '#1c0a00',
    },

    // Neutral: Warm Grays
    neutral: {
      50: '#faf9f7',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },

    // Semantic colors
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2',

    // Background: Warm off-white
    background: '#faf9f7',
    foreground: '#1c1917',
    muted: '#f5f5f4',
    mutedForeground: '#57534e',

    // UI elements
    border: '#e7e5e4',
    input: '#e7e5e4',
    ring: '#0d9488',

    // Card
    card: '#ffffff',
    cardForeground: '#1c1917',
  },

  typography: {
    ...defaultTheme.typography,
    fontFamily: {
      ...defaultTheme.typography.fontFamily,
      heading: ['Playfair Display', 'Georgia', 'serif'],
    },
  },
};

export const themes = {
  freshGrocery: freshGroceryTheme,
  marketFresh: marketFreshTheme,
  premiumNatural: premiumNaturalTheme,
  default: defaultTheme,
  restaurant: restaurantTheme,
  minimalist: minimalistTheme,
  royalHeritage: royalHeritageTheme,
};

export type ThemeName = keyof typeof themes;
