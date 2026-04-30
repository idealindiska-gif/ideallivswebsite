import { Link } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";

const BRANDS = [
  { name: "Shan", slug: "shan" },
  { name: "National", slug: "national" },
  { name: "Haldiram's", slug: "hr" },
  { name: "MTR", slug: "mtr" },
  { name: "Tilda", slug: "tilda" },
  { name: "TRS Foods", slug: "trs" },
  { name: "Aashirvaad", slug: "aashirvaad" },
  { name: "India Gate", slug: "ig" },
  { name: "MDH", slug: "mdh" },
  { name: "Guard", slug: "guard" },
  { name: "Ahmed", slug: "ahmed" },
  { name: "Bikano", slug: "bikano" },
];

export function BrandsStrip() {
  return (
    <section className="bg-background py-6">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-[18px] text-foreground tracking-[-0.3px]">
            Shop by Brand
          </h2>
          <Link
            href="/brands"
            className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            All Brands
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div
            className="flex items-center overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {BRANDS.map((brand, i) => (
              <Link
                key={brand.slug}
                href={`/brand/${brand.slug}`}
                className={
                  "flex-none flex items-center justify-center px-6 py-5 hover:bg-primary/5 transition-colors" +
                  (i < BRANDS.length - 1 ? " border-r border-border" : "")
                }
              >
                <span className="font-heading font-bold text-[15px] text-foreground/60 hover:text-foreground whitespace-nowrap transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
