// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE MISSÕES RELÂMPAGO (src/engine/missionEngine.ts)
// Injeção de Dopamina Pré-Jogo: Objetivos imediatos a cada partida com bônus no pós-jogo
// ==============================================================================

import { FlashMission, Position, Fixture } from '@/types/game';

export interface MissionEvaluationContext {
  mode: 'player' | 'manager';
  playerId?: string;
  clubId?: string;
  userFixture?: Fixture;
  userRating?: number;
  userGoals?: number;
  userAssists?: number;
  userCards?: { yellow: number; red: number };
  dribblesCompleted?: number;
  speechSweetSpotHit?: boolean;
}

export function generateFlashMissions(
  mode: 'player' | 'manager',
  position: Position = 'ATA',
  isAwayMatch: boolean = false
): FlashMission[] {
  const missions: FlashMission[] = [];

  if (mode === 'player') {
    const isAttacker = ['ATA', 'CA', 'PE', 'PD', 'MEI'].includes(position);

    const candidates: FlashMission[] = [];

    if (isAttacker) {
      candidates.push({
        id: `mis-p-ga-${Date.now()}-1`,
        type: 'player_goal_or_assist',
        title: 'Participação em Gol',
        description: 'Marque pelo menos 1 gol ou forneça 1 assistência nesta partida.',
        icon: '⚽',
        rewardMoney: 3000,
        rewardXP: 45,
        rewardMorale: 6,
        completed: false,
        forMode: 'player',
      });
      candidates.push({
        id: `mis-p-goal-${Date.now()}-2`,
        type: 'player_score_goal',
        title: 'Estufar as Redes',
        description: 'Deixe sua marca com pelo menos 1 gol na partida.',
        icon: '🎯',
        rewardMoney: 3500,
        rewardXP: 50,
        rewardMorale: 7,
        completed: false,
        forMode: 'player',
      });
      candidates.push({
        id: `mis-p-dribble-${Date.now()}-3`,
        type: 'player_dribble_success',
        title: 'Mágico das Fintas',
        description: 'Acerte pelo menos 1 drible ou lance plástico durante os 90 minutos.',
        icon: '🪄',
        rewardMoney: 2500,
        rewardXP: 35,
        rewardMorale: 5,
        completed: false,
        forMode: 'player',
      });
      candidates.push({
        id: `mis-p-brace-${Date.now()}-4`,
        type: 'player_brace',
        title: 'Dobradinha do Artilheiro',
        description: 'Marque 2 ou mais gols no mesmo jogo e seja o protagonista!',
        icon: '👑',
        rewardMoney: 6000,
        rewardXP: 80,
        rewardMorale: 10,
        completed: false,
        forMode: 'player',
      });
    } else {
      candidates.push({
        id: `mis-p-clean-${Date.now()}-5`,
        type: 'manager_clean_sheet',
        title: 'Paredão Sem Vazamentos',
        description: 'Sua equipe não pode sofrer gols nesta partida.',
        icon: '🛡️',
        rewardMoney: 3500,
        rewardXP: 50,
        rewardMorale: 7,
        completed: false,
        forMode: 'player',
      });
      candidates.push({
        id: `mis-p-ga-def-${Date.now()}-6`,
        type: 'player_goal_or_assist',
        title: 'Apoio Cirúrgico',
        description: 'Surpreenda o adversário com 1 assistência ou 1 gol de bola parada.',
        icon: '⚡',
        rewardMoney: 4000,
        rewardXP: 55,
        rewardMorale: 8,
        completed: false,
        forMode: 'player',
      });
    }

    // Missões Universais de Jogador
    candidates.push({
      id: `mis-p-rating-${Date.now()}-7`,
      type: 'player_high_rating',
      title: 'Nota de Gala',
      description: 'Termine o confronto com nota oficial individual igual ou superior a 7.5.',
      icon: '⭐',
      rewardMoney: 3000,
      rewardXP: 45,
      rewardMorale: 5,
      completed: false,
      forMode: 'player',
    });
    candidates.push({
      id: `mis-p-fair-${Date.now()}-8`,
      type: 'player_no_cards',
      title: 'Disciplina e Frieza',
      description: 'Saia de campo sem receber cartões amarelos ou vermelhos.',
      icon: '🕊️',
      rewardMoney: 2000,
      rewardXP: 30,
      rewardMorale: 4,
      completed: false,
      forMode: 'player',
    });

    // Embaralha e seleciona 2
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    missions.push(shuffled[0], shuffled[1]);
  } else {
    // Modo Treinador
    const candidates: FlashMission[] = [
      {
        id: `mis-m-win-${Date.now()}-1`,
        type: 'manager_win_match',
        title: 'Vitória Inegociável',
        description: 'Garanta os 3 pontos para manter a moral e a confiança da diretoria em alta.',
        icon: '🏆',
        rewardMoney: 20000,
        rewardXP: 60,
        rewardMorale: 6,
        completed: false,
        forMode: 'manager',
      },
      {
        id: `mis-m-clean-${Date.now()}-2`,
        type: 'manager_clean_sheet',
        title: 'Retranca e Solidez',
        description: 'Termine a rodada sem sofrer gols (Clean Sheet).',
        icon: '🛡️',
        rewardMoney: 18000,
        rewardXP: 55,
        rewardMorale: 6,
        completed: false,
        forMode: 'manager',
      },
      {
        id: `mis-m-goals-${Date.now()}-3`,
        type: 'manager_score_two_plus',
        title: 'Ataque Letal',
        description: 'Sua equipe deve balançar as redes 2 ou mais vezes nesta partida.',
        icon: '⚡',
        rewardMoney: 16000,
        rewardXP: 50,
        rewardMorale: 5,
        completed: false,
        forMode: 'manager',
      },
      {
        id: `mis-m-speech-${Date.now()}-4`,
        type: 'manager_speech_hit',
        title: 'Discurso Inspirador',
        description: 'Acerte o tom ideal na preleção aos atletas para incendiar o vestiário.',
        icon: '🎙️',
        rewardMoney: 12000,
        rewardXP: 45,
        rewardMorale: 7,
        completed: false,
        forMode: 'manager',
      },
    ];

    if (isAwayMatch) {
      candidates.unshift({
        id: `mis-m-away-${Date.now()}-5`,
        type: 'manager_away_win',
        title: 'Conquista Fora de Casa',
        description: 'Vença o jogo atuando no estádio adversário sob pressão da torcida rival.',
        icon: '✈️',
        rewardMoney: 25000,
        rewardXP: 75,
        rewardMorale: 8,
        completed: false,
        forMode: 'manager',
      });
    }

    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    missions.push(shuffled[0], shuffled[1]);
  }

  return missions;
}

export function evaluateFlashMissions(
  missions: FlashMission[],
  ctx: MissionEvaluationContext
): {
  updatedMissions: FlashMission[];
  completedCount: number;
  totalRewardMoney: number;
  totalRewardXP: number;
  totalRewardMorale: number;
} {
  let completedCount = 0;
  let totalRewardMoney = 0;
  let totalRewardXP = 0;
  let totalRewardMorale = 0;

  const f = ctx.userFixture;
  if (!f || !f.isPlayed) {
    return {
      updatedMissions: missions,
      completedCount: 0,
      totalRewardMoney: 0,
      totalRewardXP: 0,
      totalRewardMorale: 0,
    };
  }

  const isHome = f.homeClubId === ctx.clubId;
  const myGoals = isHome ? (f.homeGoals || 0) : (f.awayGoals || 0);
  const oppGoals = isHome ? (f.awayGoals || 0) : (f.homeGoals || 0);
  const isWin = myGoals > oppGoals;

  const updatedMissions = missions.map((m) => {
    let done = false;

    switch (m.type) {
      case 'player_goal_or_assist':
        done = (ctx.userGoals || 0) > 0 || (ctx.userAssists || 0) > 0;
        break;
      case 'player_score_goal':
        done = (ctx.userGoals || 0) >= 1;
        break;
      case 'player_provide_assist':
        done = (ctx.userAssists || 0) >= 1;
        break;
      case 'player_brace':
        done = (ctx.userGoals || 0) >= 2;
        break;
      case 'player_high_rating':
        done = (ctx.userRating || 0) >= 7.5;
        break;
      case 'player_no_cards':
        done = (ctx.userCards?.yellow || 0) === 0 && (ctx.userCards?.red || 0) === 0;
        break;
      case 'player_dribble_success':
        done = (ctx.dribblesCompleted || 0) >= 1 || (ctx.userRating || 0) >= 7.0;
        break;
      case 'manager_win_match':
        done = isWin;
        break;
      case 'manager_clean_sheet':
        done = oppGoals === 0;
        break;
      case 'manager_score_two_plus':
        done = myGoals >= 2;
        break;
      case 'manager_away_win':
        done = !isHome && isWin;
        break;
      case 'manager_speech_hit':
        done = ctx.speechSweetSpotHit === true || (isWin && Math.random() < 0.6);
        break;
      default:
        done = false;
    }

    if (done) {
      completedCount++;
      totalRewardMoney += m.rewardMoney;
      totalRewardXP += m.rewardXP;
      totalRewardMorale += m.rewardMorale;
    }

    return { ...m, completed: done };
  });

  return {
    updatedMissions,
    completedCount,
    totalRewardMoney,
    totalRewardXP,
    totalRewardMorale,
  };
}
