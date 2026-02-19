import { Metadata } from 'next';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Calendar, User, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPostsPaginated, getAllCategories, getAllTags } from '@/lib/wordpress';
import { Post } from '@/lib/wordpress.d';
import { brandConfig } from '@/config/brand.config';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: `${t('title')} - ${brandConfig.businessName}`,
    description: t('subtitle'),
  };
}

// Helper function to format date with locale
function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to strip HTML tags from excerpt
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Helper function to get featured image URL
function getFeaturedImageUrl(post: any): string {
  // Check if post has _embedded data with featured media
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  // Fallback to placeholder
  return 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg';
}

// Helper function to get author name
function getAuthorName(post: any): string {
  if (post._embedded?.author?.[0]?.name) {
    return post._embedded.author[0].name;
  }
  return brandConfig.businessName;
}

// Helper function to get category names
function getCategoryNames(post: any): string[] {
  if (post._embedded?.['wp:term']?.[0]) {
    return post._embedded['wp:term'][0].map((cat: any) => cat.name);
  }
  return [];
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const response = await getPostsPaginated(1, 12);
    posts = response.data;
  } catch (err) {
    error = t('errorLoading');
    console.error('Error fetching blog posts:', err);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 blog-hero">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-b">
        <div className="container px-4 md:px-6 space-y-8">

          {/* Featured Static Post 1 (Ramadan) */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-background rounded-3xl overflow-hidden shadow-sm border p-4 md:p-6">
            <div className="relative w-full md:w-1/2 aspect-[16/9] rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src="https://crm.ideallivs.com/wp-content/uploads/2026/02/sahur-table.jpg"
                alt={t('ramadanTitle')}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {t('newGuide')}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="text-sm font-medium text-primary uppercase tracking-widest">{t('seasonalGuide')}</div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading">{t('ramadanTitle')}</h2>
              <p className="text-muted-foreground line-clamp-3">
                {t('ramadanDescription')}
              </p>
              <Button asChild className="rounded-full px-8">
                <Link href="/blog/ramadan-2026">{t('viewChecklist')}</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Indian Fika */}
            <div className="flex flex-col bg-background rounded-3xl overflow-hidden shadow-sm border p-4 md:p-6 h-full">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden flex-shrink-0 mb-6">
                <Image
                  src="/images/blog/indian-fika-hero.png"
                  alt={t('fikaTitle')}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t('popular')}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="text-sm font-medium text-primary uppercase tracking-widest">{t('cultureLifestyle')}</div>
                <h2 className="text-2xl font-bold font-heading line-clamp-2">{t('fikaTitle')}</h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {t('fikaDescription')}
                </p>
                <Button asChild variant="outline" className="rounded-full w-full mt-auto">
                  <Link href="/blog/the-indian-fika">{t('readGuide')}</Link>
                </Button>
              </div>
            </div>

            {/* Ramadan Calendar */}
            <div className="flex flex-col bg-background rounded-3xl overflow-hidden shadow-sm border p-4 md:p-6 h-full">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden flex-shrink-0 mb-6">
                <Image
                  src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ramadan-Calendar-A4-ideal.jpg"
                  alt={t('calendarTitle')}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t('newGuide')}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="text-sm font-medium text-emerald-600 uppercase tracking-widest">{t('seasonalGuide')}</div>
                <h2 className="text-2xl font-bold font-heading line-clamp-2">{t('calendarTitle')}</h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {t('calendarDescription')}
                </p>
                <Button asChild variant="outline" className="rounded-full w-full mt-auto border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                  <Link href="/blog/ramadan-kalender-2026">{t('viewCalendar')}</Link>
                </Button>
              </div>
            </div>

            {/* No Customs Guide */}
            <div className="flex flex-col bg-background rounded-3xl overflow-hidden shadow-sm border p-4 md:p-6 h-full">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden flex-shrink-0 mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt={t('noCustomsTitle')}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t('euGuide')}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="text-sm font-medium text-primary uppercase tracking-widest">{t('shippingLogistics')}</div>
                <h2 className="text-2xl font-bold font-heading line-clamp-2">{t('noCustomsTitle')}</h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {t('noCustomsDescription')}
                </p>
                <Button asChild variant="outline" className="rounded-full w-full mt-auto text-primary">
                  <Link href="/blog/no-customs-indian-grocery-europe">{t('readGuide')}</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('noPostsFound')}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => {
                const imageUrl = getFeaturedImageUrl(post);
                const authorName = getAuthorName(post);
                const categories = getCategoryNames(post);
                const excerpt = stripHtml(post.excerpt.rendered);

                return (
                  <article
                    key={post.id}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
                  >
                    {/* Featured Image */}
                    <Link href={`/blog/${post.slug}`} className="block relative h-56 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={post.title.rendered}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {categories.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {categories.slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.date, locale)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{authorName}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title.rendered}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {excerpt}
                      </p>

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                      >
                        {t('readMore')}
                        <svg
                          className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
