// ==============================================================================
// BOLA NA REDE: CARREIRA - NEW STAR SOCCER CATALOG SEED (src/data/nssCatalogSeed.ts)
// Chuteiras com Durabilidade, Energéticos NRG Oficiais, Staff & Patrocinadores
// ==============================================================================

import { BootItem, StaffMember, SponsorContract, NRGDrinkItem } from '@/types/game';

// ------------------------------------------------------------------------------
// 1. AS 4 LATINHAS DE NRG CLÁSSICAS DO NEW STAR SOCCER (Imagem 1 & 2)
// ------------------------------------------------------------------------------
export const NRG_DRINKS_CATALOG: NRGDrinkItem[] = [
  {
    id: 'classic',
    name: 'NRG Clássico',
    colorName: 'Verde',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
    bgGradient: 'from-emerald-600 to-emerald-900',
    price: 120,
    energyBonus: 30,
    moraleBonus: 3,
    icon: '🥤',
    description: 'A latinha clássica do NSS. Restaura +30% de energia e +3 de moral imediatamente.',
  },
  {
    id: 'power',
    name: 'NRG Power Turbo',
    colorName: 'Azul',
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-950/60',
    bgGradient: 'from-sky-600 to-sky-900',
    price: 200,
    energyBonus: 55,
    moraleBonus: 6,
    icon: '⚡',
    description: 'Fórmula potente com eletrólitos. Restaura +55% de energia e +6 de moral.',
  },
  {
    id: 'focus',
    name: 'NRG Focus Magenta',
    colorName: 'Rosa',
    badgeColor: 'text-pink-400 border-pink-500/40 bg-pink-950/60',
    bgGradient: 'from-pink-600 to-pink-900',
    price: 320,
    energyBonus: 80,
    moraleBonus: 10,
    icon: '✨',
    description: 'Energia de alta performance para clássicos e decisões. Restaura +80% de energia e +10 de moral.',
  },
  {
    id: 'gold',
    name: 'NRG Extreme Gold',
    colorName: 'Dourado',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    bgGradient: 'from-amber-500 to-amber-800',
    price: 480,
    energyBonus: 100,
    moraleBonus: 20,
    icon: '🏆',
    description: 'O combustível dos campeões mundiais. Restaura 100% da energia e +20 de moral imediata!',
  },
];

// ------------------------------------------------------------------------------
// 2. CHUTEIRAS COM DURABILIDADE POR PARTIDAS E BÔNUS (ESTILO NEW STAR SOCCER)
// ------------------------------------------------------------------------------
export const BOOTS_CATALOG: BootItem[] = [
  {
    id: 'boot_ns_basic',
    name: 'NS-Basic (Chuteira Raiz Preta)',
    price: 800,
    durabilityMatches: 15,
    matchesRemaining: 15,
    color: '#18181b',
    bonus: {
      pace: 5,
      shooting: 8,
      passing: 5,
      dribbling: 4,
      power: 8,
      technique: 5,
    },
    icon: '👟',
  },
  {
    id: 'boot_gol_dynamic',
    name: 'GOL-Dynamic (Azul Cobalto Precisão)',
    price: 2800,
    durabilityMatches: 20,
    matchesRemaining: 20,
    color: '#0284c7',
    bonus: {
      pace: 10,
      shooting: 15,
      passing: 12,
      dribbling: 8,
      power: 15,
      technique: 12,
    },
    icon: '⚽',
  },
  {
    id: 'boot_speed_viper',
    name: 'Speed-Viper Neon (Verde Arrancada)',
    price: 6500,
    durabilityMatches: 20,
    matchesRemaining: 20,
    color: '#84cc16',
    bonus: {
      pace: 20,
      shooting: 12,
      dribbling: 16,
      passing: 10,
      power: 12,
      technique: 16,
    },
    icon: '⚡',
  },
  {
    id: 'boot_predator_gold',
    name: 'Predator Gold Ouro (Chuteira de Lenda)',
    price: 18000,
    durabilityMatches: 25,
    matchesRemaining: 25,
    color: '#eab308',
    bonus: {
      pace: 25,
      shooting: 25,
      passing: 20,
      dribbling: 22,
      power: 25,
      technique: 25,
    },
    icon: '🏆',
  },
];

// ------------------------------------------------------------------------------
// 3. STAFF PESSOAL DO ATLETA (EMPRESÁRIO, FISIO, ASSESSORA)
// ------------------------------------------------------------------------------
export const STAFF_CATALOG: StaffMember[] = [
  {
    id: 'staff_agent_1',
    name: 'Wagner Ribeiro Jr.',
    role: 'agent',
    title: 'Empresário Esportivo',
    weeklyCost: 350,
    perkDescription: '+20% no salário semanal e melhores contratos de patrocínio.',
  },
  {
    id: 'staff_physio_1',
    name: 'Dr. Filé Particular',
    role: 'physio',
    title: 'Fisioterapeuta & Preparador Físico',
    weeklyCost: 450,
    perkDescription: 'Reduz o desgaste físico das partidas em 30% e acelera a recuperação semanal.',
  },
  {
    id: 'staff_press_1',
    name: 'Camila Assunção',
    role: 'press',
    title: 'Assessora de Imprensa & Mídia',
    weeklyCost: 250,
    perkDescription: 'Aumenta em +15% a reputação e blinda a relação do atleta com a torcida.',
  },
];

// ------------------------------------------------------------------------------
// 4. OFERTAS DE PATROCÍNIO DO ATLETA
// ------------------------------------------------------------------------------
export const SPONSOR_OFFERS: SponsorContract[] = [
  {
    id: 'spon_guarana',
    brandName: 'Guaraná Raiz Esportes',
    weeklyPay: 600,
    goalBonus: 250,
    weeksRemaining: 24,
    logo: '🥤',
  },
  {
    id: 'spon_banco',
    brandName: 'Banco Digital do Boleiro',
    weeklyPay: 2200,
    goalBonus: 800,
    weeksRemaining: 36,
    logo: '💳',
  },
  {
    id: 'spon_hyper_sport',
    brandName: 'HyperSport Global Brand',
    weeklyPay: 7500,
    goalBonus: 2500,
    weeksRemaining: 48,
    logo: '🌐',
  },
];
