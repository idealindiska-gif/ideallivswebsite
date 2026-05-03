"use client";

import { Globe, Clock, Store } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { useEffect, useState } from "react";
import { getStoreStatus, getFormattedStoreHours, type StoreStatus } from "@/lib/store-hours";

export function TopInfoBar() {
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    const updateStatus = () => setStoreStatus(getStoreStatus());
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#1f3f2c] text-white/80 py-[7px] text-[11px] font-medium">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">

        {/* Left: Shipping message */}
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-white/60 shrink-0" />
          <span>
            <span className="text-white font-semibold">We ship across Sweden &amp; Europe</span>
            <span className="hidden sm:inline text-white/60"> — delivered to your door by DHL</span>
          </span>
        </div>

        {/* Right: Store status + language */}
        <div className="flex items-center gap-4 shrink-0">
          {storeStatus && (
            <div className="hidden md:flex items-center gap-2 text-white/60">
              <Store className="h-3.5 w-3.5 shrink-0" />
              <span className={`inline-flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${storeStatus.isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-white/80">{storeStatus.statusText}</span>
              </span>
              <span className="hidden lg:inline text-white/40">·</span>
              <span className="hidden lg:inline-block overflow-hidden max-w-[220px] align-middle">
                <span className="flex whitespace-nowrap animate-marquee">
                  {[
                    getFormattedStoreHours().weekday,
                    '·',
                    getFormattedStoreHours().weekend,
                    '·',
                    getFormattedStoreHours().weekday,
                    '·',
                    getFormattedStoreHours().weekend,
                    '·',
                  ].map((item, i) => (
                    <span key={i} className={`px-2 ${item === '·' ? 'text-white/30' : 'text-white/60'}`}>{item}</span>
                  ))}
                </span>
              </span>
            </div>
          )}
          <LanguageSwitcher variant="topbar" />
        </div>

      </div>
    </div>
  );
}
