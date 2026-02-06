'use client';

/**
 * Unified Theme Provider
 *
 * Combines next-themes (light/dark mode) with color theme switching.
 * This provider manages both:
 * 1. Light/Dark mode via next-themes (attribute="class")
 * 2. Color theme presets (freshGrocery, marketFresh, etc.)
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import { ThemeProviderProps as NextThemesProviderProps } from 'next-themes';
import { themes, type ThemeName, type ThemeConfig } from '@/config/theme.config';
import { applyTheme, loadGoogleFonts, getThemeFonts } from './theme-utils';

// Color theme context for managing theme presets
interface ColorThemeContextType {
  colorTheme: ThemeConfig;
  colorThemeName: ThemeName;
  setColorTheme: (name: ThemeName) => void;
  customTheme: ThemeConfig | null;
  setCustomTheme: (theme: ThemeConfig) => void;
  resetColorTheme: () => void;
  availableThemes: typeof themes;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

interface ColorThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
}

/**
 * Color Theme Provider
 * Manages color theme presets separate from light/dark mode
 */
function ColorThemeProvider({
  children,
  defaultTheme = 'freshGrocery',
  storageKey = 'color-theme',
}: ColorThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [customTheme, setCustomTheme] = useState<ThemeConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.themeName && themes[data.themeName as ThemeName]) {
          setThemeName(data.themeName as ThemeName);
        }
        if (data.customTheme) {
          setCustomTheme(data.customTheme);
        }
      }
    } catch {
      // Invalid storage data, use default
    }
  }, [storageKey]);

  // Get current active theme
  const activeTheme = customTheme || themes[themeName] || themes.freshGrocery;

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return;

    // Apply theme CSS variables
    applyTheme(activeTheme);

    // Load Google Fonts if needed
    const fonts = getThemeFonts(activeTheme);
    if (fonts.length > 0) {
      loadGoogleFonts(fonts);
    }

    // Save to localStorage
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        themeName,
        customTheme,
      })
    );
  }, [activeTheme, themeName, customTheme, mounted, storageKey]);

  const handleSetTheme = (name: ThemeName) => {
    setThemeName(name);
    setCustomTheme(null);
  };

  const handleSetCustomTheme = (theme: ThemeConfig) => {
    setCustomTheme(theme);
  };

  const handleResetTheme = () => {
    setThemeName('freshGrocery');
    setCustomTheme(null);
    localStorage.removeItem(storageKey);
  };

  return (
    <ColorThemeContext.Provider
      value={{
        colorTheme: activeTheme,
        colorThemeName: themeName,
        setColorTheme: handleSetTheme,
        customTheme,
        setCustomTheme: handleSetCustomTheme,
        resetColorTheme: handleResetTheme,
        availableThemes: themes,
      }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
}

/**
 * Hook to access color theme context
 */
export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Combined hook for both light/dark mode and color themes
 */
export function useTheme() {
  const nextTheme = useNextTheme();
  const colorTheme = useContext(ColorThemeContext);

  // If color theme context is not available, return just next-themes
  if (colorTheme === undefined) {
    return {
      // Light/dark mode from next-themes
      theme: nextTheme.theme,
      setTheme: nextTheme.setTheme,
      resolvedTheme: nextTheme.resolvedTheme,
      systemTheme: nextTheme.systemTheme,
      themes: nextTheme.themes,
      // Color theme defaults (when used outside ColorThemeProvider)
      colorTheme: themes.freshGrocery,
      colorThemeName: 'freshGrocery' as ThemeName,
      setColorTheme: () => {},
      customTheme: null,
      setCustomTheme: () => {},
      resetColorTheme: () => {},
      availableThemes: themes,
    };
  }

  return {
    // Light/dark mode from next-themes
    theme: nextTheme.theme,
    setTheme: nextTheme.setTheme,
    resolvedTheme: nextTheme.resolvedTheme,
    systemTheme: nextTheme.systemTheme,
    themes: nextTheme.themes,
    // Color theme
    colorTheme: colorTheme.colorTheme,
    colorThemeName: colorTheme.colorThemeName,
    setColorTheme: colorTheme.setColorTheme,
    customTheme: colorTheme.customTheme,
    setCustomTheme: colorTheme.setCustomTheme,
    resetColorTheme: colorTheme.resetColorTheme,
    availableThemes: colorTheme.availableThemes,
  };
}

/**
 * Props for the unified ThemeProvider
 */
interface ThemeProviderProps extends Omit<NextThemesProviderProps, 'children'> {
  children: ReactNode;
  defaultColorTheme?: ThemeName;
  colorThemeStorageKey?: string;
}

/**
 * Unified Theme Provider
 *
 * Combines next-themes for light/dark mode with color theme switching.
 *
 * Usage:
 * ```tsx
 * <ThemeProvider
 *   attribute="class"
 *   defaultTheme="system"
 *   enableSystem
 *   defaultColorTheme="freshGrocery"
 * >
 *   {children}
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultColorTheme = 'freshGrocery',
  colorThemeStorageKey = 'color-theme',
  ...nextThemeProps
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...nextThemeProps}>
      <ColorThemeProvider
        defaultTheme={defaultColorTheme}
        storageKey={colorThemeStorageKey}
      >
        {children}
      </ColorThemeProvider>
    </NextThemesProvider>
  );
}
