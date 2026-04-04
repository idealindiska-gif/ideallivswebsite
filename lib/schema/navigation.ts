/**
 * SiteNavigationElement Schema
 * Helps Google identify key navigation links for sitelinks
 */

export function siteNavigationSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const navItems = [
    { name: 'Shop', url: `${baseUrl}/shop` },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: 'About', url: `${baseUrl}/about` },
    { name: 'Contact', url: `${baseUrl}/contact` },
    { name: 'Delivery Information', url: `${baseUrl}/delivery-information` },
    { name: 'FAQ', url: `${baseUrl}/faq` },
  ];

  // SiteNavigationElement is emitted as individual nodes (not wrapped in ItemList)
  // This is the structure Google recognizes for sitelinks enhancement
  return navItems.map((item, index) => ({
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    position: index + 1,
    name: item.name,
    url: item.url,
  }));
}
