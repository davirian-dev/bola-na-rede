'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Award, Trophy, Calendar, Shield, X, Star, Users, Flame, Zap } from 'lucide-react';

interface ManagerCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerCareerModal: React.FC<ManagerCareerModalProps> = ({ isOpen, onClose }) => {
  const {
    clubs,
    managerProfile,
    trophies,
    seasonYear,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'seasons' | 'matches'>('seasons');

  if (!isOpen || !managerProfile) return null;

  const club = clubs[managerProfile.clubId];
  const stats = managerProfile.stats || {
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    titlesWon: 0,
  };

  const getArchetypeBonusBadges = (archetype: string) => {
    switch (archetype) {
      case 'formador':
        return [
          { text: 'Foco: Categorias de Base', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
          { text: 'Evolução de jovens +35%', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
          { text: 'Custo de melhoria do CT -20%', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
          { text: 'Geração de joias no Sub-20', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
        ];
      case 'motivador':
        return [
          { text: 'Foco: Gestão de Grupo & Moral', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
          { text: 'Moral da equipe sempre elevada (+20%)', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
          { text: 'Recuperação de derrotas acelerada', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
          { text: 'Poder de virada no 2º tempo', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
        ];
      case 'estrategista':
      default:
        return [
          { text: 'Foco: Partidas e tática', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
          { text: 'Ganho de entrosamento por jogo +50%', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
          { text: 'XP do treino tático +25%', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
          { text: 'Instruções individuais +25% mais fortes', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
          { text: 'Equipe técnica +1 nível (notas)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
        ];
    }
  };

  const badges = getArchetypeBonusBadges(managerProfile.archetype || 'estrategista');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                📜 Carreira do Treinador
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {managerProfile.name}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Histórico de temporadas, conquistas, reputação e perfil tático
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

          {/* Grid Principal: Ficha do Treinador à Esquerda e Troféus à Direita (Conforme Imagem 7) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Ficha do Treinador */}
            <div className="md:col-span-7 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Dados do Treinador</span>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-zinc-400 block">Nome</span>
                    <strong className="text-white text-sm font-black">{managerProfile.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Carreira</span>
                    <strong className="text-white font-bold">Temporada 1 de 12</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Clube Atual</span>
                    <strong className="text-emerald-400 font-bold">{club?.name || 'Sem clube'}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Perfil</span>
                    <strong className="text-purple-400 font-bold capitalize">{managerProfile.archetype || 'Estrategista'}</strong>
                  </div>
                </div>
              </div>

              {/* Badges de Bônus Ativos do Perfil (Conforme Imagem 7) */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Bônus Ativos do Perfil ({managerProfile.archetype || 'Estrategista'})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((b, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${b.color}`}
                    >
                      {b.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Indicadores Estatísticos */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/60 text-center">
                <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Reputação</span>
                  <div className="text-base font-black text-purple-400 mt-0.5">
                    {managerProfile.reputation} / 100
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Campanha Total</span>
                  <div className="text-base font-black text-white mt-0.5">
                    {stats.wins}V {stats.draws}E {stats.losses}D
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Jogos Oficiais</span>
                  <div className="text-base font-black text-cyan-400 mt-0.5">
                    {stats.matchesPlayed}
                  </div>
                </div>
              </div>
            </div>

            {/* Sala de Troféus do Treinador */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  🏆 Sala de Troféus do Treinador
                </h3>

                {trophies.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
                    <Trophy className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    Nenhum troféu conquistado ainda.
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Conquiste o Brasileirão ou a Copa do Brasil para eternizar sua história!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {trophies.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2"
                      >
                        <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">{t.title}</div>
                          <div className="text-[10px] text-amber-300 font-semibold">{t.seasonYear}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400 mt-4">
                Grandes títulos atraem convites para treinar a <strong>Seleção Brasileira</strong> e gigantes europeus.
              </div>
            </div>

          </div>

          {/* Abas de Histórico: Temporadas vs Partidas (Conforme Imagem 7) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveTab('seasons')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'seasons'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Temporadas
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'matches'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Partidas
              </button>
            </div>

            {activeTab === 'seasons' && (
              <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800">
                A primeira temporada ({seasonYear}) ainda está em andamento. Ao final das 48 semanas, as colocações finais e premiações serão registradas aqui.
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-900/30 rounded-xl border border-zinc-800">
                Histórico detalhado das rodadas disputadas e placares oficiais.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-xs text-zinc-400">
            Ficha oficial do treinador · Bola na Rede: Carreira
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
