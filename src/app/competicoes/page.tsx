'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Division, CompetitionType } from '@/types/game';
import { ClubBadge } from '@/components/game/ClubBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { 
  Trophy, 
  TrendingUp, 
  Flame, 
  Medal, 
  ShieldCheck, 
  Users, 
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function CompeticoesPage() {
  const leagues = useGameStore((s) => s.leagues);
  const sub20Tournament = useGameStore((s) => s.sub20Tournament);
  const copaDoBrasil = useGameStore((s) => s.copaDoBrasil);
  const topScorers = useGameStore((s) => s.topScorers);
  const clubs = useGameStore((s) => s.clubs);
  const seasonYear = useGameStore((s) => s.seasonYear);
  const currentWeek = useGameStore((s) => s.currentWeek);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const mode = useGameStore((s) => s.mode);

  const [activeTab, setActiveTab] = useState<Division | 'sub_20' | 'copa'>('A');
  const [subTab, setSubTab] = useState<'tabela' | 'artilharia' | 'mata_mata'>('tabela');

  const userClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;

  // Competição ativa para artilharia
  const compKey: CompetitionType = 
    activeTab === 'sub_20' ? 'sub_20' :
    activeTab === 'copa' ? 'copa_brasil' :
    activeTab === 'EUROPA' ? 'champions_league' :
    `serie_${activeTab.toLowerCase()}` as CompetitionType;

  const currentScorers = topScorers?.[compKey] || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Header da Página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Competições Nacionais • {seasonYear}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Classificação oficial, artilharia, mata-mata da Copa do Brasil e torneio de Base Sub-20.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Semana {currentWeek} de 48</span>
            </div>
          </div>

          {/* Abas das Competições */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            {(['A', 'B', 'C', 'D', 'EUROPA'] as Division[]).map((div) => {
              const isEuropa = div === 'EUROPA';
              const isSelected = activeTab === div;

              return (
                <button
                  key={div}
                  onClick={() => {
                    setActiveTab(div);
                    setSubTab('tabela');
                  }}
                  className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? isEuropa
                        ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                        : 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isEuropa ? '👑 Champions • Europa' : `Brasileirão Série ${div}`}
                </button>
              );
            })}

            <button
              onClick={() => {
                setActiveTab('sub_20');
                setSubTab('tabela');
              }}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sub_20'
                  ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Base Sub-20 (Copinha)
            </button>

            <button
              onClick={() => {
                setActiveTab('copa');
                setSubTab('mata_mata');
              }}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'copa'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Copa do Brasil
            </button>
          </div>

          {/* Sub-Abas: Tabela vs Artilharia */}
          {activeTab !== 'copa' && (
            <div className="flex items-center gap-3 border-b border-border/60 pb-2 text-xs font-bold">
              <button
                onClick={() => setSubTab('tabela')}
                className={`pb-1 transition-colors cursor-pointer ${
                  subTab === 'tabela'
                    ? 'text-emerald-500 border-b-2 border-emerald-500 font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tabela de Pontos
              </button>
              <button
                onClick={() => setSubTab('artilharia')}
                className={`pb-1 transition-colors cursor-pointer ${
                  subTab === 'artilharia'
                    ? 'text-emerald-500 border-b-2 border-emerald-500 font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Artilharia & Assistências
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* TABELA DE PONTOS CORRIDOS (Séries A, B, C, D ou Sub-20) */}
          {/* ============================================================ */}
          {subTab === 'tabela' && activeTab !== 'copa' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-foreground">
                    {activeTab === 'sub_20' ? sub20Tournament?.name : leagues[activeTab]?.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {activeTab === 'A' ? 'G4 (Libertadores/Título)' : activeTab === 'EUROPA' ? 'G4 (Semifinais Champions)' : 'G4 (Acesso)'}
                    </span>
                    {activeTab !== 'D' && activeTab !== 'sub_20' && activeTab !== 'EUROPA' && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-destructive" />
                        Z4 (Rebaixamento)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-2 text-center">#</th>
                      <th className="py-2.5 px-3">Clube</th>
                      <th className="py-2.5 px-2 text-center font-black">P</th>
                      <th className="py-2.5 px-2 text-center">J</th>
                      <th className="py-2.5 px-2 text-center">V</th>
                      <th className="py-2.5 px-2 text-center">E</th>
                      <th className="py-2.5 px-2 text-center">D</th>
                      <th className="py-2.5 px-2 text-center">GP</th>
                      <th className="py-2.5 px-2 text-center">GC</th>
                      <th className="py-2.5 px-2 text-center">SG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(activeTab === 'sub_20' ? sub20Tournament?.standings : leagues[activeTab]?.standings)?.map((team, idx) => {
                      const isMyTeam = team.clubId === userClubId;
                      const isG4 = idx < 4;
                      const totalTeams = (activeTab === 'sub_20' ? sub20Tournament?.standings : leagues[activeTab]?.standings)?.length || 20;
                      const isZ4 = activeTab !== 'D' && activeTab !== 'sub_20' && activeTab !== 'EUROPA' && idx >= totalTeams - 4;

                      return (
                        <tr
                          key={team.clubId}
                          className={`transition-colors ${
                            isMyTeam 
                              ? 'bg-emerald-500/15 font-bold' 
                              : isG4 
                              ? 'bg-emerald-500/5 hover:bg-emerald-500/10' 
                              : isZ4 
                              ? 'bg-destructive/5 hover:bg-destructive/10' 
                              : 'hover:bg-secondary/40'
                          }`}
                        >
                          <td className="py-2.5 px-2 text-center font-mono font-bold">
                            <span
                              className={`inline-block w-5 h-5 rounded-full leading-5 text-[10px] text-center ${
                                isG4 ? 'bg-emerald-500 text-zinc-950 font-black' : isZ4 ? 'bg-destructive text-white font-bold' : 'text-muted-foreground'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            <ClubBadge
                              primaryColor={team.primaryColor}
                              secondaryColor="#ffffff"
                              shortName={team.shortName}
                              size="sm"
                            />
                            <span className="truncate max-w-[130px] sm:max-w-none text-foreground font-bold">
                              {team.clubName}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-black text-foreground">
                            {team.points}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.played}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.wins}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.draws}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.losses}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.goalsFor}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.goalsAgainst}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">{team.goalDifference}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ARTILHARIA E LÍDERES DE ASSISTÊNCIA */}
          {/* ============================================================ */}
          {subTab === 'artilharia' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <h3 className="font-display text-xl font-black text-foreground flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                Artilheiros da Competição
              </h3>

              {currentScorers.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  Nenhum gol registrado nesta competição ainda. Avance semanas para simular os jogos!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-2 text-center">#</th>
                        <th className="py-2.5 px-3">Jogador</th>
                        <th className="py-2.5 px-3">Clube</th>
                        <th className="py-2.5 px-2 text-center">Gols</th>
                        <th className="py-2.5 px-2 text-center">Assists</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {currentScorers.slice(0, 10).map((scorer, i) => (
                        <tr key={scorer.playerId} className="hover:bg-secondary/40 transition-colors">
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            {scorer.playerName}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {scorer.clubName}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-black text-emerald-500 text-sm">
                            {scorer.goals}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-muted-foreground">
                            {scorer.assists}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* CHAVEAMENTO DA COPA DO BRASIL (MATA-MATA) */}
          {/* ============================================================ */}
          {activeTab === 'copa' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Copa do Brasil • Mata-Mata
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    16 clubes das 4 divisões em jogos eliminatórios até a grande final.
                  </p>
                </div>
              </div>

              {/* Fases: Oitavas, Quartas, Semi e Final */}
              {(['oitavas', 'quartas', 'semi', 'final'] as const).map((stage) => {
                const stageFixtures = copaDoBrasil?.fixtures?.filter((f) => f.stage === stage) || [];
                const stageNames = {
                  oitavas: 'Oitavas de Final (Semanas 10 e 15)',
                  quartas: 'Quartas de Final (Semanas 22 e 28)',
                  semi: 'Semifinais (Semanas 34 e 39)',
                  final: 'Grande Final (Semanas 42 e 45)',
                };

                return (
                  <div key={stage} className="space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500 block">
                      {stageNames[stage]}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stageFixtures.map((fixture) => {
                        const home = clubs[fixture.homeClubId];
                        const away = clubs[fixture.awayClubId];

                        return (
                          <div
                            key={fixture.id}
                            className="p-3.5 rounded-xl bg-secondary/60 border border-border flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1 truncate">
                              <ClubBadge
                                primaryColor={home?.primaryColor || '#10b981'}
                                secondaryColor={home?.secondaryColor || '#ffffff'}
                                shortName={home?.shortName || 'CAS'}
                                size="sm"
                              />
                              <span className="font-bold text-foreground truncate">
                                {home?.name}
                              </span>
                            </div>

                            <div className="px-3 py-1 rounded bg-card border border-border font-mono font-black text-sm">
                              {fixture.isPlayed ? `${fixture.homeGoals} x ${fixture.awayGoals}` : 'vs'}
                            </div>

                            <div className="flex items-center justify-end gap-2 flex-1 truncate text-right">
                              <span className="font-bold text-foreground truncate">
                                {away?.name}
                              </span>
                              <ClubBadge
                                primaryColor={away?.primaryColor || '#0284c7'}
                                secondaryColor={away?.secondaryColor || '#ffffff'}
                                shortName={away?.shortName || 'VIS'}
                                size="sm"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
