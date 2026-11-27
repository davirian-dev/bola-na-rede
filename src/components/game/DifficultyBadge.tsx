'use client';

import React from 'react';
import { MinigameDifficultyParams } from '@/engine/minigameBalance';
import { Flame, ShieldAlert } from 'lucide-react';

interface DifficultyBadgeProps {
  balance: MinigameDifficultyParams;
  compact?: boolean;
}

const LEVEL_STYLES: Record<MinigameDifficultyParams['difficultyLabel'], string> = {
  'Fácil': 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400',
  'Equilibrado': 'bg-amber-500/15 border-amber-500/35 text-amber-400',
  'Difícil': 'bg-orange-500/15 border-orange-500/40 text-orange-400',
  'Elite': 'bg-rose-500/15 border-rose-500/40 text-rose-400',
};

export function DifficultyBadge({ balance, compact = false }: DifficultyBadgeProps) {
  const style = LEVEL_STYLES[balance.difficultyLabel];

  return (
    <div
      title={`Dificuldade dinâmica: OVR ${balance.playerOverall} vs ${balance.leagueLabel} (meta ${balance.benchmarkOvr}). Goleiro ${balance.keeperSpeedMult}x • Barra ${balance.powerBarSpeedMult}x • Janela ${Math.round(balance.sweetSpotScale * 100)}%`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wide ${style}`}
    >
      <ShieldAlert className="w-3 h-3 shrink-0" />
      <span>{balance.difficultyLabel}</span>
      {!compact && (
        <span className="opacity-85 font-bold">
          • OVR {balance.playerOverall} • {balance.leagueLabel}
        </span>
      )}
      {balance.isOnFire && (
        <span className="inline-flex items-center gap-0.5 text-amber-300 ml-0.5" title="Bônus Em Chamas ativo (-5% dificuldade)">
          <Flame className="w-3 h-3 fill-amber-400" />
        </span>
      )}
    </div>
  );
}
