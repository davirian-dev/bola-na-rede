'use client';

import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { Sparkles, CheckCircle2, XCircle, Zap, Flame } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { BallImpactSelector, BallImpact } from './BallImpactSelector';

interface NSSInsideBoxMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export function NSSInsideBoxMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  matchInfo,
}: NSSInsideBoxMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  const [boxState, setBoxState] = useState<'aiming' | 'resolving' | 'goal' | 'saved' | 'out'>('aiming');
  const [feedbackText, setFeedbackText] = useState('O goleiro está saindo desesperado! Escolha como definir o lance!');
  const [impact, setImpact] = useState<BallImpact>({ x: 0, y: 0.5 }); // Padrão cavadinha leve
  const [chosenOption, setChosenOption] = useState<'chip' | 'corner' | 'dribble_gk'>('corner');

  // Posição do Goleiro saindo
  const [gkY, setGkY] = useState(150);

  useEffect(() => {
    if (boxState !== 'aiming') return;
    const interval = setInterval(() => {
      setGkY((y) => {
        if (y >= 230) return 230;
        return y + 3;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [boxState]);

  // Render do Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gramado
    const grassGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grassGrad.addColorStop(0, '#15803d');
    grassGrad.addColorStop(1, '#166534');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pequena Área
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(180, 70, 200, 100);

    // Gol ao Fundo
    const goalLeft = 140;
    const goalRight = 420;
    const goalTop = 50;
    const goalBottom = 130;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.strokeRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);

    // Goleiro Avançando
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(280, gkY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(266, gkY + 8, 28, 28);
    // Luvas abertas
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(252, gkY + 16, 7, 0, Math.PI * 2);
    ctx.arc(308, gkY + 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Atleta com a Bola no Pé
    const athleteY = 320;
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(280, athleteY - 30, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(272, athleteY - 18, 16, 24);

    // Bola
    ctx.beginPath();
    ctx.arc(280, athleteY + 12, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Seta de trajetória dependendo da escolha
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(280, athleteY);

    if (chosenOption === 'chip') {
      ctx.quadraticCurveTo(280, (athleteY + 90) / 2 - 40, 280, 90);
    } else if (chosenOption === 'corner') {
      ctx.lineTo(165, 100);
    } else {
      ctx.quadraticCurveTo(230, (athleteY + gkY) / 2, 280, 90);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }, [gkY, chosenOption, boxState]);

  // Resolução da Finalização
  const handleResolve = () => {
    if (boxState !== 'aiming') return;
    setBoxState('resolving');

    // Chance de Sucesso ponderada pelos atributos do jogador e opção
    const playerFinishing = playerProfile?.attributes?.finishing || 75;
    const playerDribbling = playerProfile?.attributes?.dribbling || 75;

    let successChance = 0.65;
    if (chosenOption === 'chip') {
      // Cavadinha é mais fácil se o goleiro saiu muito (gkY >= 190)
      successChance = gkY >= 190 ? 0.85 : 0.45;
    } else if (chosenOption === 'corner') {
      successChance = (playerFinishing / 100) * 0.82;
    } else if (chosenOption === 'dribble_gk') {
      successChance = (playerDribbling / 100) * 0.80;
    }

    setTimeout(() => {
      if (Math.random() < successChance) {
        setBoxState('goal');
        sound.play('goal');
        if (chosenOption === 'chip') {
          setFeedbackText('CAVADINHA DE ANTOLOGIA! Encolheu a perna e encobriu o goleiro com frieza absurda! 🔥');
        } else if (chosenOption === 'corner') {
          setFeedbackText('TAPA NO CONTRA-PÉ! Toque consciente com a chapa no cantinho que o goleiro não alcança!');
        } else {
          setFeedbackText('DRIBLE DA VACA NO GOLEIRO! Deixou o arqueiro no chão e entrou com bola e tudo!');
        }

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#fbbf24', '#ffffff'],
        });

        if (onScoreGoal) onScoreGoal(0.5);
      } else {
        setBoxState('saved');
        sound.play('whistle');
        setFeedbackText('O goleiro cresceu! Espalmou de forma milagrosa no reflexo!');
        if (onMiss) onMiss();
      }
    }, 600);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Cara a Cara com o Goleiro
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold uppercase">
                Na Cara do Gol
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              O arqueiro se adiantou! Escolha a melhor decisão para balançar a rede!
            </span>
          </div>
        </div>

        {matchInfo && (
          <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-secondary text-foreground">
            {matchInfo.oppClubName} • {matchInfo.minute}'
          </span>
        )}
      </div>

      <div className="relative w-full aspect-[560/380] bg-zinc-950 rounded-2xl overflow-hidden border border-border/60 shadow-inner">
        <canvas ref={canvasRef} width={560} height={380} className="w-full h-full touch-none" />

        {boxState !== 'aiming' && boxState !== 'resolving' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {boxState === 'goal' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Frieza de Craque!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Milagre do Goleiro</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-all shadow-lg cursor-pointer"
              >
                Voltar à Partida
              </button>
            )}
          </div>
        )}
      </div>

      {/* Opções de Tomada de Decisão */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-border">
        <button
          type="button"
          onClick={() => setChosenOption('corner')}
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 border ${
            chosenOption === 'corner'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-secondary border-border text-muted-foreground'
          }`}
        >
          <span>🎯 Chapa no Canto</span>
          <span className="text-[9px] font-normal opacity-80">Rasteiro no contrapé</span>
        </button>

        <button
          type="button"
          onClick={() => setChosenOption('chip')}
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 border ${
            chosenOption === 'chip'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-secondary border-border text-muted-foreground'
          }`}
        >
          <span>✨ Cavadinha</span>
          <span className="text-[9px] font-normal opacity-80">Por cima do goleiro</span>
        </button>

        <button
          type="button"
          onClick={() => setChosenOption('dribble_gk')}
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 border ${
            chosenOption === 'dribble_gk'
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : 'bg-secondary border-border text-muted-foreground'
          }`}
        >
          <span>🕺 Driblar o Goleiro</span>
          <span className="text-[9px] font-normal opacity-80">Finta de corpo</span>
        </button>
      </div>

      <button
        type="button"
        disabled={boxState !== 'aiming'}
        onClick={handleResolve}
        className="w-full mt-3 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <Flame className="w-4 h-4" />
        FINALIZAR LANCE AGORA!
      </button>
    </div>
  );
}
