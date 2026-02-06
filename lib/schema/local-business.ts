/**
 * LocalBusiness Schema for Local SEO
 * Helps appear in "near me" searches and Google Maps
 */

export interface LocalBusinessSchemaProps {
    name: string
    description?: string
    url: string
    telephone: string
    email: string
    address: {
        street: string
        city: string
        region: string
        postalCode: string
        country: string
    }
    geo?: {
        latitude: number
        longitude: number
    }
    openingHours?: Array<{
        dayOfWeek: string[]
        opens: string
        closes: string
    }>
    priceRange?: string
    image?: string
    logo?: string
    servesCuisine?: string[]
    paymentAccepted?: string[]
    currenciesAccepted?: string
}

export function localBusinessSchema(props: LocalBusinessSchemaProps) {
    const {
        name,
        description,
        url,
        telephone,
        email,
        address,
        geo,
        openingHours,
        priceRange = '$$',
        image,
        logo,
        servesCuisine = ['Indian', 'Pakistani', 'South Asian'],
        paymentAccepted = ['Cash', 'Credit Card', 'Swish', 'Klarna'],
        currenciesAccepted = 'SEK',
    } = props

    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'GroceryStore',
        '@id': `${url}/#localbusiness`,
        name,
        url,
        telephone,
        email,
        priceRange,
        currenciesAccepted,
    }

    // Add description if provided
    if (description) {
        schema.description = description
    }

    // Add images
    if (image) {
        schema.image = image
    }
    if (logo) {
        schema.logo = logo
    }

    // Add address
    schema.address = {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country,
    }

    // Add geo coordinates if provided
    if (geo) {
        schema.geo = {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude,
        }
    }

    // Add opening hours if provided
    if (openingHours && openingHours.length > 0) {
        schema.openingHoursSpecification = openingHours.map((hours) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours.dayOfWeek,
            opens: hours.opens,
            closes: hours.closes,
        }))
    }

    // Add cuisine types
    if (servesCuisine && servesCuisine.length > 0) {
        schema.servesCuisine = servesCuisine
    }

    // Add payment methods
    if (paymentAccepted && paymentAccepted.length > 0) {
        schema.paymentAccepted = paymentAccepted
    }

    return schema
}

/**
 * Default LocalBusiness schema for Ideal Indiska LIVS
 */
export function idealLivsLocalBusinessSchema() {
    return localBusinessSchema({
        name: 'Ideal Indiska LIVS',
        description: "Stockholm's premier Indian and Pakistani grocery store offering authentic spices, Basmati rice, Halal meat, and fresh produce with fast delivery across Sweden.",
        url: 'https://www.ideallivs.com',
        telephone: '+46728494801',
        email: 'hello@ideallivs.com',
        address: {
            street: 'Bandhagsplan 4, Bandhagen Centrum',
            city: 'Bandhagen',
            region: 'Stockholm',
            postalCode: '12432',
            country: 'SE',
        },
        geo: {
            latitude: 59.2667,
            longitude: 18.0333,
        },
        openingHours: [
            {
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '20:00',
            },
            {
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: '10:00',
                closes: '18:00',
            },
        ],
        priceRange: '$$',
        image: 'https://crm.ideallivs.com/wp-content/uploads/2025/08/delivery-cover-post.png',
        logo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
        servesCuisine: ['Indian', 'Pakistani', 'South Asian', 'Halal'],
        paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Swish', 'Klarna'],
        currenciesAccepted: 'SEK',
    })
}
