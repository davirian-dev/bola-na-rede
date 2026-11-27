'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PhaserPitchMinigame from '@/components/match/PhaserPitchMinigame';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from '@/components/game/DifficultyBadge';

const TEST_DIVISIONS: { id: 'AUTO' | Division; label: string }[] = [
  { id: 'AUTO', label: 'Minha Liga' },
  { id: 'D', label: 'Série D' },
  { id: 'B', label: 'Série B' },
  { id: 'A', label: 'Série A' },
  { id: 'PL', label: 'Premier League' },
  { id: 'EUROPA', label: 'Champions' },
];

export default function Arena2DPage() {
  const [selectedDiv, setSelectedDiv] = useState<'AUTO' | Division>('AUTO');
  const divisionOverride = selectedDiv === 'AUTO' ? undefined : selectedDiv;
  const balance = useMinigameBalance({ division: divisionOverride });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3.5 bg-zinc-950 p-4">
      <div className="flex w-full max-w-[400px] items-center justify-between text-xs text-zinc-400">
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-200 hover:bg-zinc-800"
        >
          ← Voltar ao Jogo
        </Link>
        <span className="font-bold uppercase tracking-wider text-emerald-400">Phaser 3 • Arena 2D</span>
      </div>

      {/* Seletor de Liga para Simular Dificuldade Dinâmica (OVR × Liga) */}
      <div className="w-full max-w-[400px] rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
            Simular Nível da Liga:
          </span>
          <DifficultyBadge balance={balance} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEST_DIVISIONS.map((div) => (
            <button
              key={div.id}
              type="button"
              onClick={() => setSelectedDiv(div.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                selectedDiv === div.id
                  ? 'bg-emerald-500 text-zinc-950 font-black'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {div.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          Goleiro {balance.keeperSpeedMult}x • Marcação {balance.defenderSpeedMult}x • Abertura do gol {Math.round(balance.sweetSpotScale * 100)}%
        </p>
      </div>

      <PhaserPitchMinigame
        mode="free"
        divisionOverride={divisionOverride}
        title="Bola na Rede — Arena 2D"
      />
    </main>
  );
}
