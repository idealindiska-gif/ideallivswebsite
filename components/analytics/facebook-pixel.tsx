/**
 * Facebook Pixel Component
 * Integrates Meta/Facebook Pixel tracking with deferred loading
 */

'use client';

import Image from 'next/image';
import { useEffect } from 'react';

export function FacebookPixel() {
  const PIXEL_ID = '651966044655390';

  useEffect(() => {
    // Defer Facebook Pixel loading until after page is interactive
    const loadFacebookPixel = () => {
      if (typeof window !== 'undefined' && !(window as any).fbq) {
        !(function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(
          window,
          document,
          'script',
          'https://connect.facebook.net/en_US/fbevents.js'
        );
        (window as any).fbq('init', PIXEL_ID);
        (window as any).fbq('track', 'PageView');
      }
    };

    // Load after a short delay to prioritize critical resources
    const timer = setTimeout(loadFacebookPixel, 1000);
    return () => clearTimeout(timer);
  }, []);

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
