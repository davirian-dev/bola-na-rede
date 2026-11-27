import { describe, expect, it } from 'vitest';
import { calculateCareerScore } from '../scoringEngine';
import type { GameState } from '@/types/game';

function createBaseState(overrides: Partial<GameState> = {}): GameState {
  return {
    mode: 'player',
    trophies: [],
    playerProfile: {
      overall: 70,
      position: 'ATA',
      bankBalance: 0,
      lifestyleAssets: [],
      stats: {
        goals: 0,
        assists: 0,
        cleanSheets: 0,
      },
    },
    ...overrides,
  } as unknown as GameState;
}

describe('scoringEngine', () => {
  it('retorna 0 pontos e rank inicial para carreira sem conquistas', () => {
    const score = calculateCareerScore(createBaseState());

    expect(score.totalPoints).toBe(0);
    expect(score.trophiesCount).toBe(0);
    expect(score.rankTitle).toBe('Promessa em Início');
  });

  it('soma pontos de ligas, copas e torneios internacionais corretamente', () => {
    const state = createBaseState({
      trophies: [
        { title: 'Brasileirão Série A', category: 'league', division: 'A', seasonYear: 2026 },
        { title: 'Copa do Brasil', category: 'cup', seasonYear: 2026 },
        { title: 'Copa Libertadores', category: 'international', seasonYear: 2026 },
      ] as GameState['trophies'],
    });

    const score = calculateCareerScore(state);

    expect(score.breakdown.leagues.points).toBe(12);
    expect(score.breakdown.cups.points).toBe(10);
    expect(score.breakdown.internationals.points).toBe(18);
    expect(score.totalPoints).toBe(40);
    expect(score.trophiesCount).toBe(3);
    expect(score.rankTitle).toBe('Jogador de Destaque');
  });

  it('calcula bônus individuais de Bola de Ouro, artilharia e assistências', () => {
    const state = createBaseState({
      playerProfile: {
        overall: 88,
        position: 'ATA',
        bankBalance: 1_000_000,
        lifestyleAssets: [],
        stats: {
          goals: 32,
          assists: 12,
          cleanSheets: 0,
        },
      } as unknown as GameState['playerProfile'],
    });

    const score = calculateCareerScore(state);

    // 10 (Overall >= 85) + 15 (32 gols -> floor(3.2)*5) + 4 (assists >= 10) = 29
    expect(score.breakdown.individual.points).toBe(29);
    // bankBalance 1_000_000 -> log10 = 6 -> 6*2 - 8 = 4
    expect(score.breakdown.lifestyle.points).toBe(4);
    expect(score.totalPoints).toBe(33);
  });

  it('calcula pontuação de treinador no modo manager', () => {
    const state = createBaseState({
      mode: 'manager',
      playerProfile: undefined,
      managerProfile: {
        stats: {
          titlesWon: 3,
          wins: 30,
        },
      } as unknown as GameState['managerProfile'],
    });

    const score = calculateCareerScore(state);

    // 3 * 5 (titlesWon) + 6 (wins >= 25) = 21
    expect(score.breakdown.individual.points).toBe(21);
    expect(score.rankTitle).toBe('Profissional Respeitado');
  });
});
