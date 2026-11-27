// ==============================================================================
// BOLA NA REDE: CARREIRA - ATTRIBUTE PROGRESSION & PROMOTION (src/engine/progression.ts)
// ==============================================================================

import { PlayerCareerProfile } from '@/types/game';
import { calculateOverall } from '@/lib/calculations';

/**
 * Evolui ou ajusta os atributos do atleta baseado na idade, foco de treino e desempenho
 */
export function progressPlayerAttributes(
  profile: PlayerCareerProfile,
  lastMatchRating?: number
): {
  updatedProfile: PlayerCareerProfile;
  attributeChanges: Record<string, number>;
  promotedToSenior: boolean;
  promotionReason?: string;
} {
  const attrs = { ...profile.attributes };
  const changes: Record<string, number> = {};
  const focus = profile.trainingFocus || 'finishing';

  // Fator idade: jovens evoluem rápido; veteranos perdem ritmo e físico
  const isYoung = profile.age <= 21;
  const isPrime = profile.age >= 22 && profile.age <= 28;
  const isVeteran = profile.age >= 32;

  let baseGrowth = isYoung ? 0.35 : isPrime ? 0.15 : 0.05;

  // Bônus por nota alta na partida
  if (lastMatchRating && lastMatchRating >= 7.5) {
    baseGrowth += 0.25;
  }
  if (lastMatchRating && lastMatchRating >= 8.5) {
    baseGrowth += 0.35;
  }

  // Aplica evolução conforme o foco do treino semanal
  const applyGain = (attrKey: keyof typeof attrs, amount: number) => {
    const current = (attrs[attrKey] as number) || 50;
    const maxPotential = profile.potential || 90;

    if (current < maxPotential) {
      const gain = Math.min(maxPotential - current, Number(amount.toFixed(2)));
      (attrs as Record<string, number | undefined>)[attrKey] = Math.min(99, Math.round(current + gain));
      changes[attrKey] = gain;
    }
  };

  if (focus === 'finishing') {
    applyGain('finishing', baseGrowth * 1.5);
    applyGain('shooting', baseGrowth * 1.3);
    applyGain('attacking', baseGrowth * 1.0);
  } else if (focus === 'pace') {
    applyGain('pace', baseGrowth * 1.4);
    applyGain('dribbling', baseGrowth * 1.1);
  } else if (focus === 'passing') {
    applyGain('passing', baseGrowth * 1.4);
    applyGain('playmaker', baseGrowth * 1.2);
    applyGain('crossing', baseGrowth * 0.9);
  } else if (focus === 'defending') {
    if (profile.position === 'GOL') {
      applyGain('elasticity', baseGrowth * 1.5);
      applyGain('positioning', baseGrowth * 1.2);
    } else {
      applyGain('defending', baseGrowth * 1.5);
      applyGain('tackling', baseGrowth * 1.4);
      applyGain('heading', baseGrowth * 0.9);
    }
  } else if (focus === 'physical') {
    applyGain('jumping', baseGrowth * 1.4);
    applyGain('heading', baseGrowth * 1.2);
    applyGain('pace', baseGrowth * 0.6);
  } else if (focus === 'rest') {
    // Descanso não dá ganho de atributo, mas recupera energia rapidamente (+40)
  }

  // Declínio natural de velocidade e físico para jogadores com mais de 32 anos
  if (isVeteran && Math.random() > 0.6) {
    attrs.pace = Math.max(30, attrs.pace - 1);
    if (attrs.physical !== undefined) {
      attrs.physical = Math.max(35, attrs.physical - 1);
    }
    changes['pace_decline'] = -1;
  }

  const newOverall = calculateOverall(profile.position, attrs);

  // Recuperação / consumo de energia
  let newEnergy = profile.energy;
  if (focus === 'rest') {
    newEnergy = Math.min(100, newEnergy + 40);
  } else {
    newEnergy = Math.min(100, newEnergy + 15);
  }

  // VERIFICAÇÃO DE PROMOÇÃO DA BASE PARA O PROFISSIONAL
  let promotedToSenior = false;
  let promotionReason: string | undefined = undefined;

  if (profile.isYouthTeam) {
    const matches = profile.stats.matchesPlayed;
    const avgRating = profile.stats.averageRating;

    if (newOverall >= 60) {
      promotedToSenior = true;
      promotionReason = `Seu nível técnico impressionou a comissão técnica (Overall atingiu ${newOverall})!`;
    } else if (matches >= 6 && avgRating >= 7.2) {
      promotedToSenior = true;
      promotionReason = `Desempenho espetacular na base: média de ${avgRating.toFixed(1)} após ${matches} jogos!`;
    } else if (matches >= 12) {
      promotedToSenior = true;
      promotionReason = `Fim da temporada da Copinha: você concluiu o período de formação na base e foi promovido ao elenco principal!`;
    }
  }

  const updatedProfile: PlayerCareerProfile = {
    ...profile,
    attributes: attrs,
    overall: newOverall,
    energy: newEnergy,
    isYouthTeam: promotedToSenior ? false : profile.isYouthTeam,
    weeklyWage: promotedToSenior ? Math.max(3500, profile.weeklyWage * 3) : profile.weeklyWage,
    reputation: promotedToSenior ? Math.min(100, profile.reputation + 15) : profile.reputation,
  };

  return {
    updatedProfile,
    attributeChanges: changes,
    promotedToSenior,
    promotionReason,
  };
}
