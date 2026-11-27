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
  // Setores Adjacentes (ex: Lateral na Zaga, Lateral no Meio, Volante na Zaga, Ponta de Centroavante)
  else if (
    (natSector === 'defense_center' && roleSector === 'defense_flank') ||
    (natSector === 'defense_flank' && roleSector === 'defense_center') ||
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

/**
 * Retorna os 11 papéis táticos (na ordem exata da prancheta) para uma formação.
 */
export function getFormationRoles(formation: TacticalFormation = '4-3-3'): string[] {
  switch (formation) {
    case '4-4-2':
      return ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'MD', 'MC', 'MC', 'ME', 'ATA', 'ATA'];
    case '4-2-3-1':
      return ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'VOL', 'VOL', 'MD', 'MEI', 'ME', 'CA'];
    case '3-5-2':
      return ['GOL', 'ZAG', 'ZAG', 'ZAG', 'ALD', 'VOL', 'MC', 'MC', 'ALE', 'ATA', 'ATA'];
    case '5-3-2':
      return ['GOL', 'ALD', 'ZAG', 'ZAG', 'ZAG', 'ALE', 'MC', 'MC', 'MC', 'ATA', 'ATA'];
    case '4-1-4-1':
      return ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'VOL', 'MD', 'MC', 'MC', 'ME', 'CA'];
    case '4-3-3':
    default:
      return ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'VOL', 'MC', 'MEI', 'PD', 'CA', 'PE'];
  }
}

export interface OrganizeRosterOptions {
  reservePlayerId?: string;
  forceStarterId?: string;
  userSecondaryPositions?: Position[];
  userAdaptability?: Partial<Record<Position, number>>;
}

/**
 * Organiza o elenco para que os 11 primeiros índices (0..10) correspondam aos 11 titulares
 * em suas posições corretas na formação, priorizando maior Overall efetivo e mantendo reservas no banco.
 */
export function organizeRosterForFormation(
  roster: Player[],
  formation: TacticalFormation = '4-3-3',
  options: OrganizeRosterOptions = {}
): Player[] {
  if (!roster || roster.length === 0) return roster;

  const { reservePlayerId, forceStarterId, userSecondaryPositions, userAdaptability } = options;
  const roles = getFormationRoles(formation);

  // Pool principal para os 11 titulares (respeitando quem está no banco/lesionado quando houver opções suficientes)
  const healthyOthers = roster.filter(
    (p) => p.id !== reservePlayerId && !p.isInjured && !p.isSuspended
  );
  const nonReservePool = roster.filter((p) => p.id !== reservePlayerId);
  const starterPool =
    healthyOthers.length >= 11
      ? [...healthyOthers]
      : nonReservePool.length >= 11
      ? [...nonReservePool]
      : [...roster];

  const slots: (Player | null)[] = new Array(roles.length).fill(null);
  const usedIds = new Set<string>();

  const evalPlayerForRole = (p: Player, role: string) =>
    calculatePositionPenalty(
      p.position,
      role,
      p.overall,
      p.id === forceStarterId ? userSecondaryPositions : undefined,
      p.id === forceStarterId ? userAdaptability : undefined
    );

  // 1. Se o jogador do usuário é titular garantido, aloca primeiro na melhor vaga da sua posição
  if (forceStarterId) {
    const forcedPlayer = roster.find((p) => p.id === forceStarterId);
    if (forcedPlayer) {
      let bestSlot = -1;
      let bestScore = -1;
      roles.forEach((role, idx) => {
        const evalRes = evalPlayerForRole(forcedPlayer, role);
        const score = evalRes.effectiveOverall * 10 - evalRes.penalty * 15;
        if (score > bestScore) {
          bestScore = score;
          bestSlot = idx;
        }
      });
      if (bestSlot !== -1) {
        slots[bestSlot] = forcedPlayer;
        usedIds.add(forcedPlayer.id);
      }
    }
  }

  // 2. Prioriza Goleiro natural no slot 0 (GOL)
  if (!slots[0]) {
    const gks = starterPool
      .filter((p) => !usedIds.has(p.id) && p.position === 'GOL')
      .sort((a, b) => b.overall - a.overall);
    if (gks[0]) {
      slots[0] = gks[0];
      usedIds.add(gks[0].id);
    }
  }

  // 3. Seleção Global Otimizada em 2 Passos:
  // Passo 3A: Preenche apenas com jogadores do mesmo setor ou setor adjacente (penalty <= 8),
  // impedindo que atacantes (ex: Endrick) sejam colocados na defesa (LD/ZAG) à frente de defensores reais.
  const assignSlots = (maxPenalty: number) => {
    while (slots.some((s) => s === null)) {
      let bestSlot = -1;
      let bestPlayer: Player | null = null;
      let bestScore = -Infinity;

      for (let idx = 0; idx < roles.length; idx++) {
        if (slots[idx] !== null) continue;
        const role = roles[idx];

        for (const p of starterPool) {
          if (usedIds.has(p.id)) continue;
          const hasOutfieldLeft = starterPool.some((c) => !usedIds.has(c.id) && c.position !== 'GOL');
          if (role !== 'GOL' && p.position === 'GOL' && hasOutfieldLeft) continue;

          const evalRes = evalPlayerForRole(p, role);
          if (evalRes.penalty > maxPenalty) continue;

          const score = evalRes.effectiveOverall * 100 - evalRes.penalty * 15;
          if (score > bestScore) {
            bestScore = score;
            bestSlot = idx;
            bestPlayer = p;
          }
        }
      }

      if (bestSlot === -1 || !bestPlayer) break;
      slots[bestSlot] = bestPlayer;
      usedIds.add(bestPlayer.id);
    }
  };

  assignSlots(8);
  // Passo 3B (fallback): só preenche com improviso de outro setor se realmente faltar jogador no setor
  assignSlots(99);

  const starters = slots.filter((p): p is Player => p !== null);

  // 5. Banco de reservas: coloca reservePlayerId primeiro (se existir), depois melhor GOL reserva e demais por OVR
  const remaining = roster
    .filter((p) => !usedIds.has(p.id))
    .sort((a, b) => {
      if (a.id === reservePlayerId) return -1;
      if (b.id === reservePlayerId) return 1;
      if (a.position === 'GOL' && b.position !== 'GOL') return -1;
      if (b.position === 'GOL' && a.position !== 'GOL') return 1;
      return b.overall - a.overall;
    });

  return [...starters, ...remaining];
}
