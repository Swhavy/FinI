import React, { useId } from 'react';

export default function Logo({ className = "w-12 h-12", showBg = true }) {
  const uniqueId = useId().replace(/:/g, '');
  const goldGradId = `logo-gold-grad-${uniqueId}`;
  const greenGradId = `logo-green-grad-${uniqueId}`;
  const bgGradId = `logo-bg-grad-${uniqueId}`;
  const shadowId = `logo-3d-shadow-${uniqueId}`;

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      width="100%"
      height="100%"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gold Gradient */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2D06B" />
          <stop offset="40%" stopColor="#D6A338" />
          <stop offset="100%" stopColor="#9E6B1D" />
        </linearGradient>
        
        {/* Green Gradient */}
        <linearGradient id={greenGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4C6853" />
          <stop offset="100%" stopColor="#18271E" />
        </linearGradient>

        {/* Background Gradient */}
        <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E2029" />
          <stop offset="100%" stopColor="#0A0B0F" />
        </linearGradient>

        {/* 3D Depth Shadow Filter */}
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="3" floodColor="#000" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Background App Icon Base */}
      {showBg && <rect width="200" height="200" rx="40" fill={`url(#${bgGradId})`} />}

      {/* Logo Elements Grouped with Drop Shadow */}
      <g filter={`url(#${shadowId})`}>
        {/* Left Dark Green Arc */}
        <path 
          d="M 84 47 A 55 55 0 0 0 84 153" 
          fill="none" 
          stroke={`url(#${greenGradId})`} 
          strokeWidth="20" 
          strokeLinecap="butt" 
        />

        {/* Right Gold Arc */}
        <path 
          d="M 116 47 A 55 55 0 0 1 116 153" 
          fill="none" 
          stroke={`url(#${goldGradId})`} 
          strokeWidth="20" 
          strokeLinecap="butt" 
        />

        {/* Center 'i' Dot */}
        <circle cx="100" cy="73" r="10" fill={`url(#${goldGradId})`} />
        
        {/* Center 'i' Stem */}
        <rect x="90" y="93" width="20" height="60" rx="3" fill={`url(#${goldGradId})`} />
      </g>
    </svg>
  );
}
