type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  site_tagline?: string;
};

export const siteConfig: SiteConfig = {
  site_name: "Grocery Store",
  site_description: "Your trusted online grocery store - Fresh products, quality brands, delivered to your door.",
  site_domain: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  site_tagline: "Fresh. Quality. Convenience.",
};
