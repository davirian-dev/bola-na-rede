'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { AchievementTier, TieredAchievement } from '@/types/game';
import { INITIAL_TIERED_ACHIEVEMENTS } from '@/data/tieredAchievementsSeed';
import { 
  Award, 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  X,
  Crown,
  Gift,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const tieredAchievements = useGameStore((s) => s.tieredAchievements) || INITIAL_TIERED_ACHIEVEMENTS;
  const claimReward = useGameStore((s) => s.claimTieredAchievementReward);

  const [activeTier, setActiveTier] = useState<'all' | AchievementTier>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredAchievements = activeTier === 'all'
    ? tieredAchievements
    : tieredAchievements.filter((a) => a.tier === activeTier);

  const totalUnlocked = tieredAchievements.filter((a) => a.unlocked).length;
  const totalClaimable = tieredAchievements.filter((a) => a.unlocked && !a.claimed).length;

  const handleClaim = (achId: string) => {
    const res = claimReward(achId);
    if (res.success) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const getTierBadge = (tier: AchievementTier) => {
    switch (tier) {
      case 'bronze':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-700/20 text-amber-500 border border-amber-700/40">Bronze 🥉</span>;
      case 'silver':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-zinc-400/20 text-zinc-300 border border-zinc-400/40">Prata 🥈</span>;
      case 'gold':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">Ouro 🥇</span>;
      case 'legendary':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">Lendário 💎</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border-2 border-emerald-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glows decorativos */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topo */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-black shadow-md">
              🏆
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Central de Desafios & Carreira
              </span>
              <h3 className="font-display text-lg sm:text-xl font-black text-foreground">
                Conquistas & Glórias ({totalUnlocked}/{tieredAchievements.length})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast de Resgate */}
        {toastMessage && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Filtros de Tiers */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
          {[
            { id: 'all', label: `Todas (${tieredAchievements.length})` },
            { id: 'bronze', label: 'Bronze 🥉' },
            { id: 'silver', label: 'Prata 🥈' },
            { id: 'gold', label: 'Ouro 🥇' },
            { id: 'legendary', label: 'Lendário 💎' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTier(tab.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTier === tab.id
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-black'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de Conquistas com Progresso */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredAchievements.map((ach) => {
            const pct = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));
            const isReadyToClaim = ach.unlocked && !ach.claimed;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  ach.claimed
                    ? 'bg-secondary/20 border-border opacity-75'
                    : isReadyToClaim
                    ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-secondary/40 border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      ach.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-secondary text-muted-foreground opacity-60'
                    }`}>
                      {ach.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-black text-xs sm:text-sm text-foreground truncate">
                          {ach.title}
                        </h4>
                        {getTierBadge(ach.tier)}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  {/* Botão Resgatar ou Status */}
                  <div className="shrink-0 text-right">
                    {ach.claimed ? (
                      <span className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Resgatado
                      </span>
                    ) : isReadyToClaim ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(ach.id)}
                        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Resgatar
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        {ach.currentValue} / {ach.targetValue}
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra de Progresso Visual */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted-foreground">
                    <span className="text-emerald-400">{ach.rewardLabel}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        ach.unlocked ? 'bg-emerald-500' : 'bg-amber-500/80'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé com Dica */}
        <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Resgate recompensas para acelerar seu patrimônio e legado.</span>
          <span className="font-mono text-emerald-400 font-bold">
            {totalClaimable} pendente(s)
          </span>
        </div>
      </div>
    </div>
  );
}
