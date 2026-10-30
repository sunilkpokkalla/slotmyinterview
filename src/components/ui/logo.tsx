"use client";

import React from "react";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
}

export function Logo({ 
  className = "", 
  showTagline = true,
  size = "md",
  iconOnly = false
}: LogoProps) {
  const iconSizes = {
    sm: "w-7.5 h-7.5",
    md: "w-9 h-9",
    lg: "w-11.5 h-11.5",
    xl: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
    xl: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Cursor-Tier Isometric 3D Solid Cube Monogram */}
      <div className={`relative shrink-0 ${iconSizes[size]} rounded-xl bg-black border border-white/10 p-1 shadow-2xl group flex items-center justify-center`}>
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full text-white relative z-10 transition-transform group-hover:scale-105 duration-300"
        >
          {/* Top Facet (Pure White) */}
          <path 
            d="M16 2.5L28 9L16 15.5L4 9L16 2.5Z" 
            fill="#FFFFFF" 
          />
          
          {/* Left Facet (Light Silver Shading) */}
          <path 
            d="M4 9L16 15.5V29.5L4 23V9Z" 
            fill="#D1D5DB" 
          />
          
          {/* Right Facet (Dark Metallic Shading) */}
          <path 
            d="M28 9L16 15.5V29.5L28 23V9Z" 
            fill="#6B7280" 
          />

          {/* Inner Facet Cutout forming the 'S' Slot (Dark Inset Facet) */}
          <path 
            d="M16 15.5L22 12L16 8.5L10 12L16 15.5Z" 
            fill="#111827" 
          />
          <path 
            d="M16 15.5V22.5L10 19V12L16 15.5Z" 
            fill="#1F2937" 
          />
          <path 
            d="M16 15.5V22.5L22 19V12L16 15.5Z" 
            fill="#374151" 
          />

          {/* Accent Core Slot Line */}
          <path 
            d="M16 8.5L22 12L16 15.5L10 19L16 22.5" 
            stroke="#A855F7" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} font-extrabold tracking-tight text-white whitespace-nowrap leading-none font-sans`}>
              SlotMy<span className="text-fg-0">Interview</span>
            </span>
          </div>
          {showTagline && (
            <span className="text-[9px] font-mono text-fg-3 font-semibold tracking-widest uppercase mt-1 whitespace-nowrap">
              Verified Talent Ledger
            </span>
          )}
        </div>
      )}
    </div>
  );
}
