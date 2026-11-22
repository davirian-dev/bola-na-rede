'use client';

import React from 'react';
import { getOverallColorClass } from '@/lib/calculations';

interface OverallBadgeProps {
  overall: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function OverallBadge({
  overall,
  size = 'md',
  showLabel = false,
  className = '',
}: OverallBadgeProps) {
  const color = getOverallColorClass(overall);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-9 h-9 text-sm font-extrabold',
    lg: 'w-12 h-12 text-lg font-black',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-lg border ${color.bg} ${color.text} ${color.border} ${sizeClasses[size]} shadow-sm select-none font-mono`}
      >
        {overall}
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          OVR
        </span>
      )}
    </div>
  );
}
