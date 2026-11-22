// ==============================================================================
// BOLA NA REDE: CARREIRA - BRAZIL SEED DATA (src/data/brazilSeed.ts)
// ==============================================================================

import { Club, Division, Player, Position, League, LeagueStanding, Fixture, CompetitionType } from '@/types/game';
import { calculateOverall, calculateMarketValue, calculateWeeklyWage } from '@/lib/calculations';
import { injectFamousStars } from './famousStarRosters';
import { applyRosterPatch2026 } from './rosterPatch2026';

// Nomes e Sobrenomes para geração brasileira autêntica
const FIRST_NAMES = [
  'Gabriel', 'Lucas', 'Matheus', 'Arthur', 'Bernardo', 'Heitor', 'Davi', 'Lorenzo', 'Theo', 'Pedro',
  'Felipe', 'Samuel', 'Nicolas', 'Murilo', 'Enzo', 'Leonardo', 'Cauã', 'Vinícius', 'Eduardo', 'Caio',
  'Rodrigo', 'Thiago', 'Igor', 'Breno', 'Yuri', 'Bruno', 'Renan', 'Diego', 'Danilo', 'Ruan',
  'Wesley', 'Luan', 'Everton', 'Alisson', 'Wendel', 'Wallace', 'Kaio', 'Patrick', 'Vitor', 'Marcos'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
  'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas',
  'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Moura', 'Cavalcanti', 'Borges', 'Campos', 'Castro'
];

// Nomes e Sobrenomes para gigantes europeus (Champions League)
const FIRST_NAMES_EUROPA = [
  'Kylian', 'Erling', 'Jude', 'Kevin', 'Luka', 'Rodri', 'Vinicius', 'Florian', 'Harry', 'Bukayo',
  'Declan', 'Phil', 'Martin', 'Lautaro', 'Federico', 'Antoine', 'Jamal', 'Thibaut', 'Ruben', 'William',
  'Virgil', 'Theo', 'Achraf', 'Joshua', 'Bernardo', 'Bruno', 'Cole', 'Lamine', 'Robert', 'Rafael',
  'Dusan', 'Aurelien', 'Eduardo', 'Gavi', 'Pedri', 'Marcus', 'Kai', 'Leroy', 'Nicolò', 'Alessandro'
];

const LAST_NAMES_EUROPA = [
  'Haaland', 'Bellingham', 'De Bruyne', 'Mbappé', 'Modric', 'Kane', 'Musiala', 'Saka', 'Rice', 'Foden',
  'Ødegaard', 'Martinez', 'Valverde', 'Griezmann', 'Wirtz', 'Courtois', 'Dias', 'Saliba', 'van Dijk', 'Hernández',
  'Hakimi', 'Kimmich', 'Silva', 'Fernandes', 'Palmer', 'Yamal', 'Lewandowski', 'Leão', 'Vlahovic', 'Tchouaméni',
  'Camavinga', 'Bastoni', 'Barella', 'Rodri', 'Davies', 'Gündogan', 'Rudiger', 'Koundé', 'Robertson', 'Alaba'
];

const ROSTER_POSITIONS: Position[] = [
  'GOL', 'GOL',
  'ZAG', 'ZAG', 'ZAG', 'ZAG',
  'LD', 'LE',
  'VOL', 'VOL', 'MC', 'MC', 'MEI', 'MEI',
  'PD', 'PE',
  'ATA', 'ATA'
];

const YOUTH_POSITIONS: Position[] = [
  'GOL',
  'ZAG', 'ZAG',
  'LD', 'LE',
  'VOL', 'MC', 'MEI',
  'PD', 'PE',
  'ATA'
];

function getRandomInt(min: number, max: number, seed: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

export function generatePlayer(
  clubId: string,
  index: number,
  position: Position,
  division: Division,
  isYouth: boolean
): Player {
  const seed = (clubId.charCodeAt(0) * 1000) + (index * 77) + (isYouth ? 9999 : 123);
  
  const isEuropa = division === 'EUROPA';
  const firstNamesPool = isEuropa ? FIRST_NAMES_EUROPA : FIRST_NAMES;
  const lastNamesPool = isEuropa ? LAST_NAMES_EUROPA : LAST_NAMES;

  const firstName = firstNamesPool[getRandomInt(0, firstNamesPool.length - 1, seed)];
  const lastName = lastNamesPool[getRandomInt(0, lastNamesPool.length - 1, seed + 1)];
  const name = `${firstName} ${lastName}`;
  const nickname = (!isEuropa && index % 4 === 0) ? firstName : undefined;

  const age = isYouth 
    ? getRandomInt(16, 19, seed + 2) 
    : getRandomInt(20, 34, seed + 2);

  // Faixas de atributos médios por divisão
  let minAttr = 48;
  let maxAttr = 58;

  if (division === 'EUROPA') { minAttr = 81; maxAttr = 93; }
  else if (division === 'A') { minAttr = 72; maxAttr = 84; }
  else if (division === 'B') { minAttr = 64; maxAttr = 74; }
  else if (division === 'C') { minAttr = 56; maxAttr = 65; }
  else if (division === 'D') { minAttr = 48; maxAttr = 57; }

  if (isYouth) {
    minAttr = Math.max(40, minAttr - (isEuropa ? 10 : 12));
    maxAttr = Math.max(50, maxAttr - (isEuropa ? 8 : 10));
  }

  const baseStat = getRandomInt(minAttr, maxAttr, seed + 3);

  const attrs = {
    pace: getRandomInt(minAttr, maxAttr, seed + 3),
    dribbling: getRandomInt(minAttr, maxAttr, seed + 6),
    tackling: getRandomInt(minAttr, maxAttr, seed + 7),
    defending: getRandomInt(minAttr, maxAttr, seed + 7),
    attacking: getRandomInt(minAttr, maxAttr, seed + 4),
    finishing: getRandomInt(minAttr, maxAttr, seed + 4),
    passing: getRandomInt(minAttr, maxAttr, seed + 5),
    positioning: getRandomInt(minAttr, maxAttr, seed + 9),
    heading: getRandomInt(minAttr, maxAttr, seed + 8),
    crossing: getRandomInt(minAttr, maxAttr, seed + 5),
    shooting: getRandomInt(minAttr, maxAttr, seed + 4),
    jumping: getRandomInt(minAttr, maxAttr, seed + 8),
    playmaker: getRandomInt(minAttr, maxAttr, seed + 9),
    elasticity: position === 'GOL' ? getRandomInt(minAttr + 2, maxAttr + 6, seed + 11) : getRandomInt(minAttr, maxAttr, seed + 11),
    // Legados para retrocompatibilidade
    physical: getRandomInt(minAttr, maxAttr, seed + 8),
    vision: getRandomInt(minAttr, maxAttr, seed + 9),
    composure: getRandomInt(minAttr, maxAttr, seed + 10),
    gkReflexes: position === 'GOL' ? getRandomInt(minAttr, maxAttr + 4, seed + 11) : undefined,
    gkPositioning: position === 'GOL' ? getRandomInt(minAttr, maxAttr + 2, seed + 12) : undefined,
    gkHandling: position === 'GOL' ? getRandomInt(minAttr, maxAttr + 3, seed + 13) : undefined,
  };

  const overall = calculateOverall(position, attrs);
  const potential = isYouth 
    ? Math.min(96, overall + getRandomInt(14, 25, seed + 14)) 
    : Math.min(94, overall + getRandomInt(0, 6, seed + 14));

  const marketValue = calculateMarketValue(overall, potential, age);
  const wage = calculateWeeklyWage(overall, isYouth);

  return {
    id: `${clubId}-${isYouth ? 'y' : 'p'}-${index}`,
    name,
    nickname,
    age,
    position,
    attributes: attrs,
    overall,
    potential,
    energy: 100,
    morale: getRandomInt(75, 95, seed + 15),
    marketValue,
    wage,
    contractWeeks: getRandomInt(20, 104, seed + 16),
    isYouth,
  };
}

// 76 Clubes Brasileiros com identidade, cores e dados
interface RawClubDef {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  division: Division;
  reputation: number;
  budget: number;
  wageBudget: number;
  stadiumName: string;
  stadiumCapacity: number;
  rivalClubIds?: string[];
  derbyName?: string;
}

const RAW_CLUBS: RawClubDef[] = [
  // SÉRIE A (20 Clubes Oficiais Reais com Clássicos Históricos)
  { id: 'fla', name: 'Flamengo', shortName: 'FLA', primaryColor: '#c5161d', secondaryColor: '#111827', division: 'A', reputation: 89, budget: 65000000, wageBudget: 1800000, stadiumName: 'Maracanã', stadiumCapacity: 78000, rivalClubIds: ['flu', 'vas', 'bot'], derbyName: 'Fla-Flu' },
  { id: 'pal', name: 'Palmeiras', shortName: 'PAL', primaryColor: '#05603a', secondaryColor: '#ffffff', division: 'A', reputation: 89, budget: 60000000, wageBudget: 1750000, stadiumName: 'Allianz Parque', stadiumCapacity: 43000, rivalClubIds: ['cor', 'sao', 'san'], derbyName: 'Derby Paulista' },
  { id: 'bot', name: 'Botafogo', shortName: 'BOT', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'A', reputation: 86, budget: 48000000, wageBudget: 1450000, stadiumName: 'Nilton Santos', stadiumCapacity: 45000, rivalClubIds: ['fla', 'flu', 'vas'], derbyName: 'Clássico da Amizade' },
  { id: 'cor', name: 'Corinthians', shortName: 'COR', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'A', reputation: 85, budget: 35000000, wageBudget: 1500000, stadiumName: 'Neo Química Arena', stadiumCapacity: 49000, rivalClubIds: ['pal', 'sao', 'san'], derbyName: 'Derby Paulista' },
  { id: 'sao', name: 'São Paulo', shortName: 'SAO', primaryColor: '#b91c1c', secondaryColor: '#18181b', division: 'A', reputation: 85, budget: 38000000, wageBudget: 1450000, stadiumName: 'MorumBIS', stadiumCapacity: 66000, rivalClubIds: ['cor', 'pal', 'san'], derbyName: 'Choque-Rei' },
  { id: 'int', name: 'Internacional', shortName: 'INT', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'A', reputation: 83, budget: 32000000, wageBudget: 1300000, stadiumName: 'Beira-Rio', stadiumCapacity: 50000, rivalClubIds: ['gre', 'juv', 'cax'], derbyName: 'Gre-Nal' },
  { id: 'gre', name: 'Grêmio', shortName: 'GRE', primaryColor: '#0284c7', secondaryColor: '#18181b', division: 'A', reputation: 83, budget: 30000000, wageBudget: 1250000, stadiumName: 'Arena do Grêmio', stadiumCapacity: 55000, rivalClubIds: ['int', 'juv', 'cax'], derbyName: 'Gre-Nal' },
  { id: 'cam', name: 'Atlético Mineiro', shortName: 'CAM', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'A', reputation: 84, budget: 40000000, wageBudget: 1350000, stadiumName: 'Arena MRV', stadiumCapacity: 46000, rivalClubIds: ['cru', 'ame'], derbyName: 'Clássico Mineiro' },
  { id: 'cru', name: 'Cruzeiro', shortName: 'CRU', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', division: 'A', reputation: 83, budget: 35000000, wageBudget: 1300000, stadiumName: 'Mineirão', stadiumCapacity: 61000, rivalClubIds: ['cam', 'ame'], derbyName: 'Clássico Mineiro' },
  { id: 'flu', name: 'Fluminense', shortName: 'FLU', primaryColor: '#831843', secondaryColor: '#047857', division: 'A', reputation: 82, budget: 28000000, wageBudget: 1200000, stadiumName: 'Maracanã', stadiumCapacity: 78000, rivalClubIds: ['fla', 'bot', 'vas'], derbyName: 'Fla-Flu' },
  { id: 'bah', name: 'Bahia', shortName: 'BAH', primaryColor: '#2563eb', secondaryColor: '#dc2626', division: 'A', reputation: 82, budget: 38000000, wageBudget: 1250000, stadiumName: 'Arena Fonte Nova', stadiumCapacity: 48000, rivalClubIds: ['vit'], derbyName: 'Ba-Vi' },
  { id: 'for', name: 'Fortaleza', shortName: 'FOR', primaryColor: '#1d4ed8', secondaryColor: '#dc2626', division: 'A', reputation: 81, budget: 24000000, wageBudget: 980000, stadiumName: 'Arena Castelão', stadiumCapacity: 57000, rivalClubIds: ['cea'], derbyName: 'Clássico-Rei' },
  { id: 'vas', name: 'Vasco da Gama', shortName: 'VAS', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'A', reputation: 81, budget: 26000000, wageBudget: 1100000, stadiumName: 'São Januário', stadiumCapacity: 22000, rivalClubIds: ['fla', 'bot', 'flu'], derbyName: 'Clássico dos Milhões' },
  { id: 'cap', name: 'Athletico Paranaense', shortName: 'CAP', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'A', reputation: 81, budget: 28000000, wageBudget: 1000000, stadiumName: 'Ligga Arena', stadiumCapacity: 42000, rivalClubIds: ['cori'], derbyName: 'Atletiba' },
  { id: 'san', name: 'Santos', shortName: 'SAN', primaryColor: '#ffffff', secondaryColor: '#18181b', division: 'A', reputation: 82, budget: 25000000, wageBudget: 1050000, stadiumName: 'Vila Belmiro', stadiumCapacity: 16000, rivalClubIds: ['cor', 'pal', 'sao'], derbyName: 'Clássico Alvinegro' },
  { id: 'red', name: 'Red Bull Bragantino', shortName: 'RBB', primaryColor: '#ffffff', secondaryColor: '#dc2626', division: 'A', reputation: 79, budget: 28000000, wageBudget: 950000, stadiumName: 'Nabi Abi Chedid', stadiumCapacity: 17000 },
  { id: 'cui', name: 'Cuiabá', shortName: 'CUI', primaryColor: '#ca8a04', secondaryColor: '#15803d', division: 'A', reputation: 75, budget: 15000000, wageBudget: 750000, stadiumName: 'Arena Pantanal', stadiumCapacity: 41000 },
  { id: 'vit', name: 'Vitória', shortName: 'VIT', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'A', reputation: 76, budget: 14000000, wageBudget: 700000, stadiumName: 'Barradão', stadiumCapacity: 35000, rivalClubIds: ['bah'], derbyName: 'Ba-Vi' },
  { id: 'cric', name: 'Criciúma', shortName: 'CRI', primaryColor: '#ca8a04', secondaryColor: '#18181b', division: 'A', reputation: 74, budget: 12000000, wageBudget: 600000, stadiumName: 'Heriberto Hülse', stadiumCapacity: 19000 },
  { id: 'juv', name: 'Juventude', shortName: 'JUV', primaryColor: '#16a34a', secondaryColor: '#ffffff', division: 'A', reputation: 74, budget: 11000000, wageBudget: 580000, stadiumName: 'Alfredo Jaconi', stadiumCapacity: 20000, rivalClubIds: ['cax', 'gre', 'int'], derbyName: 'Ca-Ju' },

  // SÉRIE B (20 Clubes Oficiais Reais)
  { id: 'spo', name: 'Sport Recife', shortName: 'SPO', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'B', reputation: 75, budget: 13000000, wageBudget: 680000, stadiumName: 'Ilha do Retiro', stadiumCapacity: 32000, rivalClubIds: ['sanfe', 'nau'], derbyName: 'Clássico das Multidões' },
  { id: 'cea', name: 'Ceará', shortName: 'CEA', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'B', reputation: 75, budget: 12500000, wageBudget: 650000, stadiumName: 'Arena Castelão', stadiumCapacity: 50000, rivalClubIds: ['for'], derbyName: 'Clássico-Rei' },
  { id: 'cori', name: 'Coritiba', shortName: 'CFC', primaryColor: '#15803d', secondaryColor: '#ffffff', division: 'B', reputation: 74, budget: 11000000, wageBudget: 600000, stadiumName: 'Couto Pereira', stadiumCapacity: 40000, rivalClubIds: ['cap'], derbyName: 'Atletiba' },
  { id: 'goi', name: 'Goiás', shortName: 'GOI', primaryColor: '#15803d', secondaryColor: '#ffffff', division: 'B', reputation: 74, budget: 10500000, wageBudget: 580000, stadiumName: 'Estádio da Serrinha', stadiumCapacity: 14000, rivalClubIds: ['vil'], derbyName: 'Derby do Cerrado' },
  { id: 'ame', name: 'América Mineiro', shortName: 'AME', primaryColor: '#16a34a', secondaryColor: '#18181b', division: 'B', reputation: 73, budget: 9500000, wageBudget: 540000, stadiumName: 'Independência', stadiumCapacity: 23000, rivalClubIds: ['cam', 'cru'], derbyName: 'Coelho x Galo' },
  { id: 'nov', name: 'Grêmio Novorizontino', shortName: 'NOV', primaryColor: '#ca8a04', secondaryColor: '#18181b', division: 'B', reputation: 71, budget: 7500000, wageBudget: 460000, stadiumName: 'Doutor Jorge Ismael de Biasi', stadiumCapacity: 12000 },
  { id: 'mir', name: 'Mirassol', shortName: 'MIR', primaryColor: '#eab308', secondaryColor: '#15803d', division: 'B', reputation: 70, budget: 7000000, wageBudget: 440000, stadiumName: 'José Maria de Campos Maia', stadiumCapacity: 15000 },
  { id: 'ava', name: 'Avaí', shortName: 'AVA', primaryColor: '#0284c7', secondaryColor: '#ffffff', division: 'B', reputation: 71, budget: 7800000, wageBudget: 470000, stadiumName: 'Ressacada', stadiumCapacity: 18000, rivalClubIds: ['fig'], derbyName: 'Clássico de Florianópolis' },
  { id: 'vil', name: 'Vila Nova', shortName: 'VIL', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'B', reputation: 70, budget: 6500000, wageBudget: 420000, stadiumName: 'Onésio Brasileiro Alvarenga', stadiumCapacity: 12000, rivalClubIds: ['goi'], derbyName: 'Derby do Cerrado' },
  { id: 'ope', name: 'Operário Ferroviário', shortName: 'OPE', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'B', reputation: 69, budget: 6000000, wageBudget: 400000, stadiumName: 'Germano Krüger', stadiumCapacity: 10000 },
  { id: 'pay', name: 'Paysandu', shortName: 'PAY', primaryColor: '#0284c7', secondaryColor: '#ffffff', division: 'B', reputation: 71, budget: 7200000, wageBudget: 450000, stadiumName: 'Curuzu', stadiumCapacity: 16000, rivalClubIds: ['rem'], derbyName: 'Re-Pa' },
  { id: 'ama', name: 'Amazonas FC', shortName: 'AMA', primaryColor: '#eab308', secondaryColor: '#18181b', division: 'B', reputation: 68, budget: 5500000, wageBudget: 390000, stadiumName: 'Arena da Amazônia', stadiumCapacity: 44000 },
  { id: 'pon', name: 'Ponte Preta', shortName: 'PON', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'B', reputation: 69, budget: 5600000, wageBudget: 390000, stadiumName: 'Moisés Lucarelli', stadiumCapacity: 19000, rivalClubIds: ['gua'], derbyName: 'Dérbi Campineiro' },
  { id: 'gua', name: 'Guarani', shortName: 'GUA', primaryColor: '#16a34a', secondaryColor: '#ffffff', division: 'B', reputation: 69, budget: 5600000, wageBudget: 390000, stadiumName: 'Brinco de Ouro da Princesa', stadiumCapacity: 29000, rivalClubIds: ['pon'], derbyName: 'Dérbi Campineiro' },
  { id: 'crb', name: 'CRB', shortName: 'CRB', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'B', reputation: 68, budget: 5000000, wageBudget: 370000, stadiumName: 'Rei Pelé', stadiumCapacity: 18000, rivalClubIds: ['csa'], derbyName: 'Clássico das Multidões AL' },
  { id: 'cha', name: 'Chapecoense', shortName: 'CHA', primaryColor: '#15803d', secondaryColor: '#ffffff', division: 'B', reputation: 70, budget: 6200000, wageBudget: 410000, stadiumName: 'Arena Condá', stadiumCapacity: 20000 },
  { id: 'botsp', name: 'Botafogo-SP', shortName: 'BSP', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'B', reputation: 67, budget: 4800000, wageBudget: 360000, stadiumName: 'Santa Cruz / Arena Nicnet', stadiumCapacity: 28000 },
  { id: 'itu', name: 'Ituano', shortName: 'ITU', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'B', reputation: 66, budget: 4400000, wageBudget: 340000, stadiumName: 'Novelli Júnior', stadiumCapacity: 18000 },
  { id: 'bru', name: 'Brusque', shortName: 'BRU', primaryColor: '#ca8a04', secondaryColor: '#dc2626', division: 'B', reputation: 65, budget: 4200000, wageBudget: 330000, stadiumName: 'Augusto Bauer', stadiumCapacity: 5000 },
  { id: 'botpb', name: 'Botafogo-PB', shortName: 'BPB', primaryColor: '#18181b', secondaryColor: '#dc2626', division: 'B', reputation: 65, budget: 4000000, wageBudget: 320000, stadiumName: 'Almeidão', stadiumCapacity: 25000, rivalClubIds: ['treze_pb', 'campinense'], derbyName: 'Clássico Tradição' },

  // SÉRIE C (20 Clubes Oficiais Reais)
  { id: 'rem', name: 'Clube do Remo', shortName: 'REM', primaryColor: '#1e3a8a', secondaryColor: '#ffffff', division: 'C', reputation: 67, budget: 3800000, wageBudget: 290000, stadiumName: 'Baenão', stadiumCapacity: 14000 },
  { id: 'nau', name: 'Náutico', shortName: 'NAU', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'C', reputation: 67, budget: 3800000, wageBudget: 290000, stadiumName: 'Aflitos', stadiumCapacity: 20000 },
  { id: 'sanfe', name: 'Santa Cruz', shortName: 'STC', primaryColor: '#18181b', secondaryColor: '#dc2626', division: 'C', reputation: 66, budget: 3400000, wageBudget: 280000, stadiumName: 'Arruda', stadiumCapacity: 60000 },
  { id: 'fig', name: 'Figueirense', shortName: 'FIG', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'C', reputation: 65, budget: 3200000, wageBudget: 270000, stadiumName: 'Orlando Scarpelli', stadiumCapacity: 19000 },
  { id: 'csa', name: 'CSA Alagoas', shortName: 'CSA', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', division: 'C', reputation: 64, budget: 3000000, wageBudget: 260000, stadiumName: 'Rei Pelé', stadiumCapacity: 18000 },
  { id: 'vol', name: 'Volta Redonda', shortName: 'VRE', primaryColor: '#eab308', secondaryColor: '#18181b', division: 'C', reputation: 63, budget: 2800000, wageBudget: 240000, stadiumName: 'Raulino de Oliveira', stadiumCapacity: 20000 },
  { id: 'fer', name: 'Ferroviária', shortName: 'AFE', primaryColor: '#831843', secondaryColor: '#ffffff', division: 'C', reputation: 63, budget: 2900000, wageBudget: 250000, stadiumName: 'Fonte Luminosa', stadiumCapacity: 20000 },
  { id: 'con', name: 'Confiança', shortName: 'CON', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', division: 'C', reputation: 62, budget: 2600000, wageBudget: 230000, stadiumName: 'Batistão', stadiumCapacity: 15000 },
  { id: 'ypir', name: 'Ypiranga de Erechim', shortName: 'YPI', primaryColor: '#eab308', secondaryColor: '#15803d', division: 'C', reputation: 61, budget: 2400000, wageBudget: 210000, stadiumName: 'Colosso da Lagoa', stadiumCapacity: 22000 },
  { id: 'lond', name: 'Londrina', shortName: 'LON', primaryColor: '#0284c7', secondaryColor: '#ffffff', division: 'C', reputation: 64, budget: 3100000, wageBudget: 260000, stadiumName: 'Estádio do Café', stadiumCapacity: 31000 },
  { id: 'apa', name: 'Aparecidense', shortName: 'APA', primaryColor: '#0284c7', secondaryColor: '#ffffff', division: 'C', reputation: 60, budget: 2100000, wageBudget: 195000, stadiumName: 'Aníbal Batista de Toledo', stadiumCapacity: 5000 },
  { id: 'saoj', name: 'São José-RS', shortName: 'SJO', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', division: 'C', reputation: 59, budget: 1900000, wageBudget: 185000, stadiumName: 'Passo dAreia', stadiumCapacity: 10000 },
  { id: 'tom', name: 'Tombense', shortName: 'TOM', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'C', reputation: 61, budget: 2200000, wageBudget: 200000, stadiumName: 'Almeidão', stadiumCapacity: 3000 },
  { id: 'cax', name: 'SER Caxias', shortName: 'CAX', primaryColor: '#831843', secondaryColor: '#0284c7', division: 'C', reputation: 61, budget: 2300000, wageBudget: 205000, stadiumName: 'Centenário', stadiumCapacity: 22000 },
  { id: 'flo', name: 'Floresta-CE', shortName: 'FLO', primaryColor: '#15803d', secondaryColor: '#ffffff', division: 'C', reputation: 58, budget: 1800000, wageBudget: 175000, stadiumName: 'Presidente Vargas', stadiumCapacity: 20000 },
  { id: 'abc', name: 'ABC de Natal', shortName: 'ABC', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'C', reputation: 63, budget: 2600000, wageBudget: 235000, stadiumName: 'Frasqueirão', stadiumCapacity: 18000 },
  { id: 'ame_rn', name: 'América de Natal', shortName: 'ARN', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'C', reputation: 62, budget: 2500000, wageBudget: 225000, stadiumName: 'Arena das Dunas', stadiumCapacity: 31000 },
  { id: 'ferr_ce', name: 'Ferroviário-CE', shortName: 'FAC', primaryColor: '#18181b', secondaryColor: '#dc2626', division: 'C', reputation: 59, budget: 1900000, wageBudget: 185000, stadiumName: 'Elzir Cabral', stadiumCapacity: 8000 },
  { id: 'saober', name: 'São Bernardo FC', shortName: 'SBO', primaryColor: '#eab308', secondaryColor: '#18181b', division: 'C', reputation: 64, budget: 3300000, wageBudget: 280000, stadiumName: 'Primeiro de Maio', stadiumCapacity: 15000 },
  { id: 'athlet_pr', name: 'Athletic Club MG', shortName: 'ATH', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'C', reputation: 62, budget: 2500000, wageBudget: 220000, stadiumName: 'Joaquim Portugal', stadiumCapacity: 6000 },

  // SÉRIE D (16 Clubes Oficiais Reais)
  { id: 'agu_mar', name: 'Águia de Marabá', shortName: 'AGU', primaryColor: '#0284c7', secondaryColor: '#ca8a04', division: 'D', reputation: 52, budget: 900000, wageBudget: 90000, stadiumName: 'Zinho de Oliveira', stadiumCapacity: 5000 },
  { id: 'brasil_pel', name: 'Brasil de Pelotas', shortName: 'XAV', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'D', reputation: 56, budget: 1200000, wageBudget: 120000, stadiumName: 'Bento Freitas', stadiumCapacity: 12000 },
  { id: 'inter_limeira', name: 'Inter de Limeira', shortName: 'LIM', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'D', reputation: 54, budget: 1100000, wageBudget: 110000, stadiumName: 'Major Levy Sobrinho', stadiumCapacity: 18000 },
  { id: 'treze_pb', name: 'Treze PB', shortName: 'TRE', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'D', reputation: 54, budget: 1000000, wageBudget: 100000, stadiumName: 'Presidente Vargas PB', stadiumCapacity: 10000 },
  { id: 'campinense', name: 'Campinense', shortName: 'CAM', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'D', reputation: 53, budget: 950000, wageBudget: 95000, stadiumName: 'Amigão', stadiumCapacity: 19000 },
  { id: 'mar_pr', name: 'Maringá FC', shortName: 'MFC', primaryColor: '#18181b', secondaryColor: '#15803d', division: 'D', reputation: 55, budget: 1200000, wageBudget: 115000, stadiumName: 'Willie Davids', stadiumCapacity: 16000 },
  { id: 'cascavel', name: 'FC Cascavel', shortName: 'CAS', primaryColor: '#ca8a04', secondaryColor: '#18181b', division: 'D', reputation: 53, budget: 1000000, wageBudget: 100000, stadiumName: 'Olímpico Regional', stadiumCapacity: 28000 },
  { id: 'port_rj', name: 'Portuguesa-RJ', shortName: 'POR', primaryColor: '#15803d', secondaryColor: '#dc2626', division: 'D', reputation: 53, budget: 950000, wageBudget: 95000, stadiumName: 'Luso-Brasileiro', stadiumCapacity: 5000 },
  { id: 'moto_club', name: 'Moto Club', shortName: 'MOT', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'D', reputation: 53, budget: 950000, wageBudget: 95000, stadiumName: 'Castelão São Luís', stadiumCapacity: 40000 },
  { id: 'itabaiana', name: 'AO Itabaiana', shortName: 'ITA', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', division: 'D', reputation: 52, budget: 880000, wageBudget: 88000, stadiumName: 'Mendonção', stadiumCapacity: 10000 },
  { id: 'asa_arap', name: 'ASA de Arapiraca', shortName: 'ASA', primaryColor: '#18181b', secondaryColor: '#ffffff', division: 'D', reputation: 53, budget: 950000, wageBudget: 92000, stadiumName: 'Coaracy da Mata Fonseca', stadiumCapacity: 12000 },
  { id: 'sousa_pb', name: 'Sousa EC', shortName: 'SOU', primaryColor: '#15803d', secondaryColor: '#ffffff', division: 'D', reputation: 54, budget: 1050000, wageBudget: 98000, stadiumName: 'Marizão', stadiumCapacity: 10000 },
  { id: 'anapolis', name: 'Anápolis FC', shortName: 'ANA', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'D', reputation: 53, budget: 920000, wageBudget: 90000, stadiumName: 'Jonas Duarte', stadiumCapacity: 14000 },
  { id: 'princesa_sol', name: 'Princesa do Solimões', shortName: 'PRI', primaryColor: '#dc2626', secondaryColor: '#ffffff', division: 'D', reputation: 50, budget: 780000, wageBudget: 78000, stadiumName: 'Gilbertão Manacapuru', stadiumCapacity: 8000 },
  { id: 'trem_ap', name: 'Trem Desportivo Clube', shortName: 'TRM', primaryColor: '#dc2626', secondaryColor: '#18181b', division: 'D', reputation: 49, budget: 720000, wageBudget: 72000, stadiumName: 'Zerão', stadiumCapacity: 13000 },
  { id: 'manauara', name: 'Manauara EC', shortName: 'MAN', primaryColor: '#ca8a04', secondaryColor: '#18181b', division: 'D', reputation: 52, budget: 880000, wageBudget: 88000, stadiumName: 'Colina Mauazinho', stadiumCapacity: 10000 },

  // GIGANTES DA EUROPA (16 Clubes Mundiais - Champions League)
  { id: 'rma', name: 'Real Madrid', shortName: 'RMA', primaryColor: '#ffffff', secondaryColor: '#1e3a8a', division: 'EUROPA', reputation: 96, budget: 380000000, wageBudget: 7500000, stadiumName: 'Santiago Bernabéu', stadiumCapacity: 84000, rivalClubIds: ['bar', 'atm'], derbyName: 'El Clásico' },
  { id: 'bar', name: 'Barcelona', shortName: 'BAR', primaryColor: '#004d98', secondaryColor: '#a50044', division: 'EUROPA', reputation: 94, budget: 310000000, wageBudget: 6800000, stadiumName: 'Spotify Camp Nou', stadiumCapacity: 99000, rivalClubIds: ['rma', 'atm'], derbyName: 'El Clásico' },
  { id: 'atm', name: 'Atlético de Madrid', shortName: 'ATM', primaryColor: '#cb3524', secondaryColor: '#272e61', division: 'EUROPA', reputation: 91, budget: 280000000, wageBudget: 5900000, stadiumName: 'Cívitas Metropolitano', stadiumCapacity: 70000, rivalClubIds: ['rma', 'bar'], derbyName: 'Derbi Madrileño' },
  { id: 'mci', name: 'Manchester City', shortName: 'MCI', primaryColor: '#6cabdd', secondaryColor: '#1c2c5b', division: 'EUROPA', reputation: 95, budget: 420000000, wageBudget: 8000000, stadiumName: 'Etihad Stadium', stadiumCapacity: 53000, rivalClubIds: ['mun', 'liv', 'ars'], derbyName: 'Manchester Derby' },
  { id: 'ars', name: 'Arsenal', shortName: 'ARS', primaryColor: '#ef0107', secondaryColor: '#063672', division: 'EUROPA', reputation: 93, budget: 300000000, wageBudget: 6200000, stadiumName: 'Emirates Stadium', stadiumCapacity: 60000, rivalClubIds: ['che', 'mun', 'mci'], derbyName: 'North London Derby' },
  { id: 'liv', name: 'Liverpool', shortName: 'LIV', primaryColor: '#c8102e', secondaryColor: '#00b2a9', division: 'EUROPA', reputation: 94, budget: 330000000, wageBudget: 6500000, stadiumName: 'Anfield', stadiumCapacity: 61000, rivalClubIds: ['mun', 'mci', 'che'], derbyName: 'North West Derby' },
  { id: 'che', name: 'Chelsea', shortName: 'CHE', primaryColor: '#034694', secondaryColor: '#ffffff', division: 'EUROPA', reputation: 91, budget: 350000000, wageBudget: 7000000, stadiumName: 'Stamford Bridge', stadiumCapacity: 40000, rivalClubIds: ['ars', 'mun', 'mci'], derbyName: 'London Derby' },
  { id: 'mun', name: 'Manchester United', shortName: 'MUN', primaryColor: '#da291c', secondaryColor: '#000000', division: 'EUROPA', reputation: 91, budget: 340000000, wageBudget: 6900000, stadiumName: 'Old Trafford', stadiumCapacity: 74000, rivalClubIds: ['mci', 'liv', 'ars'], derbyName: 'Manchester Derby' },
  { id: 'bay', name: 'Bayern de Munique', shortName: 'BAY', primaryColor: '#dc052d', secondaryColor: '#0066b2', division: 'EUROPA', reputation: 95, budget: 360000000, wageBudget: 7200000, stadiumName: 'Allianz Arena', stadiumCapacity: 75000, rivalClubIds: ['dor', 'lev'], derbyName: 'Der Klassiker' },
  { id: 'dor', name: 'Borussia Dortmund', shortName: 'BVB', primaryColor: '#fde100', secondaryColor: '#000000', division: 'EUROPA', reputation: 90, budget: 260000000, wageBudget: 5500000, stadiumName: 'Signal Iduna Park', stadiumCapacity: 81000, rivalClubIds: ['bay', 'lev'], derbyName: 'Der Klassiker' },
  { id: 'lev', name: 'Bayer Leverkusen', shortName: 'B04', primaryColor: '#e32221', secondaryColor: '#000000', division: 'EUROPA', reputation: 90, budget: 250000000, wageBudget: 5200000, stadiumName: 'BayArena', stadiumCapacity: 30000, rivalClubIds: ['bay', 'dor'], derbyName: 'Rhein Derby' },
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', primaryColor: '#004170', secondaryColor: '#da291c', division: 'EUROPA', reputation: 93, budget: 400000000, wageBudget: 7800000, stadiumName: 'Parc des Princes', stadiumCapacity: 48000, rivalClubIds: ['rma', 'mci'], derbyName: 'Le Classique' },
  { id: 'int_mil', name: 'Inter de Milão', shortName: 'INT', primaryColor: '#001ea0', secondaryColor: '#000000', division: 'EUROPA', reputation: 92, budget: 280000000, wageBudget: 5800000, stadiumName: 'San Siro', stadiumCapacity: 75000, rivalClubIds: ['mil', 'juv_ita'], derbyName: 'Derby della Madonnina' },
  { id: 'mil', name: 'Milan', shortName: 'MIL', primaryColor: '#fb090b', secondaryColor: '#000000', division: 'EUROPA', reputation: 91, budget: 270000000, wageBudget: 5600000, stadiumName: 'San Siro', stadiumCapacity: 75000, rivalClubIds: ['int_mil', 'juv_ita'], derbyName: 'Derby della Madonnina' },
  { id: 'juv_ita', name: 'Juventus', shortName: 'JUV', primaryColor: '#ffffff', secondaryColor: '#000000', division: 'EUROPA', reputation: 92, budget: 290000000, wageBudget: 6000000, stadiumName: 'Allianz Stadium', stadiumCapacity: 41000, rivalClubIds: ['int_mil', 'mil'], derbyName: 'Derby d’Italia' },
  { id: 'ben', name: 'Benfica', shortName: 'SLB', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'EUROPA', reputation: 89, budget: 220000000, wageBudget: 4800000, stadiumName: 'Estádio da Luz', stadiumCapacity: 65000, rivalClubIds: ['rma', 'bar'], derbyName: 'Clássico Lusitano' },
];

export function generateBrazilDatabase(): {
  clubs: Record<string, Club>;
  leagues: Record<Division, League>;
} {
  const clubs: Record<string, Club> = {};

  RAW_CLUBS.forEach((raw) => {
    // 18 jogadores no elenco profissional
    let roster: Player[] = ROSTER_POSITIONS.map((pos, idx) => 
      generatePlayer(raw.id, idx + 1, pos, raw.division, false)
    );

    // Injeta os craques reais atualizados
    roster = injectFamousStars(raw.id, roster);

    // 11 jogadores no elenco Sub-20
    const youthRoster: Player[] = YOUTH_POSITIONS.map((pos, idx) => 
      generatePlayer(raw.id, idx + 1, pos, raw.division, true)
    );

    const stadiumLevel = (raw.division === 'A' || raw.division === 'EUROPA') ? 5 : raw.division === 'B' ? 3 : raw.division === 'C' ? 2 : 1;

    clubs[raw.id] = {
      ...raw,
      stadiumLevel,
      roster,
      youthRoster,
    };
  });

  // Aplica o Patch Oficial 2026 (Neymar no Santos, transferências reais, sem duplicatas)
  const patchedClubs = applyRosterPatch2026(clubs);

  // Criar estrutura das Ligas (Séries A, B, C, D e Champions League / Europa)
  const divisions: Division[] = ['A', 'B', 'C', 'D', 'EUROPA'];
  const leagues = {} as Record<Division, League>;

  divisions.forEach((div) => {
    const divClubs = Object.values(patchedClubs).filter((c) => c.division === div);
    
    const standings: LeagueStanding[] = divClubs.map((club) => ({
      clubId: club.id,
      clubName: club.name,
      shortName: club.shortName,
      primaryColor: club.primaryColor,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }));

    // Gerar partidas da rodada 1 para visualização imediata
    const fixtures: Fixture[] = [];
    const comp = (div === 'EUROPA' ? 'champions_league' : `serie_${div.toLowerCase()}`) as CompetitionType;
    for (let i = 0; i < divClubs.length; i += 2) {
      if (divClubs[i + 1]) {
        fixtures.push({
          id: `fix-${div}-w1-${i / 2}`,
          week: 1,
          competition: comp,
          homeClubId: divClubs[i].id,
          awayClubId: divClubs[i + 1].id,
          isPlayed: false,
          division: div,
        });
      }
    }

    leagues[div] = {
      id: div === 'EUROPA' ? 'champions-league-europa' : `brasileirao-serie-${div.toLowerCase()}`,
      name: div === 'EUROPA' ? 'Champions League • Europa' : `Brasileirão Série ${div}`,
      division: div,
      isProOnly: div === 'EUROPA',
      standings,
      fixtures,
    };
  });

  return { clubs: patchedClubs, leagues };
}
