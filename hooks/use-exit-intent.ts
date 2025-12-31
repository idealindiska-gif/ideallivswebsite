'use client';

import { useEffect, useState } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  threshold?: number; // Mouse Y position threshold for exit detection
  delayMs?: number; // Delay before showing (ms)
  cookieName?: string;
  cookieExpireDays?: number;
}

export function useExitIntent({
  enabled = true,
  threshold = 50,
  delayMs = 0,
  cookieName = 'exit_survey_shown',
  cookieExpireDays = 7,
}: UseExitIntentOptions = {}) {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Check if survey was already shown recently
    const lastShown = localStorage.getItem(cookieName);
    if (lastShown) {
      const daysSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < cookieExpireDays) {
        setHasBeenShown(true);
        return;
      }
    }

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect mouse leaving from top of viewport (closing tab/window)
      if (e.clientY <= threshold && !hasBeenShown) {
        timeoutId = setTimeout(() => {
          setShowExitIntent(true);
          setHasBeenShown(true);
          // Store timestamp
          localStorage.setItem(cookieName, Date.now().toString());
        }, delayMs);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, threshold, delayMs, hasBeenShown, cookieName, cookieExpireDays]);

  const dismiss = () => {
    setShowExitIntent(false);
  };

  return { showExitIntent, dismiss, hasBeenShown };
}
