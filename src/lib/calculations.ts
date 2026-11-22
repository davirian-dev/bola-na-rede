// ==============================================================================
// BOLA NA REDE: CARREIRA - ENGINE CALCULATIONS (src/lib/calculations.ts)
// ==============================================================================

import { Position, PlayerAttributes } from '@/types/game';

/**
 * Calcula o Overall ponderado do jogador (0 a 99) baseado em sua posição
 * considerando os 14 atributos oficiais do jogo:
 * Velocidade, Drible, Desarme, Defesa, Ataque, Finalização, Passe,
 * Posicionamento, Cabeceio, Cruzamento, Chute, Salto, Armador e Elasticidade.
 */
export function calculateOverall(pos: Position, attrs: PlayerAttributes): number {
  let score = 0;

  // Fallbacks seguros para garantir compatibilidade se algum atributo não estiver preenchido
  const pace = attrs.pace || 50;
  const dribbling = attrs.dribbling || 50;
  const tackling = attrs.tackling ?? attrs.defending ?? 50;
  const defending = attrs.defending || 50;
  const attacking = attrs.attacking ?? attrs.shooting ?? 50;
  const finishing = attrs.finishing ?? attrs.shooting ?? 50;
  const passing = attrs.passing || 50;
  const positioning = attrs.positioning ?? attrs.gkPositioning ?? 50;
  const heading = attrs.heading ?? attrs.physical ?? 50;
  const crossing = attrs.crossing ?? attrs.passing ?? 50;
  const shooting = attrs.shooting || 50;
  const jumping = attrs.jumping ?? attrs.physical ?? 50;
  const playmaker = attrs.playmaker ?? attrs.vision ?? 50;
  const elasticity = attrs.elasticity ?? attrs.gkReflexes ?? attrs.gkHandling ?? 50;

  switch (pos) {
    case 'GOL': {
      // Goleiro: Elasticidade (0.35) + Posicionamento (0.30) + Salto (0.15) + Desarme/Pegada (0.10) + Passe (0.10)
      score = (elasticity * 0.35) + (positioning * 0.30) + (jumping * 0.15) + (tackling * 0.10) + (passing * 0.10);
      break;
    }
    case 'ZAG': {
      // Zagueiro: Defesa (0.28) + Desarme (0.28) + Cabeceio (0.16) + Salto (0.14) + Velocidade (0.14)
      score = (defending * 0.28) + (tackling * 0.28) + (heading * 0.16) + (jumping * 0.14) + (pace * 0.14);
      break;
    }
    case 'LD':
    case 'LE': {
      // Laterais: Velocidade (0.24) + Cruzamento (0.22) + Desarme (0.20) + Defesa (0.18) + Passe (0.16)
      score = (pace * 0.24) + (crossing * 0.22) + (tackling * 0.20) + (defending * 0.18) + (passing * 0.16);
      break;
    }
    case 'VOL': {
      // Volante: Desarme (0.28) + Defesa (0.24) + Passe (0.20) + Salto (0.14) + Armador (0.14)
      score = (tackling * 0.28) + (defending * 0.24) + (passing * 0.20) + (jumping * 0.14) + (playmaker * 0.14);
      break;
    }
    case 'MC': {
      // Meia Central: Passe (0.26) + Armador (0.24) + Drible (0.18) + Posicionamento (0.16) + Ataque (0.16)
      score = (passing * 0.26) + (playmaker * 0.24) + (dribbling * 0.18) + (positioning * 0.16) + (attacking * 0.16);
      break;
    }
    case 'MEI': {
      // Meia Armador / Camisa 10: Armador (0.28) + Passe (0.24) + Drible (0.20) + Finalização (0.16) + Chute (0.12)
      score = (playmaker * 0.28) + (passing * 0.24) + (dribbling * 0.20) + (finishing * 0.16) + (shooting * 0.12);
      break;
    }
    case 'PD':
    case 'PE': {
      // Pontas: Velocidade (0.25) + Drible (0.25) + Finalização (0.20) + Cruzamento (0.15) + Chute (0.15)
      score = (pace * 0.25) + (dribbling * 0.25) + (finishing * 0.20) + (crossing * 0.15) + (shooting * 0.15);
      break;
    }
    case 'ATA': {
      // Centroavante / Atacante: Finalização (0.30) + Chute (0.22) + Posicionamento (0.18) + Ataque (0.14) + Cabeceio (0.10) + Velocidade (0.06)
      score = (finishing * 0.30) + (shooting * 0.22) + (positioning * 0.18) + (attacking * 0.14) + (heading * 0.10) + (pace * 0.06);
      break;
    }
    default:
      score = (pace + dribbling + tackling + defending + attacking + finishing + passing + positioning + heading + crossing + shooting + jumping + playmaker + elasticity) / 14;
  }

  return Math.min(99, Math.max(30, Math.round(score)));
}

/**
 * Calcula o valor de mercado estimado em R$ com base em overall, potencial e idade.
 */
export function calculateMarketValue(overall: number, potential: number, age: number): number {
  const baseValue = Math.pow(overall / 10, 4.2) * 500;
  const youthBonus = age <= 20 ? 1.5 : age <= 23 ? 1.25 : age >= 31 ? 0.6 : 1.0;
  const potentialFactor = 1 + Math.max(0, (potential - overall)) * 0.04;
  return Math.round((baseValue * youthBonus * potentialFactor) / 1000) * 1000;
}

/**
 * Calcula salário semanal sugerido em R$.
 */
export function calculateWeeklyWage(overall: number, isYouth: boolean): number {
  if (isYouth) {
    return Math.max(800, Math.round(overall * 35));
  }
  const base = Math.pow(overall / 10, 3.8) * 80;
  return Math.round(base / 100) * 100;
}

/**
 * Formata moeda em Real Brasileiro (R$)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Retorna cor do badge com base no Overall (0 a 99)
 */
export function getOverallColorClass(overall: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (overall >= 85) return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40' };
  if (overall >= 78) return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40' };
  if (overall >= 70) return { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/40' };
  if (overall >= 60) return { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/40' };
  return { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/40' };
}
