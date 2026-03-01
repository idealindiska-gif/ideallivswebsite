/**
 * Person Schema Generator
 * For blog authors and content contributors
 */

export interface PersonInput {
  id?: string;
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
  worksFor?: { name: string; id?: string };
  knowsAbout?: string[];
}

export function personSchema(config: PersonInput, baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': config.id || `${baseUrl}/#${config.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: config.name,
  };

  if (config.jobTitle) schema.jobTitle = config.jobTitle;
  if (config.description) schema.description = config.description;
  if (config.url) schema.url = config.url;
  if (config.image) schema.image = config.image;
  if (config.sameAs?.length) schema.sameAs = config.sameAs;
  if (config.knowsAbout?.length) schema.knowsAbout = config.knowsAbout;

  if (config.worksFor) {
    schema.worksFor = {
      '@type': 'Organization',
      '@id': config.worksFor.id || `${baseUrl}/#organization`,
      name: config.worksFor.name,
    };
  }

  return schema;
}

/**
 * Pre-configured "Ideal Chef" Person Schema
 *
 * Ideal Chef is the culinary content persona for Ideal Indiska LIVS —
 * a South Asian food expert writing authentic grocery guides, Ramadan
 * content, and cooking inspiration for the Swedish diaspora.
 *
 * URL structure:
 *   English: https://www.ideallivs.com/about
 *   Swedish: https://www.ideallivs.com/sv/about
 */
export function idealChefPersonSchema(baseUrl: string = 'https://www.ideallivs.com') {
  return personSchema(
    {
      id: `${baseUrl}/#ideal-chef`,
      name: 'Ideal Chef',
      jobTitle: 'Culinary Expert & Head of Content',
      description:
        'South Asian food specialist and content lead at Ideal Indiska LIVS in Stockholm. Expert in Indian and Pakistani cooking, Halal ingredients, Ramadan traditions, and authentic grocery guides for the Swedish diaspora.',
      url: `${baseUrl}/about`,
      image:
        'https://crm.ideallivs.com/wp-content/uploads/2025/07/ideal-indiska-livs-stockholm.jpg',
      sameAs: [
        'https://www.instagram.com/ideal_indiska_livs/',
        'https://www.facebook.com/Ideal.indiska.livs',
        'https://www.youtube.com/@Idealindiska',
        'https://www.linkedin.com/in/ideal-indiska-596215378/',
      ],
      worksFor: { name: 'Ideal Indiska LIVS' },
      knowsAbout: [
        'South Asian Cooking',
        'Indian Cuisine',
        'Pakistani Cuisine',
        'Halal Recipes',
        'Ramadan Cooking',
        'Indian Spices',
        'Basmati Rice Varieties',
        'Authentic Asian Groceries',
        'Swedish Diaspora Food Culture',
        'Grocery Shopping in Stockholm',
      ],
    },
    baseUrl,
  );
}
