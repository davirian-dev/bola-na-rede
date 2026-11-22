// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE REVIRAVOLTAS E JOGOS ESPECIAIS (src/engine/specialEventsEngine.ts)
// Plot Twists a cada 4-6 semanas: Olheiros, Clássicos Lotados, Chance de Ouro e Bicho Dobrado
// ==============================================================================

import { SpecialMatchEvent, SpecialMatchEventType, TransferOffer, Division, Club } from '@/types/game';

export interface ResolveSpecialEventResult {
  message: string;
  bonusMoney: number;
  bonusXP: number;
  bonusMorale: number;
  transferOfferToTrigger?: TransferOffer;
  success: boolean;
}

export function shouldTriggerSpecialEvent(currentWeek: number, lastTriggeredWeek?: number): boolean {
  // Dispara a cada 4 a 6 semanas
  if (!lastTriggeredWeek) {
    return currentWeek === 4 || currentWeek === 5;
  }
  const diff = currentWeek - lastTriggeredWeek;
  return diff >= 5;
}

export function generateSpecialMatchEvent(
  week: number,
  mode: 'player' | 'manager',
  userClub: Club,
  opponentClub: Club,
  isDerby: boolean
): SpecialMatchEvent {
  const eventTypes: SpecialMatchEventType[] = isDerby
    ? ['high_stakes_derby', 'board_double_bonus', 'scout_attendance']
    : ['scout_attendance', 'board_double_bonus', 'golden_opportunity'];

  const chosenType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  switch (chosenType) {
    case 'scout_attendance':
      return {
        id: `event-scout-${week}-${Date.now()}`,
        type: 'scout_attendance',
        title: 'Olheiro Internacional na Arquibancada!',
        badge: '👀 OLHEIRO EM CAMPO',
        tagline: 'Representantes de gigantes da Europa e da Série A vieram acompanhar sua atuação.',
        description: 'Faça uma partida impecável (Nota >= 8.0) para atrair uma proposta oficial de transferência imediata!',
        activeWeek: week,
        minRatingTarget: 8.0,
      };

    case 'high_stakes_derby':
      return {
        id: `event-derby-${week}-${Date.now()}`,
        type: 'high_stakes_derby',
        title: 'Clássico com Ingressos Esgotados!',
        badge: '⚡ PRESSÃO MÁXIMA',
        tagline: `Estádio lotado e rivalidade histórica contra o ${opponentClub.name}.`,
        description: 'Recompensas de moral, reputação e bônus de vitória multiplicados por 2x nesta rodada.',
        activeWeek: week,
        bonusMultiplier: 2.0,
      };

    case 'golden_opportunity':
      return {
        id: `event-golden-${week}-${Date.now()}`,
        type: 'golden_opportunity',
        title: 'Chance de Ouro: Titularidade Absoluta!',
        badge: '🚑 CHANCE DE OURO',
        tagline: 'O titular de referência sofreu lesão no aquecimento e você assume a vaga!',
        description: 'Sua oportunidade perfeita de provar seu valor para o técnico e a torcida.',
        activeWeek: week,
        bonusMultiplier: 1.5,
      };

    case 'board_double_bonus':
    default:
      return {
        id: `event-bonus-${week}-${Date.now()}`,
        type: 'board_double_bonus',
        title: 'Bicho Dobrado Prometido pela Diretoria!',
        badge: '💰 BICHO DOBRADO',
        tagline: 'A cúpula do clube aprovou premiação financeira extra se conquistarem a vitória.',
        description: 'Vença o confronto contra o adversário para embolsar bônus financeiro turbinado!',
        activeWeek: week,
        bonusMultiplier: 2.0,
      };
  }
}

export function resolveSpecialMatchEvent(
  event: SpecialMatchEvent,
  isWin: boolean,
  userRating: number = 6.0,
  mode: 'player' | 'manager' = 'player'
): ResolveSpecialEventResult {
  let message = '';
  let bonusMoney = 0;
  let bonusXP = 0;
  let bonusMorale = 0;
  let transferOfferToTrigger: TransferOffer | undefined;
  let success = false;

  switch (event.type) {
    case 'scout_attendance':
      if (userRating >= (event.minRatingTarget || 8.0)) {
        success = true;
        bonusMoney = 15000;
        bonusXP = 100;
        bonusMorale = 15;
        message = '🌟 O olheiro ficou encantado com sua nota acima de 8.0 e abriu conversas oficiais!';

        // Cria proposta de transferência real
        const scoutClubs = [
          { id: 'rma', name: 'Real Madrid', short: 'RMA', div: 'LALIGA' as Division, wage: 180000, bonus: 500000 },
          { id: 'mci', name: 'Manchester City', short: 'MCI', div: 'PL' as Division, wage: 200000, bonus: 600000 },
          { id: 'bar', name: 'Barcelona', short: 'BAR', div: 'LALIGA' as Division, wage: 160000, bonus: 400000 },
          { id: 'fla', name: 'Flamengo', short: 'FLA', div: 'A' as Division, wage: 90000, bonus: 250000 },
          { id: 'pal', name: 'Palmeiras', short: 'PAL', div: 'A' as Division, wage: 95000, bonus: 260000 },
        ];
        const picked = scoutClubs[Math.floor(Math.random() * scoutClubs.length)];

        transferOfferToTrigger = {
          id: `offer-scout-${Date.now()}`,
          fromClubId: picked.id,
          fromClubName: picked.name,
          division: picked.div,
          primaryColor: '#ffffff',
          secondaryColor: '#000000',
          shortName: picked.short,
          weeklyWageOffer: picked.wage,
          signingBonus: picked.bonus,
          contractDurationYears: 3,
          roleOffered: 'Titular Absoluto',
          reason: 'Encantado com seu futebol na partida monitorada pelo olheiro!',
        };
      } else {
        message = 'O olheiro assistiu à partida, mas sua nota ficou abaixo de 8.0. Continue treinando firme!';
      }
      break;

    case 'board_double_bonus':
      if (isWin) {
        success = true;
        bonusMoney = mode === 'player' ? 35000 : 120000;
        bonusXP = 80;
        bonusMorale = 12;
        message = '💰 VITÓRIA COM BICHO DOBRADO! A diretoria depositou a premiação prometida!';
      } else {
        message = 'A diretoria guardou os cofres fechados: sem vitória, sem bicho dobrado.';
      }
      break;

    case 'high_stakes_derby':
      if (isWin) {
        success = true;
        bonusMoney = mode === 'player' ? 25000 : 80000;
        bonusXP = 120;
        bonusMorale = 20;
        message = '⚡ TRIUNFO ÉPICO NO CLÁSSICO! A torcida foi à loucura com sua atuação épica!';
      } else {
        message = 'Clássico truncado. A pressão foi grande, mas a equipe precisa erguer a cabeça.';
      }
      break;

    case 'golden_opportunity':
      if (isWin || userRating >= 7.0) {
        success = true;
        bonusMoney = 15000;
        bonusXP = 70;
        bonusMorale = 14;
        message = '🚑 Agarre a vaga! Você correspondeu à altura da oportunidade como titular!';
      } else {
        message = 'Partida difícil. O técnico exige mais intensidade para você se firmar entre os 11.';
      }
      break;
  }

  return {
    message,
    bonusMoney,
    bonusXP,
    bonusMorale,
    transferOfferToTrigger,
    success,
  };
}
