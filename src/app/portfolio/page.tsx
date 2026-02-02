import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: "Portfolio | Showcase of Metalwork & Construction Excellence",
  description: "Explore our historical project portfolio, featuring industrial logistics hubs, residential masterpieces, custom interior solutions, and bespoke architectural metalwork in Nepal.",
  keywords: "metalwork portfolio, construction project showcase, industrial steel projects nepal, bespoke fabrication examples",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
