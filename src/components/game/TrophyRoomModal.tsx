'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Crown, Sparkles, X, Award, Shield, Star, Medal } from 'lucide-react';

interface TrophyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrophyDef {
  id: string;
  name: string;
  tier: 'world' | 'continental' | 'national' | 'cup' | 'individual' | 'youth';
  gloryPoints: number;
  icon: string;
  image?: string;
  gradient: string;
  badgeColor: string;
  description: string;
}

const OFFICIAL_TROPHIES: TrophyDef[] = [
  {
    id: 'world_cup',
    name: 'Copa do Mundo FIFA',
    tier: 'world',
    gloryPoints: 1000,
    icon: '🌍',
    image: '/images/trophies/copa-do-mundo.webp',
    gradient: 'from-amber-400 via-yellow-500 to-amber-700',
    badgeColor: 'border-yellow-400 text-yellow-300',
    description: 'O ápice absoluto do futebol mundial com a Seleção Brasileira ou Internacional.',
  },
  {
    id: 'champions_league',
    name: 'Champions League',
    tier: 'continental',
    gloryPoints: 500,
    icon: '⭐',
    image: '/images/trophies/champions-league.webp',
    gradient: 'from-blue-400 via-indigo-600 to-slate-900',
    badgeColor: 'border-blue-400 text-blue-300',
    description: 'A taça das orelhudas: o maior torneio de clubes do planeta terra.',
  },
  {
    id: 'libertadores',
    name: 'Copa Libertadores',
    tier: 'continental',
    gloryPoints: 450,
    icon: '🏆',
    image: '/images/trophies/libertadores.webp',
    gradient: 'from-amber-500 via-amber-600 to-zinc-900',
    badgeColor: 'border-amber-400 text-amber-300',
    description: 'A glória eterna sul-americana: raça, caldeirão e tradição pesada.',
  },
  {
    id: 'ballon_dor',
    name: 'Bola de Ouro / The Best',
    tier: 'individual',
    gloryPoints: 400,
    icon: '⚽',
    image: '/images/trophies/bola-de-ouro.webp',
    gradient: 'from-yellow-300 via-amber-400 to-yellow-600',
    badgeColor: 'border-yellow-300 text-yellow-200',
    description: 'Consagração individual como o melhor jogador do planeta na temporada.',
  },
  {
    id: 'brasileirao_serie_a',
    name: 'Brasileirão Série A',
    tier: 'national',
    gloryPoints: 300,
    icon: '🇧🇷',
    image: '/images/trophies/brasileirao-serie-a.webp',
    gradient: 'from-emerald-400 via-teal-600 to-emerald-950',
    badgeColor: 'border-emerald-400 text-emerald-300',
    description: '38 rodadas de pontos corridos da liga mais disputada das Américas.',
  },
  {
    id: 'copa_do_brasil',
    name: 'Copa do Brasil',
    tier: 'cup',
    gloryPoints: 200,
    icon: '🥇',
    image: '/images/trophies/copa-do-brasil.webp',
    gradient: 'from-cyan-400 via-blue-600 to-zinc-950',
    badgeColor: 'border-cyan-400 text-cyan-300',
    description: 'Mata-mata milionário com vaga direta na Copa Libertadores.',
  },
  {
    id: 'copinha_sub20',
    name: 'Copa São Paulo Sub-20',
    tier: 'youth',
    gloryPoints: 100,
    icon: '🌱',
    image: '/images/trophies/copinha-sub20.webp',
    gradient: 'from-emerald-500 via-green-600 to-zinc-950',
    badgeColor: 'border-green-400 text-green-300',
    description: 'O maior celeiro de jovens talentos da base nacional.',
  },
];

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({ isOpen, onClose }) => {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const currentClub = useGameStore((s) => {
    const clubId = s.mode === 'player' ? s.playerProfile?.clubId : s.managerProfile?.clubId;
    return clubId ? s.clubs[clubId] : undefined;
  });

  const [activeTab, setActiveTab] = useState<'hall' | 'ranking' | 'formula'>('hall');

  if (!isOpen) return null;

  // Títulos acumulados
  const titlesCount = mode === 'player' 
    ? (playerProfile?.titles || {}) 
    : (managerProfile?.titles || {});

  const totalGoals = playerProfile?.stats?.goals || 0;

  // Cálculo Oficial de Pontos de Glória
  let calculatedGloryPoints = 0;
  OFFICIAL_TROPHIES.forEach((trophy) => {
    const count = (titlesCount as any)[trophy.id] || 0;
    calculatedGloryPoints += count * trophy.gloryPoints;
  });
  // Bônus por gols na carreira
  calculatedGloryPoints += Math.floor(totalGoals / 2);

  // Maiores Campeões Históricos para Comparação
  const HISTORIC_LEGENDS = [
    { rank: 1, name: 'Lionel Messi', country: '🇦🇷', trophies: 44, gloryPoints: 14200, role: 'Lenda Ativa' },
    { rank: 2, name: 'Daniel Alves', country: '🇧🇷', trophies: 43, gloryPoints: 12100, role: 'Histórico' },
    { rank: 3, name: 'Pelé (Rei)', country: '🇧🇷', trophies: 37, gloryPoints: 16500, role: 'Rei do Futebol' },
    { rank: 4, name: 'Cristiano Ronaldo', country: '🇵🇹', trophies: 35, gloryPoints: 13800, role: 'Máquina' },
    {
      rank: 5,
      name: (mode === 'player' ? (playerProfile?.nickname || playerProfile?.name) : managerProfile?.name) || 'Sua Carreira',
      country: '🇧🇷',
      trophies: Object.values(titlesCount).reduce((a: number, b: any) => a + (Number(b) || 0), 0),
      gloryPoints: calculatedGloryPoints,
      isUser: true,
      role: mode === 'player' ? 'Atleta Boleiro' : 'Comandante Técnico',
    },
    { rank: 6, name: 'Zico (Galinho)', country: '🇧🇷', trophies: 28, gloryPoints: 9200, role: 'Eterno Camisa 10' },
    { rank: 7, name: 'Rogério Ceni', country: '🇧🇷', trophies: 26, gloryPoints: 8400, role: 'Mito Tricolor' },
  ].sort((a, b) => b.gloryPoints - a.gloryPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow de Fundo */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/60 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                🏛️ Sala de Troféus & Galeria de Honra
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {calculatedGloryPoints} Pts de Glória
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                {currentClub ? currentClub.name : 'Carreira Oficial'} • Sua trajetória imortalizada na história
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="px-6 pt-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/40">
          <button
            onClick={() => setActiveTab('hall')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hall'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Vitrine de Troféus</span>
          </button>

          <button
            onClick={() => setActiveTab('ranking')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ranking'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Medal className="w-3.5 h-3.5" />
            <span>Ranking de Maiores Campeões</span>
          </button>

          <button
            onClick={() => setActiveTab('formula')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'formula'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Fórmula de Pontos</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ABA 1: VITRINE DE TROFÉUS */}
          {activeTab === 'hall' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {OFFICIAL_TROPHIES.map((trophy) => {
                const count = (titlesCount as any)[trophy.id] || 0;
                const isUnlocked = count > 0;

                return (
                  <div
                    key={trophy.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                      isUnlocked
                        ? 'bg-zinc-900/80 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-950/60 border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 relative shadow-inner shrink-0 ${
                        isUnlocked ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-zinc-900/60 border border-zinc-800'
                      }`}>
                        {trophy.image ? (
                          <img
                            src={trophy.image}
                            alt={trophy.name}
                            loading="lazy"
                            decoding="async"
                            className={`w-11 h-11 object-contain transition-all duration-300 ${
                              isUnlocked ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105' : 'grayscale opacity-40'
                            }`}
                          />
                        ) : (
                          <span className="text-2xl">{trophy.icon}</span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${trophy.badgeColor}`}>
                          +{trophy.gloryPoints} Pts
                        </span>
                        {isUnlocked && (
                          <div className="text-xs font-black text-amber-400 mt-1">
                            {count}x Campeão!
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display text-base font-black text-white">
                        {trophy.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        {trophy.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-semibold">Status:</span>
                      {isUnlocked ? (
                        <span className="font-black text-emerald-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Na Sala de Troféus
                        </span>
                      ) : (
                        <span className="font-bold text-zinc-500">
                          🔒 Não conquistado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ABA 2: RANKING DE MAIORES CAMPEÕES */}
          {activeTab === 'ranking' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                <span>Disputa histórica ponderada por troféus oficiais e longevidade.</span>
                <span className="font-black text-amber-400">Atualizado após cada final</span>
              </div>

              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4 text-center">Pos</th>
                      <th className="py-3 px-4">Craque / Lenda</th>
                      <th className="py-3 px-3 text-center">Títulos</th>
                      <th className="py-3 px-4 text-right">Pontos de Glória</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {HISTORIC_LEGENDS.map((legend, index) => {
                      const posNumber = index + 1;
                      return (
                        <tr
                          key={legend.name}
                          className={`transition ${
                            legend.isUser
                              ? 'bg-amber-500/15 font-black text-white border-l-4 border-amber-500'
                              : 'hover:bg-zinc-800/40'
                          }`}
                        >
                          <td className="py-3 px-4 text-center font-mono font-black">
                            {posNumber === 1 ? '🥇' : posNumber === 2 ? '🥈' : posNumber === 3 ? '🥉' : `#${posNumber}`}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span>{legend.country}</span>
                              <span className="font-bold text-white">{legend.name}</span>
                              {legend.isUser && (
                                <span className="text-[9px] bg-amber-500 text-zinc-950 px-1.5 py-0.2 rounded font-black uppercase">
                                  Você
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400">{legend.role}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-black text-amber-400">
                            {legend.trophies} 🏆
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-black text-emerald-400">
                            {legend.gloryPoints.toLocaleString('pt-BR')} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 3: FÓRMULA OFICIAL DE PONTOS */}
          {activeTab === 'formula' && (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 text-xs">
              <div>
                <h3 className="font-display text-base font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Como funciona a Pontuação no Hall da Fama?
                </h3>
                <p className="text-zinc-400 mt-1 leading-relaxed">
                  Para decidir de forma justa quem é o maior campeão de todos os tempos, cada competição oficial possui um peso correspondente à sua dificuldade e prestígio no futebol global.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="text-xs font-bold text-white block">🏆 Peso por Título Oficial:</span>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Copa do Mundo de Seleções: <strong className="text-amber-400">1.000 pts</strong></li>
                    <li>• Champions League: <strong className="text-blue-400">500 pts</strong></li>
                    <li>• Copa Libertadores: <strong className="text-amber-500">450 pts</strong></li>
                    <li>• Bola de Ouro / The Best: <strong className="text-yellow-400">400 pts</strong></li>
                    <li>• Brasileirão Série A: <strong className="text-emerald-400">300 pts</strong></li>
                    <li>• Copa do Brasil: <strong className="text-cyan-400">200 pts</strong></li>
                    <li>• Copa São Paulo Sub-20: <strong className="text-green-400">100 pts</strong></li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="text-xs font-bold text-white block">⚽ Bônus Individual:</span>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Cada 2 gols marcados na carreira: <strong className="text-emerald-400">+1 ponto</strong></li>
                    <li>• Artilheiro do campeonato: <strong className="text-amber-400">+50 pontos</strong></li>
                    <li>• Melhor jogador do campeonato: <strong className="text-amber-400">+75 pontos</strong></li>
                    <li>• Imunidade a rebaixamento como técnico: <strong className="text-blue-400">+30 pontos</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Continue vencendo partidas para acumular troféus e subir no ranking histórico!
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
