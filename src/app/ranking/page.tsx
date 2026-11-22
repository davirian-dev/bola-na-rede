'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { ClubBadge } from '@/components/game/ClubBadge';
import { EPIC_SKILLS_CATALOG } from '@/data/epicSkillsSeed';
import { Division } from '@/types/game';
import { 
  Trophy, 
  Crown, 
  Award, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Sparkles, 
  Zap, 
  Flame, 
  Shield, 
  ArrowLeft,
  ChevronRight,
  Info
} from 'lucide-react';

export default function RankingPage() {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const seasonYear = useGameStore((s) => s.seasonYear);
  const currentWeek = useGameStore((s) => s.currentWeek);
  const clubRankings = useGameStore((s) => s.clubRankings);
  const seasonAwardsHistory = useGameStore((s) => s.seasonAwardsHistory);

  type TabType = 'melhor_do_mundo' | 'melhor_tecnico' | 'ranking_clubes' | 'habilidades_epicas';
  const [activeTab, setActiveTab] = useState<TabType>('melhor_do_mundo');
  const [divisionFilter, setDivisionFilter] = useState<'ALL' | Division>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Gera Ranking Inicial dos 76 clubes se ainda não tiver virado temporada
  const defaultClubRankings = useMemo(() => {
    if (clubRankings && clubRankings.length > 0) return clubRankings;

    const allClubs = Object.values(clubs);
    const sorted = [...allClubs].sort((a, b) => {
      const getInitialPoints = (c: typeof a) => {
        if (c.rankingPoints) return c.rankingPoints;
        const divWeight = c.division === 'A' ? 240 : c.division === 'B' ? 140 : c.division === 'C' ? 70 : 30;
        return divWeight + c.reputation * 1.5;
      };
      return getInitialPoints(b) - getInitialPoints(a);
    });

    return sorted.map((c, idx) => ({
      rank: idx + 1,
      clubId: c.id,
      clubName: c.name,
      shortName: c.shortName,
      primaryColor: c.primaryColor,
      secondaryColor: c.secondaryColor,
      division: c.division,
      points: Math.round(c.rankingPoints || (c.division === 'A' ? 240 : c.division === 'B' ? 140 : c.division === 'C' ? 70 : 30) + c.reputation * 1.5),
      titlesCount: c.division === 'A' && idx < 5 ? 2 : 0,
      trend: 'same' as const,
    }));
  }, [clubRankings, clubs]);

  // Filtra clubes do Ranking Nacional
  const filteredRankings = useMemo(() => {
    return defaultClubRankings.filter((c) => {
      const matchDiv = divisionFilter === 'ALL' || c.division === divisionFilter;
      const matchSearch = c.clubName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiv && matchSearch;
    });
  }, [defaultClubRankings, divisionFilter, searchQuery]);

  // 2. Dados da última premiação ou projeção atual
  const latestAwards = useMemo(() => {
    if (seasonAwardsHistory && seasonAwardsHistory.length > 0) {
      return seasonAwardsHistory[0];
    }

    // Projeção dinâmica da temporada atual
    const userClub = mode === 'player' && playerProfile 
      ? clubs[playerProfile.clubId] || clubs['fla']
      : clubs['fla'];

    const userVotes = playerProfile 
      ? Math.round(playerProfile.stats.goals * 3.5 + playerProfile.stats.assists * 2.8 + playerProfile.stats.averageRating * 9.0 + playerProfile.overall * 0.45)
      : 80;

    return {
      year: seasonYear,
      worldBest: [
        {
          rank: 1 as const,
          name: mode === 'player' && playerProfile && userVotes >= 115 ? playerProfile.name : 'Vinícius Júnior',
          clubName: mode === 'player' && playerProfile && userVotes >= 115 ? userClub.name : 'Real Madrid / Seleção',
          clubPrimaryColor: '#00529f',
          clubSecondaryColor: '#ffffff',
          clubShortName: 'RM',
          statsLabel: mode === 'player' && playerProfile && userVotes >= 115 
            ? `${playerProfile.stats.goals} gols · ${playerProfile.stats.assists} assistências · Nota ${playerProfile.stats.averageRating}`
            : '28 gols · 14 assistências · Campeão da Champions & La Liga',
          votesPoints: Math.max(120, userVotes + 5),
          isUser: mode === 'player' && !!playerProfile && userVotes >= 115,
          avatarIcon: '⚡',
        },
        {
          rank: 2 as const,
          name: mode === 'player' && playerProfile && userVotes >= 100 && userVotes < 115 ? playerProfile.name : 'Erling Haaland',
          clubName: mode === 'player' && playerProfile && userVotes >= 100 && userVotes < 115 ? userClub.name : 'Manchester City',
          clubPrimaryColor: '#6cabdd',
          clubSecondaryColor: '#1c2c5b',
          clubShortName: 'MCI',
          statsLabel: '36 gols · Artilheiro da Premier League',
          votesPoints: 112,
          isUser: mode === 'player' && !!playerProfile && userVotes >= 100 && userVotes < 115,
          avatarIcon: '🎯',
        },
        {
          rank: 3 as const,
          name: mode === 'player' && playerProfile && userVotes < 100 && playerProfile.stats.goals >= 6 ? playerProfile.name : 'Kylian Mbappé',
          clubName: mode === 'player' && playerProfile && userVotes < 100 && playerProfile.stats.goals >= 6 ? userClub.name : 'Real Madrid',
          clubPrimaryColor: '#ffffff',
          clubSecondaryColor: '#00529f',
          clubShortName: 'RM',
          statsLabel: '31 gols · 11 assistências',
          votesPoints: 98,
          isUser: mode === 'player' && !!playerProfile && userVotes < 100 && playerProfile.stats.goals >= 6,
          avatarIcon: '🔥',
        },
      ],
      bestManager: [
        {
          rank: 1 as const,
          name: mode === 'manager' && managerProfile && managerProfile.stats.wins >= 25 ? managerProfile.name : 'Abel Ferreira',
          clubName: mode === 'manager' && managerProfile && managerProfile.stats.wins >= 25 ? (clubs[managerProfile.clubId]?.name || 'Palmeiras') : 'Palmeiras',
          clubPrimaryColor: '#05603a',
          clubSecondaryColor: '#ffffff',
          clubShortName: 'PAL',
          statsLabel: '34 vitórias em 48 jogos (75% de aproveitamento)',
          votesPoints: 145,
          isUser: mode === 'manager' && !!managerProfile && managerProfile.stats.wins >= 25,
          avatarIcon: '👔',
        },
        {
          rank: 2 as const,
          name: mode === 'manager' && managerProfile && managerProfile.stats.wins >= 15 && managerProfile.stats.wins < 25 ? managerProfile.name : 'Artur Jorge',
          clubName: 'Botafogo',
          clubPrimaryColor: '#18181b',
          clubSecondaryColor: '#ffffff',
          clubShortName: 'BOT',
          statsLabel: '31 vitórias em 48 jogos (71% de aproveitamento)',
          votesPoints: 132,
          isUser: mode === 'manager' && !!managerProfile && managerProfile.stats.wins >= 15 && managerProfile.stats.wins < 25,
          avatarIcon: '📋',
        },
        {
          rank: 3 as const,
          name: 'Dorival Júnior',
          clubName: 'Seleção Brasileira',
          clubPrimaryColor: '#fde047',
          clubSecondaryColor: '#16a34a',
          clubShortName: 'BRA',
          statsLabel: '29 vitórias em 48 jogos (68% de aproveitamento)',
          votesPoints: 120,
          isUser: false,
          avatarIcon: '🇧🇷',
        },
      ],
    };
  }, [seasonAwardsHistory, seasonYear, mode, playerProfile, managerProfile, clubs]);

  const userUnlockedSkills = playerProfile?.unlockedEpicSkills || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner de Apresentação */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-card/90 to-amber-950/20 border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary px-2.5 py-1 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Painel
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Gala do Futebol & Brasfoot
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            Rankings & Premiações Oficiais
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            A consagração máxima do esporte: Bola de Ouro (The Best), Melhor Técnico do Ano, Ranking Oficial dos 76 Clubes e a Árvore de Habilidades Épicas desbloqueadas por glórias históricas.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-4 py-3 rounded-2xl bg-secondary/80 border border-border text-center flex-1 md:flex-initial">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Temporada</span>
            <span className="text-base font-black text-foreground">{seasonYear}</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-secondary/80 border border-border text-center flex-1 md:flex-initial">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Semana Atual</span>
            <span className="text-base font-black text-emerald-500">{currentWeek} / 48</span>
          </div>
        </div>
      </div>

      {/* Seletor de Abas Estilo Brasfoot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-card border border-border rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('melhor_do_mundo')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'melhor_do_mundo'
              ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Crown className="w-4 h-4 shrink-0" />
          <span>Melhor do Mundo</span>
        </button>

        <button
          onClick={() => setActiveTab('melhor_tecnico')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'melhor_tecnico'
              ? 'bg-emerald-500 text-zinc-950 shadow-md font-black'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>Melhor Treinador</span>
        </button>

        <button
          onClick={() => setActiveTab('ranking_clubes')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ranking_clubes'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Trophy className="w-4 h-4 shrink-0" />
          <span>Ranking de Clubes</span>
        </button>

        <button
          onClick={() => setActiveTab('habilidades_epicas')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'habilidades_epicas'
              ? 'bg-purple-600 text-white shadow-md font-black'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Habilidades Épicas</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: MELHOR DO MUNDO (THE BEST / BOLA DE OURO) */}
      {activeTab === 'melhor_do_mundo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥇</span>
              <div>
                <h3 className="font-display text-base font-black text-amber-500 dark:text-amber-400">
                  Eleição da Bola de Ouro / The Best {seasonYear}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Votação apurada anualmente entre jornalistas, técnicos e capitães com base em gols, assistências, notas médias e títulos.
                </p>
              </div>
            </div>
            {mode === 'player' && playerProfile && (
              <div className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Seus Gols: <strong className="text-emerald-500">{playerProfile.stats.goals}</strong></span>
                <span>• Assistências: <strong className="text-emerald-500">{playerProfile.stats.assists}</strong></span>
                <span>• Média: <strong className="text-emerald-500">{playerProfile.stats.averageRating}</strong></span>
              </div>
            )}
          </div>

          {/* Pódio dos 3 Melhores do Mundo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestAwards.worldBest.map((candidate) => {
              const medalBadge = candidate.rank === 1 ? '🥇 BOLA DE OURO' : candidate.rank === 2 ? '🥈 BOLA DE PRATA' : '🥉 BOLA DE BRONZE';
              const cardBorder = candidate.rank === 1 ? 'border-amber-500/60 shadow-amber-500/10' : candidate.rank === 2 ? 'border-zinc-400/50' : 'border-amber-700/50';

              return (
                <div 
                  key={candidate.rank}
                  className={`p-6 rounded-3xl bg-card border ${cardBorder} shadow-lg relative flex flex-col justify-between overflow-hidden ${
                    candidate.rank === 1 ? 'md:-translate-y-2' : ''
                  }`}
                >
                  {candidate.rank === 1 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-zinc-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      O Melhor do Planeta
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        candidate.rank === 1 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : candidate.rank === 2 
                          ? 'bg-zinc-400/20 text-zinc-300' 
                          : 'bg-amber-800/20 text-amber-600'
                      }`}>
                        {medalBadge}
                      </span>
                      <span className="text-2xl">{candidate.avatarIcon || '⭐'}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-black text-foreground">
                          {candidate.name}
                        </h3>
                        {candidate.isUser && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-zinc-950 uppercase">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground block">
                        {candidate.clubName}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-secondary/70 border border-border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Desempenho & Estatísticas
                      </span>
                      <p className="text-xs font-semibold text-foreground">
                        {candidate.statsLabel}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Pontos da Votação
                      </span>
                      <span className="text-lg font-black text-amber-400">
                        {candidate.votesPoints} pts
                      </span>
                    </div>
                    {candidate.isUser && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                        Habilidade Aura de Ouro ✨
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Critérios de Votação */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-500" />
              Como Ganhar a Bola de Ouro?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="p-3 rounded-xl bg-secondary">
                <strong className="text-foreground block mb-0.5">⚽ Gols & Assistências</strong>
                Cada gol soma 3.5 pts e cada assistência soma 2.8 pts na votação global dos jurados.
              </div>
              <div className="p-3 rounded-xl bg-secondary">
                <strong className="text-foreground block mb-0.5">⭐ Média de Notas</strong>
                Manter notas acima de 7.5 ao longo de mais de 25 jogos concede peso de 9x na apuração.
              </div>
              <div className="p-3 rounded-xl bg-secondary">
                <strong className="text-foreground block mb-0.5">🏆 Títulos Oficiais</strong>
                Ser campeão da Copa do Brasil ou Série A adiciona bônus instantâneo de +35 pontos.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: MELHOR TÉCNICO DO ANO */}
      {activeTab === 'melhor_tecnico' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👔</span>
              <div>
                <h3 className="font-display text-base font-black text-emerald-500 dark:text-emerald-400">
                  Melhor Treinador do Ano {seasonYear}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Premiação de prancheta de ouro aos comandantes mais eficientes, avaliando aproveitamento de vitórias, títulos e solidez tática.
                </p>
              </div>
            </div>
            {mode === 'manager' && managerProfile && (
              <div className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-2">
                <span>Vitórias: <strong className="text-emerald-500">{managerProfile.stats.wins}</strong></span>
                <span>• Jogos: <strong className="text-emerald-500">{managerProfile.stats.matchesPlayed}</strong></span>
                <span>• Confiança: <strong className="text-emerald-500">{managerProfile.boardConfidence}%</strong></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestAwards.bestManager.map((candidate) => {
              const medalBadge = candidate.rank === 1 ? '🥇 TREINADOR DO ANO' : candidate.rank === 2 ? '🥈 PRANCHETA DE PRATA' : '🥉 PRANCHETA DE BRONZE';
              const cardBorder = candidate.rank === 1 ? 'border-emerald-500/60 shadow-emerald-500/10' : candidate.rank === 2 ? 'border-zinc-400/50' : 'border-amber-700/50';

              return (
                <div 
                  key={candidate.rank}
                  className={`p-6 rounded-3xl bg-card border ${cardBorder} shadow-lg relative flex flex-col justify-between overflow-hidden ${
                    candidate.rank === 1 ? 'md:-translate-y-2' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        candidate.rank === 1 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : candidate.rank === 2 
                          ? 'bg-zinc-400/20 text-zinc-300' 
                          : 'bg-amber-800/20 text-amber-600'
                      }`}>
                        {medalBadge}
                      </span>
                      <span className="text-2xl">{candidate.avatarIcon || '👔'}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-black text-foreground">
                          {candidate.name}
                        </h3>
                        {candidate.isUser && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-zinc-950 uppercase">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground block">
                        {candidate.clubName}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-secondary/70 border border-border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Registro Tático
                      </span>
                      <p className="text-xs font-semibold text-foreground">
                        {candidate.statsLabel}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Índice de Votos
                      </span>
                      <span className="text-lg font-black text-emerald-400">
                        {candidate.votesPoints} pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: RANKING NACIONAL DE CLUBES ESTILO BRASFOOT */}
      {activeTab === 'ranking_clubes' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-black text-foreground flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Ranking Nacional de Clubes (76 Clubes)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pontuação oficial acumulada a cada temporada no estilo clássico do Brasfoot: títulos e vices somam pontos para a glória histórica.
                </p>
              </div>

              {/* Busca de Clube */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar clube ou sigla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtros por Divisão */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
              {(['ALL', 'A', 'B', 'C', 'D', 'EUROPA'] as const).map((div) => (
                <button
                  key={div}
                  onClick={() => setDivisionFilter(div)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    divisionFilter === div
                      ? div === 'EUROPA'
                        ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                        : 'bg-blue-600 text-white font-black shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {div === 'ALL' ? 'Todos os Clubes (92)' : div === 'EUROPA' ? '👑 Europa (16)' : `Série ${div}`}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela do Ranking de Clubes */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 border-b border-border text-[10px] uppercase font-bold text-muted-foreground">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">Pos</th>
                    <th className="py-3 px-2 text-center w-8">Var</th>
                    <th className="py-3 px-4">Clube</th>
                    <th className="py-3 px-3 text-center">Divisão</th>
                    <th className="py-3 px-3 text-center">Títulos</th>
                    <th className="py-3 px-4 text-right">Pontos Totais</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRankings.map((c) => {
                    const isTop1 = c.rank === 1;
                    const isTop4 = c.rank <= 4;
                    const isUserClub = mode === 'player' 
                      ? playerProfile?.clubId === c.clubId 
                      : managerProfile?.clubId === c.clubId;

                    return (
                      <tr 
                        key={c.clubId}
                        className={`transition-colors hover:bg-secondary/40 ${
                          isUserClub ? 'bg-emerald-500/10 font-bold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-black">
                          {isTop1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs">
                              1
                            </span>
                          ) : (
                            <span className={`text-xs ${isTop4 ? 'text-amber-500 font-black' : 'text-muted-foreground'}`}>
                              #{c.rank}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {c.trend === 'up' ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                          ) : c.trend === 'down' ? (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-500 mx-auto" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-muted-foreground/60 mx-auto" />
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <ClubBadge
                              primaryColor={c.primaryColor}
                              secondaryColor={c.secondaryColor}
                              shortName={c.shortName}
                              size="sm"
                            />
                            <div>
                              <span className="font-bold text-foreground block">
                                {c.clubName}
                                {isUserClub && (
                                  <span className="ml-2 text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-zinc-950">
                                    SEU CLUBE
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {c.shortName}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                            c.division === 'A' ? 'bg-emerald-500/15 text-emerald-400' :
                            c.division === 'B' ? 'bg-blue-500/15 text-blue-400' :
                            c.division === 'C' ? 'bg-amber-500/15 text-amber-400' :
                            'bg-zinc-500/15 text-zinc-400'
                          }`}>
                            Série {c.division}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-muted-foreground">
                          {c.titlesCount > 0 ? (
                            <span className="text-amber-400 flex items-center justify-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {c.titlesCount}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-black text-sm text-foreground">
                            {c.points} <span className="text-[10px] text-muted-foreground font-normal">pts</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sistema de Pontuação explicativo */}
          <div className="p-5 rounded-3xl bg-secondary/60 border border-border space-y-3">
            <h4 className="font-display text-sm font-black text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Tabela de Pontos por Conquista (Estilo Brasfoot / CBF)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] uppercase font-bold text-emerald-500 block">Série A</span>
                <span className="font-bold text-foreground block">Campeão: +100 pts</span>
                <span className="text-muted-foreground text-[10px]">Vice: +60 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] uppercase font-bold text-amber-500 block">Copa do Brasil</span>
                <span className="font-bold text-foreground block">Campeão: +80 pts</span>
                <span className="text-muted-foreground text-[10px]">Vice: +45 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] uppercase font-bold text-blue-500 block">Série B</span>
                <span className="font-bold text-foreground block">Campeão: +50 pts</span>
                <span className="text-muted-foreground text-[10px]">Vice: +30 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] uppercase font-bold text-purple-500 block">Série C</span>
                <span className="font-bold text-foreground block">Campeão: +30 pts</span>
                <span className="text-muted-foreground text-[10px]">Vice: +18 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Série D</span>
                <span className="font-bold text-foreground block">Campeão: +20 pts</span>
                <span className="text-muted-foreground text-[10px]">Vice: +12 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Copa Sub-20</span>
                <span className="font-bold text-foreground block">Campeão: +25 pts</span>
                <span className="text-muted-foreground text-[10px]">Vice: +15 pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 4: HABILIDADES ÉPICAS DESBLOQUEÁVEIS */}
      {activeTab === 'habilidades_epicas' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <h3 className="font-display text-base font-black text-purple-400">
                  Árvore de Habilidades Épicas (Inovação Exclusiva)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ao ser artilheiro, líder de assistências, campeão ou vencer a Bola de Ouro, seu atleta desbloqueia superpoderes permanentes nos lances de jogo!
                </p>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-purple-400 flex items-center gap-1.5 self-start sm:self-auto">
              <Sparkles className="w-4 h-4" />
              <span>{userUnlockedSkills.length} de {EPIC_SKILLS_CATALOG.length} Habilidades Ativas</span>
            </div>
          </div>

          {/* Grid das 6 Habilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EPIC_SKILLS_CATALOG.map((skill) => {
              const isUnlocked = userUnlockedSkills.includes(skill.id);

              return (
                <div
                  key={skill.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                    isUnlocked
                      ? 'bg-card border-purple-500/60 shadow-lg shadow-purple-500/10'
                      : 'bg-card/60 border-border opacity-70 hover:opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{skill.icon}</span>
                      {isUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          DESBLOQUEADA
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-black text-[10px] uppercase">
                          BLOQUEADA 🔒
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-display text-lg font-black text-foreground">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {skill.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-secondary/70 border border-border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Como Desbloquear
                      </span>
                      <span className="text-xs font-bold text-amber-400 block">
                        {skill.unlockCondition}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                      Bônus de Mecânica no Jogo
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      {skill.inGameEffect}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
