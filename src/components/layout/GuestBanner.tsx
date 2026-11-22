'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { CloudOff, X, ArrowUpRight } from 'lucide-react';

export function GuestBanner() {
  const isGuest = useGameStore((s) => s.isGuest);
  const [dismissed, setDismissed] = useState(false);

  if (!isGuest || dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs flex items-center justify-between gap-2 overflow-x-hidden">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden min-w-0">
        <CloudOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
        <span className="truncate">
          <strong className="hidden xs:inline sm:inline">Modo Visitante: </strong>
          <span>Salvo no aparelho (sem nuvem)</span>
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/"
          className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 whitespace-nowrap text-[11px] sm:text-xs"
        >
          <span>Criar Conta</span>
          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700/60 dark:text-amber-400/60 hover:text-amber-900 dark:hover:text-amber-200 transition-colors p-1 rounded cursor-pointer"
          aria-label="Fechar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
