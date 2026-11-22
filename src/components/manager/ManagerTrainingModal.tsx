'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, Position } from '@/types/game';
import { Dumbbell, X, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';

interface ManagerTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerTrainingModal: React.FC<ManagerTrainingModalProps> = ({ isOpen, onClose }) => {
  const {
    clubs,
    managerProfile,
    setPlayerIndividualTrainingFocus,
  } = useGameStore();

  const [faqOpen, setFaqOpen] = useState<boolean>(true);

  if (!isOpen || !managerProfile) return null;

  const club = clubs[managerProfile.clubId];
  if (!club) return null;

  const ctLevel = managerProfile.trainingUpgrades?.ctLevel || 1;
  const maxTitularSlots = 5 + ctLevel; // Nível 1: 6, Nível 2: 7, etc.
  const maxReserveSlots = 3 + ctLevel; // Nível 1: 4, Nível 2: 5, etc.
  const maxYouthSlots = 2 + ctLevel;   // Nível 1: 3, Nível 2: 4, etc.

  const currentFocusMap = managerProfile.trainingUpgrades?.playerFocus || {};

  const roster = club.roster || [];
  const youthRoster = club.youthRoster || [];
  const titularIds = new Set(club.lineup || []);
  const reserveIds = new Set(managerProfile.selectedReservesIds || []);

  const titulares = roster.filter(p => titularIds.has(p.id));
  const reservas = roster.filter(p => !titularIds.has(p.id));

  // Contagem de vagas utilizadas
  const titularSlotsUsed = titulares.filter(p => currentFocusMap[p.id] && currentFocusMap[p.id] !== '').length;
  const reserveSlotsUsed = reservas.filter(p => currentFocusMap[p.id] && currentFocusMap[p.id] !== '').length;
  const youthSlotsUsed = youthRoster.filter(p => currentFocusMap[p.id] && currentFocusMap[p.id] !== '').length;

  const getAvailableSkillsForPosition = (pos: Position) => {
    switch (pos) {
      case 'GOL':
        return [
          { key: 'defense', label: 'Defesa & Reflexo' },
          { key: 'positioning', label: 'Posicionamento' },
          { key: 'physical', label: 'Salto & Elasticidade' },
          { key: 'passing', label: 'Passe & Saída de Bola' },
        ];
      case 'ZAG':
        return [
          { key: 'defense', label: 'Desarme & Bote' },
          { key: 'heading', label: 'Cabeceio Defensivo' },
          { key: 'physical', label: 'Salto & Força' },
          { key: 'positioning', label: 'Posicionamento' },
        ];
      case 'LE':
      case 'LD':
        return [
          { key: 'pace', label: 'Velocidade & Ritmo' },
          { key: 'crossing', label: 'Cruzamento' },
          { key: 'defense', label: 'Desarme' },
          { key: 'passing', label: 'Passe Curto' },
        ];
      case 'VOL':
        return [
          { key: 'defense', label: 'Desarme & Combate' },
          { key: 'passing', label: 'Passe & Distribuição' },
          { key: 'positioning', label: 'Posicionamento' },
          { key: 'vision', label: 'Visão & Armação' },
        ];
      case 'MEI':
      case 'MC':
        return [
          { key: 'passing', label: 'Passe Curto & Longo' },
          { key: 'vision', label: 'Visão de Jogo' },
          { key: 'dribbling', label: 'Drible & Finta' },
          { key: 'shooting', label: 'Finalização & Chute' },
        ];
      case 'PE':
      case 'PD':
        return [
          { key: 'pace', label: 'Arrancada & Velocidade' },
          { key: 'dribbling', label: 'Drible no 1x1' },
          { key: 'shooting', label: 'Finalização' },
          { key: 'crossing', label: 'Cruzamento' },
        ];
      case 'ATA':
      default:
        return [
          { key: 'shooting', label: 'Finalização & Frieza' },
          { key: 'heading', label: 'Cabeceio' },
          { key: 'positioning', label: 'Atenção & Posicionamento' },
          { key: 'physical', label: 'Impulsão & Salto' },
        ];
    }
  };

  const getFourSkillsDisplay = (p: Player) => {
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

  const handleSelectFocus = (playerId: string, skill: string, group: 'titular' | 'reserve' | 'youth') => {
    const isClearing = skill === '';
    
    // Se estiver adicionando, verifica limite de vagas do grupo
    if (!isClearing && (!currentFocusMap[playerId] || currentFocusMap[playerId] === '')) {
      if (group === 'titular' && titularSlotsUsed >= maxTitularSlots) {
        alert(`Limite de vagas para titulares atingido (${maxTitularSlots}). Melhore o Centro de Treinamento ou libere uma vaga.`);
        return;
      }
      if (group === 'reserve' && reserveSlotsUsed >= maxReserveSlots) {
        alert(`Limite de vagas para reservas atingido (${maxReserveSlots}).`);
        return;
      }
      if (group === 'youth' && youthSlotsUsed >= maxYouthSlots) {
        alert(`Limite de vagas para a base atingido (${maxYouthSlots}).`);
        return;
      }
    }

    setPlayerIndividualTrainingFocus(playerId, skill);
  };

  const renderPlayerTable = (players: Player[], group: 'titular' | 'reserve' | 'youth') => (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-2.5 px-3">Pos</th>
              <th className="py-2.5 px-3">Nome</th>
              <th className="py-2.5 px-2 text-center">Idade</th>
              <th className="py-2.5 px-2 text-center">OVR</th>
              <th className="py-2.5 px-3 text-center">4 Habilidades da Posição</th>
              <th className="py-2.5 px-3 text-center">Último Treino</th>
              <th className="py-2.5 px-3 text-right">Foco Individual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {players.map((p) => {
              const skills = getFourSkillsDisplay(p);
              const availableSkills = getAvailableSkillsForPosition(p.position);
              const currentFocus = currentFocusMap[p.id] || '';

              return (
                <tr key={p.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded font-black text-[11px] bg-zinc-800 text-zinc-200">
                      {p.position}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="py-2 px-2 text-center text-zinc-400">
                    {p.age}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded font-black text-[11px] ${
                      p.overall >= 80 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {p.overall}
                    </span>
                  </td>
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
                  <td className="py-2 px-3 text-center text-zinc-500 text-[11px]">
                    {currentFocus ? 'Evoluindo' : '—'}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <select
                      value={currentFocus}
                      onChange={(e) => handleSelectFocus(p.id, e.target.value, group)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-bold focus:outline-none transition ${
                        currentFocus
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                          : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      <option value="">-- nenhum --</option>
                      {availableSkills.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                🏋️ Centro de Treinamento
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Nível {ctLevel}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Aprimore individualmente os fundamentos e atributos dos seus atletas
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

          {/* Badges de Vagas de Treino (Conforme Imagem 3) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-1.5">
              <span>★ Titulares</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-white font-mono">
                {titularSlotsUsed}/{maxTitularSlots}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
              <span>👟 Reservas</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-white font-mono">
                {reserveSlotsUsed}/{maxReserveSlots}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <span>🌱 Base Sub-20</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-white font-mono">
                {youthSlotsUsed}/{maxYouthSlots}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-medium">
              Centro de Treinamento nível {ctLevel}
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              Entrosamento {managerProfile.entrosamento ?? 65}%
            </div>
          </div>

          {/* Acordeão Explicativo de Treino (Conforme Imagem 3) */}
          <div className="border border-zinc-800 rounded-xl bg-zinc-900/40 overflow-hidden">
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-zinc-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Como funciona o Centro de Treinamento e a evolução
              </span>
              {faqOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {faqOpen && (
              <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 space-y-2 border-t border-zinc-800/60">
                <p>
                  <strong>Treino da semana (coletivo):</strong> dá entrosamento ao time e, a cada rodada disputada, confere XP geral em todas as 4 habilidades da posição de cada atleta. Reservas e base ganham metade do XP dos titulares.
                </p>
                <p>
                  <strong>Treino individual:</strong> escolha um fundamento para o atleta focar. Ao acumular XP suficiente, a habilidade sobe 1 ponto e o OVR é recalculado. Jovens com alto potencial evoluem muito mais rápido.
                </p>
                <p>
                  São <strong>{maxTitularSlots + maxReserveSlots + maxYouthSlots} vagas no total</strong> ({maxTitularSlots} titulares, {maxReserveSlots} reservas e {maxYouthSlots} base). Cada nível do CT adiciona vagas extras e +15% de velocidade de aprendizado.
                </p>
              </div>
            )}
          </div>

          {/* Seção Titulares */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                ★ TITULARES ({titulares.length})
              </h3>
              <span className="text-[11px] text-zinc-400">
                Vagas ocupadas: {titularSlotsUsed}/{maxTitularSlots}
              </span>
            </div>
            {renderPlayerTable(titulares, 'titular')}
          </div>

          {/* Seção Reservas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                👟 RESERVAS DO ELENCO ({reservas.length})
              </h3>
              <span className="text-[11px] text-zinc-400">
                Vagas ocupadas: {reserveSlotsUsed}/{maxReserveSlots}
              </span>
            </div>
            {renderPlayerTable(reservas, 'reserve')}
          </div>

          {/* Seção Base Sub-20 */}
          {youthRoster.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  🌱 CATEGORIAS DE BASE ({youthRoster.length})
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Vagas ocupadas: {youthSlotsUsed}/{maxYouthSlots}
                </span>
              </div>
              {renderPlayerTable(youthRoster, 'youth')}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Focos individuais salvos automaticamente para os treinos semanais.
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
