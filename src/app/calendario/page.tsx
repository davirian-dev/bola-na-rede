'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ClubBadge } from '@/components/game/ClubBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { 
  Calendar as CalendarIcon, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Wind, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Shield,
  Trophy
} from 'lucide-react';

export default function CalendarioPage() {
  const currentWeek = useGameStore((s) => s.currentWeek);
  const seasonYear = useGameStore((s) => s.seasonYear);
  const allFixtures = useGameStore((s) => s.allFixtures || []);
  const clubs = useGameStore((s) => s.clubs || {});
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const mode = useGameStore((s) => s.mode);
  const currentMatchWeather = useGameStore((s) => s.currentMatchWeather);

  const [selectedFilter, setSelectedFilter] = useState<'meu_clube' | 'todos'>('meu_clube');

  const userClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;

  // Filtrar partidas
  const myFixtures = allFixtures
    .filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId)
    .sort((a, b) => a.week - b.week);

  const activeFixtures = selectedFilter === 'meu_clube' 
    ? myFixtures 
    : allFixtures.filter((f) => f.week === currentWeek);

  const getWeatherIcon = (weather?: string) => {
    switch (weather) {
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'snowy': return <Snowflake className="w-4 h-4 text-cyan-200" />;
      case 'windy': return <Wind className="w-4 h-4 text-teal-300" />;
      default: return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  const getCompetitionBadge = (comp: string) => {
    switch (comp) {
      case 'copa_brasil': return { label: 'Copa do Brasil', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'sub_20': return { label: 'Sub-20', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      default: return { label: 'Campeonato Nacional', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppHeader />
      <GuestBanner />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row pb-24 md:pb-8">
        <DesktopSidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {/* Topo do Calendário */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Calendário da Temporada {seasonYear}</h1>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                Rodada Atual: <span className="text-emerald-400 font-semibold">Semana {currentWeek} de 48</span>
              </p>
            </div>

            {/* Filtro */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setSelectedFilter('meu_clube')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === 'meu_clube'
                    ? 'bg-emerald-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Meu Clube ({myFixtures.length})
              </button>
              <button
                onClick={() => setSelectedFilter('todos')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === 'todos'
                    ? 'bg-emerald-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Rodada {currentWeek} Geral
              </button>
            </div>
          </div>

          {/* Lista de Partidas */}
          <div className="space-y-3">
            {activeFixtures.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 p-6">
                <Clock className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">Nenhum confronto agendado para este filtro.</p>
              </div>
            ) : (
              activeFixtures.map((fixture) => {
                const home = clubs[fixture.homeClubId];
                const away = clubs[fixture.awayClubId];
                const isCurrent = fixture.week === currentWeek;
                const isPast = fixture.week < currentWeek || fixture.isPlayed;
                const isUserMatch = fixture.homeClubId === userClubId || fixture.awayClubId === userClubId;
                const compBadge = getCompetitionBadge(fixture.competition);

                return (
                  <div
                    key={fixture.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                        : isPast
                        ? 'bg-zinc-900/40 border-zinc-800/60 opacity-80'
                        : 'bg-zinc-900/70 border-zinc-800/80 hover:border-zinc-700'
                    } ${isUserMatch ? 'ring-1 ring-emerald-500/30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${compBadge.color}`}>
                          {compBadge.label}
                        </span>
                        <span className="font-medium text-zinc-300">Semana {fixture.week}</span>
                        {isCurrent && (
                          <span className="bg-emerald-500 text-zinc-950 font-bold px-1.5 py-0.2 text-[10px] rounded uppercase">
                            Jogo da Semana
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {getWeatherIcon(currentMatchWeather)}
                        <span className="capitalize">{currentMatchWeather || 'Ensolarado'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-1">
                      {/* Mandante */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right">
                        <span className={`font-semibold text-sm truncate ${fixture.homeClubId === userClubId ? 'text-emerald-400 font-bold' : 'text-zinc-200'}`}>
                          {home?.name || 'Clube Mandante'}
                        </span>
                        {home && (
                          <ClubBadge
                            primaryColor={home.primaryColor}
                            secondaryColor={home.secondaryColor}
                            shortName={home.shortName}
                            size="sm"
                          />
                        )}
                      </div>

                      {/* Placar / Versus */}
                      <div className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center min-w-[70px]">
                        {fixture.isPlayed ? (
                          <div className="flex items-center justify-center gap-2 font-mono font-bold text-base text-zinc-100">
                            <span>{fixture.homeGoals ?? 0}</span>
                            <span className="text-zinc-600">-</span>
                            <span>{fixture.awayGoals ?? 0}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">VS</span>
                        )}
                      </div>

                      {/* Visitante */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 justify-start text-left">
                        {away && (
                          <ClubBadge
                            primaryColor={away.primaryColor}
                            secondaryColor={away.secondaryColor}
                            shortName={away.shortName}
                            size="sm"
                          />
                        )}
                        <span className={`font-semibold text-sm truncate ${fixture.awayClubId === userClubId ? 'text-emerald-400 font-bold' : 'text-zinc-200'}`}>
                          {away?.name || 'Clube Visitante'}
                        </span>
                      </div>
                    </div>

                    {fixture.isPlayed && (fixture.scorers || []).length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                        {fixture.scorers?.map((s, idx) => (
                          <span key={idx}>
                            ⚽ {s.minute}&apos; {s.playerName || 'Jogador'} {s.assistPlayerName ? `(Assist: ${s.assistPlayerName})` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
