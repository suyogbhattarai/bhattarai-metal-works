import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import JsonLd from '@/components/JsonLd';
import { generateProductSchema } from '@/utils/seo-utils';

interface Props {
    params: { slug: string };
}

// Next.js dynamic metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/products/${slug}/`, { next: { revalidate: 3600 } });
        const product = await response.json();

        if (!product || product.detail === 'Not found.') {
            return {
                title: 'Product Not Found | Bhattarai Metal Works',
            };
        }

        return {
            title: product.name,
            description: product.meta_description || product.description?.substring(0, 160) || "",
            keywords: product.meta_keywords || "metal fabrication, custom metalwork, Nepal",
            openGraph: {
                title: product.name,
                description: product.meta_description || product.description?.substring(0, 160) || "",
                images: product.primary_image ? [product.primary_image] : [],
            },
        };
    } catch (error) {
        return {
            title: 'Products | Bhattarai Metal Works',
        };
    }
}

async function getProduct(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/products/${slug}/`, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    return response.json();
}

export default async function ProductPage({ params }: Props) {
    const product = await getProduct(params.slug);
    const jsonLd = product ? generateProductSchema(product) : null;

    return (
        <>
            {jsonLd && <JsonLd data={jsonLd} />}
            <ProductDetailClient />
        </>
    );
}
