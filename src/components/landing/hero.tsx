"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
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
    <section className="relative w-full pt-32 lg:pt-40 bg-[#F8F9FC] overflow-hidden min-h-[800px] flex flex-col justify-end">
      
      {/* Main Hero Headline & Graphic */}
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10 w-full flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#0F1115] tracking-tighter leading-[1.05] mb-6"
          >
            Hire Talent.<br />
            Not Resumes.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed"
          >
            The world's first capability-based hiring platform. Watch elite AI talent move seamlessly from verified GitHub profiles straight into your interview pipeline.
          </motion.p>
        </div>
        
        {/* Floating CTA Card moved to the right column */}
        <div className="w-full md:w-1/2 flex justify-start md:justify-end mt-12 md:mt-0 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-[440px] bg-white rounded-[32px] p-8 md:p-10 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50"
          >
            <h3 className="text-3xl font-extrabold text-[#0F1115] mb-3 tracking-tight leading-tight">
              Start hiring verified talent
            </h3>
            <p className="text-slate-500 mb-8 font-medium text-sm">
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

      <div className="relative w-full h-[400px] mt-8">
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

            <line x1="400" y1="50" x2="400" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </svg>

          {/* Moving Dots */}
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

        <div className="absolute inset-0 w-full h-full z-10 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full relative h-full">
            
            <div className="absolute left-6 md:left-[300px] h-full flex flex-col justify-between py-[38px]">
              {bands.map((band, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-6 h-[100px] -mt-[50px] relative top-[50px]"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                    {band.text}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Companies Logo Strip (Clean White Design) */}
      <div className="w-full bg-white relative z-20 mt-12 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-medium text-slate-500 mb-6">
            Trusted by <strong className="text-slate-700">10,000+</strong> AI engineering teams
          </p>
          <div className="flex flex-wrap border border-slate-200 rounded-sm overflow-hidden">
            {companies.map((company, idx) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + (idx * 0.1) }}
                className={`flex-1 min-w-[140px] md:min-w-[160px] py-8 px-4 flex items-center justify-center border-slate-200 ${
                  idx !== companies.length - 1 ? 'border-r' : ''
                } ${idx > 2 ? 'border-t md:border-t-0' : ''}`}
              >
                <span className="text-lg md:text-xl font-bold text-slate-500 uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity grayscale cursor-pointer">
                  {company}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}
