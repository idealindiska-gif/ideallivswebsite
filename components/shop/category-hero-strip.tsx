import Image from "next/image";

interface CategoryHeroStripProps {
  name: string;
  description?: string;
  count?: number;
  image?: { src: string; alt?: string } | null;
}

export function CategoryHeroStrip({
  name,
  description,
  count,
  image,
}: CategoryHeroStripProps) {
  const cleanDesc = description
    ? description.replace(/<[^>]*>/g, "").trim()
    : null;

  return (
    <div className="relative bg-primary rounded-2xl overflow-hidden px-7 py-6 mb-5 flex items-center justify-between gap-6 min-h-[110px]">
      {/* Decorative circle */}
      <div className="pointer-events-none absolute right-[-30px] bottom-[-30px] w-44 h-44 rounded-full bg-white/5" />

      {/* Left: text */}
      <div className="relative z-10 min-w-0">
        <p className="text-white/50 text-[10px] font-semibold tracking-[0.16em] uppercase mb-1.5">
          Browse category
        </p>
        <h1 className="font-heading font-bold text-white text-[22px] tracking-[-0.3px] leading-tight mb-1">
          {name}
        </h1>
        {cleanDesc && (
          <p className="text-white/60 text-[12px] leading-relaxed max-w-md line-clamp-2">
            {cleanDesc}
          </p>
        )}
      </div>

      {/* Right: stats + optional image */}
      <div className="relative z-10 flex items-center gap-6 shrink-0">
        {count !== undefined && count > 0 && (
          <div className="hidden sm:block text-center">
            <p className="font-heading font-bold text-white text-[22px] leading-none tracking-[-0.3px]">
              {count}
            </p>
            <p className="text-white/50 text-[10px] font-medium mt-0.5">Products</p>
          </div>
        )}
        {image?.src && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/15">
            <Image
              src={image.src}
              alt={image.alt || name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
