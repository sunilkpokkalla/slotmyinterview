"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <section className="py-24 bg-ink-0 border-t border-hair">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12">
          <span className="eyebrow">Trust</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-fg-0">
            Hiring managers <em>agree.</em>
          </h2>
        </div>

        {/* Double-Bezel Card Container */}
        <div className="bezel-outer">
          <div className="bezel-inner flex flex-col md:flex-row gap-8 items-center min-h-[360px]">
            
            {/* Left: Image with custom rounded bezel */}
            <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square relative rounded-lg overflow-hidden border border-hair-2 bg-ink-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={current.image} 
                    alt={current.name}
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Quote Content */}
            <div className="w-full md:w-2/3 flex flex-col justify-between h-full py-4">
              <div>
                {/* Pagination Dots */}
                <div className="flex gap-2 mb-6">
                  {testimonials.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-purple-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={current.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-lg md:text-xl font-medium text-fg-1 leading-relaxed italic"
                  >
                    "{current.quote}"
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Author Profile */}
              <div className="mt-8 pt-6 border-t border-hair-2 flex justify-between items-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col"
                  >
                    <span className="font-bold text-fg-0 text-sm tracking-wide">{current.name}</span>
                    <span className="text-xs text-fg-3 font-mono mt-1">{current.title}</span>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-fg-3 font-mono text-sm tracking-widest font-semibold"
                  >
                    {current.companyLogo.toUpperCase()}
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
