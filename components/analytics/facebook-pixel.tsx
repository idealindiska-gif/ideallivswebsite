/**
 * Facebook Pixel Component
 * Only loads after the user grants cookie consent.
 */

'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';

const PIXEL_ID = '651966044655390';

function initPixel() {
  const w = window as any;
  if (w.fbq) return;

  // eslint-disable-next-line prefer-rest-params
  const n: any = (w.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode!.insertBefore(t, s);

  w.fbq('init', PIXEL_ID);
  w.fbq('track', 'PageView');
}

export function FacebookPixel() {
  const { status } = useCookieConsent();

  useEffect(() => {
    if (status !== 'accepted') return;

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(initPixel, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(initPixel, 2000);
      return () => clearTimeout(id);
    }
  }, [status]);

  if (status !== 'accepted') return null;

  return (
    <noscript>
      <Image
        height={1}
        width={1}
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
