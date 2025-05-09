import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoryFilters from "@/components/home/CategoryFilters";
import FeaturedContent from "@/components/home/FeaturedContent";
import AdBanner from "@/components/home/AdBanner";
import TrendingContent from "@/components/home/TrendingContent";
import PremiumPromo from "@/components/home/PremiumPromo";
import NewContent from "@/components/home/NewContent";
import FreeMembershipPromo from "@/components/home/FreeMembershipPromo";
import PricingPlans from "@/components/pricing/PricingPlans";
import FAQSection from "@/components/faq/FAQSection";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>MediaPremium - Premium Video & Photo Sharing</title>
        <meta name="description" content="Discover thousands of high-quality videos and photos curated by professionals. Access premium content with our subscription plans." />
      </Helmet>
      
      <Header />
      
      <main>
        <HeroSection />
        <CategoryFilters />
        <FeaturedContent />
        <AdBanner />
        <TrendingContent />
        <PremiumPromo />
        <NewContent />
        <AdBanner />
        <FreeMembershipPromo />
        <PricingPlans />
        <FAQSection />
      </main>
      
      <Footer />
    </>
  );
}
