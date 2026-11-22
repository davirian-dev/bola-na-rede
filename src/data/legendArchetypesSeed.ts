// ==============================================================================
// BOLA NA REDE: CARREIRA - ARQUÉTIPOS LENDÁRIOS & SIGNATURE TRAITS
// src/data/legendArchetypesSeed.ts
// ==============================================================================

import { LegendArchetypeId, PlayerAttributes, SignatureTrait } from '@/types/game';

export interface LegendArchetypeDef {
  id: LegendArchetypeId;
  name: string;
  inspiration: string;
  icon: string;
  subtitle: string;
  description: string;
  personalityType: 'humble' | 'obsessive' | 'charismatic' | 'arrogant' | 'electric';
  defaultTraitId: string;
  quote: string;
  initialBoost: Partial<PlayerAttributes>;
  interviewTone: string;
}

export const SIGNATURE_TRAITS_CATALOG: Record<string, SignatureTrait> = {
  trait_supernatural_vision: {
    id: 'trait_supernatural_vision',
    name: 'Visão & Condução Sobrenatural',
    icon: '🔟',
    description: 'A bola parece colada à chuteira. Linhas de passe e finalizações milimétricas com curva teleguiada.',
    effectBadge: '+15% Precisão de Chute Colocado & Passes Quebrando Linhas',
  },
  trait_relentless_finisher: {
    id: 'trait_relentless_finisher',
    name: 'Finalizador Implacável',
    icon: '⚡',
    description: 'Chute seco destruidor e impulsão atlética surreal em cruzamentos e bolas paradas.',
    effectBadge: '+20% Potência de Chute & Salto Aéreo com Cabeceio Fulminante',
  },
  trait_king_of_dribble: {
    id: 'trait_king_of_dribble',
    name: 'Rei do Drible',
    icon: '🕺',
    description: 'Ginga brasileira e quebra de zagueiros no 1x1. Atrai faltas perigosas na meia-lua.',
    effectBadge: '+25% Chance de Drible Desconcertante & Faltas Perto da Área',
  },
  trait_box_hunter: {
    id: 'trait_box_hunter',
    name: 'Caçador de Área Acrobático',
    icon: '🦁',
    description: 'Presença física dominante. Ganha quase todas as disputas aéreas e finaliza de sem-pulo.',
    effectBadge: '+18% Efetividade de Cabeceio & Bomba de Fora da Área',
  },
  trait_pure_explosion: {
    id: 'trait_pure_explosion',
    name: 'Explosão Pura',
    icon: '🌪️',
    description: 'Aceleração devastadora na linha de fundo. Queima os laterais adversários no pique.',
    effectBadge: '+15% Velocidade no Contra-Ataque & Cruzamentos Precisos',
  },
  trait_supersonic_speed: {
    id: 'trait_supersonic_speed',
    name: 'Velocidade Supersônica',
    icon: '🚀',
    description: 'Velocidade de ponta inalcançável em arrancadas verticais.',
    effectBadge: '+20% de Ritmo em Bolas Enfiadas em Profundidade',
  },
  trait_absolute_maestro: {
    id: 'trait_absolute_maestro',
    name: 'Maestro Absoluto',
    icon: '🪄',
    description: 'Comanda o meio de campo como um regente, acertando lançamentos de 50 metros na medida.',
    effectBadge: '+22% Precisão em Viradas Longas de Jogo & Bolas Paradas',
  },
};

export const LEGEND_ARCHETYPES: LegendArchetypeDef[] = [
  {
    id: 'messi_genius',
    name: 'O Gênio Discreto',
    inspiration: 'Inspirado em Lionel Messi',
    icon: '🔟',
    subtitle: 'Futebol Puro & Visão Telepática',
    description: 'Personalidade humilde, fala mansa e foco total nas quatro linhas. Baixíssima incidência de polêmicas com a imprensa e adoração imediata dos técnicos. Condução colada ao pé, arrancadas baixas e assistências cirúrgicas.',
    personalityType: 'humble',
    defaultTraitId: 'trait_supernatural_vision',
    quote: '"O mais importante é ajudar o grupo e somar os 3 pontos com humildade."',
    initialBoost: {
      playmaker: 7,
      dribbling: 6,
      passing: 6,
      finishing: 4,
      positioning: 4,
    },
    interviewTone: 'Humilde e coletivo: exalta os companheiros e minimiza vaidades.',
  },
  {
    id: 'cr7_machine',
    name: 'A Máquina de Gols',
    inspiration: 'Inspirado em Cristiano Ronaldo',
    icon: '⚡',
    subtitle: 'Mentalidade Obsessiva & Letalidade Aérea',
    description: 'Obsessão implacável pelo topo e por bater recordes. Treinos semanais rendem mais evolução e sua moral não cai facilmente. Finalizador implacável de pé direito, esquerdo e cabeceios com impulsão lendária.',
    personalityType: 'obsessive',
    defaultTraitId: 'trait_relentless_finisher',
    quote: '"Trabalho duro todos os dias para ser o número um. Números não mentem."',
    initialBoost: {
      finishing: 7,
      shooting: 7,
      jumping: 6,
      heading: 5,
      pace: 4,
    },
    interviewTone: 'Confiante e determinado: focado na perfeição e em títulos.',
  },
  {
    id: 'neymar_joy',
    name: 'Ousadia & Alegria',
    inspiration: 'Inspirado em Neymar Jr.',
    icon: '🕺',
    subtitle: 'Drible Plástico & Showmanship',
    description: 'Carisma eletrizante e futebol arte brasileiro. Especialista em quebrar zagueiros com elásticos, chapéus e canetas. Atrai atenção da mídia internacional, sofre o dobro de faltas perigosas e incendeia os clássicos.',
    personalityType: 'charismatic',
    defaultTraitId: 'trait_king_of_dribble',
    quote: '"Futebol é arte e alegria. Se eles querem me parar, vão ter que me caçar em campo!"',
    initialBoost: {
      dribbling: 8,
      pace: 5,
      playmaker: 5,
      passing: 4,
      crossing: 4,
    },
    interviewTone: 'Ousado e vibrante: valoriza o espetáculo e a paixão da torcida.',
  },
  {
    id: 'ibra_lion',
    name: 'O Leão Arrogante',
    inspiration: 'Inspirado em Zlatan Ibrahimović',
    icon: '🦁',
    subtitle: 'Físico Dominante & Gols Acrobáticos',
    description: 'Marra colossal, porte físico avantajado (>= 1.90m) e elasticidade de artes marciais. Dispara bombas indefensáveis de fora da área e domina a bola aérea. Respostas ácidas que viralizam na imprensa esportiva.',
    personalityType: 'arrogant',
    defaultTraitId: 'trait_box_hunter',
    quote: '"Os leões não se comparam aos humanos. O espetáculo só começa quando eu entro em campo."',
    initialBoost: {
      shooting: 7,
      heading: 7,
      jumping: 6,
      finishing: 5,
      dribbling: 3,
    },
    interviewTone: 'Marrento e magnético: fala de si em terceira pessoa e desafia rivais.',
  },
  {
    id: 'vini_lightning',
    name: 'O Raio Incansável',
    inspiration: 'Inspirado em Vinicius Jr.',
    icon: '🌪️',
    subtitle: 'Velocidade Supersônica & 1 contra 1',
    description: 'Aceleração devastadora e drible vertical em alta velocidade. Ninguém pega na corrida longa. Desgasta os laterais adversários, sofre marcação pesada e cria lances de perigo constante pelas pontas.',
    personalityType: 'electric',
    defaultTraitId: 'trait_pure_explosion',
    quote: '"Bailamos com alegria! Quanto mais marcarem firme, mais rápido eu vou passar."',
    initialBoost: {
      pace: 8,
      dribbling: 6,
      crossing: 5,
      attacking: 4,
      finishing: 3,
    },
    interviewTone: 'Energético e resiliente: responde à pressão correndo e driblando ainda mais.',
  },
];

export function getLegendArchetype(id: LegendArchetypeId): LegendArchetypeDef {
  return LEGEND_ARCHETYPES.find((a) => a.id === id) || LEGEND_ARCHETYPES[0];
}

export function getSignatureTrait(id: string): SignatureTrait | undefined {
  return SIGNATURE_TRAITS_CATALOG[id];
}
