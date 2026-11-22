// ==============================================================================
// BOLA NA REDE: CARREIRA - SCORING ENGINE (src/engine/scoringEngine.ts)
// Sistema de Pontuação e Hall da Fama (Fiel aos Padrões Oficiais)
// ==============================================================================

import { GameState, Trophy } from '@/types/game';
import { LIFESTYLE_CATALOG } from '@/data/lifestyleSeed';

export interface ScoreCategoryBreakdown {
  category: string;
  points: number;
  items: { label: string; pts: number }[];
}

export interface CareerScoreResult {
  totalPoints: number;
  trophiesCount: number;
  rankTitle: string; // Ex: "Lenda do Futebol", "Ídolo Nacional", etc.
  breakdown: {
    leagues: ScoreCategoryBreakdown;
    cups: ScoreCategoryBreakdown;
    internationals: ScoreCategoryBreakdown;
    individual: ScoreCategoryBreakdown;
    lifestyle: ScoreCategoryBreakdown;
  };
}

/**
 * Calcula a pontuação detalhada da carreira com base em troféus,
 * desempenho individual e patrimônio conquistado.
 */
export function calculateCareerScore(state: GameState): CareerScoreResult {
  const isPlayer = state.mode === 'player';
  const player = state.playerProfile;
  const manager = state.managerProfile;
  const trophies = state.trophies || [];

  // 1. TÍTULOS DE LIGA
  const leagueItems: { label: string; pts: number }[] = [];
  let leaguePts = 0;

  trophies.filter((t) => t.category === 'league').forEach((t) => {
    let pts = 5;
    if (t.division === 'A') pts = 12;
    else if (t.division === 'B') pts = 7;
    else if (t.division === 'C') pts = 5;
    else if (t.division === 'D') pts = 4;

    leagueItems.push({ label: `${t.title} (${t.seasonYear})`, pts });
    leaguePts += pts;
  });

  // Títulos de Base Sub-20
  trophies.filter((t) => t.title.toLowerCase().includes('sub-20') || t.title.toLowerCase().includes('copinha')).forEach((t) => {
    leagueItems.push({ label: `${t.title} (${t.seasonYear})`, pts: 3 });
    leaguePts += 3;
  });

  // 2. COPAS NACIONAIS & ESTADUAIS
  const cupItems: { label: string; pts: number }[] = [];
  let cupPts = 0;

  trophies.filter((t) => t.category === 'cup').forEach((t) => {
    let pts = 10;
    if (t.title.includes('Copa do Brasil')) pts = 10;
    else if (t.title.includes('Nordeste') || t.title.includes('Estadual')) pts = 6;

    cupItems.push({ label: `${t.title} (${t.seasonYear})`, pts });
    cupPts += pts;
  });

  // 3. INTERNACIONAIS & CONTINENTAIS (Libertadores, Mundial, Champions)
  const intlItems: { label: string; pts: number }[] = [];
  let intlPts = 0;

  trophies.filter((t) => 
    t.title.includes('Libertadores') || 
    t.title.includes('Champions') || 
    t.title.includes('Mundial') || 
    t.title.includes('Mundo')
  ).forEach((t) => {
    let pts = 18;
    if (t.title.includes('Copa do Mundo')) pts = 40;
    else if (t.title.includes('Super Mundial')) pts = 36;
    else if (t.title.includes('Champions')) pts = 25;
    else if (t.title.includes('Mundial de Clubes')) pts = 23;
    else if (t.title.includes('Libertadores')) pts = 18;
    else if (t.title.includes('Sul-Americana')) pts = 14;

    intlItems.push({ label: `${t.title} (${t.seasonYear})`, pts });
    intlPts += pts;
  });

  // 4. PRÊMIOS INDIVIDUAIS (Artilharia, Gols, Notas)
  const indItems: { label: string; pts: number }[] = [];
  let indPts = 0;

  if (isPlayer && player) {
    // Bola de Ouro se Overall >= 85
    if (player.overall >= 85) {
      indItems.push({ label: 'Candidato / Vencedor Bola de Ouro', pts: 10 });
      indPts += 10;
    }

    // Artilharia em competições
    if (player.stats.goals >= 20) {
      const artilheiroPts = Math.min(25, Math.floor(player.stats.goals / 10) * 5);
      indItems.push({ label: `Artilheiro da Temporada (${player.stats.goals} gols)`, pts: artilheiroPts });
      indPts += artilheiroPts;
    } else if (player.stats.goals >= 5) {
      indItems.push({ label: `Gols Marcados na Carreira (${player.stats.goals} gols)`, pts: 5 });
      indPts += 5;
    }

    // Líder em Assistências
    if (player.stats.assists >= 10) {
      indItems.push({ label: `Garçom do Ano (${player.stats.assists} assistências)`, pts: 4 });
      indPts += 4;
    }

    // Goleiro / Luva de Ouro
    if (player.position === 'GOL' && player.stats.cleanSheets >= 10) {
      indItems.push({ label: `Muralha / Luva de Ouro (${player.stats.cleanSheets} jogos sem sofrer gols)`, pts: 5 });
      indPts += 5;
    }
  } else if (manager) {
    if (manager.stats.titlesWon > 0) {
      const managerPts = manager.stats.titlesWon * 5;
      indItems.push({ label: `Técnico Campeão (${manager.stats.titlesWon} taças levantadas)`, pts: managerPts });
      indPts += managerPts;
    }
    if (manager.stats.wins >= 25) {
      indItems.push({ label: `Comandante Vencedor (${manager.stats.wins} vitórias)`, pts: 6 });
      indPts += 6;
    }
  }

  // 5. PATRIMÔNIO & BENS (Vida de Boleiro)
  const lifeItems: { label: string; pts: number }[] = [];
  let lifePts = 0;

  const userAssets = player?.lifestyleAssets || [];
  LIFESTYLE_CATALOG.forEach((item) => {
    if (userAssets.includes(item.name) || userAssets.includes(item.id)) {
      lifeItems.push({ label: `${item.icon} ${item.name}`, pts: item.hallOfFamePoints });
      lifePts += item.hallOfFamePoints;
    }
  });

  // Dinheiro Acumulado no Banco (Escala Logarítmica até 10 pts)
  const currentBalance = player?.bankBalance || 0;
  if (currentBalance >= 50000) {
    const balancePts = Math.min(10, Math.max(1, Math.floor(Math.log10(currentBalance) * 2 - 8)));
    lifeItems.push({ label: `💰 Poupança e Investimentos Acumulados`, pts: balancePts });
    lifePts += balancePts;
  }

  const totalPoints = leaguePts + cupPts + intlPts + indPts + lifePts;
  const trophiesCount = trophies.length;

  // Título Honorífico do Hall da Fama baseado na pontuação
  let rankTitle = 'Promessa em Início';
  if (totalPoints >= 150) rankTitle = 'Lenda Imortal do Futebol';
  else if (totalPoints >= 90) rankTitle = 'Craque Histórico';
  else if (totalPoints >= 50) rankTitle = 'Ídolo Consagrado';
  else if (totalPoints >= 25) rankTitle = 'Jogador de Destaque';
  else if (totalPoints >= 10) rankTitle = 'Profissional Respeitado';

  return {
    totalPoints,
    trophiesCount,
    rankTitle,
    breakdown: {
      leagues: { category: 'Títulos de Liga (Séries A a D)', points: leaguePts, items: leagueItems },
      cups: { category: 'Copas Nacionais & Estaduais', points: cupPts, items: cupItems },
      internationals: { category: 'Torneios Internacionais & Seleção', points: intlPts, items: intlItems },
      individual: { category: 'Prêmios Individuais & Estatísticas', points: indPts, items: indItems },
      lifestyle: { category: 'Patrimônio, Bens & Conquistas', points: lifePts, items: lifeItems },
    },
  };
}
