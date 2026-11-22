// ==============================================================================
// BOLA NA REDE: CARREIRA - ANNUAL CALENDAR & FIXTURES GENERATOR (src/engine/calendar.ts)
// ==============================================================================

import { 
  Club, 
  Division, 
  League, 
  LeagueStanding, 
  Fixture, 
  CopaDoBrasil, 
  Sub20Tournament, 
  CompetitionType 
} from '@/types/game';

/**
 * Gera confrontos no formato Round Robin (todos contra todos em turno e returno)
 */
function generateRoundRobinFixtures(
  teamIds: string[],
  competition: CompetitionType,
  division?: Division,
  startWeek: number = 1,
  weeksInterval: number = 1
): Fixture[] {
  const n = teamIds.length;
  const isOdd = n % 2 !== 0;
  const teams = isOdd ? [...teamIds, 'BYE'] : [...teamIds];
  const totalTeams = teams.length;
  const rounds = totalTeams - 1;
  const half = totalTeams / 2;

  const fixturesTurno: Fixture[] = [];
  const currentTeams = [...teams];

  for (let r = 0; r < rounds; r++) {
    const currentWeek = startWeek + (r * weeksInterval);

    for (let i = 0; i < half; i++) {
      const home = currentTeams[i];
      const away = currentTeams[totalTeams - 1 - i];

      if (home !== 'BYE' && away !== 'BYE') {
        fixturesTurno.push({
          id: `fix-${competition}-w${currentWeek}-${home}-${away}`,
          week: currentWeek,
          competition,
          division,
          homeClubId: r % 2 === 0 ? home : away,
          awayClubId: r % 2 === 0 ? away : home,
          isPlayed: false,
          isYouth: competition === 'sub_20',
        });
      }
    }

    // Rotaciona times mantendo o primeiro fixo
    const fixed = currentTeams[0];
    const rest = currentTeams.slice(1);
    rest.unshift(rest.pop()!);
    currentTeams[0] = fixed;
    for (let k = 0; k < rest.length; k++) {
      currentTeams[k + 1] = rest[k];
    }
  }

  // Returno com mando invertido
  const fixturesReturno: Fixture[] = fixturesTurno.map((f, idx) => {
    const returnoWeek = startWeek + ((rounds + Math.floor(idx / half)) * weeksInterval);
    return {
      id: `fix-${competition}-w${returnoWeek}-${f.awayClubId}-${f.homeClubId}`,
      week: returnoWeek,
      competition,
      division,
      homeClubId: f.awayClubId,
      awayClubId: f.homeClubId,
      isPlayed: false,
      isYouth: f.isYouth,
    };
  });

  return [...fixturesTurno, ...fixturesReturno];
}

/**
 * Cria o calendário anual completo do futebol brasileiro
 */
export function generateAnnualCalendar(
  clubs: Record<string, Club>,
  seasonYear: number
): {
  leagues: Record<Division, League>;
  copaDoBrasil: CopaDoBrasil;
  sub20Tournament: Sub20Tournament;
  allFixtures: Fixture[];
} {
  const divisions: Division[] = ['A', 'B', 'C', 'D', 'EUROPA'];
  const leagues = {} as Record<Division, League>;
  const allFixtures: Fixture[] = [];

  // 1. GERAR BRASILEIRÃO (SÉRIES A, B, C e D) E CHAMPIONS LEAGUE / EUROPA
  divisions.forEach((div) => {
    const divClubs = Object.values(clubs).filter((c) => c.division === div);
    const divTeamIds = divClubs.map((c) => c.id);

    const standings: LeagueStanding[] = divClubs.map((club) => ({
      clubId: club.id,
      clubName: club.name,
      shortName: club.shortName,
      primaryColor: club.primaryColor,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }));

    const isEuropa = div === 'EUROPA';
    const compType = (isEuropa ? 'champions_league' : `serie_${div.toLowerCase()}`) as CompetitionType;
    const fixtures = generateRoundRobinFixtures(divTeamIds, compType, div, 1, 1);

    leagues[div] = {
      id: isEuropa ? 'champions-league-europa' : `brasileirao-serie-${div.toLowerCase()}`,
      name: isEuropa ? 'Champions League • Europa' : `Brasileirão Série ${div}`,
      division: div,
      isProOnly: isEuropa,
      standings,
      fixtures,
    };

    allFixtures.push(...fixtures);
  });

  // 2. GERAR TORNEIO DE BASE SUB-20 (Copinha de Base - Semanas 1 a 12)
  // Reúne 12 clubes das divisões para a competição de base
  const youthClubs = Object.values(clubs).slice(0, 12);
  const youthTeamIds = youthClubs.map((c) => c.id);

  const sub20Standings: LeagueStanding[] = youthClubs.map((club) => ({
    clubId: club.id,
    clubName: `${club.name} (Sub-20)`,
    shortName: club.shortName,
    primaryColor: club.primaryColor,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  }));

  const sub20Fixtures = generateRoundRobinFixtures(youthTeamIds, 'sub_20', undefined, 1, 1).filter(
    (f) => f.week <= 12
  );

  const sub20Tournament: Sub20Tournament = {
    id: `copinha-sub20-${seasonYear}`,
    name: `Torneio Nacional de Base Sub-20`,
    standings: sub20Standings,
    fixtures: sub20Fixtures,
  };

  allFixtures.push(...sub20Fixtures);

  // 3. GERAR COPA DO BRASIL (Mata-Mata com 16 clubes selecionados das 4 divisões)
  // 8 da Série A, 4 da B, 2 da C, 2 da D
  const serieAClubs = Object.values(clubs).filter((c) => c.division === 'A').slice(0, 8);
  const serieBClubs = Object.values(clubs).filter((c) => c.division === 'B').slice(0, 4);
  const serieCClubs = Object.values(clubs).filter((c) => c.division === 'C').slice(0, 2);
  const serieDClubs = Object.values(clubs).filter((c) => c.division === 'D').slice(0, 2);

  const copaTeams = [...serieAClubs, ...serieBClubs, ...serieCClubs, ...serieDClubs];

  // Oitavas de final (Semana 10 e 15)
  const oitavasFixtures: Fixture[] = [];
  for (let i = 0; i < 8; i++) {
    const home = copaTeams[i].id;
    const away = copaTeams[15 - i].id;
    oitavasFixtures.push(
      {
        id: `copa-oitavas-ida-${i}`,
        week: 10,
        competition: 'copa_brasil',
        stage: 'oitavas',
        homeClubId: home,
        awayClubId: away,
        isPlayed: false,
        isYouth: false,
      },
      {
        id: `copa-oitavas-volta-${i}`,
        week: 15,
        competition: 'copa_brasil',
        stage: 'oitavas',
        homeClubId: away,
        awayClubId: home,
        isPlayed: false,
        isYouth: false,
      }
    );
  }

  // Quartas (Semanas 22 e 28)
  const quartasFixtures: Fixture[] = [];
  for (let i = 0; i < 4; i++) {
    quartasFixtures.push(
      {
        id: `copa-quartas-ida-${i}`,
        week: 22,
        competition: 'copa_brasil',
        stage: 'quartas',
        homeClubId: copaTeams[i * 2].id,
        awayClubId: copaTeams[i * 2 + 1].id,
        isPlayed: false,
        isYouth: false,
      },
      {
        id: `copa-quartas-volta-${i}`,
        week: 28,
        competition: 'copa_brasil',
        stage: 'quartas',
        homeClubId: copaTeams[i * 2 + 1].id,
        awayClubId: copaTeams[i * 2].id,
        isPlayed: false,
        isYouth: false,
      }
    );
  }

  // Semifinais (Semanas 34 e 39)
  const semiFixtures: Fixture[] = [
    { id: 'copa-semi-ida-0', week: 34, competition: 'copa_brasil', stage: 'semi', homeClubId: copaTeams[0].id, awayClubId: copaTeams[2].id, isPlayed: false, isYouth: false },
    { id: 'copa-semi-volta-0', week: 39, competition: 'copa_brasil', stage: 'semi', homeClubId: copaTeams[2].id, awayClubId: copaTeams[0].id, isPlayed: false, isYouth: false },
    { id: 'copa-semi-ida-1', week: 34, competition: 'copa_brasil', stage: 'semi', homeClubId: copaTeams[1].id, awayClubId: copaTeams[3].id, isPlayed: false, isYouth: false },
    { id: 'copa-semi-volta-1', week: 39, competition: 'copa_brasil', stage: 'semi', homeClubId: copaTeams[3].id, awayClubId: copaTeams[1].id, isPlayed: false, isYouth: false },
  ];

  // Final (Semanas 42 e 45)
  const finalFixtures: Fixture[] = [
    { id: 'copa-final-ida', week: 42, competition: 'copa_brasil', stage: 'final', homeClubId: copaTeams[0].id, awayClubId: copaTeams[1].id, isPlayed: false, isYouth: false },
    { id: 'copa-final-volta', week: 45, competition: 'copa_brasil', stage: 'final', homeClubId: copaTeams[1].id, awayClubId: copaTeams[0].id, isPlayed: false, isYouth: false },
  ];

  const copaDoBrasil: CopaDoBrasil = {
    id: `copa-brasil-${seasonYear}`,
    name: 'Copa do Brasil',
    currentStage: 'oitavas',
    fixtures: [...oitavasFixtures, ...quartasFixtures, ...semiFixtures, ...finalFixtures],
  };

  allFixtures.push(...copaDoBrasil.fixtures);

  // Ordena allFixtures cronologicamente por semana
  allFixtures.sort((a, b) => a.week - b.week);

  return { leagues, copaDoBrasil, sub20Tournament, allFixtures };
}
