'use client';

import React from 'react';

interface ClubBadgeProps {
  primaryColor: string;
  secondaryColor: string;
  shortName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ClubBadge({
  primaryColor = '#10b981',
  secondaryColor = '#ffffff',
  shortName = 'BNR',
  size = 'md',
  className = '',
}: ClubBadgeProps) {
  const sizeMap = {
    sm: 'w-7 h-8 text-[9px]',
    md: 'w-10 h-11 text-xs',
    lg: 'w-14 h-16 text-sm',
    xl: 'w-20 h-24 text-base',
  };

  const monogram = (shortName || 'BNR').slice(0, 3).toUpperCase();

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 drop-shadow-md select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full filter drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${monogram}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.8" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Forma do Escudo Clássico */}
        <path
          d="M 10 10 L 90 10 L 90 60 C 90 95 50 115 50 115 C 50 115 10 95 10 60 Z"
          fill={`url(#grad-${monogram})`}
          stroke={secondaryColor}
          strokeWidth="5"
        />

        {/* Faixa diagonal decorativa com a cor secundária */}
        <path
          d="M 12 12 L 88 110 L 76 112 L 12 28 Z"
          fill={secondaryColor}
          opacity="0.35"
        />

        {/* Borda superior dourada sutil */}
        <line x1="12" y1="12" x2="88" y2="12" stroke={secondaryColor} strokeWidth="3" opacity="0.6" />

        {/* Monograma do Clube no Centro */}
        <text
          x="50"
          y="65"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          fill={secondaryColor}
          letterSpacing="1"
        >
          {monogram}
        </text>
      </svg>
    </div>
  );
}
