// ==============================================================================
// BOLA NA REDE: CARREIRA - BALANCEAMENTO DINÂMICO DE MINIGAMES (OVR × LIGA)
// ==============================================================================
// Centraliza o cálculo de dificuldade para todos os 13 minigames do jogo:
// - Quanto menor o OVR do atleta em relação à liga/adversário -> mais difícil
// - Quanto maior o OVR -> mais fácil e preciso (barras mais lentas, alvo maior)
// - Quanto mais forte a liga/competição -> maior exigência de reflexo e precisão
// ==============================================================================

import { Division } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

export type DifficultyLabel = 'Fácil' | 'Equilibrado' | 'Difícil' | 'Elite';

export interface LeagueTierConfig {
  tier: 1 | 2 | 3 | 4 | 5;
  label: string;
  benchmarkOvr: number;
  /** Pressão base da liga em escala [0.22 .. 0.88] */
  leaguePressure: number;
}

export const LEAGUE_TIER_CONFIG: Record<Division, LeagueTierConfig> = {
  D: { tier: 1, label: 'Série D', benchmarkOvr: 60, leaguePressure: 0.24 },
  C: { tier: 2, label: 'Série C', benchmarkOvr: 66, leaguePressure: 0.36 },
  SEGUNDA_ESP: { tier: 2, label: 'La Liga 2', benchmarkOvr: 68, leaguePressure: 0.40 },
  SERIE_B_ITA: { tier: 2, label: 'Serie B ITA', benchmarkOvr: 68, leaguePressure: 0.40 },
  BUNDESLIGA_2: { tier: 2, label: '2. Bundesliga', benchmarkOvr: 68, leaguePressure: 0.40 },
  LIGUE_2: { tier: 2, label: 'Ligue 2', benchmarkOvr: 67, leaguePressure: 0.38 },
  B: { tier: 3, label: 'Série B', benchmarkOvr: 72, leaguePressure: 0.49 },
  MLS: { tier: 3, label: 'MLS', benchmarkOvr: 73, leaguePressure: 0.52 },
  SAUDI_PRO: { tier: 3, label: 'Saudita Pro', benchmarkOvr: 75, leaguePressure: 0.56 },
  CHAMPIONSHIP: { tier: 3, label: 'Championship', benchmarkOvr: 74, leaguePressure: 0.54 },
  A: { tier: 4, label: 'Série A', benchmarkOvr: 77, leaguePressure: 0.64 },
  LIGUE_1: { tier: 4, label: 'Ligue 1', benchmarkOvr: 79, leaguePressure: 0.69 },
  BUNDESLIGA: { tier: 4, label: 'Bundesliga', benchmarkOvr: 81, leaguePressure: 0.72 },
  SERIE_A_ITA: { tier: 4, label: 'Serie A ITA', benchmarkOvr: 81, leaguePressure: 0.72 },
  LALIGA: { tier: 5, label: 'La Liga', benchmarkOvr: 83, leaguePressure: 0.80 },
  PL: { tier: 5, label: 'Premier League', benchmarkOvr: 84, leaguePressure: 0.82 },
  EUROPA: { tier: 5, label: 'Champions League', benchmarkOvr: 86, leaguePressure: 0.88 },
};

export interface MinigameDifficultyInput {
  playerOverall?: number;
  division?: Division;
  opponentOverall?: number;
  opponentReputation?: number;
  isOnFire?: boolean;
}

export interface MinigameDifficultyParams {
  playerOverall: number;
  division: Division;
  leagueTier: 1 | 2 | 3 | 4 | 5;
  leagueLabel: string;
  benchmarkOvr: number;
  /** Score normalizado: 0.15 (muito fácil) -> 0.50 (equilibrado) -> 0.95 (elite) */
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  /** Multiplicador da velocidade de reação/movimento do goleiro (0.60x .. 1.55x) */
  keeperSpeedMult: number;
  /** Multiplicador da velocidade dos defensores / bots marcadores (0.62x .. 1.48x) */
  defenderSpeedMult: number;
  /** Multiplicador da velocidade das barras de força/tempo/discurso (0.68x .. 1.45x) */
  powerBarSpeedMult: number;
  /** Escala das zonas ideais / janelas de acerto (1.35x no fácil .. 0.65x no elite) */
  sweetSpotScale: number;
  /** Bônus/penalidade aditiva em leituras/probabilidades da IA (-0.12 .. +0.16) */
  aiReactionBonus: number;
  /** Fator de apoio do companheiro/precisão assistida (1.30x no fácil .. 0.72x no elite) */
  teammateAssistScale: number;
  isOnFire: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calcula todos os parâmetros de dificuldade para os minigames a partir do OVR
 * do jogador (ou elenco no modo técnico), da liga atual e da força do adversário.
 */
export function getMinigameDifficultyParams(
  input: MinigameDifficultyInput = {}
): MinigameDifficultyParams {
  const division: Division = input.division && LEAGUE_TIER_CONFIG[input.division]
    ? input.division
    : 'A';
  const leagueCfg = LEAGUE_TIER_CONFIG[division];
  const playerOverall = clamp(Math.round(input.playerOverall ?? 72), 45, 99);
  const isOnFire = Boolean(input.isOnFire);

  // Converte reputação do adversário em OVR aproximado se opponentOverall não vier explícito
  const inferredOppOvr = input.opponentOverall
    ?? (input.opponentReputation ? Math.round(52 + input.opponentReputation * 0.4) : leagueCfg.benchmarkOvr);

  const effectiveBenchmark = leagueCfg.benchmarkOvr * 0.6 + clamp(inferredOppOvr, 50, 96) * 0.4;

  // Combina força da liga + diferença OVR vs liga + OVR absoluto do jogador
  const leagueContribution = (leagueCfg.leaguePressure - 0.5) * 0.75;
  const relativeGapContribution = (effectiveBenchmark - playerOverall) * 0.016;
  const rawOvrContribution = (74 - playerOverall) * 0.012;
  const onFireRelief = isOnFire ? 0.05 : 0;

  const difficultyScore = clamp(
    0.5 + leagueContribution + relativeGapContribution + rawOvrContribution - onFireRelief,
    0.15,
    0.95
  );

  // delta negativo = mais fácil que o padrão; positivo = mais difícil
  const delta = difficultyScore - 0.5;

  let difficultyLabel: DifficultyLabel = 'Equilibrado';
  if (difficultyScore < 0.32) difficultyLabel = 'Fácil';
  else if (difficultyScore < 0.58) difficultyLabel = 'Equilibrado';
  else if (difficultyScore < 0.78) difficultyLabel = 'Difícil';
  else difficultyLabel = 'Elite';

  return {
    playerOverall,
    division,
    leagueTier: leagueCfg.tier,
    leagueLabel: leagueCfg.label,
    benchmarkOvr: Math.round(effectiveBenchmark),
    difficultyScore: Number(difficultyScore.toFixed(2)),
    difficultyLabel,
    keeperSpeedMult: Number(clamp(1.0 + delta * 1.15, 0.60, 1.55).toFixed(2)),
    defenderSpeedMult: Number(clamp(1.0 + delta * 1.05, 0.62, 1.48).toFixed(2)),
    powerBarSpeedMult: Number(clamp(1.0 + delta * 0.92, 0.68, 1.45).toFixed(2)),
    sweetSpotScale: Number(clamp(1.0 - delta * 0.80, 0.65, 1.35).toFixed(2)),
    aiReactionBonus: Number(clamp(delta * 0.35, -0.12, 0.16).toFixed(3)),
    teammateAssistScale: Number(clamp(1.0 - delta * 0.55, 0.72, 1.30).toFixed(2)),
    isOnFire,
  };
}

/**
 * Hook React para obter o balanceamento dinâmico diretamente do estado da carreira ativa.
 * Permite sobrescrever divisão, OVR ou força do adversário (ex.: confronto de copa ou treino).
 */
export function useMinigameBalance(overrides: MinigameDifficultyInput = {}): MinigameDifficultyParams {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const onFireStreak = useGameStore((s) => s.onFireStreak);

  const activeClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;
  const activeClub = activeClubId ? clubs[activeClubId] : undefined;

  // No modo técnico, usa a média dos 11 primeiros atletas do elenco como OVR efetivo
  let defaultOvr = playerProfile?.overall ?? 72;
  if (mode === 'manager' && activeClub?.roster?.length) {
    const top11 = activeClub.roster.slice(0, 11);
    const sum = top11.reduce((acc, p) => acc + p.overall, 0);
    defaultOvr = Math.round(sum / Math.max(1, top11.length));
  } else if (mode === 'manager' && managerProfile) {
    defaultOvr = Math.round(62 + managerProfile.reputation * 0.32);
  }

  return getMinigameDifficultyParams({
    playerOverall: overrides.playerOverall ?? defaultOvr,
    division: overrides.division ?? activeClub?.division ?? 'A',
    opponentOverall: overrides.opponentOverall,
    opponentReputation: overrides.opponentReputation,
    isOnFire: overrides.isOnFire ?? Boolean(onFireStreak?.isOnFire),
  });
}
