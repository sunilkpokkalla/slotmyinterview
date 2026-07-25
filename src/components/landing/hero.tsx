"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  const bands = [
    { text: "Sync GitHub Work", bg: "#2B0A66", side: "left", startY: 60, endY: 420 },
    { text: "Verify Capabilities", bg: "#4E2A9D", side: "right", startY: 150, endY: 330 },
    { text: "Build Living Profile", bg: "#7140DB", side: "right", startY: 240, endY: 240 },
    { text: "Fast-Track Interviews", bg: "#9674FF", side: "right", startY: 330, endY: 150 }
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
        {/* Intertwined Overlapping Paths Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 3000 400" 
            preserveAspectRatio="xMinYMid slice"
            className="absolute inset-0"
          >
            {/* Band 1 (Darkest) - Back layer */}
            <path id="path-0" d="M -100,60 L 350,60 L 710,420 L 3000,420" fill="none" stroke="#2B0A66" strokeWidth="56" strokeLinejoin="round" />
            
            {/* Band 2 (Dark) - Back layer */}
            <path id="path-1" d="M -100,150 L 250,150 L 430,330 L 3000,330" fill="none" stroke="#4E2A9D" strokeWidth="56" strokeLinejoin="round" />
            
            {/* Band 3 (Medium) - Middle layer (straight) */}
            <path id="path-2" d="M -100,240 L 3000,240" fill="none" stroke="#7140DB" strokeWidth="56" strokeLinejoin="round" />
            
            {/* Band 4 (Light) - Front layer (angles up) */}
            <path id="path-3" d="M -100,330 L 150,330 L 330,150 L 3000,150" fill="none" stroke="#9674FF" strokeWidth="56" strokeLinejoin="round" />
          </svg>

          {/* Moving Dots */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 3000 400" preserveAspectRatio="xMinYMid slice">
             <circle r="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))">
               <animateMotion dur="12s" repeatCount="indefinite" path="M -100,60 L 350,60 L 710,420 L 3000,420" />
             </circle>
             <circle r="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))">
               <animateMotion dur="13s" repeatCount="indefinite" begin="2s" path="M -100,150 L 250,150 L 430,330 L 3000,330" />
             </circle>
             <circle r="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))">
               <animateMotion dur="11s" repeatCount="indefinite" begin="1s" path="M -100,240 L 3000,240" />
             </circle>
             <circle r="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))">
               <animateMotion dur="12.5s" repeatCount="indefinite" begin="3s" path="M -100,330 L 150,330 L 330,150 L 3000,150" />
             </circle>
          </svg>
        </div>

        {/* Text Labels overlaid exactly on the paths */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 h-full w-full">
              {bands.map((band, i) => {
                const isLeft = band.side === "left";
                const yPos = isLeft ? band.startY : band.endY;
                
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className={`absolute flex items-center gap-4 h-[56px] pointer-events-auto ${isLeft ? 'left-6 md:left-24' : 'right-6 md:right-24 flex-row-reverse'}`}
                    style={{ top: yPos - 28 }} // -28 to center the 56px high div on the path
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm z-10">
                        <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-md whitespace-nowrap">
                      {band.text}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
        </div>
      </div>

      <div className="mt-20 md:mt-32 w-full relative z-10 pb-20 overflow-hidden">
          <p className="text-sm font-semibold text-slate-400 mb-10 tracking-widest text-center uppercase">
            Trusted by <strong className="text-slate-700">10,000+</strong> AI engineering teams
          </p>
          
          <div className="relative flex overflow-hidden w-full max-w-[100vw]">
            {/* Edge Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            {/* Infinite Marquee Track */}
            <motion.div
              className="flex items-center w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            >
              {/* Duplicate array multiple times to ensure seamless infinite looping */}
              {[...companies, ...companies, ...companies, ...companies].map((company, idx) => (
                <div key={idx} className="flex-none px-12 md:px-24">
                  <span className="text-xl md:text-2xl font-extrabold text-slate-300 uppercase tracking-[0.2em] hover:text-slate-500 transition-colors duration-300">
                    {company}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      
    </section>
  );
}
