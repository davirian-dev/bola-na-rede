// ==============================================================================
// BOLA NA REDE: CARREIRA - SEASON END & PROMOTION/RELEGATION (src/engine/seasonEnd.ts)
// ==============================================================================

import { GameState, Trophy, Club, Division, Player } from '@/types/game';
import { generateAnnualCalendar } from './calendar';
import { calculateSeasonAwards, updateClubRankings, checkAndUnlockEpicSkills } from './awardsEngine';

export interface SeasonSummaryResult {
  nextState: Partial<GameState>;
  summary: {
    year: number;
    champions: {
      serieA: string;
      serieB: string;
      serieC: string;
      serieD: string;
      copa: string;
      sub20: string;
    };
    promoted: Record<string, string[]>;
    relegated: Record<string, string[]>;
    userWonTrophy: boolean;
  };
}

/**
 * Processa o término da temporada (semana 48), acessos, rebaixamentos e nova temporada
 */
export function processSeasonEnd(state: GameState): SeasonSummaryResult {
  const currentYear = state.seasonYear;
  const nextYear = currentYear + 1;

  // 1. Identifica os campeões de cada liga
  const aStandings = state.leagues.A.standings;
  const bStandings = state.leagues.B.standings;
  const cStandings = state.leagues.C.standings;
  const dStandings = state.leagues.D.standings;
  const europaStandings = state.leagues.EUROPA?.standings || [];
  const sub20Standings = state.sub20Tournament.standings;

  const champA = state.clubs[aStandings[0]?.clubId] || state.clubs['fla'];
  const champB = state.clubs[bStandings[0]?.clubId] || state.clubs['spo'];
  const champC = state.clubs[cStandings[0]?.clubId] || state.clubs['rem'];
  const champD = state.clubs[dStandings[0]?.clubId] || state.clubs['agu_mar'];
  const champEuropa = state.clubs[europaStandings[0]?.clubId] || state.clubs['rma'];
  const champSub20 = state.clubs[sub20Standings[0]?.clubId] || state.clubs['pal'];

  // Campeão da Copa do Brasil (vencedor da final ou fallback)
  const finalFixture = state.copaDoBrasil.fixtures.find((f) => f.stage === 'final' && f.isPlayed);
  let champCopa = champA;
  let viceCopa = state.clubs['pal'] || champB;
  if (finalFixture) {
    const isHomeWinner = (finalFixture.homeGoals || 0) >= (finalFixture.awayGoals || 0);
    const winnerId = isHomeWinner ? finalFixture.homeClubId : finalFixture.awayClubId;
    const runnerId = isHomeWinner ? finalFixture.awayClubId : finalFixture.homeClubId;
    champCopa = state.clubs[winnerId] || champA;
    viceCopa = state.clubs[runnerId] || champB;
  }

  // Vices das Ligas
  const viceAId = aStandings[1]?.clubId || 'pal';
  const viceBId = bStandings[1]?.clubId || 'san';
  const viceCId = cStandings[1]?.clubId || 'fig';
  const viceDId = dStandings[1]?.clubId || 'brasil_pel';
  const viceSub20Id = sub20Standings[1]?.clubId || 'cor';

  // 2. Acesso e Rebaixamento (G4 sobem, Z4 descem)
  const rebaixadosA = aStandings.slice(-4).map((s) => s.clubId);
  const promovidosB = bStandings.slice(0, 4).map((s) => s.clubId);
  const rebaixadosB = bStandings.slice(-4).map((s) => s.clubId);
  const promovidosC = cStandings.slice(0, 4).map((s) => s.clubId);
  const rebaixadosC = cStandings.slice(-4).map((s) => s.clubId);
  const promovidosD = dStandings.slice(0, 4).map((s) => s.clubId);

  // Atualiza as divisões nos clubes
  const updatedClubs: Record<string, Club> = {};

  Object.values(state.clubs).forEach((club) => {
    let newDiv = club.division;

    if (club.division === 'A' && rebaixadosA.includes(club.id)) newDiv = 'B';
    else if (club.division === 'B') {
      if (promovidosB.includes(club.id)) newDiv = 'A';
      else if (rebaixadosB.includes(club.id)) newDiv = 'C';
    } else if (club.division === 'C') {
      if (promovidosC.includes(club.id)) newDiv = 'B';
      else if (rebaixadosC.includes(club.id)) newDiv = 'D';
    } else if (club.division === 'D' && promovidosD.includes(club.id)) {
      newDiv = 'C';
    }

    // Envelhecimento dos jogadores (+1 ano)
    const agePlayer = (p: Player): Player => ({
      ...p,
      age: p.age + 1,
      contractWeeks: Math.max(0, p.contractWeeks - 48),
    });

    const newRoster = club.roster.map(agePlayer);
    const newYouth = club.youthRoster.map(agePlayer);

    updatedClubs[club.id] = {
      ...club,
      division: newDiv,
      reputation: newDiv === 'A' ? Math.min(95, club.reputation + 4) : newDiv === 'D' ? Math.max(45, club.reputation - 4) : club.reputation,
      roster: newRoster,
      youthRoster: newYouth,
    };
  });

  // 3. Verifica se o usuário conquistou algum troféu
  const userClubId = state.mode === 'player'
    ? state.playerProfile?.clubId
    : state.managerProfile?.clubId;

  const newTrophies: Trophy[] = [...state.trophies];
  let userWonTrophy = false;

  const checkUserTitle = (champ: Club, title: string, cat: Trophy['category'], div?: Division) => {
    if (userClubId && champ.id === userClubId) {
      userWonTrophy = true;
      newTrophies.push({
        id: `trophy-${cat}-${currentYear}-${Date.now()}`,
        title: `${title} ${currentYear}`,
        seasonYear: currentYear,
        category: cat,
        division: div,
        awardedTo: state.mode === 'player' ? (state.playerProfile?.name || 'Jogador') : (state.managerProfile?.name || 'Treinador'),
      });
    }
  };

  checkUserTitle(champA, 'Campeão Brasileiro Série A', 'league', 'A');
  checkUserTitle(champB, 'Campeão Brasileiro Série B', 'league', 'B');
  checkUserTitle(champC, 'Campeão Brasileiro Série C', 'league', 'C');
  checkUserTitle(champD, 'Campeão Brasileiro Série D', 'league', 'D');
  checkUserTitle(champEuropa, 'Campeão da Champions League', 'league', 'EUROPA');
  checkUserTitle(champCopa, 'Campeão da Copa do Brasil', 'cup');
  if (state.mode === 'player' && state.playerProfile?.isYouthTeam) {
    checkUserTitle(champSub20, 'Campeão da Copa Sub-20', 'league');
  }

  // 4. Calcula Premiações de Fim de Temporada (The Best, Melhor Técnico, Revelação)
  const seasonAwards = calculateSeasonAwards(state, {
    champA,
    champCopa,
    champSub20,
  });

  // 5. Atualiza o Ranking Nacional de Clubes estilo Brasfoot (76 clubes brasileiros com pontos)
  const rankingsResult = updateClubRankings({ ...state, clubs: updatedClubs }, {
    champAId: champA.id,
    viceAId,
    champBId: champB.id,
    viceBId,
    champCId: champC.id,
    viceCId,
    champDId: champD.id,
    viceDId,
    champCopaId: champCopa.id,
    viceCopaId: viceCopa.id,
    champSub20Id: champSub20.id,
    viceSub20Id,
  });

  const finalClubs = rankingsResult.updatedClubs;

  // 6. Regenera o calendário para o próximo ano
  const nextCalendar = generateAnnualCalendar(finalClubs, nextYear);

  // 7. Envelhece o atleta do usuário e checa Habilidades Épicas
  let updatedPlayerProfile = state.playerProfile;
  let epicSkillNewsText = '';

  if (updatedPlayerProfile) {
    const isTopScorer = updatedPlayerProfile.stats.goals >= 12;
    const isTopAssist = updatedPlayerProfile.stats.assists >= 7;
    const isWorldBest = seasonAwards.worldBest[0]?.isUser === true;
    const isChampion = userWonTrophy;

    const skillResult = checkAndUnlockEpicSkills(updatedPlayerProfile, {
      isTopScorer,
      isTopAssist,
      isWorldBest,
      isChampion,
    });

    updatedPlayerProfile = {
      ...updatedPlayerProfile,
      age: updatedPlayerProfile.age + 1,
      unlockedEpicSkills: skillResult.updatedSkills,
    };

    if (skillResult.newlyUnlocked.length > 0) {
      epicSkillNewsText = `O craque ${updatedPlayerProfile.name} atingiu feitos lendários e desbloqueou novas Habilidades Épicas em sua árvore de talentos!`;
    }
  }

  let updatedManagerProfile = state.managerProfile;
  if (updatedManagerProfile) {
    updatedManagerProfile = {
      ...updatedManagerProfile,
      age: updatedManagerProfile.age + 1,
    };
  }

  const seasonSummary = {
    year: currentYear,
    champions: {
      serieA: champA.name,
      serieB: champB.name,
      serieC: champC.name,
      serieD: champD.name,
      copa: champCopa.name,
      sub20: champSub20.name,
    },
    promoted: {
      paraSerieA: promovidosB.map((id) => state.clubs[id]?.name || id),
      paraSerieB: promovidosC.map((id) => state.clubs[id]?.name || id),
      paraSerieC: promovidosD.map((id) => state.clubs[id]?.name || id),
    },
    relegated: {
      paraSerieB: rebaixadosA.map((id) => state.clubs[id]?.name || id),
      paraSerieC: rebaixadosB.map((id) => state.clubs[id]?.name || id),
      paraSerieD: rebaixadosC.map((id) => state.clubs[id]?.name || id),
    },
    userWonTrophy,
  };

  const awardsNews = [
    {
      id: `news-ballon-dor-${currentYear}-${Date.now()}`,
      week: 1,
      seasonYear: nextYear,
      category: 'destaque' as const,
      headline: `The Best / Bola de Ouro ${currentYear}: ${seasonAwards.worldBest[0]?.name} é eleito o Melhor do Mundo!`,
      body: `Em cerimônia de gala, ${seasonAwards.worldBest[0]?.name} superou ${seasonAwards.worldBest[1]?.name} e ${seasonAwards.worldBest[2]?.name} para receber a honraria máxima do futebol internacional.`,
    },
    {
      id: `news-manager-award-${currentYear}-${Date.now() + 1}`,
      week: 1,
      seasonYear: nextYear,
      category: 'destaque' as const,
      headline: `Mestre da Prancheta: ${seasonAwards.bestManager[0]?.name} vence o prêmio de Melhor Técnico do Ano!`,
      body: `Comandando o ${seasonAwards.bestManager[0]?.clubName}, o estrategista foi consagrado como o treinador mais influente da temporada.`,
    },
  ];

  if (epicSkillNewsText) {
    awardsNews.push({
      id: `news-epic-skills-${currentYear}-${Date.now() + 2}`,
      week: 1,
      seasonYear: nextYear,
      category: 'destaque' as const,
      headline: `⭐ Ascensão Lendária: Novas Habilidades Épicas Despertadas!`,
      body: epicSkillNewsText,
    });
  }

  return {
    summary: seasonSummary,
    nextState: {
      seasonYear: nextYear,
      currentWeek: 1,
      clubs: finalClubs,
      clubRankings: rankingsResult.rankingItems,
      seasonAwardsHistory: [seasonAwards, ...(state.seasonAwardsHistory || [])],
      leagues: nextCalendar.leagues,
      copaDoBrasil: nextCalendar.copaDoBrasil,
      sub20Tournament: nextCalendar.sub20Tournament,
      allFixtures: nextCalendar.allFixtures,
      playerProfile: updatedPlayerProfile,
      managerProfile: updatedManagerProfile,
      trophies: newTrophies,
      lastSeasonSummary: seasonSummary,
      seasonSummaryModalOpen: true,
      newsFeed: [
        ...awardsNews,
        {
          id: `news-season-${nextYear}-${Date.now()}`,
          week: 1,
          seasonYear: nextYear,
          category: 'titulo',
          headline: `Temporada ${nextYear} do futebol brasileiro iniciada oficialmente!`,
          body: `Após consagração do ${champA.name} na Série A e acesso dos clubes promovidos, os novos desafios começam rumo à glória máxima.`,
        },
        ...state.newsFeed.slice(0, 25),
      ],
      lastSavedAt: new Date().toISOString(),
    },
  };
}
