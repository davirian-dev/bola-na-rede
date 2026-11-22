'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { ThemeToggle } from './ThemeToggle';
import { ClubBadge } from '@/components/game/ClubBadge';
import { ProModal } from '@/components/game/ProModal';
import { formatCurrency } from '@/lib/calculations';
import { 
  Trophy, 
  Coins, 
  Sparkles, 
  Calendar, 
  ShieldAlert, 
  User, 
  Briefcase,
  Crown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export function AppHeader() {
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
    if (!next) {
      sound.playWhistle();
    }
  };
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const seasonYear = useGameStore((s) => s.seasonYear);
  const currentWeek = useGameStore((s) => s.currentWeek);
  const planTier = useGameStore((s) => s.planTier);
  const trophies = useGameStore((s) => s.trophies);

  const activeClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;
  const currentClub = activeClubId ? clubs[activeClubId] : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Esquerda: Logo e Clube Atual */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/30">
            <Image
              src="/images/logo-icon.svg"
              alt="Bola na Rede Logo"
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-sm tracking-tight text-foreground flex items-center gap-1">
              BOLA NA <span className="text-emerald-500">REDE</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block -mt-1">
              CARREIRA
            </span>
          </div>
        </Link>

        {currentClub && (
          <div className="flex items-center gap-2 pl-3 border-l border-border/80">
            <ClubBadge
              primaryColor={currentClub.primaryColor}
              secondaryColor={currentClub.secondaryColor}
              shortName={currentClub.shortName}
              size="sm"
            />
            <div className="leading-tight">
              <span className="text-xs font-bold text-foreground block max-w-[120px] sm:max-w-[180px] truncate">
                {currentClub.name}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                Série {currentClub.division}
                {mode === 'player' && playerProfile?.isYouthTeam && (
                  <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 py-0.2 rounded text-[9px]">
                    Sub-20
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Centro / Direita: Status da Carreira */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Temporada e Semana */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{seasonYear}</span>
          <span className="text-muted-foreground">•</span>
          <span>Semana {currentWeek}</span>
        </div>

        {/* Saldo / Finanças */}
        {mode === 'player' && playerProfile && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>{formatCurrency(playerProfile.bankBalance)}</span>
          </div>
        )}

        {mode === 'manager' && currentClub && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>{formatCurrency(currentClub.budget)}</span>
          </div>
        )}

        {/* Rankings & Troféus */}
        <Link
          href="/ranking"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-amber-500 text-xs font-bold transition-all cursor-pointer"
          title="Ver The Best, Melhor Técnico e Ranking Nacional de Clubes"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Rankings & The Best</span>
          {trophies.length > 0 && (
            <span className="bg-amber-500 text-zinc-950 px-1 rounded text-[10px] font-black ml-0.5">
              {trophies.length}
            </span>
          )}
        </Link>

        {/* Badge Free/Pro Clicável */}
        <button
          onClick={() => setIsProModalOpen(true)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-transform active:scale-95 cursor-pointer flex items-center gap-1 ${
            planTier === 'pro'
              ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-border hover:border-amber-500/40'
          }`}
          title="Ver vantagens Bola na Rede PRO"
        >
          {planTier === 'pro' ? (
            <>
              <Crown className="w-3 h-3 text-zinc-950" />
              <span>PRO</span>
            </>
          ) : (
            <>
              <span>FREE</span>
              <span className="text-amber-500 font-black">★</span>
            </>
          )}
        </button>

        {/* Botão de Som Mudo / Ativo */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border transition-colors cursor-pointer"
          title={isMuted ? 'Ativar Efeitos Sonoros 🔊' : 'Mutar Efeitos Sonoros 🔇'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Seletor de Tema Claro/Escuro */}
        <ThemeToggle />
      </div>

      {/* Modal VIP / PRO */}
      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </header>
  );
}
