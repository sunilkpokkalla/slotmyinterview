import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { BlogSection } from "@/components/landing/blog-section";
import { TalentPositioning } from "@/components/landing/talent-positioning";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <Testimonials />
      <Features />
      <TalentPositioning />
      <BlogSection />
    </main>
  );
}
