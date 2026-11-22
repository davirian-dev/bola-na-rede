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
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 overflow-hidden">
        <CloudOff className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="truncate">
          <strong>Modo Visitante ativo:</strong> seu progresso está salvo no navegador, mas não sincroniza na nuvem.
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/"
          className="font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
        >
          Criar Conta Grátis
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700/60 dark:text-amber-400/60 hover:text-amber-900 dark:hover:text-amber-200 transition-colors p-0.5 rounded cursor-pointer"
          aria-label="Fechar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
