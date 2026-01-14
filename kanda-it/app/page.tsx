import SuccessSection from "@/sections/success-section";
import ExcellenceSection from "@/sections/excellence-section";
import FaqSection from "@/sections/faq-section";
import FeaturesSection from "@/sections/features-section";
import HeroSection from "@/sections/hero-section";
import LoopBanner from "@/sections/loop-banner";
import OurTeamSection from "@/sections/our-team";
import PricingSection from "@/sections/pricing-section";
import StatsSection from "@/sections/stats-section";
import TestimonialSection from "@/sections/testimonial-section";
import ServiceSection from "@/sections/service-section";
import GrowthSection from "@/sections/growth-section";
import PartnerSection from "@/sections/partner-section";

export default function Page() {
    return (
        <main>
            <HeroSection />
            <LoopBanner />
            <GrowthSection/>
            <PartnerSection/>
            <ServiceSection />
            
            {/* <StatsSection />
            <FeaturesSection />
            
            <SuccessSection/>
            <FaqSection /> */}
        </main>
    );
}