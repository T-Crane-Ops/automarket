"use client";

import { useState } from 'react';
import { VideoModal } from '@/components/VideoModal';
import { HeroSection } from '@/components/landingpage/hero';
import { NavBar } from '@/components/landingpage/navbar';
import { CTASection } from '@/components/landingpage/cta';
import { Pricing } from '@/components/landingpage/pricing';
import { TestimonialsSection } from '@/components/landingpage/testimonials';
import { Footer } from '@/components/landingpage/footer';
import { BentoGridSection } from "@/components/landingpage/bentogrid";
import { FeatureGridSection } from "@/components/landingpage/feature";
import TimelineSection from "@/components/landingpage/timeline";

export default function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Only override what's necessary for the demo video functionality
  const heroActions = [
    {
      text: "Watch Demo",
      href: "#",
      variant: "default" as const,
      onClick: () => setIsVideoModalOpen(true)
    },
    {
      text: "Start Free Trial",
      href: "/dashboard",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar className="z-50" />

      <section id="overview" className="bg-background">
        <HeroSection actions={heroActions} />
      </section>

      <section id="features-grid" className="bg-background">
         <FeatureGridSection />
      </section>

      <section id="testimonials" className="bg-background">
        <TestimonialsSection />
      </section>

      <section id="features-bento" className="bg-background">
        <BentoGridSection />
      </section>

      <section id="timeline" className="bg-background">
        <TimelineSection />
      </section>

      <section id="pricing" className="bg-background">
        <Pricing />
      </section>

      <section id="cta" className="bg-background">
        <CTASection withGlow={true} />
      </section>

      <Footer />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="S1cnQG0-LP4"
      />
    </div>
  );
}
