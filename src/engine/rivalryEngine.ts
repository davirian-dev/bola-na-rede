// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE RIVALIDADE PESSOAL (src/engine/rivalryEngine.ts)
// Duelo da Temporada ⚔️: Craque vs Craque ou Técnico vs Técnico durante todo o ano
// ==============================================================================

import { SeasonRivalry, Club, Player } from '@/types/game';

export function initializeSeasonRivalry(
  seasonYear: number,
  mode: 'player' | 'manager',
  userClub: Club,
  allClubs: Record<string, Club>
): SeasonRivalry {
  // Procura clubes da mesma divisão que não sejam o do usuário
  const sameDivisionClubs = Object.values(allClubs).filter((c) => 
    c.id !== userClub.id && c.division === userClub.division
  );

  const rivalClubPool = sameDivisionClubs.length > 0 ? sameDivisionClubs : Object.values(allClubs).filter((c) => c.id !== userClub.id);
  const rivalClub = rivalClubPool[Math.floor(Math.random() * rivalClubPool.length)] || userClub;

  if (mode === 'player') {
    // Escolhe o atacante ou meia de maior overall do clube rival
    const stars = (rivalClub.roster || []).filter((p) => 
      ['ATA', 'PE', 'PD', 'MEI', 'MC'].includes(p.position)
    ).sort((a, b) => b.overall - a.overall);

    const rivalPlayer = stars[0] || (rivalClub.roster && rivalClub.roster[0]) || {
      id: 'rival-star-1',
      name: 'Gabriel Fenômeno',
      overall: 82,
      position: 'ATA',
    };

    return {
      seasonYear,
      rivalId: rivalPlayer.id,
      rivalName: rivalPlayer.name,
      rivalClubId: rivalClub.id,
      rivalClubName: rivalClub.name,
      rivalClubShortName: rivalClub.shortName,
      rivalPrimaryColor: rivalClub.primaryColor,
      rivalAvatarIcon: '⚡',
      rivalRole: `Artilheiro do ${rivalClub.name}`,
      rivalOverall: rivalPlayer.overall,
      stats: {
        userGoals: 0,
        rivalGoals: 0,
        userAssists: 0,
        rivalAssists: 0,
        userAverageRating: 6.5,
        rivalAverageRating: 6.8,
        userWins: 0,
        rivalWins: 0,
        matchesPlayed: 0,
      },
      winnerDetermined: false,
    };
  } else {
    // Modo Treinador: Rivaliza com o técnico adversário
    const managerNames = [
      'Abel Ferreira',
      'Renato Gaúcho',
      'Rogério Ceni',
      'Dorival Júnior',
      'Vojvoda',
      'Mano Menezes',
      'Jorge Sampaoli',
      'Carlo Ancelotti',
      'Pep Guardiola',
    ];
    const pickedManager = managerNames[Math.floor(Math.random() * managerNames.length)];

    return {
      seasonYear,
      rivalId: `mgr-rival-${rivalClub.id}`,
      rivalName: `${pickedManager} (${rivalClub.shortName})`,
      rivalClubId: rivalClub.id,
      rivalClubName: rivalClub.name,
      rivalClubShortName: rivalClub.shortName,
      rivalPrimaryColor: rivalClub.primaryColor,
      rivalAvatarIcon: '👔',
      rivalRole: `Comandante do ${rivalClub.name}`,
      rivalOverall: 84,
      stats: {
        userGoals: 0,
        rivalGoals: 0,
        userAssists: 0,
        rivalAssists: 0,
        userAverageRating: 6.5,
        rivalAverageRating: 6.9,
        userWins: 0,
        rivalWins: 0,
        matchesPlayed: 0,
      },
      winnerDetermined: false,
    };
  }
}

export function updateSeasonRivalryRound(
  rivalry: SeasonRivalry,
  userRoundStats: {
    goals?: number;
    assists?: number;
    rating?: number;
    isWin?: boolean;
  },
  isFinalWeek: boolean = false
): SeasonRivalry {
  // Simulação realista da rodada do rival
  const rivalScored = Math.random() < 0.38 ? (Math.random() < 0.15 ? 2 : 1) : 0;
  const rivalAssisted = Math.random() < 0.28 ? 1 : 0;
  const rivalRating = Number((5.8 + Math.random() * 2.8).toFixed(1));
  const rivalWon = Math.random() < 0.52;

  const userG = (userRoundStats.goals || 0);
  const userA = (userRoundStats.assists || 0);
  const userR = (userRoundStats.rating || 6.5);
  const userW = userRoundStats.isWin ? 1 : 0;

  const currentMatches = rivalry.stats.matchesPlayed + 1;

  const updatedStats = {
    userGoals: rivalry.stats.userGoals + userG,
    rivalGoals: rivalry.stats.rivalGoals + rivalScored,
    userAssists: rivalry.stats.userAssists + userA,
    rivalAssists: rivalry.stats.rivalAssists + rivalAssisted,
    userAverageRating: Number(((rivalry.stats.userAverageRating * (currentMatches - 1) + userR) / currentMatches).toFixed(1)),
    rivalAverageRating: Number(((rivalry.stats.rivalAverageRating * (currentMatches - 1) + rivalRating) / currentMatches).toFixed(1)),
    userWins: rivalry.stats.userWins + userW,
    rivalWins: rivalry.stats.rivalWins + (rivalWon ? 1 : 0),
    matchesPlayed: currentMatches,
  };

  let winnerDetermined = rivalry.winnerDetermined;
  let userWonRivalry = rivalry.userWonRivalry;

  if (isFinalWeek) {
    winnerDetermined = true;
    const userTotalScore = updatedStats.userGoals * 2 + updatedStats.userAssists + updatedStats.userWins * 3 + (updatedStats.userAverageRating * 10);
    const rivalTotalScore = updatedStats.rivalGoals * 2 + updatedStats.rivalAssists + updatedStats.rivalWins * 3 + (updatedStats.rivalAverageRating * 10);
    userWonRivalry = userTotalScore >= rivalTotalScore;
  }

  return {
    ...rivalry,
    stats: updatedStats,
    winnerDetermined,
    userWonRivalry,
  };
}
