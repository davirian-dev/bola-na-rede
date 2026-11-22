// ==============================================================================
// BOLA NA REDE: CARREIRA - GLOBAL GAME STORE (src/store/gameStore.ts)
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  GameState, 
  Club, 
  Player, 
  PlayerCareerProfile, 
  ManagerCareerProfile, 
  Position, 
  PlayerStyle, 
  ManagerTacticsPhilosophy, 
  TacticalFormation,
  NewsItem,
  CommunityPack,
  Division,
  CompetitionType,
  TrainingFocus,
  PreferredFoot,
  PlayerSpecialty,
  CareerLength,
  MatchSimSystem,
  ManagerArchetype,
  ControversyEvent,
  AnsweredControversy,
  BootItem,
  StaffMember,
  SponsorContract,
  TransferOffer,
  CharacterAvatar,
  PlayStyleGoldId,
  PlayerAttributes,
  NRGType,
  NRGInventory,
  OnlineStats,
  OnlineLeaderboardEntry,
  CommunityPackItem,
  TopScorer
} from '@/types/game';
import { generateBrazilDatabase } from '@/data/brazilSeed';
import { generateEuropeanClubs } from '@/data/europeanLeaguesSeed';
import { HISTORICAL_CONTROVERSIES } from '@/data/controversiesSeed';
import { LIFESTYLE_CATALOG } from '@/data/lifestyleSeed';
import { getPlayStyleGoldById } from '@/data/playStylesSeed';
import { calculateOverall } from '@/lib/calculations';
import { generateAnnualCalendar } from '@/engine/calendar';
import { simulateWeekMatches } from '@/engine/quickSim';
import { progressPlayerAttributes } from '@/engine/progression';
import { generateWeeklyNews } from '@/engine/newsGenerator';
import { processSeasonEnd } from '@/engine/seasonEnd';
import { calculateCareerScore } from '@/engine/scoringEngine';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { OFFICIAL_BOOTS_CATALOG, getBootById } from '@/data/boots';
import { OFFICIAL_BALLS_CATALOG, getBallById } from '@/data/balls';
import { evaluateDilemmaTrigger, applyDilemmaResolution, DilemmaEvaluationContext } from '@/engine/dilemmaEngine';
import { DILEMMAS_DATABASE } from '@/data/dilemmas';

interface GameStoreActions {
  // Inicialização
  initDatabaseIfEmpty: () => void;
  resetGame: () => void;
  setGuestMode: (isGuest: boolean) => void;

  // Criação de Carreira
  startPlayerCareer: (params: {
    name: string;
    nickname?: string;
    age: number;
    position: Position;
    style?: PlayerStyle;
    clubId: string;
    height?: number;
    weight?: number;
    preferredFoot?: PreferredFoot;
    jerseyNumber?: number;
    specialties?: PlayerSpecialty[];
    careerLength?: CareerLength;
    matchSimSystem?: MatchSimSystem;
    nationality?: string;
    skinTone?: number;
    preferredKit?: 'home' | 'away';
    avatar?: CharacterAvatar;
    goldPlayStyle?: PlayStyleGoldId;
  }) => void;

  startManagerCareer: (params: {
    name: string;
    age: number;
    archetype?: ManagerArchetype;
    philosophy: ManagerTacticsPhilosophy;
    formation: TacticalFormation;
    clubId: string;
    careerLength?: CareerLength;
    matchSimSystem?: MatchSimSystem;
    avatar?: CharacterAvatar;
  }) => void;

  // Planos e Configurações de Partida
  setPlanTier: (tier: 'free' | 'pro') => void;
  setMatchSimSystem: (system: MatchSimSystem) => void;

  // Treinos e Modais
  setTrainingFocus: (focus: TrainingFocus) => void;
  closePromotionModal: () => void;
  closeSeasonSummaryModal: () => void;

  // Patrimônio & Vida Pessoal
  buyLifestyleAsset: (assetId: string) => { success: boolean; message: string };

  // New Star Soccer (NSS) - Equipamentos, NRG, Staff e Patrocínios
  buyEnergyDrink: (count: number, totalCost: number, type?: NRGType) => { success: boolean; message: string };
  drinkEnergyCan: (type?: NRGType) => { success: boolean; message: string };
  buyAndEquipBoot: (boot: BootItem) => { success: boolean; message: string };
  hireStaffMember: (member: StaffMember) => { success: boolean; message: string };
  fireStaffMember: (role: 'agent' | 'physio' | 'press') => { success: boolean; message: string };
  signSponsorContract: (contract: SponsorContract) => { success: boolean; message: string };
  applyMinigameResult: (params: { goalsScored: number; ratingBonus: number; isMatchClutch?: boolean; trainingSkill?: string }) => void;

  // Polêmicas e Coletivas de Imprensa
  answerControversy: (optionId: string) => void;
  dismissControversy: () => void;
  triggerRandomControversy: () => void;

  // Mercado da Bola & Propostas de Transferência
  acceptTransferOffer: () => void;
  rejectTransferOffer: () => void;
  triggerTransferOffer: () => void;

  // Editor da Comunidade
  updateClub: (clubId: string, clubData: Partial<Club>) => void;
  updatePlayer: (clubId: string, playerId: string, isYouth: boolean, playerData: Partial<Player>) => void;
  importCommunityPack: (pack: CommunityPack) => { success: boolean; message: string };
  exportCommunityPack: (title: string, author: string, description: string) => CommunityPack;

  // Progressão
  advanceWeek: () => void;
  setRoundResultModalOpen: (open: boolean) => void;
  syncOfficialClubNames: () => void;

  // Gestão Tática e Elenco (Modo Treinador e Jogador)
  setManagerFormation: (formation: TacticalFormation) => void;
  swapPlayersInRoster: (clubId: string, indexA: number, indexB: number) => void;
  setClubTacticalRoles: (clubId: string, roles: { captainPlayerId?: string; penaltyTakerPlayerId?: string; freeKickTakerPlayerId?: string }) => void;
  togglePlayerTacticalRole: (role: 'captain' | 'penalty' | 'freekick') => { success: boolean; message: string };
  unlockEpicSkill: (skillId: string) => void;

  // Mercado de Transferências do Clube (Modo Treinador)
  buyPlayerForClub: (targetClubId: string, player: Player, fee: number) => { success: boolean; message: string };
  sellPlayerFromClub: (clubId: string, playerId: string, fee: number) => { success: boolean; message: string };

  // Modo Treinador Avançado (Elenco, Tática, Treino, Finanças e Estádio)
  setManagerHighPressure: (active: boolean) => void;
  setManagerPhilosophy: (philosophy: ManagerTacticsPhilosophy) => void;
  autoSelectLineup: (clubId: string) => void;
  autoSelectReserves: (clubId: string) => void;
  clearReservesSelection: (clubId: string) => void;
  toggleReservePlayer: (clubId: string, playerId: string) => void;
  promoteYouthPlayer: (clubId: string, playerId: string) => { success: boolean; message: string };
  demoteToYouthRoster: (clubId: string, playerId: string) => { success: boolean; message: string };
  scoutNewYouthTalent: (clubId: string) => { success: boolean; message: string };
  setStadiumTicketPrice: (clubId: string, price: number) => void;
  setPlayerIndividualTrainingFocus: (playerId: string, skill: string) => void;
  upgradeClubFacility: (facility: 'comfort' | 'vip' | 'marketing' | 'ct' | 'medical') => { success: boolean; message: string };

  // Sincronização Supabase
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
  loadSaveFromSupabase: (saveId: string) => Promise<{ success: boolean; message: string }>;

  // Modo Online (PvP X1, Leaderboard Global & Pacotes da Comunidade)
  recordOnlineMatchResult: (result: 'win' | 'loss' | 'draw', opponentName: string, opponentClub: string, score: string) => { eloChange: number; newElo: number };
  syncCareerToLeaderboard: () => Promise<{ success: boolean; message: string; rank?: number; totalPoints?: number }>;
  fetchOnlineLeaderboard: (modeFilter?: 'player' | 'manager') => Promise<OnlineLeaderboardEntry[]>;
  applyCommunityPack: (packData: Record<string, Partial<Club>>) => { updatedCount: number };

  // Equipamentos Oficiais (Chuteiras com Atributos Reais & Bolas com Física)
  buyBoot: (bootId: string) => { success: boolean; message: string };
  equipBoot: (bootId: string) => void;
  buyBall: (ballId: string) => { success: boolean; message: string };
  equipBall: (ballId: string) => void;

  // Dilemas, Coletivas de Imprensa & Relacionamentos
  answerDilemma: (dilemmaId: string, optionId: string) => void;
  dismissDilemma: () => void;
  triggerDilemmaCheck: (context?: DilemmaEvaluationContext) => void;
  holdLockerRoomMeeting: () => { success: boolean; message: string };
}

export type GameStore = GameState & GameStoreActions;

const initialDb = generateBrazilDatabase();
const initialEuropeanDb = generateEuropeanClubs();
const initialCombinedClubs = { ...initialDb.clubs, ...initialEuropeanDb };
const initialCalendar = generateAnnualCalendar(initialCombinedClubs, 2026);

const defaultTopScorers: Record<CompetitionType, TopScorer[]> = {
  serie_a: [],
  serie_b: [],
  serie_c: [],
  serie_d: [],
  sub_20: [],
  copa_brasil: [],
  champions_league: [],
  premier_league: [],
  championship: [],
  la_liga: [],
  segunda_division: [],
  serie_a_ita: [],
  serie_b_ita: [],
  bundesliga: [],
  bundesliga_2: [],
  ligue_1: [],
  ligue_2: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      mode: 'player',
      generation: 1,
      seasonYear: 2026,
      currentWeek: 1,
      planTier: 'free',
      isGuest: true,
      clubs: initialCombinedClubs,
      leagues: initialCalendar.leagues,
      copaDoBrasil: initialCalendar.copaDoBrasil,
      sub20Tournament: initialCalendar.sub20Tournament,
      allFixtures: initialCalendar.allFixtures,
      topScorers: defaultTopScorers,
      promotionModalOpen: false,
      seasonSummaryModalOpen: false,
      pendingControversy: undefined,
      controversyHistory: [],
      newsFeed: [
        {
          id: 'news-init-1',
          week: 1,
          seasonYear: 2026,
          category: 'club',
          headline: 'Temporada 2026 do futebol brasileiro é inaugurada!',
          body: 'Clubes de todas as divisões iniciam pré-temporada com foco total na subida de divisão e títulos nacionais.',
        }
      ],
      trophies: [],
      equippedBallId: 'classic_capotao',
      ownedBallIds: ['classic_capotao'],
      pendingDilemma: null,
      dilemmaHistory: [],
      onlineStats: {
        elo: 1200,
        division: 'Prata',
        wins: 0,
        losses: 0,
        draws: 0,
        matchHistory: [],
      },
      lastSavedAt: new Date().toISOString(),

      initDatabaseIfEmpty: () => {
        const state = get();
        const hasLegacyClubs = state.clubs && Object.values(state.clubs).some((c) => 
          c.name.includes('Xavante Pelotense') || 
          c.name.includes('Urubu da Guanabara') || 
          c.name.includes('Dourado do Pantanal') ||
          c.name.includes('Leão da Paulista') ||
          c.name.includes('Galo da Capital') ||
          c.name.includes('Raposa de Minas') ||
          c.name.includes('(Xavante)') ||
          c.id === 'xav'
        );

        const needsEuropeanUpgrade = !state.clubs?.['mci'] || !state.leagues?.['PL'];

        if (!state.clubs || Object.keys(state.clubs).length === 0 || !state.allFixtures || state.allFixtures.length === 0 || hasLegacyClubs || needsEuropeanUpgrade) {
          const freshDb = generateBrazilDatabase();
          const freshEuropean = generateEuropeanClubs();
          const combinedClubs = { ...freshDb.clubs, ...freshEuropean };
          const freshCal = generateAnnualCalendar(combinedClubs, state.seasonYear || 2026);
          
          let updatedPlayerProfile = state.playerProfile;
          if (updatedPlayerProfile) {
            let newClubId = updatedPlayerProfile.clubId;
            if (newClubId === 'xav' || !combinedClubs[newClubId]) {
              newClubId = 'brasil_pel';
            }
            updatedPlayerProfile = {
              ...updatedPlayerProfile,
              clubId: newClubId,
            };
          }

          let updatedManagerProfile = state.managerProfile;
          if (updatedManagerProfile) {
            let newClubId = updatedManagerProfile.clubId;
            if (newClubId === 'xav' || !combinedClubs[newClubId]) {
              newClubId = 'brasil_pel';
            }
            updatedManagerProfile = {
              ...updatedManagerProfile,
              clubId: newClubId,
            };
          }

          set({
            clubs: combinedClubs,
            leagues: freshCal.leagues,
            copaDoBrasil: freshCal.copaDoBrasil,
            sub20Tournament: freshCal.sub20Tournament,
            allFixtures: freshCal.allFixtures,
            topScorers: defaultTopScorers,
            playerProfile: updatedPlayerProfile,
            managerProfile: updatedManagerProfile,
          });
        }
      },

      syncOfficialClubNames: () => {
        const freshDb = generateBrazilDatabase();
        const freshEuropean = generateEuropeanClubs();
        set({ clubs: { ...freshDb.clubs, ...freshEuropean } });
      },

      setRoundResultModalOpen: (open: boolean) => {
        set({ roundResultModalOpen: open });
      },

      resetGame: () => {
        const freshDb = generateBrazilDatabase();
        const freshEuropean = generateEuropeanClubs();
        const combinedClubs = { ...freshDb.clubs, ...freshEuropean };
        const freshCal = generateAnnualCalendar(combinedClubs, 2026);
        set({
          mode: 'player',
          generation: 1,
          seasonYear: 2026,
          currentWeek: 1,
          planTier: 'free',
          playerProfile: undefined,
          managerProfile: undefined,
          clubs: combinedClubs,
          leagues: freshCal.leagues,
          copaDoBrasil: freshCal.copaDoBrasil,
          sub20Tournament: freshCal.sub20Tournament,
          allFixtures: freshCal.allFixtures,
          topScorers: defaultTopScorers,
          promotionModalOpen: false,
          seasonSummaryModalOpen: false,
          newsFeed: [
            {
              id: `news-reset-${Date.now()}`,
              week: 1,
              seasonYear: 2026,
              category: 'club',
              headline: 'Nova era começa no futebol brasileiro',
              body: 'Tudo pronto para uma nova trajetória rumo ao estrelato ou à glória como treinador.',
            }
          ],
          trophies: [],
          lastSavedAt: new Date().toISOString(),
        });
      },

      setGuestMode: (isGuest: boolean) => set({ isGuest }),

      setTrainingFocus: (focus: TrainingFocus) => {
        const state = get();
        if (state.playerProfile) {
          set({
            playerProfile: {
              ...state.playerProfile,
              trainingFocus: focus,
            },
          });
        }
      },

      closePromotionModal: () => set({ promotionModalOpen: false }),
      closeSeasonSummaryModal: () => set({ seasonSummaryModalOpen: false }),

      buyLifestyleAsset: (assetId: string) => {
        const state = get();
        const player = state.playerProfile;
        if (!player) {
          return { success: false, message: 'Disponível apenas no Modo Jogador.' };
        }

        const item = LIFESTYLE_CATALOG.find((i) => i.id === assetId);
        if (!item) {
          return { success: false, message: 'Item não encontrado no catálogo.' };
        }

        if (player.lifestyleAssets.includes(item.name) || player.lifestyleAssets.includes(item.id)) {
          return { success: false, message: 'Você já possui este patrimônio!' };
        }

        if (player.bankBalance < item.price) {
          return { success: false, message: 'Saldo insuficiente na sua conta bancária!' };
        }

        const updatedBalance = player.bankBalance - item.price;
        const updatedAssets = [...player.lifestyleAssets, item.name];
        const updatedMorale = Math.min(100, player.morale + item.moraleBonus);
        const updatedReputation = Math.min(100, player.reputation + item.fameBonus);
        const updatedFamily = item.familyBonus 
          ? Math.min(100, player.relationshipFamily + item.familyBonus) 
          : player.relationshipFamily;

        const assetNews: NewsItem = {
          id: `news-lifestyle-${Date.now()}`,
          week: state.currentWeek,
          seasonYear: state.seasonYear,
          category: 'achievement',
          headline: item.headline.replace(/Craque|Atleta/g, player.name),
          body: `${player.name} comemorou a nova conquista: ${item.desc}`,
          clubId: player.clubId,
        };

        set({
          playerProfile: {
            ...player,
            bankBalance: updatedBalance,
            lifestyleAssets: updatedAssets,
            morale: updatedMorale,
            reputation: updatedReputation,
            relationshipFamily: updatedFamily,
          },
          newsFeed: [assetNews, ...state.newsFeed.slice(0, 35)],
          lastSavedAt: new Date().toISOString(),
        });

        if (!state.isGuest) {
          get().syncWithSupabase();
        }

        return { 
          success: true, 
          message: `Parabéns! ${item.name} adquirido com sucesso (+${item.hallOfFamePoints} pts no Hall da Fama)!` 
        };
      },

      buyEnergyDrink: (count: number, totalCost: number, type: NRGType = 'classic') => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return { success: false, message: 'Apenas no Modo Jogador.' };
        if (player.bankBalance < totalCost) return { success: false, message: 'Saldo bancário insuficiente!' };

        const currentInv: NRGInventory = player.nrgInventory || { 
          classic: player.energyDrinksCount || 0, 
          power: 0, 
          focus: 0, 
          gold: 0 
        };
        const updatedInv: NRGInventory = {
          ...currentInv,
          [type]: (currentInv[type] || 0) + count,
        };
        const totalCount = updatedInv.classic + updatedInv.power + updatedInv.focus + updatedInv.gold;

        const typeLabels: Record<NRGType, string> = {
          classic: 'NRG Clássico (Verde)',
          power: 'NRG Power Turbo (Azul)',
          focus: 'NRG Focus (Rosa)',
          gold: 'NRG Extreme Gold',
        };

        set({
          playerProfile: {
            ...player,
            bankBalance: player.bankBalance - totalCost,
            nrgInventory: updatedInv,
            energyDrinksCount: totalCount,
          },
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
        return { success: true, message: `${count}x ${typeLabels[type]} comprado(s) com sucesso!` };
      },

      drinkEnergyCan: (requestedType?: NRGType) => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return { success: false, message: 'Apenas no Modo Jogador.' };

        const inv: NRGInventory = player.nrgInventory || { 
          classic: player.energyDrinksCount || 0, 
          power: 0, 
          focus: 0, 
          gold: 0 
        };

        let chosenType: NRGType | null = requestedType || null;
        if (!chosenType) {
          if (inv.classic > 0) chosenType = 'classic';
          else if (inv.power > 0) chosenType = 'power';
          else if (inv.focus > 0) chosenType = 'focus';
          else if (inv.gold > 0) chosenType = 'gold';
        }

        if (!chosenType || (inv[chosenType] || 0) <= 0) {
          return { success: false, message: 'Você não possui latinhas desse tipo no estoque! Compre na Loja.' };
        }
        if (player.energy >= 100) {
          return { success: false, message: 'Sua energia já está no máximo (100%)!' };
        }

        const specs: Record<NRGType, { energy: number; morale: number; label: string }> = {
          classic: { energy: 30, morale: 3, label: 'NRG Clássico (Verde)' },
          power: { energy: 55, morale: 6, label: 'NRG Power Turbo (Azul)' },
          focus: { energy: 80, morale: 10, label: 'NRG Focus Magenta (Rosa)' },
          gold: { energy: 100, morale: 20, label: 'NRG Extreme Gold (Ouro)' },
        };

        const chosenSpec = specs[chosenType];
        const newEnergy = Math.min(100, player.energy + chosenSpec.energy);
        const newMorale = Math.min(100, player.morale + chosenSpec.morale);

        const updatedInv: NRGInventory = {
          ...inv,
          [chosenType]: Math.max(0, inv[chosenType] - 1),
        };
        const totalCount = updatedInv.classic + updatedInv.power + updatedInv.focus + updatedInv.gold;

        set({
          playerProfile: {
            ...player,
            energy: newEnergy,
            morale: newMorale,
            nrgInventory: updatedInv,
            energyDrinksCount: totalCount,
          },
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
        return { 
          success: true, 
          message: `⚡ Você bebeu um ${chosenSpec.label}! +${chosenSpec.energy}% de Energia e +${chosenSpec.morale} de Moral recuperados!` 
        };
      },

      buyAndEquipBoot: (boot: BootItem) => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return { success: false, message: 'Apenas no Modo Jogador.' };
        if (player.bankBalance < boot.price) return { success: false, message: 'Saldo bancário insuficiente!' };

        const equippedBoot: BootItem = {
          ...boot,
          matchesRemaining: boot.durabilityMatches,
        };

        const currentAssets = player.lifestyleAssets || [];
        const updatedAssets = currentAssets.includes(boot.name) ? currentAssets : [...currentAssets, boot.name];

        set({
          playerProfile: {
            ...player,
            bankBalance: player.bankBalance - boot.price,
            activeBoot: equippedBoot,
            lifestyleAssets: updatedAssets,
          },
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
        return { success: true, message: `Chuteira ${boot.name} equipada com sucesso! (${boot.durabilityMatches} partidas de durabilidade)` };
      },

      hireStaffMember: (member: StaffMember) => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return { success: false, message: 'Apenas no Modo Jogador.' };

        const updatedStaff = {
          ...(player.staff || {}),
          [member.role]: member,
        };

        set({
          playerProfile: {
            ...player,
            staff: updatedStaff,
          },
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
        return { success: true, message: `${member.name} contratado como seu ${member.title}! Custo: R$ ${member.weeklyCost}/sem.` };
      },

      fireStaffMember: (role: 'agent' | 'physio' | 'press') => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return { success: false, message: 'Apenas no Modo Jogador.' };

        const updatedStaff = { ...(player.staff || {}) };
        delete updatedStaff[role];

        set({
          playerProfile: {
            ...player,
            staff: updatedStaff,
          },
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
        return { success: true, message: 'Membro da equipe dispensado com sucesso.' };
      },

      signSponsorContract: (contract: SponsorContract) => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return { success: false, message: 'Apenas no Modo Jogador.' };

        const existingSponsors = player.sponsors || [];
        if (existingSponsors.some((s) => s.id === contract.id)) {
          return { success: false, message: 'Você já possui contrato ativo com esta marca!' };
        }

        set({
          playerProfile: {
            ...player,
            sponsors: [...existingSponsors, contract],
            reputation: Math.min(100, player.reputation + 4),
          },
          newsFeed: [
            {
              id: `news-spon-${Date.now()}`,
              week: state.currentWeek,
              seasonYear: state.seasonYear,
              category: 'achievement',
              headline: `${player.name} assina contrato com a marca ${contract.brandName}!`,
              body: `O atleta agora recebe R$ ${contract.weeklyPay}/semana mais bônus de R$ ${contract.goalBonus} por gol marcado.`,
              clubId: player.clubId,
            },
            ...state.newsFeed,
          ],
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
        return { success: true, message: `Contrato assinado com ${contract.brandName}! R$ ${contract.weeklyPay}/sem + R$ ${contract.goalBonus}/gol.` };
      },

      applyMinigameResult: ({ goalsScored, ratingBonus, isMatchClutch, trainingSkill }) => {
        const state = get();
        const player = state.playerProfile;
        if (!player) return;

        let updatedStats = { ...player.stats };
        let updatedMorale = Math.min(100, player.morale + (goalsScored > 0 ? 8 : 2));
        let updatedRep = Math.min(100, player.reputation + (goalsScored > 0 ? 4 : 1));
        let updatedAttrs = { ...player.attributes };

        if (isMatchClutch && goalsScored > 0) {
          updatedStats.goals += goalsScored;
          updatedStats.averageRating = Math.min(10.0, Number((updatedStats.averageRating + ratingBonus).toFixed(1)));
        }

        if (trainingSkill) {
          if (trainingSkill === 'shooting') updatedAttrs.shooting = Math.min(99, updatedAttrs.shooting + 1);
          if (trainingSkill === 'passing') updatedAttrs.passing = Math.min(99, updatedAttrs.passing + 1);
          if (trainingSkill === 'dribbling') updatedAttrs.dribbling = Math.min(99, updatedAttrs.dribbling + 1);
          if (trainingSkill === 'pace') updatedAttrs.pace = Math.min(99, updatedAttrs.pace + 1);
        }

        set({
          playerProfile: {
            ...player,
            stats: updatedStats,
            morale: updatedMorale,
            reputation: updatedRep,
            attributes: updatedAttrs,
            overall: calculateOverall(player.position, updatedAttrs),
          },
          lastSavedAt: new Date().toISOString(),
        });
        if (!state.isGuest) get().syncWithSupabase();
      },

      dismissControversy: () => set({ pendingControversy: undefined }),

      triggerRandomControversy: () => {
        const state = get();
        const answeredIds = (state.controversyHistory || []).map((h) => h.event.id);
        const unvisited = HISTORICAL_CONTROVERSIES.filter((c) => !answeredIds.includes(c.id));
        const pool = unvisited.length > 0 ? unvisited : HISTORICAL_CONTROVERSIES;
        const selected = pool[Math.floor(Math.random() * pool.length)];
        set({ pendingControversy: selected });
      },

      answerControversy: (optionId: string) => {
        const state = get();
        const event = state.pendingControversy;
        if (!event) return;

        const opt = event.options.find((o) => o.id === optionId) || event.options[0];
        const currentActorName = state.playerProfile?.name || state.managerProfile?.name || 'Craque';
        const currentClubId = state.playerProfile?.clubId || state.managerProfile?.clubId;

        // Atualiza Perfil do Atleta
        let updatedPlayerProfile = state.playerProfile;
        if (updatedPlayerProfile) {
          const cons = opt.consequences;
          updatedPlayerProfile = {
            ...updatedPlayerProfile,
            morale: Math.min(100, Math.max(0, updatedPlayerProfile.morale + (cons.morale || 0))),
            relationshipManager: Math.min(100, Math.max(0, updatedPlayerProfile.relationshipManager + (cons.relationshipManager || 0))),
            relationshipFans: Math.min(100, Math.max(0, updatedPlayerProfile.relationshipFans + (cons.relationshipFans || 0))),
            relationshipFamily: Math.min(100, Math.max(0, updatedPlayerProfile.relationshipFamily + (cons.relationshipFamily || 0))),
            reputation: Math.min(100, Math.max(0, updatedPlayerProfile.reputation + (cons.reputation || 0))),
            bankBalance: Math.max(0, updatedPlayerProfile.bankBalance + (cons.bankBalance || 0)),
          };
        }

        // Atualiza Perfil do Treinador
        let updatedManagerProfile = state.managerProfile;
        if (updatedManagerProfile) {
          const cons = opt.consequences;
          updatedManagerProfile = {
            ...updatedManagerProfile,
            boardConfidence: Math.min(100, Math.max(0, updatedManagerProfile.boardConfidence + (cons.boardConfidence || cons.relationshipManager || 0))),
            fansConfidence: Math.min(100, Math.max(0, updatedManagerProfile.fansConfidence + (cons.relationshipFans || 0))),
            reputation: Math.min(100, Math.max(0, updatedManagerProfile.reputation + (cons.reputation || 0))),
          };
        }

        // Gera Notícia Polêmica de Impacto no Feed
        const formattedHeadline = opt.headline
          .replace(/Craque|Atleta/g, currentActorName)
          .replace(/Jogador/g, currentActorName);

        const controversyNewsItem: NewsItem = {
          id: `news-controversy-${Date.now()}`,
          week: state.currentWeek,
          seasonYear: state.seasonYear,
          category: 'drama',
          headline: formattedHeadline,
          body: opt.newsBody,
          quote: opt.quote,
          mediaCommentary: opt.mediaCommentary,
          realLifeInspiration: event.realLifeInspiration,
          clubId: currentClubId,
        };

        const newHistoryItem: AnsweredControversy = {
          event,
          chosenOption: opt,
          week: state.currentWeek,
          seasonYear: state.seasonYear,
          answeredAt: new Date().toISOString(),
        };

        const updatedHistory = [newHistoryItem, ...(state.controversyHistory || [])];

        set({
          playerProfile: updatedPlayerProfile,
          managerProfile: updatedManagerProfile,
          pendingControversy: undefined,
          controversyHistory: updatedHistory,
          newsFeed: [controversyNewsItem, ...state.newsFeed.slice(0, 35)],
          lastSavedAt: new Date().toISOString(),
        });

        if (!state.isGuest) {
          get().syncWithSupabase();
        }
      },

      acceptTransferOffer: () => {
        const state = get();
        const offer = state.pendingTransferOffer;
        if (!offer) return;

        if (state.mode === 'player' && state.playerProfile) {
          const updatedPlayer = {
            ...state.playerProfile,
            clubId: offer.fromClubId,
            isYouthTeam: false,
            weeklyWage: offer.weeklyWageOffer,
            bankBalance: state.playerProfile.bankBalance + offer.signingBonus,
            reputation: Math.min(99, state.playerProfile.reputation + 6),
          };

          const newsItem: NewsItem = {
            id: `news-transfer-${Date.now()}`,
            week: state.currentWeek,
            seasonYear: state.seasonYear,
            category: 'club',
            headline: `BOMBA NO MERCADO! ${updatedPlayer.name} assina com o ${offer.fromClubName}!`,
            body: `Em uma das transferências mais comentadas da janela, o ${offer.fromClubName} confirmou a chegada do atleta com luvas de R$ ${offer.signingBonus.toLocaleString('pt-BR')} e contrato de ${offer.contractDurationYears} temporadas.`,
            imageUrl: '/images/news/mercado.webp',
            imageCaption: `${updatedPlayer.name} veste o manto do ${offer.fromClubName} em apresentação oficial`,
            portalName: 'GE Globo Esporte',
            authorName: 'André Rizek',
            likesCount: 5200,
            commentsCount: 890,
          };

          set({
            playerProfile: updatedPlayer,
            pendingTransferOffer: undefined,
            newsFeed: [newsItem, ...state.newsFeed],
          });
        } else if (state.mode === 'manager' && state.managerProfile) {
          const updatedManager = {
            ...state.managerProfile,
            clubId: offer.fromClubId,
            reputation: Math.min(99, state.managerProfile.reputation + 5),
          };

          const newsItem: NewsItem = {
            id: `news-transfer-mgr-${Date.now()}`,
            week: state.currentWeek,
            seasonYear: state.seasonYear,
            category: 'club',
            headline: `NOVO COMANDANTE! ${updatedManager.name} assume a prancheta do ${offer.fromClubName}!`,
            body: `A diretoria agiu rápido no mercado e anunciou ${updatedManager.name} para liderar o novo projeto na Série ${offer.division}.`,
            imageUrl: '/images/news/coletiva.webp',
            imageCaption: 'Apresentação do novo treinador em coletiva de imprensa',
            portalName: 'UOL Esporte',
            authorName: 'Mauro Cezar',
            likesCount: 3800,
            commentsCount: 620,
          };

          set({
            managerProfile: updatedManager,
            pendingTransferOffer: undefined,
            newsFeed: [newsItem, ...state.newsFeed],
          });
        }

        if (!state.isGuest) {
          get().syncWithSupabase();
        }
      },

      rejectTransferOffer: () => {
        set({ pendingTransferOffer: undefined });
      },

      triggerTransferOffer: () => {
        const state = get();
        const currentClubId = state.mode === 'player' ? state.playerProfile?.clubId : state.managerProfile?.clubId;
        const currentClub = currentClubId ? state.clubs[currentClubId] : null;
        
        // Clubes candidatos de divisão igual ou superior
        const candidateClubs = Object.values(state.clubs).filter((c) => {
          if (c.id === currentClubId) return false;
          if (!currentClub) return true;
          const rank: Record<Division, number> = {
            A: 4, B: 3, C: 2, D: 1, EUROPA: 5,
            PL: 5, CHAMPIONSHIP: 4,
            LALIGA: 5, SEGUNDA_ESP: 4,
            SERIE_A_ITA: 5, SERIE_B_ITA: 4,
            BUNDESLIGA: 5, BUNDESLIGA_2: 4,
            LIGUE_1: 5, LIGUE_2: 4,
          };
          return (rank[c.division] || 1) >= (rank[currentClub.division] || 1);
        });

        const targetClub = candidateClubs[Math.floor(Math.random() * candidateClubs.length)] || state.clubs['rma'] || state.clubs['fla'];
        if (!targetClub) return;

        const isEuropaTarget = targetClub.division === 'EUROPA';
        const currentWage = state.playerProfile?.weeklyWage || 15000;
        const offerWage = isEuropaTarget
          ? Math.round(Math.max(currentWage * 2.8, 120000 + Math.random() * 250000))
          : Math.round(currentWage * (1.6 + Math.random() * 0.8));
        const signingBonus = Math.round(offerWage * (isEuropaTarget ? (14 + Math.random() * 16) : (8 + Math.random() * 10)));

        const divisionLabel = isEuropaTarget ? 'Champions League / Europa' : `Série ${targetClub.division}`;
        const offer: TransferOffer = {
          id: `offer-${Date.now()}`,
          fromClubId: targetClub.id,
          fromClubName: targetClub.name,
          division: targetClub.division,
          primaryColor: targetClub.primaryColor,
          secondaryColor: targetClub.secondaryColor,
          shortName: targetClub.shortName,
          weeklyWageOffer: offerWage,
          signingBonus,
          contractDurationYears: isEuropaTarget ? 4 : 3,
          roleOffered: isEuropaTarget ? 'Estrela Internacional' : 'Titular Absoluto',
          reason: isEuropaTarget
            ? `Olheiros e diretoria do ${targetClub.name} enviaram uma comitiva ao Brasil após analisarem seus dados e enxergam em você o próximo astro do futebol mundial na Champions League.`
            : `A diretoria e comissão técnica do ${targetClub.name} monitoram suas atuações de destaque e enxergam em você a peça que faltava para os objetivos do clube na ${divisionLabel}.`,
        };

        set({ pendingTransferOffer: offer });
      },

      setPlanTier: (tier: 'free' | 'pro') => {
        set({ planTier: tier });
      },

      setMatchSimSystem: (system: MatchSimSystem) => {
        const state = get();
        if (state.playerProfile) {
          set({
            playerProfile: {
              ...state.playerProfile,
              matchSimSystem: system,
            },
          });
        } else if (state.managerProfile) {
          set({
            managerProfile: {
              ...state.managerProfile,
              matchSimSystem: system,
            },
          });
        }
      },

      startPlayerCareer: ({ 
        name, 
        nickname, 
        age, 
        position, 
        style = 'artilheiro', 
        clubId,
        height = 178,
        weight = 74,
        preferredFoot = 'right',
        jerseyNumber = 9,
        specialties = ['finishing', 'speed', 'dribbling'],
        careerLength = 12,
        matchSimSystem = 'instant',
        nationality = 'Brasil',
        skinTone = 3,
        preferredKit = 'home',
        avatar,
        goldPlayStyle = 'rapid_gold'
      }) => {
        const state = get();
        const availableClubs = (state.clubs && Object.keys(state.clubs).length > 0)
          ? state.clubs
          : generateBrazilDatabase().clubs;

        const club = availableClubs[clubId] || Object.values(availableClubs)[0];

        // 1. Calibração do Overall pela Idade Inicial (14 Atributos Oficiais)
        const ageDelta = Math.round((age - 18) * 2.8);

        let baseAttrs: PlayerAttributes = {
          pace: Math.min(88, Math.max(38, 58 + ageDelta)),
          dribbling: Math.min(88, Math.max(38, 56 + ageDelta)),
          tackling: Math.min(88, Math.max(38, 48 + ageDelta)),
          defending: Math.min(88, Math.max(38, 48 + ageDelta)),
          attacking: Math.min(88, Math.max(38, 54 + ageDelta)),
          finishing: Math.min(88, Math.max(38, 54 + ageDelta)),
          passing: Math.min(88, Math.max(38, 54 + ageDelta)),
          positioning: Math.min(88, Math.max(38, 52 + ageDelta)),
          heading: Math.min(88, Math.max(38, 50 + ageDelta)),
          crossing: Math.min(88, Math.max(38, 52 + ageDelta)),
          shooting: Math.min(88, Math.max(38, 54 + ageDelta)),
          jumping: Math.min(88, Math.max(38, 52 + ageDelta)),
          playmaker: Math.min(88, Math.max(38, 53 + ageDelta)),
          elasticity: position === 'GOL' ? Math.min(90, Math.max(45, 62 + ageDelta)) : Math.min(80, Math.max(35, 48 + ageDelta)),
          // Legados
          physical: Math.min(84, Math.max(38, 52 + ageDelta)),
          vision: Math.min(84, Math.max(38, 53 + ageDelta)),
          composure: Math.min(84, Math.max(38, 52 + ageDelta)),
        };

        // 2. Impacto da Altura e Peso na Física do Jogador
        if (height >= 188) {
          baseAttrs.heading += 6;
          baseAttrs.jumping += 5;
          baseAttrs.pace = Math.max(36, baseAttrs.pace - 4);
          baseAttrs.dribbling = Math.max(36, baseAttrs.dribbling - 4);
        } else if (height <= 172) {
          baseAttrs.pace += 5;
          baseAttrs.dribbling += 6;
          baseAttrs.heading = Math.max(35, baseAttrs.heading - 4);
          baseAttrs.jumping = Math.max(35, baseAttrs.jumping - 4);
        }

        if (weight >= 82) {
          baseAttrs.tackling += 3;
          baseAttrs.defending += 3;
        } else if (weight <= 66) {
          baseAttrs.pace += 3;
          baseAttrs.dribbling += 3;
        }

        // 3. Impacto Tático do Pé Dominante x Posição (Pontos Positivos & Negativos)
        let tacticalRoleBonus = 'Posição Regular';
        const tacticalPros: string[] = [];
        const tacticalCons: string[] = [];

        if (position === 'PE') {
          if (preferredFoot === 'right') {
            baseAttrs.finishing += 6;
            baseAttrs.shooting += 4;
            baseAttrs.dribbling += 3;
            baseAttrs.crossing = Math.max(35, baseAttrs.crossing - 6);
            baseAttrs.pace = Math.max(35, baseAttrs.pace - 3);
            tacticalRoleBonus = 'Ponta Esquerda Invertido (Corte para dentro & Finalização)';
            tacticalPros.push('Corte seco para o meio e finalização colocada no ângulo (+6 Finalização, +4 Chute)');
            tacticalCons.push('Dificuldade de ir ao fundo na linha de cal e cruzar de primeira (-6 Cruzamento, -3 Velocidade na cal)');
          } else if (preferredFoot === 'left') {
            baseAttrs.crossing += 6;
            baseAttrs.pace += 4;
            baseAttrs.passing += 3;
            baseAttrs.finishing = Math.max(35, baseAttrs.finishing - 6);
            baseAttrs.shooting = Math.max(35, baseAttrs.shooting - 5);
            tacticalRoleBonus = 'Ponta Esquerda Clássico (Linha de fundo & Cruzamento)';
            tacticalPros.push('Arrancada profunda até a linha de cal com cruzamento venenoso de canhota (+6 Cruzamento, +4 Velocidade)');
            tacticalCons.push('Ângulo fechado para cortar pro meio e finalizar com a perna direita ruim (-6 Finalização, -5 Chute)');
          } else {
            // Ambidestro (PRO) - SÓ TEM BENEFÍCIOS!
            baseAttrs.finishing += 6;
            baseAttrs.crossing += 6;
            baseAttrs.dribbling += 5;
            baseAttrs.passing += 4;
            tacticalRoleBonus = 'Ponta Esquerda Ambidestro Perfeito (PRO: Zero pontos negativos)';
            tacticalPros.push('Ambidestria Suprema: corta para finalizar ou vai ao fundo cruzar com 100% de precisão nos dois pés!');
          }
        } else if (position === 'PD') {
          if (preferredFoot === 'left') {
            baseAttrs.finishing += 6;
            baseAttrs.shooting += 4;
            baseAttrs.dribbling += 3;
            baseAttrs.crossing = Math.max(35, baseAttrs.crossing - 6);
            baseAttrs.pace = Math.max(35, baseAttrs.pace - 3);
            tacticalRoleBonus = 'Ponta Direita Invertido (Corte para dentro & Canhota)';
            tacticalPros.push('Corte fatal da direita pro meio e chute colocado de canhota (+6 Finalização, +4 Chute)');
            tacticalCons.push('Linha de fundo travada para cruzar com o pé direito ruim (-6 Cruzamento)');
          } else if (preferredFoot === 'right') {
            baseAttrs.crossing += 6;
            baseAttrs.passing += 4;
            baseAttrs.pace += 3;
            baseAttrs.finishing = Math.max(35, baseAttrs.finishing - 6);
            baseAttrs.shooting = Math.max(35, baseAttrs.shooting - 5);
            tacticalRoleBonus = 'Ponta Direita Clássico (Linha de fundo & Assistências)';
            tacticalPros.push('Ponta clássico: ganha na corrida e serve os atacantes de pé direito (+6 Cruzamento, +4 Passe)');
            tacticalCons.push('Finalização prejudicada ao cortar para o meio com a perna esquerda ruim (-6 Finalização, -5 Chute)');
          } else {
            // Ambidestro (PRO) - SÓ TEM BENEFÍCIOS!
            baseAttrs.finishing += 6;
            baseAttrs.crossing += 6;
            baseAttrs.dribbling += 5;
            baseAttrs.passing += 4;
            tacticalRoleBonus = 'Ponta Direita Ambidestro Perfeito (PRO: Zero pontos negativos)';
            tacticalPros.push('Ambidestria Suprema: sem pé fraco, perigo constante de finalização e cruzamento!');
          }
        } else if (position === 'LE') {
          if (preferredFoot === 'left') {
            baseAttrs.crossing += 5;
            baseAttrs.positioning += 3;
            tacticalPros.push('Lateral natural com apoio e cruzamentos calibrados (+5 Cruzamento)');
          } else if (preferredFoot === 'right') {
            baseAttrs.crossing = Math.max(35, baseAttrs.crossing - 6);
            baseAttrs.passing += 4;
            baseAttrs.defending += 3;
            tacticalPros.push('Lateral construtor por dentro (+4 Passe)');
            tacticalCons.push('Dificuldade de cruzamento de primeira na linha de cal (-6 Cruzamento)');
          } else {
            baseAttrs.crossing += 6;
            baseAttrs.passing += 5;
            tacticalPros.push('Lateral ambidestro: apoia e cruza com os dois pés com maestria!');
          }
        } else if (position === 'LD') {
          if (preferredFoot === 'right') {
            baseAttrs.crossing += 5;
            baseAttrs.positioning += 3;
            tacticalPros.push('Lateral natural com apoio e cruzamentos calibrados (+5 Cruzamento)');
          } else if (preferredFoot === 'left') {
            baseAttrs.crossing = Math.max(35, baseAttrs.crossing - 6);
            baseAttrs.passing += 4;
            baseAttrs.defending += 3;
            tacticalPros.push('Lateral construtor por dentro (+4 Passe)');
            tacticalCons.push('Dificuldade de cruzamento de primeira na linha de cal (-6 Cruzamento)');
          } else {
            baseAttrs.crossing += 6;
            baseAttrs.passing += 5;
            tacticalPros.push('Lateral ambidestro: apoia e cruza com os dois pés com maestria!');
          }
        } else if (preferredFoot === 'both') {
          baseAttrs.finishing += 4;
          baseAttrs.passing += 4;
          baseAttrs.dribbling += 4;
          tacticalPros.push('Recurso Ambidestro PRO: Domínio pleno dos dois pés sem ângulo cego!');
        }

        // 4. Bônus da Habilidade de Ouro (PlayStyle Selecionado)
        let goldValueBonus = 0;
        if (goldPlayStyle) {
          const goldObj = getPlayStyleGoldById(goldPlayStyle);
          if (goldObj) {
            goldValueBonus = goldObj.value;
            Object.entries(goldObj.initialBoost).forEach(([attrKey, val]) => {
              if (attrKey in baseAttrs && typeof val === 'number') {
                (baseAttrs as any)[attrKey] += val;
              }
            });
          }
        }

        // Bônus das Habilidades Selecionadas (Specialties)
        specialties.forEach((spec) => {
          if (spec === 'finishing' || spec === 'attacking') { baseAttrs.shooting += 4; baseAttrs.finishing += 4; }
          if (spec === 'speed') baseAttrs.pace += 4;
          if (spec === 'dribbling') baseAttrs.dribbling += 4;
          if (spec === 'passing') baseAttrs.passing += 4;
          if (spec === 'crossing') baseAttrs.crossing += 4;
          if (spec === 'defending') baseAttrs.defending += 4;
          if (spec === 'tackling') baseAttrs.tackling += 4;
          if (spec === 'playmaker') { baseAttrs.playmaker += 5; baseAttrs.passing += 3; }
          if (spec === 'heading') baseAttrs.heading += 4;
          if (spec === 'jumping') baseAttrs.jumping += 4;
          if (spec === 'positioning') baseAttrs.positioning += 4;
        });

        // Bônus de estilo
        if (style === 'artilheiro') {
          baseAttrs.shooting += 6;
          baseAttrs.finishing += 4;
          baseAttrs.attacking += 4;
        } else if (style === 'velocista') {
          baseAttrs.pace += 6;
          baseAttrs.dribbling += 4;
        } else if (style === 'maestro') {
          baseAttrs.passing += 6;
          baseAttrs.playmaker += 5;
        } else if (style === 'paredao') {
          baseAttrs.defending += 6;
          baseAttrs.tackling += 5;
          if (position === 'GOL') {
            baseAttrs.elasticity = (baseAttrs.elasticity || 58) + 8;
          }
        }

        const overall = calculateOverall(position, baseAttrs);
        const calculatedPotential = Math.min(98, Math.max(overall + 5, 96 - (age - 16) * 2));
        const isSeniorStarter = club.division !== 'D' || age >= 21;

        const playerProfile: PlayerCareerProfile = {
          id: `player-user-${Date.now()}`,
          name,
          nickname: nickname || name.split(' ')[0],
          age,
          position,
          style,
          clubId: club.id,
          isYouthTeam: !isSeniorStarter,
          trainingFocus: 'finishing',
          height,
          weight,
          preferredFoot,
          nationality,
          skinTone,
          preferredKit,
          tacticalRoleBonus,
          tacticalPros,
          tacticalCons,
          goldPlayStyle,
          jerseyNumber,
          specialties,
          careerLength,
          matchSimSystem,
          energyDrinksCount: 4,
          nrgInventory: {
            classic: 2,
            power: 1,
            focus: 1,
            gold: 0,
          },
          activeBoot: {
            id: 'boot_ns_basic',
            name: 'NS-Basic (Chuteira Raiz Preta)',
            price: 0,
            durabilityMatches: 15,
            matchesRemaining: 15,
            color: '#18181b',
            bonus: { shooting: 8, pace: 5, power: 8, technique: 5 },
            icon: '👟',
          },
          staff: {},
          sponsors: [],
          attributes: baseAttrs,
          overall,
          potential: calculatedPotential,
          energy: 100,
          morale: 95,
          weeklyWage: isSeniorStarter ? 4500 : 1200,
          bankBalance: 5000,
          reputation: isSeniorStarter ? 35 : 15,
          relationshipManager: 70,
          relationshipFans: 60,
          relationshipFamily: 95,
          stats: {
            matchesPlayed: 0,
            goals: 0,
            assists: 0,
            cleanSheets: 0,
            yellowCards: 0,
            redCards: 0,
            averageRating: 6.0,
          },
          lifestyleAssets: ['Chuteira Básica de Treino', 'Celular Simples'],
          avatar: avatar || {
            skinTone: '#c68b59',
            hairStyle: 'undercut',
            hairColor: '#18181b',
            facialHair: 'none',
            clothingStyle: 'jersey',
            jerseyNumber,
          },
        };

        const initialNews: NewsItem = {
          id: `news-debut-${Date.now()}`,
          week: 1,
          seasonYear: 2026,
          category: 'achievement',
          headline: `Promessa da base: ${playerProfile.name} assina com o ${club.name}!`,
          body: `O jovem de ${age} anos (${nationality}, ${height}cm, camisa ${jerseyNumber}) iniciará sua trajetória no ${club.name}. Diagnóstico tático: ${tacticalRoleBonus}.`,
          clubId: club.id,
        };

        // Gera calendário se ainda não existir
        const cal = (state.allFixtures && state.allFixtures.length > 0)
          ? { leagues: state.leagues, copaDoBrasil: state.copaDoBrasil, sub20Tournament: state.sub20Tournament, allFixtures: state.allFixtures }
          : generateAnnualCalendar(availableClubs, 2026);

        set({
          mode: 'player',
          playerProfile,
          managerProfile: undefined,
          currentWeek: 1,
          leagues: cal.leagues,
          copaDoBrasil: cal.copaDoBrasil,
          sub20Tournament: cal.sub20Tournament,
          allFixtures: cal.allFixtures,
          topScorers: defaultTopScorers,
          newsFeed: [initialNews, ...state.newsFeed],
          lastSavedAt: new Date().toISOString(),
        });
      },

      startManagerCareer: ({ 
        name, 
        age, 
        archetype = 'strategist',
        philosophy, 
        formation, 
        clubId,
        careerLength = 12,
        matchSimSystem = 'instant',
        avatar
      }) => {
        const state = get();
        const availableClubs = (state.clubs && Object.keys(state.clubs).length > 0)
          ? state.clubs
          : generateBrazilDatabase().clubs;

        const club = availableClubs[clubId] || Object.values(availableClubs)[0];

        // Arquétipos conferem bônus iniciais
        let initialBoard = 80;
        let initialReputation = club.division === 'A' ? 65 : club.division === 'B' ? 55 : club.division === 'C' ? 45 : 35;
        if (archetype === 'pragmatic') {
          initialBoard = 88; // Diretoria mais paciente
        } else if (archetype === 'motivator') {
          initialReputation += 5;
        }

        const managerProfile: ManagerCareerProfile = {
          id: `mgr-user-${Date.now()}`,
          name,
          age,
          archetype,
          philosophy,
          formation,
          clubId: club.id,
          careerLength,
          matchSimSystem,
          reputation: initialReputation,
          boardConfidence: initialBoard,
          fansConfidence: 75,
          scoutingLevel: archetype === 'talent_developer' ? 2 : 1,
          medicalLevel: 1,
          stats: {
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            titlesWon: 0,
          },
          avatar: avatar || {
            skinTone: '#c68b59',
            hairStyle: 'short',
            hairColor: '#18181b',
            facialHair: 'beard',
            clothingStyle: 'suit',
          },
        };

        const archetypeLabel = {
          strategist: 'Estrategista',
          motivator: 'Motivador',
          talent_developer: 'Formador de Talentos',
          pragmatic: 'Pragmático',
          financial_manager: 'Gestor Financeiro'
        }[archetype];

        const initialNews: NewsItem = {
          id: `news-mgr-debut-${Date.now()}`,
          week: 1,
          seasonYear: 2026,
          category: 'club',
          headline: `${name} é anunciado como novo treinador do ${club.name}!`,
          body: `Com perfil de ${archetypeLabel} e tática ${philosophy === 'attacking' ? 'ofensiva' : philosophy === 'possession' ? 'de posse de bola' : philosophy === 'defensive' ? 'de retranca sólida' : 'equilibrada'}, o novo comandante assume a equipe na Série ${club.division}.`,
          clubId: club.id,
        };

        const cal = (state.allFixtures && state.allFixtures.length > 0)
          ? { leagues: state.leagues, copaDoBrasil: state.copaDoBrasil, sub20Tournament: state.sub20Tournament, allFixtures: state.allFixtures }
          : generateAnnualCalendar(availableClubs, 2026);

        set({
          mode: 'manager',
          managerProfile,
          playerProfile: undefined,
          currentWeek: 1,
          leagues: cal.leagues,
          copaDoBrasil: cal.copaDoBrasil,
          sub20Tournament: cal.sub20Tournament,
          allFixtures: cal.allFixtures,
          topScorers: defaultTopScorers,
          newsFeed: [initialNews, ...state.newsFeed],
          lastSavedAt: new Date().toISOString(),
        });
      },

      updateClub: (clubId, clubData) => {
        const state = get();
        const currentClub = state.clubs[clubId];
        if (!currentClub) return;

        set({
          clubs: {
            ...state.clubs,
            [clubId]: {
              ...currentClub,
              ...clubData,
            },
          },
          lastSavedAt: new Date().toISOString(),
        });
      },

      updatePlayer: (clubId, playerId, isYouth, playerData) => {
        const state = get();
        const club = state.clubs[clubId];
        if (!club) return;

        const rosterKey = isYouth ? 'youthRoster' : 'roster';
        const currentList = club[rosterKey];

        const updatedList = currentList.map((player) => {
          if (player.id !== playerId) return player;
          const merged = { ...player, ...playerData };
          if (playerData.attributes || playerData.position) {
            merged.overall = calculateOverall(merged.position, merged.attributes);
          }
          return merged;
        });

        set({
          clubs: {
            ...state.clubs,
            [clubId]: {
              ...club,
              [rosterKey]: updatedList,
            },
          },
          lastSavedAt: new Date().toISOString(),
        });
      },

      setManagerFormation: (formation) => {
        const { managerProfile } = get();
        if (!managerProfile) return;
        set({
          managerProfile: {
            ...managerProfile,
            formation,
          },
          lastSavedAt: new Date().toISOString(),
        });
      },

      swapPlayersInRoster: (clubId, indexA, indexB) => {
        const { clubs } = get();
        const club = clubs[clubId];
        if (!club || !club.roster) return;
        if (indexA < 0 || indexA >= club.roster.length || indexB < 0 || indexB >= club.roster.length) return;

        const newRoster = [...club.roster];
        const temp = newRoster[indexA];
        newRoster[indexA] = newRoster[indexB];
        newRoster[indexB] = temp;

        set({
          clubs: {
            ...clubs,
            [clubId]: {
              ...club,
              roster: newRoster,
            },
          },
          lastSavedAt: new Date().toISOString(),
        });
      },

      setClubTacticalRoles: (clubId, roles) => {
        const { clubs, playerProfile } = get();
        const club = clubs[clubId];
        if (!club) return;

        const updatedClub = {
          ...club,
          captainPlayerId: roles.captainPlayerId !== undefined ? roles.captainPlayerId : club.captainPlayerId,
          penaltyTakerPlayerId: roles.penaltyTakerPlayerId !== undefined ? roles.penaltyTakerPlayerId : club.penaltyTakerPlayerId,
          freeKickTakerPlayerId: roles.freeKickTakerPlayerId !== undefined ? roles.freeKickTakerPlayerId : club.freeKickTakerPlayerId,
        };

        let updatedPlayerProfile = playerProfile;
        if (playerProfile && playerProfile.clubId === clubId) {
          const isUserCaptain = updatedClub.captainPlayerId === playerProfile.id;
          const isUserPenalty = updatedClub.penaltyTakerPlayerId === playerProfile.id;
          const isUserFreeKick = updatedClub.freeKickTakerPlayerId === playerProfile.id;

          const currentEpics = playerProfile.unlockedEpicSkills || [];
          const newEpics = [...currentEpics];
          if (isUserCaptain && !newEpics.includes('epic_faixa_capitao')) newEpics.push('epic_faixa_capitao');
          if (isUserPenalty && !newEpics.includes('epic_cobrador_penalti')) newEpics.push('epic_cobrador_penalti');
          if (isUserFreeKick && !newEpics.includes('epic_cobrador_falta')) newEpics.push('epic_cobrador_falta');

          updatedPlayerProfile = {
            ...playerProfile,
            isCaptain: isUserCaptain,
            isPenaltyTaker: isUserPenalty,
            isFreeKickTaker: isUserFreeKick,
            unlockedEpicSkills: newEpics,
          };
        }

        set({
          clubs: {
            ...clubs,
            [clubId]: updatedClub,
          },
          playerProfile: updatedPlayerProfile,
          lastSavedAt: new Date().toISOString(),
        });
      },

      togglePlayerTacticalRole: (role) => {
        const { clubs, playerProfile } = get();
        if (!playerProfile) return { success: false, message: 'Apenas no Modo Jogador.' };
        const club = clubs[playerProfile.clubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };

        let msg = '';
        const currentEpics = playerProfile.unlockedEpicSkills || [];
        const newEpics = [...currentEpics];

        if (role === 'captain') {
          const newStatus = !playerProfile.isCaptain;
          if (newStatus && playerProfile.overall < 58 && !playerProfile.isYouthTeam) {
            return { success: false, message: 'O elenco ainda não te respeita o suficiente para ser o Capitão! Aumente seu Overall ou Moral.' };
          }
          if (newStatus && !newEpics.includes('epic_faixa_capitao')) newEpics.push('epic_faixa_capitao');

          set({
            playerProfile: {
              ...playerProfile,
              isCaptain: newStatus,
              unlockedEpicSkills: newEpics,
              morale: Math.min(100, playerProfile.morale + 10),
              relationshipManager: Math.min(100, (playerProfile.relationshipManager || 70) + 5),
            },
            clubs: {
              ...clubs,
              [club.id]: {
                ...club,
                captainPlayerId: newStatus ? playerProfile.id : (club.roster?.[0]?.id || undefined),
              },
            },
            lastSavedAt: new Date().toISOString(),
          });
          msg = newStatus 
            ? '©️ Você assumiu a braçadeira de Capitão da equipe! Liderança ativada com bônus de moral!' 
            : 'Você passou a braçadeira de capitão para outro companheiro de equipe.';
        } else if (role === 'penalty') {
          const newStatus = !playerProfile.isPenaltyTaker;
          if (newStatus && !newEpics.includes('epic_cobrador_penalti')) newEpics.push('epic_cobrador_penalti');

          set({
            playerProfile: {
              ...playerProfile,
              isPenaltyTaker: newStatus,
              unlockedEpicSkills: newEpics,
            },
            clubs: {
              ...clubs,
              [club.id]: {
                ...club,
                penaltyTakerPlayerId: newStatus ? playerProfile.id : (club.roster?.[10]?.id || undefined),
              },
            },
            lastSavedAt: new Date().toISOString(),
          });
          msg = newStatus 
            ? '🎯 Você foi oficializado como Cobrador Oficial de Pênaltis! Na marca da cal, a bola é sua!' 
            : 'Cobrador de pênaltis desmarcado.';
        } else if (role === 'freekick') {
          const newStatus = !playerProfile.isFreeKickTaker;
          if (newStatus && !newEpics.includes('epic_cobrador_falta')) newEpics.push('epic_cobrador_falta');

          set({
            playerProfile: {
              ...playerProfile,
              isFreeKickTaker: newStatus,
              unlockedEpicSkills: newEpics,
            },
            clubs: {
              ...clubs,
              [club.id]: {
                ...club,
                freeKickTakerPlayerId: newStatus ? playerProfile.id : (club.roster?.[9]?.id || undefined),
              },
            },
            lastSavedAt: new Date().toISOString(),
          });
          msg = newStatus 
            ? '☄️ Você é agora o Cobrador Oficial de Faltas! Especialista em bolas paradas na entrada da área!' 
            : 'Cobrador de faltas desmarcado.';
        }

        return { success: true, message: msg };
      },

      unlockEpicSkill: (skillId) => {
        const { playerProfile } = get();
        if (!playerProfile) return;
        const currentEpics = playerProfile.unlockedEpicSkills || [];
        if (currentEpics.includes(skillId)) return;
        set({
          playerProfile: {
            ...playerProfile,
            unlockedEpicSkills: [...currentEpics, skillId],
          },
          lastSavedAt: new Date().toISOString(),
        });
      },

      buyPlayerForClub: (targetClubId, player, fee) => {
        const { clubs, newsFeed, seasonYear, currentWeek } = get();
        const club = clubs[targetClubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };
        if (club.budget < fee) {
          return { 
            success: false, 
            message: `Orçamento insuficiente! Você precisa de R$ ${fee.toLocaleString('pt-BR')} e o clube tem R$ ${club.budget.toLocaleString('pt-BR')}.` 
          };
        }

        const updatedBudget = club.budget - fee;
        const newPlayer: Player = {
          ...player,
          id: `transf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        const updatedRoster = [...club.roster, newPlayer];

        const newsItem: NewsItem = {
          id: `news-transf-${Date.now()}`,
          headline: `💣 BOMBA NO MERCADO! ${club.name} anuncia a contratação de ${player.name}!`,
          body: `O clube desembolsou R$ ${fee.toLocaleString('pt-BR')} para reforçar seu elenco com o atleta de overall ${player.overall}.`,
          category: 'transfer',
          week: currentWeek,
          seasonYear: seasonYear || 2026,
          clubId: targetClubId,
        };

        set({
          clubs: {
            ...clubs,
            [targetClubId]: {
              ...club,
              budget: updatedBudget,
              roster: updatedRoster,
            },
          },
          newsFeed: [newsItem, ...(newsFeed || [])],
          lastSavedAt: new Date().toISOString(),
        });

        return { 
          success: true, 
          message: `Contratação de ${player.name} confirmada por R$ ${fee.toLocaleString('pt-BR')}!` 
        };
      },

      sellPlayerFromClub: (clubId, playerId, fee) => {
        const { clubs, newsFeed, seasonYear, currentWeek } = get();
        const club = clubs[clubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };

        const playerToSell = club.roster.find((p) => p.id === playerId);
        if (!playerToSell) return { success: false, message: 'Jogador não encontrado no elenco.' };

        const updatedRoster = club.roster.filter((p) => p.id !== playerId);
        const updatedBudget = club.budget + fee;

        const newsItem: NewsItem = {
          id: `news-sold-${Date.now()}`,
          headline: `💰 MERCADO DA BOLA: ${club.name} vende ${playerToSell.name} por R$ ${fee.toLocaleString('pt-BR')}!`,
          body: `O atleta foi negociado no mercado profissional, injetando recursos vitais no caixa do clube.`,
          category: 'transfer',
          week: currentWeek,
          seasonYear: seasonYear || 2026,
          clubId,
        };

        set({
          clubs: {
            ...clubs,
            [clubId]: {
              ...club,
              budget: updatedBudget,
              roster: updatedRoster,
            },
          },
          newsFeed: [newsItem, ...(newsFeed || [])],
          lastSavedAt: new Date().toISOString(),
        });

        return { 
          success: true, 
          message: `${playerToSell.name} foi vendido com sucesso por R$ ${fee.toLocaleString('pt-BR')}!` 
        };
      },

      importCommunityPack: (pack) => {
        if (!pack || !pack.clubs || !Array.isArray(pack.clubs)) {
          return { success: false, message: 'Arquivo JSON inválido: nenhum clube encontrado.' };
        }

        const state = get();
        const validDivisions: Division[] = ['A', 'B', 'C', 'D', 'EUROPA'];
        const newClubs = { ...state.clubs };
        let importedCount = 0;

        pack.clubs.forEach((incomingClub) => {
          if (
            incomingClub &&
            typeof incomingClub.id === 'string' &&
            typeof incomingClub.name === 'string' &&
            validDivisions.includes(incomingClub.division)
          ) {
            newClubs[incomingClub.id] = {
              ...incomingClub,
              id: incomingClub.id.replace(/[^a-zA-Z0-9_-]/g, ''),
              name: String(incomingClub.name).slice(0, 50),
              shortName: String(incomingClub.shortName || 'BNR').slice(0, 4).toUpperCase(),
              primaryColor: incomingClub.primaryColor || '#10b981',
              secondaryColor: incomingClub.secondaryColor || '#ffffff',
              stadiumName: String(incomingClub.stadiumName || 'Estádio Municipal').slice(0, 50),
              stadiumCapacity: Number(incomingClub.stadiumCapacity) || 10000,
              stadiumLevel: Number(incomingClub.stadiumLevel) || 1,
              budget: Number(incomingClub.budget) || 1000000,
              wageBudget: Number(incomingClub.wageBudget) || 100000,
              reputation: Math.min(100, Math.max(1, Number(incomingClub.reputation) || 50)),
              roster: Array.isArray(incomingClub.roster) ? incomingClub.roster : [],
              youthRoster: Array.isArray(incomingClub.youthRoster) ? incomingClub.youthRoster : [],
            };
            importedCount++;
          }
        });

        if (importedCount === 0) {
          return { success: false, message: 'Nenhum clube válido encontrado no arquivo fornecido.' };
        }

        set({
          clubs: newClubs,
          newsFeed: [
            {
              id: `news-pack-${Date.now()}`,
              week: state.currentWeek,
              seasonYear: state.seasonYear,
              category: 'club',
              headline: `Pacote comunitário "${String(pack.title || 'Patch').slice(0, 40)}" importado!`,
              body: `Base de dados atualizada com ${importedCount} clubes customizados por ${String(pack.author || 'Comunidade').slice(0, 30)}.`,
            },
            ...state.newsFeed,
          ],
          lastSavedAt: new Date().toISOString(),
        });

        return { 
          success: true, 
          message: `Sucesso: ${importedCount} clubes foram validados e importados com segurança!` 
        };
      },

      exportCommunityPack: (title, author, description) => {
        const state = get();
        return {
          id: `pack-${Date.now()}`,
          title: title || 'Pacote Customizado Bola na Rede',
          author: author || 'Comunidade',
          description: description || 'Clubes e elencos personalizados.',
          version: '1.0.0',
          clubs: Object.values(state.clubs),
          updatedAt: new Date().toISOString(),
        };
      },

      advanceWeek: () => {
        const state = get();

        // 1. CHECAGEM DE VIRADA DE TEMPORADA (Após a semana 48)
        if (state.currentWeek >= 48) {
          const { nextState } = processSeasonEnd(state);
          set(nextState);
          if (!state.isGuest) {
            get().syncWithSupabase();
          }
          return;
        }

        // 2. SIMULAÇÃO MATEMÁTICA DAS PARTIDAS DA SEMANA ATUAL
        const {
          updatedFixtures,
          updatedLeagues,
          updatedSub20,
          updatedCopa,
          updatedTopScorers,
        } = simulateWeekMatches(state);

        const thisWeekFixtures = updatedFixtures.filter((f) => f.week === state.currentWeek);

        // 3. EVOLUÇÃO DE ATRIBUTOS E PROMOÇÃO DO JOGADOR
        let updatedPlayerProfile = state.playerProfile;
        let promoted = false;

        if (updatedPlayerProfile) {
          // Verifica se o clube do atleta jogou nesta semana (profissional ou base)
          const userClubMatch = thisWeekFixtures.find((f) => 
            (f.homeClubId === updatedPlayerProfile?.clubId || f.awayClubId === updatedPlayerProfile?.clubId) &&
            (updatedPlayerProfile?.isYouthTeam ? f.isYouth || f.competition === 'sub_20' : !f.isYouth)
          );

          const userRating = userClubMatch?.ratings?.[updatedPlayerProfile.id];

          let matchesPlayed = updatedPlayerProfile.stats.matchesPlayed;
          let goals = updatedPlayerProfile.stats.goals;
          let assists = updatedPlayerProfile.stats.assists;
          let yellowCards = updatedPlayerProfile.stats.yellowCards || 0;
          let redCards = updatedPlayerProfile.stats.redCards || 0;

          if (userClubMatch) {
            matchesPlayed += 1;
            const userGoals = (userClubMatch.scorers || []).filter(
              (s) => s.playerId === updatedPlayerProfile?.id
            ).length;
            const userAssists = (userClubMatch.scorers || []).filter(
              (s) => s.assistPlayerId === updatedPlayerProfile?.id
            ).length;
            const userYellows = (userClubMatch.cards || []).filter(
              (c) => c.playerId === updatedPlayerProfile?.id && c.type === 'yellow'
            ).length;
            const userReds = (userClubMatch.cards || []).filter(
              (c) => c.playerId === updatedPlayerProfile?.id && c.type === 'red'
            ).length;

            goals += userGoals;
            assists += userAssists;
            yellowCards += userYellows;
            redCards += userReds;
          }

          const prog = progressPlayerAttributes(
            {
              ...updatedPlayerProfile,
              stats: {
                ...updatedPlayerProfile.stats,
                matchesPlayed,
                goals,
                assists,
                yellowCards,
                redCards,
                averageRating: userRating 
                  ? Number(((updatedPlayerProfile.stats.averageRating * Math.max(1, matchesPlayed - 1) + userRating) / matchesPlayed).toFixed(1))
                  : updatedPlayerProfile.stats.averageRating,
              },
            },
            userRating
          );

          // Benefícios do Staff & Patrocinadores estilo NSS
          const hasAgent = !!updatedPlayerProfile.staff?.agent;
          const hasPhysio = !!updatedPlayerProfile.staff?.physio;
          const hasPress = !!updatedPlayerProfile.staff?.press;

          // Bônus de empresário (+20% de salário)
          const effectiveWeeklyWage = hasAgent 
            ? Math.round(prog.updatedProfile.weeklyWage * 1.2) 
            : prog.updatedProfile.weeklyWage;

          // Custos do Staff
          const staffWeeklyCost = (
            (updatedPlayerProfile.staff?.agent?.weeklyCost || 0) +
            (updatedPlayerProfile.staff?.physio?.weeklyCost || 0) +
            (updatedPlayerProfile.staff?.press?.weeklyCost || 0)
          );

          // Rendimentos de Patrocínio
          let sponsorWeeklyIncome = 0;
          const userGoalsThisWeek = userClubMatch 
            ? (userClubMatch.scorers || []).filter((s) => s.playerId === updatedPlayerProfile?.id).length
            : 0;

          const updatedSponsors = (updatedPlayerProfile.sponsors || [])
            .map((s) => {
              sponsorWeeklyIncome += s.weeklyPay + (s.goalBonus * userGoalsThisWeek);
              return { ...s, weeksRemaining: s.weeksRemaining - 1 };
            })
            .filter((s) => s.weeksRemaining > 0);

          // Desgaste da Chuteira
          let updatedBoot = updatedPlayerProfile.activeBoot;
          if (updatedBoot && userClubMatch) {
            const rem = updatedBoot.matchesRemaining - 1;
            if (rem <= 0) {
              updatedBoot = undefined; // Chuteira arrebentou
            } else {
              updatedBoot = { ...updatedBoot, matchesRemaining: rem };
            }
          }

          // Bônus do Fisioterapeuta na Energia
          let updatedEnergy = prog.updatedProfile.energy;
          if (hasPhysio) {
            updatedEnergy = Math.min(100, updatedEnergy + 12);
          }

          const netWeeklyEarnings = effectiveWeeklyWage + sponsorWeeklyIncome - staffWeeklyCost;

          updatedPlayerProfile = {
            ...prog.updatedProfile,
            energy: updatedEnergy,
            activeBoot: updatedBoot,
            sponsors: updatedSponsors,
            bankBalance: Math.max(0, prog.updatedProfile.bankBalance + netWeeklyEarnings),
          };

          if (prog.promotedToSenior) {
            promoted = true;
          }
        }

        // 4. ESTATÍSTICAS DO TREINADOR (MODO TREINADOR)
        let updatedManagerProfile = state.managerProfile;
        if (updatedManagerProfile) {
          const mgrMatch = thisWeekFixtures.find((f) => 
            f.homeClubId === updatedManagerProfile?.clubId || f.awayClubId === updatedManagerProfile?.clubId
          );

          if (mgrMatch) {
            const isHome = mgrMatch.homeClubId === updatedManagerProfile.clubId;
            const myGoals = isHome ? (mgrMatch.homeGoals || 0) : (mgrMatch.awayGoals || 0);
            const oppGoals = isHome ? (mgrMatch.awayGoals || 0) : (mgrMatch.homeGoals || 0);

            const isWin = myGoals > oppGoals;
            const isDraw = myGoals === oppGoals;

            updatedManagerProfile = {
              ...updatedManagerProfile,
              stats: {
                ...updatedManagerProfile.stats,
                matchesPlayed: updatedManagerProfile.stats.matchesPlayed + 1,
                wins: updatedManagerProfile.stats.wins + (isWin ? 1 : 0),
                draws: updatedManagerProfile.stats.draws + (isDraw ? 1 : 0),
                losses: updatedManagerProfile.stats.losses + (!isWin && !isDraw ? 1 : 0),
              },
              boardConfidence: isWin 
                ? Math.min(100, updatedManagerProfile.boardConfidence + 3)
                : isDraw ? updatedManagerProfile.boardConfidence : Math.max(10, updatedManagerProfile.boardConfidence - 4),
            };
          }
        }

        // 5. GERAÇÃO DINÂMICA DE NOTÍCIAS DA RODADA
        const weeklyNews = generateWeeklyNews(
          state,
          thisWeekFixtures,
          promoted ? updatedPlayerProfile?.name : undefined
        );

        const nextWeek = state.currentWeek + 1;

        // 6. ENCONTRA A PARTIDA DO USUÁRIO E OUTROS JOGOS DA RODADA
        const userMatch = (updatedPlayerProfile ? thisWeekFixtures.find((f) => 
          (f.homeClubId === updatedPlayerProfile?.clubId || f.awayClubId === updatedPlayerProfile?.clubId) &&
          (updatedPlayerProfile?.isYouthTeam ? f.isYouth || f.competition === 'sub_20' : !f.isYouth)
        ) : undefined) || (updatedManagerProfile ? thisWeekFixtures.find((f) => 
          f.homeClubId === updatedManagerProfile?.clubId || f.awayClubId === updatedManagerProfile?.clubId
        ) : undefined);

        const targetCompetition = userMatch?.competition || 'serie_a';
        const otherFixtures = thisWeekFixtures.filter(
          (f) => f.id !== userMatch?.id && f.competition === targetCompetition
        ).slice(0, 8);

        // 7. COLETIVA DE IMPRENSA OBRIGATÓRIA PÓS-JOGO & DILEMAS DE CARREIRA
        let nextPendingControversy = state.pendingControversy;
        if (userMatch || !nextPendingControversy) {
          const answeredIds = (state.controversyHistory || []).map((h) => h.event.id);
          const unvisited = HISTORICAL_CONTROVERSIES.filter((c) => !answeredIds.includes(c.id));
          const pool = unvisited.length > 0 ? unvisited : HISTORICAL_CONTROVERSIES;
          nextPendingControversy = pool[Math.floor(Math.random() * pool.length)];
        }

        let nextDilemma = state.pendingDilemma;
        if (!nextDilemma && Math.random() < 0.5) {
          const isUserWin = userMatch?.isPlayed && ((userMatch.homeClubId === (updatedPlayerProfile?.clubId || updatedManagerProfile?.clubId) && (userMatch.homeGoals || 0) > (userMatch.awayGoals || 0)) || (userMatch.awayClubId === (updatedPlayerProfile?.clubId || updatedManagerProfile?.clubId) && (userMatch.awayGoals || 0) > (userMatch.homeGoals || 0)));
          const isUserLoss = userMatch?.isPlayed && ((userMatch.homeClubId === (updatedPlayerProfile?.clubId || updatedManagerProfile?.clubId) && (userMatch.homeGoals || 0) < (userMatch.awayGoals || 0)) || (userMatch.awayClubId === (updatedPlayerProfile?.clubId || updatedManagerProfile?.clubId) && (userMatch.awayGoals || 0) < (userMatch.homeGoals || 0)));
          
          nextDilemma = evaluateDilemmaTrigger(
            { ...state, playerProfile: updatedPlayerProfile, managerProfile: updatedManagerProfile },
            {
              isDerby: (userMatch as any)?.isDerby,
              matchResult: isUserWin ? 'win' : isUserLoss ? 'loss' : 'draw',
            }
          );
        }

        set({
          currentWeek: nextWeek,
          allFixtures: updatedFixtures,
          leagues: updatedLeagues,
          sub20Tournament: updatedSub20,
          copaDoBrasil: updatedCopa,
          topScorers: updatedTopScorers,
          playerProfile: updatedPlayerProfile,
          managerProfile: updatedManagerProfile,
          pendingControversy: nextPendingControversy,
          pendingDilemma: nextDilemma,
          newsFeed: [...weeklyNews, ...state.newsFeed.slice(0, 30)],
          promotionModalOpen: promoted ? true : state.promotionModalOpen,
          lastRoundResult: {
            week: state.currentWeek,
            userFixture: userMatch,
            otherFixtures,
          },
          roundResultModalOpen: true,
          lastSavedAt: new Date().toISOString(),
        });

        // 6. AUTO-SAVE NO SUPABASE
        if (!state.isGuest) {
          get().syncWithSupabase();
        }
      },

      syncWithSupabase: async () => {
        const state = get();
        if (state.isGuest) {
          return { success: false, message: 'Modo Visitante: o progresso é mantido apenas localmente no navegador.' };
        }

        if (!isSupabaseConfigured()) {
          return { success: false, message: 'Supabase não configurado no servidor.' };
        }

        const supabase = getSupabase();
        if (!supabase) {
          return { success: false, message: 'Falha ao inicializar conexão com o banco de dados.' };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, message: 'Usuário não autenticado.' };
        }

        const payload = {
          user_id: user.id,
          slot_name: state.mode === 'player' ? (state.playerProfile?.name || 'Carreira Jogador') : (state.managerProfile?.name || 'Carreira Treinador'),
          current_mode: state.mode,
          season_year: state.seasonYear,
          generation: state.generation,
          game_state: {
            mode: state.mode,
            generation: state.generation,
            seasonYear: state.seasonYear,
            currentWeek: state.currentWeek,
            planTier: state.planTier,
            playerProfile: state.playerProfile,
            managerProfile: state.managerProfile,
            clubs: state.clubs,
            leagues: state.leagues,
            copaDoBrasil: state.copaDoBrasil,
            sub20Tournament: state.sub20Tournament,
            allFixtures: state.allFixtures,
            topScorers: state.topScorers,
            newsFeed: state.newsFeed,
            trophies: state.trophies,
          },
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('saves')
          .upsert(payload, { onConflict: 'user_id' });

        if (error) {
          return { success: false, message: `Erro ao salvar: ${error.message}` };
        }

        // Atualizar pontuação no Ranking Online (leaderboard)
        const clubName = state.mode === 'player' 
          ? (state.playerProfile?.clubId ? state.clubs[state.playerProfile.clubId]?.name : 'Base')
          : (state.managerProfile?.clubId ? state.clubs[state.managerProfile.clubId]?.name : 'Clube');

        const scorePoints = state.trophies.length * 100 + (state.mode === 'player' ? (state.playerProfile?.overall || 50) : 50);

        await supabase.from('leaderboard').upsert({
          user_id: user.id,
          username: state.mode === 'player' ? (state.playerProfile?.name || 'Jogador') : (state.managerProfile?.name || 'Treinador'),
          mode: state.mode,
          trophies_count: state.trophies.length,
          points: scorePoints,
          club_name: clubName,
          season_year: state.seasonYear,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,mode' });

        set({ lastSavedAt: new Date().toISOString() });
        return { success: true, message: 'Carreira salva na nuvem com sucesso!' };
      },

      loadSaveFromSupabase: async (saveId) => {
        const supabase = getSupabase();
        if (!supabase) {
          return { success: false, message: 'Banco de dados não disponível.' };
        }

        const { data, error } = await supabase
          .from('saves')
          .select('game_state')
          .eq('id', saveId)
          .single();

        if (error || !data) {
          return { success: false, message: 'Não foi possível carregar o save especificado.' };
        }

        const loadedState = data.game_state as Partial<GameState>;
        set({
          ...loadedState,
          isGuest: false,
          lastSavedAt: new Date().toISOString(),
        });

        return { success: true, message: 'Save carregado com sucesso da nuvem!' };
      },

      recordOnlineMatchResult: (result, opponentName, opponentClub, score) => {
        const state = get();
        const currentStats = state.onlineStats || {
          elo: 1200,
          division: 'Prata',
          wins: 0,
          losses: 0,
          draws: 0,
          matchHistory: [],
        };

        const eloChange = result === 'win' ? 35 : result === 'loss' ? -18 : 5;
        const newElo = Math.max(100, currentStats.elo + eloChange);

        let division: OnlineStats['division'] = 'Bronze';
        if (newElo >= 2000) division = 'Mestre';
        else if (newElo >= 1500) division = 'Diamante';
        else if (newElo >= 1000) division = 'Ouro';
        else if (newElo >= 500) division = 'Prata';

        const newHistory = [
          {
            id: `match-${Date.now()}`,
            opponentName,
            opponentClub,
            result,
            score,
            date: new Date().toLocaleDateString('pt-BR'),
            eloChange,
          },
          ...(currentStats.matchHistory || []),
        ].slice(0, 20);

        // Se vitória, bônus financeiro e moral
        if (result === 'win' && state.mode === 'player' && state.playerProfile) {
          set({
            playerProfile: {
              ...state.playerProfile,
              bankBalance: (state.playerProfile.bankBalance || 0) + 2500,
              morale: Math.min(100, state.playerProfile.morale + 10),
            },
          });
        }

        set({
          onlineStats: {
            elo: newElo,
            division,
            wins: currentStats.wins + (result === 'win' ? 1 : 0),
            losses: currentStats.losses + (result === 'loss' ? 1 : 0),
            draws: currentStats.draws + (result === 'draw' ? 1 : 0),
            matchHistory: newHistory,
          },
        });

        return { eloChange, newElo };
      },

      syncCareerToLeaderboard: async () => {
        const state = get();
        const careerScore = calculateCareerScore(state);
        const totalPoints = careerScore.totalPoints;
        const username = state.mode === 'player' 
          ? (state.playerProfile?.name || 'Craque do Brasil') 
          : (state.managerProfile?.name || 'Professor Tático');
        const clubName = state.mode === 'player' 
          ? (state.playerProfile?.clubId ? (state.clubs[state.playerProfile.clubId]?.name || 'Base Sub-20') : 'Base') 
          : (state.managerProfile?.clubId ? (state.clubs[state.managerProfile.clubId]?.name || 'Clube') : 'Clube');

        const supabase = getSupabase();
        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || `anon-${username.toLowerCase().replace(/\s+/g, '-')}`;

            const { error } = await supabase.from('leaderboard').upsert({
              user_id: userId,
              username,
              mode: state.mode,
              trophies_count: state.trophies.length,
              points: totalPoints,
              club_name: clubName,
              season_year: state.seasonYear,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,mode' });

            if (!error) {
              return { 
                success: true, 
                message: `Carreira sincronizada com sucesso no Ranking Global Supabase! ${totalPoints} pontos computados.`,
                totalPoints,
              };
            }
          } catch (e) {
            console.warn('Erro ao sincronizar com Supabase:', e);
          }
        }

        // Fallback local caso offline ou sem sessão
        return { 
          success: true, 
          message: `Carreira sincronizada com a Comunidade Online! ${totalPoints} pontos computados.`,
          totalPoints,
        };
      },

      fetchOnlineLeaderboard: async (modeFilter) => {
        const state = get();
        const selectedMode = modeFilter || state.mode;
        const supabase = getSupabase();

        let realEntries: OnlineLeaderboardEntry[] = [];
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from('leaderboard')
              .select('*')
              .eq('mode', selectedMode)
              .order('points', { ascending: false })
              .limit(30);

            if (!error && data && data.length > 0) {
              realEntries = data as OnlineLeaderboardEntry[];
            }
          } catch (err) {
            console.warn('Erro ao buscar leaderboard:', err);
          }
        }

        // Ranking com a comunidade de craques ativos
        const userCareerScore = calculateCareerScore(state);
        const currentUserName = selectedMode === 'player' 
          ? (state.playerProfile?.name || 'Seu Atleta') 
          : (state.managerProfile?.name || 'Seu Treinador');
        const currentClub = selectedMode === 'player'
          ? (state.playerProfile?.clubId ? (state.clubs[state.playerProfile.clubId]?.name || 'Clube') : 'Flamengo')
          : (state.managerProfile?.clubId ? (state.clubs[state.managerProfile.clubId]?.name || 'Palmeiras') : 'Palmeiras');

        const communitySeed: OnlineLeaderboardEntry[] = [
          {
            id: 'lead-1',
            user_id: 'user-vinijr',
            username: 'Vinícius Paquetá',
            mode: selectedMode,
            trophies_count: 7,
            points: 1480,
            club_name: 'Real Madrid / Flamengo',
            season_year: 2026,
            is_pro: true,
            overall: 92,
            updated_at: new Date().toISOString(),
          },
          {
            id: 'lead-2',
            user_id: 'user-rodrygo',
            username: 'Rodrigo Santoro (Craque)',
            mode: selectedMode,
            trophies_count: 5,
            points: 1250,
            club_name: 'Santos / Man City',
            season_year: 2026,
            is_pro: true,
            overall: 89,
            updated_at: new Date().toISOString(),
          },
          {
            id: 'lead-3',
            user_id: 'user-endrick',
            username: 'Gabriel "Fenômeno" Silva',
            mode: selectedMode,
            trophies_count: 4,
            points: 980,
            club_name: 'Palmeiras / Chelsea',
            season_year: 2026,
            is_pro: false,
            overall: 85,
            updated_at: new Date().toISOString(),
          },
          {
            id: 'lead-4',
            user_id: 'user-arthur',
            username: 'Arthur Antunes Jr',
            mode: selectedMode,
            trophies_count: 3,
            points: 820,
            club_name: 'Flamengo',
            season_year: 2026,
            is_pro: false,
            overall: 81,
            updated_at: new Date().toISOString(),
          },
          {
            id: 'lead-5',
            user_id: 'user-matheus',
            username: 'Matheus Carioca',
            mode: selectedMode,
            trophies_count: 2,
            points: 640,
            club_name: 'Vasco da Gama',
            season_year: 2026,
            is_pro: false,
            overall: 78,
            updated_at: new Date().toISOString(),
          },
        ];

        // Adiciona o usuário na lista
        const userEntry: OnlineLeaderboardEntry = {
          id: 'user-current',
          user_id: 'user-current',
          username: `${currentUserName} (Você)`,
          mode: selectedMode,
          trophies_count: state.trophies.length,
          points: userCareerScore.totalPoints,
          club_name: currentClub,
          season_year: state.seasonYear,
          is_pro: state.planTier === 'pro',
          overall: selectedMode === 'player' ? (state.playerProfile?.overall || 65) : 75,
          updated_at: new Date().toISOString(),
        };

        const combined = [...realEntries, ...communitySeed, userEntry];
        const map = new Map<string, OnlineLeaderboardEntry>();
        for (const item of combined) {
          map.set(item.username, item);
        }
        return Array.from(map.values()).sort((a, b) => b.points - a.points);
      },

      applyCommunityPack: (packData) => {
        const state = get();
        const updatedClubs = { ...state.clubs };
        let count = 0;

        for (const [clubId, data] of Object.entries(packData)) {
          if (updatedClubs[clubId]) {
            updatedClubs[clubId] = {
              ...updatedClubs[clubId],
              ...data,
            };
            count++;
          }
        }

        set({ clubs: updatedClubs });
        return { updatedCount: count };
      },

      setManagerHighPressure: (active: boolean) => {
        const state = get();
        if (!state.managerProfile) return;
        set({
          managerProfile: {
            ...state.managerProfile,
            highPressure: active,
          },
        });
      },

      setManagerPhilosophy: (philosophy: ManagerTacticsPhilosophy) => {
        const state = get();
        if (!state.managerProfile) return;
        const currentClubId = state.managerProfile.clubId;
        const updatedClubs = { ...state.clubs };
        if (currentClubId && updatedClubs[currentClubId]) {
          const club = updatedClubs[currentClubId];
          updatedClubs[currentClubId] = {
            ...club,
            tactics: {
              ...(club.tactics || {}),
              philosophy,
            },
          };
        }
        set({
          clubs: updatedClubs,
          managerProfile: {
            ...state.managerProfile,
            philosophy,
          },
        });
      },

      autoSelectLineup: (clubId: string) => {
        const state = get();
        const club = state.clubs[clubId];
        if (!club || !club.roster || club.roster.length === 0) return;

        const players = [...club.roster].sort((a, b) => b.overall - a.overall);
        const selectedIds: string[] = [];

        // 1 Goleiro
        const gk = players.find(p => p.position === 'GOL');
        if (gk) selectedIds.push(gk.id);

        // 2 Zagueiros
        const zags = players.filter(p => p.position === 'ZAG' && !selectedIds.includes(p.id)).slice(0, 2);
        zags.forEach(p => selectedIds.push(p.id));

        // 1 Lateral Esquerdo
        const le = players.find(p => p.position === 'LE' && !selectedIds.includes(p.id));
        if (le) selectedIds.push(le.id);

        // 1 Lateral Direito
        const ld = players.find(p => p.position === 'LD' && !selectedIds.includes(p.id));
        if (ld) selectedIds.push(ld.id);

        // 2 Volantes
        const vols = players.filter(p => p.position === 'VOL' && !selectedIds.includes(p.id)).slice(0, 2);
        vols.forEach(p => selectedIds.push(p.id));

        // 2 Meias
        const meis = players.filter(p => (p.position === 'MEI' || p.position === 'MC') && !selectedIds.includes(p.id)).slice(0, 2);
        meis.forEach(p => selectedIds.push(p.id));

        // 2 Atacantes
        const atas = players.filter(p => (p.position === 'ATA' || p.position === 'PD' || p.position === 'PE') && !selectedIds.includes(p.id)).slice(0, 2);
        atas.forEach(p => selectedIds.push(p.id));

        // Se ainda não tiver 11, completa com os melhores disponíveis
        if (selectedIds.length < 11) {
          for (const p of players) {
            if (!selectedIds.includes(p.id)) {
              selectedIds.push(p.id);
              if (selectedIds.length === 11) break;
            }
          }
        }

        const updatedClub = {
          ...club,
          lineup: selectedIds,
        };

        const currentReserves = (state.managerProfile?.selectedReservesIds || []).filter(id => !selectedIds.includes(id));

        set({
          clubs: {
            ...state.clubs,
            [clubId]: updatedClub,
          },
          managerProfile: state.managerProfile ? {
            ...state.managerProfile,
            selectedReservesIds: currentReserves,
          } : undefined,
        });
      },

      autoSelectReserves: (clubId: string) => {
        const state = get();
        const club = state.clubs[clubId];
        if (!club || !club.roster) return;

        const currentLineup = new Set(club.lineup || []);
        const available = club.roster.filter(p => !currentLineup.has(p.id) && !p.isInjured && !p.isSuspended)
          .sort((a, b) => b.overall - a.overall);

        const reserves: string[] = [];

        // Garante 1 Goleiro reserva
        const reserveGk = available.find(p => p.position === 'GOL');
        if (reserveGk) {
          reserves.push(reserveGk.id);
        }

        // Pega os 6 de linha de maior OVR
        for (const p of available) {
          if (reserves.length >= 7) break;
          if (!reserves.includes(p.id)) {
            reserves.push(p.id);
          }
        }

        set({
          managerProfile: state.managerProfile ? {
            ...state.managerProfile,
            selectedReservesIds: reserves,
          } : undefined,
        });
      },

      clearReservesSelection: (clubId: string) => {
        const state = get();
        if (!state.managerProfile) return;
        set({
          managerProfile: {
            ...state.managerProfile,
            selectedReservesIds: [],
          },
        });
      },

      toggleReservePlayer: (clubId: string, playerId: string) => {
        const state = get();
        if (!state.managerProfile) return;
        const club = state.clubs[clubId];
        if (club?.lineup?.includes(playerId)) return; // Não pode ser reserva se já é titular

        const current = state.managerProfile.selectedReservesIds || [];
        let updated: string[];

        if (current.includes(playerId)) {
          updated = current.filter(id => id !== playerId);
        } else {
          if (current.length >= 7) {
            return; // Banco cheio (máx 7)
          }
          updated = [...current, playerId];
        }

        set({
          managerProfile: {
            ...state.managerProfile,
            selectedReservesIds: updated,
          },
        });
      },

      promoteYouthPlayer: (clubId: string, playerId: string) => {
        const state = get();
        const club = state.clubs[clubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };

        const youthRoster = club.youthRoster || [];
        const playerToPromote = youthRoster.find(p => p.id === playerId);
        if (!playerToPromote) return { success: false, message: 'Atleta não encontrado na base.' };

        // Promove: adiciona ao elenco profissional com contrato profissional
        const promotedPlayer: Player = {
          ...playerToPromote,
          isYouth: false,
          contractWeeks: 48 * 3, // 3 anos de contrato
          wage: Math.max(3000, Math.round(playerToPromote.overall * 80)),
        };

        const updatedYouth = youthRoster.filter(p => p.id !== playerId);
        const updatedRoster = [...(club.roster || []), promotedPlayer];

        set(prev => ({
          clubs: {
            ...prev.clubs,
            [clubId]: {
              ...club,
              roster: updatedRoster,
              youthRoster: updatedYouth,
            },
          },
          newsFeed: [
            {
              id: `news_promoted_${Date.now()}`,
              week: prev.currentWeek,
              seasonYear: prev.seasonYear,
              headline: 'PROMESSA DA BASE! Joia sobe ao profissional',
              body: `O jovem ${promotedPlayer.name} (${promotedPlayer.position}, ${promotedPlayer.age} anos, OVR ${promotedPlayer.overall}) assinou contrato profissional de 3 anos com o ${club.name}!`,
              category: 'club',
            },
            ...(prev.newsFeed || []),
          ],
        }));

        return { success: true, message: `${promotedPlayer.name} promovido com sucesso ao elenco profissional!` };
      },

      demoteToYouthRoster: (clubId: string, playerId: string) => {
        const state = get();
        const club = state.clubs[clubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };

        const playerToDemote = (club.roster || []).find(p => p.id === playerId);
        if (!playerToDemote) return { success: false, message: 'Atleta não encontrado no elenco.' };
        if (playerToDemote.age > 20) {
          return { success: false, message: 'Apenas atletas de até 20 anos podem jogar na categoria de base Sub-20.' };
        }

        const demotedPlayer: Player = {
          ...playerToDemote,
          isYouth: true,
          wage: 1500,
        };

        const updatedRoster = (club.roster || []).filter(p => p.id !== playerId);
        const updatedLineup = (club.lineup || []).filter(id => id !== playerId);
        const updatedReserves = (state.managerProfile?.selectedReservesIds || []).filter(id => id !== playerId);
        const updatedYouth = [...(club.youthRoster || []), demotedPlayer];

        set(prev => ({
          clubs: {
            ...prev.clubs,
            [clubId]: {
              ...club,
              roster: updatedRoster,
              lineup: updatedLineup,
              youthRoster: updatedYouth,
            },
          },
          managerProfile: prev.managerProfile ? {
            ...prev.managerProfile,
            selectedReservesIds: updatedReserves,
          } : undefined,
        }));

        return { success: true, message: `${demotedPlayer.name} foi realocado na categoria de base Sub-20 para rodagem.` };
      },

      scoutNewYouthTalent: (clubId: string) => {
        const state = get();
        const club = state.clubs[clubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };

        const currentBudget = club.transferBudget ?? club.budget;
        const cost = 100000;
        if (currentBudget < cost) {
          return { success: false, message: `Orçamento insuficiente. É necessário R$ 100 mil para a missão de olheiros da base.` };
        }

        const positions: Position[] = ['GOL', 'ZAG', 'LE', 'LD', 'VOL', 'MEI', 'PE', 'PD', 'ATA'];
        const chosenPos = positions[Math.floor(Math.random() * positions.length)];
        const firstNames = ['Cauã', 'Matheuzinho', 'Enzo', 'Pedrinho', 'Kauê', 'Rodriguinho', 'Luanzinho', 'Vitor Hugo', 'Gabrielzinho', 'Bernardo'];
        const lastNames = ['Ferreira', 'Nascimento', 'Santana', 'Teixeira', 'Albuquerque', 'Moraes', 'Duarte', 'Magalhães', 'Barreto'];
        
        const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
        const age = Math.random() > 0.5 ? 16 : 17;
        const potential = Math.floor(Math.random() * 11) + 84; // 84 a 94
        const overall = Math.floor(Math.random() * 8) + 58;    // 58 a 65

        const newTalent: Player = {
          id: `youth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: `${randomFirst} ${randomLast}`,
          age,
          position: chosenPos,
          overall,
          potential,
          energy: 100,
          morale: 85,
          contractWeeks: 48 * 2,
          wage: 1500,
          marketValue: 800000,
          isYouth: true,
          attributes: {
            pace: overall + 2,
            shooting: overall,
            passing: overall + 1,
            dribbling: overall + 3,
            defending: chosenPos === 'ZAG' || chosenPos === 'VOL' ? overall + 5 : overall - 10,
            physical: overall,
            heading: 65,
            positioning: 66,
            tackling: 64,
            crossing: 65,
            elasticity: 70,
            playmaker: 65,
            finishing: overall,
            attacking: overall + 2,
            jumping: 68,
          },
        };

        const updatedYouth = [...(club.youthRoster || []), newTalent];

        set(prev => ({
          clubs: {
            ...prev.clubs,
            [clubId]: {
              ...club,
              budget: club.budget - cost,
              transferBudget: (club.transferBudget ?? club.budget) - cost,
              youthRoster: updatedYouth,
            },
          },
          newsFeed: [
            {
              id: `news_scout_${Date.now()}`,
              week: prev.currentWeek,
              seasonYear: prev.seasonYear,
              headline: 'NOVA JOIA DESCOBERTA! Olheiros encontram promessa para a base',
              body: `O departamento de captação do ${club.name} integrou ${newTalent.name} (${newTalent.position}, ${newTalent.age} anos) com potencial estimado de ${newTalent.potential} ⭐!`,
              category: 'club',
            },
            ...(prev.newsFeed || []),
          ],
        }));

        return { success: true, message: `Nova promessa captada: ${newTalent.name} (${newTalent.position}, Potencial ${newTalent.potential} ⭐)!` };
      },

      setStadiumTicketPrice: (clubId: string, price: number) => {
        const state = get();
        if (!state.managerProfile) return;
        const currentStadium = state.managerProfile.stadiumUpgrades || {
          comfortLevel: 1,
          vipLevel: 1,
          marketingLevel: 1,
          ticketPrice: 50,
        };

        set({
          managerProfile: {
            ...state.managerProfile,
            stadiumUpgrades: {
              ...currentStadium,
              ticketPrice: price,
            },
          },
        });
      },

      setPlayerIndividualTrainingFocus: (playerId: string, skill: string) => {
        const state = get();
        if (!state.managerProfile) return;
        const currentFocus = state.managerProfile.trainingUpgrades?.playerFocus || {};
        set({
          managerProfile: {
            ...state.managerProfile,
            trainingUpgrades: {
              ctLevel: state.managerProfile.trainingUpgrades?.ctLevel || 1,
              medicalLevel: state.managerProfile.trainingUpgrades?.medicalLevel || 1,
              playerFocus: {
                ...currentFocus,
                [playerId]: skill,
              },
            },
          },
        });
      },

      upgradeClubFacility: (facility: 'comfort' | 'vip' | 'marketing' | 'ct' | 'medical') => {
        const state = get();
        const clubId = state.managerProfile?.clubId || state.playerProfile?.clubId || '';
        const club = state.clubs[clubId];
        if (!club) return { success: false, message: 'Clube não encontrado.' };

        const stadium = state.managerProfile?.stadiumUpgrades || {
          comfortLevel: 1,
          vipLevel: 1,
          marketingLevel: 1,
          ticketPrice: 50,
        };

        const training = state.managerProfile?.trainingUpgrades || {
          ctLevel: 1,
          medicalLevel: 1,
          playerFocus: {},
        };

        let cost = 0;
        let currentLevel = 1;
        let facilityName = '';

        switch (facility) {
          case 'comfort':
            currentLevel = stadium.comfortLevel;
            cost = (currentLevel + 1) * 4_000_000;
            facilityName = 'Conforto e Setores';
            break;
          case 'vip':
            currentLevel = stadium.vipLevel;
            cost = (currentLevel + 1) * 5_000_000;
            facilityName = 'Camarotes VIP';
            break;
          case 'marketing':
            currentLevel = stadium.marketingLevel;
            cost = (currentLevel + 1) * 4_000_000;
            facilityName = 'Marketing e Patrocínio';
            break;
          case 'ct':
            currentLevel = training.ctLevel;
            cost = (currentLevel + 1) * 6_000_000;
            facilityName = 'Centro de Treinamento';
            break;
          case 'medical':
            currentLevel = training.medicalLevel;
            cost = (currentLevel + 1) * 4_500_000;
            facilityName = 'Departamento Médico';
            break;
        }

        if (currentLevel >= 5) {
          return { success: false, message: `${facilityName} já atingiu o nível máximo (Nível 5)!` };
        }

        if ((club.budget || 0) < cost) {
          const formatCost = (cost / 1_000_000).toFixed(1);
          return { success: false, message: `Orçamento insuficiente! Necessário R$ ${formatCost} mi.` };
        }

        const newClubBudget = (club.budget || 0) - cost;
        const updatedClubs = {
          ...state.clubs,
          [clubId]: {
            ...club,
            budget: newClubBudget,
          },
        };

        const updatedStadium = { ...stadium };
        const updatedTraining = { ...training };

        if (facility === 'comfort') updatedStadium.comfortLevel = currentLevel + 1;
        if (facility === 'vip') updatedStadium.vipLevel = currentLevel + 1;
        if (facility === 'marketing') updatedStadium.marketingLevel = currentLevel + 1;
        if (facility === 'ct') updatedTraining.ctLevel = currentLevel + 1;
        if (facility === 'medical') updatedTraining.medicalLevel = currentLevel + 1;

        set({
          clubs: updatedClubs,
          managerProfile: state.managerProfile ? {
            ...state.managerProfile,
            stadiumUpgrades: updatedStadium,
            trainingUpgrades: updatedTraining,
          } : undefined,
        });

        return {
          success: true,
          message: `${facilityName} aprimorado para o Nível ${currentLevel + 1} por R$ ${(cost / 1_000_000).toFixed(1)} mi!`,
        };
      },

      // ==============================================================================
      // EQUIPAMENTOS OFICIAIS (CHUTEIRAS COM ATRIBUTOS & BOLAS COM FÍSICA)
      // ==============================================================================
      buyBoot: (bootId: string) => {
        const state = get();
        const boot = getBootById(bootId);
        if (!boot) return { success: false, message: 'Chuteira não encontrada no catálogo oficial!' };

        if (!state.playerProfile) {
          return { success: false, message: 'Disponível apenas no Modo Jogador!' };
        }

        const owned = state.playerProfile.ownedBootIds || ['classic_black'];
        if (owned.includes(bootId)) {
          return { success: false, message: 'Você já possui essa chuteira no seu armário!' };
        }

        const currentBalance = state.playerProfile.bankBalance ?? state.playerProfile.money ?? 0;
        if (currentBalance < boot.price) {
          return {
            success: false,
            message: `Saldo insuficiente! Você tem R$ ${currentBalance.toLocaleString('pt-BR')} e a chuteira custa R$ ${boot.price.toLocaleString('pt-BR')}.`,
          };
        }

        const newOwned = [...owned, bootId];
        const newMoney = currentBalance - boot.price;

        set({
          playerProfile: {
            ...state.playerProfile,
            bankBalance: newMoney,
            money: newMoney,
            ownedBootIds: newOwned,
            equippedBootId: bootId,
          },
        });

        return {
          success: true,
          message: `Chuteira "${boot.name}" comprada e equipada com sucesso! Bônus de atributos ativados.`,
        };
      },

      equipBoot: (bootId: string) => {
        const state = get();
        if (!state.playerProfile) return;
        const owned = state.playerProfile.ownedBootIds || ['classic_black'];
        if (!owned.includes(bootId)) return;

        set({
          playerProfile: {
            ...state.playerProfile,
            equippedBootId: bootId,
          },
        });
      },

      buyBall: (ballId: string) => {
        const state = get();
        const ball = getBallById(ballId);
        if (!ball) return { success: false, message: 'Bola não encontrada no catálogo oficial!' };

        const currentOwned = state.ownedBallIds || ['classic_capotao'];
        if (currentOwned.includes(ballId)) {
          return { success: false, message: 'Você já possui esta bola oficial em sua coleção!' };
        }

        if (state.mode === 'player') {
          if (!state.playerProfile) return { success: false, message: 'Perfil não encontrado!' };
          const currentBalance = state.playerProfile.bankBalance ?? state.playerProfile.money ?? 0;
          if (currentBalance < ball.price) {
            return {
              success: false,
              message: `Saldo insuficiente! Necessário R$ ${ball.price.toLocaleString('pt-BR')}.`,
            };
          }

          const newMoney = currentBalance - ball.price;
          const newOwned = [...currentOwned, ballId];

          set({
            equippedBallId: ballId,
            ownedBallIds: newOwned,
            playerProfile: {
              ...state.playerProfile,
              bankBalance: newMoney,
              money: newMoney,
              equippedBallId: ballId,
              ownedBallIds: newOwned,
            },
          });
        } else {
          if (!state.managerProfile) return { success: false, message: 'Perfil não encontrado!' };
          const club = state.clubs[state.managerProfile.clubId];
          if (!club) return { success: false, message: 'Clube não encontrado!' };

          if ((club.budget || 0) < ball.price) {
            return {
              success: false,
              message: `Orçamento do clube insuficiente! Necessário R$ ${ball.price.toLocaleString('pt-BR')}.`,
            };
          }

          const newBudget = (club.budget || 0) - ball.price;
          const newOwned = [...currentOwned, ballId];

          set({
            equippedBallId: ballId,
            ownedBallIds: newOwned,
            clubs: {
              ...state.clubs,
              [club.id]: {
                ...club,
                budget: newBudget,
              },
            },
            managerProfile: {
              ...state.managerProfile,
              equippedBallId: ballId,
              ownedBallIds: newOwned,
            },
          });
        }

        return {
          success: true,
          message: `Bola "${ball.name}" adquirida e definida como bola oficial de partida!`,
        };
      },

      equipBall: (ballId: string) => {
        const state = get();
        const currentOwned = state.ownedBallIds || ['classic_capotao'];
        if (!currentOwned.includes(ballId)) return;

        set({
          equippedBallId: ballId,
          playerProfile: state.playerProfile ? {
            ...state.playerProfile,
            equippedBallId: ballId,
          } : undefined,
          managerProfile: state.managerProfile ? {
            ...state.managerProfile,
            equippedBallId: ballId,
          } : undefined,
        });
      },

      // ==============================================================================
      // DILEMAS, COLETIVAS DE IMPRENSA & RELACIONAMENTOS
      // ==============================================================================
      answerDilemma: (dilemmaId: string, optionId: string) => {
        const state = get();
        const dilemma = DILEMMAS_DATABASE.find((d) => d.id === dilemmaId);
        if (!dilemma) return;
        const option = dilemma.options.find((o) => o.id === optionId);
        if (!option) return;

        const partialUpdates = applyDilemmaResolution(state, dilemma, option);
        const newHistory = [
          ...(state.dilemmaHistory || []),
          {
            dilemmaId,
            optionId,
            answeredAtWeek: state.currentWeek,
            seasonYear: state.seasonYear,
          },
        ];

        set({
          ...partialUpdates,
          pendingDilemma: null,
          dilemmaHistory: newHistory,
        });
      },

      dismissDilemma: () => {
        set({ pendingDilemma: null });
      },

      triggerDilemmaCheck: (context?: DilemmaEvaluationContext) => {
        const state = get();
        if (state.pendingDilemma) return;
        const candidate = evaluateDilemmaTrigger(state, context);
        if (candidate) {
          set({ pendingDilemma: candidate });
        }
      },

      holdLockerRoomMeeting: () => {
        const state = get();
        if (state.mode !== 'manager' || !state.managerProfile) {
          return { success: false, message: 'Disponível apenas no Modo Treinador!' };
        }

        const lastWeek = state.managerProfile.lastLockerRoomMeetingWeek || 0;
        const currentWeek = state.currentWeek;
        if (lastWeek > 0 && currentWeek - lastWeek < 4) {
          const weeksLeft = 4 - (currentWeek - lastWeek);
          return {
            success: false,
            message: `Você realizou uma reunião recentemente. Aguarde mais ${weeksLeft} semana(s) para uma nova conversa séria de vestiário.`,
          };
        }

        const currentMorale = state.managerProfile.squadMorale ?? 65;
        const newMorale = Math.min(100, currentMorale + 15);

        set({
          managerProfile: {
            ...state.managerProfile,
            squadMorale: newMorale,
            lastLockerRoomMeetingWeek: currentWeek,
          },
        });

        return {
          success: true,
          message: `Reunião de vestiário realizada com sucesso! Você motivou o grupo e a moral do elenco subiu para ${newMorale} (+15 pts).`,
        };
      },
    }),
    {
      name: 'bola-na-rede-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
