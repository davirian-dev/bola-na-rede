// ==============================================================================
// BOLA NA REDE: CARREIRA - HABILIDADES DE OURO / PLAYSTYLES (src/data/playStylesSeed.ts)
// 5 Habilidades Lendárias de Ouro com seus respectivos valores e bônus de início
// ==============================================================================

import { PlayStyleGold } from '@/types/game';

export const PLAYSTYLES_GOLD: PlayStyleGold[] = [
  {
    id: 'rapid_gold',
    name: 'Arrancada Foguete (Rapid+)',
    icon: '⚡',
    value: 3800000, // R$ 3.800.000 de valor agregado
    tagline: 'Explosão instantânea nos primeiros 5 metros',
    description: 'Aceleração devastadora que deixa zagueiros para trás na linha de cal. Dá velocidade fulminante e controle de bola grudado ao pé.',
    initialBoost: {
      pace: 8,
      dribbling: 6,
      jumping: 3,
      attacking: 4,
    },
  },
  {
    id: 'finisher_gold',
    name: 'Finalizador Letal (Finisher+)',
    icon: '🎯',
    value: 4500000, // R$ 4.500.000 de valor agregado
    tagline: 'Frieza glacial e pontaria laser no ângulo',
    description: 'Chutes colocados sem rotação que matam o goleiro. Amplia a precisão de finalizações dentro e fora da área em momentos decisivos.',
    initialBoost: {
      finishing: 9,
      shooting: 7,
      attacking: 5,
      positioning: 4,
    },
  },
  {
    id: 'playmaker_gold',
    name: 'Maestro Teleguiado (Playmaker+)',
    icon: '🪄',
    value: 4100000, // R$ 4.100.000 de valor agregado
    tagline: 'Visão de 360° e passes milimétricos com efeito',
    description: 'Enxerga linhas de passe invisíveis para a zaga adversária. Dá passes teleguiados de trivela, lançamentos precisos e assistências cirúrgicas.',
    initialBoost: {
      passing: 9,
      playmaker: 8,
      crossing: 6,
      positioning: 4,
    },
  },
  {
    id: 'anticipate_gold',
    name: 'Muralha Cirúrgica (Anticipate+)',
    icon: '🛡️',
    value: 3600000, // R$ 3.600.000 de valor agregado
    tagline: 'Botes limpos sem falta e tempo de bola perfeito',
    description: 'Antecipação imbatível no 1 contra 1. Recupera a posse de bola no primeiro toque sem cometer faltas e comanda a linha de zaga.',
    initialBoost: {
      tackling: 9,
      defending: 8,
      heading: 5,
      jumping: 4,
    },
  },
  {
    id: 'acrobatic_gold',
    name: 'Asas de Aço & Elasticidade (Acrobatic+)',
    icon: '🦅',
    value: 3900000, // R$ 3.900.000 de valor agregado
    tagline: 'Salto espetacular no ar e elasticidade felina',
    description: 'Para atacantes e zagueiros: impulsão absurda para cabeceios e voleios. Para goleiros: elasticidade sobre-humana para buscar bolas na gaveta.',
    initialBoost: {
      elasticity: 9,
      jumping: 8,
      heading: 6,
      tackling: 4,
    },
  },
];

export function getPlayStyleGoldById(id?: string): PlayStyleGold | undefined {
  if (!id) return undefined;
  return PLAYSTYLES_GOLD.find((p) => p.id === id);
}
