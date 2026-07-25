"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DemoCta() {
  // Isometric cube parameters
  const w = 75; // width
  const h = 42; // depth/height ratio
  const d = 95; // vertical height of the cube

  // Helper to generate the cube paths
  const drawCube = (cx: number, cy: number, delay: number) => (
    <motion.g
      initial={{ y: 0 }}
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      transform={`translate(${cx}, ${cy})`}
    >
      {/* Dashed hidden edges */}
      <motion.path 
        d={`M ${-w},${d-h} L 0,${d-2*h} L ${w},${d-h} M 0,${d-2*h} L 0,${-2*h}`} 
        fill="none" 
        stroke="#8A4CFC" 
        strokeWidth="1.5" 
        strokeDasharray="6 6" 
        strokeLinejoin="round" 
        className="opacity-40"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeOut" }}
      />
      
      {/* Solid visible edges */}
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay, ease: "easeOut" }}
        fill="none" 
        stroke="#8A4CFC" 
        strokeWidth="2" 
        strokeLinejoin="round"
      >
        {/* Top face */}
        <motion.path d={`M 0,${-2*h} L ${w},${-h} L 0,0 L ${-w},${-h} Z`} fill="rgba(138, 76, 252, 0.03)" />
        {/* Left face */}
        <motion.path d={`M ${-w},${-h} L ${-w},${d-h} L 0,${d} L 0,0 Z`} fill="rgba(138, 76, 252, 0.05)" />
        {/* Right face */}
        <motion.path d={`M 0,${d} L ${w},${d-h} L ${w},${-h} L 0,0 Z`} fill="rgba(138, 76, 252, 0.08)" />
      </motion.g>
    </motion.g>
  );

  return (
    <section className="bg-[#111111] text-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              See the SlotMyInterview<br />platform in action
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
              Get a demo and discover how leading engineering teams use SlotMyInterview to supercharge their hiring engine and secure top AI talent.
            </p>
            
            <Link href="/demo">
              <Button size="lg" className="bg-white text-black hover:bg-slate-200 text-base font-semibold h-12 px-8 transition-colors">
                Get a demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Right Animated Isometric Cubes */}
          <div className="relative h-[300px] sm:h-[400px] w-full hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 600 400" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full max-w-[600px] overflow-visible"
              >
                {/* Subtle radial glow in the center behind cubes */}
                <defs>
                  <radialGradient id="cubeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8A4CFC" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#111111" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="300" cy="200" r="250" fill="url(#cubeGlow)" />

                {/* Draw 3 cubes ascending to the top right */}
                {/* Cube 1 (Bottom Left) */}
                {drawCube(170, 260, 0)}
                {/* Cube 2 (Middle) */}
                {drawCube(300, 180, 0.4)}
                {/* Cube 3 (Top Right) */}
                {drawCube(430, 100, 0.8)}
              </svg>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
