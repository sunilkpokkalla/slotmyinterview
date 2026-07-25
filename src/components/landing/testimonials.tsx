"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote: "I didn't even realize how much time we wasted screening resumes until we started using SlotMyInterview. Seeing verified GitHub work upfront completely changed our hiring engine.",
    name: "Sarah Jenkins",
    title: "VP of Engineering @ TechFlow",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    companyLogo: "TechFlow"
  },
  {
    id: 2,
    quote: "The ability to instantly assign real-world AI challenges and book interviews with candidates who actually deliver has cut our time-to-hire by 60%.",
    name: "Marcus Chen",
    title: "CTO @ DataSync",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    companyLogo: "DataSync"
  },
  {
    id: 3,
    quote: "Traditional CVs for AI engineers are obsolete. SlotMyInterview gives us the deep visibility into a candidate's actual capabilities that we always needed.",
    name: "Elena Rodriguez",
    title: "Head of AI @ Nexus",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    companyLogo: "Nexus"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-[#111111] flex flex-col md:flex-row h-auto md:h-[500px]">
          
          {/* Left: Image (Half Width) */}
          <div className="w-full md:w-1/2 h-[350px] md:h-full relative overflow-hidden bg-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img 
                  src={current.image} 
                  alt={current.name}
                  className="w-full h-full object-cover object-[center_15%]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Content (Half Width) */}
          <div className="w-full md:w-1/2 flex flex-col h-full">
            
            {/* Top: Quote Area */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative min-h-[250px]">
              
              {/* Pagination Dots */}
              <div className="absolute top-6 left-8 md:top-10 md:left-12 flex gap-2 items-center">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-white text-lg md:text-xl lg:text-2xl font-medium leading-relaxed tracking-tight mt-6"
                >
                  "{current.quote}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Bottom: Info Bar */}
            <div className="flex flex-col sm:flex-row min-h-[100px] md:h-[120px]">
              {/* Bottom Left: Name & Title (Dark) */}
              <div className="flex-1 bg-[#1A1A1A] border-t border-white/10 p-6 md:p-8 flex flex-col justify-center min-w-[50%]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="text-white font-bold text-sm tracking-wide line-clamp-1">{current.name}</h4>
                    <p className="text-white/60 text-xs mt-1 line-clamp-1">{current.title}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Right: Logo (White) */}
              <div className="flex-1 sm:max-w-[220px] bg-white flex items-center justify-center p-6 border-t sm:border-l border-slate-100 min-h-[80px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-xl md:text-2xl font-extrabold text-[#26C766] tracking-tighter flex items-center gap-2 whitespace-nowrap">
                      <div className="w-5 h-6 rounded-full border-2 border-[#26C766] flex items-center justify-center relative flex-shrink-0">
                        <div className="w-1.5 h-2.5 bg-[#26C766] rounded-sm absolute" />
                      </div>
                      <span className="truncate">{current.companyLogo}</span>
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
