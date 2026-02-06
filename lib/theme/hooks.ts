'use client';

/**
 * Theme Hooks
 *
 * Custom React hooks for accessing theme values in components.
 */

import { useMemo } from 'react';
import { useColorTheme } from './theme-provider';
import type { ThemeConfig } from '@/config/theme.config';

/**
 * Hook to access current theme colors
 *
 * @returns Object containing all theme color values
 *
 * @example
 * ```tsx
 * const { primary, secondary, background } = useThemeColors();
 * return <div style={{ color: primary[500] }}>Hello</div>;
 * ```
 */
export function useThemeColors() {
  const { colorTheme } = useColorTheme();

  return useMemo(
    () => ({
      primary: colorTheme.colors.primary,
      secondary: colorTheme.colors.secondary,
      neutral: colorTheme.colors.neutral,
      success: colorTheme.colors.success,
      warning: colorTheme.colors.warning,
      error: colorTheme.colors.error,
      info: colorTheme.colors.info,
      background: colorTheme.colors.background,
      foreground: colorTheme.colors.foreground,
      muted: colorTheme.colors.muted,
      mutedForeground: colorTheme.colors.mutedForeground,
      border: colorTheme.colors.border,
      input: colorTheme.colors.input,
      ring: colorTheme.colors.ring,
      card: colorTheme.colors.card,
      cardForeground: colorTheme.colors.cardForeground,
    }),
    [colorTheme]
  );
}

/**
 * Hook to access current theme typography settings
 *
 * @returns Object containing font families and sizes
 *
 * @example
 * ```tsx
 * const { fontFamily, fontSize } = useThemeTypography();
 * return <h1 style={{ fontFamily: fontFamily.heading.join(', ') }}>Title</h1>;
 * ```
 */
export function useThemeTypography() {
  const { colorTheme } = useColorTheme();

  return useMemo(
    () => ({
      fontFamily: colorTheme.typography.fontFamily,
      fontSize: colorTheme.typography.fontSize,
      fontWeight: colorTheme.typography.fontWeight,
    }),
    [colorTheme]
  );
}

/**
 * Hook to access current theme spacing values
 *
 * @returns Object containing container and section spacing
 */
export function useThemeSpacing() {
  const { colorTheme } = useColorTheme();

  return useMemo(
    () => ({
      container: colorTheme.spacing.container,
      section: colorTheme.spacing.section,
    }),
    [colorTheme]
  );
}

/**
 * Hook to access current theme effects (shadows, transitions)
 *
 * @returns Object containing shadow and transition values
 */
export function useThemeEffects() {
  const { colorTheme } = useColorTheme();

  return useMemo(
    () => ({
      shadow: colorTheme.effects.shadow,
      transition: colorTheme.effects.transition,
    }),
    [colorTheme]
  );
}

/**
 * Hook to access current theme border radius values
 *
 * @returns Object containing border radius values
 */
export function useThemeBorderRadius() {
  const { colorTheme } = useColorTheme();

  return useMemo(() => colorTheme.borderRadius, [colorTheme]);
}

/**
 * Hook to get the full theme config
 *
 * @returns The complete ThemeConfig object
 */
export function useThemeConfig(): ThemeConfig {
  const { colorTheme } = useColorTheme();
  return colorTheme;
}
