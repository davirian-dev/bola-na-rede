// ==============================================================================
// BOLA NA REDE: CARREIRA - HABILIDADES DE OURO PARA TREINADOR (src/data/managerPlayStylesSeed.ts)
// 6 Estilos Táticos Lendários (MasterStyles) com valores de prestígio e bônus
// ==============================================================================

import { ManagerPlayStyleGold, ManagerPlayStyleGoldId } from '@/types/game';

export const MANAGER_PLAYSTYLES_GOLD: readonly ManagerPlayStyleGold[] = [
  {
    id: 'mastermind_gold',
    name: 'Nó Tático Genial (Mastermind+)',
    icon: '🧠',
    value: 4200000,
    tagline: 'Leitura analítica em tempo real e anulação do rival',
    description: 'Identifica brechas táticas nos adversários. No 2º tempo, neutraliza a principal arma rival e confere +12% de controle e posse de bola inteligente.',
    boosts: {
      tacticalReading: 9,
      squadMorale: 5,
      bigMatchBuff: 6,
    },
    badgeLabels: ['+9 Leitura Tática', '+6 Controle Coletivo', '+5 Domínio do Meio', 'Anula Rival'],
  },
  {
    id: 'inspire_gold',
    name: 'Preleção de Fogo (Inspire+)',
    icon: '🔥',
    value: 4500000,
    tagline: 'Vestiário em chamas e viradas históricas no 2º tempo',
    description: 'Discursos incendiários que transformam derrotas em epopeias. Se estiver perdendo ou empatando, o time ganha +8 de Finalização e Físico pós-intervalo.',
    boosts: {
      squadMorale: 10,
      bigMatchBuff: 8,
      pressingPower: 5,
    },
    badgeLabels: ['+10 Moral de Ferro', '+8 Reação Pós-Intervalo', '+7 Garra & Físico', 'Especialista em Viradas'],
  },
  {
    id: 'scout_gold',
    name: 'Olho Clínico da Base (Scout+)',
    icon: '🦅',
    value: 3800000,
    tagline: 'Evolução meteórica e lapidação de joias Sub-20',
    description: 'Descobre talentos brutos e acelera a maturação dos garotos do clube. Jovens da base evoluem com dobro de rapidez e valorização de mercado.',
    boosts: {
      youthEvolution: 12,
      tacticalReading: 6,
    },
    badgeLabels: ['+12 Evolução da Base', '+8 Visão de Mercado', '+6 Lapidação de Joias', 'Fábrica de Craques'],
  },
  {
    id: 'derby_king_gold',
    name: 'Mestre dos Clássicos (DerbyKing+)',
    icon: '⚔️',
    value: 4000000,
    tagline: 'Imbatível em jogos grandes, derbies e decisões',
    description: 'Frieza absoluta sob pressão ensurdecedora. Em clássicos estaduais e jogos de mata-mata, o time não amarela e a torcida joga junto com 100% de moral.',
    boosts: {
      bigMatchBuff: 10,
      squadMorale: 7,
    },
    badgeLabels: ['+10 Casca Grossa', '+8 Frieza em Finais', '+6 Apoio da Torcida', 'Rei dos Clássicos'],
  },
  {
    id: 'heavy_press_gold',
    name: 'Gegenpressing Sufocante (HeavyPress+)',
    icon: '⚡',
    value: 4100000,
    tagline: 'Pressão asfixiante na saída de bola adversária',
    description: 'Linhas altas que sufocam o adversário no campo de defesa. Aumenta em +30% as roubadas de bola no ataque gerando gols relâmpago de contra-golpe.',
    boosts: {
      pressingPower: 10,
      tacticalReading: 6,
      defensiveSolid: 5,
    },
    badgeLabels: ['+10 Pressão Alta', '+8 Roubadas no Ataque', '+6 Transição Relâmpago', 'Estilo Klopp'],
  },
  {
    id: 'iron_wall_gold',
    name: 'Retranca de Aço Invicto (IronWall+)',
    icon: '🛡️',
    value: 3900000,
    tagline: 'Cadeado impenetrável e zaga impiedosa',
    description: 'Tranca a casinha nos momentos decisivos. Ao defender uma liderança nos últimos 20 minutos, reduz drasticamente as finalizações adversárias.',
    boosts: {
      defensiveSolid: 10,
      tacticalReading: 7,
    },
    badgeLabels: ['+10 Solidez Defensiva', '+8 Linha Baixa Perfeita', '+6 Desarme Seguro', 'Cadeado Fechado'],
  },
];

// Mapa O(1) para acesso ultrarrápido
const MANAGER_PLAYSTYLES_MAP: Record<string, ManagerPlayStyleGold> = Object.freeze(
  MANAGER_PLAYSTYLES_GOLD.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, ManagerPlayStyleGold>)
);

export function getManagerPlayStyleGoldById(id?: string): ManagerPlayStyleGold {
  if (!id) return MANAGER_PLAYSTYLES_GOLD[0];
  return MANAGER_PLAYSTYLES_MAP[id] || MANAGER_PLAYSTYLES_GOLD[0];
}
