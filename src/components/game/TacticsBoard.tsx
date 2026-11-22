'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TacticalFormation, Player } from '@/types/game';
import { OverallBadge } from './OverallBadge';
import { PerformanceIndicator } from './PerformanceIndicator';
import { ClubBadge } from './ClubBadge';
import { 
  Users, 
  ArrowLeftRight, 
  Check, 
  Shield, 
  Flame, 
  Sparkles, 
  Target,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TacticsBoardProps {
  clubId?: string;
  isMatchContext?: boolean;
  substitutionsRemaining?: number;
  onMakeSubstitution?: (inPlayerId: string, outPlayerId: string) => void;
}

const FORMATIONS: { id: TacticalFormation; label: string; desc: string }[] = [
  { id: '4-3-3', label: '4-3-3 Ofensivo', desc: '1 GOL, 4 DEF, 3 MEI, 3 ATA' },
  { id: '4-4-2', label: '4-4-2 Clássico', desc: '1 GOL, 4 DEF, 4 MEI, 2 ATA' },
  { id: '4-2-3-1', label: '4-2-3-1 Moderno', desc: '1 GOL, 4 DEF, 2 VOL, 3 MEI, 1 CA' },
  { id: '3-5-2', label: '3-5-2 Alas', desc: '1 GOL, 3 ZAG, 2 ALAS, 3 MEI, 2 ATA' },
  { id: '5-3-2', label: '5-3-2 Retranca', desc: '1 GOL, 5 DEF, 3 MEI, 2 ATA' },
  { id: '4-1-4-1', label: '4-1-4-1 Equilíbrio', desc: '1 GOL, 4 DEF, 1 VOL, 4 MEI, 1 ATA' },
];

export function TacticsBoard({
  clubId,
  isMatchContext = false,
  substitutionsRemaining = 5,
  onMakeSubstitution,
}: TacticsBoardProps) {
  const mode = useGameStore((s) => s.mode);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const setManagerFormation = useGameStore((s) => s.setManagerFormation);
  const swapPlayersInRoster = useGameStore((s) => s.swapPlayersInRoster);
  const setClubTacticalRoles = useGameStore((s) => s.setClubTacticalRoles);

  const targetClubId = clubId || (mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId);
  const club = targetClubId ? clubs[targetClubId] : null;

  const currentFormation: TacticalFormation = managerProfile?.formation || '4-3-3';
  const [selectedFormation, setSelectedFormation] = useState<TacticalFormation>(currentFormation);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!club) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground font-semibold">
        Nenhum clube selecionado para prancheta tática.
      </div>
    );
  }

  const roster = club.roster || [];
  const starters = roster.slice(0, 11);
  const bench = roster.slice(11, 23);
  const reserves = roster.slice(23);

  // Manipula troca de jogadores (Swap entre Titulares e Reservas)
  const handleSelectPlayer = (rosterIndex: number) => {
    if (selectedPlayerIndex === null) {
      setSelectedPlayerIndex(rosterIndex);
      const p = roster[rosterIndex];
      setFeedback(`Selecionado: ${p.name} (${p.position} • OVR ${p.overall}). Clique em outro atleta para trocar de posição.`);
    } else if (selectedPlayerIndex === rosterIndex) {
      // Desmarca se clicar no mesmo
      setSelectedPlayerIndex(null);
      setFeedback(null);
    } else {
      // Efetua a troca
      const playerA = roster[selectedPlayerIndex];
      const playerB = roster[rosterIndex];

      if (isMatchContext) {
        if (substitutionsRemaining <= 0) {
          setFeedback('Limite de 5 substituições na partida atingido!');
          setSelectedPlayerIndex(null);
          return;
        }
        onMakeSubstitution?.(playerB.id, playerA.id);
      }

      swapPlayersInRoster(club.id, selectedPlayerIndex, rosterIndex);
      setSelectedPlayerIndex(null);
      setFeedback(`🔄 Troca realizada! ${playerA.name} ⇄ ${playerB.name}.`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleFormationChange = (form: TacticalFormation) => {
    setSelectedFormation(form);
    setManagerFormation(form);
    setFeedback(`📐 Esquema alterado para ${form}! Posicionamento atualizado.`);
  };

  // Coordenadas das formações no campinho 2D (%)
  const getFormationCoordinates = (formation: TacticalFormation) => {
    switch (formation) {
      case '4-4-2':
        return [
          { x: 50, y: 88, role: 'GOL' },
          { x: 16, y: 72, role: 'LD' },
          { x: 38, y: 74, role: 'ZAG' },
          { x: 62, y: 74, role: 'ZAG' },
          { x: 84, y: 72, role: 'LE' },
          { x: 18, y: 48, role: 'MD' },
          { x: 38, y: 50, role: 'MC' },
          { x: 62, y: 50, role: 'MC' },
          { x: 82, y: 48, role: 'ME' },
          { x: 36, y: 22, role: 'ATA' },
          { x: 64, y: 22, role: 'ATA' },
        ];
      case '4-2-3-1':
        return [
          { x: 50, y: 88, role: 'GOL' },
          { x: 16, y: 72, role: 'LD' },
          { x: 38, y: 74, role: 'ZAG' },
          { x: 62, y: 74, role: 'ZAG' },
          { x: 84, y: 72, role: 'LE' },
          { x: 35, y: 56, role: 'VOL' },
          { x: 65, y: 56, role: 'VOL' },
          { x: 18, y: 38, role: 'MD' },
          { x: 50, y: 36, role: 'MEI' },
          { x: 82, y: 38, role: 'ME' },
          { x: 50, y: 18, role: 'CA' },
        ];
      case '3-5-2':
        return [
          { x: 50, y: 88, role: 'GOL' },
          { x: 26, y: 75, role: 'ZAG' },
          { x: 50, y: 76, role: 'ZAG' },
          { x: 74, y: 75, role: 'ZAG' },
          { x: 14, y: 50, role: 'ALD' },
          { x: 36, y: 52, role: 'VOL' },
          { x: 50, y: 45, role: 'MC' },
          { x: 64, y: 52, role: 'MC' },
          { x: 86, y: 50, role: 'ALE' },
          { x: 36, y: 22, role: 'ATA' },
          { x: 64, y: 22, role: 'ATA' },
        ];
      case '5-3-2':
        return [
          { x: 50, y: 88, role: 'GOL' },
          { x: 12, y: 70, role: 'ALD' },
          { x: 30, y: 76, role: 'ZAG' },
          { x: 50, y: 78, role: 'ZAG' },
          { x: 70, y: 76, role: 'ZAG' },
          { x: 88, y: 70, role: 'ALE' },
          { x: 30, y: 50, role: 'MC' },
          { x: 50, y: 48, role: 'MC' },
          { x: 70, y: 50, role: 'MC' },
          { x: 36, y: 22, role: 'ATA' },
          { x: 64, y: 22, role: 'ATA' },
        ];
      case '4-1-4-1':
        return [
          { x: 50, y: 88, role: 'GOL' },
          { x: 16, y: 72, role: 'LD' },
          { x: 38, y: 74, role: 'ZAG' },
          { x: 62, y: 74, role: 'ZAG' },
          { x: 84, y: 72, role: 'LE' },
          { x: 50, y: 60, role: 'VOL' },
          { x: 18, y: 40, role: 'MD' },
          { x: 38, y: 42, role: 'MC' },
          { x: 62, y: 42, role: 'MC' },
          { x: 82, y: 40, role: 'ME' },
          { x: 50, y: 18, role: 'CA' },
        ];
      case '4-3-3':
      default:
        return [
          { x: 50, y: 88, role: 'GOL' },
          { x: 16, y: 72, role: 'LD' },
          { x: 38, y: 74, role: 'ZAG' },
          { x: 62, y: 74, role: 'ZAG' },
          { x: 84, y: 72, role: 'LE' },
          { x: 50, y: 55, role: 'VOL' },
          { x: 30, y: 46, role: 'MC' },
          { x: 70, y: 46, role: 'MEI' },
          { x: 20, y: 24, role: 'PD' },
          { x: 50, y: 20, role: 'CA' },
          { x: 80, y: 24, role: 'PE' },
        ];
    }
  };

  const positions = getFormationCoordinates(selectedFormation);

  return (
    <div className="space-y-5">
      {/* 1. Barra de Formações */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-black text-foreground">
                Esquema Tático do Treinador
              </h3>
              <span className="text-[10px] text-muted-foreground">
                Selecione a formação e clique nos jogadores para fazer substituições
              </span>
            </div>
          </div>

          {isMatchContext && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              🔄 {substitutionsRemaining} subs restantes
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {FORMATIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFormationChange(f.id)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                selectedFormation === f.id
                  ? 'bg-emerald-500 text-zinc-950 font-black shadow-md border-emerald-400'
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border-border'
              }`}
            >
              {f.id}
            </button>
          ))}
        </div>

        {/* Seletores de Funções Especiais: Capitão, Cobrador de Pênalti e Falta */}
        <div className="pt-3 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Capitão da Equipe (©️) */}
          <div className="p-2.5 rounded-xl bg-secondary/40 border border-border space-y-1">
            <label className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
              <span>©️</span> Capitão do Time
            </label>
            <select
              value={club.captainPlayerId || starters[0]?.id || ''}
              onChange={(e) => {
                setClubTacticalRoles(club.id, { captainPlayerId: e.target.value });
                const chosen = starters.find((p) => p.id === e.target.value);
                setFeedback(`©️ ${chosen?.name || 'Atleta'} agora é o Capitão oficial da equipe!`);
              }}
              className="w-full text-xs font-bold bg-card border border-border rounded-lg p-1.5 text-foreground cursor-pointer focus:outline-none focus:border-amber-400"
            >
              {starters.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  #{idx + 1} {p.name} ({p.position} • OVR {p.overall})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Cobrador Oficial de Pênalti (🎯) */}
          <div className="p-2.5 rounded-xl bg-secondary/40 border border-border space-y-1">
            <label className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">
              <span>🎯</span> Batedor de Pênaltis
            </label>
            <select
              value={club.penaltyTakerPlayerId || starters[10]?.id || starters[0]?.id || ''}
              onChange={(e) => {
                setClubTacticalRoles(club.id, { penaltyTakerPlayerId: e.target.value });
                const chosen = starters.find((p) => p.id === e.target.value);
                setFeedback(`🎯 ${chosen?.name || 'Atleta'} é o cobrador oficial de pênaltis!`);
              }}
              className="w-full text-xs font-bold bg-card border border-border rounded-lg p-1.5 text-foreground cursor-pointer focus:outline-none focus:border-emerald-400"
            >
              {starters.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  #{idx + 1} {p.name} ({p.position} • Chute {p.attributes?.finishing || p.attributes?.shooting || p.overall})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Cobrador Oficial de Faltas (☄️) */}
          <div className="p-2.5 rounded-xl bg-secondary/40 border border-border space-y-1">
            <label className="text-[10px] font-black uppercase text-sky-400 flex items-center gap-1">
              <span>☄️</span> Cobrador de Faltas
            </label>
            <select
              value={club.freeKickTakerPlayerId || starters[9]?.id || starters[0]?.id || ''}
              onChange={(e) => {
                setClubTacticalRoles(club.id, { freeKickTakerPlayerId: e.target.value });
                const chosen = starters.find((p) => p.id === e.target.value);
                setFeedback(`☄️ ${chosen?.name || 'Atleta'} é o cobrador oficial de faltas!`);
              }}
              className="w-full text-xs font-bold bg-card border border-border rounded-lg p-1.5 text-foreground cursor-pointer focus:outline-none focus:border-sky-400"
            >
              {starters.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  #{idx + 1} {p.name} ({p.position} • Chute {p.attributes?.shooting || p.overall})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback de Ação */}
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="hover:opacity-75 font-bold cursor-pointer ml-2 text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Prancheta Tática (Campinho 2D) & Listas de Titulares/Reservas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Coluna 1: Mini-Campo Tático 2D */}
        <div className="lg:col-span-5 p-4 rounded-3xl bg-zinc-950 border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[360px]">
          
          {/* Gramado Verde Cortado */}
          <div className="absolute inset-2 rounded-2xl bg-[#064e3b] overflow-hidden border border-emerald-500/20">
            {/* Listras */}
            <div className="w-full h-full flex flex-col">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? 'bg-[#047857]' : 'bg-[#064e3b]'}`}
                />
              ))}
            </div>

            {/* Linhas Brancas */}
            <div className="absolute inset-3 border-2 border-white/30 rounded pointer-events-none" />
            <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/30 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full pointer-events-none" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-14 border-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-14 border-2 border-white/30 pointer-events-none" />
          </div>

          {/* 11 Jogadores no Gramado com Posições Dinâmicas */}
          <div className="absolute inset-4 z-10">
            {starters.map((player, idx) => {
              const pos = positions[idx] || { x: 50, y: 50, role: player.position };
              const isSelected = selectedPlayerIndex === idx;
              const isCaptain = (club.captainPlayerId || starters[0]?.id) === player.id;
              const isPenalty = (club.penaltyTakerPlayerId || starters[10]?.id) === player.id;
              const isFreeKick = (club.freeKickTakerPlayerId || starters[9]?.id) === player.id;

              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleSelectPlayer(idx)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                    isSelected ? 'scale-125 z-20' : 'z-10'
                  }`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black shadow-md ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 border-white ring-4 ring-amber-400/50 animate-pulse'
                          : 'bg-emerald-500 text-zinc-950 border-white'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    {/* Badges de Liderança e Bolas Paradas */}
                    <div className="absolute -top-2 -right-2 flex items-center gap-0.5">
                      {isCaptain && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-zinc-950 text-[9px] font-black flex items-center justify-center shadow-md border border-white" title="Capitão da Equipe">
                          C
                        </span>
                      )}
                      {isPenalty && (
                        <span className="w-4 h-4 rounded-full bg-emerald-400 text-zinc-950 text-[9px] font-black flex items-center justify-center shadow-md border border-white" title="Cobrador de Pênaltis">
                          🎯
                        </span>
                      )}
                      {isFreeKick && (
                        <span className="w-4 h-4 rounded-full bg-sky-400 text-zinc-950 text-[9px] font-black flex items-center justify-center shadow-md border border-white" title="Cobrador de Faltas">
                          ☄️
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="mt-0.5 px-1 rounded bg-black/80 text-[9px] font-bold text-white max-w-[65px] truncate text-center">
                    {player.name.split(' ')[0]}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-300 font-bold leading-tight">
                    {pos.role} • {player.overall}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna 2: 11 Titulares & Banco de Reservas */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 11 Titulares */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                11 Titulares em Campo
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Clique para selecionar e trocar com o banco
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar">
              {starters.map((player, idx) => {
                const isSelected = selectedPlayerIndex === idx;

                return (
                  <div
                    key={player.id}
                    onClick={() => handleSelectPlayer(idx)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-secondary/40 hover:bg-secondary border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <OverallBadge overall={player.overall} size="sm" />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-foreground block max-w-[110px] truncate">
                            #{idx + 1} {player.name}
                          </span>
                          {(club.captainPlayerId || starters[0]?.id) === player.id && (
                            <span className="px-1 py-0.2 rounded bg-amber-400 text-zinc-950 text-[9px] font-black" title="Capitão">
                              C
                            </span>
                          )}
                          {(club.penaltyTakerPlayerId || starters[10]?.id) === player.id && (
                            <span className="text-[10px]" title="Cobrador de Pênaltis">🎯</span>
                          )}
                          {(club.freeKickTakerPlayerId || starters[9]?.id) === player.id && (
                            <span className="text-[10px]" title="Cobrador de Faltas">☄️</span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {player.position} • {player.age} anos
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <PerformanceIndicator
                        rating={player.stats?.averageRating || 7.0}
                        energy={player.energy ?? 85}
                        morale={player.morale ?? 85}
                        size="sm"
                      />
                      <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground opacity-60" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Banco de Reservas (12 a 23) */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Banco de Reservas ({bench.length} Opções)
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Prontos para entrar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar">
              {bench.map((player, idx) => {
                const actualIndex = 11 + idx;
                const isSelected = selectedPlayerIndex === actualIndex;

                return (
                  <div
                    key={player.id}
                    onClick={() => handleSelectPlayer(actualIndex)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-secondary/40 hover:bg-secondary border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <OverallBadge overall={player.overall} size="sm" />
                      <div>
                        <span className="text-xs font-bold text-foreground block max-w-[120px] truncate">
                          #{actualIndex + 1} {player.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {player.position} • {player.age} anos
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <PerformanceIndicator
                        rating={player.stats?.averageRating || 6.8}
                        energy={player.energy ?? 90}
                        morale={player.morale ?? 80}
                        size="sm"
                      />
                      <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground opacity-60" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
