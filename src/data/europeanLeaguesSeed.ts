// ==============================================================================
// BOLA NA REDE: CARREIRA - BANCO DE DADOS DE CLUBES EUROPEUS (src/data/europeanLeaguesSeed.ts)
// Ligas Oficiais A e B da Inglaterra, Espanha, Itália, Alemanha e França
// ==============================================================================

import { Club, Division, KitPattern, Player, Position } from '@/types/game';
import { generatePlayer } from './brazilSeed';
import { injectFamousStars } from './famousStarRosters';
import { organizeRosterForFormation } from '@/engine/positionEngine';

export interface RawEuropeanClubDef {
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

export const RAW_EUROPEAN_CLUBS: RawEuropeanClubDef[] = [
  // ============================================================================
  // 1. INGLATERRA - PREMIER LEAGUE (DIVISÃO A)
  // ============================================================================
  { id: 'mci', name: 'Manchester City', shortName: 'MCI', primaryColor: '#6cabdd', secondaryColor: '#1c2c5b', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 96, budget: 420000000, wageBudget: 8000000, stadiumName: 'Etihad Stadium', stadiumCapacity: 53400, rivalClubIds: ['mun', 'liv', 'ars'], derbyName: 'Manchester Derby' },
  { id: 'ars', name: 'Arsenal', shortName: 'ARS', primaryColor: '#ef0107', secondaryColor: '#063672', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 93, budget: 320000000, wageBudget: 6500000, stadiumName: 'Emirates Stadium', stadiumCapacity: 60700, rivalClubIds: ['tot', 'che', 'mun'], derbyName: 'North London Derby' },
  { id: 'liv', name: 'Liverpool', shortName: 'LIV', primaryColor: '#c8102e', secondaryColor: '#00b2a9', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 94, budget: 340000000, wageBudget: 6800000, stadiumName: 'Anfield', stadiumCapacity: 61276, rivalClubIds: ['mun', 'eve', 'mci'], derbyName: 'Merseyside Derby' },
  { id: 'che', name: 'Chelsea', shortName: 'CHE', primaryColor: '#034694', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 90, budget: 350000000, wageBudget: 7000000, stadiumName: 'Stamford Bridge', stadiumCapacity: 40341, rivalClubIds: ['ars', 'tot', 'ful'], derbyName: 'West London Derby' },
  { id: 'mun', name: 'Manchester United', shortName: 'MUN', primaryColor: '#da291c', secondaryColor: '#000000', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 91, budget: 330000000, wageBudget: 6900000, stadiumName: 'Old Trafford', stadiumCapacity: 74310, rivalClubIds: ['mci', 'liv', 'lee'], derbyName: 'Roses Rivalry' },
  { id: 'tot', name: 'Tottenham Hotspur', shortName: 'TOT', primaryColor: '#132257', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 89, budget: 260000000, wageBudget: 5500000, stadiumName: 'Tottenham Hotspur Stadium', stadiumCapacity: 62850, rivalClubIds: ['ars', 'che', 'whu'], derbyName: 'North London Derby' },
  { id: 'new', name: 'Newcastle United', shortName: 'NEW', primaryColor: '#241f20', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 88, budget: 280000000, wageBudget: 5200000, stadiumName: 'St. James Park', stadiumCapacity: 52305, rivalClubIds: ['sun'], derbyName: 'Tyne-Wear Derby' },
  { id: 'avl', name: 'Aston Villa', shortName: 'AVL', primaryColor: '#95bfe5', secondaryColor: '#670e36', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 87, budget: 220000000, wageBudget: 4600000, stadiumName: 'Villa Park', stadiumCapacity: 42640, rivalClubIds: ['wol', 'wba'], derbyName: 'Second City Derby' },
  { id: 'bha', name: 'Brighton & Hove Albion', shortName: 'BHA', primaryColor: '#0057b8', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 83, budget: 150000000, wageBudget: 3400000, stadiumName: 'Amex Stadium', stadiumCapacity: 31800, rivalClubIds: ['cry'], derbyName: 'M23 Derby' },
  { id: 'whu', name: 'West Ham United', shortName: 'WHU', primaryColor: '#7a263a', secondaryColor: '#1bb1e7', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 83, budget: 160000000, wageBudget: 3600000, stadiumName: 'London Stadium', stadiumCapacity: 62500, rivalClubIds: ['tot', 'che'], derbyName: 'East London Derby' },
  { id: 'bou', name: 'AFC Bournemouth', shortName: 'BOU', primaryColor: '#da291c', secondaryColor: '#000000', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 79, budget: 95000000, wageBudget: 2200000, stadiumName: 'Vitality Stadium', stadiumCapacity: 11307 },
  { id: 'cry', name: 'Crystal Palace', shortName: 'CRY', primaryColor: '#1b458f', secondaryColor: '#c4122e', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 80, budget: 110000000, wageBudget: 2500000, stadiumName: 'Selhurst Park', stadiumCapacity: 25486, rivalClubIds: ['bha'], derbyName: 'M23 Derby' },
  { id: 'wol', name: 'Wolverhampton Wanderers', shortName: 'WOL', primaryColor: '#fdb913', secondaryColor: '#231f20', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 80, budget: 120000000, wageBudget: 2600000, stadiumName: 'Molineux', stadiumCapacity: 31750, rivalClubIds: ['avl', 'wba'], derbyName: 'Black Country Derby' },
  { id: 'ful', name: 'Fulham FC', shortName: 'FUL', primaryColor: '#ffffff', secondaryColor: '#000000', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 80, budget: 115000000, wageBudget: 2400000, stadiumName: 'Craven Cottage', stadiumCapacity: 25700, rivalClubIds: ['che'], derbyName: 'West London Derby' },
  { id: 'eve', name: 'Everton FC', shortName: 'EVE', primaryColor: '#003399', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 81, budget: 130000000, wageBudget: 2800000, stadiumName: 'Goodison Park', stadiumCapacity: 39572, rivalClubIds: ['liv'], derbyName: 'Merseyside Derby' },
  { id: 'bre', name: 'Brentford FC', shortName: 'BRE', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 80, budget: 105000000, wageBudget: 2300000, stadiumName: 'Gtech Community', stadiumCapacity: 17250 },
  { id: 'nfo', name: 'Nottingham Forest', shortName: 'NFO', primaryColor: '#dd0000', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 80, budget: 125000000, wageBudget: 2600000, stadiumName: 'City Ground', stadiumCapacity: 30445 },
  { id: 'lei', name: 'Leicester City', shortName: 'LEI', primaryColor: '#003090', secondaryColor: '#fdbe11', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 81, budget: 120000000, wageBudget: 2500000, stadiumName: 'King Power Stadium', stadiumCapacity: 32261 },
  { id: 'sou', name: 'Southampton FC', shortName: 'SOU', primaryColor: '#d71920', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 78, budget: 90000000, wageBudget: 2000000, stadiumName: 'St. Marys Stadium', stadiumCapacity: 32384 },
  { id: 'ips', name: 'Ipswich Town', shortName: 'IPS', primaryColor: '#0053a0', secondaryColor: '#ffffff', division: 'PL', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 76, budget: 75000000, wageBudget: 1700000, stadiumName: 'Portman Road', stadiumCapacity: 29673, rivalClubIds: ['nor'], derbyName: 'East Anglian Derby' },

  // ============================================================================
  // 2. INGLATERRA - EFL CHAMPIONSHIP (DIVISÃO B)
  // ============================================================================
  { id: 'lee', name: 'Leeds United', shortName: 'LEE', primaryColor: '#ffffff', secondaryColor: '#0053a0', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 78, budget: 65000000, wageBudget: 1500000, stadiumName: 'Elland Road', stadiumCapacity: 37890, rivalClubIds: ['mun'], derbyName: 'Roses Rivalry' },
  { id: 'bur', name: 'Burnley FC', shortName: 'BUR', primaryColor: '#6c1d45', secondaryColor: '#99d6ea', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 77, budget: 58000000, wageBudget: 1350000, stadiumName: 'Turf Moor', stadiumCapacity: 21944 },
  { id: 'shu', name: 'Sheffield United', shortName: 'SHU', primaryColor: '#ee2737', secondaryColor: '#000000', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 76, budget: 52000000, wageBudget: 1250000, stadiumName: 'Bramall Lane', stadiumCapacity: 32050 },
  { id: 'sun', name: 'Sunderland AFC', shortName: 'SUN', primaryColor: '#eb172b', secondaryColor: '#ffffff', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 76, budget: 50000000, wageBudget: 1200000, stadiumName: 'Stadium of Light', stadiumCapacity: 49000, rivalClubIds: ['new'], derbyName: 'Tyne-Wear Derby' },
  { id: 'mid', name: 'Middlesbrough FC', shortName: 'MID', primaryColor: '#e00000', secondaryColor: '#ffffff', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 75, budget: 45000000, wageBudget: 1100000, stadiumName: 'Riverside Stadium', stadiumCapacity: 34742 },
  { id: 'wba', name: 'West Bromwich Albion', shortName: 'WBA', primaryColor: '#122f67', secondaryColor: '#ffffff', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 75, budget: 44000000, wageBudget: 1080000, stadiumName: 'The Hawthorns', stadiumCapacity: 26850, rivalClubIds: ['wol', 'avl'], derbyName: 'Black Country Derby' },
  { id: 'wat', name: 'Watford FC', shortName: 'WAT', primaryColor: '#fbee23', secondaryColor: '#ed2127', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 74, budget: 42000000, wageBudget: 1020000, stadiumName: 'Vicarage Road', stadiumCapacity: 22200 },
  { id: 'nor', name: 'Norwich City', shortName: 'NOR', primaryColor: '#fff200', secondaryColor: '#00a651', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 75, budget: 43000000, wageBudget: 1050000, stadiumName: 'Carrow Road', stadiumCapacity: 27244, rivalClubIds: ['ips'], derbyName: 'East Anglian Derby' },
  { id: 'cov', name: 'Coventry City', shortName: 'COV', primaryColor: '#6cb4e4', secondaryColor: '#ffffff', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 73, budget: 36000000, wageBudget: 900000, stadiumName: 'Coventry Building Society Arena', stadiumCapacity: 32609 },
  { id: 'hul', name: 'Hull City', shortName: 'HUL', primaryColor: '#f7931e', secondaryColor: '#000000', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 72, budget: 32000000, wageBudget: 850000, stadiumName: 'MKM Stadium', stadiumCapacity: 25586 },
  { id: 'bri', name: 'Bristol City', shortName: 'BCI', primaryColor: '#e31b23', secondaryColor: '#ffffff', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 72, budget: 30000000, wageBudget: 820000, stadiumName: 'Ashton Gate', stadiumCapacity: 27000 },
  { id: 'qpr', name: 'Queens Park Rangers', shortName: 'QPR', primaryColor: '#0053a0', secondaryColor: '#ffffff', division: 'CHAMPIONSHIP', country: 'Inglaterra', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', reputation: 72, budget: 31000000, wageBudget: 840000, stadiumName: 'Loftus Road', stadiumCapacity: 18439 },

  // ============================================================================
  // 3. ESPANHA - LA LIGA EA SPORTS (DIVISÃO A)
  // ============================================================================
  { id: 'rma', name: 'Real Madrid', shortName: 'RMA', primaryColor: '#ffffff', secondaryColor: '#1e3a8a', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 97, budget: 450000000, wageBudget: 8500000, stadiumName: 'Santiago Bernabéu', stadiumCapacity: 84744, rivalClubIds: ['bar', 'atm'], derbyName: 'El Clásico' },
  { id: 'bar', name: 'FC Barcelona', shortName: 'BAR', primaryColor: '#004d98', secondaryColor: '#a50044', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 95, budget: 360000000, wageBudget: 7400000, stadiumName: 'Spotify Camp Nou', stadiumCapacity: 99354, rivalClubIds: ['rma', 'esp'], derbyName: 'El Clásico' },
  { id: 'atm', name: 'Atlético de Madrid', shortName: 'ATM', primaryColor: '#cb3524', secondaryColor: '#272e61', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 91, budget: 270000000, wageBudget: 5800000, stadiumName: 'Cívitas Metropolitano', stadiumCapacity: 70460, rivalClubIds: ['rma', 'bar'], derbyName: 'Derbi Madrileño' },
  { id: 'gir', name: 'Girona FC', shortName: 'GIR', primaryColor: '#cd1425', secondaryColor: '#ffffff', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 86, budget: 140000000, wageBudget: 3200000, stadiumName: 'Montilivi', stadiumCapacity: 14624 },
  { id: 'ath', name: 'Athletic Club Bilbao', shortName: 'ATH', primaryColor: '#ee2524', secondaryColor: '#ffffff', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 87, budget: 170000000, wageBudget: 3700000, stadiumName: 'San Mamés', stadiumCapacity: 53289, rivalClubIds: ['rso'], derbyName: 'Derbi Vasco' },
  { id: 'rso', name: 'Real Sociedad', shortName: 'RSO', primaryColor: '#0067b1', secondaryColor: '#ffffff', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 86, budget: 160000000, wageBudget: 3500000, stadiumName: 'Reale Arena', stadiumCapacity: 39313, rivalClubIds: ['ath'], derbyName: 'Derbi Vasco' },
  { id: 'bet', name: 'Real Betis', shortName: 'BET', primaryColor: '#0bb364', secondaryColor: '#ffffff', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 84, budget: 130000000, wageBudget: 2900000, stadiumName: 'Benito Villamarín', stadiumCapacity: 60721, rivalClubIds: ['sev'], derbyName: 'El Gran Derbi' },
  { id: 'vil', name: 'Villarreal CF', shortName: 'VIL', primaryColor: '#ffe600', secondaryColor: '#00519e', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 85, budget: 135000000, wageBudget: 3000000, stadiumName: 'Estadio de la Cerámica', stadiumCapacity: 23500 },
  { id: 'sev', name: 'Sevilla FC', shortName: 'SEV', primaryColor: '#ffffff', secondaryColor: '#d4001f', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 83, budget: 120000000, wageBudget: 2700000, stadiumName: 'Ramón Sánchez-Pizjuán', stadiumCapacity: 43883, rivalClubIds: ['bet'], derbyName: 'El Gran Derbi' },
  { id: 'cel', name: 'Celta de Vigo', shortName: 'CEL', primaryColor: '#87ceeb', secondaryColor: '#ffffff', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 79, budget: 85000000, wageBudget: 1900000, stadiumName: 'Balaídos', stadiumCapacity: 24791 },
  { id: 'osa', name: 'CA Osasuna', shortName: 'OSA', primaryColor: '#d91a2a', secondaryColor: '#001c48', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 80, budget: 90000000, wageBudget: 2000000, stadiumName: 'El Sadar', stadiumCapacity: 23576 },
  { id: 'val', name: 'Valencia CF', shortName: 'VAL', primaryColor: '#ffffff', secondaryColor: '#000000', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 81, budget: 105000000, wageBudget: 2300000, stadiumName: 'Mestalla', stadiumCapacity: 49430, rivalClubIds: ['vil', 'lev'], derbyName: 'Derbi Valenciano' },
  { id: 'get', name: 'Getafe CF', shortName: 'GET', primaryColor: '#00529f', secondaryColor: '#ffffff', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 78, budget: 75000000, wageBudget: 1700000, stadiumName: 'Coliseum', stadiumCapacity: 16500 },
  { id: 'mll', name: 'RCD Mallorca', shortName: 'MLL', primaryColor: '#e20613', secondaryColor: '#000000', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 78, budget: 78000000, wageBudget: 1750000, stadiumName: 'Son Moix', stadiumCapacity: 23142 },
  { id: 'ray', name: 'Rayo Vallecano', shortName: 'RAY', primaryColor: '#ffffff', secondaryColor: '#d62627', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 78, budget: 70000000, wageBudget: 1600000, stadiumName: 'Vallecas', stadiumCapacity: 14708 },
  { id: 'lpa', name: 'UD Las Palmas', shortName: 'LPA', primaryColor: '#ffe000', secondaryColor: '#004c97', division: 'LALIGA', country: 'Espanha', countryFlag: '🇪🇸', reputation: 77, budget: 68000000, wageBudget: 1550000, stadiumName: 'Estadio Gran Canaria', stadiumCapacity: 32400 },

  // ============================================================================
  // 4. ESPANHA - LA LIGA HYPERMOTION (DIVISÃO B)
  // ============================================================================
  { id: 'lev', name: 'Levante UD', shortName: 'LEV', primaryColor: '#003366', secondaryColor: '#990000', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 76, budget: 38000000, wageBudget: 950000, stadiumName: 'Ciutat de València', stadiumCapacity: 26354, rivalClubIds: ['val'], derbyName: 'Derbi Valenciano' },
  { id: 'zar', name: 'Real Zaragoza', shortName: 'ZAR', primaryColor: '#ffffff', secondaryColor: '#003893', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 76, budget: 36000000, wageBudget: 920000, stadiumName: 'La Romareda', stadiumCapacity: 33608 },
  { id: 'spg', name: 'Sporting de Gijón', shortName: 'SPG', primaryColor: '#cc0000', secondaryColor: '#ffffff', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 75, budget: 34000000, wageBudget: 880000, stadiumName: 'El Molinón', stadiumCapacity: 30000, rivalClubIds: ['ovi'], derbyName: 'Derbi Asturiano' },
  { id: 'ovi', name: 'Real Oviedo', shortName: 'OVI', primaryColor: '#003399', secondaryColor: '#ffffff', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 75, budget: 35000000, wageBudget: 890000, stadiumName: 'Carlos Tartiere', stadiumCapacity: 30500, rivalClubIds: ['spg'], derbyName: 'Derbi Asturiano' },
  { id: 'rac', name: 'Racing de Santander', shortName: 'RAC', primaryColor: '#16a34a', secondaryColor: '#ffffff', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 74, budget: 30000000, wageBudget: 800000, stadiumName: 'El Sardinero', stadiumCapacity: 22222 },
  { id: 'elc', name: 'Elche CF', shortName: 'ELC', primaryColor: '#ffffff', secondaryColor: '#00843d', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 75, budget: 33000000, wageBudget: 850000, stadiumName: 'Martínez Valero', stadiumCapacity: 31388 },
  { id: 'eib', name: 'SD Eibar', shortName: 'EIB', primaryColor: '#8b0000', secondaryColor: '#00008b', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 74, budget: 29000000, wageBudget: 780000, stadiumName: 'Ipurua', stadiumCapacity: 8166 },
  { id: 'gra', name: 'Granada CF', shortName: 'GRA', primaryColor: '#c8102e', secondaryColor: '#ffffff', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 75, budget: 32000000, wageBudget: 840000, stadiumName: 'Los Cármenes', stadiumCapacity: 19336 },
  { id: 'cad', name: 'Cádiz CF', shortName: 'CAD', primaryColor: '#ffcc00', secondaryColor: '#003399', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 74, budget: 30000000, wageBudget: 810000, stadiumName: 'Nuevo Mirandilla', stadiumCapacity: 20724 },
  { id: 'ten', name: 'CD Tenerife', shortName: 'TEN', primaryColor: '#ffffff', secondaryColor: '#0047ab', division: 'SEGUNDA_ESP', country: 'Espanha', countryFlag: '🇪🇸', reputation: 73, budget: 27000000, wageBudget: 750000, stadiumName: 'Heliodoro Rodríguez López', stadiumCapacity: 22824 },

  // ============================================================================
  // 5. ITÁLIA - SERIE A ENILIVE (DIVISÃO A)
  // ============================================================================
  { id: 'int_mil', name: 'Inter de Milão', shortName: 'INT', primaryColor: '#004494', secondaryColor: '#000000', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 94, budget: 320000000, wageBudget: 6800000, stadiumName: 'San Siro (Giuseppe Meazza)', stadiumCapacity: 75817, rivalClubIds: ['acm', 'juv'], derbyName: 'Derby della Madonnina' },
  { id: 'acm', name: 'AC Milan', shortName: 'MIL', primaryColor: '#fb090b', secondaryColor: '#000000', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 92, budget: 290000000, wageBudget: 6200000, stadiumName: 'San Siro', stadiumCapacity: 75817, rivalClubIds: ['int_mil', 'juv'], derbyName: 'Derby della Madonnina' },
  { id: 'juv', name: 'Juventus', shortName: 'JUV', primaryColor: '#ffffff', secondaryColor: '#000000', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 93, budget: 310000000, wageBudget: 6600000, stadiumName: 'Allianz Stadium', stadiumCapacity: 41507, rivalClubIds: ['int_mil', 'acm', 'tor'], derbyName: 'Derby dItalia' },
  { id: 'ata', name: 'Atalanta BC', shortName: 'ATA', primaryColor: '#1e3d59', secondaryColor: '#000000', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 88, budget: 190000000, wageBudget: 4200000, stadiumName: 'Gewiss Stadium', stadiumCapacity: 24950 },
  { id: 'nap', name: 'SSC Napoli', shortName: 'NAP', primaryColor: '#007fff', secondaryColor: '#ffffff', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 90, budget: 240000000, wageBudget: 5100000, stadiumName: 'Stadio Diego Armando Maradona', stadiumCapacity: 54726, rivalClubIds: ['juv', 'rom'], derbyName: 'Derby del Sole' },
  { id: 'rom', name: 'AS Roma', shortName: 'ROM', primaryColor: '#8e1f2f', secondaryColor: '#f0bc42', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 87, budget: 180000000, wageBudget: 3900000, stadiumName: 'Stadio Olimpico', stadiumCapacity: 70634, rivalClubIds: ['laz'], derbyName: 'Derby della Capitale' },
  { id: 'laz', name: 'SS Lazio', shortName: 'LAZ', primaryColor: '#87ceeb', secondaryColor: '#ffffff', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 86, budget: 165000000, wageBudget: 3600000, stadiumName: 'Stadio Olimpico', stadiumCapacity: 70634, rivalClubIds: ['rom'], derbyName: 'Derby della Capitale' },
  { id: 'fio', name: 'Fiorentina', shortName: 'FIO', primaryColor: '#4f2e7e', secondaryColor: '#ffffff', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 84, budget: 135000000, wageBudget: 3000000, stadiumName: 'Artemio Franchi', stadiumCapacity: 43147, rivalClubIds: ['juv'] },
  { id: 'bol', name: 'Bologna FC', shortName: 'BOL', primaryColor: '#1d2a44', secondaryColor: '#8b1c2f', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 85, budget: 140000000, wageBudget: 3100000, stadiumName: 'Renato DallAra', stadiumCapacity: 36462 },
  { id: 'tor', name: 'Torino FC', shortName: 'TOR', primaryColor: '#800000', secondaryColor: '#ffffff', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 81, budget: 95000000, wageBudget: 2100000, stadiumName: 'Stadio Olimpico Grande Torino', stadiumCapacity: 28177, rivalClubIds: ['juv'], derbyName: 'Derby della Mole' },
  { id: 'mon', name: 'AC Monza', shortName: 'MON', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 79, budget: 80000000, wageBudget: 1800000, stadiumName: 'U-Power Stadium', stadiumCapacity: 17102 },
  { id: 'gen', name: 'Genoa CFC', shortName: 'GEN', primaryColor: '#8b0000', secondaryColor: '#002f6c', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 80, budget: 88000000, wageBudget: 1950000, stadiumName: 'Luigi Ferraris', stadiumCapacity: 36599, rivalClubIds: ['sam'], derbyName: 'Derby della Lanterna' },
  { id: 'udi', name: 'Udinese Calcio', shortName: 'UDI', primaryColor: '#ffffff', secondaryColor: '#000000', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 79, budget: 82000000, wageBudget: 1850000, stadiumName: 'Bluenergy Stadium', stadiumCapacity: 25144 },
  { id: 'par', name: 'Parma Calcio', shortName: 'PAR', primaryColor: '#ffde00', secondaryColor: '#003366', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 79, budget: 80000000, wageBudget: 1800000, stadiumName: 'Ennio Tardini', stadiumCapacity: 22352 },
  { id: 'cag', name: 'Cagliari Calcio', shortName: 'CAG', primaryColor: '#8b0000', secondaryColor: '#002f6c', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 78, budget: 74000000, wageBudget: 1650000, stadiumName: 'Unipol Domus', stadiumCapacity: 16416 },
  { id: 'ver', name: 'Hellas Verona', shortName: 'VER', primaryColor: '#003366', secondaryColor: '#ffd700', division: 'SERIE_A_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 78, budget: 72000000, wageBudget: 1600000, stadiumName: 'Marcantonio Bentegodi', stadiumCapacity: 31045 },

  // ============================================================================
  // 6. ITÁLIA - SERIE BKT (DIVISÃO B)
  // ============================================================================
  { id: 'pal_ita', name: 'Palermo FC', shortName: 'PAL', primaryColor: '#ffb6c1', secondaryColor: '#000000', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 76, budget: 36000000, wageBudget: 900000, stadiumName: 'Renzo Barbera', stadiumCapacity: 36365 },
  { id: 'sam', name: 'Sampdoria', shortName: 'SAM', primaryColor: '#0047ab', secondaryColor: '#ffffff', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 77, budget: 40000000, wageBudget: 980000, stadiumName: 'Luigi Ferraris', stadiumCapacity: 36599, rivalClubIds: ['gen'], derbyName: 'Derby della Lanterna' },
  { id: 'sas', name: 'US Sassuolo', shortName: 'SAS', primaryColor: '#008751', secondaryColor: '#000000', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 77, budget: 42000000, wageBudget: 1000000, stadiumName: 'Mapei Stadium', stadiumCapacity: 21525 },
  { id: 'cre', name: 'US Cremonese', shortName: 'CRE', primaryColor: '#c8102e', secondaryColor: '#a6a6a6', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 75, budget: 32000000, wageBudget: 840000, stadiumName: 'Giovanni Zini', stadiumCapacity: 16003 },
  { id: 'bar_ita', name: 'SSC Bari', shortName: 'BAR', primaryColor: '#ffffff', secondaryColor: '#e30613', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 75, budget: 33000000, wageBudget: 850000, stadiumName: 'San Nicola', stadiumCapacity: 58270 },
  { id: 'spe', name: 'Spezia Calcio', shortName: 'SPE', primaryColor: '#ffffff', secondaryColor: '#000000', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 74, budget: 30000000, wageBudget: 790000, stadiumName: 'Alberto Picco', stadiumCapacity: 11512 },
  { id: 'pis', name: 'Pisa Sporting Club', shortName: 'PIS', primaryColor: '#003366', secondaryColor: '#000000', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 74, budget: 29000000, wageBudget: 780000, stadiumName: 'Arena Garibaldi', stadiumCapacity: 14000 },
  { id: 'sal', name: 'US Salernitana', shortName: 'SAL', primaryColor: '#800000', secondaryColor: '#ffffff', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 75, budget: 34000000, wageBudget: 860000, stadiumName: 'Arechi', stadiumCapacity: 37180 },
  { id: 'bre_ita', name: 'Brescia Calcio', shortName: 'BRE', primaryColor: '#003399', secondaryColor: '#ffffff', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 74, budget: 28000000, wageBudget: 760000, stadiumName: 'Mario Rigamonti', stadiumCapacity: 19500 },
  { id: 'cat', name: 'US Catanzaro', shortName: 'CAT', primaryColor: '#e30613', secondaryColor: '#ffd700', division: 'SERIE_B_ITA', country: 'Itália', countryFlag: '🇮🇹', reputation: 73, budget: 26000000, wageBudget: 720000, stadiumName: 'Nicola Ceravolo', stadiumCapacity: 14650 },

  // ============================================================================
  // 7. ALEMANHA - BUNDESLIGA (DIVISÃO A)
  // ============================================================================
  { id: 'bay', name: 'Bayern de Munique', shortName: 'BAY', primaryColor: '#dc052d', secondaryColor: '#0066b2', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 96, budget: 430000000, wageBudget: 8200000, stadiumName: 'Allianz Arena', stadiumCapacity: 75024, rivalClubIds: ['bvb'], derbyName: 'Der Klassiker' },
  { id: 'b04', name: 'Bayer 04 Leverkusen', shortName: 'B04', primaryColor: '#e32219', secondaryColor: '#000000', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 93, budget: 310000000, wageBudget: 6400000, stadiumName: 'BayArena', stadiumCapacity: 30210, rivalClubIds: ['koe'], derbyName: 'Rheinisches Derby' },
  { id: 'bvb', name: 'Borussia Dortmund', shortName: 'BVB', primaryColor: '#fde100', secondaryColor: '#000000', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 92, budget: 290000000, wageBudget: 6100000, stadiumName: 'Signal Iduna Park', stadiumCapacity: 81365, rivalClubIds: ['bay', 's04'], derbyName: 'Revierderby' },
  { id: 'rbl', name: 'RB Leipzig', shortName: 'RBL', primaryColor: '#ffffff', secondaryColor: '#dd0742', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 89, budget: 250000000, wageBudget: 5300000, stadiumName: 'Red Bull Arena Leipzig', stadiumCapacity: 47069 },
  { id: 'vfb', name: 'VfB Stuttgart', shortName: 'VFB', primaryColor: '#ffffff', secondaryColor: '#e32219', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 87, budget: 180000000, wageBudget: 4000000, stadiumName: 'MHPArena', stadiumCapacity: 60449 },
  { id: 'sge', name: 'Eintracht Frankfurt', shortName: 'SGE', primaryColor: '#e1000f', secondaryColor: '#000000', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 85, budget: 150000000, wageBudget: 3300000, stadiumName: 'Deutsche Bank Park', stadiumCapacity: 58000 },
  { id: 'tsg', name: 'TSG Hoffenheim', shortName: 'TSG', primaryColor: '#005ca9', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 81, budget: 110000000, wageBudget: 2400000, stadiumName: 'PreZero Arena', stadiumCapacity: 30150 },
  { id: 'scf', name: 'SC Freiburg', shortName: 'SCF', primaryColor: '#000000', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 82, budget: 120000000, wageBudget: 2600000, stadiumName: 'Europa-Park Stadion', stadiumCapacity: 34700 },
  { id: 'wob', name: 'VfL Wolfsburg', shortName: 'WOB', primaryColor: '#65b32e', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 81, budget: 115000000, wageBudget: 2500000, stadiumName: 'Volkswagen Arena', stadiumCapacity: 28917 },
  { id: 'bmg', name: 'Borussia Mönchengladbach', shortName: 'BMG', primaryColor: '#000000', secondaryColor: '#169a50', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 82, budget: 125000000, wageBudget: 2700000, stadiumName: 'Borussia-Park', stadiumCapacity: 54042, rivalClubIds: ['koe'], derbyName: 'Rheinisches Derby' },
  { id: 'fcb_ber', name: '1. FC Union Berlin', shortName: 'FCU', primaryColor: '#d4001f', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 80, budget: 95000000, wageBudget: 2100000, stadiumName: 'Stadion An der Alten Försterei', stadiumCapacity: 22012, rivalClubIds: ['bsc'], derbyName: 'Berliner Derby' },
  { id: 'svw', name: 'Werder Bremen', shortName: 'SVW', primaryColor: '#1d8348', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 81, budget: 105000000, wageBudget: 2300000, stadiumName: 'Weserstadion', stadiumCapacity: 42100, rivalClubIds: ['hsv'], derbyName: 'Nordderby' },
  { id: 'fca', name: 'FC Augsburg', shortName: 'FCA', primaryColor: '#ba141a', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 79, budget: 85000000, wageBudget: 1900000, stadiumName: 'WWK Arena', stadiumCapacity: 30660 },
  { id: 'm05', name: '1. FSV Mainz 05', shortName: 'M05', primaryColor: '#c8102e', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 79, budget: 82000000, wageBudget: 1850000, stadiumName: 'Mewa Arena', stadiumCapacity: 33305 },
  { id: 'fch', name: '1. FC Heidenheim', shortName: 'FCH', primaryColor: '#e30613', secondaryColor: '#003366', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 78, budget: 75000000, wageBudget: 1700000, stadiumName: 'Voith-Arena', stadiumCapacity: 15000 },
  { id: 'stp', name: 'FC St. Pauli', shortName: 'STP', primaryColor: '#5c3826', secondaryColor: '#ffffff', division: 'BUNDESLIGA', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 78, budget: 76000000, wageBudget: 1720000, stadiumName: 'Millerntor-Stadion', stadiumCapacity: 29546, rivalClubIds: ['hsv'], derbyName: 'Hamburger Stadtderby' },

  // ============================================================================
  // 8. ALEMANHA - 2. BUNDESLIGA (DIVISÃO B)
  // ============================================================================
  { id: 'hsv', name: 'Hamburger SV', shortName: 'HSV', primaryColor: '#005ca9', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 78, budget: 55000000, wageBudget: 1300000, stadiumName: 'Volksparkstadion', stadiumCapacity: 57000, rivalClubIds: ['svw', 'stp'], derbyName: 'Nordderby' },
  { id: 's04', name: 'FC Schalke 04', shortName: 'S04', primaryColor: '#004d9d', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 78, budget: 54000000, wageBudget: 1280000, stadiumName: 'Veltins-Arena', stadiumCapacity: 62271, rivalClubIds: ['bvb'], derbyName: 'Revierderby' },
  { id: 'bsc', name: 'Hertha BSC Berlim', shortName: 'BSC', primaryColor: '#005ca9', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 77, budget: 48000000, wageBudget: 1150000, stadiumName: 'Olympiastadion Berlin', stadiumCapacity: 74475, rivalClubIds: ['fcb_ber'], derbyName: 'Berliner Derby' },
  { id: 'koe', name: '1. FC Köln', shortName: 'KOE', primaryColor: '#ed1c24', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 78, budget: 52000000, wageBudget: 1250000, stadiumName: 'RheinEnergieStadion', stadiumCapacity: 50000, rivalClubIds: ['bmg', 'b04'], derbyName: 'Rheinisches Derby' },
  { id: 'f95', name: 'Fortuna Düsseldorf', shortName: 'F95', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 76, budget: 42000000, wageBudget: 1020000, stadiumName: 'Merkur Spiel-Arena', stadiumCapacity: 54600 },
  { id: 'h96', name: 'Hannover 96', shortName: 'H96', primaryColor: '#000000', secondaryColor: '#169a50', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 75, budget: 38000000, wageBudget: 940000, stadiumName: 'Heinz von Heiden Arena', stadiumCapacity: 49000 },
  { id: 'fcn', name: '1. FC Nürnberg', shortName: 'FCN', primaryColor: '#8a1538', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 75, budget: 37000000, wageBudget: 920000, stadiumName: 'Max-Morlock-Stadion', stadiumCapacity: 50000 },
  { id: 'fck', name: '1. FC Kaiserslautern', shortName: 'FCK', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'BUNDESLIGA_2', country: 'Alemanha', countryFlag: '🇩🇪', reputation: 74, budget: 34000000, wageBudget: 860000, stadiumName: 'Fritz-Walter-Stadion', stadiumCapacity: 49850 },

  // ============================================================================
  // 9. FRANÇA - LIGUE 1 MCDONALDS (DIVISÃO A)
  // ============================================================================
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', primaryColor: '#004170', secondaryColor: '#da291c', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 95, budget: 440000000, wageBudget: 8300000, stadiumName: 'Parc des Princes', stadiumCapacity: 48583, rivalClubIds: ['om'], derbyName: 'Le Classique' },
  { id: 'asm', name: 'AS Monaco', shortName: 'ASM', primaryColor: '#e51b24', secondaryColor: '#ffffff', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 88, budget: 200000000, wageBudget: 4400000, stadiumName: 'Stade Louis-II', stadiumCapacity: 18523, rivalClubIds: ['ogc'], derbyName: 'Derby de la Côte dAzur' },
  { id: 'om', name: 'Olympique de Marseille', shortName: 'OM', primaryColor: '#2faee0', secondaryColor: '#ffffff', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 88, budget: 210000000, wageBudget: 4600000, stadiumName: 'Orange Vélodrome', stadiumCapacity: 67394, rivalClubIds: ['psg', 'ol'], derbyName: 'Le Classique' },
  { id: 'ol', name: 'Olympique Lyonnais', shortName: 'OL', primaryColor: '#ffffff', secondaryColor: '#002b66', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 86, budget: 170000000, wageBudget: 3800000, stadiumName: 'Groupama Stadium', stadiumCapacity: 59186, rivalClubIds: ['asse', 'om'], derbyName: 'Choc des Olympiques' },
  { id: 'losc', name: 'Lille OSC', shortName: 'LOSC', primaryColor: '#e01e26', secondaryColor: '#002b66', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 86, budget: 165000000, wageBudget: 3700000, stadiumName: 'Decathlon Arena Pierre-Mauroy', stadiumCapacity: 50186, rivalClubIds: ['rcl'], derbyName: 'Derby du Nord' },
  { id: 'ogc', name: 'OGC Nice', shortName: 'NIC', primaryColor: '#000000', secondaryColor: '#e30613', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 84, budget: 135000000, wageBudget: 3000000, stadiumName: 'Allianz Riviera', stadiumCapacity: 36178, rivalClubIds: ['asm'], derbyName: 'Derby de la Côte dAzur' },
  { id: 'rcl', name: 'RC Lens', shortName: 'RCL', primaryColor: '#ffe500', secondaryColor: '#cc0000', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 83, budget: 125000000, wageBudget: 2800000, stadiumName: 'Stade Bollaert-Delelis', stadiumCapacity: 38223, rivalClubIds: ['losc'], derbyName: 'Derby du Nord' },
  { id: 'ren', name: 'Stade Rennais FC', shortName: 'REN', primaryColor: '#e30613', secondaryColor: '#000000', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 83, budget: 130000000, wageBudget: 2900000, stadiumName: 'Roazhon Park', stadiumCapacity: 29778, rivalClubIds: ['fcn'], derbyName: 'Derby Breton' },
  { id: 'sbr', name: 'Stade Brestois 29', shortName: 'SBR', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 81, budget: 95000000, wageBudget: 2100000, stadiumName: 'Stade Francis-Le Blé', stadiumCapacity: 15220 },
  { id: 'sdr', name: 'Stade de Reims', shortName: 'SDR', primaryColor: '#e30613', secondaryColor: '#ffffff', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 80, budget: 88000000, wageBudget: 1950000, stadiumName: 'Stade Auguste-Delaune', stadiumCapacity: 20519 },
  { id: 'mhsc', name: 'Montpellier HSC', shortName: 'MHS', primaryColor: '#ff6600', secondaryColor: '#002f6c', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 79, budget: 82000000, wageBudget: 1850000, stadiumName: 'Stade de la Mosson', stadiumCapacity: 32900 },
  { id: 'rcs', name: 'RC Strasbourg Alsace', shortName: 'RCS', primaryColor: '#009fe3', secondaryColor: '#ffffff', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 79, budget: 85000000, wageBudget: 1900000, stadiumName: 'Stade de la Meinau', stadiumCapacity: 26109 },
  { id: 'fcn_fra', name: 'FC Nantes', shortName: 'NAN', primaryColor: '#ffe500', secondaryColor: '#00853f', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 79, budget: 80000000, wageBudget: 1800000, stadiumName: 'Stade de la Beaujoire', stadiumCapacity: 35322, rivalClubIds: ['ren'], derbyName: 'Derby Breton' },
  { id: 'tfc', name: 'Toulouse FC', shortName: 'TFC', primaryColor: '#4f2d7f', secondaryColor: '#ffffff', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 79, budget: 81000000, wageBudget: 1820000, stadiumName: 'Stadium de Toulouse', stadiumCapacity: 33150 },
  { id: 'aja', name: 'AJ Auxerre', shortName: 'AJA', primaryColor: '#ffffff', secondaryColor: '#0047ab', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 77, budget: 68000000, wageBudget: 1550000, stadiumName: 'Stade de lAbbé-Deschamps', stadiumCapacity: 18541 },
  { id: 'hac', name: 'Le Havre AC', shortName: 'HAC', primaryColor: '#87ceeb', secondaryColor: '#002060', division: 'LIGUE_1', country: 'França', countryFlag: '🇫🇷', reputation: 76, budget: 62000000, wageBudget: 1450000, stadiumName: 'Stade Océane', stadiumCapacity: 25178 },

  // ============================================================================
  // 10. FRANÇA - LIGUE 2 BKT (DIVISÃO B)
  // ============================================================================
  { id: 'fcgb', name: 'FC Girondins de Bordeaux', shortName: 'BOR', primaryColor: '#002060', secondaryColor: '#ffffff', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 76, budget: 38000000, wageBudget: 920000, stadiumName: 'Matmut Atlantique', stadiumCapacity: 42115 },
  { id: 'asse', name: 'AS Saint-Étienne', shortName: 'STE', primaryColor: '#00853f', secondaryColor: '#ffffff', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 77, budget: 42000000, wageBudget: 1000000, stadiumName: 'Stade Geoffroy-Guichard', stadiumCapacity: 41965, rivalClubIds: ['ol'], derbyName: 'Derby Rhônalpin' },
  { id: 'fcm', name: 'FC Metz', shortName: 'MET', primaryColor: '#6f192b', secondaryColor: '#ffffff', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 76, budget: 37000000, wageBudget: 900000, stadiumName: 'Stade Saint-Symphorien', stadiumCapacity: 28786 },
  { id: 'fcl', name: 'FC Lorient', shortName: 'LOR', primaryColor: '#f37021', secondaryColor: '#000000', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 75, budget: 34000000, wageBudget: 850000, stadiumName: 'Stade du Moustoir', stadiumCapacity: 18890 },
  { id: 'cf63', name: 'Clermont Foot 63', shortName: 'CLE', primaryColor: '#a6192e', secondaryColor: '#002060', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 74, budget: 30000000, wageBudget: 780000, stadiumName: 'Stade Gabriel-Montpied', stadiumCapacity: 11980 },
  { id: 'estac', name: 'ESTAC Troyes', shortName: 'TRO', primaryColor: '#0055a5', secondaryColor: '#ffffff', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 73, budget: 28000000, wageBudget: 740000, stadiumName: 'Stade de lAube', stadiumCapacity: 20400 },
  { id: 'eag', name: 'EA Guingamp', shortName: 'GUI', primaryColor: '#e30613', secondaryColor: '#000000', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 73, budget: 27000000, wageBudget: 720000, stadiumName: 'Stade de Roudourou', stadiumCapacity: 18250 },
  { id: 'sco', name: 'Angers SCO', shortName: 'ANG', primaryColor: '#000000', secondaryColor: '#ffffff', division: 'LIGUE_2', country: 'França', countryFlag: '🇫🇷', reputation: 74, budget: 31000000, wageBudget: 800000, stadiumName: 'Stade Raymond-Kopa', stadiumCapacity: 18752 },
];

/**
 * Cria todos os clubes europeus com seus respectivos elencos profissionais e juvenis
 */
export function generateEuropeanClubs(): Record<string, Club> {
  const result: Record<string, Club> = {};

  const ROSTER_POSITIONS: Position[] = [
    'GOL', 'GOL',
    'ZAG', 'ZAG', 'ZAG', 'ZAG',
    'LD', 'LE',
    'VOL', 'VOL', 'MC', 'MC', 'MEI', 'MEI',
    'PD', 'PE',
    'ATA', 'ATA'
  ];

  const YOUTH_POSITIONS: Position[] = [
    'GOL', 'LD', 'ZAG', 'ZAG', 'LE',
    'VOL', 'MC', 'MEI',
    'PD', 'ATA', 'PE'
  ];

  for (const raw of RAW_EUROPEAN_CLUBS) {
    let roster: Player[] = ROSTER_POSITIONS.map((pos, idx) =>
      generatePlayer(raw.id, idx, pos, raw.division, false)
    );

    // Injeta os craques reais atualizados e organiza o 11 titular no esquema 4-3-3
    roster = organizeRosterForFormation(injectFamousStars(raw.id, roster), '4-3-3');

    const youthRoster: Player[] = YOUTH_POSITIONS.map((pos, idx) =>
      generatePlayer(raw.id, idx, pos, raw.division, true)
    );

    const homePattern = raw.name.includes('Milan') || raw.name.includes('Juventus') || raw.name.includes('Athletic') || raw.name.includes('Atlético')
      ? 'stripes_v'
      : raw.name.includes('Monaco')
      ? 'half_and_half'
      : raw.name.includes('Barcelona')
      ? 'stripes_v'
      : 'solid';

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
      captainPlayerId: roster[2]?.id || roster[0]?.id,
      penaltyTakerPlayerId: roster[9]?.id || roster[8]?.id,
      freeKickTakerPlayerId: roster[7]?.id || roster[10]?.id,
      lineup: roster.slice(0, 11).map((p) => p.id),
      tactics: {
        formation: '4-3-3',
        philosophy: raw.reputation >= 88 ? 'attacking' : 'balanced',
      },
      customKits: {
        home: {
          primaryColor: raw.primaryColor,
          secondaryColor: raw.secondaryColor,
          pattern: homePattern as KitPattern,
          collarType: 'round',
          sponsorText: raw.country === 'Inglaterra' ? 'FLY EMIRATES' : raw.country === 'Espanha' ? 'SPOTIFY' : 'JEEP',
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
