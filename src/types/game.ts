// ==============================================================================
// BOLA NA REDE: CARREIRA - TYPINGS & GAME MODELING (src/types/game.ts)
// ==============================================================================

export type Position = 
  | 'GOL' // Goleiro
  | 'ZAG' // Zagueiro Central
  | 'LD'  // Lateral Direito
  | 'LE'  // Lateral Esquerdo
  | 'VOL' // Volante
  | 'MC'  // Meio-Campo Central
  | 'MEI' // Meia Ofensivo / Armador
  | 'PD'  // Ponta Direita
  | 'PE'  // Ponta Esquerda
  | 'ATA'; // Centroavante / Atacante

export type PlayerStyle = 
  | 'artilheiro' // Bônus em Finalização e Compostura
  | 'velocista'  // Bônus em Ritmo e Drible
  | 'maestro'    // Bônus em Passe e Visão de Jogo
  | 'paredao'    // Bônus em Defesa e Físico (ou Reflexos para GOL)
  | 'equilibrado';

export type TrainingFocus = 
  | 'finishing'  // Finalização e Compostura
  | 'pace'       // Ritmo e Drible
  | 'passing'    // Passe e Visão
  | 'defending'  // Defesa e Posicionamento
  | 'physical'   // Físico e Resistência
  | 'rest';      // Descanso (+Energia)

export interface PlayerAttributes {
  // 14 Atributos Oficiais de Jogo
  pace: number;         // 1. Velocidade
  dribbling: number;    // 2. Drible
  tackling: number;     // 3. Desarme
  defending: number;    // 4. Defesa
  attacking: number;    // 5. Ataque
  finishing: number;    // 6. Finalização
  passing: number;      // 7. Passe
  positioning: number;  // 8. Posicionamento
  heading: number;      // 9. Cabeceio
  crossing: number;     // 10. Cruzamento
  shooting: number;     // 11. Chute / Potência
  jumping: number;      // 12. Salto / Impulsão
  playmaker: number;    // 13. Armador / Visão
  elasticity: number;   // 14. Elasticidade (fundamental para goleiro)

  // Campos legados mantidos para retrocompatibilidade
  physical?: number;
  vision?: number;
  composure?: number;
  gkReflexes?: number;
  gkPositioning?: number;
  gkHandling?: number;
}

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  age: number;
  position: Position;
  attributes: PlayerAttributes;
  overall: number;       // Calculado ponderadamente pela posição (0-99)
  potential: number;     // Potencial máximo de evolução (0-99)
  energy: number;        // 0-100
  morale: number;        // 0-100
  marketValue: number;   // Valor de mercado em R$
  wage: number;          // Salário semanal em R$
  contractWeeks: number; // Semanas restantes de contrato
  isYouth: boolean;      // Pertence à base Sub-20
  isInjured?: boolean;   // Atleta no departamento médico
  isSuspended?: boolean; // Suspenso por cartões
  suspensionMatches?: number; // Jogos restantes de suspensão
  stats?: {
    goals: number;
    assists: number;
    matches: number;
    averageRating: number;
  };
}

export type Division = 'A' | 'B' | 'C' | 'D' | 'EUROPA';

export type CompetitionType = 
  | 'serie_a' 
  | 'serie_b' 
  | 'serie_c' 
  | 'serie_d' 
  | 'sub_20' 
  | 'copa_brasil'
  | 'champions_league';

export interface Club {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;   // Hex (#10b981)
  secondaryColor: string; // Hex (#ffffff)
  division: Division;
  reputation: number;     // 1 a 100
  budget: number;         // Orçamento disponível em R$
  wageBudget: number;     // Teto semanal para salários
  stadiumName: string;
  stadiumCapacity: number;
  stadiumLevel: number;   // 1 a 5
  roster: Player[];       // Elenco profissional (18 atletas)
  youthRoster: Player[];  // Elenco da base Sub-20 (11 atletas)
  rankingPoints?: number; // Pontos acumulados no Ranking Nacional de Clubes
  rivalClubIds?: string[];// IDs de clubes rivais históricos
  derbyName?: string;     // Nome do clássico principal (ex: 'Fla-Flu', 'Derby Paulista', 'Gre-Nal')
  captainPlayerId?: string;      // ID do Capitão oficial da equipe (©️)
  penaltyTakerPlayerId?: string; // ID do Cobrador Oficial de Pênaltis (🎯)
  freeKickTakerPlayerId?: string;// ID do Cobrador Oficial de Faltas (☄️)
  lineup?: string[];             // IDs dos 11 atletas titulares escalados
  tactics?: {
    formation?: TacticalFormation;
    philosophy?: ManagerTacticsPhilosophy;
  };
}

export type PreferredFoot = 'right' | 'left' | 'both';

// 5 Habilidades de Ouro (PlayStyles) Oficiais
export type PlayStyleGoldId = 
  | 'rapid_gold'       // ⚡ Arrancada Foguete (Velocidade & Drible)
  | 'finisher_gold'    // 🎯 Finalizador Letal (Chute & Frieza)
  | 'playmaker_gold'   // 🪄 Maestro Teleguiado (Passe & Visão)
  | 'anticipate_gold'  // 🛡️ Muralha Cirúrgica (Desarme & Defesa)
  | 'acrobatic_gold';  // 🦅 Asas de Aço / Elasticidade (Salto & Elasticidade)

export interface PlayStyleGold {
  id: PlayStyleGoldId;
  name: string;
  icon: string;
  value: number; // Valor financeiro agregado em R$
  tagline: string;
  description: string;
  initialBoost: Partial<Record<keyof PlayerAttributes, number>>;
}

export type PlayerSpecialty = 
  | 'speed'       // ⚡ Velocidade
  | 'dribbling'   // ⚽ Drible
  | 'tackling'    // 🛡️ Desarme
  | 'defending'   // 🛡️ Defesa
  | 'attacking'   // ⚔️ Ataque
  | 'finishing'   // 🎯 Finalização
  | 'passing'     // 👟 Passe
  | 'positioning' // 📍 Posicionamento
  | 'heading'     // 👤 Cabeceio
  | 'crossing'    // ↗️ Cruzamento
  | 'jumping'     // 🦘 Salto
  | 'playmaker';  // 🪄 Armador

export type CareerLength = 12 | 16 | 20 | 24 | 99; // 99 = dinastia infinita

export type MatchSimSystem = 'instant' | 'detailed';

export type ManagerArchetype = 
  | 'strategist'        // ♟️ Estrategista (+entrosamento, +tática)
  | 'motivator'         // 🔥 Motivador (+moral, reação 2º tempo)
  | 'talent_developer'  // 👥 Formador de Talentos (+XP base e jovens)
  | 'pragmatic'         // 🧱 Pragmático (+defesa, estabilidade)
  | 'financial_manager';// 💼 Gestor (+5% finanças)

export type NRGType = 'classic' | 'power' | 'focus' | 'gold';

export interface NRGInventory {
  classic: number; // NRG Clássico (Verde)
  power: number;   // NRG Power (Azul)
  focus: number;   // NRG Focus (Rosa)
  gold: number;    // NRG Extreme (Ouro)
}

export interface NRGDrinkItem {
  id: NRGType;
  name: string;
  colorName: string;
  badgeColor: string;
  bgGradient: string;
  price: number;
  energyBonus: number;
  moraleBonus: number;
  icon: string;
  description: string;
}

export type BootRarity = 'Base' | 'Pro' | 'Elite' | 'Lendária';

export interface BootItem {
  id: string;
  name: string;
  rarity?: BootRarity;
  price: number;
  durabilityMatches: number;
  matchesRemaining: number;
  description?: string;
  bonus: {
    shooting?: number;
    pace?: number;
    passing?: number;
    dribbling?: number;
    power?: number;
    technique?: number;
  };
  bonusAttributes?: Partial<Record<keyof PlayerAttributes, number>>;
  specialPerk?: string;
  icon: string;
  color?: string;
  accentColor?: string;
  glowClass?: string;
}

export type BallRarity = 'Comum' | 'Rara' | 'Especial' | 'Lendária';

export interface BallItem {
  id: string;
  name: string;
  subtitle: string;
  rarity: BallRarity;
  price: number;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  physics: {
    frictionMultiplier: number; // Ex: 1.15 para +15% de atrito
    curveMultiplier: number;    // Ex: 1.35 para +35% de curva (Jabulani)
    speedMultiplier: number;    // Ex: 1.12 para +12% de velocidade (Meteoro)
    precisionBonus: number;     // Ex: 0.10 para +10% de precisão (Brazuca / Ouro)
    dribbleBonus: number;       // Ex: 0.08 para +8% de controle (Cyber Neon)
    rainImmune?: boolean;       // Imune à penalidade de chuva (Laranja)
    trailType: 'classic' | 'jabulani' | 'brazuca' | 'fire' | 'cyber' | 'gold' | 'neon';
  };
}

export type DilemmaCategory = 'press' | 'locker' | 'personal' | 'sponsor' | 'board';
export type DilemmaTone = 'humble' | 'cocky' | 'aggressive' | 'rational' | 'calm' | 'firm';

export interface DilemmaConsequence {
  // Modo Jogador
  coachTrust?: number;        // -100 a +100
  fanApproval?: number;       // -100 a +100
  squadChemistry?: number;    // -100 a +100
  familyHappiness?: number;   // -100 a +100
  
  // Modo Treinador
  boardTrust?: number;
  squadMorale?: number;
  mediaReputation?: number;
  
  // Efeitos Gerais
  money?: number;
  moneyChange?: number;
  energy?: number;
  energyChange?: number;
  morale?: number;
  reputation?: number;
  
  // Status Especiais
  isBenched?: boolean;
  benched?: boolean;
  isCaptain?: boolean;
  tempMatchBonus?: number;
  matchAttributeBonus?: Partial<Record<keyof PlayerAttributes, number>>;
  
  // Notícia gerada no feed se a resposta for polêmica/marcante
  newsHeadline?: string;
  newsBody?: string;
  isBreakingNews?: boolean;
}

export interface DilemmaOption {
  id: string;
  text: string;
  tone: DilemmaTone;
  impactPreview: string; // Ex: "Técnico +10 🟢 | Torcida -5 🔴"
  consequences: DilemmaConsequence;
}

export interface DilemmaEvent {
  id: string;
  title: string;
  category: DilemmaCategory;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  situation: string;
  description?: string;
  forMode: 'player' | 'manager' | 'both';
  triggerMoment: 'post_match' | 'pre_derby' | 'slump' | 'transfer_window' | 'weekly_random';
  minWeek?: number;
  options: DilemmaOption[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'agent' | 'physio' | 'press';
  title: string;
  weeklyCost: number;
  perkDescription: string;
}

export interface SponsorContract {
  id: string;
  brandName: string;
  weeklyPay: number;
  goalBonus: number;
  weeksRemaining: number;
  logo: string;
  category?: 'boots' | 'energy' | 'apparel' | 'lifestyle';
  targetDescription?: string; // Ex: "Marcar 10 gols na temporada"
  targetGoal?: number;
  currentProgress?: number;
  targetRewardPay?: number;
  energyRegenBonus?: number;  // Bônus de recuperação de energia semanal
}

export interface NationalTeamData {
  status: 'none' | 'sub_20' | 'senior';
  caps: number;     // Jogos com a Amarelinha
  goals: number;    // Gols pela Seleção
  assists: number;  // Assistências
  trophies: string[]; // Títulos internacionais (Copa do Mundo, Copa América, etc.)
  isCurrentlyCalledUp?: boolean;
  nextMatchOpponent?: string;
}

export interface PlayerCareerProfile {
  id: string;
  name: string;
  nickname: string;
  age: number;
  position: Position;
  style: PlayerStyle;
  clubId: string;
  isYouthTeam: boolean;
  trainingFocus?: TrainingFocus;
  height: number;             // em cm (ex: 178)
  weight: number;             // em kg (ex: 74)
  preferredFoot: PreferredFoot;
  nationality?: string;       // País de origem (ex: 'Brasil', 'Argentina', etc.)
  skinTone?: number;          // Tom de pele 1 a 5
  preferredKit?: 'home' | 'away'; // Uniforme 1 (Titular) ou 2 (Reserva)
  tacticalRoleBonus?: string; // Diagnóstico tático da posição e pé
  tacticalPros?: string[];    // Pontos positivos da combinação posição/pé
  tacticalCons?: string[];    // Pontos negativos da combinação posição/pé
  goldPlayStyle?: PlayStyleGoldId; // Habilidade de Ouro ativa
  jerseyNumber: number;
  specialties: PlayerSpecialty[]; // até 3 habilidades de ouro
  careerLength: CareerLength;
  matchSimSystem: MatchSimSystem;
  energyDrinksCount: number;  // Latinhas de energético no inventário (NSS - total)
  nrgInventory?: NRGInventory; // Inventário individual das 4 latinhas do NSS (Verde, Azul, Rosa, Amarela)
  activeBoot?: BootItem;      // Chuteira equipada com bônus e desgaste
  staff: {
    agent?: StaffMember;
    physio?: StaffMember;
    press?: StaffMember;
  };
  sponsors: SponsorContract[]; // Patrocinadores ativos
  attributes: PlayerAttributes;
  overall: number;
  potential: number;
  energy: number;          // 0 a 100
  morale: number;          // 0 a 100
  weeklyWage: number;      // Salário semanal em R$
  bankBalance: number;     // Saldo bancário acumulado em R$
  money?: number;           // Alias compatível com bankBalance
  reputation: number;      // 0 a 100
  relationshipManager: number; // 0 a 100 com o técnico
  relationshipFans: number;    // 0 a 100 com a torcida
  relationshipFamily: number;  // 0 a 100 com a família
  coachTrust?: number;         // Confiança do Técnico (0 a 100, fallback: relationshipManager ?? 60)
  fanApproval?: number;        // Moral com a Torcida (0 a 100, fallback: relationshipFans ?? 60)
  squadChemistry?: number;     // Entrosamento no Vestiário (0 a 100, fallback: 65)
  familyHappiness?: number;    // Vida Pessoal/Família (0 a 100, fallback: relationshipFamily ?? 60)
  isBenched?: boolean;         // Se o atleta virou reserva por baixa confiança do técnico (< 35)
  equippedBootId?: string;     // ID da chuteira equipada
  ownedBootIds?: string[];     // IDs das chuteiras compradas
  equippedBallId?: string;     // ID da bola equipada
  ownedBallIds?: string[];     // IDs das bolas compradas
  tempMatchBonus?: Partial<Record<keyof PlayerAttributes, number>>; // Bônus temporário de preleção/dilema
  stats: {
    matchesPlayed: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    averageRating: number;
  };
  lifestyleAssets: string[]; // Itens comprados
  isCaptain?: boolean;          // Se o atleta carrega a braçadeira oficial de capitão (©️)
  isPenaltyTaker?: boolean;     // Se o atleta é o cobrador oficial de pênaltis (🎯)
  isFreeKickTaker?: boolean;    // Se o atleta é o cobrador oficial de faltas diretas (☄️)
  unlockedEpicSkills?: string[]; // IDs das habilidades épicas desbloqueadas por conquistas
  unlockedBadges?: string[];     // IDs das medalhas/conquistas do Hall da Fama
  nationalTeam?: NationalTeamData;// Convocação e histórico na Seleção Brasileira
  youthTournamentFinished?: boolean;
  avatar?: CharacterAvatar;
}

export type ManagerTacticsPhilosophy = 
  | 'attacking'   // Ofensivo
  | 'balanced'    // Equilibrado
  | 'defensive'   // Retranca
  | 'possession'; // Posse de Bola

export interface CharacterAvatar {
  skinTone: string;        // Hex do tom de pele
  hairStyle: 'short' | 'buzz' | 'afro' | 'dreads' | 'undercut' | 'bald';
  hairColor: string;       // Hex da cor de cabelo
  facialHair: 'none' | 'stubble' | 'beard' | 'mustache';
  clothingStyle: 'jersey' | 'suit' | 'tracksuit';
  jerseyNumber?: number;
}

export type TacticalFormation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2' | '4-1-4-1';

export interface ManagerCareerProfile {
  id: string;
  name: string;
  age: number;
  archetype: ManagerArchetype;
  philosophy: ManagerTacticsPhilosophy;
  formation: TacticalFormation;
  clubId: string;
  careerLength: CareerLength;
  matchSimSystem: MatchSimSystem;
  reputation: number;          // 0 a 100
  boardConfidence: number;     // 0 a 100 (confiança da diretoria)
  fansConfidence: number;      // 0 a 100 (confiança da torcida)
  boardTrust?: number;         // Confiança da Diretoria (0 a 100, fallback: boardConfidence ?? 60)
  fanApproval?: number;        // Moral com a Torcida (0 a 100, fallback: fansConfidence ?? 60)
  squadMorale?: number;        // Moral do Vestiário (0 a 100, fallback: entrosamento ?? 65)
  mediaReputation?: number;    // Reputação na Imprensa (0 a 100, fallback: reputation ?? 60)
  equippedBallId?: string;     // ID da bola equipada
  ownedBallIds?: string[];     // IDs das bolas compradas
  lastLockerRoomMeetingWeek?: number; // Semana da última reunião de elenco
  scoutingLevel: number;       // 1 a 5
  medicalLevel: number;        // 1 a 5
  stats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    titlesWon: number;
  };
  managingNationalTeam?: string; // Ex: 'Brasil' ou 'Argentina' (treinador da Seleção)
  avatar?: CharacterAvatar;
  entrosamento?: number; // 0 a 100% de entrosamento tático da equipe
  highPressure?: boolean; // Pressão alta tática ligada/desligada
  stadiumUpgrades?: {
    comfortLevel: number;    // 1 a 5
    vipLevel: number;        // 1 a 5
    marketingLevel: number;  // 1 a 5
    ticketPrice: number;     // em R$
  };
  trainingUpgrades?: {
    ctLevel: number;         // 1 a 5
    medicalLevel: number;    // 1 a 5
    playerFocus: Record<string, string>; // playerId -> 'finishing' | 'passing' | etc.
  };
  selectedReservesIds?: string[]; // IDs dos 7 reservas escalados para o banco
}

export interface LeagueStanding {
  clubId: string;
  clubName: string;
  shortName: string;
  primaryColor: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GoalEvent {
  playerId: string;
  playerName: string;
  clubId: string;
  minute: number;
  isPenalty?: boolean;
  assistPlayerId?: string;
  assistPlayerName?: string;
}

export interface CardEvent {
  playerId: string;
  playerName: string;
  clubId: string;
  minute: number;
  type: 'yellow' | 'red';
  reason?: string;
}

export interface OffsideEvent {
  playerId: string;
  playerName: string;
  clubId: string;
  minute: number;
  disallowedGoal?: boolean; // Se o lance gerou gol anulado
  varReviewed?: boolean;    // Se passou por revisão do VAR
}

export interface Fixture {
  id: string;
  week: number;
  competition: CompetitionType;
  division?: Division;
  stage?: string; // Ex: 'oitavas', 'quartas', 'semi', 'final'
  homeClubId: string;
  awayClubId: string;
  homeGoals?: number;
  awayGoals?: number;
  isPlayed: boolean;
  isYouth?: boolean;
  scorers?: GoalEvent[];
  cards?: CardEvent[];
  offsides?: OffsideEvent[];
  mvpPlayerId?: string;
  ratings?: Record<string, number>;
}

export interface League {
  id: string;
  name: string;
  division: Division;
  isProOnly: boolean;
  standings: LeagueStanding[];
  fixtures: Fixture[];
}

export interface CopaDoBrasil {
  id: string;
  name: string;
  currentStage: 'oitavas' | 'quartas' | 'semi' | 'final' | 'encerrado';
  fixtures: Fixture[];
  championClubId?: string;
}

export interface Sub20Tournament {
  id: string;
  name: string;
  standings: LeagueStanding[];
  fixtures: Fixture[];
  championClubId?: string;
}

export interface TopScorer {
  playerId: string;
  playerName: string;
  clubId: string;
  clubName: string;
  goals: number;
  assists: number;
  matches: number;
  competition: CompetitionType;
}

export type NewsCategory = 
  | 'transfer' 
  | 'match' 
  | 'drama' 
  | 'club' 
  | 'achievement' 
  | 'rodada' 
  | 'destaque' 
  | 'base' 
  | 'titulo'
  | 'entrevista';

export interface ControversyOption {
  id: string;
  text: string;
  quote: string; // Frase de impacto dita pelo jogador
  consequences: {
    morale?: number;
    relationshipManager?: number;
    relationshipFans?: number;
    relationshipFamily?: number;
    boardConfidence?: number;
    reputation?: number;
    bankBalance?: number;
  };
  headline: string;
  newsBody: string;
  mediaCommentary: string; // Comentário de TV (ex: Craque Neto, PVC, Casagrande)
}

export interface ControversyEvent {
  id: string;
  title: string;
  context: string;
  reporterQuestion: string;
  realLifeInspiration: string; // Ex: "Inspirado na clássica resposta do Baixinho Romário"
  options: ControversyOption[];
}

export interface AnsweredControversy {
  event: ControversyEvent;
  chosenOption: ControversyOption;
  week: number;
  seasonYear: number;
  answeredAt: string;
}

export interface NewsItem {
  id: string;
  week: number;
  seasonYear: number;
  category: NewsCategory;
  headline: string;
  body: string;
  clubId?: string;
  quote?: string;
  mediaCommentary?: string;
  realLifeInspiration?: string;
  imageUrl?: string;
  imageCaption?: string;
  portalName?: string;
  videoTeaserUrl?: string;
  authorName?: string;
  likesCount?: number;
  commentsCount?: number;
}

export interface Trophy {
  id: string;
  title: string;
  seasonYear: number;
  category: 'league' | 'cup' | 'individual';
  division?: Division;
  awardedTo: string;
}

export interface CommunityPack {
  id: string;
  title: string;
  author: string;
  description: string;
  version: string;
  clubs: Club[];
  updatedAt: string;
}

export type PlanTier = 'free' | 'pro';

// -------------------------------------------------------------
// PREMIAÇÕES DO FUTEBOL ESTILO BRASFOOT & THE BEST
// -------------------------------------------------------------
export interface AwardCandidate {
  rank: 1 | 2 | 3;
  name: string;
  clubName: string;
  clubPrimaryColor: string;
  clubSecondaryColor: string;
  clubShortName: string;
  statsLabel: string;
  votesPoints: number;
  isUser: boolean;
  avatarIcon?: string;
}

export interface SeasonAwards {
  year: number;
  worldBest: AwardCandidate[];    // Top 3 Bola de Ouro / The Best
  bestManager: AwardCandidate[];  // Top 3 Melhor Técnico do Ano
  bestYouth: AwardCandidate[];    // Top 3 Revelação da Base (Sub-20)
}

export interface ClubRankingItem {
  rank: number;
  clubId: string;
  clubName: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  division: Division;
  points: number;
  titlesCount: number;
  trend: 'up' | 'down' | 'same';
}

export interface EpicSkill {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  unlockCondition: string;
  inGameEffect: string;
  unlocked: boolean;
}

export interface TransferOffer {
  id: string;
  fromClubId: string;
  fromClubName: string;
  division: Division;
  primaryColor: string;
  secondaryColor: string;
  shortName: string;
  weeklyWageOffer: number;
  signingBonus: number; // Luvas financeiras
  contractDurationYears: number;
  roleOffered: string;
  reason: string;
}

export interface FanPost {
  id: string;
  authorHandle: string;
  authorName: string;
  avatarColor: string;
  content: string;
  sentiment: 'praise' | 'criticism' | 'funny' | 'hype';
  likes: number;
  retweets: number;
  isDerby?: boolean;
  createdAtWeek: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  category: 'carreira' | 'gols' | 'titulos' | 'selecao' | 'rival';
  description: string;
  bonusRankingPoints: number;
  unlocked: boolean;
  progress?: string;
}

export interface GameChallenge {
  id: string;
  title: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Lendário';
  badge: string;
  description: string;
  scenario: {
    division: Division;
    clubId: string;
    clubName: string;
    startingWeek: number;
    targetGoal: string;
    initialPoints: number;
    currentTablePosition: number;
  };
  rewardPoints: number;
  completed: boolean;
}

export interface GameState {
  mode: 'player' | 'manager';
  generation: number;      // 1 = personagem original, 2 = filho, etc.
  seasonYear: number;      // Ex: 2026
  currentWeek: number;     // 1 a 48 (calendário anual expandido)
  planTier: PlanTier;
  playerProfile?: PlayerCareerProfile;
  managerProfile?: ManagerCareerProfile;
  clubs: Record<string, Club>;
  leagues: Record<Division, League>;
  copaDoBrasil: CopaDoBrasil;
  sub20Tournament: Sub20Tournament;
  allFixtures: Fixture[];
  topScorers: Record<CompetitionType, TopScorer[]>;
  newsFeed: NewsItem[];
  trophies: Trophy[];
  isGuest: boolean;
  promotionModalOpen?: boolean;
  seasonSummaryModalOpen?: boolean;
  nationalTeamModalOpen?: boolean;
  pendingTransferOffer?: TransferOffer;
  pendingControversy?: ControversyEvent;
  controversyHistory?: AnsweredControversy[];
  pendingDilemma?: DilemmaEvent | null;
  dilemmaHistory?: { dilemmaId: string; optionId: string; week?: number; timestamp?: number; answeredAtWeek?: number; seasonYear?: number; }[];
  equippedBallId?: string;
  ownedBallIds?: string[];
  seasonAwardsHistory?: SeasonAwards[];
  clubRankings?: ClubRankingItem[];
  fanPostsFeed?: FanPost[];
  achievements?: AchievementBadge[];
  challenges?: GameChallenge[];
  soundMuted?: boolean;
  freeProTrialUsed?: boolean;
  lastRoundResult?: {
    week: number;
    userFixture?: Fixture;
    otherFixtures: Fixture[];
  };
  roundResultModalOpen?: boolean;
  onlineStats?: OnlineStats;
  lastSeasonSummary?: {
    year: number;
    champions: {
      serieA: string;
      serieB: string;
      serieC: string;
      serieD: string;
      copa: string;
      sub20: string;
    };
    promoted: Record<string, string[]>;
    relegated: Record<string, string[]>;
  };
  lastSavedAt?: string;
}

export interface OnlineStats {
  elo: number;
  division: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante' | 'Mestre';
  wins: number;
  losses: number;
  draws: number;
  matchHistory?: {
    id: string;
    opponentName: string;
    opponentClub: string;
    result: 'win' | 'loss' | 'draw';
    score: string;
    date: string;
    eloChange: number;
  }[];
}

export interface OnlineLeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  mode: 'player' | 'manager';
  trophies_count: number;
  points: number;
  club_name: string;
  season_year: number;
  is_pro?: boolean;
  overall?: number;
  updated_at: string;
}

export interface CommunityPackItem {
  id: string;
  author_id?: string;
  author_name?: string;
  name: string;
  description: string;
  downloads: number;
  likes: number;
  data: Record<string, Partial<Club>>;
  created_at: string;
  is_official?: boolean;
}
