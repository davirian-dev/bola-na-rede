// ==============================================================================
// BOLA NA REDE: CARREIRA - BANCO DE DADOS GLOBAL: MLS & SAUDI PRO LEAGUE (src/data/globalLeaguesSeed.ts)
// Ligas Oficiais de Lionel Messi (MLS) e Cristiano Ronaldo / Neymar Jr (Liga Saudita)
// ==============================================================================

import { Club, Division, Player, Position } from '@/types/game';
import { generatePlayer } from './brazilSeed';
import { injectFamousStars } from './famousStarRosters';

export interface RawGlobalClubDef {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  division: Division;
  country: string;
  countryFlag: string;
  reputation: number;
  budget: number;
  wageBudget: number;
  stadiumName: string;
  stadiumCapacity: number;
  rivalClubIds?: string[];
  derbyName?: string;
}

export const RAW_GLOBAL_CLUBS: RawGlobalClubDef[] = [
  // ============================================================================
  // 1. ESTADOS UNIDOS - MAJOR LEAGUE SOCCER (MLS • LIGA DO MESSI)
  // ============================================================================
  {
    id: 'mia',
    name: 'Inter Miami CF',
    shortName: 'MIA',
    primaryColor: '#f7b5cd',
    secondaryColor: '#18181b',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 87,
    budget: 180000000,
    wageBudget: 4500000,
    stadiumName: 'Chase Stadium (Fort Lauderdale)',
    stadiumCapacity: 21550,
    rivalClubIds: ['orl'],
    derbyName: 'Florida Derby',
  },
  {
    id: 'lafc',
    name: 'Los Angeles FC',
    shortName: 'LAFC',
    primaryColor: '#c39e5c',
    secondaryColor: '#18181b',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 84,
    budget: 140000000,
    wageBudget: 3500000,
    stadiumName: 'BMO Stadium',
    stadiumCapacity: 22000,
    rivalClubIds: ['lag'],
    derbyName: 'El Tráfico',
  },
  {
    id: 'lag',
    name: 'LA Galaxy',
    shortName: 'LAG',
    primaryColor: '#ffffff',
    secondaryColor: '#00245d',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 83,
    budget: 135000000,
    wageBudget: 3400000,
    stadiumName: 'Dignity Health Sports Park',
    stadiumCapacity: 27000,
    rivalClubIds: ['lafc'],
    derbyName: 'El Tráfico',
  },
  {
    id: 'col_crew',
    name: 'Columbus Crew',
    shortName: 'CLB',
    primaryColor: '#fedd00',
    secondaryColor: '#18181b',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 82,
    budget: 110000000,
    wageBudget: 2800000,
    stadiumName: 'Lower.com Field',
    stadiumCapacity: 20371,
    rivalClubIds: ['cin'],
    derbyName: 'Hell is Real Derby',
  },
  {
    id: 'cin',
    name: 'FC Cincinnati',
    shortName: 'CIN',
    primaryColor: '#f05323',
    secondaryColor: '#263b80',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 82,
    budget: 115000000,
    wageBudget: 2900000,
    stadiumName: 'TQL Stadium',
    stadiumCapacity: 26000,
    rivalClubIds: ['col_crew'],
    derbyName: 'Hell is Real Derby',
  },
  {
    id: 'sea',
    name: 'Seattle Sounders',
    shortName: 'SEA',
    primaryColor: '#005595',
    secondaryColor: '#658d1b',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 81,
    budget: 105000000,
    wageBudget: 2600000,
    stadiumName: 'Lumen Field',
    stadiumCapacity: 37722,
    rivalClubIds: ['por'],
    derbyName: 'Cascadia Cup',
  },
  {
    id: 'nyrb',
    name: 'New York Red Bulls',
    shortName: 'RBNY',
    primaryColor: '#ed1e36',
    secondaryColor: '#ffffff',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 80,
    budget: 100000000,
    wageBudget: 2500000,
    stadiumName: 'Red Bull Arena',
    stadiumCapacity: 25000,
    rivalClubIds: ['nycfc'],
    derbyName: 'Hudson River Derby',
  },
  {
    id: 'atl',
    name: 'Atlanta United',
    shortName: 'ATL',
    primaryColor: '#80000a',
    secondaryColor: '#18181b',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 80,
    budget: 110000000,
    wageBudget: 2700000,
    stadiumName: 'Mercedes-Benz Stadium',
    stadiumCapacity: 42500,
    rivalClubIds: ['orl'],
  },
  {
    id: 'orl',
    name: 'Orlando City SC',
    shortName: 'ORL',
    primaryColor: '#61259e',
    secondaryColor: '#ffe169',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 80,
    budget: 95000000,
    wageBudget: 2400000,
    stadiumName: 'Inter&Co Stadium',
    stadiumCapacity: 25500,
    rivalClubIds: ['mia'],
    derbyName: 'Florida Derby',
  },
  {
    id: 'nycfc',
    name: 'New York City FC',
    shortName: 'NYC',
    primaryColor: '#6caddf',
    secondaryColor: '#001489',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 79,
    budget: 98000000,
    wageBudget: 2450000,
    stadiumName: 'Yankee Stadium',
    stadiumCapacity: 28743,
    rivalClubIds: ['nyrb'],
    derbyName: 'Hudson River Derby',
  },
  {
    id: 'hou',
    name: 'Houston Dynamo',
    shortName: 'HOU',
    primaryColor: '#f4911e',
    secondaryColor: '#18181b',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 78,
    budget: 85000000,
    wageBudget: 2100000,
    stadiumName: 'Shell Energy Stadium',
    stadiumCapacity: 22039,
  },
  {
    id: 'por',
    name: 'Portland Timbers',
    shortName: 'POR',
    primaryColor: '#004812',
    secondaryColor: '#eae827',
    division: 'MLS',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    reputation: 78,
    budget: 88000000,
    wageBudget: 2200000,
    stadiumName: 'Providence Park',
    stadiumCapacity: 25218,
    rivalClubIds: ['sea'],
    derbyName: 'Cascadia Cup',
  },

  // ============================================================================
  // 2. ARÁBIA SAUDITA - SAUDI PRO LEAGUE (LIGA DO CRISTIANO RONALDO E NEYMAR)
  // ============================================================================
  {
    id: 'aln',
    name: 'Al-Nassr FC',
    shortName: 'NAS',
    primaryColor: '#ffdd00',
    secondaryColor: '#0038a8',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 91,
    budget: 450000000,
    wageBudget: 9500000,
    stadiumName: 'Al-Awwal Park (Riyadh)',
    stadiumCapacity: 25000,
    rivalClubIds: ['hil', 'shb'],
    derbyName: 'Riyadh Derby',
  },
  {
    id: 'hil',
    name: 'Al-Hilal SFC',
    shortName: 'HIL',
    primaryColor: '#0053a0',
    secondaryColor: '#ffffff',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 92,
    budget: 500000000,
    wageBudget: 10500000,
    stadiumName: 'Kingdom Arena (Riyadh)',
    stadiumCapacity: 30000,
    rivalClubIds: ['aln', 'itt'],
    derbyName: 'Saudi El Clásico',
  },
  {
    id: 'itt',
    name: 'Al-Ittihad Club',
    shortName: 'ITT',
    primaryColor: '#ffdd00',
    secondaryColor: '#18181b',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 89,
    budget: 420000000,
    wageBudget: 8800000,
    stadiumName: 'King Abdullah Sports City (Jeddah)',
    stadiumCapacity: 62345,
    rivalClubIds: ['ahl', 'hil'],
    derbyName: 'Jeddah Derby',
  },
  {
    id: 'ahl',
    name: 'Al-Ahli Saudi FC',
    shortName: 'AHL',
    primaryColor: '#006837',
    secondaryColor: '#ffffff',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 88,
    budget: 390000000,
    wageBudget: 8000000,
    stadiumName: 'King Abdullah Sports City (Jeddah)',
    stadiumCapacity: 62345,
    rivalClubIds: ['itt'],
    derbyName: 'Jeddah Derby',
  },
  {
    id: 'ett',
    name: 'Al-Ettifaq FC',
    shortName: 'ETT',
    primaryColor: '#007a3d',
    secondaryColor: '#c8102e',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 82,
    budget: 180000000,
    wageBudget: 3800000,
    stadiumName: 'Ettifaq Club Stadium (Dammam)',
    stadiumCapacity: 15000,
    rivalClubIds: ['fat'],
  },
  {
    id: 'shb',
    name: 'Al-Shabab FC',
    shortName: 'SHB',
    primaryColor: '#ffffff',
    secondaryColor: '#18181b',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 81,
    budget: 170000000,
    wageBudget: 3500000,
    stadiumName: 'Al-Shabab Club Stadium (Riyadh)',
    stadiumCapacity: 15000,
    rivalClubIds: ['aln', 'hil'],
    derbyName: 'Capital Derby',
  },
  {
    id: 'taa',
    name: 'Al-Taawoun FC',
    shortName: 'TAA',
    primaryColor: '#ffdd00',
    secondaryColor: '#0053a0',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 79,
    budget: 120000000,
    wageBudget: 2500000,
    stadiumName: 'King Abdullah Stadium (Buraidah)',
    stadiumCapacity: 25000,
  },
  {
    id: 'fat',
    name: 'Al-Fateh SC',
    shortName: 'FAT',
    primaryColor: '#0053a0',
    secondaryColor: '#00843d',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 78,
    budget: 110000000,
    wageBudget: 2300000,
    stadiumName: 'Al-Fateh Club Stadium (Al-Hasa)',
    stadiumCapacity: 12000,
  },
  {
    id: 'wehd',
    name: 'Al-Wehda FC',
    shortName: 'WEH',
    primaryColor: '#da291c',
    secondaryColor: '#ffffff',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 77,
    budget: 95000000,
    wageBudget: 2000000,
    stadiumName: 'King Abdulaziz Stadium (Mecca)',
    stadiumCapacity: 38000,
  },
  {
    id: 'khd',
    name: 'Al-Kholood Club',
    shortName: 'KHD',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    division: 'SAUDI_PRO',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    reputation: 76,
    budget: 85000000,
    wageBudget: 1800000,
    stadiumName: 'Al-Hazem Club Stadium (Ar Rass)',
    stadiumCapacity: 8000,
  },
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

/**
 * Gera o banco de clubes da MLS e Saudi Pro League com elencos e astros mundiais reais
 */
export function generateGlobalClubs(): Record<string, Club> {
  const result: Record<string, Club> = {};

  for (const raw of RAW_GLOBAL_CLUBS) {
    // 18 jogadores no elenco profissional
    let roster: Player[] = ROSTER_POSITIONS.map((pos, idx) =>
      generatePlayer(raw.id, idx + 1, pos, raw.division, false)
    );

    // Injeta os astros reais (Messi, CR7, Neymar, etc.) no elenco
    roster = injectFamousStars(raw.id, roster);

    // 11 jogadores no elenco Sub-20
    const youthRoster: Player[] = YOUTH_POSITIONS.map((pos, idx) =>
      generatePlayer(raw.id, idx + 1, pos, raw.division, true)
    );

    result[raw.id] = {
      id: raw.id,
      name: raw.name,
      shortName: raw.shortName,
      primaryColor: raw.primaryColor,
      secondaryColor: raw.secondaryColor,
      division: raw.division,
      country: raw.country,
      countryFlag: raw.countryFlag,
      reputation: raw.reputation,
      budget: raw.budget,
      transferBudget: Math.round(raw.budget * 0.45),
      wageBudget: raw.wageBudget,
      stadiumName: raw.stadiumName,
      stadiumCapacity: raw.stadiumCapacity,
      stadiumLevel: raw.reputation >= 90 ? 5 : raw.reputation >= 82 ? 4 : 3,
      roster,
      youthRoster,
      rivalClubIds: raw.rivalClubIds,
      derbyName: raw.derbyName,
      captainPlayerId: roster[0]?.id || `${raw.id}-p-1`,
      penaltyTakerPlayerId: roster[0]?.id || `${raw.id}-p-1`,
      freeKickTakerPlayerId: roster[0]?.id || `${raw.id}-p-1`,
      lineup: roster.slice(0, 11).map((p) => p.id),
      tactics: {
        formation: '4-3-3',
        philosophy: raw.reputation >= 85 ? 'attacking' : 'balanced',
      },
      customKits: {
        home: {
          primaryColor: raw.primaryColor,
          secondaryColor: raw.secondaryColor,
          pattern: 'solid',
          collarType: 'round',
          sponsorText: raw.division === 'MLS' ? 'APPLE TV' : 'ROSHN',
        },
        away: {
          primaryColor: raw.secondaryColor === '#ffffff' ? '#18181b' : '#ffffff',
          secondaryColor: raw.primaryColor,
          pattern: 'solid',
          collarType: 'v_neck',
        },
      },
    };
  }

  return result;
}
