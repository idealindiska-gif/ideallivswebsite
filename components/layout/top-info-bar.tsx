"use client";

import { Store } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { useEffect, useState } from "react";
import { getStoreStatus, type StoreStatus } from "@/lib/store-hours";

const ANNOUNCE_ITEMS = [
  {
    bold: "We ship across Sweden & Europe",
    rest: "— delivered to your door by DHL",
  },
  {
    bold: "Södertälje (postcodes 151–152)",
    rest: "— free delivery on orders 1,000 SEK+",
  },
  {
    bold: "Stockholm same-day delivery",
    rest: "— order before 16:00 · min. 300 SEK",
  },
  {
    bold: "Järfälla, Kungsängen & Upplands-Bro",
    rest: "— free weekend delivery on orders 500 SEK+",
  },
];

const SEPARATOR = (
  <span className="text-white/25 px-4 select-none" aria-hidden>·</span>
);

export function TopInfoBar() {
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    const updateStatus = () => setStoreStatus(getStoreStatus());
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const items = [...ANNOUNCE_ITEMS, ...ANNOUNCE_ITEMS];

  return (
    <div className="w-full bg-[#1f3f2c] text-white/80 py-[7px] text-[11px] font-medium">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center gap-3">

        {/* Scrolling announcement marquee */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex whitespace-nowrap animate-announce">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center shrink-0">
                {SEPARATOR}
                <span className="text-white font-semibold">{item.bold}</span>
                <span className="text-white/60 ml-1 hidden sm:inline">{item.rest}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Store status + language switcher */}
        <div className="flex items-center gap-4 shrink-0">
          {storeStatus && (
            <div className="hidden md:flex items-center gap-1.5 text-white/60">
              <Store className="h-3.5 w-3.5 shrink-0" />
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${storeStatus.isOpen ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-white/80">{storeStatus.statusText}</span>
            </div>
          )}
          <LanguageSwitcher variant="topbar" />
        </div>

      </div>
    </div>
  );
}
