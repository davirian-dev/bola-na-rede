'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { X, Mic, Flame, Volume2, Sparkles, Trophy, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManagerSpeechMinigameProps {
  isOpen: boolean;
  onClose: () => void;
  isHalfTime?: boolean; // Se foi chamado no intervalo da partida
  onCompleted?: (result: { score: number; moraleGain: number; success: boolean }) => void;
}

interface SpeechRound {
  topic: string;
  options: string;
  subtext: string;
}

const SPEECH_ROUNDS: SpeechRound[] = [
  {
    topic: '1. Entrada em Campo & Concentração',
    options: '« Olhem para essa camisa! Cada dividida hoje é a nossa vida! »',
    subtext: 'Acerte o tom enérgico sem parecer desesperado.',
  },
  {
    topic: '2. Postura Tática & Compactação',
    options: '« Ninguém joga sozinho! Se o companheiro for pressionado, encosta para dar opção! »',
    subtext: 'Inspire união e disciplina tática coletiva.',
  },
  {
    topic: '3. A Hora da Decisão & Glória',
    options: '« Não viemos aqui para empatar! Vamos morder até o último minuto e buscar a vitória! »',
    subtext: 'Inflame a paixão e a sede de vencer do elenco.',
  },
];

export const ManagerSpeechMinigame: React.FC<ManagerSpeechMinigameProps> = ({
  isOpen,
  onClose,
  isHalfTime = false,
  onCompleted,
}) => {
  const { managerProfile, updateManagerMorale } = useGameStore() as any;

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [hits, setHits] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [roundFeedback, setRoundFeedback] = useState<string>('');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const directionRef = useRef<number>(1);
  const speedRef = useRef<number>(1.6);

  // Animação do ponteiro oscilante (vai de 0 a 100 e volta)
  useEffect(() => {
    if (!isOpen || isLocked || isFinished) return;

    let pos = sliderPos;
    const animate = () => {
      pos += directionRef.current * speedRef.current;
      if (pos >= 100) {
        pos = 100;
        directionRef.current = -1;
      } else if (pos <= 0) {
        pos = 0;
        directionRef.current = 1;
      }
      setSliderPos(pos);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isLocked, isFinished, sliderPos]);

  const handleSpeak = () => {
    if (isLocked || isFinished) return;

    setIsLocked(true);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    // Avalia a zona de acerto:
    // 38 a 68 é a Zona Verde (Sweet Spot)
    // 15 a 37 ou 69 a 85 é Zona Amarela
    // < 15 ou > 85 é Zona Vermelha
    const pos = sliderPos;
    let scoreType: 'perfect' | 'good' | 'bad' = 'good';
    let feedback = '';

    if (pos >= 38 && pos <= 68) {
      scoreType = 'perfect';
      feedback = '🔥 Discurso Perfeito! O capitão bate palmas, o vestiário inflama e o elenco responde com sangue nos olhos!';
      setHits((h) => [...h, 100]);
    } else if ((pos >= 15 && pos < 38) || (pos > 68 && pos <= 85)) {
      scoreType = 'good';
      feedback = '👍 Discurso Firme. Os jogadores concordam com a cabeça e assimilam o recado com seriedade.';
      setHits((h) => [...h, 60]);
    } else {
      scoreType = 'bad';
      feedback = '⚠️ Tom Descalibrado! O discurso soou hesitante ou ríspido demais. Alguns atletas sentiram a pressão.';
      setHits((h) => [...h, 20]);
    }

    setRoundFeedback(feedback);
  };

  const handleNextRound = () => {
    if (currentRound < SPEECH_ROUNDS.length - 1) {
      setCurrentRound((c) => c + 1);
      setIsLocked(false);
      setRoundFeedback('');
      // Aumenta ligeiramente a velocidade a cada rodada
      speedRef.current += 0.4;
    } else {
      // Concluiu as 3 rodadas
      setIsFinished(true);
      const totalHits = hits.reduce((a, b) => a + b, 0);
      const avgScore = Math.round(totalHits / SPEECH_ROUNDS.length);

      const moraleGain = avgScore >= 80 ? 20 : avgScore >= 50 ? 10 : 5;

      if (avgScore >= 75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ef4444', '#10b981'],
        });
      }

      if (updateManagerMorale) {
        updateManagerMorale(moraleGain);
      }

      if (onCompleted) {
        onCompleted({
          score: avgScore,
          moraleGain,
          success: avgScore >= 60,
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setSliderPos(50);
    setHits([]);
    setIsLocked(false);
    setRoundFeedback('');
    setIsFinished(false);
    speedRef.current = 1.6;
  };

  if (!isOpen) return null;

  const currentSpeech = SPEECH_ROUNDS[currentRound] || SPEECH_ROUNDS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-amber-950/60 to-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {isHalfTime ? 'Intervalo da Partida' : 'Preleção do Treinador'}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">
                  Momento {currentRound + 1} de {SPEECH_ROUNDS.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                Discurso Motivacional no Vestiário
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

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {!isFinished ? (
            <>
              {/* Tema e Frase do Treinador */}
              <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block">
                  {currentSpeech.topic}
                </span>

                <blockquote className="text-base sm:text-lg font-bold text-white italic px-2">
                  {currentSpeech.options}
                </blockquote>

                <p className="text-xs text-zinc-400 font-medium">
                  {currentSpeech.subtext}
                </p>
              </div>

              {/* Medidor Rítmico de Discurso (Oscilador com Sweet Spot) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-zinc-400">Timbre & Intensidade:</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    Pressione no Centro Verde!
                  </span>
                </div>

                {/* Trilha do Oscilador */}
                <div className="relative h-10 w-full rounded-2xl bg-zinc-900 border-2 border-zinc-800 overflow-hidden shadow-inner flex items-center">
                  {/* Zona Amarela Esquerda (Morno) */}
                  <div className="h-full w-[38%] bg-amber-500/20 border-r border-amber-500/30 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-amber-400/80 uppercase">Morno</span>
                  </div>

                  {/* Zona Verde Centro (Sweet Spot Perfeito) */}
                  <div className="h-full w-[30%] bg-emerald-500/30 border-r border-emerald-500/40 flex items-center justify-center relative">
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                      ★ PERFEITO ★
                    </span>
                  </div>

                  {/* Zona Amarela/Vermelha Direita (Exagero) */}
                  <div className="h-full w-[32%] bg-rose-500/20 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-rose-400/80 uppercase">Excesso</span>
                  </div>

                  {/* Agulha / Marcador Móvel */}
                  <div
                    className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-white shadow-2xl rounded-full z-10 border border-zinc-950 transition-none pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-full h-full bg-amber-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-zinc-500 px-1 font-semibold">
                  <span>Hesitante</span>
                  <span className="text-emerald-400 font-bold">Tom Preciso</span>
                  <span>Descontrolado</span>
                </div>
              </div>

              {/* Botão de Discurso / Próxima */}
              {!isLocked ? (
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5 fill-zinc-950" />
                  SOLTAR A VOZ COM ENERGIA!
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{roundFeedback}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="w-full py-3 rounded-2xl bg-white text-zinc-950 font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer"
                  >
                    {currentRound < SPEECH_ROUNDS.length - 1 ? 'Próximo Ponto da Preleção →' : 'Ver Reação do Vestiário 🏆'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Tela Final com Resultados */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-3xl mx-auto">
                🔥
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  Preleção Concluída
                </span>
                <h3 className="text-xl font-black text-white font-display">
                  Vestiário Inflamado para a Batalha!
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Sua postura motivacional ecoou pelos corredores. Os atletas sobem para o gramado convictos da vitória!
                </p>
              </div>

              {/* Bônus Concedidos */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 font-semibold block">Moral do Elenco</span>
                  <span className="text-xl font-black text-emerald-400">+15 a +20 pts</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 font-semibold block">Confiança da Torcida</span>
                  <span className="text-xl font-black text-amber-400">+5 pts</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Repetir
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Confirmar e Ir para o Jogo!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
