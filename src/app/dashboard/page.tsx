'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { TrainingFocus } from '@/types/game';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { ClubBadge } from '@/components/game/ClubBadge';
import { OverallBadge } from '@/components/game/OverallBadge';
import { ControversyModal } from '@/components/game/ControversyModal';
import { RoundResultModal } from '@/components/game/RoundResultModal';
import { TransferOfferModal } from '@/components/game/TransferOfferModal';
import { LiveMatchModal } from '@/components/game/LiveMatchModal';
import { NSSPlayerShopModal } from '@/components/game/NSSPlayerShopModal';
import { NSSPenaltyMinigame } from '@/components/game/NSSPenaltyMinigame';
import { NSSPassMinigame } from '@/components/game/NSSPassMinigame';
import { DribbleMinigame } from '@/components/match/DribbleMinigame';
import { CareerShareCardModal } from '@/components/game/CareerShareCardModal';
import { TorcidaFeedModal } from '@/components/game/TorcidaFeedModal';
import { AchievementsModal } from '@/components/game/AchievementsModal';
import { NationalTeamModal } from '@/components/game/NationalTeamModal';
import { AvatarDisplay } from '@/components/game/AvatarDisplay';
import { AvatarCreatorModal } from '@/components/game/AvatarCreatorModal';
import { DilemmaModal } from '@/components/game/DilemmaModal';
import { TrophyRoomModal } from '@/components/game/TrophyRoomModal';
import { TacticsBoard } from '@/components/game/TacticsBoard';
import { ManagerRosterModal } from '@/components/manager/ManagerRosterModal';
import { ManagerTacticsModal } from '@/components/manager/ManagerTacticsModal';
import { ManagerTrainingModal } from '@/components/manager/ManagerTrainingModal';
import { ManagerTransferModal } from '@/components/manager/ManagerTransferModal';
import { ManagerFinancesModal } from '@/components/manager/ManagerFinancesModal';
import { ManagerCareerModal } from '@/components/manager/ManagerCareerModal';
import { TacticalBoardMinigame } from '@/components/manager/TacticalBoardMinigame';
import { ManagerSpeechMinigame } from '@/components/manager/ManagerSpeechMinigame';
import { playWhistle, playKick, playGoal } from '@/lib/soundEffects';
import { LIFESTYLE_CATALOG } from '@/data/lifestyleSeed';
import { calculateCareerScore } from '@/engine/scoringEngine';
import { formatCurrency } from '@/lib/calculations';
import { getPlayStyleGoldById } from '@/data/playStylesSeed';
import { getManagerPlayStyleGoldById } from '@/data/managerPlayStylesSeed';
import { getBootById } from '@/data/boots';
import { getBallById } from '@/data/balls';
import { NRG_DRINKS_CATALOG } from '@/data/nssCatalogSeed';
import { EPIC_SKILLS_CATALOG } from '@/data/epicSkillsSeed';
import { NRGType } from '@/types/game';
import { PerformanceIndicator } from '@/components/game/PerformanceIndicator';
import { 
  Play, 
  FastForward, 
  Activity, 
  Smile, 
  Flame, 
  Calendar, 
  Users, 
  Trophy, 
  TrendingUp, 
  Database, 
  Sparkles, 
  Coins, 
  Newspaper, 
  ChevronRight, 
  Target, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight,
  Award,
  Mic,
  MessageSquareQuote,
  BarChart3,
  ShoppingBag,
  Briefcase,
  Star,
  Info,
  Swords,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const router = useRouter();
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const leagues = useGameStore((s) => s.leagues);
  const sub20Tournament = useGameStore((s) => s.sub20Tournament);
  const allFixtures = useGameStore((s) => s.allFixtures);
  const seasonYear = useGameStore((s) => s.seasonYear);
  const currentWeek = useGameStore((s) => s.currentWeek);
  const newsFeed = useGameStore((s) => s.newsFeed);
  const advanceWeek = useGameStore((s) => s.advanceWeek);
  const roundResultModalOpen = useGameStore((s) => s.roundResultModalOpen);
  const setRoundResultModalOpen = useGameStore((s) => s.setRoundResultModalOpen);
  const initDatabaseIfEmpty = useGameStore((s) => s.initDatabaseIfEmpty);
  const setTrainingFocus = useGameStore((s) => s.setTrainingFocus);
  const promotionModalOpen = useGameStore((s) => s.promotionModalOpen);
  const closePromotionModal = useGameStore((s) => s.closePromotionModal);
  const seasonSummaryModalOpen = useGameStore((s) => s.seasonSummaryModalOpen);
  const closeSeasonSummaryModal = useGameStore((s) => s.closeSeasonSummaryModal);
  const lastSeasonSummary = useGameStore((s) => s.lastSeasonSummary);
  const pendingControversy = useGameStore((s) => s.pendingControversy);
  const triggerRandomControversy = useGameStore((s) => s.triggerRandomControversy);
  const pendingTransferOffer = useGameStore((s) => s.pendingTransferOffer);
  const triggerTransferOffer = useGameStore((s) => s.triggerTransferOffer);
  const buyLifestyleAsset = useGameStore((s) => s.buyLifestyleAsset);
  const drinkEnergyCan = useGameStore((s) => s.drinkEnergyCan);
  const applyMinigameResult = useGameStore((s) => s.applyMinigameResult);
  const togglePlayerTacticalRole = useGameStore((s) => s.togglePlayerTacticalRole);
  const pendingDilemma = useGameStore((s) => s.pendingDilemma);
  const dismissDilemma = useGameStore((s) => s.dismissDilemma);
  const holdLockerRoomMeeting = useGameStore((s) => s.holdLockerRoomMeeting);
  const equippedBallId = useGameStore((s) => s.equippedBallId);
  const fullState = useGameStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'table' | 'life'>('overview');
  const [advancing, setAdvancing] = useState(false);
  const [meetingToast, setMeetingToast] = useState<{ message: string; success: boolean } | null>(null);
  const [isControversyModalOpen, setIsControversyModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isLiveMatchOpen, setIsLiveMatchOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [trainingType, setTrainingType] = useState<'penalty' | 'pass' | 'dribble'>('penalty');
  const [nrgToast, setNrgToast] = useState<string | null>(null);
  const [roleToast, setRoleToast] = useState<string | null>(null);
  const [lifestyleFeedback, setLifestyleFeedback] = useState<{ message: string; success: boolean } | null>(null);

  // Novos Modais da Expansão
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [isTorcidaFeedOpen, setIsTorcidaFeedOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isNationalTeamOpen, setIsNationalTeamOpen] = useState(false);
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [isTrophyRoomOpen, setIsTrophyRoomOpen] = useState(false);

  // Modais de Gestão do Modo Treinador (6 Telas Completas)
  const [isManagerRosterOpen, setIsManagerRosterOpen] = useState(false);
  const [isManagerTacticsOpen, setIsManagerTacticsOpen] = useState(false);
  const [isManagerTrainingOpen, setIsManagerTrainingOpen] = useState(false);
  const [isManagerTransferMarketOpen, setIsManagerTransferMarketOpen] = useState(false);
  const [isManagerFinancesOpen, setIsManagerFinancesOpen] = useState(false);
  const [isManagerCareerOpen, setIsManagerCareerOpen] = useState(false);
  const [isTacticalBoardOpen, setIsTacticalBoardOpen] = useState(false);
  const [isManagerSpeechOpen, setIsManagerSpeechOpen] = useState(false);

  useEffect(() => {
    if (!playerProfile && !managerProfile) {
      router.push('/new-career');
    } else {
      initDatabaseIfEmpty();
    }
  }, [playerProfile, managerProfile, router, initDatabaseIfEmpty]);

  // Dispara confetes se for promovido
  useEffect(() => {
    if (promotionModalOpen) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#ffffff'],
      });
    }
  }, [promotionModalOpen]);

  if (!playerProfile && !managerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">Carregando carreira...</p>
        </div>
      </div>
    );
  }

  const activeClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;
  const currentClub = activeClubId ? clubs[activeClubId] : null;

  // Busca próxima partida real do clube na semana atual
  const isYouth = mode === 'player' && playerProfile?.isYouthTeam;
  const nextFixture = allFixtures?.find((f) => 
    f.week === currentWeek && 
    (f.homeClubId === activeClubId || f.awayClubId === activeClubId) &&
    (isYouth ? f.isYouth || f.competition === 'sub_20' : !f.isYouth)
  ) || allFixtures?.find((f) => !f.isPlayed);

  const homeClub = nextFixture ? clubs[nextFixture.homeClubId] : currentClub;
  const awayClub = nextFixture ? clubs[nextFixture.awayClubId] : currentClub;

  // Verificação de Clássico / Rivalidade Histórica
  const isDerby = Boolean(
    (homeClub?.rivalClubIds && awayClub?.id && homeClub.rivalClubIds.includes(awayClub.id)) ||
    (awayClub?.rivalClubIds && homeClub?.id && awayClub.rivalClubIds.includes(homeClub.id))
  );
  const derbyName = homeClub?.derbyName || awayClub?.derbyName || 'Super Clássico das Multidões';

  const handleDrinkNrg = (type?: NRGType) => {
    const res = drinkEnergyCan(type);
    playKick();
    setNrgToast(res.message);
    setTimeout(() => setNrgToast(null), 3500);
  };

  const handleToggleRole = (role: 'captain' | 'penalty' | 'freekick') => {
    const res = togglePlayerTacticalRole(role);
    playKick();
    setRoleToast(res.message);
    setTimeout(() => setRoleToast(null), 3500);
  };

  const handleFinishLiveMatch = () => {
    setIsLiveMatchOpen(false);
    playWhistle();
    advanceWeek();
    setIsControversyModalOpen(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#fbbf24', '#ffffff'],
    });
  };

  const handleAdvanceWeek = () => {
    playKick();
    setAdvancing(true);
    advanceWeek();
    setRoundResultModalOpen(true);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.85 },
      colors: ['#10b981', '#fbbf24'],
    });
    setTimeout(() => {
      setAdvancing(false);
    }, 350);
  };

  const trainingOptions: { id: TrainingFocus; label: string; desc: string; icon: any }[] = [
    { id: 'finishing', label: 'Finalização & Frieza', desc: '+Chute e Compostura', icon: Target },
    { id: 'pace', label: 'Velocidade & Drible', desc: '+Ritmo e Controle', icon: Zap },
    { id: 'passing', label: 'Passe & Visão', desc: '+Passe e Assistências', icon: Sparkles },
    { id: 'defending', label: 'Combate Defensivo', desc: '+Desarme e Físico', icon: Trophy },
    { id: 'physical', label: 'Resistência & Força', desc: '+Físico e Corrida', icon: Activity },
    { id: 'rest', label: 'Descanso Regenerativo', desc: '+40 de Energia', icon: Smile },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Navegação Rápida de Abas do Dashboard */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-border text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/15 text-emerald-500 font-extrabold border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'roster'
                  ? 'bg-emerald-500/15 text-emerald-500 font-extrabold border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {mode === 'player' ? 'Minha Ficha & Elenco' : 'Gestão do Elenco'}
            </button>
            <Link
              href="/competicoes"
              className="py-2 px-3.5 rounded-xl text-muted-foreground hover:text-foreground flex items-center gap-1.5 shrink-0"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Tabelas & Ligas
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
            <Link
              href="/ranking"
              className="py-2 px-3.5 rounded-xl text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1.5 shrink-0"
            >
              <Award className="w-3.5 h-3.5" />
              Rankings & The Best
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
            <button
              onClick={() => setActiveTab('life')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'life'
                  ? 'bg-emerald-500/15 text-emerald-500 font-extrabold border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              {mode === 'player' ? 'Fora de Campo (Vida)' : 'Diretoria & Finanças'}
            </button>
          </div>

          {/* ============================================================ */}
          {/* ABA 1: VISÃO GERAL */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Banner de Proposta de Transferência (Mercado da Bola) */}
              {pendingTransferOffer && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-amber-500/10 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl animate-bounce">💼</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded">
                          Mercado da Bola Oficial
                        </span>
                        <h4 className="font-display text-sm sm:text-base font-black text-foreground">
                          Proposta Oficial de Contratação do {pendingTransferOffer.fromClubName}!
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Salário oferecido de {formatCurrency(pendingTransferOffer.weeklyWageOffer)}/semana + Luvas de {formatCurrency(pendingTransferOffer.signingBonus)}.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shrink-0 cursor-pointer shadow-md transition-transform active:scale-95"
                  >
                    Analisar Proposta →
                  </button>
                </div>
              )}

              {/* Card Destaque: Perfil do Personagem */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-card via-card to-emerald-950/20 border border-border shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
                  <Image
                    src="/images/field-pattern.svg"
                    alt="Campo de Futebol"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Identidade com Avatar SVG e Escudos */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Avatar Gráfico Personalizável */}
                    <div 
                      className="relative group cursor-pointer shrink-0" 
                      onClick={() => setIsAvatarCreatorOpen(true)}
                      title="Clique para editar visual do atleta/treinador"
                    >
                      <AvatarDisplay 
                        avatar={mode === 'player' ? playerProfile?.avatar : managerProfile?.avatar} 
                        age={mode === 'player' ? playerProfile?.age : managerProfile?.age}
                        size="md" 
                        className="ring-2 ring-emerald-500/50 hover:ring-emerald-400 transition-all rounded-full shadow-lg" 
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-black text-white">
                        ✏️
                      </div>
                    </div>

                    {mode === 'player' && playerProfile && (
                      <OverallBadge overall={playerProfile.overall} size="lg" showLabel />
                    )}

                    {currentClub && (
                      <ClubBadge
                        primaryColor={currentClub.primaryColor}
                        secondaryColor={currentClub.secondaryColor}
                        shortName={currentClub.shortName}
                        size="lg"
                      />
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                          {mode === 'player' ? playerProfile?.name : managerProfile?.name}
                        </h2>
                        {mode === 'player' && playerProfile && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Titularidade Dinâmica baseada em Confiança do Técnico (coachTrust) */}
                            {(() => {
                              const trust = playerProfile.coachTrust ?? playerProfile.relationshipManager ?? 60;
                              const isBenched = playerProfile.isBenched || trust < 35;
                              const isCaptain = playerProfile.isCaptain || trust >= 80;

                              if (playerProfile.isYouthTeam) {
                                return (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border bg-amber-500/15 border-amber-500/30 text-amber-400">
                                    Reserves / Sub-20
                                  </span>
                                );
                              }

                              if (isBenched) {
                                return (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse">
                                    🔴 Reserva (Barrado pelo Técnico)
                                  </span>
                                );
                              }

                              if (isCaptain) {
                                return (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                    <span>©️</span>
                                    <span>Capitão Titular</span>
                                  </span>
                                );
                              }

                              return (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
                                  🟢 Titular Absoluto
                                </span>
                              );
                            })()}

                            {/* Badge 2: Match Fit (NSS Condição Física) */}
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              playerProfile.energy >= 70
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                : playerProfile.energy >= 40
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                : 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse'
                            }`}>
                              {playerProfile.energy >= 70 ? '✓ Match Fit' : playerProfile.energy >= 40 ? '⚠️ Cansado' : '🚨 Exausto'}
                            </span>

                            {/* Badge 3: Star Rating (NSS) */}
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-black flex items-center gap-1">
                              <span>⭐</span>
                              <span>{(playerProfile.overall / 18).toFixed(1)}</span>
                            </span>

                            {/* Badge 4: Chuteira Equipada */}
                            {(() => {
                              const b = getBootById(playerProfile.equippedBootId || 'classic_black');
                              return b ? (
                                <button
                                  type="button"
                                  onClick={() => setIsShopModalOpen(true)}
                                  className="px-2 py-0.5 rounded-md bg-secondary border border-border text-foreground hover:border-emerald-500/40 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                  title="Clique para gerenciar chuteiras na Loja"
                                >
                                  {b.image ? (
                                    <img src={b.image} alt={b.name} loading="lazy" decoding="async" className="w-4 h-3 object-contain shrink-0" />
                                  ) : (
                                    <span>{b.icon}</span>
                                  )}
                                  <span>{b.name}</span>
                                </button>
                              ) : null;
                            })()}

                            {/* Badge 5: Cobrador de Pênalti */}
                            {playerProfile.isPenaltyTaker && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span>🎯</span>
                                <span>Pênaltis</span>
                              </span>
                            )}

                            {/* Badge 6: Cobrador de Falta */}
                            {playerProfile.isFreeKickTaker && (
                              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span>☄️</span>
                                <span>Faltas</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{currentClub?.name}</span>
                        <span>•</span>
                        <span>Série {currentClub?.division}</span>
                        <span>•</span>
                        <span>
                          {mode === 'player' 
                            ? `${playerProfile?.age} anos • ${playerProfile?.position} (${playerProfile?.style})` 
                            : `${managerProfile?.age} anos • Formação ${managerProfile?.formation}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Barras de Status Oficiais do Atleta (4 Relacionamentos + Energia + Salário) */}
                  {mode === 'player' && playerProfile && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      {/* 1. Torcida */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-black text-blue-400 mb-1">
                          <Users className="w-3 h-3" />
                          <span>{playerProfile.fanApproval ?? playerProfile.relationshipFans ?? 75}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${playerProfile.fanApproval ?? playerProfile.relationshipFans ?? 75}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Torcida
                        </span>
                      </div>

                      {/* 2. Técnico */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-black text-emerald-400 mb-1">
                          <Target className="w-3 h-3" />
                          <span>{playerProfile.coachTrust ?? playerProfile.relationshipManager ?? 80}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${playerProfile.coachTrust ?? playerProfile.relationshipManager ?? 80}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Técnico
                        </span>
                      </div>

                      {/* 3. Elenco / Vestiário */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-black text-amber-400 mb-1">
                          <Flame className="w-3 h-3" />
                          <span>{playerProfile.squadChemistry ?? 65}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${playerProfile.squadChemistry ?? 65}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Elenco
                        </span>
                      </div>

                      {/* 4. Família / Pessoal */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-black text-rose-400 mb-1">
                          <Star className="w-3 h-3 fill-rose-400 text-rose-400" />
                          <span>{playerProfile.familyHappiness ?? playerProfile.relationshipFamily ?? 60}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all"
                            style={{ width: `${playerProfile.familyHappiness ?? playerProfile.relationshipFamily ?? 60}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Família
                        </span>
                      </div>

                      {/* 5. Energia */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-black text-emerald-400 mb-1">
                          <Activity className="w-3 h-3" />
                          <span>{playerProfile.energy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${playerProfile.energy}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Energia
                        </span>
                      </div>

                      {/* 6. Salário Semanal */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-black text-foreground mb-1">
                          <Coins className="w-3 h-3 text-emerald-500" />
                          <span>{formatCurrency(playerProfile.weeklyWage)}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-2.5 uppercase font-bold">
                          Salário/sem
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Barras de Relacionamento do Treinador */}
                  {mode === 'manager' && managerProfile && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      {/* 1. Torcida */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-xs font-black text-blue-400 mb-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{managerProfile.fanApproval ?? managerProfile.fansConfidence ?? 65}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${managerProfile.fanApproval ?? managerProfile.fansConfidence ?? 65}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Torcida
                        </span>
                      </div>

                      {/* 2. Diretoria */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-xs font-black text-emerald-400 mb-1">
                          <Target className="w-3.5 h-3.5" />
                          <span>{managerProfile.boardTrust ?? managerProfile.boardConfidence ?? 70}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${managerProfile.boardTrust ?? managerProfile.boardConfidence ?? 70}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Diretoria
                        </span>
                      </div>

                      {/* 3. Vestiário / Moral */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-xs font-black text-amber-400 mb-1">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>{managerProfile.squadMorale ?? 65}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${managerProfile.squadMorale ?? 65}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Moral Vestiário
                        </span>
                      </div>

                      {/* 4. Imprensa */}
                      <div className="text-center p-2 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-center gap-1 text-xs font-black text-purple-400 mb-1">
                          <Star className="w-3.5 h-3.5 fill-purple-400" />
                          <span>{managerProfile.mediaReputation ?? managerProfile.reputation ?? 60}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${managerProfile.mediaReputation ?? managerProfile.reputation ?? 60}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground block mt-1 uppercase font-bold">
                          Imprensa / Mídia
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTRAL DE COMANDOS DO TREINADOR (6 TELAS OFICIAIS + MINIJOGOS) */}
              {mode === 'manager' && managerProfile && (
                <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950/80 border-2 border-emerald-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-black text-sm">📋 GESTÃO DO CLUBE</span>
                      <span className="text-[11px] text-zinc-400">· Painel Oficial do Treinador</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* MasterStyle de Ouro Ativo */}
                      {(() => {
                        const goldStyle = getManagerPlayStyleGoldById(managerProfile.goldPlayStyle || 'mastermind_gold');
                        return goldStyle ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black text-xs shadow-sm">
                            <span>{goldStyle.icon}</span>
                            <span>{goldStyle.name}</span>
                          </div>
                        ) : null;
                      })()}
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        Formação: {managerProfile.formation || '4-3-3'}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                        Entrosamento: {managerProfile.entrosamento ?? 65}%
                      </span>
                    </div>
                  </div>

                  {/* 2 MINIJOGOS INTERATIVOS OFICIAIS DO TREINADOR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-amber-950/40 border border-emerald-500/30">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
                          📋
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black text-white">Prancheta Tática</h4>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Minijogo</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">Desenhe triangulações e ganhe +10% de entrosamento</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsTacticalBoardOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0 ml-2 shadow-sm"
                      >
                        Treinar Jogada
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-amber-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                          🎙️
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black text-white">Preleção de Vestiário</h4>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">Minijogo</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">Acerte o tom motivacional e ganhe +20 de moral</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsManagerSpeechOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0 ml-2 shadow-sm"
                      >
                        Fazer Preleção
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                    <button
                      onClick={() => setIsManagerRosterOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 transition group cursor-pointer"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">👥</span>
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Elenco</span>
                      <span className="text-[10px] text-zinc-400">Titulares & Banco</span>
                    </button>

                    <button
                      onClick={() => setIsManagerTacticsOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 transition group cursor-pointer"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">⚽</span>
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Tática</span>
                      <span className="text-[10px] text-zinc-400">Campinho & Postura</span>
                    </button>

                    <button
                      onClick={() => setIsManagerTrainingOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 transition group cursor-pointer"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🏋️</span>
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Treino</span>
                      <span className="text-[10px] text-zinc-400">CT & Individual</span>
                    </button>

                    <button
                      onClick={() => setIsManagerTransferMarketOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 transition group cursor-pointer"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🔎</span>
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Mercado</span>
                      <span className="text-[10px] text-zinc-400">Olheiros & Compras</span>
                    </button>

                    <button
                      onClick={() => setIsManagerFinancesOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 transition group cursor-pointer"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">💰</span>
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Finanças</span>
                      <span className="text-[10px] text-zinc-400">Estádio & Diretoria</span>
                    </button>

                    <button
                      onClick={() => setIsManagerCareerOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 transition group cursor-pointer"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📜</span>
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Carreira</span>
                      <span className="text-[10px] text-zinc-400">Ficha & Troféus</span>
                    </button>
                  </div>

                  {/* Ações Especiais de Vestiário & Bola Oficial */}
                  <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const res = holdLockerRoomMeeting();
                        setMeetingToast({ message: res.message, success: res.success });
                        setTimeout(() => setMeetingToast(null), 3500);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>🗣️</span>
                      <span>Reunião de Vestiário (+15 Moral)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">Bola da Partida:</span>
                      {(() => {
                        const ball = getBallById(equippedBallId || 'classic_capotao');
                        return (
                          <button
                            type="button"
                            onClick={() => setIsShopModalOpen(true)}
                            className="py-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {ball?.image ? (
                              <img src={ball.image} alt={ball.name} loading="lazy" decoding="async" className="w-4 h-4 object-contain shrink-0" />
                            ) : (
                              <span>{ball?.icon || '⚽'}</span>
                            )}
                            <span>{ball?.name || 'Capotão'}</span>
                            <span className="text-[10px] text-emerald-400">({ball?.rarity || 'Comum'})</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* FEEDBACK DE REUNIÃO DE VESTIÁRIO */}
              {meetingToast && (
                <div className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200 shadow-lg ${
                  meetingToast.success 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10' 
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/10'
                }`}>
                  <Users className="w-4 h-4" />
                  <span>{meetingToast.message}</span>
                </div>
              )}

              {/* FEEDBACK AO CONSUMIR ENERGÉTICO NRG */}
              {nrgToast && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200 shadow-lg shadow-emerald-500/10">
                  <Zap className="w-4 h-4 text-emerald-400 fill-current animate-bounce" />
                  <span>{nrgToast}</span>
                </div>
              )}

              {/* FEEDBACK DE FUNÇÃO TÁTICA ASSUMIDA */}
              {roleToast && (
                <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200 shadow-lg shadow-amber-500/10">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>{roleToast}</span>
                </div>
              )}

              {/* CARD DE GESTÃO DO ATLETA ESTILO NEW STAR SOCCER (NSS) */}
              {mode === 'player' && playerProfile && (
                <div className="p-5 sm:p-6 rounded-3xl bg-card border-2 border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black">
                        ⚡
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            Vida de Atleta • Estilo New Star Soccer
                          </span>
                          <span className="text-xs text-amber-400 flex items-center">
                            {'★'.repeat(Math.min(5, Math.max(1, Math.round(playerProfile.overall / 18))))}
                            <span className="text-muted-foreground ml-1 text-[11px] font-mono">
                              ({(playerProfile.overall / 18).toFixed(1)} estrelas)
                            </span>
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-black text-foreground">
                          Painel de Equipamentos, Energia & Staff
                        </h3>
                      </div>
                    </div>

                    {/* Botões Rápidos da Loja, Arena Online e Treino */}
                    <div className="flex items-center gap-2">
                      <Link
                        href="/online"
                        className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md shadow-emerald-500/25"
                      >
                        <Swords className="w-3.5 h-3.5 fill-current" />
                        Arena Online X1
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIsShopModalOpen(true)}
                        className="py-2 px-3.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Loja do Atleta
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTrainingType('penalty');
                          setIsTrainingModalOpen(true);
                        }}
                        className="py-2 px-3.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Target className="w-3.5 h-3.5 text-emerald-400" />
                        Minigames
                      </button>
                    </div>
                  </div>

                  {/* SEÇÃO 1: PAINEL DE NRG DRINKS (4 LATINHAS DO NEW STAR SOCCER) */}
                  <div className="bg-secondary/40 p-4 rounded-2xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🥤</span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                            NRG Drinks • Estoque de Energia (NSS)
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Latinhas de recuperação física rápida para as partidas
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsShopModalOpen(true)}
                        className="py-1 px-2.5 rounded-lg bg-card border border-border text-[11px] font-black text-foreground hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        + Comprar Latinhas
                      </button>
                    </div>

                    {/* Grade das 4 Latinhas Clássicas */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {NRG_DRINKS_CATALOG.map((drink) => {
                        const inv = playerProfile.nrgInventory || { 
                          classic: playerProfile.energyDrinksCount || 0, 
                          power: 0, 
                          focus: 0, 
                          gold: 0 
                        };
                        const stock = inv[drink.id] || 0;
                        const isMax = playerProfile.energy >= 100;

                        return (
                          <div 
                            key={drink.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                              stock > 0 
                                ? 'bg-card border-border shadow-sm' 
                                : 'bg-secondary/40 border-border/60 opacity-65'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${drink.bgGradient} text-white flex items-center justify-center text-sm shadow-sm`}>
                                  {drink.icon}
                                </div>
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${drink.badgeColor}`}>
                                  {drink.colorName}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-black text-foreground">
                                {stock} {stock === 1 ? 'lata' : 'latas'}
                              </span>
                            </div>

                            <div>
                              <span className="text-xs font-bold text-foreground block truncate">
                                {drink.name}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-semibold block">
                                +{drink.energyBonus}% NRG
                              </span>
                            </div>

                            <button
                              type="button"
                              disabled={stock <= 0 || isMax}
                              onClick={() => handleDrinkNrg(drink.id)}
                              className={`w-full py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                stock > 0 && !isMax
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm active:scale-95'
                                  : 'bg-secondary text-muted-foreground opacity-40 cursor-not-allowed'
                              }`}
                            >
                              <Zap className="w-3 h-3 fill-current" />
                              {isMax ? 'Cheio' : stock > 0 ? 'Beber' : 'Sem Estoque'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SEÇÃO 2: CHUTEIRAS COM BÔNUS DE ATRIBUTOS E DESGASTE (NSS) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Card de Chuteira Equipada */}
                    <div 
                      onClick={() => setIsShopModalOpen(true)}
                      className="p-4 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border transition-all cursor-pointer flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">👟</span>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                              Chuteira Equipada • Boots (NSS)
                            </span>
                            <h4 className="font-display text-sm font-black text-foreground">
                              {playerProfile.activeBoot ? playerProfile.activeBoot.name : 'Chuteira Gasta'}
                            </h4>
                          </div>
                        </div>

                        {playerProfile.activeBoot && (
                          <span 
                            className="w-4 h-4 rounded-full border border-white/40 shadow-inner" 
                            style={{ backgroundColor: playerProfile.activeBoot.color || '#18181b' }}
                            title="Cor da chuteira"
                          />
                        )}
                      </div>

                      {/* Barras de Atributos da Chuteira */}
                      {playerProfile.activeBoot ? (
                        <div className="grid grid-cols-3 gap-2 bg-card/70 p-2 rounded-xl border border-border text-center">
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold block">Ritmo</span>
                            <span className="font-mono text-xs font-black text-emerald-400">
                              +{playerProfile.activeBoot.bonus.pace || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold block">Força</span>
                            <span className="font-mono text-xs font-black text-emerald-400">
                              +{playerProfile.activeBoot.bonus.shooting || playerProfile.activeBoot.bonus.power || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold block">Técnica</span>
                            <span className="font-mono text-xs font-black text-emerald-400">
                              +{playerProfile.activeBoot.bonus.passing || playerProfile.activeBoot.bonus.technique || 0}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Nenhuma chuteira equipada. Compre um par na loja para ativar os bônus.
                        </p>
                      )}

                      {/* Durabilidade Restante */}
                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {playerProfile.activeBoot 
                            ? `${playerProfile.activeBoot.matchesRemaining} partidas restantes`
                            : '0 partidas'}
                        </span>
                        <span className="text-emerald-400 font-bold hover:underline">
                          Trocar / Comprar ➔
                        </span>
                      </div>
                    </div>

                    {/* Card de Pessoal & Staff */}
                    <div 
                      onClick={() => setIsShopModalOpen(true)}
                      className="p-4 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border transition-all cursor-pointer flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-sky-400" />
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                              Staff & Equipe Pessoal
                            </span>
                            <h4 className="font-display text-sm font-black text-foreground">
                              {playerProfile.staff?.agent ? playerProfile.staff.agent.name : 'Sem Agente Contratado'}
                            </h4>
                          </div>
                        </div>
                        <span className="text-xs text-sky-400 font-bold">Ver Equipe</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-muted-foreground bg-card/70 p-2.5 rounded-xl border border-border">
                        <div className="flex items-center justify-between">
                          <span>Empresário:</span>
                          <strong className="text-foreground">{playerProfile.staff?.agent ? '✓ Ativo' : 'Não'}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Fisioterapeuta:</span>
                          <strong className="text-foreground">{playerProfile.staff?.physio ? '✓ Ativo' : 'Não'}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Assessora de Imprensa:</span>
                          <strong className="text-foreground">{playerProfile.staff?.press ? '✓ Ativo' : 'Não'}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {playerProfile.staff?.physio ? 'Recuperação física acelerada' : 'Contrate para evitar lesões'}
                        </span>
                        <span className="text-sky-400 font-bold hover:underline">
                          Gerenciar ➔
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD DE COLETIVA DE IMPRENSA / POLÊMICA HISTÓRICA */}
              {pendingControversy ? (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-amber-500/10 border-2 border-rose-500/50 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30 animate-pulse">
                        <Mic className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500 text-zinc-950">
                            🔴 Coletiva Urgente
                          </span>
                          <span className="text-xs text-rose-400 font-bold">
                            {pendingControversy.title}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-foreground italic max-w-xl">
                          “{pendingControversy.reporterQuestion.replace(/^["'“”]+|["'“”]+$/g, '').trim()}”
                        </p>
                        <span className="text-[11px] text-muted-foreground block mt-1">
                          {pendingControversy.realLifeInspiration}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsControversyModalOpen(true)}
                      className="py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Mic className="w-4 h-4" />
                      Responder aos Repórteres
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mic className="w-4 h-4 text-emerald-500" />
                    <span>Nenhuma coletiva pendente nesta semana. A imprensa está calma nos bastidores.</span>
                  </div>
                  <button
                    onClick={() => {
                      triggerRandomControversy();
                      setIsControversyModalOpen(true);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-card hover:bg-secondary border border-border text-foreground font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Simular Coletiva Polêmica
                  </button>
                </div>
              )}

              {/* FOCO DE TREINO SEMANAL (MODO JOGADOR) */}
              {mode === 'player' && playerProfile && (
                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        Foco de Treino da Semana
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Defina qual fundamento seu atleta priorizará nas sessões de treinamento semanais.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                    {trainingOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = (playerProfile.trainingFocus || 'finishing') === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setTrainingFocus(opt.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                              : 'border-border bg-secondary/50 hover:bg-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block text-[11px] leading-tight">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              {opt.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grid 2 Colunas: Próxima Partida & Ações Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna 1 & 2: Próxima Partida */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        Próxima Partida • Rodada {currentWeek} de 48
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-secondary text-emerald-500">
                        {nextFixture?.competition === 'sub_20' ? 'Copa Sub-20' : nextFixture?.competition === 'copa_brasil' ? 'Copa do Brasil' : `Série ${currentClub?.division}`}
                      </span>
                    </div>

                    {/* Faixa de Clássico / Rivalidade */}
                    {isDerby && (
                      <div className="mb-3 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600/25 via-amber-500/25 to-red-600/25 border border-red-500/40 text-center flex items-center justify-center gap-2 animate-pulse">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span className="font-display text-xs font-black uppercase tracking-wider text-red-400">
                          🔥 {derbyName} • Clássico Decisivo (Moral da Torcida x2)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confronto */}
                  <div className="flex items-center justify-around py-4">
                    {/* Mandante */}
                    <div className="flex flex-col items-center text-center gap-2">
                      <ClubBadge
                        primaryColor={homeClub?.primaryColor || '#10b981'}
                        secondaryColor={homeClub?.secondaryColor || '#ffffff'}
                        shortName={homeClub?.shortName || 'CAS'}
                        size="lg"
                      />
                      <div>
                        <span className="font-display text-base font-bold text-foreground block max-w-[120px] truncate">
                          {homeClub?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Mandante</span>
                      </div>
                    </div>

                    <div className="text-center px-4">
                      <span className="font-display text-3xl font-black text-muted-foreground">
                        VS
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-500 block mt-1">
                        Estádio {homeClub?.stadiumName}
                      </span>
                    </div>

                    {/* Visitante */}
                    <div className="flex flex-col items-center text-center gap-2">
                      <ClubBadge
                        primaryColor={awayClub?.primaryColor || '#0284c7'}
                        secondaryColor={awayClub?.secondaryColor || '#ffffff'}
                        shortName={awayClub?.shortName || 'VIS'}
                        size="lg"
                      />
                      <div>
                        <span className="font-display text-base font-bold text-foreground block max-w-[120px] truncate">
                          {awayClub?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Visitante</span>
                      </div>
                    </div>
                  </div>

                  {/* Seus Companheiros de Equipe Titulares */}
                  {currentClub && (
                    <div className="p-3 rounded-xl bg-secondary/40 border border-border mt-1 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          {mode === 'player' ? 'Seus Companheiros Titulares no Time' : 'Escalação Titular do seu Clube'}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">Formação 4-3-3</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        {((isYouth ? currentClub.youthRoster : currentClub.roster) || []).slice(0, 11).map((teammate, idx) => {
                          const isUser = mode === 'player' && (teammate.id === playerProfile?.id || idx === 10);
                          return (
                            <div
                              key={teammate.id}
                              className={`px-2 py-1 rounded-lg border text-[10px] shrink-0 flex items-center gap-1 ${
                                isUser 
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black' 
                                  : 'bg-card/70 border-border text-foreground font-semibold'
                              }`}
                            >
                              <span className="text-muted-foreground font-mono">#{idx + 1}</span>
                              <span className="truncate max-w-[80px]">{isUser ? (playerProfile?.nickname || 'VOCÊ') : teammate.name.split(' ')[0]}</span>
                              <span className="text-[9px] text-emerald-400 font-mono">({isUser ? (playerProfile?.position || teammate.position) : teammate.position})</span>
                              {isUser && <span className="text-[8px] bg-emerald-500 text-zinc-950 px-1 rounded font-black">VOCÊ</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Botões de Ação da Partida (Ao Vivo x Simulação Rápida) */}
                  <div className="pt-4 border-t border-border mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {mode === 'player' && playerProfile?.isYouthTeam
                        ? 'Você está escalado no time Sub-20 nesta rodada.'
                        : 'Elenco principal pronto para o confronto.'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playWhistle();
                          setIsLiveMatchOpen(true);
                        }}
                        className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-emerald-500/25 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Jogar Partida (Ao Vivo)
                      </button>

                      <button
                        type="button"
                        onClick={handleAdvanceWeek}
                        disabled={advancing}
                        className="py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                        {advancing ? 'Simulando...' : 'Simulação Rápida'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Atalhos Rápidos */}
                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Menu Central
                  </span>

                  <div className="space-y-2">
                    {/* 1. Cartinha PNG para Viralizar */}
                    <button
                      onClick={() => setIsShareCardOpen(true)}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-400/10 hover:from-amber-500/25 hover:to-amber-400/20 text-amber-400 text-xs font-black flex items-center justify-between transition-colors border border-amber-500/30 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Cartinha Oficial (PNG Viral)
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>

                    {/* 2. Rede Social da Torcida */}
                    <button
                      onClick={() => setIsTorcidaFeedOpen(true)}
                      className="w-full p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquareQuote className="w-4 h-4 text-sky-400" />
                        Rede Social da Torcida
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                    {/* 3. Hall da Fama & Conquistas */}
                    <button
                      onClick={() => setIsAchievementsOpen(true)}
                      className="w-full p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Hall da Fama & Badges
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                    {/* 4. Seleção Brasileira */}
                    <button
                      onClick={() => setIsNationalTeamOpen(true)}
                      className="w-full p-2.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 dark:text-yellow-400 text-xs font-bold flex items-center justify-between transition-colors border border-yellow-500/20 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">🇧🇷</span>
                        Seleção Brasileira (Amarelinha)
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-yellow-500" />
                    </button>

                    {/* 5. Modo Desafios */}
                    <Link
                      href="/desafios"
                      className="w-full p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-500" />
                        Modo Desafios (Cenários)
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>

                    <Link
                      href="/competicoes"
                      className="w-full p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        Tabelas & Copa do Brasil
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>

                    <Link
                      href="/ranking"
                      className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 text-xs font-bold flex items-center justify-between transition-colors border border-amber-500/20"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        Rankings & Brasfoot
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    </Link>

                    <button
                      onClick={() => {
                        if (!pendingTransferOffer) triggerTransferOffer();
                        setIsTransferModalOpen(true);
                      }}
                      className="w-full p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-500" />
                        Mercado da Bola {pendingTransferOffer ? '🔴 (1 Proposta)' : '(Sondar)'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                    <button
                      onClick={() => setActiveTab('roster')}
                      className="w-full p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-400" />
                        Ficha Técnica de Atributos
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-500 font-semibold leading-relaxed">
                    ⚽ <strong>Fase 2 Ativa:</strong> Calendário de 48 semanas, Copa do Brasil, Copinha Sub-20 e evolução contínua funcionando.
                  </div>
                </div>
              </div>

              {/* Bloco: Feed das 3 Últimas Notícias */}
              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-black text-foreground flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-emerald-500" />
                    Últimas Manchetes da Semana
                  </h3>
                  <Link
                    href="/noticias"
                    className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-0.5"
                  >
                    Ver Diário Completo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-border">
                  {newsFeed.slice(0, 3).map((news) => (
                    <div key={news.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 group">
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-border">
                        <Image
                          src={news.imageUrl || (news.category === 'drama' ? '/images/news/coletiva.webp' : '/images/news/estadio.webp')}
                          alt={news.headline}
                          fill
                          loading="lazy"
                          decoding="async"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500">
                            {news.portalName || news.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Semana {news.week} • {news.seasonYear}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug truncate group-hover:text-emerald-400 transition-colors">
                          {news.headline}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">
                          {news.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ABA 2: ELENCO & ATRIBUTOS */}
          {/* ============================================================ */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              {/* Prancheta Tática & Gestão dos 11 Titulares vs Reservas */}
              <TacticsBoard />

              {mode === 'player' && playerProfile && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-5">
                  {/* Cabeçalho do Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          Ficha Oficial do Craque
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          Camisa #{playerProfile.jerseyNumber || 10} • {playerProfile.preferredFoot === 'right' ? 'Destro' : playerProfile.preferredFoot === 'left' ? 'Canhoto' : 'Ambidestro (5★)'}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-black text-foreground mt-1">
                        14 Atributos de Jogo & Habilidade de Ouro
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Evolução balanceada por treinos, desempenho em campo e bônus da Habilidade de Ouro.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <OverallBadge overall={playerProfile.overall} size="lg" showLabel />
                    </div>
                  </div>

                  {/* Card da Habilidade de Ouro (PlayStyle Gold Ativo) */}
                  {(() => {
                    const activePlayStyle = getPlayStyleGoldById(playerProfile.goldPlayStyle || 'rapid_gold');
                    if (!activePlayStyle) return null;

                    return (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2.5 rounded-2xl bg-card border border-amber-500/30 shadow-md">
                            {activePlayStyle.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                                PlayStyle de Ouro Ativo
                              </span>
                              <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                                +{formatCurrency(activePlayStyle.value)}
                              </span>
                            </div>
                            <h4 className="font-display text-base font-black text-foreground">
                              {activePlayStyle.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                              {activePlayStyle.tagline} • {activePlayStyle.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap sm:flex-col sm:items-end shrink-0">
                          <span className="text-[9px] font-black uppercase text-emerald-400">
                            Bônus Aplicado:
                          </span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {Object.entries(activePlayStyle.initialBoost).map(([k, val]) => (
                              <span
                                key={k}
                                className="text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-sm"
                              >
                                +{val} {k === 'pace' ? 'Velocidade' :
                                       k === 'dribbling' ? 'Drible' :
                                       k === 'finishing' ? 'Finalização' :
                                       k === 'shooting' ? 'Chute' :
                                       k === 'passing' ? 'Passe' :
                                       k === 'playmaker' ? 'Armador' :
                                       k === 'tackling' ? 'Desarme' :
                                       k === 'defending' ? 'Defesa' :
                                       k === 'crossing' ? 'Cruzamento' :
                                       k === 'heading' ? 'Cabeceio' :
                                       k === 'jumping' ? 'Salto' :
                                       k === 'elasticity' ? 'Elasticidade' : k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Diagnóstico Tático: Pontos Positivos e Negativos da Combinação Posição x Pé */}
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                    <div className="flex items-center justify-between border-b border-border/80 pb-1.5">
                      <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-emerald-400" />
                        Diagnóstico Tático: {playerProfile.position} • {playerProfile.preferredFoot === 'right' ? 'Destro' : playerProfile.preferredFoot === 'left' ? 'Canhoto' : 'Ambidestro (5★)'}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {playerProfile.tacticalRoleBonus || 'Função em Campo'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Vantagens / Pontos Positivos */}
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {playerProfile.preferredFoot === 'both' ? '👑 Benefício Total PRO (Zero Pontos Negativos)' : 'Pontos Positivos (+)'}
                        </span>
                        <ul className="space-y-1 text-xs text-emerald-300 font-medium leading-snug">
                          {playerProfile.tacticalPros && playerProfile.tacticalPros.length > 0 ? (
                            playerProfile.tacticalPros.map((pro, idx) => (
                              <li key={idx}>• {pro}</li>
                            ))
                          ) : (
                            <li>• Pé dominante alinhado com as rotinas táticas da posição.</li>
                          )}
                        </ul>
                      </div>

                      {/* Pontos Negativos */}
                      {playerProfile.preferredFoot === 'both' ? (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-center">
                          <span className="text-xs font-bold text-amber-400">
                            ⭐ Recurso PRO Ambidestro: Chuta, corta e cruza com a mesma precisão em ambos os lados!
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Pontos Negativos da Combinação (-)
                          </span>
                          <ul className="space-y-1 text-xs text-rose-300 font-medium leading-snug">
                            {playerProfile.tacticalCons && playerProfile.tacticalCons.length > 0 ? (
                              playerProfile.tacticalCons.map((con, idx) => (
                                <li key={idx}>• {con}</li>
                              ))
                            ) : (
                              <li>• Uso limitado da perna ruim em bolas de primeira na linha lateral.</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grid Completo dos 14 Atributos Requeridos com Bônus da Chuteira Equipada */}
                  {(() => {
                    const activeBoot = getBootById(playerProfile.equippedBootId || 'classic_black');
                    const bootBonus = activeBoot?.bonusAttributes || {};

                    const attributesList = [
                      { name: 'Velocidade', val: playerProfile.attributes.pace, bonus: bootBonus.pace || 0, icon: '⚡', highlight: playerProfile.position === 'PE' || playerProfile.position === 'PD' },
                      { name: 'Drible', val: playerProfile.attributes.dribbling, bonus: bootBonus.dribbling || 0, icon: '⚽', highlight: playerProfile.position === 'PE' || playerProfile.position === 'PD' },
                      { name: 'Desarme', val: playerProfile.attributes.tackling ?? playerProfile.attributes.defending, bonus: bootBonus.defending || 0, icon: '🛡️', highlight: playerProfile.position === 'ZAG' || playerProfile.position === 'VOL' },
                      { name: 'Defesa', val: playerProfile.attributes.defending, bonus: bootBonus.defending || 0, icon: '🧱', highlight: playerProfile.position === 'ZAG' || playerProfile.position === 'VOL' },
                      { name: 'Ataque', val: playerProfile.attributes.attacking ?? playerProfile.attributes.shooting, bonus: (bootBonus.finishing || 0) + ((bootBonus as any).shotPower || bootBonus.shooting || 0), icon: '⚔️', highlight: playerProfile.position === 'ATA' },
                      { name: 'Finalização', val: playerProfile.attributes.finishing ?? playerProfile.attributes.shooting, bonus: bootBonus.finishing || 0, icon: '🎯', highlight: playerProfile.position === 'ATA' || playerProfile.position === 'PE' || playerProfile.position === 'PD' },
                      { name: 'Passe', val: playerProfile.attributes.passing, bonus: bootBonus.passing || 0, icon: '👟', highlight: playerProfile.position === 'MC' || playerProfile.position === 'MEI' },
                      { name: 'Posicionamento', val: playerProfile.attributes.positioning ?? 50, bonus: bootBonus.positioning || 0, icon: '📍', highlight: playerProfile.position === 'ATA' || playerProfile.position === 'GOL' },
                      { name: 'Cabeceio', val: playerProfile.attributes.heading ?? playerProfile.attributes.physical ?? 50, bonus: bootBonus.physical || 0, icon: '👤', highlight: playerProfile.position === 'ATA' || playerProfile.position === 'ZAG' },
                      { name: 'Cruzamento', val: playerProfile.attributes.crossing ?? playerProfile.attributes.passing, bonus: bootBonus.passing || 0, icon: '↗️', highlight: playerProfile.position === 'PE' || playerProfile.position === 'PD' || playerProfile.position === 'LE' || playerProfile.position === 'LD' },
                      { name: 'Chute', val: playerProfile.attributes.shooting, bonus: (bootBonus as any).shotPower || bootBonus.shooting || 0, icon: '🚀', highlight: playerProfile.position === 'ATA' || playerProfile.position === 'MEI' },
                      { name: 'Salto', val: playerProfile.attributes.jumping ?? playerProfile.attributes.physical ?? 50, bonus: bootBonus.physical || 0, icon: '🦘', highlight: playerProfile.position === 'ZAG' || playerProfile.position === 'GOL' },
                      { name: 'Armador', val: playerProfile.attributes.playmaker ?? playerProfile.attributes.vision ?? 50, bonus: bootBonus.vision || 0, icon: '🪄', highlight: playerProfile.position === 'MEI' || playerProfile.position === 'MC' },
                      { 
                        name: 'Elasticidade', 
                        val: playerProfile.attributes.elasticity ?? playerProfile.attributes.gkReflexes ?? 50, 
                        bonus: bootBonus.positioning || 0,
                        icon: '🧤', 
                        highlight: playerProfile.position === 'GOL',
                        isGK: true 
                      },
                    ];

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-black uppercase text-muted-foreground tracking-wider block">
                            Tabela de Atributos Oficiais (Escala 0 a 99)
                          </span>
                          {activeBoot && (
                            <button
                              type="button"
                              onClick={() => setIsShopModalOpen(true)}
                              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 transition-colors"
                            >
                              <span>{activeBoot.icon} Chuteira:</span>
                              <strong className="text-white">{activeBoot.name}</strong>
                              <span className="text-[10px] text-emerald-300">({activeBoot.rarity})</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                          {attributesList.map((attr) => (
                            <div
                              key={attr.name}
                              className={`p-3 rounded-2xl border flex flex-col justify-between gap-1 transition-all ${
                                attr.isGK && playerProfile.position === 'GOL'
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/50'
                                  : attr.highlight
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-foreground'
                                  : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{attr.icon}</span>
                                <div className="flex items-baseline gap-1">
                                  <span className="font-mono text-base font-black text-foreground">
                                    {attr.val + (attr.bonus || 0)}
                                  </span>
                                  {attr.bonus > 0 && (
                                    <span className="font-mono text-[10px] font-black text-emerald-400">
                                      (+{attr.bonus})
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-[11px] font-bold text-muted-foreground block truncate">
                                  {attr.name}
                                </span>
                                {attr.isGK && (
                                  <span className="text-[9px] uppercase font-black text-amber-400 block -mt-0.5">
                                    Goleiro
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* SEÇÃO ESPECIAL: FUNÇÕES TÁTICAS OFICIAIS DO CRAQUE (Capitão, Pênalti & Falta) */}
                  <div className="p-5 rounded-2xl bg-secondary/50 border border-border space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <span>👑</span>
                            Funções de Campo & Liderança da Equipe
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Assuma a braçadeira de capitão ou torne-se o cobrador oficial de bolas paradas da equipe.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* 1. Capitão da Equipe (©️) */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        playerProfile.isCaptain
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : 'bg-card border-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-amber-400 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
                              ©️
                            </span>
                            <div>
                              <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                                Liderança Máxima
                              </span>
                              <h4 className="font-display text-sm font-black text-foreground">
                                Capitão da Equipe
                              </h4>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            playerProfile.isCaptain
                              ? 'bg-amber-400 text-zinc-950 border-amber-300 font-black'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}>
                            {playerProfile.isCaptain ? '✓ Ativo' : 'Disponível'}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Carrega a braçadeira, comanda as preleções no vestiário e garante +15% de poder de reação do time em desvantagem no placar.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleToggleRole('captain')}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
                            playerProfile.isCaptain
                              ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                              : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                          }`}
                        >
                          {playerProfile.isCaptain ? '©️ Braçadeira Assumida (Desativar)' : 'Assumir Braçadeira de Capitão'}
                        </button>
                      </div>

                      {/* 2. Cobrador Oficial de Pênalti (🎯) */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        playerProfile.isPenaltyTaker
                          ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                          : 'bg-card border-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
                              🎯
                            </span>
                            <div>
                              <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                                Bola Parada (Cal)
                              </span>
                              <h4 className="font-display text-sm font-black text-foreground">
                                Cobrador de Pênaltis
                              </h4>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            playerProfile.isPenaltyTaker
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-black'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}>
                            {playerProfile.isPenaltyTaker ? '✓ Ativo' : 'Disponível'}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Batedor número 1 da equipe. Todos os pênaltis marcados a favor do time são cobrados por você nos momentos decisivos.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleToggleRole('penalty')}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
                            playerProfile.isPenaltyTaker
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                              : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                          }`}
                        >
                          {playerProfile.isPenaltyTaker ? '🎯 Cobrador Oficial (Desativar)' : 'Assumir Cobrança de Pênaltis'}
                        </button>
                      </div>

                      {/* 3. Cobrador Oficial de Faltas (☄️) */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        playerProfile.isFreeKickTaker
                          ? 'bg-sky-500/15 border-sky-500/50 shadow-md shadow-sky-500/10'
                          : 'bg-card border-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-sky-500 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
                              ☄️
                            </span>
                            <div>
                              <span className="text-[10px] font-black uppercase text-sky-400 block tracking-wider">
                                Falta Direta
                              </span>
                              <h4 className="font-display text-sm font-black text-foreground">
                                Cobrador de Faltas
                              </h4>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            playerProfile.isFreeKickTaker
                              ? 'bg-sky-500 text-zinc-950 border-sky-400 font-black'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}>
                            {playerProfile.isFreeKickTaker ? '✓ Ativo' : 'Disponível'}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Especialista em bolas paradas na meia-lua. Adiciona efeito folha seca e curva mortal por cima da barreira adversária.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleToggleRole('freekick')}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
                            playerProfile.isFreeKickTaker
                              ? 'bg-sky-500 hover:bg-sky-400 text-zinc-950'
                              : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                          }`}
                        >
                          {playerProfile.isFreeKickTaker ? '☄️ Especialista Ativo (Desativar)' : 'Assumir Cobrança de Faltas'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO DE HABILIDADES ÉPICAS DESBLOQUEADAS */}
                  <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">🏆</span>
                          <h4 className="font-display text-base font-black text-foreground">
                            Habilidades Épicas da Carreira
                          </h4>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Desbloqueadas por mérito esportivo, artilharias, títulos e liderança
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                        {playerProfile.unlockedEpicSkills?.length || 0} / {EPIC_SKILLS_CATALOG.length} Desbloqueadas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {EPIC_SKILLS_CATALOG.map((skill) => {
                        const isUnlocked = Boolean(playerProfile.unlockedEpicSkills?.includes(skill.id));
                        return (
                          <div
                            key={skill.id}
                            className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                              isUnlocked
                                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                                : 'bg-secondary/30 border-border opacity-70'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-2xl">{skill.icon}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                  isUnlocked
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-secondary text-muted-foreground border-border'
                                }`}>
                                  {isUnlocked ? '✓ Desbloqueada' : '🔒 Bloqueada'}
                                </span>
                              </div>
                              <h5 className="font-display text-xs font-black text-foreground">
                                {skill.name}
                              </h5>
                              <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                                {skill.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-border/70 text-[10px]">
                              <span className="text-muted-foreground block font-bold">
                                {isUnlocked ? 'Efeito Ativo:' : 'Como desbloquear:'}
                              </span>
                              <span className={isUnlocked ? 'text-emerald-400 font-semibold' : 'text-amber-400/90'}>
                                {isUnlocked ? skill.inGameEffect : skill.unlockCondition}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Lista do Elenco */}
              {currentClub && (
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                  <h3 className="font-display text-xl font-black text-foreground">
                    Elenco {isYouth ? 'da Base Sub-20' : 'Profissional'} ({isYouth ? currentClub.youthRoster.length : currentClub.roster.length} Atletas)
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">OVR</th>
                          <th className="py-2.5 px-3">Nome</th>
                          <th className="py-2.5 px-3">Pos</th>
                          <th className="py-2.5 px-3">Idade</th>
                          <th className="py-2.5 px-3">Valor de Mercado</th>
                          <th className="py-2.5 px-3">Salário</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(isYouth ? currentClub.youthRoster : currentClub.roster).map((player) => (
                          <tr key={player.id} className="hover:bg-secondary/40 transition-colors">
                            <td className="py-2.5 px-3">
                              <OverallBadge overall={player.overall} size="sm" />
                            </td>
                            <td className="py-2.5 px-3 font-bold text-foreground">
                              <div className="flex items-center gap-2">
                                <PerformanceIndicator 
                                  rating={player.morale >= 85 ? 7.6 : player.energy < 60 ? 5.8 : 6.8} 
                                  morale={player.morale} 
                                  energy={player.energy} 
                                />
                                <span>{player.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-500">
                              {player.position}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {player.age} anos
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              {formatCurrency(player.marketValue)}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-muted-foreground">
                              {formatCurrency(player.wage)}/sem
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* ABA 4: FORA DE CAMPO (VIDA, PATRIMÔNIO & PONTUAÇÃO) */}
          {/* ============================================================ */}
          {activeTab === 'life' && (
            <div className="space-y-6">
              {/* Alerta de Feedback de Compra */}
              {lifestyleFeedback && (
                <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
                  lifestyleFeedback.success
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                }`}>
                  <span>{lifestyleFeedback.message}</span>
                  <button
                    onClick={() => setLifestyleFeedback(null)}
                    className="underline text-[10px] cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Relações & Reputação */}
                <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                  <h3 className="font-display text-xl font-black text-foreground flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    Relações & Reputação
                  </h3>

                  {mode === 'player' && playerProfile ? (
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Relação com o Técnico</span>
                          <span className="text-emerald-500">{playerProfile.relationshipManager}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${playerProfile.relationshipManager}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Carinho da Torcida</span>
                          <span className="text-amber-500">{playerProfile.relationshipFans}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${playerProfile.relationshipFans}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Apoio da Família</span>
                          <span className="text-sky-400">{playerProfile.relationshipFamily}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-400 rounded-full"
                            style={{ width: `${playerProfile.relationshipFamily}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Confiança da Diretoria</span>
                          <span className="text-emerald-500">{managerProfile?.boardConfidence}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${managerProfile?.boardConfidence}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Apoio da Torcida</span>
                          <span className="text-amber-500">{managerProfile?.fansConfidence}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${managerProfile?.fansConfidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card do Hall da Fama e Pontuação */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-card to-amber-950/20 border border-amber-500/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <Trophy className="w-4 h-4" />
                        Hall da Fama & Pontuação
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {calculateCareerScore(fullState).rankTitle}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-display text-4xl font-black text-amber-400">
                        {calculateCareerScore(fullState).totalPoints}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase font-bold">
                        Pontos Acumulados
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Sua pontuação é atualizada a cada título, artilharia e conquista de patrimônio pessoal.
                    </p>
                  </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsTrophyRoomOpen(true)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <Trophy className="w-4 h-4" />
                        🏛️ Sala de Troféus Oficial
                      </button>

                      <Link
                        href="/pontuacao"
                        className="py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-border"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Tabela de Pontos
                      </Link>
                    </div>
                </div>
              </div>

              {/* LOJA DE PATRIMÔNIO & BENS (VIDA DE BOLEIRO) */}
              {mode === 'player' && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <h3 className="font-display text-xl font-black text-foreground flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-500" />
                        Patrimônio & Vida de Boleiro
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Use o dinheiro do seu salário para conquistar bens e acumular pontos preciosos no Hall da Fama.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary px-3.5 py-1.5 rounded-xl border border-border">
                      <Coins className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Saldo Bancário:</span>
                      <span className="font-mono text-sm font-black text-emerald-500">
                        {formatCurrency(playerProfile?.bankBalance || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {LIFESTYLE_CATALOG.map((item) => {
                      const userAssets = playerProfile?.lifestyleAssets || [];
                      const isOwned = userAssets.includes(item.name) || userAssets.includes(item.id);
                      const canAfford = (playerProfile?.bankBalance || 0) >= item.price;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            isOwned
                              ? 'border-emerald-500/50 bg-emerald-500/5'
                              : 'border-border bg-secondary/40 hover:border-emerald-500/30'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{item.icon}</span>
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                +{item.hallOfFamePoints} pts
                              </span>
                            </div>

                            <h4 className="font-display text-base font-black text-foreground mb-1">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                              {item.desc}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-black text-foreground">
                              {formatCurrency(item.price)}
                            </span>

                            {isOwned ? (
                              <span className="text-[11px] font-black text-emerald-500 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Adquirido
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={!canAfford}
                                onClick={() => {
                                  const res = buyLifestyleAsset(item.id);
                                  setLifestyleFeedback(res);
                                }}
                                className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  canAfford
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm'
                                    : 'bg-secondary text-muted-foreground opacity-50 cursor-not-allowed'
                                }`}
                              >
                                {canAfford ? 'Comprar' : 'Sem Saldo'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* BARRA DE NAVEGAÇÃO & AÇÃO RÁPIDA ESTILO NEW STAR SOCCER      */}
          {/* (Liga, Habilidades, Vida e Grande Botão JOGAR - Imagem 1 & 2) */}
          {/* ============================================================ */}
          <div className="sticky bottom-20 md:bottom-6 z-30 max-w-xl mx-auto px-2 mt-6">
            <div className="bg-card/95 backdrop-blur-md border-2 border-emerald-500/60 rounded-2xl p-2 shadow-2xl shadow-emerald-950/40 flex items-center justify-between gap-1.5 sm:gap-3">
              {/* 1. Liga (Tabelas) */}
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`flex-1 py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'table' 
                    ? 'bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/40' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Trophy className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Liga</span>
              </button>

              {/* 2. Habilidades (Minigames) */}
              <button
                type="button"
                onClick={() => {
                  setTrainingType('penalty');
                  setIsTrainingModalOpen(true);
                }}
                className="flex-1 py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              >
                <Target className="w-4 h-4 mb-0.5 text-emerald-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Habilidades</span>
              </button>

              {/* 3. Vida (Lifestyle / Bens) */}
              <button
                type="button"
                onClick={() => setActiveTab('life')}
                className={`flex-1 py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'life' 
                    ? 'bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/40' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Users className="w-4 h-4 mb-0.5 text-sky-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Vida</span>
              </button>

              {/* 4. O Grande Botão JOGAR com a Bola Verde do New Star Soccer */}
              <button
                type="button"
                onClick={() => {
                  playWhistle();
                  setIsLiveMatchOpen(true);
                }}
                className="py-2.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer animate-pulse shrink-0"
              >
                <span className="text-base">⚽</span>
                <span>JOGAR</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: PROMOÇÃO AO PROFISSIONAL */}
      {/* ============================================================ */}
      {promotionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-500">
                Momento Histórico
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground mt-1">
                PROMOVIDO AO TIME PRINCIPAL!
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Parabéns, <strong>{playerProfile?.name}</strong>! Seu desempenho espetacular na base garantiu seu primeiro contrato profissional no <strong>{currentClub?.name}</strong> para disputar a Série D!
            </p>

            <div className="p-3 rounded-xl bg-secondary/80 border border-border text-xs font-semibold text-emerald-500">
              💰 Novo Salário Semanal: R$ 3.500,00 • Status: Profissional Série D
            </div>

            <button
              onClick={closePromotionModal}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wide transition-all cursor-pointer shadow-lg"
            >
              Assinar Contrato & Estrear no Profissional
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: VIRADA DE TEMPORADA */}
      {/* ============================================================ */}
      {seasonSummaryModalOpen && lastSeasonSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border-2 border-amber-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/40">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                Término do Calendário Anual
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground mt-1">
                RESUMO DA TEMPORADA {lastSeasonSummary.year}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left text-xs">
              <div className="p-3 rounded-xl bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Série A</span>
                <span className="font-bold text-foreground">{lastSeasonSummary.champions.serieA}</span>
              </div>
              <div className="p-3 rounded-xl bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Copa do Brasil</span>
                <span className="font-bold text-foreground">{lastSeasonSummary.champions.copa}</span>
              </div>
              <div className="p-3 rounded-xl bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Série B</span>
                <span className="font-bold text-foreground">{lastSeasonSummary.champions.serieB}</span>
              </div>
              <div className="p-3 rounded-xl bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Série C</span>
                <span className="font-bold text-foreground">{lastSeasonSummary.champions.serieC}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-semibold text-left">
              ✅ Acesso e rebaixamento processados automaticamente. Todos os atletas envelheceram +1 ano e o calendário da nova temporada foi gerado!
            </div>

            <button
              onClick={closeSeasonSummaryModal}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm tracking-wide transition-all cursor-pointer shadow-lg"
            >
              Iniciar Temporada {lastSeasonSummary.year + 1}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: PARTIDA AO VIVO (FASE 3) */}
      {/* ============================================================ */}
      {isLiveMatchOpen && nextFixture && homeClub && awayClub && (
        <LiveMatchModal
          isOpen={isLiveMatchOpen}
          onClose={() => setIsLiveMatchOpen(false)}
          fixture={nextFixture}
          homeClub={homeClub}
          awayClub={awayClub}
          onFinishMatch={handleFinishLiveMatch}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 4: LOJA DO ATLETA (NEW STAR SOCCER) */}
      {/* ============================================================ */}
      <NSSPlayerShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />

      {/* ============================================================ */}
      {/* MODAL 5: MINIGAMES LIVRES DE TREINO (NSS) */}
      {/* ============================================================ */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-emerald-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚽</span>
                <div>
                  <h3 className="font-display text-lg font-black text-foreground">
                    Centro de Treinamento • Minigames
                  </h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">
                    Pratique seus fundamentos e ganhe notas bônus
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setTrainingType('dribble')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    trainingType === 'dribble' ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  ⚡ Drible 1v1
                </button>
                <button
                  type="button"
                  onClick={() => setTrainingType('penalty')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    trainingType === 'penalty' ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  🎯 Pênalti & Chute
                </button>
                <button
                  type="button"
                  onClick={() => setTrainingType('pass')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    trainingType === 'pass' ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  👟 Passe Decisivo
                </button>
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground text-xs cursor-pointer ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {trainingType === 'dribble' ? (
              <DribbleMinigame
                mode="training"
                onDribbleSuccess={(_type, bonus) => applyMinigameResult({ goalsScored: 0, ratingBonus: bonus, trainingSkill: 'dribbling' })}
                onClose={() => setIsTrainingModalOpen(false)}
              />
            ) : trainingType === 'penalty' ? (
              <NSSPenaltyMinigame
                mode="training"
                onScoreGoal={() => applyMinigameResult({ goalsScored: 1, ratingBonus: 0.3, trainingSkill: 'shooting' })}
                onClose={() => setIsTrainingModalOpen(false)}
              />
            ) : (
              <NSSPassMinigame
                mode="training"
                onCompletePass={() => applyMinigameResult({ goalsScored: 0, ratingBonus: 0.2, trainingSkill: 'passing' })}
                onClose={() => setIsTrainingModalOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* Modal de Resultados da Rodada (Simulação Rápida / Pós-Jogo) */}
      <RoundResultModal
        isOpen={!!roundResultModalOpen}
        onClose={() => setRoundResultModalOpen(false)}
        onOpenControversy={() => {
          setRoundResultModalOpen(false);
          setIsControversyModalOpen(true);
        }}
      />

      {/* Modal de Proposta de Transferência (Mercado da Bola) */}
      <TransferOfferModal
        isOpen={isTransferModalOpen || !!pendingTransferOffer}
        onClose={() => setIsTransferModalOpen(false)}
      />

      {/* Modal de Coletiva Polêmica */}
      <ControversyModal 
        isOpen={isControversyModalOpen} 
        onClose={() => setIsControversyModalOpen(false)} 
      />

      {/* ============================================================ */}
      {/* MODAL 6: CARTINHA DA CARREIRA (PNG INSTAGRAM/WHATSAPP) */}
      {/* ============================================================ */}
      <CareerShareCardModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
      />

      {/* ============================================================ */}
      {/* MODAL 7: REDE SOCIAL DA TORCIDA (TWITTER/COMENTÁRIOS) */}
      {/* ============================================================ */}
      <TorcidaFeedModal
        isOpen={isTorcidaFeedOpen}
        onClose={() => setIsTorcidaFeedOpen(false)}
      />

      {/* ============================================================ */}
      {/* MODAL 8: HALL DA FAMA & CONQUISTAS (BADGES BRASFOOT) */}
      {/* ============================================================ */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      {/* ============================================================ */}
      {/* MODAL 9: SELEÇÃO BRASILEIRA (CONVOCAÇÃO & AMARELINHA) */}
      {/* ============================================================ */}
      <NationalTeamModal
        isOpen={isNationalTeamOpen}
        onClose={() => setIsNationalTeamOpen(false)}
        tier={mode === 'player' && playerProfile?.isYouthTeam ? 'sub_20' : 'senior'}
      />

      {/* ============================================================ */}
      {/* MODAL 10: EDITOR DE AVATAR (VISUAL DO JOGADOR/TREINADOR) */}
      {/* ============================================================ */}
      <AvatarCreatorModal
        isOpen={isAvatarCreatorOpen}
        onClose={() => setIsAvatarCreatorOpen(false)}
        initialAvatar={mode === 'player' ? playerProfile?.avatar : managerProfile?.avatar}
      />

      {/* ============================================================ */}
      {/* MODAIS DO MODO TREINADOR (6 TELAS OFICIAIS COMPLETAS) */}
      {/* ============================================================ */}
      <ManagerRosterModal
        isOpen={isManagerRosterOpen}
        onClose={() => setIsManagerRosterOpen(false)}
      />

      <ManagerTacticsModal
        isOpen={isManagerTacticsOpen}
        onClose={() => setIsManagerTacticsOpen(false)}
      />

      <ManagerTrainingModal
        isOpen={isManagerTrainingOpen}
        onClose={() => setIsManagerTrainingOpen(false)}
      />

      <ManagerTransferModal
        isOpen={isManagerTransferMarketOpen}
        onClose={() => setIsManagerTransferMarketOpen(false)}
      />

      <ManagerFinancesModal
        isOpen={isManagerFinancesOpen}
        onClose={() => setIsManagerFinancesOpen(false)}
      />

      <ManagerCareerModal
        isOpen={isManagerCareerOpen}
        onClose={() => setIsManagerCareerOpen(false)}
      />

      {/* ============================================================ */}
      {/* MINIJOGOS OFICIAIS DO TREINADOR: PRANCHETA E PRELEÇÃO        */}
      {/* ============================================================ */}
      <TacticalBoardMinigame
        isOpen={isTacticalBoardOpen}
        onClose={() => setIsTacticalBoardOpen(false)}
      />

      <ManagerSpeechMinigame
        isOpen={isManagerSpeechOpen}
        onClose={() => setIsManagerSpeechOpen(false)}
      />

      {/* ============================================================ */}
      {/* MODAL 11: DILEMAS, COLETIVAS E ENTREVISTAS COM CONSEQUÊNCIAS */}
      {/* ============================================================ */}
      <DilemmaModal
        isOpen={!!pendingDilemma}
        dilemma={pendingDilemma}
        onClose={dismissDilemma}
      />

      {/* ============================================================ */}
      {/* MODAL 12: SALA DE TROFÉUS & RANKING HISTÓRICO DE CAMPEÕES */}
      {/* ============================================================ */}
      <TrophyRoomModal
        isOpen={isTrophyRoomOpen}
        onClose={() => setIsTrophyRoomOpen(false)}
      />

      <MobileBottomNav />
    </div>
  );
}
