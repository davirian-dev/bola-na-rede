'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Flame,
  Award,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NationalTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'sub_20' | 'senior';
}

export function NationalTeamModal({ isOpen, onClose, tier }: NationalTeamModalProps) {
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const mode = useGameStore((s) => s.mode);

  if (!isOpen) return null;

  const actorName = mode === 'player'
    ? (playerProfile?.nickname || playerProfile?.name || 'Craque')
    : (managerProfile?.name || 'Professor');

  const isSub20 = tier === 'sub_20';

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#facc15', '#16a34a', '#2563eb', '#ffffff'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border-4 border-yellow-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative flex flex-col items-center text-center overflow-hidden">
        
        {/* Glow Amarelo Canarinho */}
        <div className="absolute top-0 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brasão Pentacampeão */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-zinc-950 flex flex-col items-center justify-center shadow-xl shadow-yellow-500/30 border-2 border-white mb-4 animate-bounce">
          <span className="text-xs font-black tracking-widest">★★★★★</span>
          <span className="font-display text-2xl font-black">CBF</span>
          <span className="text-[9px] font-bold uppercase">BRASIL</span>
        </div>

        <span className="px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-500 dark:text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {isSub20 ? 'Seleção Brasileira Sub-20' : 'Seleção Brasileira Principal'}
        </span>

        <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground mb-2">
          VOCÊ FOI CONVOCADO! 🇧🇷
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
          O técnico da Seleção Brasileira anunciou a lista oficial e o nome de <strong className="text-foreground">{actorName}</strong> está entre os escolhidos para vestir a Amarelinha!
        </p>

        {/* Card de Impacto da Convocação */}
        <div className="w-full p-4 rounded-2xl bg-secondary/50 border border-border space-y-2.5 mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Competição Internacional:</span>
            <span className="text-yellow-500 font-black">
              {isSub20 ? 'Sul-Americano Sub-20' : 'Copa do Mundo FIFA'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Bônus de Moral & Fama:</span>
            <span className="text-emerald-500 font-black">+25% Reputação Global ⭐</span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Valor de Mercado:</span>
            <span className="text-blue-500 font-black">+35% Valorização 💰</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCelebrate}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/25 transition-transform active:scale-95 cursor-pointer"
        >
          <Award className="w-5 h-5 fill-current" />
          Vestir a Camisa da Seleção! 🇧🇷
        </button>
      </div>
    </div>
  );
}