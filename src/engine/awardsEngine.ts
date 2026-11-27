// ==============================================================================
// BOLA NA REDE: CARREIRA - AWARDS & CLUB RANKINGS ENGINE (src/engine/awardsEngine.ts)
// Melhor do Mundo, Melhor Técnico, Ranking Nacional de Clubes & Habilidades Épicas
// ==============================================================================

import { 
  GameState, 
  SeasonAwards, 
  AwardCandidate, 
  ClubRankingItem, 
  Club
} from '@/types/game';

/**
 * Pontos atribuídos no Ranking Nacional de Clubes estilo Brasfoot / CBF
 */
export const CLUB_RANKING_POINTS = {
  serieA: { champion: 100, runnerUp: 60, top4: 40 },
  copaDoBrasil: { champion: 80, runnerUp: 45, semi: 25 },
  serieB: { champion: 50, runnerUp: 30, top4: 20 },
  serieC: { champion: 30, runnerUp: 18, top4: 12 },
  serieD: { champion: 20, runnerUp: 12, top4: 8 },
  sub20: { champion: 25, runnerUp: 15 },
};

/**
 * Calcula a premiação de Melhor do Mundo e Melhor Técnico do Ano
 */
export function calculateSeasonAwards(
  state: GameState,
  champions: {
    champA: Club;
    champCopa: Club;
    champSub20: Club;
  }
): SeasonAwards {
  const year = state.seasonYear;

  // 1. ELEIÇÃO DO MELHOR DO MUNDO (BOLA DE OURO / THE BEST)
  const candidatePool: {
    name: string;
    club: Club;
    statsLabel: string;
    votesPoints: number;
    isUser: boolean;
    avatarIcon?: string;
  }[] = [];

  // Se o usuário estiver no Modo Jogador, calcula sua votação real
  if (state.mode === 'player' && state.playerProfile) {
    const p = state.playerProfile;
    const userClub = state.clubs[p.clubId] || champions.champA;
    const userWonTitle = [champions.champA.id, champions.champCopa.id, champions.champSub20.id].includes(p.clubId);

    const votes = Math.round(
      (p.stats.goals * 3.5) +
      (p.stats.assists * 2.8) +
      (p.stats.averageRating * 9.0) +
      (p.overall * 0.45) +
      (userWonTitle ? 35 : 0) +
      (p.reputation * 0.3)
    );

    candidatePool.push({
      name: p.name,
      club: userClub,
      statsLabel: `${p.stats.goals} gols · ${p.stats.assists} assistências · Nota ${p.stats.averageRating}`,
      votesPoints: votes,
      isUser: true,
      avatarIcon: '⭐',
    });
  }

  // Candidatos IA do Brasileirão e do Mundo
  const starAiPlayers = [
    { name: 'Vinícius Júnior', club: champions.champA, goals: 28, assists: 14, rating: 8.4, over: 90, avatar: '⚡' },
    { name: 'Erling Haaland', club: champions.champA, goals: 36, assists: 6, rating: 8.3, over: 91, avatar: '🎯' },
    { name: 'Kylian Mbappé', club: champions.champA, goals: 31, assists: 11, rating: 8.2, over: 91, avatar: '🔥' },
    { name: 'Rodrygo Silva', club: champions.champCopa, goals: 22, assists: 16, rating: 8.1, over: 88, avatar: '👟' },
    { name: 'Jude Bellingham', club: champions.champA, goals: 21, assists: 15, rating: 8.2, over: 90, avatar: '🪄' },
  ];

  starAiPlayers.forEach((ai) => {
    const votes = Math.round(
      (ai.goals * 3.5) + (ai.assists * 2.8) + (ai.rating * 9.0) + (ai.over * 0.45) + Math.random() * 15
    );
    candidatePool.push({
      name: ai.name,
      club: ai.club,
      statsLabel: `${ai.goals} gols · ${ai.assists} assistências · Nota ${ai.rating}`,
      votesPoints: votes,
      isUser: false,
      avatarIcon: ai.avatar,
    });
  });

  candidatePool.sort((a, b) => b.votesPoints - a.votesPoints);

  const worldBest: AwardCandidate[] = candidatePool.slice(0, 3).map((c, idx) => ({
    rank: (idx + 1) as 1 | 2 | 3,
    name: c.name,
    clubName: c.club.name,
    clubPrimaryColor: c.club.primaryColor,
    clubSecondaryColor: c.club.secondaryColor,
    clubShortName: c.club.shortName,
    statsLabel: c.statsLabel,
    votesPoints: c.votesPoints,
    isUser: c.isUser,
    avatarIcon: c.avatarIcon,
  }));

  // 2. ELEIÇÃO DO MELHOR TÉCNICO DO ANO
  const managerCandidates: {
    name: string;
    club: Club;
    statsLabel: string;
    votesPoints: number;
    isUser: boolean;
  }[] = [];

  if (state.mode === 'manager' && state.managerProfile) {
    const m = state.managerProfile;
    const userClub = state.clubs[m.clubId] || champions.champA;
    const userWonTitle = [champions.champA.id, champions.champCopa.id].includes(m.clubId);
    const winRate = m.stats.matchesPlayed > 0 
      ? Math.round((m.stats.wins / m.stats.matchesPlayed) * 100) 
      : 50;

    const mgrVotes = Math.round(
      (m.stats.wins * 4) +
      (m.stats.draws * 1.5) +
      (winRate * 0.8) +
      (m.boardConfidence * 0.4) +
      (userWonTitle ? 45 : 0) +
      (m.reputation * 0.3)
    );

    managerCandidates.push({
      name: m.name,
      club: userClub,
      statsLabel: `${m.stats.wins} vitórias em ${m.stats.matchesPlayed} jogos (${winRate}% de aproveitamento)`,
      votesPoints: mgrVotes,
      isUser: true,
    });
  }

  // Treinadores IA de destaque
  const aiManagers = [
    { name: 'Abel Ferreira', club: champions.champA, wins: 34, games: 48, winRate: 75 },
    { name: 'Artur Jorge', club: champions.champA, wins: 31, games: 48, winRate: 71 },
    { name: 'Dorival Júnior', club: champions.champCopa, wins: 29, games: 48, winRate: 68 },
    { name: 'Renato Gaúcho', club: champions.champA, wins: 27, games: 48, winRate: 64 },
  ];

  aiManagers.forEach((ai) => {
    const mgrVotes = Math.round((ai.wins * 4) + (ai.winRate * 0.8) + 35 + Math.random() * 15);
    managerCandidates.push({
      name: ai.name,
      club: ai.club,
      statsLabel: `${ai.wins} vitórias em ${ai.games} jogos (${ai.winRate}% de aproveitamento)`,
      votesPoints: mgrVotes,
      isUser: false,
    });
  });

  managerCandidates.sort((a, b) => b.votesPoints - a.votesPoints);

  const bestManager: AwardCandidate[] = managerCandidates.slice(0, 3).map((m, idx) => ({
    rank: (idx + 1) as 1 | 2 | 3,
    name: m.name,
    clubName: m.club.name,
    clubPrimaryColor: m.club.primaryColor,
    clubSecondaryColor: m.club.secondaryColor,
    clubShortName: m.club.shortName,
    statsLabel: m.statsLabel,
    votesPoints: m.votesPoints,
    isUser: m.isUser,
    avatarIcon: '👔',
  }));

  // 3. REVELAÇÃO DA BASE (SUB-20)
  const bestYouth: AwardCandidate[] = [
    {
      rank: 1,
      name: state.mode === 'player' && state.playerProfile?.isYouthTeam ? state.playerProfile.name : 'Estêvão Willian',
      clubName: state.mode === 'player' && state.playerProfile?.isYouthTeam ? (state.clubs[state.playerProfile.clubId]?.name || 'Palmeiras') : 'Palmeiras',
      clubPrimaryColor: '#05603a',
      clubSecondaryColor: '#ffffff',
      clubShortName: 'PAL',
      statsLabel: 'Destaque absoluto da Copinha Sub-20',
      votesPoints: 94,
      isUser: state.mode === 'player' && !!state.playerProfile?.isYouthTeam,
      avatarIcon: '🌟',
    },
    {
      rank: 2,
      name: 'Lorran Lucas',
      clubName: 'Flamengo',
      clubPrimaryColor: '#c5161d',
      clubSecondaryColor: '#111827',
      clubShortName: 'FLA',
      statsLabel: '12 gols e 8 assistências na Base',
      votesPoints: 88,
      isUser: false,
      avatarIcon: '⚡',
    },
    {
      rank: 3,
      name: 'Breno Bidon',
      clubName: 'Corinthians',
      clubPrimaryColor: '#18181b',
      clubSecondaryColor: '#ffffff',
      clubShortName: 'COR',
      statsLabel: 'Meia armador com visão privilegiada',
      votesPoints: 82,
      isUser: false,
      avatarIcon: '🪄',
    },
  ];

  return {
    year,
    worldBest,
    bestManager,
    bestYouth,
  };
}

/**
 * Atualiza os pontos de todos os 76 clubes brasileiros no Ranking Nacional de Clubes
 */
export function updateClubRankings(
  state: GameState,
  results: {
    champAId: string;
    viceAId: string;
    champBId: string;
    viceBId: string;
    champCId: string;
    viceCId: string;
    champDId: string;
    viceDId: string;
    champCopaId: string;
    viceCopaId: string;
    champSub20Id: string;
    viceSub20Id: string;
  }
): { updatedClubs: Record<string, Club>; rankingItems: ClubRankingItem[] } {
  const currentClubs = { ...state.clubs };
  const prevRankings = state.clubRankings || [];

  // Atribui pontos da temporada
  const addPoints = (clubId: string, pts: number) => {
    if (currentClubs[clubId]) {
      currentClubs[clubId] = {
        ...currentClubs[clubId],
        rankingPoints: (currentClubs[clubId].rankingPoints || 0) + pts,
      };
    }
  };

  // Série A
  addPoints(results.champAId, CLUB_RANKING_POINTS.serieA.champion);
  addPoints(results.viceAId, CLUB_RANKING_POINTS.serieA.runnerUp);

  // Copa do Brasil
  addPoints(results.champCopaId, CLUB_RANKING_POINTS.copaDoBrasil.champion);
  addPoints(results.viceCopaId, CLUB_RANKING_POINTS.copaDoBrasil.runnerUp);

  // Série B
  addPoints(results.champBId, CLUB_RANKING_POINTS.serieB.champion);
  addPoints(results.viceBId, CLUB_RANKING_POINTS.serieB.runnerUp);

  // Série C
  addPoints(results.champCId, CLUB_RANKING_POINTS.serieC.champion);
  addPoints(results.viceCId, CLUB_RANKING_POINTS.serieC.runnerUp);

  // Série D
  addPoints(results.champDId, CLUB_RANKING_POINTS.serieD.champion);
  addPoints(results.viceDId, CLUB_RANKING_POINTS.serieD.runnerUp);

  // Sub-20
  addPoints(results.champSub20Id, CLUB_RANKING_POINTS.sub20.champion);
  addPoints(results.viceSub20Id, CLUB_RANKING_POINTS.sub20.runnerUp);

  // Ordena todos os clubes pelo total acumulado
  const sortedClubs = Object.values(currentClubs).sort((a, b) => {
    const ptsA = a.rankingPoints || (a.division === 'EUROPA' ? 500 : a.division === 'A' ? 240 : a.division === 'B' ? 140 : a.division === 'C' ? 70 : 30);
    const ptsB = b.rankingPoints || (b.division === 'EUROPA' ? 500 : b.division === 'A' ? 240 : b.division === 'B' ? 140 : b.division === 'C' ? 70 : 30);
    return ptsB - ptsA;
  });

  const rankingItems: ClubRankingItem[] = sortedClubs.map((club, index) => {
    const currentRank = index + 1;
    const prevItem = prevRankings.find((r) => r.clubId === club.id);
    const prevRank = prevItem ? prevItem.rank : currentRank;

    let trend: 'up' | 'down' | 'same' = 'same';
    if (currentRank < prevRank) trend = 'up';
    else if (currentRank > prevRank) trend = 'down';

    const points = club.rankingPoints || (club.division === 'EUROPA' ? 500 : club.division === 'A' ? 240 : club.division === 'B' ? 140 : club.division === 'C' ? 70 : 30);

    return {
      rank: currentRank,
      clubId: club.id,
      clubName: club.name,
      shortName: club.shortName,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
      division: club.division,
      points,
      titlesCount: (club.id === results.champAId || club.id === results.champCopaId) ? 1 : 0,
      trend,
    };
  });

  return { updatedClubs: currentClubs, rankingItems };
}

/**
 * Checa e desbloqueia Habilidades Épicas do Atleta com base nas conquistas do ano
 */
export function checkAndUnlockEpicSkills(
  player: NonNullable<GameState['playerProfile']>,
  conditions: {
    isTopScorer: boolean;
    isTopAssist: boolean;
    isWorldBest: boolean;
    isChampion: boolean;
  }
): { updatedSkills: string[]; newlyUnlocked: string[] } {
  const currentSkills = new Set(player.unlockedEpicSkills || []);
  const newlyUnlocked: string[] = [];

  // 1. Trivela Fatal: Artilheiro
  if (conditions.isTopScorer && !currentSkills.has('epic_trivela')) {
    currentSkills.add('epic_trivela');
    newlyUnlocked.push('epic_trivela');
  }

  // 2. Passe Teleguiado: Líder em Assistências
  if (conditions.isTopAssist && !currentSkills.has('epic_teleguiado')) {
    currentSkills.add('epic_teleguiado');
    newlyUnlocked.push('epic_teleguiado');
  }

  // 3. Aura de Ouro: Melhor do Mundo
  if (conditions.isWorldBest && !currentSkills.has('epic_aura_ouro')) {
    currentSkills.add('epic_aura_ouro');
    newlyUnlocked.push('epic_aura_ouro');
  }

  // 4. Canhota de Fogo: 15+ gols no ano
  if (player.stats.goals >= 15 && !currentSkills.has('epic_canhota_fogo')) {
    currentSkills.add('epic_canhota_fogo');
    newlyUnlocked.push('epic_canhota_fogo');
  }

  // 5. Frieza Glacial: Campeão de Copa ou Série A
  if (conditions.isChampion && !currentSkills.has('epic_frieza')) {
    currentSkills.add('epic_frieza');
    newlyUnlocked.push('epic_frieza');
  }

  // 6. Segundo Pulmão: 25+ jogos com nota >= 7.0
  if (player.stats.matchesPlayed >= 25 && player.stats.averageRating >= 7.0 && !currentSkills.has('epic_segundo_pulmao')) {
    currentSkills.add('epic_segundo_pulmao');
    newlyUnlocked.push('epic_segundo_pulmao');
  }

  return {
    updatedSkills: Array.from(currentSkills),
    newlyUnlocked,
  };
}