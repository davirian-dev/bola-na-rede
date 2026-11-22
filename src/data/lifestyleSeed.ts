// ==============================================================================
// BOLA NA REDE: CARREIRA - PATRIMÔNIO & BENS DO BOLEIRO (src/data/lifestyleSeed.ts)
// Vida Pessoal, Conquistas Materiais e Pontos no Hall da Fama
// ==============================================================================

export interface LifestyleItem {
  id: string;
  name: string;
  category: 'vehicle' | 'real_estate' | 'luxury' | 'family';
  price: number;
  hallOfFamePoints: number;
  moraleBonus: number;
  fameBonus: number;
  familyBonus?: number;
  icon: string;
  headline: string;
  desc: string;
}

export const LIFESTYLE_CATALOG: LifestyleItem[] = [
  {
    id: 'relogio_marca',
    name: 'Relógio de Marca Suíço',
    category: 'luxury',
    price: 35000,
    hallOfFamePoints: 1,
    moraleBonus: 5,
    fameBonus: 5,
    icon: '⌚',
    headline: 'Craque ostenta relógio de ouro suíço na chegada ao treino!',
    desc: 'Peça refinada com acabamento em ouro. Mostra que o boleiro começou a vencer na vida.',
  },
  {
    id: 'carro_proprio',
    name: 'Carro Próprio Esportivo (SUV Turbo)',
    category: 'vehicle',
    price: 120000,
    hallOfFamePoints: 2,
    moraleBonus: 12,
    fameBonus: 10,
    icon: '🚗',
    headline: 'Novo possante: Atleta chega ao estádio pilotando SUV esportiva zero km!',
    desc: 'Chega de carona ou ônibus! Veículo veloz, confortável e com presença no estacionamento do CT.',
  },
  {
    id: 'casa_mae',
    name: 'Casa da Mãe Resolvida',
    category: 'family',
    price: 380000,
    hallOfFamePoints: 8,
    moraleBonus: 30,
    fameBonus: 20,
    familyBonus: 40,
    icon: '🏡',
    headline: 'EMOCIONANTE! Craque compra mansão para a mãe e cumpre promessa de infância!',
    desc: 'O maior sonho de todo boleiro brasileiro: tirar a família do sufoco e dar uma casa própria com piscina para a dona Maria.',
  },
  {
    id: 'lancha',
    name: 'Lancha de Luxo no Litoral',
    category: 'vehicle',
    price: 650000,
    hallOfFamePoints: 4,
    moraleBonus: 15,
    fameBonus: 25,
    icon: '🚤',
    headline: 'Vida boa: Craque curte folga navegando em lancha de alto luxo com os parças!',
    desc: 'Passeios de fim de ano em Angra ou Balneário Camboriú. Símbolo absoluto do boleiro de sucesso.',
  },
  {
    id: 'cobertura_luxo',
    name: 'Cobertura Duplex com Vista Panorâmica',
    category: 'real_estate',
    price: 1800000,
    hallOfFamePoints: 6,
    moraleBonus: 25,
    fameBonus: 30,
    icon: '🏢',
    headline: 'Novo endereço: Atleta adquire cobertura milionária com vista para o mar!',
    desc: 'Apartamento de 400m² com heliponto, churrasqueira privativa e segurança 24 horas.',
  },
  {
    id: 'jatinho_particular',
    name: 'Jatinho Executivo Particular',
    category: 'vehicle',
    price: 7500000,
    hallOfFamePoints: 10,
    moraleBonus: 40,
    fameBonus: 50,
    icon: '✈️',
    headline: 'NÍVEL MUNDIAL! Craque adquire jatinho personalizado para viagens internacionais!',
    desc: 'Viagens entre Brasil e Europa com conforto de primeira classe. O auge do patrimônio de um craque global.',
  },
];
