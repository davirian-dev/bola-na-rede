'use client';

import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface PerformanceIndicatorProps {
  rating?: number;
  energy?: number;
  morale?: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function PerformanceIndicator({
  rating = 7.0,
  energy = 85,
  morale = 85,
  size = 'md',
  showLabel = false,
}: PerformanceIndicatorProps) {
  // Define o estado: 'high' (⬆️), 'normal' (➡️), 'low' (⬇️)
  let status: 'high' | 'normal' | 'low' = 'normal';

  if (rating >= 7.5 || (morale >= 90 && energy >= 80)) {
    status = 'high';
  } else if (rating < 6.0 || energy < 50 || morale < 55) {
    status = 'low';
  } else {
    status = 'normal';
  }

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (status === 'high') {
    return (
      <span
        className="inline-flex items-center gap-1 font-bold text-emerald-500"
        title={`Fase Excelente • Nota: ${rating.toFixed(1)} • Energia: ${energy}%`}
      >
        <span className="p-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
          <ArrowUp className={`${iconSize} stroke-[3]`} />
        </span>
        {showLabel && <span className="text-[10px] font-black uppercase">Em Alta</span>}
      </span>
    );
  }

  if (status === 'low') {
    return (
      <span
        className="inline-flex items-center gap-1 font-bold text-rose-500"
        title={`Fase Baixa / Cansado • Nota: ${rating.toFixed(1)} • Energia: ${energy}%`}
      >
        <span className="p-0.5 rounded bg-rose-500/15 border border-rose-500/30">
          <ArrowDown className={`${iconSize} stroke-[3]`} />
        </span>
        {showLabel && <span className="text-[10px] font-black uppercase">Em Baixa</span>}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400"
      title={`Fase Regular • Nota: ${rating.toFixed(1)} • Energia: ${energy}%`}
    >
      <span className="p-0.5 rounded bg-amber-500/15 border border-amber-500/30">
        <ArrowRight className={`${iconSize} stroke-[3]`} />
      </span>
      {showLabel && <span className="text-[10px] font-black uppercase">Regular</span>}
    </span>
  );
}
