// ==============================================================================
// BOLA NA REDE: CARREIRA - CATÁLOGO OFICIAL DE CHUTEIRAS (src/data/boots.ts)
// 9 Chuteiras com Atributos Reais, Raridades, Períodos de Desgaste e Perks
// ==============================================================================

import { BootItem, PlayerAttributes } from '@/types/game';

export const OFFICIAL_BOOTS_CATALOG: BootItem[] = [
  {
    id: 'classic_black',
    name: 'Raiz Clássica Preta',
    rarity: 'Base',
    price: 0,
    durabilityMatches: 999,
    matchesRemaining: 999,
    description: 'Chuteira de couro puro tradicional. Confiança e elegância sem frescura.',
    bonus: {
      passing: 1,
      technique: 1,
    },
    bonusAttributes: {
      passing: 1,
      composure: 1,
    },
    specialPerk: 'Inquebrável e clássica',
    icon: '👟',
    color: '#27272a',
    accentColor: '#ffffff',
    glowClass: 'border-zinc-700',
  },
  {
    id: 'relampago_speed',
    name: 'Relâmpago Speed',
    rarity: 'Pro',
    price: 2500,
    durabilityMatches: 30,
    matchesRemaining: 30,
    description: 'Travas cônicas aerodinâmicas e cabedal ultrafino para velocistas e pontas rápidos.',
    bonus: {
      pace: 4,
      dribbling: 2,
    },
    bonusAttributes: {
      pace: 4,
      dribbling: 2,
    },
    specialPerk: '+4 Ritmo e +2 Drible instantâneo',
    icon: '⚡',
    color: '#0284c7',
    accentColor: '#38bdf8',
    glowClass: 'border-sky-500 shadow-sky-500/20',
  },
  {
    id: 'canhao_powerstrike',
    name: 'Canhão PowerStrike',
    rarity: 'Pro',
    price: 4000,
    durabilityMatches: 25,
    matchesRemaining: 25,
    description: 'Biqueira reforçada com polímero vulcanizado. Ideal para finalizadores matadores.',
    bonus: {
      shooting: 5,
      power: 3,
    },
    bonusAttributes: {
      finishing: 5,
      shooting: 3,
    },
    specialPerk: '+5 Finalização e +3 Força de Chute',
    icon: '💣',
    color: '#dc2626',
    accentColor: '#ef4444',
    glowClass: 'border-red-500 shadow-red-500/20',
  },
  {
    id: 'maestro_control_x',
    name: 'Maestro Control X',
    rarity: 'Pro',
    price: 4500,
    durabilityMatches: 28,
    matchesRemaining: 28,
    description: 'Superfície com micro-ranhuras em relevo para passes teleguiados e controle absoluto.',
    bonus: {
      passing: 4,
      technique: 4,
    },
    bonusAttributes: {
      passing: 4,
      playmaker: 4,
      vision: 4,
    },
    specialPerk: '+4 Passe e +4 Visão de Jogo / Armador',
    icon: '🪄',
    color: '#7c3aed',
    accentColor: '#a855f7',
    glowClass: 'border-purple-500 shadow-purple-500/20',
  },
  {
    id: 'muralha_trava_alta',
    name: 'Muralha Trava Alta',
    rarity: 'Pro',
    price: 3500,
    durabilityMatches: 35,
    matchesRemaining: 35,
    description: 'Trava mista de alumínio anti-derrapante para desarmes limpos e imposição física na zaga.',
    bonus: {
      technique: 4,
      power: 3,
    },
    bonusAttributes: {
      defending: 4,
      tackling: 3,
      physical: 3,
    },
    specialPerk: '+4 Defesa e +3 Desarme / Físico',
    icon: '🧱',
    color: '#059669',
    accentColor: '#10b981',
    glowClass: 'border-emerald-500 shadow-emerald-500/20',
  },
  {
    id: 'ginga_street',
    name: 'Ginga Street',
    rarity: 'Pro',
    price: 6000,
    durabilityMatches: 26,
    matchesRemaining: 26,
    description: 'Inspirada nas quadras de futsal e futebol de rua. Maior sensibilidade de sola para dribles curtos.',
    bonus: {
      dribbling: 5,
      pace: 2,
    },
    bonusAttributes: {
      dribbling: 5,
      pace: 2,
    },
    specialPerk: 'Aumenta a janela de acerto no Minigame de Drible',
    icon: '🕺',
    color: '#d97706',
    accentColor: '#f59e0b',
    glowClass: 'border-amber-500 shadow-amber-500/20',
  },
  {
    id: 'paredao_gk',
    name: 'Luva & Chuteira Paredão',
    rarity: 'Pro',
    price: 4000,
    durabilityMatches: 30,
    matchesRemaining: 30,
    description: 'Conjunto focado para goleiros com grip de látex alemão e travas com impulsão extra.',
    bonus: {
      technique: 4,
      power: 4,
    },
    bonusAttributes: {
      elasticity: 4,
      positioning: 4,
      gkReflexes: 4,
      gkPositioning: 4,
    },
    specialPerk: '+4 Elasticidade/Reflexos e +4 Posicionamento',
    icon: '🧤',
    color: '#0284c7',
    accentColor: '#38bdf8',
    glowClass: 'border-sky-500 shadow-sky-500/20',
  },
  {
    id: 'fenix_carbono',
    name: 'Fênix Carbono',
    rarity: 'Elite',
    price: 18000,
    durabilityMatches: 45,
    matchesRemaining: 45,
    description: 'Chassi de fibra de carbono ultra-leve aeroespacial. Absorção de impacto que reduz o cansaço do atleta.',
    bonus: {
      pace: 4,
      shooting: 4,
      dribbling: 3,
    },
    bonusAttributes: {
      pace: 4,
      finishing: 4,
      dribbling: 3,
    },
    specialPerk: '-10% de desgaste de Energia física por partida',
    icon: '🔥',
    color: '#ea580c',
    accentColor: '#f97316',
    glowClass: 'border-orange-500 shadow-orange-500/30',
  },
  {
    id: 'coroa_imperial',
    name: 'Coroa Imperial Dourada',
    rarity: 'Lendária',
    price: 60000,
    durabilityMatches: 99,
    matchesRemaining: 99,
    description: 'Banhada em ouro e grafeno. Forjada exclusivamente para os reis do futebol mundial.',
    bonus: {
      pace: 4,
      shooting: 4,
      passing: 4,
      dribbling: 4,
    },
    bonusAttributes: {
      pace: 4,
      finishing: 4,
      passing: 4,
      dribbling: 4,
    },
    specialPerk: '+4 em Ritmo, Chute, Passe e Drible + Brilho Áureo VIP',
    icon: '👑',
    color: '#ca8a04',
    accentColor: '#eab308',
    glowClass: 'border-yellow-400 shadow-yellow-400/40 animate-pulse',
  },
  {
    id: 'nike_mercurial_vapor',
    name: 'Nike Mercurial Vapor Pro',
    rarity: 'Elite',
    price: 8500,
    durabilityMatches: 40,
    matchesRemaining: 40,
    description: 'A clássica dos velocistas do futebol mundial. Estrutura aerodinâmica de alta propulsão.',
    bonus: {
      pace: 5,
      shooting: 3,
    },
    bonusAttributes: {
      pace: 5,
      finishing: 3,
    },
    specialPerk: '+5 Ritmo e +3 Finalização nos contra-ataques',
    icon: '⚡',
    color: '#dc2626',
    accentColor: '#fb7185',
    glowClass: 'border-rose-500 shadow-rose-500/30',
  },
  {
    id: 'adidas_predator_acc',
    name: 'Adidas Predator Accuracy',
    rarity: 'Elite',
    price: 9000,
    durabilityMatches: 40,
    matchesRemaining: 40,
    description: 'Tecnologia High Definition Grip nas zonas de chute. Curva venenosa e pontaria cirúrgica.',
    bonus: {
      shooting: 4,
      passing: 4,
    },
    bonusAttributes: {
      finishing: 4,
      shooting: 4,
      passing: 3,
    },
    specialPerk: '+4 Finalização e chutes colocados com máxima precisão',
    icon: '🎯',
    color: '#18181b',
    accentColor: '#ffffff',
    glowClass: 'border-zinc-200 shadow-zinc-200/20',
  },
  {
    id: 'puma_future_ultimate',
    name: 'Puma Future Ultimate',
    rarity: 'Elite',
    price: 7800,
    durabilityMatches: 38,
    matchesRemaining: 38,
    description: 'Fuzionfit 360 adaptável. Projetada para criadores de jogadas e dribladores ousados.',
    bonus: {
      dribbling: 5,
      pace: 3,
    },
    bonusAttributes: {
      dribbling: 5,
      pace: 3,
    },
    specialPerk: '+5 Drible desconcertante no mano a mano',
    icon: '🐆',
    color: '#2563eb',
    accentColor: '#60a5fa',
    glowClass: 'border-blue-500 shadow-blue-500/30',
  },
  {
    id: 'mizuno_morelia_neo',
    name: 'Mizuno Morelia Neo IV',
    rarity: 'Elite',
    price: 8200,
    durabilityMatches: 50,
    matchesRemaining: 50,
    description: 'Artesanato japonês em couro ultra-leve. Conforto premium e toque de bola refinado.',
    bonus: {
      passing: 4,
      technique: 4,
    },
    bonusAttributes: {
      passing: 4,
      playmaker: 4,
      composure: 3,
    },
    specialPerk: '+4 Passe teleguiado e máxima compostura sob pressão',
    icon: '🌸',
    color: '#ffffff',
    accentColor: '#dc2626',
    glowClass: 'border-red-600 shadow-red-600/30',
  },
  {
    id: 'umbro_speciali_pro',
    name: 'Umbro Speciali Clássica',
    rarity: 'Pro',
    price: 5500,
    durabilityMatches: 45,
    matchesRemaining: 45,
    description: 'A histórica chuteira inglesa dos grandes zagueiros e volantes de raça.',
    bonus: {
      technique: 4,
      power: 4,
    },
    bonusAttributes: {
      tackling: 4,
      defending: 4,
      physical: 4,
    },
    specialPerk: '+4 Desarme e combate físico intransponível',
    icon: '🛡️',
    color: '#18181b',
    accentColor: '#059669',
    glowClass: 'border-emerald-600 shadow-emerald-600/30',
  },
];

/**
 * Busca uma chuteira pelo ID ou retorna a clássica como fallback
 */
export function getBootById(bootId?: string): BootItem {
  if (!bootId) return OFFICIAL_BOOTS_CATALOG[0];
  const found = OFFICIAL_BOOTS_CATALOG.find((b) => b.id === bootId);
  return found || OFFICIAL_BOOTS_CATALOG[0];
}

/**
 * Calcula os atributos efetivos somando base + bônus da chuteira
 */
export function getEffectiveAttributes(
  baseAttrs: PlayerAttributes,
  boot?: BootItem
): {
  effective: PlayerAttributes;
  bonuses: Partial<Record<keyof PlayerAttributes, number>>;
} {
  const bonuses: Partial<Record<keyof PlayerAttributes, number>> = {};
  const effective: PlayerAttributes = { ...baseAttrs };

  if (boot && boot.bonusAttributes) {
    Object.entries(boot.bonusAttributes).forEach(([key, val]) => {
      const attrKey = key as keyof PlayerAttributes;
      if (typeof val === 'number' && val > 0) {
        bonuses[attrKey] = val;
        if (typeof effective[attrKey] === 'number') {
          (effective[attrKey] as number) = Math.min(99, (effective[attrKey] as number) + val);
        }
      }
    });
  }

  return { effective, bonuses };
}
