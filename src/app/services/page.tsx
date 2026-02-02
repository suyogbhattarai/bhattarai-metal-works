import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
    title: "Our Services | Specialized Metal Fabrication & Construction",
    description: "Browse our core services: Industrial Structural Engineering, Precision Metal Fabrication, Designer Metal Furniture (BBQ, Chairs, Tables), and our 3D Engineering Design Studio.",
    keywords: "metal fabrication services, structural steel construction nepal, custom metal furniture, bbq machine fabrication, engineering design studio",
};

export default function ServicesPage() {
    return <ServicesClient />;
}
