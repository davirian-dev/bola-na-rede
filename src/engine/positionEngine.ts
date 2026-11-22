// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE POSICIONAMENTO & VERSATILIDADE (src/engine/positionEngine.ts)
// Cálculo de penalidades de Overall fora de posição e evolução de novas posições
// ==============================================================================

import { Position, Player, TacticalFormation } from '@/types/game';

export interface PositionPenaltyResult {
  naturalPosition: Position;
  assignedRole: string;
  penalty: number; // Ex: 0 ou -6
  effectiveOverall: number;
  status: 'natural' | 'adapted' | 'minor_penalty' | 'major_penalty' | 'catastrophic';
  message: string;
}

// Setores táticos para cálculo de distância posicional
const SECTORS: Record<string, 'gk' | 'defense_center' | 'defense_flank' | 'mid_def' | 'mid_att' | 'attack_flank' | 'attack_center'> = {
  GOL: 'gk',
  ZAG: 'defense_center',
  LD: 'defense_flank',
  LE: 'defense_flank',
  ALD: 'defense_flank',
  ALE: 'defense_flank',
  VOL: 'mid_def',
  MC: 'mid_att',
  MEI: 'mid_att',
  MD: 'attack_flank',
  ME: 'attack_flank',
  PD: 'attack_flank',
  PE: 'attack_flank',
  ATA: 'attack_center',
  CA: 'attack_center',
};

/**
 * Normaliza siglas de posições táticas da prancheta
 */
export function normalizeRole(role: string): Position {
  if (role === 'CA') return 'ATA';
  if (role === 'ALD') return 'LD';
  if (role === 'ALE') return 'LE';
  if (role === 'MD') return 'PD';
  if (role === 'ME') return 'PE';
  return role as Position;
}

/**
 * Lista de posições treináveis para o jogador evoluir versatilidade
 */
export const TRAINABLE_POSITIONS: { id: Position; label: string; sector: string }[] = [
  { id: 'GOL', label: 'Goleiro (GOL)', sector: 'Baliza' },
  { id: 'ZAG', label: 'Zagueiro Central (ZAG)', sector: 'Defesa' },
  { id: 'LD', label: 'Lateral Direito (LD)', sector: 'Defesa' },
  { id: 'LE', label: 'Lateral Esquerdo (LE)', sector: 'Defesa' },
  { id: 'VOL', label: 'Volante Marcador (VOL)', sector: 'Meio-Campo' },
  { id: 'MC', label: 'Meio-Campista Central (MC)', sector: 'Meio-Campo' },
  { id: 'MEI', label: 'Meia Armador / Camisa 10 (MEI)', sector: 'Meio-Campo' },
  { id: 'PD', label: 'Ponta Direita (PD)', sector: 'Ataque' },
  { id: 'PE', label: 'Ponta Esquerda (PE)', sector: 'Ataque' },
  { id: 'ATA', label: 'Centroavante / Artilheiro (ATA)', sector: 'Ataque' },
];

/**
 * Calcula a penalidade de Overall caso o jogador atue fora da sua posição natural
 */
export function calculatePositionPenalty(
  naturalPosition: Position,
  rawAssignedRole: string,
  baseOverall: number,
  secondaryPositions: Position[] = [],
  adaptabilityMap: Partial<Record<Position, number>> = {}
): PositionPenaltyResult {
  const assignedRole = normalizeRole(rawAssignedRole);

  // 1. Posição Perfeita (Natural)
  if (naturalPosition === assignedRole) {
    return {
      naturalPosition,
      assignedRole,
      penalty: 0,
      effectiveOverall: baseOverall,
      status: 'natural',
      message: 'Posição de Origem (100% de Rendimento)',
    };
  }

  // 2. Posição Secundária Já Dominada (100%)
  if (secondaryPositions.includes(assignedRole)) {
    return {
      naturalPosition,
      assignedRole,
      penalty: 0,
      effectiveOverall: baseOverall,
      status: 'adapted',
      message: 'Posição Secundária Dominada (Zero Penalidade)',
    };
  }

  // 3. Posição em Treinamento (Reduz a penalidade pela % de adaptabilidade)
  const currentTraining = adaptabilityMap[assignedRole] || 0; // 0 a 100

  const natSector = SECTORS[naturalPosition] || 'mid_att';
  const roleSector = SECTORS[assignedRole] || 'mid_att';

  let rawPenalty = 0;

  // Caso Catastrófico: Linha no Gol ou Goleiro na Linha
  if ((natSector === 'gk' && roleSector !== 'gk') || (natSector !== 'gk' && roleSector === 'gk')) {
    rawPenalty = 32;
  }
  // Posições Irmãs / Flancos Opostos ou Meio Parecido (ex: PE ⇄ PD, LD ⇄ LE, MC ⇄ MEI)
  else if (
    (natSector === 'attack_flank' && roleSector === 'attack_flank') ||
    (natSector === 'defense_flank' && roleSector === 'defense_flank') ||
    (natSector === 'mid_att' && roleSector === 'mid_def') ||
    (natSector === 'mid_def' && roleSector === 'mid_att') ||
    (natSector === 'mid_att' && roleSector === 'attack_center') ||
    (natSector === 'attack_center' && roleSector === 'mid_att')
  ) {
    rawPenalty = 4;
  }
  // Setores Adjacentes (ex: Lateral no Meio, Volante na Zaga, Ponta de Centroavante)
  else if (
    (natSector === 'defense_center' && roleSector === 'mid_def') ||
    (natSector === 'mid_def' && roleSector === 'defense_center') ||
    (natSector === 'attack_flank' && roleSector === 'attack_center') ||
    (natSector === 'attack_center' && roleSector === 'attack_flank') ||
    (natSector === 'defense_flank' && roleSector === 'attack_flank')
  ) {
    rawPenalty = 8;
  }
  // Posições Distantes (ex: Atacante de Zagueiro, Zagueiro de Atacante)
  else {
    rawPenalty = 16;
  }

  // Aplica o desconto proporcional da adaptabilidade em treino
  const discountFactor = (100 - currentTraining) / 100;
  const finalPenalty = Math.max(0, Math.round(rawPenalty * discountFactor));
  const effectiveOverall = Math.max(35, Math.min(99, baseOverall - finalPenalty));

  let status: PositionPenaltyResult['status'] = 'minor_penalty';
  if (finalPenalty >= 25) status = 'catastrophic';
  else if (finalPenalty >= 10) status = 'major_penalty';
  else if (finalPenalty === 0) status = 'adapted';

  const message = finalPenalty === 0
    ? `Adaptação Posicional Completa! (OVR ${effectiveOverall})`
    : `Fora de Posição: Penalidade de -${finalPenalty} no Overall (Efetivo: ${effectiveOverall})`;

  return {
    naturalPosition,
    assignedRole,
    penalty: finalPenalty,
    effectiveOverall,
    status,
    message,
  };
}

/**
 * Evolui a adaptabilidade de uma posição secundária durante a semana de treino
 */
export function progressPositionTraining(
  currentProgress: number = 0,
  ctFacilityLevel: number = 1
): { newProgress: number; isCompleted: boolean } {
  // Base: 15% + (2.5% por nível do Centro de Treinamento)
  const gain = 15 + ctFacilityLevel * 2.5 + Math.floor(Math.random() * 5);
  const newProgress = Math.min(100, Math.round(currentProgress + gain));
  return {
    newProgress,
    isCompleted: newProgress >= 100,
  };
}
