"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to upgrade your hiring process?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join the exclusive network of top-tier AI engineers and forward-thinking companies. Get started today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search" className={buttonVariants({ size: "lg", variant: "secondary", className: "w-full sm:w-auto text-base h-12 px-8 text-primary font-semibold" })}>
              Hire Talent
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/profile/demo" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto text-base h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" })}>
              Apply as Candidate
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
