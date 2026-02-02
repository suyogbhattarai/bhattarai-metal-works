import { Metadata } from 'next';
import HomeClient from './HomeClient';
import JsonLd from '@/components/JsonLd';
import { generateLocalBusinessSchema } from '@/utils/seo-utils';

export const metadata: Metadata = {
    title: "Metal Fabrication & Construction Excellence in Nepal",
    description: "Nepal's leading metal fabrication and construction experts. Specialized in structural engineering, metal furniture, and custom interior solutions.",
    keywords: "metal fabrication nepal, construction nepal, metal furniture, steel structure, design studio",
};

export default function HomePage() {
    const localBusinessSchema = generateLocalBusinessSchema();

    return (
        <>
            <JsonLd data={localBusinessSchema} />
            <HomeClient />
        </>
    );
}
