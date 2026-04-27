'use client';

import { useState, useEffect, useCallback } from 'react';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

const CONSENT_KEY = 'ideal-cookie-consent';
const CONSENT_VERSION = '1';
const CONSENT_EVENT = 'cookie-consent-update';

function pushGtagConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w.gtag) {
    w.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    });
  }
  if (w.dataLayer) {
    w.dataLayer.push({ event: 'cookie_consent_update', consent: granted ? 'accepted' : 'rejected' });
  }
}

function readStoredConsent(): ConsentStatus {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return 'pending';
    const { version, status } = JSON.parse(raw);
    if (version === CONSENT_VERSION && (status === 'accepted' || status === 'rejected')) {
      return status;
    }
  } catch {}
  return 'pending';
}

function writeConsent(status: 'accepted' | 'rejected') {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: CONSENT_VERSION, status }));
  } catch {}
}

export function useCookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    setStatus(stored);
    setIsLoaded(true);
    if (stored !== 'pending') {
      pushGtagConsent(stored === 'accepted');
    }

    // Sync across multiple mounted components (e.g. banner + fb pixel)
    const onConsent = (e: Event) => {
      setStatus((e as CustomEvent<{ status: ConsentStatus }>).detail.status);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  const accept = useCallback(() => {
    writeConsent('accepted');
    pushGtagConsent(true);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { status: 'accepted' } }));
  }, []);

  const reject = useCallback(() => {
    writeConsent('rejected');
    pushGtagConsent(false);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { status: 'rejected' } }));
  }, []);

  return { status, isLoaded, accept, reject };
}
