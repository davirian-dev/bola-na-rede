'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { DollarSign, Landmark, Building2, Briefcase, X, ChevronRight, TrendingUp, Users, Shield, Check } from 'lucide-react';

interface ManagerFinancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerFinancesModal: React.FC<ManagerFinancesModalProps> = ({ isOpen, onClose }) => {
  const {
    clubs,
    managerProfile,
    upgradeClubFacility,
    setStadiumTicketPrice,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'stadium' | 'facility' | 'board'>('overview');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen || !managerProfile) return null;

  const club = clubs[managerProfile.clubId];
  if (!club) return null;

  const stadium = managerProfile.stadiumUpgrades || {
    comfortLevel: 1,
    vipLevel: 1,
    marketingLevel: 1,
    ticketPrice: 50,
  };

  const training = managerProfile.trainingUpgrades || {
    ctLevel: 1,
    medicalLevel: 1,
    playerFocus: {},
  };

  const budget = club.budget || 0;
  const wageBudgetWeekly = club.wageBudget || 2500000;
  const wageLimitMonthly = wageBudgetWeekly * 4;
  const currentMonthlyWage = (club.roster || []).reduce((acc, p) => acc + (p.wage * 4), 0);
  const wageUsagePercent = Math.min(100, Math.round((currentMonthlyWage / wageLimitMonthly) * 100));

  const formatMillions = (val: number) => {
    return `R$ ${(val / 1_000_000).toFixed(1)} mi`;
  };

  const handleUpgrade = (facility: 'comfort' | 'vip' | 'marketing' | 'ct' | 'medical') => {
    const res = upgradeClubFacility(facility);
    setFeedbackMsg({
      success: res.success,
      text: res.message,
    });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                💰 Finanças, Estádio e Diretoria
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {club.name}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Acompanhe o fluxo de caixa, amplie o estádio e atenda às metas da diretoria
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

          {/* Abas de Navegação (Conforme Imagens 5 e 6) */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'overview'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('stadium')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'stadium'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              Estádio
            </button>

            <button
              onClick={() => setActiveTab('facility')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'facility'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Estrutura
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
                activeTab === 'board'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Diretoria
            </button>
          </div>

          {/* Toast / Alerta de Feedback */}
          {feedbackMsg && (
            <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 animate-in fade-in ${
              feedbackMsg.success
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}>
              {feedbackMsg.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {feedbackMsg.text}
            </div>
          )}

          {/* ABA 1: VISÃO GERAL (Imagem 5) */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              
              {/* Cards de Topo: Caixa, Saldo Semana, Saldo Temporada */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Caixa do Clube</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {formatMillions(budget)}
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">
                    Verba disponível para transferências e melhorias
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Saldo da Semana</span>
                  <div className="text-xl font-black text-zinc-200 mt-1">
                    +R$ 0
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Após a disputa da rodada
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Saldo da Temporada</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    +R$ 0
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Temporada 1
                  </span>
                </div>
              </div>

              {/* Receitas e Despesas (Conforme Imagem 5) */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Demonstrativo Financeiro da Temporada 1
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Receitas */}
                  <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase">Receitas</span>
                      <span className="text-xs font-black text-emerald-400">+R$ 0</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between"><span>Bilheteria</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Direitos de TV</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Patrocínio Master</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Premiações de Torneio</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Vendas de Jogadores</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                    </div>
                  </div>

                  {/* Despesas */}
                  <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-red-400 uppercase">Despesas</span>
                      <span className="text-xs font-black text-red-400">+R$ 0</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between"><span>Salários dos Atletas</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Comissão Técnica</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Custos Operacionais</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                      <div className="flex justify-between"><span>Compras de Jogadores</span><span className="text-zinc-200 font-semibold">R$ 0</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Folha Salarial vs Limite da Diretoria (Conforme Imagem 5) */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-zinc-400">Folha Salarial Mensal:</span>{' '}
                    <strong className="text-white font-black">{formatMillions(currentMonthlyWage)}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400">Teto Permitido pela Diretoria:</span>{' '}
                    <strong className="text-amber-400 font-black">{formatMillions(wageLimitMonthly)}</strong>
                  </div>
                </div>

                <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      wageUsagePercent > 90 ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${wageUsagePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>{wageUsagePercent}% do teto salarial comprometido</span>
                  <span>Verba de transferências: {formatMillions(budget)}</span>
                </div>
              </div>

            </div>
          )}

          {/* ABA 2: ESTÁDIO E INFRAESTRUTURA (Imagem 6) */}
          {activeTab === 'stadium' && (
            <div className="space-y-5">
              
              {/* Ocupação e Dados do Estádio */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
                <div className="text-center p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Capacidade & Procura</span>
                  <div className="text-base font-black text-white mt-1">
                    {club.stadiumCapacity ? club.stadiumCapacity.toLocaleString('pt-BR') : '50.000'} lugares
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {club.stadiumName || 'Arena Principal'}
                  </span>
                </div>

                <div className="text-center p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Público Médio</span>
                  <div className="text-base font-black text-zinc-200 mt-1">
                    0 torcedores
                  </div>
                  <span className="text-[10px] text-zinc-500">0 jogos em casa</span>
                </div>

                <div className="text-center p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Jogos Lotados</span>
                  <div className="text-base font-black text-zinc-200 mt-1">
                    0
                  </div>
                  <span className="text-[10px] text-zinc-500">Recorde: 0</span>
                </div>

                <div className="text-center p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Preço do Ingresso</span>
                  <div className="text-base font-black text-emerald-400 mt-1">
                    R$ {stadium.ticketPrice || 50}
                  </div>
                  <span className="text-[10px] text-zinc-400">Preço médio configurado</span>
                </div>
              </div>

              {/* Controle de Preço do Ingresso & Bilheteria */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      🎟️ Política de Preço do Ingresso
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        R$ {stadium.ticketPrice || 50} por entrada
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Ingressos mais baratos atraem povão e lotam o caldeirão; ingressos caros rendem mais por jogo, mas exigem boa fase.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[
                      { label: 'Popular', price: 25, desc: 'Lotação 95%' },
                      { label: 'Padrão', price: 50, desc: 'Lotação 80%' },
                      { label: 'VIP / Clássico', price: 90, desc: 'Lotação 60%' },
                    ].map((pol) => {
                      const isSelected = (stadium.ticketPrice || 50) === pol.price;
                      return (
                        <button
                          key={pol.price}
                          type="button"
                          onClick={() => setStadiumTicketPrice(club.id, pol.price)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-500 font-black shadow-sm'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          <span>{pol.label} (R$ {pol.price})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Projeção de Renda */}
                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                  <span>Projeção de Renda por Partida em Casa:</span>
                  <span className="font-mono font-black text-emerald-400">
                    ~R$ {(((club.stadiumCapacity || 50000) * ((stadium.ticketPrice || 50) === 25 ? 0.95 : (stadium.ticketPrice || 50) === 50 ? 0.80 : 0.60) * (stadium.ticketPrice || 50)) / 1000).toFixed(0)} mil / jogo
                  </span>
                </div>
              </div>

              {/* Seção Infraestrutura (Conforme Imagem 6) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Infraestrutura do Estádio (As melhorias valem na hora)
                </h3>

                {/* Melhoria 1: Conforto e Setores */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-2">
                        🪑 Conforto e setores
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          Nível {stadium.comfortLevel}/5
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Cadeiras acolchoadas, banheiros modernos e praça de alimentação: o torcedor aceita pagar mais e a procura cresce.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
                    <span className="text-zinc-400">
                      Próximo nível: <strong className="text-zinc-200">ingresso +5% · procura +2% · ganho estimado +R$ 98 mil/semana</strong>
                    </span>
                    <button
                      onClick={() => handleUpgrade('comfort')}
                      className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black text-xs transition shadow-sm whitespace-nowrap"
                    >
                      Melhorar · R$ 4,00 mi
                    </button>
                  </div>
                </div>

                {/* Melhoria 2: Camarotes e Área VIP */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-2">
                        👑 Camarotes e área VIP
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          Nível {stadium.vipLevel}/5
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Camarotes corporativos e hospitalidade: receita extra em todo jogo em casa, mesmo com arquibancada cheia.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
                    <span className="text-zinc-400">
                      Próximo nível: <strong className="text-zinc-200">+4% de bilheteria em jogos em casa · ganho estimado +R$ 78 mil/semana</strong>
                    </span>
                    <button
                      onClick={() => handleUpgrade('vip')}
                      className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black text-xs transition shadow-sm whitespace-nowrap"
                    >
                      Melhorar · R$ 5,00 mi
                    </button>
                  </div>
                </div>

                {/* Melhoria 3: Marketing e Patrocínio */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-2">
                        📢 Marketing e placas de patrocínio
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          Nível {stadium.marketingLevel}/5
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Placas de LED à beira do campo, naming de setores e parceiros comerciais de renome internacional.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
                    <span className="text-zinc-400">
                      Próximo nível: <strong className="text-zinc-200">patrocínio +10% · ganho estimado +R$ 124 mil/semana</strong>
                    </span>
                    <button
                      onClick={() => handleUpgrade('marketing')}
                      className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black text-xs transition shadow-sm whitespace-nowrap"
                    >
                      Melhorar · R$ 4,00 mi
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ABA 3: ESTRUTURA (CENTRO DE TREINAMENTO & DEP. MÉDICO) */}
          {activeTab === 'facility' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Aprimore as instalações esportivas para acelerar o desenvolvimento dos atletas e recuperar jogadores lesionados mais rápido.
              </p>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      🏋️ Centro de Treinamento
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                        Nível {training.ctLevel}/5
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Campos de padrão internacional, academia moderna e tecnologia de análise de desempenho: +15% de velocidade de evolução por nível.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
                  <span className="text-zinc-400">
                    Próximo nível: <strong className="text-zinc-200">+1 vaga para titulares e +1 vaga para reservas nos treinos individuais</strong>
                  </span>
                  <button
                    onClick={() => handleUpgrade('ct')}
                    className="py-1.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-xs transition shadow-sm whitespace-nowrap"
                  >
                    Melhorar · R$ 6,00 mi
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      🏥 Departamento Médico & Fisioterapia
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                        Nível {training.medicalLevel}/5
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Tratamentos de recuperação rápida, prevenção de lesões e retorno acelerado de atletas ao time principal.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs">
                  <span className="text-zinc-400">
                    Próximo nível: <strong className="text-zinc-200">-30% no tempo de recuperação de lesões e menor risco de contusão em treinos</strong>
                  </span>
                  <button
                    onClick={() => handleUpgrade('medical')}
                    className="py-1.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition shadow-sm whitespace-nowrap"
                  >
                    Melhorar · R$ 4,50 mi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: DIRETORIA (METAS E CONFIANÇA) */}
          {activeTab === 'board' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">Confiança da Diretoria</span>
                    <span className="text-xs font-black text-emerald-400">{managerProfile.boardConfidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${managerProfile.boardConfidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Cuidado: se a confiança cair abaixo de 20%, você corre sério risco de demissão.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">Confiança da Torcida</span>
                    <span className="text-xs font-black text-blue-400">{managerProfile.fansConfidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${managerProfile.fansConfidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Vencer clássicos e jogar bonito eleva a moral das arquibancadas.
                  </span>
                </div>
              </div>

              {/* Metas da Temporada */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Metas Contratuais para a Temporada 2026
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Terminar na primeira metade da tabela (G8) no Campeonato Nacional</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">Em andamento</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Alcançar as Oitavas de Final na Copa do Brasil</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">Em andamento</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Promover pelo menos 2 atletas da base Sub-20 ao profissional</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">0/2 promovidos</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Todas as receitas e despesas são auditadas e calculadas a cada rodada.
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
