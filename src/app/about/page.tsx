import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: "About Us | Nepal's Leading Metal Fabrication Experts",
    description: "Learn about Bhattarai Metal Works' 15-year legacy of engineering excellence, skilled craftsmanship, and commitment to quality in metal fabrication and construction.",
    keywords: "about us, construction company history, nepal metalworks, engineering expertise nepal",
};

export default function AboutPage() {
    return <AboutClient />;
}
