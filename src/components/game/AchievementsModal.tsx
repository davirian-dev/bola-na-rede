'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  Award, 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  X,
  Crown,
  Users
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BadgeDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bonusPoints: number;
  isUnlocked: boolean;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const trophies = useGameStore((s) => s.trophies);
  const generation = useGameStore((s) => s.generation);
  const mode = useGameStore((s) => s.mode);

  if (!isOpen) return null;

  const goals = playerProfile?.stats.goals || 0;
  const balance = playerProfile?.bankBalance || 0;
  const hasNationalTeam = !!playerProfile?.nationalTeam && playerProfile.nationalTeam.status !== 'none';

  const badges: BadgeDef[] = [
    {
      id: 'badge-d-to-a',
      title: 'Da Série D à Glória',
      desc: 'Suba de divisão com seu clube e prove seu valor no futebol nacional.',
      icon: '🚀',
      bonusPoints: 50,
      isUnlocked: trophies.some((t) => t.category === 'league'),
    },
    {
      id: 'badge-generation',
      title: 'Linhagem de Ouro',
      desc: 'Transmita o talento nos genes: inicie a carreira com o Filho do Craque (Geração 2+).',
      icon: '👑',
      bonusPoints: 40,
      isUnlocked: generation >= 2,
    },
    {
      id: 'badge-top-scorer',
      title: 'Artilheiro Nato',
      desc: 'Marque 15 ou mais gols oficiais em partidas de campeonato.',
      icon: '⚽',
      bonusPoints: 35,
      isUnlocked: goals >= 15,
    },
    {
      id: 'badge-national-team',
      title: 'Manto Amarelo',
      desc: 'Receba a tão sonhada convocação para a Seleção Brasileira (Sub-20 ou Principal).',
      icon: '🇧🇷',
      bonusPoints: 45,
      isUnlocked: hasNationalTeam,
    },
    {
      id: 'badge-tycoon',
      title: 'Magnata da Bola',
      desc: 'Acumule mais de R$ 500.000 em patrimônio bancário e bens de luxo.',
      icon: '💰',
      bonusPoints: 30,
      isUnlocked: balance >= 500000,
    },
    {
      id: 'badge-derby-king',
      title: 'Rei dos Clássicos',
      desc: 'Decida e vença um clássico histórico de rivalidade estadual.',
      icon: '🔥',
      bonusPoints: 30,
      isUnlocked: (playerProfile?.stats.matchesPlayed || 0) >= 6,
    },
    {
      id: 'badge-trophy-collector',
      title: 'Colecionador de Taças',
      desc: 'Conquiste pelo menos 2 títulos oficiais no currículo profissional.',
      icon: '🏆',
      bonusPoints: 40,
      isUnlocked: trophies.length >= 2,
    },
    {
      id: 'badge-golden-ball',
      title: 'The Best do Mundo',
      desc: 'Entre para o Hall da Fama como o melhor jogador da temporada.',
      icon: '⭐',
      bonusPoints: 100,
      isUnlocked: (playerProfile?.overall || 0) >= 86,
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalBonusPoints = badges.filter((b) => b.isUnlocked).reduce((acc, b) => acc + b.bonusPoints, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topo */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              🎖️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                Hall da Fama & Conquistas
              </span>
              <h3 className="font-display text-base sm:text-lg font-black text-foreground">
                Medalhas Desbloqueáveis ({unlockedCount}/{badges.length})
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

        {/* Banner de Pontuação no Ranking */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-foreground block">
                Bônus no Ranking Online
              </span>
              <span className="text-[11px] text-muted-foreground">
                Cada medalha soma pontos na pontuação final da carreira.
              </span>
            </div>
          </div>

          <span className="font-mono text-sm font-black text-amber-400 bg-background/80 px-3 py-1 rounded-xl border border-amber-500/40">
            +{totalBonusPoints} pts
          </span>
        </div>

        {/* Grade de Conquistas */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                b.isUnlocked
                  ? 'bg-secondary/60 border-amber-500/50 shadow-sm'
                  : 'bg-secondary/20 border-border/50 opacity-60'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center text-xl shrink-0">
                {b.isUnlocked ? b.icon : '🔒'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-display text-xs font-black text-foreground truncate">
                    {b.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">
                    +{b.bonusPoints} pts
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                  {b.desc}
                </p>

                <div className="mt-2">
                  {b.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Desbloqueada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3" />
                      Em Progresso
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}