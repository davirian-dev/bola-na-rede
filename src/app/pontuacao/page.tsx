'use client';

import React from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { calculateCareerScore } from '@/engine/scoringEngine';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { 
  Trophy, 
  BarChart3, 
  Sparkles, 
  Award, 
  Globe, 
  ShieldCheck, 
  Flame, 
  Coins, 
  ChevronRight,
  Star,
  Zap,
  Info
} from 'lucide-react';

export default function PontuacaoPage() {
  const state = useGameStore();
  const careerScore = calculateCareerScore(state);
  const playerProfile = state.playerProfile;
  const managerProfile = state.managerProfile;
  const currentActorName = playerProfile?.name || managerProfile?.name || 'Seu Personagem';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Sistema de Pontuação • Hall da Fama
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Regras oficiais de cálculo de pontuação para o ranking global de carreiras.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="py-2 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              Voltar ao Dashboard
            </Link>
          </div>

          {/* Aviso Oficial (Bola na Rede: Carreira) */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              Ao final de sua carreira, sua pontuação é calculada com base nos títulos, prêmios e conquistas listados abaixo. Ela determina sua posição no <strong className="text-amber-400">Hall da Fama</strong>.
            </p>
          </div>

          {/* Card do Progresso Atual da Sua Carreira */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-card via-card to-emerald-950/20 border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block">
                  Status Atual da Sua Carreira
                </span>
                <h3 className="font-display text-2xl font-black text-foreground">
                  {currentActorName}
                </h3>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5 justify-center sm:justify-start">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {careerScore.rankTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-start">
              <div className="text-center">
                <span className="text-3xl font-black text-emerald-500 font-display">
                  {careerScore.totalPoints}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block -mt-1">
                  Pontos Totais
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black text-amber-400 font-display">
                  {careerScore.trophiesCount}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block -mt-1">
                  Troféus
                </span>
              </div>
            </div>
          </div>

          {/* TABELAS OFICIAIS DE PONTUAÇÃO (Bola na Rede: Carreira) */}
          <div className="space-y-4">
            {/* 1. Títulos de Liga */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-amber-400 flex items-center gap-2">
                🏆 Títulos de Liga
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🥉 Campeão Série D / Sub-20', pts: '+3 pts' },
                  { name: '🥉 Campeão Série C', pts: '+5 pts' },
                  { name: '🥈 Campeão Série B', pts: '+7 pts' },
                  { name: '🥇 Campeão Série A', pts: '+12 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Copas Nacionais & Estaduais */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-emerald-400 flex items-center gap-2">
                🏆 Copas Nacionais & Regionais
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🏆 Campeão da Copa do Brasil', pts: '+10 pts' },
                  { name: '🥈 Vice da Copa do Brasil', pts: '+5 pts' },
                  { name: '🏆 Campeão Estadual / Copa do Nordeste', pts: '+6 pts' },
                  { name: '🥈 Vice Estadual / Copa do Nordeste', pts: '+3 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Copas Continentais */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-blue-400 flex items-center gap-2">
                🌎 Copas Continentais
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🏆 Campeão da Libertadores', pts: '+18 pts' },
                  { name: '🥈 Vice da Libertadores', pts: '+9 pts' },
                  { name: '🏆 Campeão da Sul-Americana', pts: '+14 pts' },
                  { name: '🥈 Vice da Sul-Americana', pts: '+7 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Torneios Internacionais & Copa do Mundo */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-amber-500 flex items-center gap-2">
                🌐 Internacionais & Copa do Mundo
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🏆 Campeão Copa do Mundo (Seleção Brasileira)', pts: '+40 pts' },
                  { name: '🥈 Vice Copa do Mundo', pts: '+20 pts' },
                  { name: '⭐ Campeão Super Mundial FIFA', pts: '+36 pts' },
                  { name: '🥈 Vice Super Mundial FIFA', pts: '+18 pts' },
                  { name: '🏆 Campeão da Champions League', pts: '+25 pts' },
                  { name: '🥈 Vice da Champions League', pts: '+12 pts' },
                  { name: '🏆 Campeão Mundial de Clubes', pts: '+23 pts' },
                  { name: '🏆 Campeão da Europa League', pts: '+18 pts' },
                  { name: '🏆 Campeão da Premier League / La Liga / Serie A / Bundesliga', pts: '+20 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Copas Nacionais Internacionais */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-sky-400 flex items-center gap-2">
                🏴 Copas Nacionais Internacionais
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🏆 FA Cup (Inglaterra)', pts: '+14 pts' },
                  { name: '🏆 Copa del Rey (Espanha)', pts: '+14 pts' },
                  { name: '🏆 Coupe de France (França)', pts: '+14 pts' },
                  { name: '🏆 Coppa Italia (Itália)', pts: '+14 pts' },
                  { name: '🏆 Taça de Portugal', pts: '+14 pts' },
                  { name: '🏆 DFB-Pokal (Alemanha)', pts: '+14 pts' },
                  { name: '🥈 Vice de Copa Nacional Internacional', pts: '+7 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Artilheiro / Assist / Muralha / Desarme em Copas */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-teal-400 flex items-center gap-2">
                🏅 Artilheiro / Assist / Muralha / Desarme em Copas
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🇧🇷 Estadual — 7+ gols · 5+ assist · 7+ CS · 21+ desarmes', pts: '+1 pt' },
                  { name: '🌍 Copas Nacionais Internacionais (FA/Copa del Rey...)', pts: '+1 pt' },
                  { name: '🇧🇷 Copa do Brasil — 5+ gols · 4+ assist · 5+ CS · 15+ desarmes', pts: '+2 pts' },
                  { name: '🌎 Sul-Americana — 5+ gols · 3+ assist · 5+ CS · 15+ desarmes', pts: '+2 pts' },
                  { name: '🇪🇺 Europa League — 5+ gols · 3+ assist · 5+ CS · 15+ desarmes', pts: '+2 pts' },
                  { name: '🌎 Libertadores — 7+ gols · 4+ assist · 7+ CS · 21+ desarmes', pts: '+3 pts' },
                  { name: '⭐ Champions League — 6+ gols · 4+ assist · 6+ CS · 18+ desarmes', pts: '+3 pts' },
                  { name: '🏆 Mundial de Clubes — 3+ gols · 2+ assist · 3+ CS · 9+ desarmes', pts: '+3 pts' },
                  { name: '🌍 Copa do Mundo — 4+ gols · 3+ assist · 4+ CS · 12+ desarmes', pts: '+4 pts' },
                  { name: '👑 Super Mundial FIFA — 7+ gols · 3+ assist · 7+ CS · 21+ desarmes', pts: '+4 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Prêmios Individuais */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-rose-400 flex items-center gap-2">
                🌟 Prêmios Individuais (Liga)
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🌟 Bola de Ouro (Melhor do Mundo)', pts: '+10 pts' },
                  { name: '⚽ Artilheiro do Campeonato', pts: '+5 pts' },
                  { name: '👟 Líder em Assistências (Garçom)', pts: '+4 pts' },
                  { name: '🧤 Luva de Ouro (Melhor Goleiro)', pts: '+5 pts' },
                  { name: '🛡️ Muralha (Melhor Defensor / Zagueiro)', pts: '+4 pts' },
                  { name: '🎩 Hat-trick (3+ gols na mesma partida)', pts: '+5 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Patrimônio & Bens (Vida Pessoal) */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="font-display text-base font-black text-emerald-400 flex items-center gap-2">
                🏡 Patrimônio & Bens (Vida de Boleiro)
              </h3>
              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { name: '🏡 Casa da Mãe Resolvida (Sonho de Infância)', pts: '+8 pts' },
                  { name: '🚗 Ter Carro Próprio Esportivo', pts: '+2 pts' },
                  { name: '⌚ Relógio de Marca Suíço', pts: '+1 pt' },
                  { name: '🚤 Lancha no Litoral', pts: '+4 pts' },
                  { name: '🏢 Cobertura de Luxo Duplex', pts: '+6 pts' },
                  { name: '✈️ Jatinho Particular Executivo', pts: '+10 pts' },
                  { name: '💰 Dinheiro Acumulado no Banco (Escala Logarítmica)', pts: '+0 a +10 pts' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-secondary/50">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-emerald-500 font-mono font-black">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dica de Carreira */}
          <div className="p-4 rounded-2xl bg-secondary/60 border border-border text-xs text-muted-foreground text-center">
            💡 <strong className="text-foreground">Dica de Mestre:</strong> Carreiras mais longas (16 a 24 temporadas) rendem mais tempo para acumular títulos de expressão, ligas internacionais e compras de patrimônio de luxo. Os maiores pontuadores entram no topo do Hall da Fama!
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
