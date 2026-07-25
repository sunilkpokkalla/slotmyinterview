"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HowItWorks() {
  const bands = [
    { text: "Create Living Profile", bg: "#9674FF" },
    { text: "Sync GitHub Work", bg: "#7140DB" },
    { text: "Verify Capabilities", bg: "#5123A7" },
    { text: "Book Interviews", bg: "#351478" }
  ];

  const companies = [
    "OpenAI", "Anthropic", "Scale AI", "Cohere", "Hugging Face", "Midjourney"
  ];

  return (
    <section className="relative w-full pt-20 bg-[#F8F9FC] overflow-hidden min-h-[600px] flex flex-col justify-end">
      
      {/* Title above bands */}
      <div className="max-w-7xl mx-auto px-6 mb-8 relative z-10 w-full md:pl-[300px]">
        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-300">
          How it works
        </h4>
      </div>

      <div className="relative w-full h-[400px]">
        {/* Abstract SVG Background with Angled Paths */}
        <div className="absolute inset-0 w-full h-full z-0">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1440 400" 
            preserveAspectRatio="none"
            className="absolute inset-0"
          >
            <defs>
              {/* Paths for the moving dots (center of each band) */}
              <path id="path-0" d="M -100,20 L 150,20 L 300,50 L 1500,50" fill="none" />
              <path id="path-1" d="M -100,20 L 150,20 L 300,150 L 1500,150" fill="none" />
              <path id="path-2" d="M -100,20 L 150,20 L 300,250 L 1500,250" fill="none" />
              <path id="path-3" d="M -100,20 L 150,20 L 300,350 L 1500,350" fill="none" />
            </defs>

            {/* Solid Bands */}
            <path d="M 0,-100 L 150,-100 L 350,0 L 1500,0 L 1500,100 L 300,100 L 100,0 L 0,0 Z" fill={bands[0].bg} />
            <path d="M 0,0 L 100,0 L 300,100 L 1500,100 L 1500,200 L 250,200 L 50,0 L 0,0 Z" fill={bands[1].bg} />
            <path d="M 0,0 L 50,0 L 250,200 L 1500,200 L 1500,300 L 200,300 L 0,0 Z" fill={bands[2].bg} />
            <path d="M 0,0 L 0,0 L 200,300 L 1500,300 L 1500,400 L 150,400 L 0,100 Z" fill={bands[3].bg} />

            {/* Vertical timeline line connecting the steps */}
            <line x1="400" y1="50" x2="400" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </svg>

          {/* Moving Dots on SVG Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 400" preserveAspectRatio="none">
             <circle r="12" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))">
               <animateMotion dur="8s" repeatCount="indefinite" path="M -100,-50 L 150,-50 L 350,50 L 1500,50" />
             </circle>
             <circle r="12" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))">
               <animateMotion dur="9s" repeatCount="indefinite" begin="2s" path="M -100,0 L 100,0 L 300,150 L 1500,150" />
             </circle>
             <circle r="12" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))">
               <animateMotion dur="10s" repeatCount="indefinite" begin="1s" path="M -100,0 L 50,0 L 250,250 L 1500,250" />
             </circle>
          </svg>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 w-full h-full z-10 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full relative h-full">
            
            {/* Left side text items */}
            <div className="absolute left-6 md:left-[300px] h-full flex flex-col justify-between py-[38px]">
              {bands.map((band, i) => (
                <div key={i} className="flex items-center gap-6 h-[100px] -mt-[50px] relative top-[50px]">
                  {/* Step Node */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  {/* Text */}
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                    {band.text}
                  </h3>
                </div>
              ))}
            </div>

            {/* Floating CTA Card on the right */}
            <div className="absolute top-0 md:-top-12 right-6 w-full max-w-[360px] md:max-w-[480px]">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50"
              >
                <h3 className="text-3xl font-extrabold text-[#0F1115] mb-3 tracking-tight leading-tight">
                  Start hiring verified talent
                </h3>
                <p className="text-slate-500 mb-8 font-medium text-base">
                  Join the waitlist for early access to the platform.
                </p>
                
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="What's your work email?" 
                      className="w-full h-14 px-5 rounded-2xl bg-[#F8F9FC] border-slate-200 text-base placeholder:text-slate-500 focus-visible:ring-[#7140DB] shadow-inner"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl bg-[#0A0C10] hover:bg-[#1a1f29] text-white font-bold text-lg transition-all shadow-md hover:shadow-xl active:scale-[0.98]">
                    Get early access
                  </Button>
                </form>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* Companies Logo Strip */}
      <div className="w-full bg-[#200A4D] py-12 border-t border-white/5 relative z-20 shadow-[0_-10px_40px_rgba(32,10,77,0.5)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-white/50 uppercase tracking-widest mb-8">
            Hiring AI Talent Into
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-24 gap-y-8">
            {companies.map((company, idx) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="text-xl md:text-2xl font-black text-white/70 tracking-tighter hover:text-white transition-colors cursor-pointer"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}
