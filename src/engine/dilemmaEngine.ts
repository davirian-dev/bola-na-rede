// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE DILEMAS E RELACIONAMENTOS (src/engine/dilemmaEngine.ts)
// Avaliação de Gatilhos, Consequências de Decisões, Repercussão na Mídia e Titularidade
// ==============================================================================

import { GameState, DilemmaEvent, DilemmaOption, NewsItem, PlayerCareerProfile, ManagerCareerProfile } from '@/types/game';
import { DILEMMAS_DATABASE } from '@/data/dilemmas';

export interface DilemmaEvaluationContext {
  isDerby?: boolean;
  matchResult?: 'win' | 'loss' | 'draw';
  playerGoalsInMatch?: number;
  playerRedCard?: boolean;
  consecutiveLosses?: number;
}

/**
 * Seleciona um dilema apropriado para a semana ou momento da partida
 */
export function evaluateDilemmaTrigger(
  state: GameState,
  context?: DilemmaEvaluationContext
): DilemmaEvent | null {
  const currentMode = state.mode;
  // Fila de Memória Anti-Tédio: Cooldown de no mínimo 10 eventos
  const recentQueue = state.recentDilemmaIds || [];
  const blockedIds = new Set(recentQueue.slice(-10));

  // Filtra candidatos disponíveis para o modo atual que não estejam na fila recente dos últimos 10
  let available = DILEMMAS_DATABASE.filter((d) => {
    if (d.forMode !== 'both' && d.forMode !== currentMode) return false;
    if (blockedIds.has(d.id)) return false;
    return true;
  });

  // Fallback de segurança se todos estiverem em cooldown
  if (available.length === 0) {
    available = DILEMMAS_DATABASE.filter((d) => d.forMode === 'both' || d.forMode === currentMode);
  }

  if (available.length === 0) return null;

  // 1. Gatilho de Cartão Vermelho no Jogo
  if (context?.playerRedCard && currentMode === 'player') {
    const redCardDilemma = available.find((d) => d.id === 'p_press_red_card');
    if (redCardDilemma) return redCardDilemma;
  }

  // 2. Gatilho de Vitória em Clássico
  if (context?.isDerby && context?.matchResult === 'win') {
    const derbyWinDilemma = available.find((d) => 
      currentMode === 'player' ? d.id === 'p_press_classic_win' : d.id === 'm_press_champions_qualification'
    );
    if (derbyWinDilemma) return derbyWinDilemma;
  }

  // 3. Gatilho de Derrota em Clássico / Sequência Ruim (Slump)
  if ((context?.consecutiveLosses && context.consecutiveLosses >= 2) || (context?.isDerby && context?.matchResult === 'loss')) {
    const slumpDilemma = available.find((d) => 
      currentMode === 'manager' ? d.id === 'm_press_derby_loss' || d.id === 'm_board_ultimatum' : d.id === 'p_press_goal_drought'
    );
    if (slumpDilemma) return slumpDilemma;
  }

  // 4. Gatilho de Janela de Transferências (semanas 1 a 6 e 20 a 26)
  const isTransferWindow = (state.currentWeek >= 1 && state.currentWeek <= 6) || (state.currentWeek >= 20 && state.currentWeek <= 26);
  if (isTransferWindow && Math.random() < 0.4) {
    const transferDilemma = available.find((d) => d.triggerMoment === 'transfer_window');
    if (transferDilemma) return transferDilemma;
  }

  // 5. Gatilho Aleatório da Semana (chance de ~35%)
  if (Math.random() < 0.35) {
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex] || null;
  }

  return null;
}

/**
 * Aplica as consequências da opção escolhida pelo usuário no GameState
 */
export function applyDilemmaResolution(
  state: GameState,
  dilemma: DilemmaEvent,
  option: DilemmaOption
): Partial<GameState> {
  const { consequences } = option;
  const updates: Partial<GameState> = {};
  const currentWeek = state.currentWeek;
  const seasonYear = state.seasonYear;

  // 1. Atualizações no Modo Jogador
  if (state.mode === 'player' && state.playerProfile) {
    const p = state.playerProfile;

    // Relacionamentos com fallbacks seguros
    const currentCoach = p.coachTrust ?? p.relationshipManager ?? 60;
    const currentFan = p.fanApproval ?? p.relationshipFans ?? 60;
    const currentSquad = p.squadChemistry ?? 65;
    const currentFamily = p.familyHappiness ?? p.relationshipFamily ?? 60;

    const newCoach = Math.max(0, Math.min(100, currentCoach + (consequences.coachTrust || 0)));
    const newFan = Math.max(0, Math.min(100, currentFan + (consequences.fanApproval || 0)));
    const newSquad = Math.max(0, Math.min(100, currentSquad + (consequences.squadChemistry || 0)));
    const newFamily = Math.max(0, Math.min(100, currentFamily + (consequences.familyHappiness || 0)));

    // Regra de Titularidade Dinâmica:
    // Se a confiança do técnico cair abaixo de 35, o jogador é barrado para o banco.
    // Se subir para 80+, ele se torna forte candidato a Capitão da equipe.
    const isBenched = consequences.isBenched !== undefined 
      ? consequences.isBenched 
      : newCoach < 35;

    const isCaptain = consequences.isCaptain !== undefined
      ? consequences.isCaptain
      : (newCoach >= 80 ? true : p.isCaptain);

    const updatedPlayer: PlayerCareerProfile = {
      ...p,
      coachTrust: newCoach,
      relationshipManager: newCoach,
      fanApproval: newFan,
      relationshipFans: newFan,
      squadChemistry: newSquad,
      familyHappiness: newFamily,
      relationshipFamily: newFamily,
      isBenched,
      isCaptain,
      bankBalance: Math.max(0, p.bankBalance + (consequences.money || 0)),
      energy: Math.max(10, Math.min(100, p.energy + (consequences.energy || 0))),
      morale: Math.max(10, Math.min(100, p.morale + (consequences.morale || 0))),
      reputation: Math.max(1, Math.min(99, p.reputation + (consequences.reputation || 0))),
      tempMatchBonus: consequences.matchAttributeBonus || p.tempMatchBonus,
    };

    updates.playerProfile = updatedPlayer;
  }

  // 2. Atualizações no Modo Treinador
  if (state.mode === 'manager' && state.managerProfile) {
    const m = state.managerProfile;

    const currentBoard = m.boardTrust ?? m.boardConfidence ?? 60;
    const currentFan = m.fanApproval ?? m.fansConfidence ?? 60;
    const currentSquad = m.squadMorale ?? m.entrosamento ?? 65;
    const currentMedia = m.mediaReputation ?? m.reputation ?? 60;

    const newBoard = Math.max(0, Math.min(100, currentBoard + (consequences.boardTrust || 0)));
    const newFan = Math.max(0, Math.min(100, currentFan + (consequences.fanApproval || 0)));
    const newSquad = Math.max(0, Math.min(100, currentSquad + (consequences.squadMorale || 0)));
    const newMedia = Math.max(0, Math.min(100, currentMedia + (consequences.mediaReputation || 0)));

    const updatedManager: ManagerCareerProfile = {
      ...m,
      boardTrust: newBoard,
      boardConfidence: newBoard,
      fanApproval: newFan,
      fansConfidence: newFan,
      squadMorale: newSquad,
      entrosamento: newSquad,
      mediaReputation: newMedia,
      reputation: newMedia,
    };

    updates.managerProfile = updatedManager;
  }

  // 3. Notícia Automática no Feed se a resposta gerou manchete
  if (consequences.newsHeadline) {
    const newsItem: NewsItem = {
      id: `dilemma-news-${Date.now()}`,
      week: currentWeek,
      seasonYear,
      category: 'drama',
      headline: consequences.newsHeadline,
      body: consequences.newsBody || 'O clima ferveu após a entrevista exclusiva repercutir em rede nacional.',
      portalName: 'GE Globo Esporte',
      authorName: dilemma.speaker,
      likesCount: Math.floor(Math.random() * 4000) + 1200,
      commentsCount: Math.floor(Math.random() * 800) + 300,
      imageUrl: '/images/news/polemica.webp',
      imageCaption: `${dilemma.speakerRole} repercute declarações em entrevista`,
    };

    updates.newsFeed = [newsItem, ...state.newsFeed.slice(0, 35)];
  }

  // 4. Registro no Histórico de Dilemas
  const historyItem = {
    dilemmaId: dilemma.id,
    optionId: option.id,
    week: currentWeek,
    timestamp: Date.now(),
  };

  updates.dilemmaHistory = [...(state.dilemmaHistory || []), historyItem];
  updates.pendingDilemma = undefined;

  return updates;
}
