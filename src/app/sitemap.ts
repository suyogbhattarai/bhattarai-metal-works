import { MetadataRoute } from 'next'

// We would ideally fetch all product slugs from the backend here
// For now, we list static routes and common products
// In a real production setup, we'd use fetch() to get all dynamic slugs

async function getProductSlugs() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/`);
        const data = await response.json();
        return data.results?.map((p: any) => p.slug) || [];
    } catch (e) {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://bhattaraimetalworks.com'

    const staticRoutes = [
        '',
        '/about',
        '/services',
        '/products',
        '/portfolio',
        '/getquote',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const slugs = await getProductSlugs();
    const productRoutes = slugs.map((slug: string) => ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    return [...staticRoutes, ...productRoutes]
}
