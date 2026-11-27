'use client';

import React, { useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, Position, Club } from '@/types/game';
import { Search, Eye, DollarSign, Sprout, X, Filter, Check, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ManagerTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerTransferModal: React.FC<ManagerTransferModalProps> = ({ isOpen, onClose }) => {
  const {
    clubs,
    managerProfile,
    buyPlayerForClub,
    sellPlayerFromClub,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'search' | 'scouts' | 'sales' | 'youth'>('search');
  const [filterPos, setFilterPos] = useState<string>('ALL');
  const [filterMaxAge, setFilterMaxAge] = useState<number>(99);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(999_000_000);
  const [filterMinOvr, setFilterMinOvr] = useState<number>(60);
  const [sortOrder, setSortOrder] = useState<'ovr' | 'price' | 'age'>('ovr');

  // Estado para proposta de negociação
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<{ player: Player; club: Club | null } | null>(null);
  const [offerFee, setOfferFee] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

  const currentClub = managerProfile ? clubs[managerProfile.clubId] : undefined;

  // Reúne jogadores de todos os outros clubes + jogadores livres (sem clube)
  const allMarketPlayers = useMemo(() => {
    if (!isOpen || !currentClub) return [];
    const list: { player: Player; club: Club | null }[] = [];

    // Jogadores livres no mercado
    const freeAgents: Player[] = [
      {
        id: 'free-1',
        name: 'Lucas Ramos',
        age: 29,
        position: 'PD',
        overall: 81,
        potential: 81,
        energy: 100,
        morale: 80,
        marketValue: 0,
        wage: 45000,
        contractWeeks: 0,
        isYouth: false,
        attributes: { pace: 84, dribbling: 83, tackling: 40, defending: 42, attacking: 82, finishing: 81, passing: 77, positioning: 79, heading: 68, crossing: 80, shooting: 80, jumping: 74, playmaker: 76, elasticity: 60, physical: 74, vision: 76, composure: 78 },
      },
      {
        id: 'free-2',
        name: 'Felipe Ribeiro',
        age: 26,
        position: 'ZAG',
        overall: 77,
        potential: 80,
        energy: 100,
        morale: 78,
        marketValue: 0,
        wage: 38000,
        contractWeeks: 0,
        isYouth: false,
        attributes: { pace: 70, dribbling: 60, tackling: 80, defending: 79, attacking: 40, finishing: 35, passing: 65, positioning: 78, heading: 82, crossing: 50, shooting: 40, jumping: 82, playmaker: 55, elasticity: 60, physical: 80, vision: 62, composure: 72 },
      },
      {
        id: 'free-3',
        name: 'Alisson Mendes',
        age: 28,
        position: 'ATA',
        overall: 76,
        potential: 76,
        energy: 100,
        morale: 75,
        marketValue: 0,
        wage: 35000,
        contractWeeks: 0,
        isYouth: false,
        attributes: { pace: 78, dribbling: 74, tackling: 35, defending: 38, attacking: 79, finishing: 78, passing: 66, positioning: 78, heading: 76, crossing: 65, shooting: 77, jumping: 76, playmaker: 68, elasticity: 55, physical: 75, vision: 68, composure: 75 },
      },
      {
        id: 'free-4',
        name: 'Hugo Ramos',
        age: 27,
        position: 'GOL',
        overall: 75,
        potential: 77,
        energy: 100,
        morale: 82,
        marketValue: 0,
        wage: 30000,
        contractWeeks: 0,
        isYouth: false,
        attributes: { pace: 50, dribbling: 45, tackling: 30, defending: 77, attacking: 20, finishing: 20, passing: 68, positioning: 76, heading: 50, crossing: 30, shooting: 25, jumping: 78, playmaker: 50, elasticity: 80, physical: 76, vision: 60, composure: 74 },
      },
      {
        id: 'free-5',
        name: 'Jean Azevedo',
        age: 30,
        position: 'LD',
        overall: 71,
        potential: 71,
        energy: 100,
        morale: 74,
        marketValue: 0,
        wage: 25000,
        contractWeeks: 0,
        isYouth: false,
        attributes: { pace: 74, dribbling: 68, tackling: 71, defending: 72, attacking: 65, finishing: 50, passing: 70, positioning: 71, heading: 64, crossing: 72, shooting: 55, jumping: 70, playmaker: 66, elasticity: 60, physical: 70, vision: 66, composure: 68 },
      },
    ];

    freeAgents.forEach(p => list.push({ player: p, club: null }));

    // Jogadores dos demais clubes
    Object.values(clubs).forEach((otherClub) => {
      if (otherClub.id === currentClub.id) return;
      (otherClub.roster || []).forEach((p) => {
        list.push({ player: p, club: otherClub });
      });
    });

    return list;
  }, [clubs, currentClub, isOpen]);

  // Filtros aplicados
  const filteredPlayers = useMemo(() => {
    return allMarketPlayers.filter(({ player }) => {
      if (filterPos !== 'ALL' && player.position !== filterPos) return false;
      if (player.age > filterMaxAge) return false;
      if (player.overall < filterMinOvr) return false;
      if (player.marketValue > filterMaxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortOrder === 'ovr') return b.player.overall - a.player.overall;
      if (sortOrder === 'price') return b.player.marketValue - a.player.marketValue;
      if (sortOrder === 'age') return a.player.age - b.player.age;
      return 0;
    });
  }, [allMarketPlayers, filterPos, filterMaxAge, filterMinOvr, filterMaxPrice, sortOrder]);

  if (!isOpen || !managerProfile || !currentClub) return null;

  const myRoster = currentClub.roster || [];
  const myYouthRoster = currentClub.youthRoster || [];
  const currentBudget = currentClub.budget || 0;
  const currentWageTotal = myRoster.reduce((acc, p) => acc + (p.wage * 4), 0);
  const wageLimitMonthly = (currentClub.wageBudget || 2500000) * 4;
  const freeWageMonthly = Math.max(0, wageLimitMonthly - currentWageTotal);

  const formatPrice = (val: number) => {
    if (val === 0) return 'Livre';
    if (val >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)} mi`;
    return `R$ ${(val / 1000).toFixed(0)} mil`;
  };

  const handleProposeClick = (item: { player: Player; club: Club | null }) => {
    setNegotiatingPlayer(item);
    setOfferFee(item.player.marketValue || 500000);
    setFeedbackMsg(null);
  };

  const handleConfirmPurchase = () => {
    if (!negotiatingPlayer) return;
    const { player, club } = negotiatingPlayer;

    if (currentBudget < offerFee) {
      setFeedbackMsg({ success: false, text: 'Orçamento insuficiente para cobrir o valor de transferência.' });
      return;
    }

    const res = buyPlayerForClub(currentClub.id, player, offerFee);
    setFeedbackMsg({
      success: res.success,
      text: res.message,
    });

    if (res.success) {
      setTimeout(() => {
        setNegotiatingPlayer(null);
      }, 1500);
    }
  };

  const handlePromoteYouth = (youthPlayer: Player) => {
    // Promove jovem da base para o profissional
    useGameStore.setState(prev => {
      const targetClub = prev.clubs[currentClub.id];
      if (!targetClub) return prev;
      return {
        clubs: {
          ...prev.clubs,
          [currentClub.id]: {
            ...targetClub,
            youthRoster: targetClub.youthRoster.filter(p => p.id !== youthPlayer.id),
            roster: [...targetClub.roster, { ...youthPlayer, isYouth: false }],
          },
        },
      };
    });
    alert(`${youthPlayer.name} foi promovido ao elenco profissional!`);
  };

  const handleSellPlayer = (player: Player) => {
    const estimatedFee = Math.round(player.marketValue * 0.95);
    const res = sellPlayerFromClub(currentClub.id, player.id, estimatedFee);
    alert(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                🔎 Mercado de Transferências e Olheiros
              </h2>
              <p className="text-xs text-zinc-400">
                Contrate reforços, receba relatórios de olheiros e negocie atletas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">

          {/* Abas Superiores (Conforme Imagem 4) */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'search'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Buscar Jogadores
            </button>

            <button
              onClick={() => setActiveTab('scouts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'scouts'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Olheiros / Relatórios
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'sales'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Vendas ({myRoster.length})
            </button>

            <button
              onClick={() => setActiveTab('youth')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'youth'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              Categorias de Base ({myYouthRoster.length})
            </button>
          </div>

          {/* Faixa de Indicadores de Finanças e Elenco (Conforme Imagem 4) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Verba de Transferências</span>
                <strong className="text-emerald-400 text-sm font-black">
                  {formatPrice(currentBudget)}
                </strong>
              </div>

              <div className="border-l border-zinc-800 pl-4">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Folha Livre</span>
                <strong className="text-cyan-400 text-sm font-black">
                  R$ {(freeWageMonthly / 1_000_000).toFixed(2)} mi/mês
                </strong>
              </div>

              <div className="border-l border-zinc-800 pl-4">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Elenco</span>
                <strong className="text-zinc-200 text-sm font-black">
                  {myRoster.length}/30
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Janela Aberta
              </span>
            </div>
          </div>

          {/* ABA 1: BUSCA DE JOGADORES */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              
              {/* Filtros de Pesquisa (Conforme Imagem 4) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/80 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Posição</label>
                  <select
                    value={filterPos}
                    onChange={(e) => setFilterPos(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-semibold"
                  >
                    <option value="ALL">Todas as posições</option>
                    <option value="GOL">Goleiro (GOL)</option>
                    <option value="ZAG">Zagueiro (ZAG)</option>
                    <option value="LE">Lateral Esquerdo (LE)</option>
                    <option value="LD">Lateral Direito (LD)</option>
                    <option value="VOL">Volante (VOL)</option>
                    <option value="MEI">Meia (MEI)</option>
                    <option value="PE">Ponta Esquerda (PE)</option>
                    <option value="PD">Ponta Direita (PD)</option>
                    <option value="ATA">Atacante (ATA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Idade Máx.</label>
                  <select
                    value={filterMaxAge}
                    onChange={(e) => setFilterMaxAge(Number(e.target.value))}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-semibold"
                  >
                    <option value={99}>Qualquer idade</option>
                    <option value={20}>Até 20 anos (Base)</option>
                    <option value={23}>Até 23 anos (Jovem)</option>
                    <option value={28}>Até 28 anos (Auge)</option>
                    <option value={32}>Até 32 anos (Experiente)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Preço Máx.</label>
                  <select
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-semibold"
                  >
                    <option value={999_000_000}>Qualquer valor</option>
                    <option value={0}>Apenas Livres (R$ 0)</option>
                    <option value={10_000_000}>Até R$ 10 mi</option>
                    <option value={30_000_000}>Até R$ 30 mi</option>
                    <option value={60_000_000}>Até R$ 60 mi</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">OVR Mínimo</label>
                  <select
                    value={filterMinOvr}
                    onChange={(e) => setFilterMinOvr(Number(e.target.value))}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-semibold"
                  >
                    <option value={60}>60+ (Série C/D)</option>
                    <option value={70}>70+ (Série B)</option>
                    <option value={75}>75+ (Série A)</option>
                    <option value={80}>80+ (Estrelas)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Ordenar</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'ovr' | 'price' | 'age')}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-semibold"
                  >
                    <option value="ovr">Maior OVR</option>
                    <option value="price">Maior Preço</option>
                    <option value="age">Mais Jovens</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Jogadores do Mercado */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-3">Pos</th>
                        <th className="py-2.5 px-3">Nome</th>
                        <th className="py-2.5 px-2 text-center">Idade</th>
                        <th className="py-2.5 px-2 text-center">OVR</th>
                        <th className="py-2.5 px-2 text-center">Pot.</th>
                        <th className="py-2.5 px-3">Clube Atual</th>
                        <th className="py-2.5 px-3 text-right">Preço</th>
                        <th className="py-2.5 px-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredPlayers.slice(0, 30).map(({ player, club }) => {
                        const isFree = !club;
                        return (
                          <tr key={player.id} className="hover:bg-zinc-800/40 transition">
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded font-black text-[11px] bg-zinc-800 text-zinc-200">
                                {player.position}
                              </span>
                            </td>

                            <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">
                              {player.name}
                            </td>

                            <td className="py-2 px-2 text-center text-zinc-400">
                              {player.age}
                            </td>

                            <td className="py-2 px-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded font-black text-[11px] ${
                                player.overall >= 80 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {player.overall}
                              </span>
                            </td>

                            <td className="py-2 px-2 text-center text-zinc-400">
                              {player.potential}
                            </td>

                            <td className="py-2 px-3 text-zinc-300">
                              {club ? club.name : (
                                <span className="text-emerald-400 font-bold">Sem clube (Livre)</span>
                              )}
                            </td>

                            <td className="py-2 px-3 text-right font-black text-white whitespace-nowrap">
                              {formatPrice(player.marketValue)}
                            </td>

                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => handleProposeClick({ player, club })}
                                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                                  isFree
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-zinc-950 shadow-sm'
                                }`}
                              >
                                {isFree ? 'Contratar' : 'Propor'}
                              </button>
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

          {/* ABA 2: OLHEIROS */}
          {activeTab === 'scouts' && (
            <div className="space-y-4">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Rede de Olheiros (Nível {managerProfile.scoutingLevel || 2})
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Olheiros observam joias escondidas no futebol sul-americano e divisões inferiores
                  </p>
                </div>
                <button
                  onClick={() => alert('Olheiros enviados para nova missão de observação!')}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition shadow-sm"
                >
                  Enviar Olheiro (R$ 50 mil)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Relatório Recente · Promessa
                  </span>
                  <h4 className="text-sm font-black text-white">Mateus &quot;Rayo&quot; Silva (18 anos, ATA)</h4>
                  <p className="text-xs text-zinc-400">
                    OVR atual: 72 · Potencial estimado: <strong>86 a 89</strong>. Velocidade pura e faro de gol. Preço estimado: R$ 8,5 mi.
                  </p>
                  <button
                    onClick={() => alert('Proposta enviada aos empresários do atleta!')}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                  >
                    Fazer Oferta Direta
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                    Relatório Recente · Joia Defensiva
                  </span>
                  <h4 className="text-sm font-black text-white">Diego Morales (19 anos, VOL)</h4>
                  <p className="text-xs text-zinc-400">
                    OVR atual: 74 · Potencial estimado: <strong>84 a 87</strong>. Excelente passe longo e interceptação. Preço: R$ 9,2 mi.
                  </p>
                  <button
                    onClick={() => alert('Proposta enviada aos empresários do atleta!')}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                  >
                    Fazer Oferta Direta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: VENDAS (ELENCO ATUAL) */}
          {activeTab === 'sales' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Coloque atletas do seu elenco à venda para arrecadar verba de transferências e aliviar a folha salarial.
              </p>
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-3">Pos</th>
                        <th className="py-2.5 px-3">Nome</th>
                        <th className="py-2.5 px-2 text-center">Idade</th>
                        <th className="py-2.5 px-2 text-center">OVR</th>
                        <th className="py-2.5 px-3 text-right">Valor de Mercado</th>
                        <th className="py-2.5 px-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {myRoster.map((player) => (
                        <tr key={player.id} className="hover:bg-zinc-800/40 transition">
                          <td className="py-2 px-3 font-bold">{player.position}</td>
                          <td className="py-2 px-3 font-semibold text-white">{player.name}</td>
                          <td className="py-2 px-2 text-center text-zinc-400">{player.age}</td>
                          <td className="py-2 px-2 text-center font-bold text-emerald-400">{player.overall}</td>
                          <td className="py-2 px-3 text-right font-black text-white">{formatPrice(player.marketValue)}</td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleSellPlayer(player)}
                              className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-bold text-xs transition"
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
            </div>
          )}

          {/* ABA 4: CATEGORIAS DE BASE */}
          {activeTab === 'youth' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Jovens talentos do time Sub-20. Promova-os ao time principal para utilizá-los no Brasileirão e Copas.
              </p>
              {myYouthRoster.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  Nenhum atleta na base no momento. Melhore as instalações do CT para gerar novas promessas.
                </div>
              ) : (
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-zinc-800">
                        <tr>
                          <th className="py-2.5 px-3">Pos</th>
                          <th className="py-2.5 px-3">Nome</th>
                          <th className="py-2.5 px-2 text-center">Idade</th>
                          <th className="py-2.5 px-2 text-center">OVR</th>
                          <th className="py-2.5 px-2 text-center">Pot.</th>
                          <th className="py-2.5 px-3 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {myYouthRoster.map((player) => (
                          <tr key={player.id} className="hover:bg-zinc-800/40 transition">
                            <td className="py-2 px-3 font-bold text-emerald-400">{player.position}</td>
                            <td className="py-2 px-3 font-semibold text-white">{player.name}</td>
                            <td className="py-2 px-2 text-center text-zinc-400">{player.age} anos</td>
                            <td className="py-2 px-2 text-center font-bold text-zinc-200">{player.overall}</td>
                            <td className="py-2 px-2 text-center font-black text-cyan-400">{player.potential}</td>
                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => handlePromoteYouth(player)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition shadow-sm"
                              >
                                Promover ao Profissional
                              </button>
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

        </div>

        {/* Modal Secundário de Negociação / Proposta */}
        {negotiatingPlayer && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-black text-white">
                  Proposta por {negotiatingPlayer.player.name}
                </h3>
                <button
                  onClick={() => setNegotiatingPlayer(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Posição & OVR</span>
                  <span className="font-bold text-white">{negotiatingPlayer.player.position} · OVR {negotiatingPlayer.player.overall}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Clube de Origem</span>
                  <span className="font-bold text-white">{negotiatingPlayer.club ? negotiatingPlayer.club.name : 'Sem clube (Livre)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Salário Semanal Estimado</span>
                  <span className="font-bold text-cyan-400">R$ {(negotiatingPlayer.player.wage).toLocaleString('pt-BR')}/sem</span>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Valor de Transferência Oferecido:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={Math.max(currentBudget, 1000000)}
                      step={500000}
                      value={offerFee}
                      onChange={(e) => setOfferFee(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div className="text-right font-black text-emerald-400 text-sm mt-1">
                    {formatPrice(offerFee)}
                  </div>
                </div>

                {feedbackMsg && (
                  <div className={`p-2 rounded-lg text-xs font-semibold ${
                    feedbackMsg.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {feedbackMsg.text}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setNegotiatingPlayer(null)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition shadow-sm"
                >
                  Enviar Proposta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Mercado atualizado com os clubes brasileiros e agentes livres.
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
