// ==============================================================================
// BOLA NA REDE: CARREIRA - QUICK MATCH SIMULATION ENGINE (src/engine/quickSim.ts)
// ==============================================================================

import { 
  Club, 
  Player, 
  Fixture, 
  GoalEvent, 
  CardEvent,
  OffsideEvent,
  GameState, 
  LeagueStanding, 
  TopScorer, 
  CompetitionType,
  Division 
} from '@/types/game';

interface MatchSimResult {
  homeGoals: number;
  awayGoals: number;
  scorers: GoalEvent[];
  cards: CardEvent[];
  offsides: OffsideEvent[];
  playerRatings: Record<string, number>;
  mvpPlayerId: string;
}

/**
 * Simula uma partida isolada de forma matemática, realista e determinística
 */
export function simulateMatch(
  homeClub: Club,
  awayClub: Club,
  isYouth: boolean = false,
  userPlayerId?: string,
  userState?: {
    playerSpecialties?: string[];
    managerClubId?: string;
    managerArchetype?: string;
  }
): MatchSimResult {
  const homeRoster = isYouth ? homeClub.youthRoster : homeClub.roster;
  const awayRoster = isYouth ? awayClub.youthRoster : awayClub.roster;

  // Seleciona os 11 titulares (ordenados por Overall)
  const homeLineup = [...homeRoster].sort((a, b) => b.overall - a.overall).slice(0, 11);
  const awayLineup = [...awayRoster].sort((a, b) => b.overall - a.overall).slice(0, 11);

  // Calcula força média dos elencos
  let homeAvg = homeLineup.reduce((acc, p) => acc + p.overall, 0) / (homeLineup.length || 1);
  let awayAvg = awayLineup.reduce((acc, p) => acc + p.overall, 0) / (awayLineup.length || 1);

  // Bônus tático se o treinador do usuário for Estrategista
  if (userState?.managerArchetype === 'strategist') {
    if (userState.managerClubId === homeClub.id) homeAvg *= 1.04;
    if (userState.managerClubId === awayClub.id) awayAvg *= 1.04;
  }

  // Fator casa (+5%) e variância aleatória para permitir zebras
  const homePower = (homeAvg * 1.05) + ((Math.random() - 0.48) * 12);
  const awayPower = awayAvg + ((Math.random() - 0.52) * 12);
  const powerDiff = (homePower - awayPower) / 10;

  // Gera número de gols esperados
  let homeExpected = Math.max(0, 1.35 + powerDiff * 0.45 + (Math.random() * 1.2 - 0.6));
  let awayExpected = Math.max(0, 1.05 - powerDiff * 0.45 + (Math.random() * 1.2 - 0.6));

  // Efeito Pragmático: Solidez defensiva reduz gols sofridos pelo time do treinador
  if (userState?.managerArchetype === 'pragmatic') {
    if (userState.managerClubId === homeClub.id) awayExpected *= 0.82;
    if (userState.managerClubId === awayClub.id) homeExpected *= 0.82;
  }

  let homeGoals = Math.min(7, Math.max(0, Math.round(homeExpected + (Math.random() > 0.7 ? 1 : 0))));
  let awayGoals = Math.min(7, Math.max(0, Math.round(awayExpected + (Math.random() > 0.7 ? 1 : 0))));

  // Efeito Motivador: Reação quando está atrás ou no empate
  if (userState?.managerArchetype === 'motivator') {
    if (userState.managerClubId === homeClub.id && homeGoals <= awayGoals && Math.random() < 0.35) {
      homeGoals += 1;
    }
    if (userState.managerClubId === awayClub.id && awayGoals <= homeGoals && Math.random() < 0.35) {
      awayGoals += 1;
    }
  }

  const scorers: GoalEvent[] = [];
  const playerRatings: Record<string, number> = {};

  // Inicializa notas base dos titulares (entre 5.8 e 6.4)
  [...homeLineup, ...awayLineup].forEach((p) => {
    let baseRating = 5.8 + Math.random() * 0.6;
    if (userPlayerId && p.id === userPlayerId && userState?.playerSpecialties?.includes('speed')) {
      baseRating += 0.3;
    }
    playerRatings[p.id] = Number(baseRating.toFixed(1));
  });

  // Função para sortear autor do gol e assistente
  const assignGoals = (teamLineup: Player[], count: number, clubId: string) => {
    const attackersAndMidfielders = teamLineup.filter((p) => 
      ['ATA', 'PE', 'PD', 'MEI', 'MC'].includes(p.position)
    );
    const pool = attackersAndMidfielders.length > 0 ? attackersAndMidfielders : teamLineup;

    for (let g = 0; g < count; g++) {
      // Se o usuário está no time e tem especialidade de finalização/ataque, aumenta a probabilidade
      let scorer: Player;
      const userInTeam = teamLineup.find((p) => p.id === userPlayerId);
      const userHasFinishing = userState?.playerSpecialties?.some((s) => ['finishing', 'attacking', 'heading'].includes(s));

      if (userInTeam && userHasFinishing && Math.random() < 0.45) {
        scorer = userInTeam;
      } else if (userInTeam && Math.random() < 0.28) {
        scorer = userInTeam;
      } else {
        scorer = pool[Math.floor(Math.random() * pool.length)];
      }

      const minute = Math.floor(Math.random() * 90) + 1;

      // Assistente em potencial (diferente do autor)
      const assistCandidates = teamLineup.filter((p) => p.id !== scorer.id);
      let assist: Player | undefined;

      if (Math.random() > 0.35 && assistCandidates.length > 0) {
        const userAsAssistant = assistCandidates.find((p) => p.id === userPlayerId);
        const userHasPassing = userState?.playerSpecialties?.some((s) => ['passing', 'playmaker', 'crossing'].includes(s));

        if (userAsAssistant && userHasPassing && Math.random() < 0.4) {
          assist = userAsAssistant;
        } else {
          assist = assistCandidates[Math.floor(Math.random() * assistCandidates.length)];
        }
      }

      scorers.push({
        playerId: scorer.id,
        playerName: scorer.nickname || scorer.name,
        clubId,
        minute,
        assistPlayerId: assist?.id,
        assistPlayerName: assist ? (assist.nickname || assist.name) : undefined,
      });

      // Bônus de nota
      playerRatings[scorer.id] = Math.min(10.0, Number(((playerRatings[scorer.id] || 6.0) + 1.2).toFixed(1)));
      if (assist) {
        playerRatings[assist.id] = Math.min(10.0, Number(((playerRatings[assist.id] || 6.0) + 0.7).toFixed(1)));
      }
    }
  };

  assignGoals(homeLineup, homeGoals, homeClub.id);
  assignGoals(awayLineup, awayGoals, awayClub.id);

  // Geração Realista de Cartões Amarelos e Vermelhos
  const cards: CardEvent[] = [];
  const assignCards = (teamLineup: Player[], clubId: string) => {
    teamLineup.forEach((p) => {
      const isDefensive = ['ZAG', 'VOL', 'LD', 'LE'].includes(p.position);
      const yellowChance = isDefensive ? 0.15 : 0.07;

      if (Math.random() < yellowChance) {
        const minute = Math.floor(Math.random() * 85) + 5;
        cards.push({
          playerId: p.id,
          playerName: p.nickname || p.name,
          clubId,
          minute,
          type: 'yellow',
          reason: 'Falta tática no meio de campo',
        });
        playerRatings[p.id] = Math.max(4.0, Number(((playerRatings[p.id] || 6.0) - 0.3).toFixed(1)));

        // Chance de 2º cartão amarelo (expulsão)
        if (Math.random() < 0.10) {
          const secondMin = Math.min(90, minute + Math.floor(Math.random() * 25) + 5);
          cards.push({
            playerId: p.id,
            playerName: p.nickname || p.name,
            clubId,
            minute: secondMin,
            type: 'red',
            reason: 'Segundo cartão amarelo por entrada dura',
          });
          playerRatings[p.id] = Math.max(3.5, Number(((playerRatings[p.id] || 6.0) - 1.2).toFixed(1)));
        }
      } else if (Math.random() < 0.012) {
        // Vermelho direto por agressão ou corte como último homem
        const redMin = Math.floor(Math.random() * 80) + 10;
        cards.push({
          playerId: p.id,
          playerName: p.nickname || p.name,
          clubId,
          minute: redMin,
          type: 'red',
          reason: 'Vermelho direto por falta perigosa como último homem',
        });
        playerRatings[p.id] = Math.max(3.0, Number(((playerRatings[p.id] || 6.0) - 1.8).toFixed(1)));
      }
    });
  };

  assignCards(homeLineup, homeClub.id);
  assignCards(awayLineup, awayClub.id);

  // Geração Realista de Impedimentos (Regra Oficial do Impedimento & Gols Anulados pelo VAR)
  const offsides: OffsideEvent[] = [];
  const assignOffsides = (attackingLineup: Player[], attackingClubId: string) => {
    const attackers = attackingLineup.filter(p => ['ATA', 'PD', 'PE', 'MEI'].includes(p.position));
    if (attackers.length === 0) return;

    // Número de impedimentos na partida para a equipe (normalmente 1 a 3)
    const offsidesCount = Math.floor(Math.random() * 3) + (Math.random() < 0.4 ? 1 : 0);

    for (let i = 0; i < offsidesCount; i++) {
      const p = attackers[Math.floor(Math.random() * attackers.length)];
      const minute = Math.floor(Math.random() * 88) + 2;
      
      // Chance de ser um gol anulado pelo VAR (10% dos lances de impedimento)
      const isDisallowedGoal = Math.random() < 0.10;

      offsides.push({
        playerId: p.id,
        playerName: p.nickname || p.name,
        clubId: attackingClubId,
        minute,
        disallowedGoal: isDisallowedGoal,
        varReviewed: isDisallowedGoal,
      });

      if (isDisallowedGoal) {
        // Leve queda na nota por precipitação
        playerRatings[p.id] = Math.max(5.0, Number(((playerRatings[p.id] || 6.0) - 0.2).toFixed(1)));
      }
    }
  };

  assignOffsides(homeLineup, homeClub.id);
  assignOffsides(awayLineup, awayClub.id);

  // Bônus para defesas e goleiros se não sofreram gols (Clean Sheet)
  if (awayGoals === 0) {
    homeLineup.filter((p) => ['GOL', 'ZAG', 'LD', 'LE'].includes(p.position)).forEach((p) => {
      playerRatings[p.id] = Math.min(10.0, Number(((playerRatings[p.id] || 6.0) + 0.8).toFixed(1)));
    });
  }
  if (homeGoals === 0) {
    awayLineup.filter((p) => ['GOL', 'ZAG', 'LD', 'LE'].includes(p.position)).forEach((p) => {
      playerRatings[p.id] = Math.min(10.0, Number(((playerRatings[p.id] || 6.0) + 0.8).toFixed(1)));
    });
  }

  // Define MVP (jogador com maior nota da partida)
  let bestPlayerId = homeLineup[0]?.id || '';
  let bestRating = 0;
  Object.entries(playerRatings).forEach(([id, rating]) => {
    if (rating > bestRating) {
      bestRating = rating;
      bestPlayerId = id;
    }
  });

  return {
    homeGoals,
    awayGoals,
    scorers,
    cards,
    offsides,
    playerRatings,
    mvpPlayerId: bestPlayerId,
  };
}

/**
 * Simula todas as partidas agendadas da semana e atualiza as tabelas de classificação
 */
export function simulateWeekMatches(state: GameState): {
  updatedFixtures: Fixture[];
  updatedLeagues: typeof state.leagues;
  updatedSub20: typeof state.sub20Tournament;
  updatedCopa: typeof state.copaDoBrasil;
  updatedTopScorers: typeof state.topScorers;
  simulatedMatchesCount: number;
} {
  const currentWeek = state.currentWeek;
  const updatedFixtures = [...state.allFixtures];
  const updatedLeagues = { ...state.leagues };
  const updatedSub20 = { ...state.sub20Tournament };
  const updatedCopa = { ...state.copaDoBrasil };

  // Inicializa mapa de artilharia se necessário
  const topScorersMap: Record<CompetitionType, Record<string, TopScorer>> = {
    serie_a: {},
    serie_b: {},
    serie_c: {},
    serie_d: {},
    sub_20: {},
    copa_brasil: {},
    champions_league: {},
    premier_league: {},
    championship: {},
    la_liga: {},
    segunda_division: {},
    serie_a_ita: {},
    serie_b_ita: {},
    bundesliga: {},
    bundesliga_2: {},
    ligue_1: {},
    ligue_2: {},
  };

  // Carrega artilharia existente
  if (state.topScorers) {
    (Object.keys(topScorersMap) as CompetitionType[]).forEach((comp) => {
      (state.topScorers[comp] || []).forEach((item) => {
        topScorersMap[comp][item.playerId] = { ...item };
      });
    });
  }

  let simulatedMatchesCount = 0;

  // Atualiza uma linha da tabela de pontos corridos
  const updateStanding = (
    standings: LeagueStanding[],
    clubId: string,
    goalsFor: number,
    goalsAgainst: number
  ) => {
    const idx = standings.findIndex((s) => s.clubId === clubId);
    if (idx === -1) return;

    const row = { ...standings[idx] };
    row.played += 1;
    row.goalsFor += goalsFor;
    row.goalsAgainst += goalsAgainst;
    row.goalDifference = row.goalsFor - row.goalsAgainst;

    if (goalsFor > goalsAgainst) {
      row.wins += 1;
      row.points += 3;
    } else if (goalsFor === goalsAgainst) {
      row.draws += 1;
      row.points += 1;
    } else {
      row.losses += 1;
    }

    standings[idx] = row;
  };

  // Simula cada jogo agendado para esta semana
  updatedFixtures.forEach((fixture, index) => {
    if (fixture.week !== currentWeek || fixture.isPlayed) return;

    const homeClub = state.clubs[fixture.homeClubId];
    const awayClub = state.clubs[fixture.awayClubId];
    if (!homeClub || !awayClub) return;

    const result = simulateMatch(
      homeClub,
      awayClub,
      fixture.isYouth || fixture.competition === 'sub_20',
      state.playerProfile?.id,
      {
        playerSpecialties: state.playerProfile?.specialties,
        managerClubId: state.managerProfile?.clubId,
        managerArchetype: state.managerProfile?.archetype,
      }
    );

    // Marca como jogado e guarda estatísticas
    updatedFixtures[index] = {
      ...fixture,
      homeGoals: result.homeGoals,
      awayGoals: result.awayGoals,
      isPlayed: true,
      scorers: result.scorers,
      cards: result.cards,
      offsides: result.offsides,
      mvpPlayerId: result.mvpPlayerId,
      ratings: result.playerRatings,
    };

    simulatedMatchesCount++;

    // Atualiza tabela da competição correspondente (Séries A-D e Champions League / Europa)
    if (fixture.competition.startsWith('serie_') || fixture.competition === 'champions_league') {
      const div: Division = (fixture.division || (fixture.competition === 'champions_league' ? 'EUROPA' : fixture.competition.split('_')[1].toUpperCase())) as Division;
      if (updatedLeagues[div]) {
        const standingsCopy = [...updatedLeagues[div].standings];
        updateStanding(standingsCopy, homeClub.id, result.homeGoals, result.awayGoals);
        updateStanding(standingsCopy, awayClub.id, result.awayGoals, result.homeGoals);
        
        // Ordena tabela por Pontos > Vitórias > Saldo de Gols > Gols Pró
        standingsCopy.sort((a, b) => 
          b.points - a.points || 
          b.wins - a.wins || 
          b.goalDifference - a.goalDifference || 
          b.goalsFor - a.goalsFor
        );

        updatedLeagues[div] = {
          ...updatedLeagues[div],
          standings: standingsCopy,
        };
      }
    } else if (fixture.competition === 'sub_20' && updatedSub20) {
      const sub20StandingsCopy = [...updatedSub20.standings];
      updateStanding(sub20StandingsCopy, homeClub.id, result.homeGoals, result.awayGoals);
      updateStanding(sub20StandingsCopy, awayClub.id, result.awayGoals, result.homeGoals);
      
      sub20StandingsCopy.sort((a, b) => 
        b.points - a.points || 
        b.wins - a.wins || 
        b.goalDifference - a.goalDifference || 
        b.goalsFor - a.goalsFor
      );

      updatedSub20.standings = sub20StandingsCopy;
    }

    // Registra artilheiros na competição
    const compKey = fixture.competition;
    result.scorers.forEach((scorer) => {
      const club = scorer.clubId === homeClub.id ? homeClub : awayClub;
      if (!topScorersMap[compKey][scorer.playerId]) {
        topScorersMap[compKey][scorer.playerId] = {
          playerId: scorer.playerId,
          playerName: scorer.playerName,
          clubId: club.id,
          clubName: club.name,
          goals: 0,
          assists: 0,
          matches: 1,
          competition: compKey,
        };
      }
      topScorersMap[compKey][scorer.playerId].goals += 1;

      if (scorer.assistPlayerId) {
        if (!topScorersMap[compKey][scorer.assistPlayerId]) {
          topScorersMap[compKey][scorer.assistPlayerId] = {
            playerId: scorer.assistPlayerId,
            playerName: scorer.assistPlayerName || 'Jogador',
            clubId: club.id,
            clubName: club.name,
            goals: 0,
            assists: 0,
            matches: 1,
            competition: compKey,
          };
        }
        topScorersMap[compKey][scorer.assistPlayerId].assists += 1;
      }
    });
  });

  // Converte mapas de artilheiros em arrays ordenados (Top 20 de cada)
  const updatedTopScorers = {} as Record<CompetitionType, TopScorer[]>;
  (Object.keys(topScorersMap) as CompetitionType[]).forEach((comp) => {
    updatedTopScorers[comp] = Object.values(topScorersMap[comp])
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
      .slice(0, 20);
  });

  return {
    updatedFixtures,
    updatedLeagues,
    updatedSub20,
    updatedCopa,
    updatedTopScorers,
    simulatedMatchesCount,
  };
}
