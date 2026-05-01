"use client";

import { Link } from "@/lib/navigation";
import { ArrowRight, ShoppingBag, Percent } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <section
      aria-label="Homepage hero"
      className="w-full bg-background px-4 sm:px-6 lg:px-8 pt-5 pb-4 max-w-[1380px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">

        {/* ── Main card ─────────────────────────────────── */}
        <div className="relative bg-primary rounded-2xl overflow-hidden min-h-[220px] lg:min-h-[260px] flex flex-col justify-end p-7 lg:p-10">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute right-[80px] top-[-60px] w-40 h-40 rounded-full bg-white/4" />

          {/* Content */}
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white/90 text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
              Stockholm&apos;s favourite Indian &amp; Pakistani store
            </span>

            <h1 className="font-heading font-bold text-white text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.1] tracking-[-0.5px] mb-3">
              {t("heroHeading1")}{" "}
              <span className="text-white/65">{t("heroHeading2")}</span>
            </h1>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-5">
              1,500+ authentic products — spices, rice, lentils &amp; more.
              Delivered across Sweden &amp; Europe by DHL.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-[13px] rounded-lg px-5 py-2.5 hover:bg-white/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                {tc("shopNow")}
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 border border-white/30 text-white/85 font-medium text-[13px] rounded-lg px-5 py-2.5 hover:bg-white/10 transition-colors"
              >
                View Deals
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Side cards ────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">

          {/* Card 1 — New Arrivals */}
          <Link
            href="/shop?sort=new"
            className="group relative bg-[#1a3d2a] rounded-2xl overflow-hidden flex flex-col justify-end p-5 min-h-[120px] lg:min-h-0 lg:flex-1"
          >
            <div className="pointer-events-none absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white/5" />
            <span className="text-white/50 text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5">
              Just landed
            </span>
            <p className="font-heading font-bold text-white text-[16px] leading-[1.2] tracking-[-0.2px]">
              New Arrivals
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-white/60 text-[11px] font-semibold group-hover:text-white/90 transition-colors">
              Shop now <ArrowRight className="h-3 w-3" />
            </span>
          </Link>

          {/* Card 2 — Weekly Deals */}
          <Link
            href="/deals"
            className="group relative rounded-2xl overflow-hidden flex flex-col justify-end p-5 min-h-[120px] lg:min-h-0 lg:flex-1"
            style={{ background: "hsl(var(--gold))" }}
          >
            <div className="pointer-events-none absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white/15" />
            <span className="text-white/60 text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5">
              This week
            </span>
            <p className="font-heading font-bold text-white text-[16px] leading-[1.2] tracking-[-0.2px]">
              Weekly Deals &amp; Offers
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-white/70 text-[11px] font-semibold group-hover:text-white transition-colors">
              <Percent className="h-3 w-3" />
              See all deals
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}
