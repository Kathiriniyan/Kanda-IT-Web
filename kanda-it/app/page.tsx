import FaqSection from "@/sections/faq-section";
import FeaturesSection from "@/sections/features-section";
import HeroSection from "@/sections/hero-section";
import LoopBanner from "@/sections/loop-banner";
import OurTeamSection from "@/sections/our-team";
import PricingSection from "@/sections/pricing-section";
import StatsSection from "@/sections/stats-section";
import TestimonialSection from "@/sections/testimonial-section";

export default function Page() {
    return (
        <main>
            <HeroSection />
            <LoopBanner/>
            <StatsSection />
            <FeaturesSection />
            <FaqSection />
            <OurTeamSection />
            <PricingSection />
            <TestimonialSection />
        </main>
    );
}