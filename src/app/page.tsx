import { Hero } from "@/components/landing/hero";
import { ViralWaitlist } from "@/components/landing/viral-waitlist";
import { TalentStrip } from "@/components/landing/talent-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { TalentPositioning } from "@/components/landing/talent-positioning";
import { Testimonials } from "@/components/landing/testimonials";
import { DemoCta } from "@/components/landing/demo-cta";
import { BlogSection } from "@/components/landing/blog-section";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <ViralWaitlist />
      <TalentStrip />
      <HowItWorks />
      <Features />
      <TalentPositioning />
      <Testimonials />
      <DemoCta />
      <BlogSection />
    </main>
  );
}
