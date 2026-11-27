'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { OnlinePvPArena } from '@/components/online/OnlinePvPArena';
import { Club, OnlineLeaderboardEntry } from '@/types/game';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  Globe, 
  Swords, 
  Trophy, 
  Download, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  Flame, 
  Users, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Heart,
  Copy,
  Check,
  QrCode,
  Server,
  Gamepad2,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnlineModePage() {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const planTier = useGameStore((s) => s.planTier);
  const setPlanTier = useGameStore((s) => s.setPlanTier);
  const syncWithSupabase = useGameStore((s) => s.syncWithSupabase);
  const isGuest = useGameStore((s) => s.isGuest);
  const onlineStats = useGameStore((s) => s.onlineStats) || {
    elo: 1200,
    division: 'Prata',
    wins: 0,
    losses: 0,
    draws: 0,
  };
  const syncCareerToLeaderboard = useGameStore((s) => s.syncCareerToLeaderboard);
  const fetchOnlineLeaderboard = useGameStore((s) => s.fetchOnlineLeaderboard);
  const applyCommunityPack = useGameStore((s) => s.applyCommunityPack);

  type OnlineTab = 'arena' | 'ranking' | 'community_packs' | 'donation';
  const [activeTab, setActiveTab] = useState<OnlineTab>('arena');

  // Estados de Leaderboard e Sincronização
  const [leaderboard, setLeaderboard] = useState<OnlineLeaderboardEntry[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [packFeedback, setPackFeedback] = useState<string | null>(null);

  // Estados da Aba de Doação
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(10);
  const [donationProSuccess, setDonationProSuccess] = useState(false);
  const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || 'elisantos157h@gmail.com';

  const userActorName = mode === 'player' 
    ? (playerProfile?.name || 'Seu Atleta') 
    : (managerProfile?.name || 'Seu Treinador');
  const userClub = mode === 'player' 
    ? (playerProfile?.clubId ? clubs[playerProfile.clubId] : clubs['fla'])
    : (managerProfile?.clubId ? clubs[managerProfile.clubId] : clubs['pal']);

  const loadRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const data = await fetchOnlineLeaderboard(mode);
      setLeaderboard(data);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // Carrega ranking ao abrir a aba
  useEffect(() => {
    if (activeTab !== 'ranking') return;
    const timer = setTimeout(() => {
      void loadRankings();
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleSyncCareer = async () => {
    setIsSyncing(true);
    try {
      const res = await syncCareerToLeaderboard();
      setSyncToast({
        message: res.message,
        type: res.success ? 'success' : 'error',
      });
      if (res.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        loadRankings();
      }
      setTimeout(() => setSyncToast(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Pacotes pré-definidos da comunidade para download com 1 clique
  const COMMUNITY_PACKS = [
    {
      id: 'pack-brasileirao-2026',
      title: 'Brasileirão Série A & B 2026 (Oficial)',
      author: 'Comunidade Bola na Rede',
      downloads: 4820,
      likes: 934,
      description: 'Todos os 40 clubes das Séries A e B com nomes oficiais, cores reais e elencos alinhados para 2026.',
      isOfficial: true,
      data: {
        fla: { name: 'Flamengo', shortName: 'FLA', primaryColor: '#c8102e', secondaryColor: '#000000' },
        pal: { name: 'Palmeiras', shortName: 'PAL', primaryColor: '#006437', secondaryColor: '#ffffff' },
        cor: { name: 'Corinthians', shortName: 'COR', primaryColor: '#ffffff', secondaryColor: '#000000' },
        sao: { name: 'São Paulo', shortName: 'SAO', primaryColor: '#e11d48', secondaryColor: '#000000' },
        vas: { name: 'Vasco da Gama', shortName: 'VAS', primaryColor: '#000000', secondaryColor: '#ffffff' },
        san: { name: 'Santos', shortName: 'SAN', primaryColor: '#ffffff', secondaryColor: '#000000' },
        gre: { name: 'Grêmio', shortName: 'GRE', primaryColor: '#0d85c8', secondaryColor: '#000000' },
        int: { name: 'Internacional', shortName: 'INT', primaryColor: '#e11d48', secondaryColor: '#ffffff' },
        cam: { name: 'Atlético Mineiro', shortName: 'CAM', primaryColor: '#000000', secondaryColor: '#ffffff' },
        cru: { name: 'Cruzeiro', shortName: 'CRU', primaryColor: '#003a94', secondaryColor: '#ffffff' },
      },
    },
    {
      id: 'pack-retro-90s',
      title: 'Lendas Retrô dos Anos 90 & 2000',
      author: 'Nostalgia FC',
      downloads: 2310,
      likes: 512,
      description: 'Grandes esquadrões históricos do futebol brasileiro com cores clássicas e atmosfera retrô.',
      isOfficial: false,
      data: {
        fla: { name: 'Flamengo 92 (Zico/Júnior)', shortName: 'FLA', primaryColor: '#b91c1c', secondaryColor: '#18181b' },
        pal: { name: 'Palmeiras 99 (Era Parmalat)', shortName: 'PAL', primaryColor: '#047857', secondaryColor: '#f8fafc' },
        sao: { name: 'São Paulo 93 (Telê Santana)', shortName: 'SAO', primaryColor: '#dc2626', secondaryColor: '#ffffff' },
        san: { name: 'Santos 2002 (Meninos da Vila)', shortName: 'SAN', primaryColor: '#ffffff', secondaryColor: '#000000' },
      },
    },
    {
      id: 'pack-interior-raiz',
      title: 'Futebol Raiz: Séries C & D 2026',
      author: 'Arquibancada Raiz',
      downloads: 1450,
      likes: 320,
      description: 'Clubes tradicionais do interior do Brasil para quem ama iniciar a carreira na poeira da Série D.',
      isOfficial: false,
      data: {
        brasil_pel: { name: 'Brasil de Pelotas (Xavante)', shortName: 'BRA', primaryColor: '#b91c1c', secondaryColor: '#000000' },
        cax: { name: 'Caxias do Sul', shortName: 'CAX', primaryColor: '#831843', secondaryColor: '#0284c7' },
        ferroviaria: { name: 'Ferroviária de Araraquara', shortName: 'AFE', primaryColor: '#7f1d1d', secondaryColor: '#ffffff' },
      },
    },
  ];

  const handleInstallPack = (pack: typeof COMMUNITY_PACKS[0]) => {
    const { updatedCount } = applyCommunityPack(pack.data as unknown as Record<string, Partial<Club>>);
    setPackFeedback(`🎉 Pacote "${pack.title}" instalado com sucesso! ${updatedCount} clubes atualizados.`);
    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setPackFeedback(null), 4000);
  };

  const handleCopyPixKey = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(PIX_KEY);
      setCopiedPixKey(true);
      setTimeout(() => setCopiedPixKey(false), 3000);
    }
  };

  const handleClaimProFromDonationTab = async () => {
    try {
      setPlanTier('pro');
      if (!isGuest) {
        await syncWithSupabase();
      }
      setDonationProSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setDonationProSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Erro ao sincronizar PRO via doação:', err);
      setDonationProSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Toast de Feedback */}
          {syncToast && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold animate-in slide-in-from-top duration-200 ${
              syncToast.type === 'success' 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {syncToast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{syncToast.message}</span>
              </div>
              <button onClick={() => setSyncToast(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}

          {packFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{packFeedback}</span>
              </div>
              <button onClick={() => setPackFeedback(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}

          {/* Cabeçalho da Página Online */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Modo Online • Arena PvP & Comunidade
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Duelos de bola parada X1 em tempo real, ranking global no Supabase e pacotes de times da comunidade.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Servidor Ativo
              </span>

              <button
                type="button"
                disabled={isSyncing}
                onClick={handleSyncCareer}
                className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Carreira'}
              </button>
            </div>
          </div>

          {/* Card do Perfil Online do Jogador */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-card via-card to-emerald-950/20 border-2 border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-zinc-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/25 shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="font-display text-xl font-black text-foreground">
                    {userActorName}
                  </h3>
                  {planTier === 'pro' && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 flex items-center gap-0.5 shadow-sm">
                      <Crown className="w-2.5 h-2.5" />
                      VIP
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground block truncate">
                  {userClub?.name} • Modo {mode === 'player' ? 'Jogador' : 'Treinador'}
                </span>
              </div>
            </div>

            {/* Badges de Divisão e ELO Online */}
            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto justify-around sm:justify-start">
              <div className="text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">
                  {onlineStats.elo}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-black">
                  Pontos de ELO
                </span>
              </div>

              <div className="text-center">
                <span className="text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 block">
                  {onlineStats.division}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-black block mt-0.5">
                  Divisão Online
                </span>
              </div>

              <div className="text-center">
                <span className="text-sm font-black text-foreground font-mono block">
                  {onlineStats.wins}V - {onlineStats.draws}E - {onlineStats.losses}D
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-black block mt-0.5">
                  Cartel PvP
                </span>
              </div>
            </div>
          </div>

          {/* Abas Principais do Modo Online (100% Responsivo no Celular & PC) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1 bg-secondary/30 rounded-2xl border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('arena')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                activeTab === 'arena'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Arena PvP X1</span>
              <span className="sm:hidden">Arena X1</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ranking')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                activeTab === 'ranking'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Ranking Global</span>
              <span className="sm:hidden">Ranking</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('community_packs')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                activeTab === 'community_packs'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Pacotes Clubes</span>
              <span className="sm:hidden">Pacotes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('donation')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
                activeTab === 'donation'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 fill-current animate-pulse" />
              <span className="hidden sm:inline">Apoiar Projeto 💖</span>
              <span className="sm:hidden">Apoiar 💖</span>
            </button>
          </div>

          {/* ABA 1: ARENA PVP X1 */}
          {activeTab === 'arena' && (
            <OnlinePvPArena />
          )}

          {/* ABA 2: RANKING GLOBAL ONLINE (LEADERBOARD) */}
          {activeTab === 'ranking' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-black text-foreground">
                    Top Craques do Brasil • Temporada 2026
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ranking sincronizado com a tabela oficial de saves e carreiras.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadRankings}
                  className="py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRankings ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              {/* Tabela do Leaderboard */}
              <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/70 border-b border-border text-[10px] uppercase font-black text-muted-foreground">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Craque / Usuário</th>
                        <th className="py-3 px-4">Clube</th>
                        <th className="py-3 px-4 text-center">OVR</th>
                        <th className="py-3 px-4 text-center">Títulos</th>
                        <th className="py-3 px-4 text-right">Pontos de Carreira</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {leaderboard.map((item, idx) => {
                        const isUserRow = item.username.includes('(Você)');
                        return (
                          <tr
                            key={item.id || idx}
                            className={`transition-colors ${
                              isUserRow 
                                ? 'bg-emerald-500/15 font-bold text-emerald-300' 
                                : 'hover:bg-secondary/40 text-foreground'
                            }`}
                          >
                            <td className="py-3 px-4 font-black font-mono">
                              {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold truncate">{item.username}</span>
                                {item.is_pro && (
                                  <span className="text-[8px] bg-amber-400 text-zinc-950 font-black px-1.5 py-0.2 rounded-full">
                                    PRO
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground truncate max-w-[160px]">
                              {item.club_name}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold">
                              {item.overall || 75}
                            </td>
                            <td className="py-3 px-4 text-center font-mono">
                              🏆 {item.trophies_count}
                            </td>
                            <td className="py-3 px-4 text-right font-black font-mono text-emerald-400 text-sm">
                              {item.points.toLocaleString('pt-BR')} Pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: PACOTES DA COMUNIDADE (DOWNLOAD COM 1 CLIQUE) */}
          {activeTab === 'community_packs' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-black text-foreground">
                  Pacotes de Clubes & Elencos da Comunidade
                </h3>
                <p className="text-xs text-muted-foreground">
                  Baixe e instale pacotes completos com 1 clique para atualizar nomes, cores e escudos no seu jogo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMUNITY_PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Por: {pack.author}
                        </span>
                        {pack.isOfficial && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            ⭐ Oficial
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-black text-base text-foreground">
                        {pack.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {pack.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/80">
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {pack.downloads.toLocaleString('pt-BR')} downloads
                      </span>

                      <button
                        type="button"
                        onClick={() => handleInstallPack(pack)}
                        className="py-1.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Instalar no Jogo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 4: APOIE O PROJETO & DOAÇÕES (PIX) */}
          {activeTab === 'donation' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Topo da Aba de Doação */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-card to-rose-950/20 border-2 border-rose-500/40 shadow-xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <span>Comunidade & Desenvolvimento Independente</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Apoie a Criação Contínua do <span className="text-rose-400">Bola na Rede 💖</span>
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  Este jogo é 100% brasileiro, gratuito e mantido de forma independente. O seu apoio financeiro paga a infraestrutura de banco de dados do <strong>Supabase</strong>, servidores rápidos para o multiplayer sem lag e possibilita adicionar as novas ligas, minigames de faltas e escanteios que a comunidade pede!
                </p>
              </div>

              {/* Metas Ativas de Desenvolvimento */}
              <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Metas Ativas de Expansão do Jogo:
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Transparência Total</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Meta 1 */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Server className="w-4 h-4 text-emerald-400" />
                        Servidores PvP 24/7
                      </span>
                      <span className="text-xs font-black text-emerald-400">85%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Matchmaking instantâneo sem fila de espera.</p>
                  </div>

                  {/* Meta 2 */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        Libertadores Oficial
                      </span>
                      <span className="text-xs font-black text-amber-400">60%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Fase de grupos real e mata-mata continental.</p>
                  </div>

                  {/* Meta 3 */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Gamepad2 className="w-4 h-4 text-rose-400" />
                        Minigame de Faltas 3D
                      </span>
                      <span className="text-xs font-black text-rose-400">45%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Curva na bola por cima da barreira e escanteios.</p>
                  </div>
                </div>
              </div>

              {/* Card de Doação Pix com Valores Sugeridos */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-emerald-500/40 shadow-xl space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 block">
                    Faça sua Doação com Chave Pix
                  </span>
                  <h4 className="font-display text-xl sm:text-2xl font-black text-foreground">
                    Qualquer valor faz uma diferença enorme!
                  </h4>
                </div>

                {/* Botões de Valores Rápidos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                  {[
                    { val: 5, label: 'R$ 5,00', desc: 'Cafezinho do Dev ☕' },
                    { val: 10, label: 'R$ 10,00', desc: 'Bola Oficial ⚽' },
                    { val: 25, label: 'R$ 25,00', desc: 'Manto do Clube 👕' },
                    { val: 50, label: 'R$ 50,00', desc: 'Patrocinador Master 🏆' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setDonationAmount(item.val)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        donationAmount === item.val
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black shadow-md'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="text-sm sm:text-base font-black text-foreground">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Box Chave Pix Copia e Cola */}
                <div className="max-w-xl mx-auto p-4 rounded-2xl bg-secondary/60 border border-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      Chave Pix Oficial (E-mail):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black uppercase">
                      PIX DIRETO
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-background border border-border font-mono text-xs sm:text-sm">
                    <span className="text-emerald-400 font-bold truncate select-all">
                      {PIX_KEY}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPixKey}
                      className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 shadow-sm"
                    >
                      {copiedPixKey ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Chave</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center">
                    Abra o app do seu banco, selecione a opção Pix por e-mail e cole a chave acima.
                  </p>
                </div>

                {/* Recompensa PRO aos Doadores */}
                <div className="max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <Crown className="w-7 h-7 text-amber-400 shrink-0" />
                    <div>
                      <h5 className="font-display font-black text-sm text-foreground">
                        Doações a partir de R$ 9,90 = Modo PRO Vitalício!
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Apoiou com R$ 10 ou mais? Libere instantaneamente o acesso PRO completo.
                      </p>
                    </div>
                  </div>

                  {planTier !== 'pro' ? (
                    <button
                      type="button"
                      onClick={handleClaimProFromDonationTab}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-transform active:scale-95 cursor-pointer whitespace-nowrap shadow-md"
                    >
                      Já Fiz o Pix (Ativar PRO)
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase">
                      👑 PRO Ativo
                    </span>
                  )}
                </div>

                {donationProSuccess && (
                  <div className="max-w-xl mx-auto p-3 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Obrigado pela doação! Modo PRO ativado com sucesso na sua conta!
                  </div>
                )}

                {/* Botão de Enviar Comprovante WhatsApp */}
                <div className="max-w-xl mx-auto pt-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Olá! Fiz um Pix de R$ ${donationAmount.toFixed(2).replace('.', ',')} para apoiar o Bola na Rede: Carreira!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95 cursor-pointer text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Comprovante / Mensagem aos Desenvolvedores no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Hall dos Apoiadores da Comunidade */}
              <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  Hall dos Apoiadores Recentes da Comunidade:
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { name: 'Lucas "Muralha"', club: 'Flamengo', val: 'R$ 25,00', icon: '⚡' },
                    { name: 'Gabriel Santos', club: 'Palmeiras', val: 'R$ 50,00', icon: '👑' },
                    { name: 'Matheus R.', club: 'Corinthians', val: 'R$ 10,00', icon: '⚽' },
                    { name: 'Davi Gabriel', club: 'Real Madrid', val: 'R$ 50,00', icon: '🏆' },
                  ].map((sup, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-secondary/40 border border-border flex items-center gap-2.5">
                      <span className="text-xl">{sup.icon}</span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-foreground block truncate">{sup.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">{sup.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}