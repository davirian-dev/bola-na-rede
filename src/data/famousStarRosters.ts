// ==============================================================================
// BOLA NA REDE: CARREIRA - ELENCOS DOS ASTROS MUNDIAIS (src/data/famousStarRosters.ts)
// Messi, Cristiano Ronaldo, Neymar Jr e os maiores craques dos clubes famosos
// ==============================================================================

import { Player, Position, PlayerAttributes } from '@/types/game';
import { calculateOverall, calculateMarketValue, calculateWeeklyWage } from '@/lib/calculations';

export interface FamousStarDef {
  name: string;
  nickname: string;
  age: number;
  position: Position;
  overall: number;
  potential: number;
  signatureTraits?: string[];
  attrs: {
    pace: number;
    dribbling: number;
    tackling: number;
    defending: number;
    attacking: number;
    finishing: number;
    passing: number;
    positioning: number;
    heading: number;
    crossing: number;
    shooting: number;
    jumping: number;
    playmaker: number;
    elasticity: number;
  };
}

// Mapa de craques reais por ID de clube
export const FAMOUS_STAR_ROSTERS: Record<string, FamousStarDef[]> = {
  // ============================================================================
  // MLS - LIGA DO MESSI
  // ============================================================================
  mia: [
    {
      name: 'Lionel Messi',
      nickname: 'Messi 🔟🐐',
      age: 38,
      position: 'PD',
      overall: 88,
      potential: 88,
      signatureTraits: ['trait_supernatural_vision'],
      attrs: { pace: 78, dribbling: 94, tackling: 35, defending: 34, attacking: 94, finishing: 91, passing: 93, positioning: 94, heading: 68, crossing: 89, shooting: 88, jumping: 67, playmaker: 96, elasticity: 45 },
    },
    {
      name: 'Luis Suárez',
      nickname: 'Suárez 🔫',
      age: 38,
      position: 'ATA',
      overall: 82,
      potential: 82,
      attrs: { pace: 68, dribbling: 79, tackling: 42, defending: 44, attacking: 88, finishing: 88, passing: 79, positioning: 91, heading: 82, crossing: 71, shooting: 86, jumping: 74, playmaker: 82, elasticity: 40 },
    },
    {
      name: 'Federico Redondo',
      nickname: 'F. Redondo 🇦🇷',
      age: 22,
      position: 'VOL',
      overall: 78,
      potential: 87,
      attrs: { pace: 72, dribbling: 77, tackling: 79, defending: 78, attacking: 72, finishing: 64, passing: 81, positioning: 79, heading: 74, crossing: 68, shooting: 70, jumping: 76, playmaker: 80, elasticity: 50 },
    },
    {
      name: 'Julian Gressel',
      nickname: 'Gressel 🇺🇸',
      age: 31,
      position: 'MC',
      overall: 76,
      potential: 76,
      attrs: { pace: 74, dribbling: 74, tackling: 68, defending: 66, attacking: 74, finishing: 72, passing: 78, positioning: 76, heading: 68, crossing: 82, shooting: 75, jumping: 70, playmaker: 77, elasticity: 45 },
    },
    {
      name: 'Robert Taylor',
      nickname: 'Taylor ⚡',
      age: 30,
      position: 'PE',
      overall: 76,
      potential: 76,
      attrs: { pace: 80, dribbling: 78, tackling: 50, defending: 48, attacking: 76, finishing: 74, passing: 75, positioning: 76, heading: 62, crossing: 76, shooting: 76, jumping: 70, playmaker: 75, elasticity: 46 },
    },
    {
      name: 'Diego Gómez',
      nickname: 'D. Gómez',
      age: 21,
      position: 'MC',
      overall: 76,
      potential: 85,
      attrs: { pace: 77, dribbling: 76, tackling: 72, defending: 70, attacking: 75, finishing: 74, passing: 76, positioning: 76, heading: 70, crossing: 72, shooting: 75, jumping: 74, playmaker: 77, elasticity: 45 },
    },
    {
      name: 'Drake Callender',
      nickname: 'Callender 🧤',
      age: 27,
      position: 'GOL',
      overall: 75,
      potential: 78,
      attrs: { pace: 48, dribbling: 30, tackling: 25, defending: 75, attacking: 20, finishing: 15, passing: 65, positioning: 76, heading: 35, crossing: 20, shooting: 30, jumping: 76, playmaker: 40, elasticity: 77 },
    },
    {
      name: 'Leonardo Campana',
      nickname: 'Campana',
      age: 24,
      position: 'ATA',
      overall: 75,
      potential: 81,
      attrs: { pace: 75, dribbling: 74, tackling: 35, defending: 38, attacking: 77, finishing: 78, passing: 68, positioning: 78, heading: 81, crossing: 60, shooting: 77, jumping: 80, playmaker: 69, elasticity: 42 },
    },
  ],

  // LA GALAXY (MLS)
  lag: [
    {
      name: 'Marco Reus',
      nickname: 'Reus 👑',
      age: 35,
      position: 'MEI',
      overall: 82,
      potential: 82,
      attrs: { pace: 74, dribbling: 84, tackling: 46, defending: 45, attacking: 84, finishing: 83, passing: 85, positioning: 85, heading: 68, crossing: 84, shooting: 84, jumping: 69, playmaker: 87, elasticity: 45 },
    },
    {
      name: 'Riqui Puig',
      nickname: 'Puig 🇪🇸',
      age: 25,
      position: 'MC',
      overall: 81,
      potential: 85,
      attrs: { pace: 76, dribbling: 86, tackling: 62, defending: 60, attacking: 80, finishing: 74, passing: 85, positioning: 80, heading: 56, crossing: 79, shooting: 75, jumping: 64, playmaker: 88, elasticity: 45 },
    },
    {
      name: 'Gabriel Pec',
      nickname: 'Pec 🇧🇷⚡',
      age: 24,
      position: 'PD',
      overall: 79,
      potential: 85,
      attrs: { pace: 87, dribbling: 82, tackling: 48, defending: 45, attacking: 81, finishing: 78, passing: 76, positioning: 80, heading: 68, crossing: 77, shooting: 79, jumping: 72, playmaker: 78, elasticity: 45 },
    },
    {
      name: 'Joseph Paintsil',
      nickname: 'Paintsil ⚡',
      age: 27,
      position: 'PE',
      overall: 78,
      potential: 80,
      attrs: { pace: 89, dribbling: 80, tackling: 44, defending: 42, attacking: 78, finishing: 77, passing: 73, positioning: 79, heading: 64, crossing: 74, shooting: 76, jumping: 70, playmaker: 74, elasticity: 42 },
    },
    {
      name: 'Dejan Joveljic',
      nickname: 'Joveljic 🇷🇸',
      age: 26,
      position: 'ATA',
      overall: 77,
      potential: 81,
      attrs: { pace: 77, dribbling: 75, tackling: 38, defending: 36, attacking: 80, finishing: 81, passing: 68, positioning: 82, heading: 78, crossing: 62, shooting: 79, jumping: 76, playmaker: 70, elasticity: 40 },
    },
    {
      name: 'Maya Yoshida',
      nickname: 'Yoshida 🇯🇵',
      age: 36,
      position: 'ZAG',
      overall: 75,
      potential: 75,
      attrs: { pace: 56, dribbling: 60, tackling: 77, defending: 78, attacking: 45, finishing: 40, passing: 68, positioning: 78, heading: 80, crossing: 52, shooting: 48, jumping: 76, playmaker: 62, elasticity: 50 },
    },
    {
      name: 'Gaston Brugman',
      nickname: 'Brugman 🇺🇾',
      age: 32,
      position: 'VOL',
      overall: 75,
      potential: 75,
      attrs: { pace: 68, dribbling: 74, tackling: 76, defending: 75, attacking: 68, finishing: 64, passing: 78, positioning: 76, heading: 68, crossing: 70, shooting: 71, jumping: 70, playmaker: 77, elasticity: 48 },
    },
    {
      name: 'John McCarthy',
      nickname: 'McCarthy 🧤',
      age: 32,
      position: 'GOL',
      overall: 74,
      potential: 74,
      attrs: { pace: 46, dribbling: 30, tackling: 25, defending: 74, attacking: 20, finishing: 15, passing: 64, positioning: 75, heading: 35, crossing: 20, shooting: 30, jumping: 75, playmaker: 35, elasticity: 76 },
    },
  ],

  // LOS ANGELES FC (MLS)
  lafc: [
    {
      name: 'Olivier Giroud',
      nickname: 'Giroud 🇫🇷🎯',
      age: 38,
      position: 'ATA',
      overall: 81,
      potential: 81,
      attrs: { pace: 58, dribbling: 74, tackling: 38, defending: 42, attacking: 85, finishing: 86, passing: 76, positioning: 89, heading: 91, crossing: 66, shooting: 85, jumping: 82, playmaker: 77, elasticity: 42 },
    },
    {
      name: 'Denis Bouanga',
      nickname: 'Bouanga 🇬🇦⚡',
      age: 30,
      position: 'PE',
      overall: 80,
      potential: 80,
      attrs: { pace: 88, dribbling: 82, tackling: 46, defending: 44, attacking: 82, finishing: 81, passing: 75, positioning: 82, heading: 71, crossing: 78, shooting: 81, jumping: 77, playmaker: 77, elasticity: 45 },
    },
    {
      name: 'Hugo Lloris',
      nickname: 'Lloris 🧤🇫🇷',
      age: 38,
      position: 'GOL',
      overall: 81,
      potential: 81,
      attrs: { pace: 55, dribbling: 35, tackling: 25, defending: 81, attacking: 20, finishing: 15, passing: 68, positioning: 83, heading: 35, crossing: 20, shooting: 30, jumping: 80, playmaker: 42, elasticity: 83 },
    },
    {
      name: 'Eduard Atuesta',
      nickname: 'Atuesta 🇨🇴',
      age: 27,
      position: 'VOL',
      overall: 76,
      potential: 79,
      attrs: { pace: 71, dribbling: 75, tackling: 77, defending: 76, attacking: 70, finishing: 64, passing: 79, positioning: 77, heading: 68, crossing: 72, shooting: 69, jumping: 72, playmaker: 78, elasticity: 48 },
    },
  ],

  // ============================================================================
  // SAUDI PRO LEAGUE - LIGA DO CRISTIANO RONALDO E NEYMAR
  // ============================================================================
  aln: [
    {
      name: 'Cristiano Ronaldo',
      nickname: 'CR7 🐐⚡',
      age: 39,
      position: 'ATA',
      overall: 87,
      potential: 87,
      signatureTraits: ['trait_relentless_finisher'],
      attrs: { pace: 80, dribbling: 81, tackling: 34, defending: 35, attacking: 94, finishing: 93, passing: 78, positioning: 94, heading: 92, crossing: 75, shooting: 93, jumping: 95, playmaker: 82, elasticity: 55 },
    },
    {
      name: 'Sadio Mané',
      nickname: 'Mané ⚡',
      age: 32,
      position: 'PE',
      overall: 84,
      potential: 84,
      attrs: { pace: 87, dribbling: 86, tackling: 44, defending: 44, attacking: 86, finishing: 83, passing: 80, positioning: 85, heading: 74, crossing: 78, shooting: 83, jumping: 82, playmaker: 81, elasticity: 48 },
    },
    {
      name: 'Marcelo Brozovic',
      nickname: 'Brozovic 🫁',
      age: 32,
      position: 'VOL',
      overall: 83,
      potential: 83,
      attrs: { pace: 67, dribbling: 79, tackling: 81, defending: 81, attacking: 77, finishing: 71, passing: 86, positioning: 84, heading: 68, crossing: 75, shooting: 76, jumping: 72, playmaker: 87, elasticity: 50 },
    },
    {
      name: 'Mohamed Simakan',
      nickname: 'Simakan 🛡️⚡',
      age: 24,
      position: 'ZAG',
      overall: 82,
      potential: 86,
      attrs: { pace: 80, dribbling: 72, tackling: 83, defending: 83, attacking: 56, finishing: 42, passing: 72, positioning: 81, heading: 82, crossing: 66, shooting: 54, jumping: 84, playmaker: 70, elasticity: 52 },
    },
    {
      name: 'Otávio',
      nickname: 'Otávio 🎯',
      age: 29,
      position: 'MEI',
      overall: 82,
      potential: 82,
      attrs: { pace: 78, dribbling: 84, tackling: 71, defending: 70, attacking: 81, finishing: 74, passing: 83, positioning: 81, heading: 65, crossing: 80, shooting: 77, jumping: 72, playmaker: 84, elasticity: 50 },
    },
    {
      name: 'Anderson Talisca',
      nickname: 'Talisca 🚀',
      age: 30,
      position: 'ATA',
      overall: 81,
      potential: 81,
      attrs: { pace: 80, dribbling: 83, tackling: 48, defending: 46, attacking: 83, finishing: 84, passing: 79, positioning: 83, heading: 78, crossing: 77, shooting: 88, jumping: 77, playmaker: 82, elasticity: 50 },
    },
    {
      name: 'Bento Krepski',
      nickname: 'Bento 🧤',
      age: 25,
      position: 'GOL',
      overall: 80,
      potential: 87,
      attrs: { pace: 52, dribbling: 35, tackling: 26, defending: 80, attacking: 20, finishing: 15, passing: 72, positioning: 80, heading: 40, crossing: 20, shooting: 30, jumping: 82, playmaker: 45, elasticity: 83 },
    },
    {
      name: 'Ângelo Gabriel',
      nickname: 'Ângelo ⚡',
      age: 19,
      position: 'PD',
      overall: 77,
      potential: 87,
      attrs: { pace: 88, dribbling: 84, tackling: 38, defending: 38, attacking: 78, finishing: 73, passing: 75, positioning: 76, heading: 60, crossing: 77, shooting: 72, jumping: 70, playmaker: 77, elasticity: 45 },
    },
  ],

  hil: [
    {
      name: 'Marcos Leonardo Santos Almeida',
      nickname: 'Marcos Leonardo 🎯🇸🇦',
      age: 21,
      position: 'ATA',
      overall: 80,
      potential: 87,
      attrs: { pace: 82, dribbling: 80, tackling: 35, defending: 34, attacking: 83, finishing: 83, passing: 72, positioning: 84, heading: 78, crossing: 68, shooting: 82, jumping: 78, playmaker: 75, elasticity: 44 },
    },
    {
      name: 'Salem Al-Dawsari',
      nickname: 'Al-Dawsari 🌪️🇸🇦',
      age: 33,
      position: 'PE',
      overall: 82,
      potential: 82,
      attrs: { pace: 83, dribbling: 84, tackling: 46, defending: 44, attacking: 82, finishing: 80, passing: 81, positioning: 82, heading: 64, crossing: 80, shooting: 81, jumping: 72, playmaker: 82, elasticity: 46 },
    },
    {
      name: 'Sergej Milinkovic-Savic',
      nickname: 'Milinkovic-Savic 🦁',
      age: 29,
      position: 'MC',
      overall: 85,
      potential: 85,
      attrs: { pace: 68, dribbling: 82, tackling: 79, defending: 80, attacking: 84, finishing: 81, passing: 84, positioning: 85, heading: 86, crossing: 78, shooting: 84, jumping: 84, playmaker: 85, elasticity: 50 },
    },
    {
      name: 'Rúben Neves',
      nickname: 'Rúben Neves 🚀',
      age: 27,
      position: 'VOL',
      overall: 84,
      potential: 86,
      attrs: { pace: 65, dribbling: 78, tackling: 81, defending: 80, attacking: 78, finishing: 74, passing: 89, positioning: 83, heading: 71, crossing: 84, shooting: 87, jumping: 73, playmaker: 88, elasticity: 50 },
    },
    {
      name: 'Renan Lodi',
      nickname: 'Renan Lodi ⚡🇧🇷',
      age: 26,
      position: 'LE',
      overall: 81,
      potential: 83,
      attrs: { pace: 84, dribbling: 81, tackling: 77, defending: 76, attacking: 80, finishing: 66, passing: 79, positioning: 78, heading: 68, crossing: 83, shooting: 70, jumping: 74, playmaker: 77, elasticity: 50 },
    },
    {
      name: 'Malcom Silva',
      nickname: 'Malcom 🇧🇷',
      age: 27,
      position: 'PD',
      overall: 82,
      potential: 83,
      attrs: { pace: 85, dribbling: 84, tackling: 42, defending: 40, attacking: 82, finishing: 80, passing: 80, positioning: 82, heading: 64, crossing: 81, shooting: 82, jumping: 72, playmaker: 81, elasticity: 48 },
    },
    {
      name: 'Kalidou Koulibaly',
      nickname: 'Koulibaly 🧱',
      age: 33,
      position: 'ZAG',
      overall: 83,
      potential: 83,
      attrs: { pace: 69, dribbling: 66, tackling: 86, defending: 85, attacking: 50, finishing: 40, passing: 71, positioning: 86, heading: 84, crossing: 52, shooting: 54, jumping: 84, playmaker: 65, elasticity: 55 },
    },
    {
      name: 'Yassine Bounou',
      nickname: 'Bono 🧤🇲🇦',
      age: 33,
      position: 'GOL',
      overall: 85,
      potential: 85,
      attrs: { pace: 50, dribbling: 35, tackling: 25, defending: 84, attacking: 20, finishing: 15, passing: 74, positioning: 85, heading: 40, crossing: 20, shooting: 30, jumping: 85, playmaker: 45, elasticity: 87 },
    },
    {
      name: 'Marcos Leonardo',
      nickname: 'M. Leonardo 🎯',
      age: 21,
      position: 'ATA',
      overall: 79,
      potential: 87,
      attrs: { pace: 82, dribbling: 78, tackling: 38, defending: 38, attacking: 82, finishing: 83, passing: 71, positioning: 83, heading: 77, crossing: 65, shooting: 81, jumping: 78, playmaker: 72, elasticity: 44 },
    },
  ],

  itt: [
    {
      name: 'Karim Benzema',
      nickname: 'Benzema 👑',
      age: 36,
      position: 'ATA',
      overall: 86,
      potential: 86,
      attrs: { pace: 74, dribbling: 84, tackling: 38, defending: 39, attacking: 89, finishing: 88, passing: 82, positioning: 91, heading: 84, crossing: 75, shooting: 86, jumping: 77, playmaker: 85, elasticity: 45 },
    },
    {
      name: 'N\'Golo Kanté',
      nickname: 'Kanté 🫁🏆',
      age: 33,
      position: 'VOL',
      overall: 85,
      potential: 85,
      attrs: { pace: 75, dribbling: 80, tackling: 88, defending: 86, attacking: 74, finishing: 66, passing: 80, positioning: 88, heading: 68, crossing: 70, shooting: 68, jumping: 77, playmaker: 80, elasticity: 55 },
    },
    {
      name: 'Moussa Diaby',
      nickname: 'M. Diaby ⚡',
      age: 25,
      position: 'PD',
      overall: 83,
      potential: 86,
      attrs: { pace: 93, dribbling: 86, tackling: 42, defending: 40, attacking: 83, finishing: 78, passing: 78, positioning: 82, heading: 58, crossing: 80, shooting: 78, jumping: 71, playmaker: 80, elasticity: 45 },
    },
    {
      name: 'Fabinho Tavares',
      nickname: 'Fabinho 🇧🇷',
      age: 31,
      position: 'VOL',
      overall: 82,
      potential: 82,
      attrs: { pace: 58, dribbling: 75, tackling: 84, defending: 84, attacking: 70, finishing: 64, passing: 80, positioning: 84, heading: 76, crossing: 68, shooting: 70, jumping: 76, playmaker: 79, elasticity: 52 },
    },
    {
      name: 'Houssem Aouar',
      nickname: 'Aouar',
      age: 26,
      position: 'MC',
      overall: 80,
      potential: 82,
      attrs: { pace: 75, dribbling: 82, tackling: 64, defending: 62, attacking: 79, finishing: 75, passing: 81, positioning: 79, heading: 62, crossing: 76, shooting: 77, jumping: 68, playmaker: 82, elasticity: 46 },
    },
  ],

  ahl: [
    {
      name: 'Riyad Mahrez',
      nickname: 'Mahrez 🪄',
      age: 33,
      position: 'PD',
      overall: 84,
      potential: 84,
      attrs: { pace: 78, dribbling: 89, tackling: 38, defending: 36, attacking: 85, finishing: 81, passing: 84, positioning: 83, heading: 55, crossing: 87, shooting: 82, jumping: 66, playmaker: 87, elasticity: 45 },
    },
    {
      name: 'Ivan Toney',
      nickname: 'Ivan Toney 🎯',
      age: 28,
      position: 'ATA',
      overall: 83,
      potential: 84,
      attrs: { pace: 80, dribbling: 80, tackling: 44, defending: 45, attacking: 85, finishing: 86, passing: 75, positioning: 86, heading: 83, crossing: 68, shooting: 85, jumping: 82, playmaker: 76, elasticity: 45 },
    },
    {
      name: 'Franck Kessié',
      nickname: 'Kessié 🚜',
      age: 27,
      position: 'VOL',
      overall: 82,
      potential: 83,
      attrs: { pace: 73, dribbling: 78, tackling: 82, defending: 81, attacking: 79, finishing: 76, passing: 79, positioning: 82, heading: 78, crossing: 70, shooting: 81, jumping: 80, playmaker: 79, elasticity: 52 },
    },
    {
      name: 'Gabri Veiga',
      nickname: 'Gabri Veiga 💎🇪🇸',
      age: 22,
      position: 'MEI',
      overall: 80,
      potential: 87,
      attrs: { pace: 78, dribbling: 82, tackling: 62, defending: 60, attacking: 80, finishing: 78, passing: 81, positioning: 80, heading: 68, crossing: 76, shooting: 82, jumping: 74, playmaker: 82, elasticity: 48 },
    },
    {
      name: 'Édouard Mendy',
      nickname: 'Mendy 🧤',
      age: 32,
      position: 'GOL',
      overall: 81,
      potential: 81,
      attrs: { pace: 45, dribbling: 25, tackling: 20, defending: 80, attacking: 18, finishing: 14, passing: 68, positioning: 82, heading: 35, crossing: 20, shooting: 25, jumping: 82, playmaker: 38, elasticity: 83 },
    },
  ],

  // ============================================================================
  // GIGANTES DA EUROPA - CRAQUES GLOBAIS ATUALIZADOS
  // ============================================================================
  rma: [
    {
      name: 'Kylian Mbappé',
      nickname: 'Mbappé 🐢⚡',
      age: 25,
      position: 'ATA',
      overall: 91,
      potential: 94,
      signatureTraits: ['trait_supersonic_speed'],
      attrs: { pace: 97, dribbling: 92, tackling: 38, defending: 36, attacking: 94, finishing: 93, passing: 82, positioning: 93, heading: 76, crossing: 80, shooting: 90, jumping: 86, playmaker: 84, elasticity: 55 },
    },
    {
      name: 'Vinicius Junior',
      nickname: 'Vini Jr ⚡🇧🇷',
      age: 24,
      position: 'PE',
      overall: 90,
      potential: 94,
      signatureTraits: ['trait_pure_explosion'],
      attrs: { pace: 95, dribbling: 93, tackling: 32, defending: 30, attacking: 92, finishing: 86, passing: 81, positioning: 90, heading: 62, crossing: 82, shooting: 84, jumping: 76, playmaker: 85, elasticity: 50 },
    },
    {
      name: 'Jude Bellingham',
      nickname: 'Bellingham 🌟',
      age: 21,
      position: 'MEI',
      overall: 90,
      potential: 95,
      attrs: { pace: 80, dribbling: 88, tackling: 80, defending: 79, attacking: 89, finishing: 86, passing: 86, positioning: 89, heading: 82, crossing: 80, shooting: 85, jumping: 84, playmaker: 88, elasticity: 55 },
    },
    {
      name: 'Rodrygo Goes',
      nickname: 'Rodrygo 🇧🇷',
      age: 23,
      position: 'PD',
      overall: 86,
      potential: 91,
      attrs: { pace: 88, dribbling: 88, tackling: 35, defending: 34, attacking: 87, finishing: 84, passing: 81, positioning: 86, heading: 71, crossing: 81, shooting: 83, jumping: 75, playmaker: 83, elasticity: 48 },
    },
    {
      name: 'Federico Valverde',
      nickname: 'Valverde 🦅',
      age: 26,
      position: 'MC',
      overall: 88,
      potential: 91,
      attrs: { pace: 89, dribbling: 83, tackling: 81, defending: 81, attacking: 86, finishing: 82, passing: 84, positioning: 85, heading: 74, crossing: 81, shooting: 89, jumping: 82, playmaker: 84, elasticity: 52 },
    },
    {
      name: 'Thibaut Courtois',
      nickname: 'Courtois 🧤🦒',
      age: 32,
      position: 'GOL',
      overall: 89,
      potential: 89,
      attrs: { pace: 46, dribbling: 30, tackling: 22, defending: 88, attacking: 20, finishing: 15, passing: 73, positioning: 90, heading: 40, crossing: 20, shooting: 25, jumping: 88, playmaker: 42, elasticity: 90 },
    },
    {
      name: 'Endrick Felipe',
      nickname: 'Endrick 🇧🇷💎',
      age: 18,
      position: 'ATA',
      overall: 79,
      potential: 93,
      attrs: { pace: 88, dribbling: 82, tackling: 36, defending: 35, attacking: 82, finishing: 83, passing: 72, positioning: 80, heading: 77, crossing: 66, shooting: 84, jumping: 84, playmaker: 74, elasticity: 50 },
    },
  ],

  mci: [
    {
      name: 'Erling Haaland',
      nickname: 'Haaland 🤖⚽',
      age: 24,
      position: 'ATA',
      overall: 91,
      potential: 94,
      signatureTraits: ['trait_box_hunter'],
      attrs: { pace: 89, dribbling: 80, tackling: 44, defending: 45, attacking: 94, finishing: 96, passing: 70, positioning: 96, heading: 86, crossing: 60, shooting: 94, jumping: 88, playmaker: 75, elasticity: 48 },
    },
    {
      name: 'Kevin De Bruyne',
      nickname: 'De Bruyne 👑🪄',
      age: 33,
      position: 'MEI',
      overall: 90,
      potential: 90,
      signatureTraits: ['trait_absolute_maestro'],
      attrs: { pace: 72, dribbling: 86, tackling: 65, defending: 65, attacking: 88, finishing: 85, passing: 94, positioning: 88, heading: 60, crossing: 94, shooting: 88, jumping: 68, playmaker: 95, elasticity: 50 },
    },
    {
      name: 'Rodri Cascante',
      nickname: 'Rodri 🏆🟡',
      age: 28,
      position: 'VOL',
      overall: 91,
      potential: 91,
      attrs: { pace: 66, dribbling: 82, tackling: 89, defending: 88, attacking: 82, finishing: 78, passing: 88, positioning: 89, heading: 83, crossing: 75, shooting: 85, jumping: 82, playmaker: 89, elasticity: 55 },
    },
    {
      name: 'Phil Foden',
      nickname: 'Foden ⚡',
      age: 24,
      position: 'MEI',
      overall: 88,
      potential: 92,
      attrs: { pace: 86, dribbling: 90, tackling: 56, defending: 55, attacking: 89, finishing: 86, passing: 87, positioning: 88, heading: 58, crossing: 84, shooting: 86, jumping: 68, playmaker: 89, elasticity: 48 },
    },
    {
      name: 'Ederson Moraes',
      nickname: 'Ederson 🧤🇧🇷',
      age: 31,
      position: 'GOL',
      overall: 88,
      potential: 88,
      attrs: { pace: 64, dribbling: 45, tackling: 30, defending: 86, attacking: 30, finishing: 20, passing: 88, positioning: 87, heading: 40, crossing: 30, shooting: 40, jumping: 86, playmaker: 65, elasticity: 87 },
    },
  ],

  bar: [
    {
      name: 'Lamine Yamal',
      nickname: 'Lamine Yamal 💎🇪🇸',
      age: 17,
      position: 'PD',
      overall: 85,
      potential: 95,
      attrs: { pace: 88, dribbling: 90, tackling: 35, defending: 34, attacking: 87, finishing: 80, passing: 84, positioning: 85, heading: 55, crossing: 85, shooting: 81, jumping: 68, playmaker: 86, elasticity: 48 },
    },
    {
      name: 'Robert Lewandowski',
      nickname: 'Lewandowski ⚽',
      age: 36,
      position: 'ATA',
      overall: 88,
      potential: 88,
      attrs: { pace: 74, dribbling: 83, tackling: 42, defending: 44, attacking: 91, finishing: 91, passing: 79, positioning: 93, heading: 85, crossing: 71, shooting: 89, jumping: 80, playmaker: 80, elasticity: 45 },
    },
    {
      name: 'Raphinha Belloli',
      nickname: 'Raphinha 🇧🇷🔥',
      age: 27,
      position: 'PE',
      overall: 86,
      potential: 87,
      attrs: { pace: 89, dribbling: 86, tackling: 52, defending: 50, attacking: 87, finishing: 84, passing: 83, positioning: 86, heading: 68, crossing: 84, shooting: 85, jumping: 75, playmaker: 84, elasticity: 48 },
    },
    {
      name: 'Dani Olmo',
      nickname: 'Dani Olmo 🎯',
      age: 26,
      position: 'MEI',
      overall: 85,
      potential: 87,
      attrs: { pace: 78, dribbling: 87, tackling: 50, defending: 48, attacking: 85, finishing: 81, passing: 85, positioning: 85, heading: 64, crossing: 82, shooting: 82, jumping: 70, playmaker: 87, elasticity: 46 },
    },
    {
      name: 'Pedro González (Pedri)',
      nickname: 'Pedri 🪄',
      age: 21,
      position: 'MC',
      overall: 86,
      potential: 92,
      attrs: { pace: 78, dribbling: 88, tackling: 68, defending: 66, attacking: 83, finishing: 74, passing: 89, positioning: 85, heading: 58, crossing: 82, shooting: 75, jumping: 68, playmaker: 90, elasticity: 48 },
    },
    {
      name: 'João Cancelo',
      nickname: 'Cancelo 🪄🔵🔴',
      age: 31,
      position: 'LD',
      overall: 84,
      potential: 84,
      attrs: { pace: 83, dribbling: 86, tackling: 79, defending: 78, attacking: 84, finishing: 72, passing: 85, positioning: 82, heading: 68, crossing: 87, shooting: 75, jumping: 74, playmaker: 85, elasticity: 48 },
    },
  ],

  ath: [
    {
      name: 'Aymeric Laporte',
      nickname: 'Laporte 🛡️🇪🇸',
      age: 31,
      position: 'ZAG',
      overall: 83,
      potential: 83,
      attrs: { pace: 68, dribbling: 68, tackling: 85, defending: 86, attacking: 55, finishing: 45, passing: 79, positioning: 86, heading: 85, crossing: 58, shooting: 56, jumping: 82, playmaker: 75, elasticity: 50 },
    },
    {
      name: 'Nico Williams',
      nickname: 'Nico Williams ⚡🇪🇸',
      age: 22,
      position: 'PE',
      overall: 85,
      potential: 90,
      attrs: { pace: 93, dribbling: 88, tackling: 40, defending: 38, attacking: 86, finishing: 81, passing: 81, positioning: 84, heading: 64, crossing: 84, shooting: 82, jumping: 74, playmaker: 83, elasticity: 48 },
    },
    {
      name: 'Iñaki Williams',
      nickname: 'Iñaki Williams 🦁',
      age: 30,
      position: 'ATA',
      overall: 82,
      potential: 82,
      attrs: { pace: 89, dribbling: 81, tackling: 44, defending: 42, attacking: 83, finishing: 81, passing: 76, positioning: 83, heading: 80, crossing: 75, shooting: 81, jumping: 83, playmaker: 76, elasticity: 48 },
    },
    {
      name: 'Unai Simón',
      nickname: 'Unai Simón 🧤🇪🇸',
      age: 27,
      position: 'GOL',
      overall: 83,
      potential: 85,
      attrs: { pace: 60, dribbling: 45, tackling: 38, defending: 85, attacking: 35, finishing: 25, passing: 75, positioning: 85, heading: 45, crossing: 35, shooting: 25, jumping: 84, playmaker: 60, elasticity: 85 },
    },
  ],

  // ============================================================================
  // GIGANTES DO BRASILEIRÃO - CRAQUES ATUALIZADOS
  // ============================================================================
  fla: [
    {
      name: 'Pedro Guilherme',
      nickname: 'Pedro 🪓',
      age: 27,
      position: 'ATA',
      overall: 82,
      potential: 83,
      attrs: { pace: 74, dribbling: 80, tackling: 38, defending: 40, attacking: 85, finishing: 86, passing: 76, positioning: 87, heading: 85, crossing: 65, shooting: 84, jumping: 80, playmaker: 78, elasticity: 42 },
    },
    {
      name: 'Giorgian de Arrascaeta',
      nickname: 'Arrascaeta 🪄🇺🇾',
      age: 30,
      position: 'MEI',
      overall: 82,
      potential: 82,
      attrs: { pace: 75, dribbling: 85, tackling: 46, defending: 45, attacking: 84, finishing: 80, passing: 87, positioning: 83, heading: 65, crossing: 86, shooting: 82, jumping: 70, playmaker: 88, elasticity: 48 },
    },
    {
      name: 'Gerson Santos',
      nickname: 'Gerson 🃏',
      age: 27,
      position: 'MC',
      overall: 81,
      potential: 82,
      attrs: { pace: 78, dribbling: 83, tackling: 75, defending: 74, attacking: 81, finishing: 76, passing: 83, positioning: 81, heading: 72, crossing: 78, shooting: 80, jumping: 76, playmaker: 83, elasticity: 50 },
    },
    {
      name: 'Nicolás de la Cruz',
      nickname: 'De la Cruz 🇺🇾⚡',
      age: 27,
      position: 'MC',
      overall: 81,
      potential: 82,
      attrs: { pace: 82, dribbling: 82, tackling: 72, defending: 70, attacking: 80, finishing: 78, passing: 82, positioning: 80, heading: 64, crossing: 80, shooting: 81, jumping: 74, playmaker: 82, elasticity: 48 },
    },
    {
      name: 'Michael Richard Delgado de Oliveira',
      nickname: 'Michael ⚡🔴⚫',
      age: 28,
      position: 'PE',
      overall: 80,
      potential: 80,
      attrs: { pace: 87, dribbling: 84, tackling: 38, defending: 36, attacking: 80, finishing: 78, passing: 74, positioning: 80, heading: 60, crossing: 76, shooting: 78, jumping: 72, playmaker: 76, elasticity: 45 },
    },
  ],

  pal: [
    {
      name: 'Estêvão Willian',
      nickname: 'Estêvão 💎⚡',
      age: 17,
      position: 'PD',
      overall: 80,
      potential: 94,
      attrs: { pace: 88, dribbling: 87, tackling: 34, defending: 32, attacking: 82, finishing: 79, passing: 78, positioning: 81, heading: 58, crossing: 79, shooting: 80, jumping: 70, playmaker: 82, elasticity: 48 },
    },
    {
      name: 'Paulinho',
      nickname: 'Paulinho 🏹🟢',
      age: 25,
      position: 'ATA',
      overall: 81,
      potential: 86,
      attrs: { pace: 84, dribbling: 82, tackling: 42, defending: 40, attacking: 83, finishing: 83, passing: 77, positioning: 84, heading: 75, crossing: 76, shooting: 82, jumping: 79, playmaker: 78, elasticity: 46 },
    },
    {
      name: 'Raphael Veiga',
      nickname: 'Veiga 🎯🟢',
      age: 29,
      position: 'MEI',
      overall: 81,
      potential: 81,
      attrs: { pace: 76, dribbling: 81, tackling: 55, defending: 54, attacking: 83, finishing: 82, passing: 82, positioning: 83, heading: 70, crossing: 82, shooting: 86, jumping: 72, playmaker: 84, elasticity: 46 },
    },
    {
      name: 'Felipe Anderson',
      nickname: 'F. Anderson ⚡',
      age: 31,
      position: 'PD',
      overall: 80,
      potential: 80,
      attrs: { pace: 82, dribbling: 83, tackling: 50, defending: 48, attacking: 80, finishing: 76, passing: 80, positioning: 80, heading: 64, crossing: 81, shooting: 78, jumping: 70, playmaker: 81, elasticity: 45 },
    },
    {
      name: 'Gustavo Gómez',
      nickname: 'Gómez 🛡️🇵🇾',
      age: 31,
      position: 'ZAG',
      overall: 81,
      potential: 81,
      attrs: { pace: 68, dribbling: 62, tackling: 84, defending: 84, attacking: 52, finishing: 45, passing: 68, positioning: 84, heading: 86, crossing: 52, shooting: 58, jumping: 84, playmaker: 66, elasticity: 52 },
    },
  ],

  bot: [
    {
      name: 'Luiz Henrique',
      nickname: 'Luiz Henrique 🌪️',
      age: 23,
      position: 'PD',
      overall: 82,
      potential: 88,
      attrs: { pace: 88, dribbling: 86, tackling: 44, defending: 42, attacking: 83, finishing: 81, passing: 79, positioning: 82, heading: 74, crossing: 80, shooting: 82, jumping: 78, playmaker: 81, elasticity: 48 },
    },
    {
      name: 'Thiago Almada',
      nickname: 'Almada 🇦🇷⭐',
      age: 23,
      position: 'MEI',
      overall: 82,
      potential: 89,
      attrs: { pace: 84, dribbling: 86, tackling: 45, defending: 44, attacking: 83, finishing: 80, passing: 84, positioning: 83, heading: 58, crossing: 82, shooting: 82, jumping: 69, playmaker: 86, elasticity: 46 },
    },
    {
      name: 'Igor Jesus',
      nickname: 'Igor Jesus 🎯',
      age: 23,
      position: 'ATA',
      overall: 80,
      potential: 86,
      attrs: { pace: 81, dribbling: 78, tackling: 40, defending: 42, attacking: 82, finishing: 82, passing: 72, positioning: 83, heading: 82, crossing: 64, shooting: 81, jumping: 82, playmaker: 74, elasticity: 44 },
    },
  ],

  cor: [
    {
      name: 'Memphis Depay',
      nickname: 'Memphis 🦁🇳🇱',
      age: 30,
      position: 'ATA',
      overall: 81,
      potential: 81,
      attrs: { pace: 80, dribbling: 84, tackling: 38, defending: 37, attacking: 83, finishing: 82, passing: 80, positioning: 83, heading: 72, crossing: 79, shooting: 84, jumping: 76, playmaker: 82, elasticity: 46 },
    },
    {
      name: 'Rodrigo Garro',
      nickname: 'Garro 🇦🇷🎯',
      age: 26,
      position: 'MEI',
      overall: 80,
      potential: 83,
      attrs: { pace: 76, dribbling: 82, tackling: 58, defending: 56, attacking: 81, finishing: 77, passing: 84, positioning: 81, heading: 62, crossing: 83, shooting: 82, jumping: 70, playmaker: 85, elasticity: 46 },
    },
    {
      name: 'Yuri Alberto',
      nickname: 'Yuri Alberto ⚡',
      age: 23,
      position: 'ATA',
      overall: 79,
      potential: 85,
      attrs: { pace: 84, dribbling: 78, tackling: 38, defending: 36, attacking: 81, finishing: 81, passing: 70, positioning: 82, heading: 78, crossing: 66, shooting: 80, jumping: 80, playmaker: 72, elasticity: 44 },
    },
    {
      name: 'Hugo de Souza Nogueira',
      nickname: 'Hugo Souza 🧤⚫⚪',
      age: 26,
      position: 'GOL',
      overall: 79,
      potential: 84,
      attrs: { pace: 62, dribbling: 45, tackling: 40, defending: 81, attacking: 40, finishing: 30, passing: 72, positioning: 81, heading: 45, crossing: 40, shooting: 30, jumping: 84, playmaker: 58, elasticity: 84 },
    },
  ],

  san: [
    {
      name: 'Neymar da Silva Santos Jr',
      nickname: 'Neymar Jr 👑⚪⚫',
      age: 33,
      position: 'MEI',
      overall: 83,
      potential: 83,
      signatureTraits: ['trait_king_of_dribble'],
      attrs: { pace: 74, dribbling: 90, tackling: 36, defending: 36, attacking: 88, finishing: 82, passing: 88, positioning: 86, heading: 62, crossing: 85, shooting: 82, jumping: 68, playmaker: 90, elasticity: 50 },
    },
    {
      name: 'Gabriel Barbosa',
      nickname: 'Gabigol 🏹⚪⚫',
      age: 29,
      position: 'ATA',
      overall: 81,
      potential: 82,
      attrs: { pace: 80, dribbling: 81, tackling: 35, defending: 34, attacking: 83, finishing: 84, passing: 75, positioning: 85, heading: 75, crossing: 72, shooting: 83, jumping: 78, playmaker: 77, elasticity: 45 },
    },
    {
      name: 'Philippe Coutinho',
      nickname: 'Coutinho 🪄⚪⚫',
      age: 32,
      position: 'MEI',
      overall: 80,
      potential: 80,
      attrs: { pace: 75, dribbling: 84, tackling: 42, defending: 40, attacking: 82, finishing: 80, passing: 84, positioning: 82, heading: 58, crossing: 82, shooting: 84, jumping: 66, playmaker: 86, elasticity: 46 },
    },
    {
      name: 'Guilherme Augusto',
      nickname: 'Guilherme ⚡⚪⚫',
      age: 29,
      position: 'PE',
      overall: 78,
      potential: 78,
      attrs: { pace: 84, dribbling: 80, tackling: 42, defending: 40, attacking: 79, finishing: 78, passing: 75, positioning: 79, heading: 68, crossing: 78, shooting: 79, jumping: 74, playmaker: 76, elasticity: 45 },
    },
    {
      name: 'Giuliano Victor de Paula',
      nickname: 'Giuliano 🎯⚪⚫',
      age: 34,
      position: 'MC',
      overall: 77,
      potential: 77,
      attrs: { pace: 68, dribbling: 78, tackling: 58, defending: 56, attacking: 78, finishing: 76, passing: 82, positioning: 80, heading: 66, crossing: 79, shooting: 78, jumping: 66, playmaker: 82, elasticity: 44 },
    },
    {
      name: 'Carlos Gilberto Silva (Gil)',
      nickname: 'Gil 🛡️⚪⚫',
      age: 37,
      position: 'ZAG',
      overall: 77,
      potential: 77,
      attrs: { pace: 62, dribbling: 55, tackling: 82, defending: 82, attacking: 48, finishing: 42, passing: 68, positioning: 83, heading: 85, crossing: 45, shooting: 52, jumping: 80, playmaker: 62, elasticity: 48 },
    },
    {
      name: 'Gabriel Brazão',
      nickname: 'Brazão 🧤⚪⚫',
      age: 24,
      position: 'GOL',
      overall: 76,
      potential: 82,
      attrs: { pace: 60, dribbling: 45, tackling: 40, defending: 78, attacking: 40, finishing: 30, passing: 70, positioning: 78, heading: 45, crossing: 40, shooting: 30, jumping: 80, playmaker: 55, elasticity: 80 },
    },
  ],

  cru: [
    {
      name: 'Matheus Pereira',
      nickname: 'Matheus Pereira 🪄🔵',
      age: 28,
      position: 'MEI',
      overall: 81,
      potential: 82,
      attrs: { pace: 78, dribbling: 83, tackling: 52, defending: 50, attacking: 82, finishing: 78, passing: 84, positioning: 82, heading: 64, crossing: 83, shooting: 80, jumping: 70, playmaker: 85, elasticity: 46 },
    },
    {
      name: 'Cássio Ramos',
      nickname: 'Cássio 🧤🔵',
      age: 37,
      position: 'GOL',
      overall: 80,
      potential: 80,
      attrs: { pace: 55, dribbling: 40, tackling: 45, defending: 83, attacking: 35, finishing: 25, passing: 68, positioning: 84, heading: 50, crossing: 35, shooting: 25, jumping: 81, playmaker: 55, elasticity: 83 },
    },
    {
      name: 'Kaio Jorge',
      nickname: 'Kaio Jorge 🎯🔵',
      age: 23,
      position: 'ATA',
      overall: 78,
      potential: 84,
      attrs: { pace: 81, dribbling: 77, tackling: 36, defending: 35, attacking: 80, finishing: 80, passing: 72, positioning: 81, heading: 76, crossing: 68, shooting: 79, jumping: 78, playmaker: 73, elasticity: 44 },
    },
  ],

  sao: [
    {
      name: 'Lucas Rodrigues Moura da Silva',
      nickname: 'Lucas Moura ⚡🔴⚪⚫',
      age: 32,
      position: 'PD',
      overall: 81,
      potential: 81,
      attrs: { pace: 85, dribbling: 84, tackling: 48, defending: 46, attacking: 82, finishing: 79, passing: 79, positioning: 82, heading: 68, crossing: 80, shooting: 81, jumping: 76, playmaker: 81, elasticity: 48 },
    },
    {
      name: 'Jonathan Calleri',
      nickname: 'Calleri 🇦🇷🏹',
      age: 31,
      position: 'ATA',
      overall: 80,
      potential: 80,
      attrs: { pace: 75, dribbling: 76, tackling: 44, defending: 46, attacking: 83, finishing: 83, passing: 72, positioning: 84, heading: 85, crossing: 64, shooting: 82, jumping: 82, playmaker: 73, elasticity: 45 },
    },
    {
      name: 'Cauly Oliveira Souza',
      nickname: 'Cauly 🎯🔴⚪⚫',
      age: 29,
      position: 'MEI',
      overall: 80,
      potential: 80,
      attrs: { pace: 78, dribbling: 83, tackling: 50, defending: 48, attacking: 81, finishing: 77, passing: 83, positioning: 81, heading: 60, crossing: 82, shooting: 79, jumping: 68, playmaker: 84, elasticity: 46 },
    },
    {
      name: 'Luciano da Rocha Neves',
      nickname: 'Luciano ⚽🔴⚪⚫',
      age: 31,
      position: 'ATA',
      overall: 79,
      potential: 79,
      attrs: { pace: 76, dribbling: 79, tackling: 45, defending: 44, attacking: 81, finishing: 80, passing: 76, positioning: 82, heading: 74, crossing: 72, shooting: 80, jumping: 75, playmaker: 77, elasticity: 45 },
    },
    {
      name: 'Robert Arboleda',
      nickname: 'Arboleda 🛡️🇪🇨',
      age: 33,
      position: 'ZAG',
      overall: 80,
      potential: 80,
      attrs: { pace: 72, dribbling: 58, tackling: 83, defending: 83, attacking: 50, finishing: 44, passing: 66, positioning: 83, heading: 86, crossing: 50, shooting: 52, jumping: 86, playmaker: 60, elasticity: 50 },
    },
  ],

  cam: [
    {
      name: 'Givanildo Vieira de Sousa (Hulk)',
      nickname: 'Hulk 💪🏿⚫⚪',
      age: 38,
      position: 'ATA',
      overall: 82,
      potential: 82,
      attrs: { pace: 76, dribbling: 81, tackling: 48, defending: 46, attacking: 85, finishing: 85, passing: 79, positioning: 84, heading: 78, crossing: 80, shooting: 88, jumping: 80, playmaker: 81, elasticity: 46 },
    },
    {
      name: 'Gustavo Scarpa',
      nickname: 'Scarpa 🛹🎯',
      age: 31,
      position: 'MEI',
      overall: 80,
      potential: 80,
      attrs: { pace: 75, dribbling: 79, tackling: 54, defending: 52, attacking: 81, finishing: 78, passing: 83, positioning: 80, heading: 64, crossing: 86, shooting: 84, jumping: 68, playmaker: 84, elasticity: 46 },
    },
    {
      name: 'Guilherme Arana',
      nickname: 'Arana 🌪️⚫⚪',
      age: 27,
      position: 'LE',
      overall: 80,
      potential: 82,
      attrs: { pace: 82, dribbling: 80, tackling: 76, defending: 76, attacking: 80, finishing: 70, passing: 79, positioning: 78, heading: 66, crossing: 82, shooting: 74, jumping: 74, playmaker: 78, elasticity: 48 },
    },
    {
      name: 'Deyverson Silva',
      nickname: 'Deyverson 🤪⚫⚪',
      age: 33,
      position: 'ATA',
      overall: 78,
      potential: 78,
      attrs: { pace: 74, dribbling: 75, tackling: 46, defending: 44, attacking: 80, finishing: 80, passing: 68, positioning: 82, heading: 86, crossing: 60, shooting: 79, jumping: 85, playmaker: 70, elasticity: 45 },
    },
  ],

  vas: [
    {
      name: 'Dimitri Payet',
      nickname: 'Payet 🇫🇷🪄',
      age: 37,
      position: 'MEI',
      overall: 79,
      potential: 79,
      attrs: { pace: 66, dribbling: 82, tackling: 42, defending: 40, attacking: 80, finishing: 77, passing: 85, positioning: 80, heading: 56, crossing: 85, shooting: 82, jumping: 64, playmaker: 86, elasticity: 44 },
    },
    {
      name: 'Léo Jardim',
      nickname: 'Léo Jardim 🧤💢',
      age: 29,
      position: 'GOL',
      overall: 79,
      potential: 81,
      attrs: { pace: 60, dribbling: 44, tackling: 40, defending: 81, attacking: 35, finishing: 25, passing: 72, positioning: 82, heading: 45, crossing: 35, shooting: 25, jumping: 84, playmaker: 56, elasticity: 84 },
    },
    {
      name: 'Rayan Vitor',
      nickname: 'Rayan ⚡💎',
      age: 18,
      position: 'ATA',
      overall: 76,
      potential: 87,
      attrs: { pace: 85, dribbling: 80, tackling: 38, defending: 36, attacking: 78, finishing: 78, passing: 70, positioning: 77, heading: 75, crossing: 68, shooting: 79, jumping: 80, playmaker: 72, elasticity: 44 },
    },
  ],

  flu: [
    {
      name: 'Thiago Silva',
      nickname: 'Monstro 🛡️🇭🇺',
      age: 40,
      position: 'ZAG',
      overall: 81,
      potential: 81,
      attrs: { pace: 64, dribbling: 65, tackling: 85, defending: 86, attacking: 50, finishing: 45, passing: 76, positioning: 88, heading: 84, crossing: 60, shooting: 54, jumping: 82, playmaker: 72, elasticity: 50 },
    },
    {
      name: 'Jhon Arias',
      nickname: 'Arias 🇨🇴⚡',
      age: 27,
      position: 'PD',
      overall: 81,
      potential: 82,
      attrs: { pace: 85, dribbling: 84, tackling: 54, defending: 52, attacking: 82, finishing: 79, passing: 81, positioning: 82, heading: 64, crossing: 82, shooting: 80, jumping: 72, playmaker: 82, elasticity: 48 },
    },
    {
      name: 'Paulo Henrique Ganso',
      nickname: 'Ganso 🪄🇭🇺',
      age: 35,
      position: 'MEI',
      overall: 79,
      potential: 79,
      attrs: { pace: 58, dribbling: 82, tackling: 48, defending: 46, attacking: 80, finishing: 74, passing: 88, positioning: 81, heading: 65, crossing: 84, shooting: 76, jumping: 65, playmaker: 89, elasticity: 45 },
    },
  ],

  gre: [
    {
      name: 'Martin Braithwaite',
      nickname: 'Braithwaite 🇩🇰🔵',
      age: 33,
      position: 'ATA',
      overall: 80,
      potential: 80,
      attrs: { pace: 80, dribbling: 79, tackling: 42, defending: 40, attacking: 82, finishing: 82, passing: 74, positioning: 83, heading: 78, crossing: 72, shooting: 81, jumping: 79, playmaker: 75, elasticity: 45 },
    },
    {
      name: 'Franco Cristaldo',
      nickname: 'Cristaldo 🇦🇷🎯',
      age: 28,
      position: 'MEI',
      overall: 80,
      potential: 81,
      attrs: { pace: 75, dribbling: 80, tackling: 52, defending: 50, attacking: 81, finishing: 78, passing: 83, positioning: 81, heading: 64, crossing: 82, shooting: 80, jumping: 68, playmaker: 84, elasticity: 46 },
    },
    {
      name: 'Mathías Villasanti',
      nickname: 'Villasanti 🇵🇾🛡️',
      age: 27,
      position: 'VOL',
      overall: 80,
      potential: 82,
      attrs: { pace: 77, dribbling: 76, tackling: 81, defending: 81, attacking: 74, finishing: 68, passing: 80, positioning: 81, heading: 72, crossing: 72, shooting: 74, jumping: 78, playmaker: 78, elasticity: 48 },
    },
  ],

  int: [
    {
      name: 'Rafael Santos Borré',
      nickname: 'Borré 🇨🇴🏹',
      age: 29,
      position: 'ATA',
      overall: 80,
      potential: 81,
      attrs: { pace: 81, dribbling: 79, tackling: 44, defending: 42, attacking: 82, finishing: 81, passing: 74, positioning: 83, heading: 76, crossing: 70, shooting: 80, jumping: 78, playmaker: 76, elasticity: 46 },
    },
    {
      name: 'Alan Patrick',
      nickname: 'Alan Patrick 🪄🇦🇹',
      age: 33,
      position: 'MEI',
      overall: 81,
      potential: 81,
      attrs: { pace: 72, dribbling: 82, tackling: 50, defending: 48, attacking: 82, finishing: 79, passing: 86, positioning: 82, heading: 62, crossing: 84, shooting: 81, jumping: 66, playmaker: 87, elasticity: 45 },
    },
    {
      name: 'Sergio Rochet',
      nickname: 'Rochet 🇺🇾🧤',
      age: 31,
      position: 'GOL',
      overall: 80,
      potential: 80,
      attrs: { pace: 58, dribbling: 42, tackling: 40, defending: 82, attacking: 35, finishing: 25, passing: 72, positioning: 83, heading: 45, crossing: 35, shooting: 25, jumping: 82, playmaker: 56, elasticity: 83 },
    },
  ],

  bah: [
    {
      name: 'Everton Ribeiro',
      nickname: 'E. Ribeiro 🪄🔵🔴',
      age: 35,
      position: 'MEI',
      overall: 79,
      potential: 79,
      attrs: { pace: 72, dribbling: 82, tackling: 54, defending: 52, attacking: 80, finishing: 75, passing: 84, positioning: 81, heading: 62, crossing: 83, shooting: 78, jumping: 66, playmaker: 85, elasticity: 45 },
    },
    {
      name: 'Jean Lucas',
      nickname: 'Jean Lucas 🌪️🔵🔴',
      age: 26,
      position: 'MC',
      overall: 78,
      potential: 82,
      attrs: { pace: 80, dribbling: 79, tackling: 74, defending: 72, attacking: 78, finishing: 72, passing: 80, positioning: 78, heading: 70, crossing: 74, shooting: 76, jumping: 76, playmaker: 79, elasticity: 48 },
    },
  ],
};

/**
 * Injeta os craques reais dentro do elenco de um clube
 */
export function injectFamousStars(clubId: string, currentRoster: Player[]): Player[] {
  const famousStars = FAMOUS_STAR_ROSTERS[clubId];
  if (!famousStars || famousStars.length === 0) return currentRoster;

  const updatedRoster = [...currentRoster];
  const injectedIndices = new Set<number>();

  famousStars.forEach((star, index) => {
    // Procura o jogador da mesma posição que ainda não foi ocupado por outro craque
    let targetIndex = updatedRoster.findIndex(
      (p, i) => i >= index && p.position === star.position && !injectedIndices.has(i)
    );

    if (targetIndex === -1) {
      targetIndex = updatedRoster.findIndex((p, i) => !injectedIndices.has(i));
    }

    if (targetIndex === -1) {
      targetIndex = index;
    }

    injectedIndices.add(targetIndex);

    if (targetIndex >= 0 && targetIndex < updatedRoster.length) {
      const attrs = star.attrs as PlayerAttributes;
      const overall = star.overall || calculateOverall(star.position, attrs);
      const marketValue = calculateMarketValue(overall, star.age, star.potential);
      const wage = calculateWeeklyWage(overall, false);

      updatedRoster[targetIndex] = {
        ...updatedRoster[targetIndex],
        id: `${clubId}-star-${index + 1}`,
        name: star.name,
        nickname: star.nickname,
        age: star.age,
        position: star.position,
        attributes: attrs,
        overall,
        potential: star.potential,
        signatureTraits: star.signatureTraits,
        marketValue,
        wage,
        isYouth: false,
      };
    }
  });

  return updatedRoster;
}
