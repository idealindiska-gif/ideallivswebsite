const SCHEDULE = [
  { day: "Mon", hours: "10:00–20:00" },
  { day: "Tue", hours: "10:00–20:00" },
  { day: "Wed", hours: "10:00–20:00" },
  { day: "Thu", hours: "10:00–20:00" },
  { day: "Fri", hours: "10:00–20:00" },
  { day: "Sat", hours: "11:00–19:00" },
  { day: "Sun", hours: "11:00–19:00" },
];

// Duplicate for seamless loop
const items = [...SCHEDULE, ...SCHEDULE];

export function TimingsMarquee() {
  return (
    <div className="w-full bg-[#1f3f2c] py-[7px] text-[11px] font-medium overflow-hidden border-b border-white/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((entry, i) => (
          <span key={i} className="flex items-center">
            <span className="text-white font-semibold px-2">{entry.day}</span>
            <span className="text-white/70">{entry.hours}</span>
            <span className="text-white/30 px-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
