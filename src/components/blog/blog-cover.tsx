"use client";

import React from 'react';

// Generates a simple deterministic pseudo-random number based on a string
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function BlogCover({ title, slug, className = "" }: { title: string, slug: string, className?: string }) {
  const hash = hashCode(slug);
  
  // Deterministic colors based on hash
  const colors = [
    ["#4F46E5", "#7C3AED"], // Indigo to Violet
    ["#2563EB", "#0ea5e9"], // Blue to Light Blue
    ["#059669", "#10B981"], // Emerald
    ["#D97706", "#F59E0B"], // Amber
    ["#db2777", "#f43f5e"], // Pink to Rose
    ["#1e293b", "#334155"]  // Slate
  ];
  
  const [color1, color2] = colors[hash % colors.length];
  const patternType = hash % 4;
  
  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-between p-6 ${className}`} style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}>
      
      {/* Background SVG Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay" preserveAspectRatio="none">
        {patternType === 0 && (
          <pattern id={`pattern-${slug}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </pattern>
        )}
        {patternType === 1 && (
          <pattern id={`pattern-${slug}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" opacity="0.5"/>
          </pattern>
        )}
        {patternType === 2 && (
          <pattern id={`pattern-${slug}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="15" height="15" fill="currentColor" />
          </pattern>
        )}
        {patternType === 3 && (
          <pattern id={`pattern-${slug}`} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25 0L50 25L25 50L0 25Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor"/>
          </pattern>
        )}
        <rect width="100%" height="100%" fill={`url(#pattern-${slug})`} />
      </svg>
      
      {/* Abstract large geometric shape */}
      <div className="absolute -right-12 -bottom-12 opacity-30 mix-blend-overlay pointer-events-none">
        {patternType % 2 === 0 ? (
          <div className="w-48 h-48 rounded-full border-[20px] border-white/50" />
        ) : (
          <div className="w-48 h-48 border-[20px] border-white/50 transform rotate-45" />
        )}
      </div>

      <div className="relative z-10">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm mb-4 flex items-center justify-center text-white font-bold text-xs">
          {title.charAt(0)}
        </div>
      </div>
      
      <div className="relative z-10 text-white font-bold text-xl md:text-2xl leading-tight max-w-[90%] line-clamp-3 drop-shadow-md">
        {title}
      </div>
    </div>
  );
}
