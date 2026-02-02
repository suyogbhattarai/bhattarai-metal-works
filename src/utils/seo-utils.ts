/**
 * SEO metadata and schema utilities.
 * These are plain JS objects suitable for use in Server Components.
 */

export function generateLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Bhattarai Metal Works",
        "image": "https://bhattaraimetalworks.com/logo.png",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kathmandu",
            "addressRegion": "Bagmati",
            "addressCountry": "NP"
        },
        "description": "Premium metal fabrication, construction services, and custom metal furniture in Nepal.",
        "url": "https://bhattaraimetalworks.com",
        "telephone": "+9779841254683"
    };
}

export function generateProductSchema(product: any) {
    if (!product) return null;
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.primary_image,
        "description": product.description,
        "sku": product.id?.toString() || "N/A",
        "brand": {
            "@type": "Brand",
            "name": "Bhattarai Metal Works"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://bhattaraimetalworks.com/products/${product.slug}`,
            "priceCurrency": "NPR",
            "price": product.base_price,
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.average_rating || "5",
            "reviewCount": product.review_count || "1"
        }
    };
}
