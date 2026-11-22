// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE SEQUÊNCIA "EM CHAMAS 🔥" (src/engine/streakEngine.ts)
// Efeito Bola de Neve: Multiplicadores, Bônus de Atributos e Manchetes Especiais
// ==============================================================================

import { OnFireStreak, NewsItem } from '@/types/game';

export interface StreakEvaluationResult {
  updatedStreak: OnFireStreak;
  justIgnited: boolean;
  justExtinguished: boolean;
  newsItem?: NewsItem;
}

export function evaluateOnFireStreak(
  currentStreakState: OnFireStreak = {
    currentStreak: 0,
    bestStreak: 0,
    isOnFire: false,
    multiplier: 1.0,
    lastMatchSuccess: false,
  },
  matchSuccess: boolean,
  actorName: string,
  clubName: string,
  week: number,
  seasonYear: number
): StreakEvaluationResult {
  let { currentStreak, bestStreak, isOnFire } = currentStreakState;
  let justIgnited = false;
  let justExtinguished = false;
  let newsItem: NewsItem | undefined;

  if (matchSuccess) {
    currentStreak += 1;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    // Ativa "Em Chamas" a partir de 3 partidas consecutivas de alto nível
    if (currentStreak >= 3) {
      if (!isOnFire) {
        justIgnited = true;
      }
      isOnFire = true;
    }
  } else {
    if (isOnFire) {
      justExtinguished = true;
    }
    currentStreak = 0;
    isOnFire = false;
  }

  const multiplier = isOnFire ? 1.5 : 1.0;

  // Gera notícia contextual
  if (justIgnited) {
    newsItem = {
      id: `news-fire-${week}-${Date.now()}`,
      week,
      seasonYear,
      category: 'destaque',
      headline: `🔥 EM CHAMAS! ${actorName} vive fase espetacular com sequência de ${currentStreak} jogos brilhantes!`,
      body: `O momento mágica de ${actorName} pelo ${clubName} chama a atenção de todo o país. Com atuações decisivas e regularidade impressionante, o craque virou o pesadelo dos adversários nesta rodada!`,
      imageUrl: '/images/news/gol.webp',
      portalName: 'GE Globo Esporte',
      authorName: 'Redação Central',
      likesCount: 5200,
      commentsCount: 940,
    };
  } else if (justExtinguished) {
    newsItem = {
      id: `news-extinguished-${week}-${Date.now()}`,
      week,
      seasonYear,
      category: 'destaque',
      headline: `FIM DA FASE MÁGICA: Sequência espetacular de ${actorName} é interrompida`,
      body: `Após semanas assombrando os gramados com atuações de gala, a série invicta de ${actorName} pelo ${clubName} chegou ao fim. Torcida e comissão técnica cobram pronta recuperação no próximo duelo.`,
      imageUrl: '/images/news/estadio.webp',
      portalName: 'Lance!',
      authorName: 'Mesa Redonda',
      likesCount: 2300,
      commentsCount: 410,
    };
  }

  return {
    updatedStreak: {
      currentStreak,
      bestStreak,
      isOnFire,
      multiplier,
      lastMatchSuccess: matchSuccess,
    },
    justIgnited,
    justExtinguished,
    newsItem,
  };
}
