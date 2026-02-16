/**
 * Swedish meta titles and descriptions for static pages
 */

interface PageMeta {
  title: string;
  description: string;
}

export const swedishMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Indisk & Pakistansk Matbutik Stockholm | Köp Online | Ideal Livs',
    description: 'Köp indiska & pakistanska matvaror online i Stockholm. Basmatris, kryddor, halalkött & färska grönsaker. Snabb leverans i hela Sverige & Europa. Beställ nu!',
  },
  '/shop': {
    title: 'Köp Indiska & Pakistanska Matvaror Online | Ideal Livs Stockholm',
    description: 'Handla indiska & pakistanska matvaror online. 1500+ produkter: basmatris, kryddor, halalkött, frysta varor & mer. Snabb leverans Stockholm, Sverige & Europa.',
  },
  '/deals': {
    title: 'Erbjudanden & Rabatter på Indiska Matvaror | Ideal Livs Stockholm',
    description: 'Spara stort på indiska & pakistanska matvaror i Stockholm. Exklusiva erbjudanden på basmatris, kryddor, halalkött & mer. Beställ online med snabb leverans.',
  },
  '/about': {
    title: 'Om Ideal Indiska LIVS | Indisk Matbutik Stockholm',
    description: 'Ideal Indiska LIVS - Stockholms pålitliga källa för indiska & pakistanska matvaror sedan 2020. Premium basmatris, kryddor & halalkött i Bandhagen.',
  },
  '/contact': {
    title: 'Kontakta Ideal Indiska LIVS | Indisk Matbutik Stockholm',
    description: 'Besök Ideal Indiska LIVS i Bandhagen, Stockholm. Handla indiska & pakistanska matvaror med leverans och WhatsApp-support.',
  },
  '/delivery-information': {
    title: 'Leverans Stockholm & Sverige | Ideal Indiska Livs',
    description: 'Snabb leverans av indiska & pakistanska matvaror. Fri frakt i Stockholm vid beställning över 500 kr. Samma dag leverans i södra förorterna.',
  },
  '/delivery-goteborg-malmo': {
    title: 'Indisk Matleverans Göteborg & Malmö | Ideal Indiska Livs',
    description: 'Indiska matvaror levererade till din dörr i Göteborg, Malmö, Lund och Helsingborg. Snabb frakt med DHL till Skåne och Västsverige.',
  },
  '/europe-delivery': {
    title: 'Indisk Matleverans Europa | Ingen Tullavgift | Ideal Indiska',
    description: 'Beställ indiska & pakistanska matvaror i hela Europa utan tullavgift. Snabb DHL-frakt från Sverige till Tyskland, Nederländerna, Frankrike & mer.',
  },
  '/faq': {
    title: 'Vanliga Frågor | Ideal Indiska LIVS Stockholm',
    description: 'Hitta svar på vanliga frågor om beställning, leverans, betalning och retur hos Ideal Indiska LIVS Stockholm.',
  },
  '/brands': {
    title: 'Varumärken | Indiska & Pakistanska Märken | Ideal Livs',
    description: 'Utforska våra varumärken: MDH, Haldiram, Shan, National, TRS & fler. Autentiska indiska & pakistanska märken med snabb leverans i Sverige.',
  },
  '/blog': {
    title: 'Blogg | Recept & Nyheter | Ideal Indiska LIVS',
    description: 'Läs de senaste artiklarna, recepten och nyheterna från Ideal Indiska LIVS. Tips om autentisk indisk & pakistansk matlagning.',
  },
  '/cart': {
    title: 'Varukorg | Ideal Indiska LIVS',
    description: 'Din varukorg hos Ideal Indiska LIVS.',
  },
  '/checkout': {
    title: 'Kassa | Ideal Indiska LIVS',
    description: 'Slutför din beställning hos Ideal Indiska LIVS.',
  },
  '/wishlist': {
    title: 'Önskelista | Ideal Indiska LIVS',
    description: 'Din önskelista hos Ideal Indiska LIVS.',
  },
  '/privacy-policy': {
    title: 'Integritetspolicy | Ideal Indiska LIVS',
    description: 'Läs vår integritetspolicy. Ideal Indiska LIVS skyddar dina personuppgifter.',
  },
  '/terms-conditions': {
    title: 'Villkor | Ideal Indiska LIVS',
    description: 'Läs våra allmänna villkor för köp hos Ideal Indiska LIVS.',
  },
  '/refund-return': {
    title: 'Retur & Återbetalning | Ideal Indiska LIVS',
    description: 'Information om retur och återbetalning hos Ideal Indiska LIVS Stockholm.',
  },
};

/**
 * Get Swedish meta for a product page
 */
export function getSwedishProductMeta(productName: string, price?: string, categoryName?: string) {
  const priceStr = price ? ` | ${price} kr` : '';
  let title = `Köp ${productName} Online${priceStr} | Ideal Livs Stockholm`;

  if (title.length > 60) {
    title = `${productName}${priceStr} | Ideal Livs`;
  }
  if (title.length > 60) {
    title = `${productName} | Ideal Livs Stockholm`;
  }

  const description = `Handla ${productName} online hos Ideal Livs Stockholm.${categoryName ? ` ${categoryName}.` : ''} Snabb leverans i Sverige & Europa. Indiska & pakistanska matvaror.`;

  return { title, description: description.substring(0, 160) };
}

/**
 * Get Swedish meta for a category page
 */
export function getSwedishCategoryMeta(categoryName: string) {
  return {
    title: `${categoryName} - Köp Online | Ideal Livs Stockholm`,
    description: `Köp ${categoryName} online hos Ideal Livs Stockholm. Autentiska indiska & pakistanska matvaror. Snabb leverans i Sverige & Europa.`,
  };
}

/**
 * Get Swedish meta for a brand page
 */
export function getSwedishBrandMeta(brandName: string) {
  return {
    title: `${brandName} - Köp Online | Ideal Livs Stockholm`,
    description: `Handla ${brandName}-produkter online hos Ideal Livs Stockholm. Autentiska indiska & pakistanska matvaror med snabb leverans.`,
  };
}
