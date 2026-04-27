'use client';

import { useCookieConsent } from '@/hooks/use-cookie-consent';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const { status, isLoaded, accept, reject } = useCookieConsent();

  // Avoid SSR flash — only render once localStorage has been read
  if (!isLoaded || status !== 'pending') return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="bg-card border border-border rounded-xl shadow-2xl px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Cookie className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug">
                We use cookies to improve your experience
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Analytics and marketing cookies help us understand how visitors use our site.
                You can accept all or continue with essential cookies only.{' '}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Privacy policy
                </Link>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={reject}
              className="text-xs px-3.5 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors whitespace-nowrap"
            >
              Essential only
            </button>
            <button
              onClick={accept}
              className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all font-medium whitespace-nowrap"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
