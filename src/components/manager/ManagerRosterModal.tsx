'use client';

import React, { useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, Position } from '@/types/game';
import { Users, X, Check, ShieldAlert, Sparkles, ChevronRight, AlertTriangle } from 'lucide-react';

interface ManagerRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerRosterModal: React.FC<ManagerRosterModalProps> = ({ isOpen, onClose }) => {
  const {
    clubs,
    managerProfile,
    autoSelectLineup,
    autoSelectReserves,
    clearReservesSelection,
    toggleReservePlayer,
  } = useGameStore();

  const [filterPos, setFilterPos] = useState<string>('ALL');

  const club = managerProfile ? clubs[managerProfile.clubId] : undefined;

  const roster = useMemo(() => club?.roster || [], [club?.roster]);
  const titularIds = useMemo(() => new Set(club?.lineup || []), [club?.lineup]);
  const reserveIds = useMemo(() => new Set(managerProfile?.selectedReservesIds || []), [managerProfile?.selectedReservesIds]);

  // Ordena elenco: primeiro titulares, depois reservas, depois os demais; dentro de cada grupo por OVR decrescente
  const sortedRoster = useMemo(() => {
    return [...roster].sort((a, b) => {
      const aIsTitular = titularIds.has(a.id);
      const bIsTitular = titularIds.has(b.id);
      if (aIsTitular && !bIsTitular) return -1;
      if (!aIsTitular && bIsTitular) return 1;

      const aIsReserve = reserveIds.has(a.id);
      const bIsReserve = reserveIds.has(b.id);
      if (aIsReserve && !bIsReserve) return -1;
      if (!aIsReserve && bIsReserve) return 1;

      return b.overall - a.overall;
    });
  }, [roster, titularIds, reserveIds]);

  const filteredRoster = useMemo(() => {
    return filterPos === 'ALL' 
      ? sortedRoster 
      : sortedRoster.filter(p => p.position === filterPos);
  }, [sortedRoster, filterPos]);

  if (!isOpen || !managerProfile || !club) return null;

  // Médias e Cálculos
  const titularPlayers = roster.filter(p => titularIds.has(p.id));
  const avgTitularOvr = titularPlayers.length > 0
    ? (titularPlayers.reduce((acc, p) => acc + p.overall, 0) / titularPlayers.length).toFixed(1)
    : '0.0';

  const totalMonthlyWage = roster.reduce((acc, p) => acc + (p.wage * 4), 0);
  const wageLimitMonthly = (club.wageBudget || 2500000) * 4;

  const formatMoney = (val: number) => {
    if (val >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)} mi/mês`;
    return `R$ ${(val / 1000).toFixed(0)} mil/mês`;
  };

  const getPositionBadgeColor = (pos: Position, isTitular: boolean, isReserve: boolean) => {
    if (isTitular) return 'bg-emerald-500 text-zinc-950 font-black shadow-sm shadow-emerald-500/20';
    if (isReserve) return 'bg-amber-500 text-zinc-950 font-black shadow-sm shadow-amber-500/20';
    
    switch (pos) {
      case 'GOL': return 'bg-amber-600/30 text-amber-300 border border-amber-500/40';
      case 'ZAG': return 'bg-blue-600/30 text-blue-300 border border-blue-500/40';
      case 'LE':
      case 'LD': return 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40';
      case 'VOL': return 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40';
      case 'MEI':
      case 'MC': return 'bg-purple-600/30 text-purple-300 border border-purple-500/40';
      case 'ATA':
      case 'PE':
      case 'PD': return 'bg-red-600/30 text-red-300 border border-red-500/40';
      default: return 'bg-zinc-800 text-zinc-300';
    }
  };

  // 4 Habilidades chave de acordo com a posição real do atleta
  const getFourSkills = (p: Player) => {
    const a = p.attributes;
    switch (p.position) {
      case 'GOL':
        return [
          { label: 'Def', val: a.defending },
          { label: 'Pos', val: a.positioning || 70 },
          { label: 'Ela', val: a.elasticity || 75 },
          { label: 'Pas', val: a.passing },
        ];
      case 'ZAG':
        return [
          { label: 'Des', val: a.tackling || a.defending },
          { label: 'Cab', val: a.heading || 72 },
          { label: 'Sal', val: a.jumping || a.physical || 70 },
          { label: 'Pos', val: a.positioning || 70 },
        ];
      case 'LE':
      case 'LD':
        return [
          { label: 'Vel', val: a.pace },
          { label: 'Cru', val: a.crossing || 70 },
          { label: 'Des', val: a.tackling || a.defending },
          { label: 'Pas', val: a.passing },
        ];
      case 'VOL':
        return [
          { label: 'Des', val: a.tackling || a.defending },
          { label: 'Pas', val: a.passing },
          { label: 'Pos', val: a.positioning || 70 },
          { label: 'Arm', val: a.playmaker || a.vision || 68 },
        ];
      case 'MEI':
      case 'MC':
        return [
          { label: 'Pas', val: a.passing },
          { label: 'Arm', val: a.playmaker || a.vision || 72 },
          { label: 'Dri', val: a.dribbling },
          { label: 'Fin', val: a.finishing || a.shooting },
        ];
      case 'PE':
      case 'PD':
        return [
          { label: 'Vel', val: a.pace },
          { label: 'Dri', val: a.dribbling },
          { label: 'Fin', val: a.finishing || a.shooting },
          { label: 'Cru', val: a.crossing || 70 },
        ];
      case 'ATA':
      default:
        return [
          { label: 'Fin', val: a.finishing || a.shooting },
          { label: 'Cab', val: a.heading || 72 },
          { label: 'Ate', val: a.positioning || 75 },
          { label: 'Sal', val: a.jumping || a.physical || 70 },
        ];
    }
  };

  const handlePositionClick = (player: Player) => {
    // Se for titular, não alterna para reserva diretamente
    if (titularIds.has(player.id)) {
      return;
    }
    toggleReservePlayer(club.id, player.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                👥 Elenco Profissional
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {club.name}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Gerencie seus titulares e reservas para as partidas oficiais
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">

          {/* Painel de Ações Rápidas de Escalação (Conforme Imagem 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
            
            {/* Lado Titulares */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Time Titular ({titularPlayers.length}/11)
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  OVR Médio: {avgTitularOvr}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => autoSelectLineup(club.id)}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Escalar time titular - automático
                </button>
                <button
                  onClick={() => {
                    // Limpa titulares
                    useGameStore.setState(prev => ({
                      clubs: {
                        ...prev.clubs,
                        [club.id]: {
                          ...club,
                          lineup: [],
                        },
                      },
                    }));
                  }}
                  className="py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition"
                >
                  Limpar titulares
                </button>
              </div>
            </div>

            {/* Lado Reservas */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  RESERVAS - {reserveIds.size}/7 {reserveIds.size === 7 ? '(completo)' : ''}
                </span>
                <span className="text-xs text-zinc-400">
                  Banco de reservas da partida
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => autoSelectReserves(club.id)}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Escalar reservas - automático
                </button>
                <button
                  onClick={() => clearReservesSelection(club.id)}
                  className="py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition"
                >
                  Limpar reservas
                </button>
              </div>
            </div>

          </div>

          {/* Dica e Regras de Seleção */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-zinc-300 font-semibold">Legenda de escalação:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-black text-[10px]">
                Titular (verde)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-black text-[10px]">
                Reserva (amarelo)
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {roster.length} atletas no profissional · Folha: <strong className="text-zinc-200">{formatMoney(totalMonthlyWage)}</strong> · Limite: <strong className="text-zinc-200">{formatMoney(wageLimitMonthly)}</strong>
            </div>
          </div>

          {/* Filtro Rápido de Posição */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'GOL', 'ZAG', 'LE', 'LD', 'VOL', 'MEI', 'ATA'].map((pos) => (
              <button
                key={pos}
                onClick={() => setFilterPos(pos)}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  filterPos === pos
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {pos === 'ALL' ? 'Todos os Atletas' : pos}
              </button>
            ))}
          </div>

          {/* Tabela de Atletas */}
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
                    <th className="py-2.5 px-3 text-center">Habilidades da Posição</th>
                    <th className="py-2.5 px-2 text-center">Energia</th>
                    <th className="py-2.5 px-2 text-center">Moral</th>
                    <th className="py-2.5 px-3 text-center">Contrato</th>
                    <th className="py-2.5 px-3 text-right">Salário</th>
                    <th className="py-2.5 px-3 text-center">J/G/A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredRoster.map((player) => {
                    const isTitular = titularIds.has(player.id);
                    const isReserve = reserveIds.has(player.id);
                    const isCaptain = club.captainPlayerId === player.id;
                    const contractYears = Math.max(1, Math.round(player.contractWeeks / 48));
                    const isContractExpiring = player.contractWeeks < 48;
                    const skills = getFourSkills(player);

                    return (
                      <tr
                        key={player.id}
                        className={`hover:bg-zinc-800/40 transition ${
                          isTitular
                            ? 'bg-emerald-950/15'
                            : isReserve
                            ? 'bg-amber-950/15'
                            : ''
                        }`}
                      >
                        {/* Botão Clicável de Posição */}
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handlePositionClick(player)}
                            aria-label={isTitular ? 'Titular confirmado' : isReserve ? 'Reserva selecionado' : 'Não relacionado'}
                            className={`px-2 py-1 rounded text-[11px] font-black transition ${getPositionBadgeColor(
                              player.position,
                              isTitular,
                              isReserve
                            )}`}
                          >
                            {player.position}
                          </button>
                        </td>

                        {/* Nome */}
                        <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{player.name}</span>
                            {isCaptain && (
                              <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" title="Capitão da equipe">
                                ©️
                              </span>
                            )}
                            {player.isInjured && (
                              <span className="text-[10px] px-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold" title="No Departamento Médico">
                                🏥
                              </span>
                            )}
                            {player.isSuspended && (
                              <span className="text-[10px] px-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold" title="Suspenso por cartões">
                                🟨
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Idade */}
                        <td className="py-2 px-2 text-center text-zinc-400">
                          {player.age}
                        </td>

                        {/* OVR */}
                        <td className="py-2 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-black text-[11px] ${
                            player.overall >= 80 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : player.overall >= 70
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {player.overall}
                          </span>
                        </td>

                        {/* Potencial */}
                        <td className="py-2 px-2 text-center text-zinc-400 font-medium">
                          {player.potential}
                        </td>

                        {/* 4 Habilidades da Posição */}
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center gap-2">
                            {skills.map((s, idx) => (
                              <div key={idx} className="flex items-center gap-0.5 text-[11px]">
                                <span className="text-zinc-500 font-medium">{s.label}</span>
                                <span className="text-zinc-200 font-bold">{s.val}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Energia */}
                        <td className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className={`font-semibold ${player.energy >= 80 ? 'text-emerald-400' : player.energy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                              {player.energy}%
                            </span>
                          </div>
                        </td>

                        {/* Moral */}
                        <td className="py-2 px-2 text-center">
                          <span className="text-zinc-300 font-semibold">
                            {player.morale}%
                          </span>
                        </td>

                        {/* Contrato */}
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          {isContractExpiring ? (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              &lt; 1 ano
                            </span>
                          ) : (
                            <span className="text-zinc-400">
                              {contractYears} {contractYears === 1 ? 'ano' : 'anos'}
                            </span>
                          )}
                        </td>

                        {/* Salário */}
                        <td className="py-2 px-3 text-right font-semibold text-zinc-200 whitespace-nowrap">
                          {formatMoney(player.wage * 4)}
                        </td>

                        {/* J/G/A */}
                        <td className="py-2 px-3 text-center text-zinc-400 font-mono text-[11px]">
                          {player.stats?.matches || 0}/{player.stats?.goals || 0}/{player.stats?.assists || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Escalação salva automaticamente no banco do clube.
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
