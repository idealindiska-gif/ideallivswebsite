import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { locales, defaultLocale } from '../i18n.config';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Try the standard requestLocale (from [locale] segment)
  let locale = await requestLocale;

  // 2. Fallback: check NEXT_LOCALE cookie (set by language switcher & middleware)
  if (!locale || !locales.includes(locale as any)) {
    try {
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
      if (cookieLocale && locales.includes(cookieLocale as any)) {
        locale = cookieLocale;
      }
    } catch {
      // cookies() may not be available in all contexts
    }
  }

  // 3. Fallback: detect from middleware header or URL path (covers root layout)
  if (!locale || !locales.includes(locale as any)) {
    try {
      const headersList = await headers();
      // Check explicit locale header set by middleware
      const headerLocale = headersList.get('x-next-intl-locale');
      if (headerLocale && locales.includes(headerLocale as any)) {
        locale = headerLocale;
      } else {
        // Last resort: detect from URL path
        const url = headersList.get('x-next-url') || headersList.get('x-invoke-path') || '';
        if (url.startsWith('/sv')) {
          locale = 'sv';
        }
      }
    } catch {
      // headers() may not be available in all contexts
    }
  }

  // 4. Final fallback
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
