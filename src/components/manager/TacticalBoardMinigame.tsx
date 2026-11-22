'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { X, Play, RotateCcw, Award, CheckCircle2, AlertTriangle, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TacticalBoardMinigameProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (result: { score: number; entrosamentoBonus: number; success: boolean }) => void;
}

interface TacticalDrill {
  id: string;
  title: string;
  category: 'Triangulação' | 'Linha de Impedimento' | 'Pressão Alta';
  description: string;
  instruction: string;
  targetNode: number; // Índice do nó correto para passar
  nodes: { id: number; label: string; x: number; y: number; isOpponent?: boolean; isFree?: boolean }[];
  threatWindowMs: number; // Tempo para decidir antes da interceptação
}

const DRILLS: TacticalDrill[] = [
  {
    id: 'drill-1',
    title: 'Triangulação Rápida no Meio-Campo',
    category: 'Triangulação',
    description: 'O volante tem a bola pressionado. Identifique o meia desmarcado para abrir o jogo na ponta!',
    instruction: 'Clique no companheiro livre (em verde) antes que o zagueiro adversário feche o ângulo!',
    targetNode: 2,
    threatWindowMs: 4000,
    nodes: [
      { id: 0, label: 'VOL (Você)', x: 25, y: 55 },
      { id: 1, label: 'Marcador Rival', x: 42, y: 48, isOpponent: true },
      { id: 2, label: 'MEI (Livre)', x: 48, y: 22, isFree: true },
      { id: 3, label: 'ZAG Rival', x: 65, y: 35, isOpponent: true },
      { id: 4, label: 'LD (Marcado)', x: 40, y: 78 },
      { id: 5, label: 'ATA (Aguardando)', x: 80, y: 45 },
    ],
  },
  {
    id: 'drill-2',
    title: 'Lançamento Cirúrgico nas Costas da Zaga',
    category: 'Triangulação',
    description: 'A zaga rival adiantou a linha para tentar o impedimento. Lance a bola no espaço vazio!',
    instruction: 'Passe direto para o atacante que está disparando na brecha da zaga!',
    targetNode: 4,
    threatWindowMs: 3500,
    nodes: [
      { id: 0, label: 'MEI (Você)', x: 30, y: 40 },
      { id: 1, label: 'VOL Rival', x: 42, y: 43, isOpponent: true },
      { id: 2, label: 'ZAG 1 Rival', x: 60, y: 28, isOpponent: true },
      { id: 3, label: 'ZAG 2 Rival', x: 62, y: 58, isOpponent: true },
      { id: 4, label: 'PE (Disparando)', x: 78, y: 20, isFree: true },
      { id: 5, label: 'PD (Coberto)', x: 72, y: 72 },
    ],
  },
  {
    id: 'drill-3',
    title: 'Gegenpressing: Desarme no Terço Final',
    category: 'Pressão Alta',
    description: 'O zagueiro adversário recebeu bola na fogueira. Comande o bote coordenado com o ponta!',
    instruction: 'Toque no ponto de desarme exato para fechar o zagueiro e roubar a bola!',
    targetNode: 3,
    threatWindowMs: 3000,
    nodes: [
      { id: 0, label: 'ZAG Rival (Com Bola)', x: 70, y: 50, isOpponent: true },
      { id: 1, label: 'GOL Rival', x: 92, y: 50, isOpponent: true },
      { id: 2, label: 'ATA (Fechando)', x: 64, y: 65 },
      { id: 3, label: 'BOTE CERTEIRO ⚡', x: 68, y: 44, isFree: true },
      { id: 4, label: 'LAT Rival', x: 75, y: 18, isOpponent: true },
    ],
  },
];

export const TacticalBoardMinigame: React.FC<TacticalBoardMinigameProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const { managerProfile, updateManagerTacticalFamiliarity } = useGameStore() as any;

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [roundStatus, setRoundStatus] = useState<'idle' | 'playing' | 'success' | 'failed'>('idle');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [timeLeftMs, setTimeLeftMs] = useState<number>(4000);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const drill = DRILLS[currentStep] || DRILLS[0];

  // Inicia o timer da rodada
  useEffect(() => {
    if (!isOpen) return;

    if (roundStatus === 'playing') {
      const stepInterval = 50;
      setTimeLeftMs(drill.threatWindowMs);

      timerRef.current = setInterval(() => {
        setTimeLeftMs((prev) => {
          if (prev <= stepInterval) {
            clearInterval(timerRef.current!);
            handleTimeOut();
            return 0;
          }
          return prev - stepInterval;
        });
      }, stepInterval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, roundStatus, currentStep]);

  const handleStartRound = () => {
    setRoundStatus('playing');
    setFeedbackText('');
  };

  const handleTimeOut = () => {
    setRoundStatus('failed');
    setFeedbackText('⏰ Tempo esgotado! O adversário interceptou o passe e armou contra-ataque.');
  };

  const handleSelectNode = (nodeId: number) => {
    if (roundStatus !== 'playing') return;

    if (timerRef.current) clearInterval(timerRef.current);

    if (nodeId === drill.targetNode) {
      setRoundStatus('success');
      setScore((s) => s + 33);
      setFeedbackText('✨ Golaço tático! Jogada ensaiada executada com perfeição milimétrica.');
    } else {
      setRoundStatus('failed');
      setFeedbackText('❌ Passe errado! A linha de passe estava bloqueada pelo defensor.');
    }
  };

  const handleNextOrFinish = () => {
    if (currentStep < DRILLS.length - 1) {
      setCurrentStep((c) => c + 1);
      setRoundStatus('idle');
      setFeedbackText('');
    } else {
      // Concluiu os 3 desafios
      setIsCompleted(true);
      const finalScore = Math.min(100, score + (roundStatus === 'success' ? 1 : 0));
      const entrosamentoGain = finalScore >= 66 ? 10 : finalScore >= 33 ? 5 : 2;

      // Dispara confetes se foi bem
      if (finalScore >= 66) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#fbbf24', '#38bdf8'],
        });
      }

      if (updateManagerTacticalFamiliarity) {
        updateManagerTacticalFamiliarity(entrosamentoGain);
      }

      if (onCompleted) {
        onCompleted({
          score: finalScore,
          entrosamentoBonus: entrosamentoGain,
          success: finalScore >= 66,
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScore(0);
    setRoundStatus('idle');
    setFeedbackText('');
    setIsCompleted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-emerald-950/60 to-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Prancheta do Treinador
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">
                  Desafio {currentStep + 1} de {DRILLS.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                Laboratório Tático & Jogadas Ensaiadas
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {!isCompleted ? (
            <>
              {/* Informações da Jogada Atual */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    {drill.category} · {drill.title}
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    Pontos: {score}/100
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-medium">
                  {drill.description}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className="text-emerald-400 font-bold">Instrução:</span>
                  <span>{drill.instruction}</span>
                </div>
              </div>

              {/* Barra de Tempo de Reação */}
              {roundStatus === 'playing' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-zinc-400">Janela de Ação Tática:</span>
                    <span className={timeLeftMs < 1200 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                      {(timeLeftMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-75 ${
                        timeLeftMs < 1200 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(timeLeftMs / drill.threatWindowMs) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Campinho Tático em Canvas / SVG Interativo */}
              <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-emerald-900/60 to-emerald-950/80 rounded-2xl border-2 border-emerald-500/40 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Linhas do Campo de Futebol */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Linha externa */}
                  <rect x="2" y="2" width="96" height="96" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                  {/* Linha do meio */}
                  <line x1="50" y1="2" x2="50" y2="98" stroke="#ffffff" strokeWidth="0.8" />
                  {/* Círculo central */}
                  <circle cx="50" cy="50" r="16" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                  {/* Grande área esquerda */}
                  <rect x="2" y="25" width="18" height="50" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                  {/* Grande área direita */}
                  <rect x="80" y="25" width="18" height="50" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                </svg>

                {/* Nós / Jogadores no Campinho */}
                {drill.nodes.map((node) => {
                  const isUser = node.id === 0;
                  const isOpponent = !!node.isOpponent;
                  const isFree = !!node.isFree;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      disabled={roundStatus !== 'playing' || isUser || isOpponent}
                      onClick={() => handleSelectNode(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full flex flex-col items-center justify-center transition-all ${
                        isUser
                          ? 'bg-emerald-500 text-black font-black scale-110 shadow-lg ring-4 ring-emerald-400/40'
                          : isOpponent
                          ? 'bg-rose-600/90 text-white font-bold opacity-85'
                          : isFree && roundStatus === 'playing'
                          ? 'bg-emerald-400 text-zinc-950 font-black animate-bounce ring-4 ring-emerald-300 shadow-xl cursor-pointer hover:scale-125'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">
                        {isOpponent ? '✕' : isUser ? '⚽' : node.id}
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/70 text-white whitespace-nowrap mt-1 pointer-events-none">
                        {node.label}
                      </span>
                    </button>
                  );
                })}

                {/* Overlay de Início da Rodada */}
                {roundStatus === 'idle' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-2xl text-emerald-400">
                      ▶
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm">Pronto para a Prancheta?</h4>
                      <p className="text-zinc-400 text-xs max-w-xs mt-0.5">
                        Analise o campo rapidamente e clique no jogador desmarcado no tempo limite!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartRound}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-emerald-500/25 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      Iniciar Jogada Ensaiada
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback pós-clique */}
              {roundStatus !== 'idle' && roundStatus !== 'playing' && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    roundStatus === 'success'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {roundStatus === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span>{feedbackText}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextOrFinish}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-black text-xs hover:bg-zinc-200 transition shrink-0 cursor-pointer"
                  >
                    {currentStep < DRILLS.length - 1 ? 'Próxima Jogada →' : 'Ver Resultado Final 🏆'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Tela de Resultado Final do Minijogo */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-3xl mx-auto">
                🏆
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Treino Tático Concluído
                </span>
                <h3 className="text-xl font-black text-white font-display">
                  {score >= 66 ? 'Maestria Tática Absoluta!' : score >= 33 ? 'Bom Ajuste de Esquema' : 'Precisa de Mais Treinos'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {score >= 66
                    ? 'Seu elenco assimilou perfeitamente as jogadas ensaiadas. O entrosamento e o controle da partida aumentaram!'
                    : 'A equipe absorveu parte dos conceitos. Continue calibrando a movimentação coletiva.'}
                </p>
              </div>

              {/* Cards de Ganhos */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 font-semibold block">Pontuação Tática</span>
                  <span className="text-xl font-black text-emerald-400">{score}/100</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 font-semibold block">Bônus de Entrosamento</span>
                  <span className="text-xl font-black text-cyan-400">
                    +{score >= 66 ? '10%' : score >= 33 ? '5%' : '2%'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Repetir Treino
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Confirmar e Voltar ao Clube
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
