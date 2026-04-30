import { Star } from "lucide-react";

const REVIEWS = [
  {
    text: "Best Indian grocery store in Stockholm! The Basmati rice and spice selection is incredible. Fast delivery and everything arrived perfectly packed.",
    author: "Priya S.",
    date: "March 2026",
    initials: "PS",
    color: "#2d5a3d",
  },
  {
    text: "I've been shopping here for 3 years. The range of Pakistani brands like Shan and National Foods is unmatched. Delivery to Gothenburg was super fast.",
    author: "Ahmed K.",
    date: "February 2026",
    initials: "AK",
    color: "#c9a227",
  },
  {
    text: "Ordered for the first time from Denmark — no customs hassle, arrived in 3 days. Great prices and genuine products. Will definitely order again!",
    author: "Fatima L.",
    date: "April 2026",
    initials: "FL",
    color: "#1a3d2a",
  },
];

export function ReviewsSection() {
  return (
    <section className="bg-background py-8">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-heading font-bold text-[18px] text-foreground tracking-[-0.3px]">
            What Our Customers Say
          </h2>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
              />
            ))}
            <span className="text-[12px] text-muted-foreground ml-1 font-medium">
              4.9 on Google
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((review) => (
            <div
              key={review.author}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                  />
                ))}
              </div>
              <p className="text-[13px] text-muted-foreground leading-[1.65] italic mb-5">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                  style={{ background: review.color }}
                >
                  {review.initials}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">
                    {review.author}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
