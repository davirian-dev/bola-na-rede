'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { Player, Position, Division } from '@/types/game';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { OverallBadge } from '@/components/game/OverallBadge';
import { ClubBadge } from '@/components/game/ClubBadge';
import { PerformanceIndicator } from '@/components/game/PerformanceIndicator';
import { formatCurrency } from '@/lib/calculations';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Coins, 
  Check, 
  X, 
  ShoppingBag, 
  TrendingUp,
  Tag,
  AlertCircle,
  Building2,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TransferenciasPage() {
  const mode = useGameStore((s) => s.mode);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const buyPlayerForClub = useGameStore((s) => s.buyPlayerForClub);
  const sellPlayerFromClub = useGameStore((s) => s.sellPlayerFromClub);

  const activeClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;
  const currentClub = activeClubId ? clubs[activeClubId] : null;

  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [minOverall, setMinOverall] = useState<number>(50);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Gera lista de atletas de outros clubes disponíveis no mercado
  const marketPlayers = useMemo(() => {
    const list: (Player & { clubName: string; marketValue: number })[] = [];
    
    Object.values(clubs).forEach((c) => {
      if (c.id === activeClubId) return; // Não lista atletas do próprio clube

      c.roster.slice(4).forEach((p) => {
        // Cálculo de valor de mercado realista
        const baseValue = Math.pow(p.overall / 10, 4.2) * 850;
        const ageFactor = p.age <= 21 ? 1.4 : p.age >= 31 ? 0.7 : 1.0;
        const marketValue = Math.round(baseValue * ageFactor);

        list.push({
          ...p,
          clubName: c.name,
          marketValue,
        });
      });
    });

    return list;
  }, [clubs, activeClubId]);

  // Filtra mercado de compras
  const filteredMarket = useMemo(() => {
    return marketPlayers.filter((p) => {
      const matchPos = selectedPosition === 'ALL' || p.position === selectedPosition;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.clubName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.marketValue <= maxPrice;
      const matchOvr = p.overall >= minOverall;
      return matchPos && matchSearch && matchPrice && matchOvr;
    }).slice(0, 40);
  }, [marketPlayers, selectedPosition, searchQuery, maxPrice, minOverall]);

  // Lista do próprio elenco para venda
  const squadPlayers = useMemo(() => {
    if (!currentClub) return [];
    return currentClub.roster.map((p) => {
      const baseValue = Math.pow(p.overall / 10, 4.2) * 800;
      const ageFactor = p.age <= 21 ? 1.35 : p.age >= 31 ? 0.65 : 1.0;
      const marketValue = Math.round(baseValue * ageFactor);
      return {
        ...p,
        marketValue,
      };
    });
  }, [currentClub]);

  const handleBuy = (player: Player & { marketValue: number }) => {
    if (!currentClub) return;
    const res = buyPlayerForClub(currentClub.id, player, player.marketValue);
    if (res.success) {
      setFeedback({ message: res.message, type: 'success' });
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    } else {
      setFeedback({ message: res.message, type: 'error' });
    }
  };

  const handleSell = (player: Player & { marketValue: number }) => {
    if (!currentClub) return;
    if (currentClub.roster.length <= 15) {
      setFeedback({ 
        message: 'Você não pode vender atletas se o elenco tiver 15 ou menos jogadores.', 
        type: 'error' 
      });
      return;
    }

    const res = sellPlayerFromClub(currentClub.id, player.id, player.marketValue);
    if (res.success) {
      setFeedback({ message: res.message, type: 'success' });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      setFeedback({ message: res.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
          
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Mercado da Bola & Transferências
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contrate reforços pontuais e negocie atletas para equilibrar as finanças do seu clube.
              </p>
            </div>

            {/* Card de Orçamento do Clube */}
            {currentClub && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60 border border-border shadow-sm">
                <ClubBadge
                  primaryColor={currentClub.primaryColor}
                  secondaryColor={currentClub.secondaryColor}
                  shortName={currentClub.shortName}
                  size="sm"
                />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                    Orçamento em Caixa
                  </span>
                  <span className="font-display text-base font-black text-emerald-400">
                    {formatCurrency(currentClub.budget)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Feedback de Ação */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-in fade-in ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-destructive/15 border-destructive/30 text-destructive'
              }`}
            >
              <span>{feedback.message}</span>
              <button
                onClick={() => setFeedback(null)}
                className="hover:opacity-75 font-bold cursor-pointer ml-3 text-foreground"
              >
                ✕
              </button>
            </div>
          )}

          {/* Alternador de Abas: Comprar vs. Vender */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab('buy')}
              className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'buy'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Contratar Reforços ({filteredMarket.length} Opções)
            </button>

            <button
              onClick={() => setActiveTab('sell')}
              className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sell'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Tag className="w-4 h-4" />
              Vender do Meu Elenco ({squadPlayers.length} Atletas)
            </button>
          </div>

          {/* ABA 1: CONTRATAR REFORÇOS */}
          {activeTab === 'buy' && (
            <div className="space-y-4">
              {/* Filtros Rápidos */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* Busca por Nome */}
                  <div className="relative sm:col-span-2">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar jogador ou clube..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Filtro de Posição */}
                  <div>
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-border bg-secondary text-xs text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ALL">Todas as Posições</option>
                      <option value="GOL">Goleiros (GOL)</option>
                      <option value="ZAG">Zagueiros (ZAG)</option>
                      <option value="LD">Laterais Direitos (LD)</option>
                      <option value="LE">Laterais Esquerdos (LE)</option>
                      <option value="VOL">Volantes (VOL)</option>
                      <option value="MC">Meias Centrais (MC)</option>
                      <option value="MEI">Meias Ofensivos (MEI)</option>
                      <option value="PD">Pontas Direitas (PD)</option>
                      <option value="PE">Pontas Esquerdas (PE)</option>
                      <option value="CA">Centroavantes (CA)</option>
                    </select>
                  </div>

                  {/* Filtro de Overall Mínimo */}
                  <div>
                    <select
                      value={minOverall}
                      onChange={(e) => setMinOverall(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl border border-border bg-secondary text-xs text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={50}>Qualquer Overall (50+)</option>
                      <option value={60}>Série C / B (60+)</option>
                      <option value={70}>Série A (70+)</option>
                      <option value={78}>Estrelas (78+)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tabela de Jogadores do Mercado */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border text-muted-foreground uppercase sticky top-0 bg-card">
                    <tr>
                      <th className="py-2.5 px-3">OVR</th>
                      <th className="py-2.5 px-3">Jogador</th>
                      <th className="py-2.5 px-2">Pos</th>
                      <th className="py-2.5 px-2">Idade</th>
                      <th className="py-2.5 px-3">Clube Atual</th>
                      <th className="py-2.5 px-3">Valor de Mercado</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMarket.map((player) => {
                      const canAfford = (currentClub?.budget || 0) >= player.marketValue;

                      return (
                        <tr key={player.id} className="hover:bg-secondary/40 transition-colors">
                          <td className="py-2.5 px-3">
                            <OverallBadge overall={player.overall} size="sm" />
                          </td>
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            {player.name}
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-emerald-400">
                            {player.position}
                          </td>
                          <td className="py-2.5 px-2 text-muted-foreground">
                            {player.age} anos
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {player.clubName}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-black text-emerald-400">
                            {formatCurrency(player.marketValue)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleBuy(player)}
                              disabled={!canAfford}
                              className={`py-1.5 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-transform active:scale-95 cursor-pointer ${
                                canAfford
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm'
                                  : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
                              }`}
                            >
                              {canAfford ? 'Contratar' : 'Sem Verba'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 2: VENDER DO MEU ELENCO */}
          {activeTab === 'sell' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border text-muted-foreground uppercase sticky top-0 bg-card">
                    <tr>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">OVR</th>
                      <th className="py-2.5 px-3">Jogador</th>
                      <th className="py-2.5 px-2">Pos</th>
                      <th className="py-2.5 px-2">Idade</th>
                      <th className="py-2.5 px-3">Salário / Sem.</th>
                      <th className="py-2.5 px-3">Valor Estimado</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {squadPlayers.map((player, idx) => (
                      <tr key={player.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <PerformanceIndicator
                            rating={player.stats?.averageRating || 7.0}
                            energy={player.energy ?? 85}
                            morale={player.morale ?? 85}
                            size="sm"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <OverallBadge overall={player.overall} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 font-bold text-foreground">
                          {player.name} {idx < 11 && <span className="text-[9px] text-emerald-400 font-bold ml-1">(Titular)</span>}
                        </td>
                        <td className="py-2.5 px-2 font-mono font-bold text-emerald-400">
                          {player.position}
                        </td>
                        <td className="py-2.5 px-2 text-muted-foreground">
                          {player.age} anos
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground font-mono">
                          {formatCurrency(player.wage || 1500)}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-black text-emerald-400">
                          {formatCurrency(player.marketValue)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleSell(player)}
                            className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-black text-[11px] uppercase tracking-wider transition-transform active:scale-95 cursor-pointer"
                          >
                            Vender Atleta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
