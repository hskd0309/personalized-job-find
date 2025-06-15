import React from 'react';

interface CareerHubIconProps {
  className?: string;
  size?: number;
}

export function CareerHubIcon({ className = "", size = 24 }: CareerHubIconProps) {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="50%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
      
      {/* Shield shape */}
      <path 
        d="M50 10L20 25v25c0 17.32 12 30.43 30 34.38C67.996 80.43 80 67.32 80 50V25L50 10z" 
        fill="url(#shieldGradient)"
      />
      
      {/* Inner shield */}
      <path 
        d="M50 15L25 27v23c0 15.54 10.8 27.39 25 30.95C64.8 77.39 75 65.54 75 50V27L50 15z" 
        fill="#ffffff" 
        opacity="0.9"
      />
      
      {/* Checkmark */}
      <path 
        d="M40 50l6 6 12-12" 
        stroke="#10b981" 
        strokeWidth="4" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Career progression dots */}
      <circle cx="35" cy="65" r="2" fill="#3b82f6"/>
      <circle cx="50" cy="68" r="2" fill="#8b5cf6"/>
      <circle cx="65" cy="65" r="2" fill="#10b981"/>
      
      {/* Connection lines */}
      <path 
        d="M35 65 L50 68 L65 65" 
        stroke="#6b7280" 
        strokeWidth="1.5" 
        fill="none" 
        opacity="0.7"
      />
    </svg>
  );
}