'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TacticalFormation, ManagerTacticsPhilosophy, Player, Position } from '@/types/game';
import { X, Sparkles, Shield, ChevronDown, ChevronUp, Zap, Target, Flame } from 'lucide-react';

interface ManagerTacticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Coordenadas táticas no campinho SVG (0 a 100 em X e Y)
const FORMATION_COORDINATES: Record<TacticalFormation, { role: Position; x: number; y: number }[]> = {
  '4-3-3': [
    { role: 'GOL', x: 50, y: 88 },
    { role: 'LE', x: 15, y: 70 },
    { role: 'ZAG', x: 38, y: 72 },
    { role: 'ZAG', x: 62, y: 72 },
    { role: 'LD', x: 85, y: 70 },
    { role: 'VOL', x: 50, y: 52 },
    { role: 'MEI', x: 32, y: 40 },
    { role: 'MEI', x: 68, y: 40 },
    { role: 'PE', x: 20, y: 20 },
    { role: 'ATA', x: 50, y: 15 },
    { role: 'PD', x: 80, y: 20 },
  ],
  '4-4-2': [
    { role: 'GOL', x: 50, y: 88 },
    { role: 'LE', x: 15, y: 70 },
    { role: 'ZAG', x: 38, y: 72 },
    { role: 'ZAG', x: 62, y: 72 },
    { role: 'LD', x: 85, y: 70 },
    { role: 'MEI', x: 18, y: 45 },
    { role: 'VOL', x: 40, y: 48 },
    { role: 'VOL', x: 60, y: 48 },
    { role: 'MEI', x: 82, y: 45 },
    { role: 'ATA', x: 38, y: 18 },
    { role: 'ATA', x: 62, y: 18 },
  ],
  '4-2-3-1': [
    { role: 'GOL', x: 50, y: 88 },
    { role: 'LE', x: 15, y: 70 },
    { role: 'ZAG', x: 38, y: 72 },
    { role: 'ZAG', x: 62, y: 72 },
    { role: 'LD', x: 85, y: 70 },
    { role: 'VOL', x: 38, y: 54 },
    { role: 'VOL', x: 62, y: 54 },
    { role: 'PE', x: 22, y: 35 },
    { role: 'MEI', x: 50, y: 32 },
    { role: 'PD', x: 78, y: 35 },
    { role: 'ATA', x: 50, y: 16 },
  ],
  '3-5-2': [
    { role: 'GOL', x: 50, y: 88 },
    { role: 'ZAG', x: 25, y: 72 },
    { role: 'ZAG', x: 50, y: 74 },
    { role: 'ZAG', x: 75, y: 72 },
    { role: 'LE', x: 12, y: 46 },
    { role: 'VOL', x: 36, y: 50 },
    { role: 'MEI', x: 50, y: 40 },
    { role: 'VOL', x: 64, y: 50 },
    { role: 'LD', x: 88, y: 46 },
    { role: 'ATA', x: 38, y: 18 },
    { role: 'ATA', x: 62, y: 18 },
  ],
  '5-3-2': [
    { role: 'GOL', x: 50, y: 88 },
    { role: 'LE', x: 12, y: 68 },
    { role: 'ZAG', x: 32, y: 72 },
    { role: 'ZAG', x: 50, y: 74 },
    { role: 'ZAG', x: 68, y: 72 },
    { role: 'LD', x: 88, y: 68 },
    { role: 'VOL', x: 35, y: 46 },
    { role: 'MEI', x: 50, y: 40 },
    { role: 'VOL', x: 65, y: 46 },
    { role: 'ATA', x: 38, y: 18 },
    { role: 'ATA', x: 62, y: 18 },
  ],
  '4-1-4-1': [
    { role: 'GOL', x: 50, y: 88 },
    { role: 'LE', x: 15, y: 70 },
    { role: 'ZAG', x: 38, y: 72 },
    { role: 'ZAG', x: 62, y: 72 },
    { role: 'LD', x: 85, y: 70 },
    { role: 'VOL', x: 50, y: 56 },
    { role: 'PE', x: 18, y: 38 },
    { role: 'MEI', x: 38, y: 38 },
    { role: 'MEI', x: 62, y: 38 },
    { role: 'PD', x: 82, y: 38 },
    { role: 'ATA', x: 50, y: 16 },
  ],
};

export const ManagerTacticsModal: React.FC<ManagerTacticsModalProps> = ({ isOpen, onClose }) => {
  const {
    clubs,
    managerProfile,
    setManagerHighPressure,
    setManagerPhilosophy,
    autoSelectLineup,
    setClubTacticalRoles,
  } = useGameStore();

  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (!isOpen || !managerProfile) return null;

  const club = clubs[managerProfile.clubId];
  if (!club) return null;

  const currentFormation = managerProfile.formation || '4-3-3';
  const currentPhilosophy = managerProfile.philosophy || 'balanced';
  const highPressure = managerProfile.highPressure ?? false;
  const entrosamento = managerProfile.entrosamento ?? 65;

  const roster = club.roster || [];
  const titularIds = club.lineup || [];
  const reserveIds = managerProfile.selectedReservesIds || [];

  const titulares = titularIds
    .map(id => roster.find(p => p.id === id))
    .filter((p): p is Player => Boolean(p));

  const reservas = reserveIds
    .map(id => roster.find(p => p.id === id))
    .filter((p): p is Player => Boolean(p));

  const coords = FORMATION_COORDINATES[currentFormation] || FORMATION_COORDINATES['4-3-3'];

  const captain = titulares.find(p => p.id === club.captainPlayerId) || titulares[0];
  const penaltyTaker = titulares.find(p => p.id === club.penaltyTakerPlayerId) || titulares[1] || titulares[0];
  const freeKickTaker = titulares.find(p => p.id === club.freeKickTakerPlayerId) || titulares[2] || titulares[0];

  const handleFormationChange = (formation: TacticalFormation) => {
    useGameStore.setState(prev => ({
      managerProfile: prev.managerProfile ? {
        ...prev.managerProfile,
        formation,
      } : undefined,
      clubs: {
        ...prev.clubs,
        [club.id]: {
          ...prev.clubs[club.id],
          tactics: {
            ...(prev.clubs[club.id].tactics || {}),
            formation,
          },
        },
      },
    }));
  };

  const toggleFaq = (key: string) => {
    setOpenFaq(prev => prev === key ? null : key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                ⚽ Prancheta Tática & Formação
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentFormation}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Ajuste a disposição tática, postura, entrosamento e batedores oficiais
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* Barra Superior: Formação, Auto Escalação, Postura e Pressão Alta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
            
            {/* Formação e Auto Escalação */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Formação</span>
                <span className="text-[10px] text-zinc-400">11 titulares</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={currentFormation}
                  onChange={(e) => handleFormationChange(e.target.value as TacticalFormation)}
                  className="flex-1 py-2 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="4-3-3">4-3-3 Clássico</option>
                  <option value="4-4-2">4-4-2 Tradicional</option>
                  <option value="4-2-3-1">4-2-3-1 Moderno</option>
                  <option value="3-5-2">3-5-2 Três Zagueiros</option>
                  <option value="5-3-2">5-3-2 Retranca</option>
                  <option value="4-1-4-1">4-1-4-1 Equilibrado</option>
                </select>
                <button
                  onClick={() => autoSelectLineup(club.id)}
                  className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black text-xs flex items-center gap-1 transition shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto
                </button>
              </div>
            </div>

            {/* Postura Tática */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Postura Tática
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {(['attacking', 'balanced', 'defensive', 'possession'] as ManagerTacticsPhilosophy[]).map((phil) => {
                  const labels: Record<ManagerTacticsPhilosophy, string> = {
                    attacking: 'Ofensivo',
                    balanced: 'Equilibrado',
                    defensive: 'Defensivo',
                    possession: 'Posse',
                  };
                  const isActive = currentPhilosophy === phil;
                  return (
                    <button
                      key={phil}
                      onClick={() => setManagerPhilosophy(phil)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition ${
                        isActive
                          ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {labels[phil]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pressão Alta */}
            <div className="lg:col-span-3 flex flex-col justify-center gap-1.5 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className={`w-3.5 h-3.5 ${highPressure ? 'text-orange-400' : 'text-zinc-500'}`} />
                  Pressão Alta
                </span>
                <button
                  onClick={() => setManagerHighPressure(!highPressure)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    highPressure ? 'bg-orange-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      highPressure ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <span className="text-[10px] text-zinc-400">
                {highPressure ? 'Ativa: cansa mais, recupera rápido' : 'Desligada: menor desgaste físico'}
              </span>
            </div>

          </div>

          {/* Barra de Entrosamento */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Entrosamento da Equipe:</span>
                  <span className="text-xs font-black text-cyan-400">{entrosamento}%</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Aumenta com treinos e sequências com a mesma escalação. Melhora passes e posicionamento.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${entrosamento}%` }}
              />
            </div>
          </div>

          {/* Acordeões Explicativos */}
          <div className="space-y-1.5 text-xs">
            <div className="border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-900/30">
              <button
                onClick={() => toggleFaq('pressure')}
                className="w-full px-3 py-2 flex items-center justify-between text-left text-zinc-300 hover:text-white font-semibold"
              >
                <span>▶ O que faz a pressão alta?</span>
                {openFaq === 'pressure' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {openFaq === 'pressure' && (
                <div className="px-3 pb-2 text-[11px] text-zinc-400 border-t border-zinc-800/50 pt-2">
                  A pressão alta sufoca a saída de bola adversária gerando desarmes no campo de ataque e mais lances de perigo. Em contrapartida, os atletas perdem cerca de 15% a mais de energia por jogo.
                </div>
              )}
            </div>

            <div className="border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-900/30">
              <button
                onClick={() => toggleFaq('posture')}
                className="w-full px-3 py-2 flex items-center justify-between text-left text-zinc-300 hover:text-white font-semibold"
              >
                <span>▶ Como funcionam as posturas táticas?</span>
                {openFaq === 'posture' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {openFaq === 'posture' && (
                <div className="px-3 pb-2 text-[11px] text-zinc-400 border-t border-zinc-800/50 pt-2">
                  <strong>Ofensivo:</strong> Linhas avançadas, mais posse e chances de gol, porém maior exposição a contra-ataques.<br />
                  <strong>Equilibrado:</strong> Ritmo controlado e distribuição uniforme de energia e criação.<br />
                  <strong>Defensivo:</strong> Duas linhas compactas atrás da linha da bola e busca por saídas velozes nas pontas.
                </div>
              )}
            </div>
          </div>

          {/* Grid Principal: Campinho 2D à Esquerda e Cobradores + Banco à Direita */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Campinho Tático 2D Verde */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] max-w-[480px] bg-gradient-to-b from-emerald-900/90 via-emerald-800/90 to-emerald-950/90 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl overflow-hidden">
                {/* Linhas do Campo */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-300/30" viewBox="0 0 100 100">
                  {/* Linha externa */}
                  <rect x="5" y="5" width="90" height="90" fill="none" strokeWidth="0.8" />
                  {/* Linha do meio */}
                  <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.8" />
                  {/* Círculo central */}
                  <circle cx="50" cy="50" r="12" fill="none" strokeWidth="0.8" />
                  <circle cx="50" cy="50" r="0.8" fill="currentColor" />
                  {/* Grande área superior */}
                  <rect x="25" y="5" width="50" height="16" fill="none" strokeWidth="0.8" />
                  {/* Grande área inferior */}
                  <rect x="25" y="79" width="50" height="16" fill="none" strokeWidth="0.8" />
                  {/* Pequena área superior */}
                  <rect x="36" y="5" width="28" height="6" fill="none" strokeWidth="0.8" />
                  {/* Pequena área inferior */}
                  <rect x="36" y="89" width="28" height="6" fill="none" strokeWidth="0.8" />
                </svg>

                {/* 11 Jogadores em Campo */}
                {coords.map((slot, index) => {
                  const player = titulares[index];
                  const ovr = player ? player.overall : '--';
                  const name = player ? player.name.split(' ')[0] : slot.role;

                  return (
                    <div
                      key={index}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition hover:scale-110 group z-10"
                      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                    >
                      {/* Círculo / Camisa do Atleta */}
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-zinc-900 group-hover:border-white group-hover:bg-emerald-400 transition">
                        {ovr}
                      </div>
                      {/* Nome e Posição */}
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-[9px] font-bold text-white whitespace-nowrap shadow-sm text-center leading-tight">
                        <span className="text-emerald-400 mr-0.5">{slot.role}</span>
                        {name}
                      </div>
                    </div>
                  );
                })}
              </div>

              <span className="text-[11px] text-zinc-400 mt-2 text-center">
                Visualização tática dos 11 titulares em campo na formação {currentFormation}.
              </span>
            </div>

            {/* Painel Lateral: Cobradores Oficiais & Banco de 7 Reservas */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Capitão & Cobradores */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  ★ Capitão & Cobradores Oficiais
                </h3>

                {/* Capitão */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
                    <span>Capitão ©️</span>
                    {captain && (
                      <span className="text-[10px] text-zinc-400">
                        Liderança e moral para o elenco
                      </span>
                    )}
                  </label>
                  <select
                    value={club.captainPlayerId || captain?.id || ''}
                    onChange={(e) => setClubTacticalRoles(club.id, { captainPlayerId: e.target.value })}
                    className="w-full py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  >
                    {titulares.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.position} · {p.name} (OVR {p.overall})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cobrador de Pênaltis */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">
                    Batedor Oficial de Pênaltis 🎯
                  </label>
                  <select
                    value={club.penaltyTakerPlayerId || penaltyTaker?.id || ''}
                    onChange={(e) => setClubTacticalRoles(club.id, { penaltyTakerPlayerId: e.target.value })}
                    className="w-full py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  >
                    {titulares.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.position} · {p.name} (Chute {p.attributes.shooting})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cobrador de Faltas */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">
                    Cobrador de Faltas Perigosas ☄️
                  </label>
                  <select
                    value={club.freeKickTakerPlayerId || freeKickTaker?.id || ''}
                    onChange={(e) => setClubTacticalRoles(club.id, { freeKickTakerPlayerId: e.target.value })}
                    className="w-full py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                  >
                    {titulares.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.position} · {p.name} (Passe/Chute {Math.round((p.attributes.passing + p.attributes.shooting) / 2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lista dos 7 Reservas Relacionados */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    Banco de Reservas ({reservas.length}/7)
                  </h3>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    Opções para substituição
                  </span>
                </div>

                {reservas.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-lg border border-zinc-800/60">
                    Nenhum reserva selecionado. Use o botão <strong>Auto</strong> no Elenco ou selecione manualmente.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {reservas.map(p => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-black text-[10px]">
                            {p.position}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {p.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-zinc-400 font-medium">
                            OVR <strong className="text-zinc-200">{p.overall}</strong>
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {p.energy}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Formação e postura ativas para a próxima partida.
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
