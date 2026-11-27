'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { CheckCircle2, XCircle, Flame, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import {
  drawPitchBackground,
  drawGoalWithNet,
  drawCartoonPlayer,
  drawStyledBall,
  getCanvasPointerCoords,
} from '@/lib/minigameCanvas';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from './DifficultyBadge';

interface NSSInsideBoxMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
  divisionOverride?: Division;
  opponentOverall?: number;
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
  divisionOverride,
  opponentOverall,
  matchInfo,
}: NSSInsideBoxMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const balance = useMinigameBalance({
    division: divisionOverride,
    opponentOverall,
  });
  const balanceRef = useRef(balance);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  const [boxState, setBoxState] = useState<'aiming' | 'resolving' | 'goal' | 'saved'>('aiming');
  const [feedbackText, setFeedbackText] = useState('O goleiro está saindo! Escolha a jogada ou toque no canto do gol!');
  const [chosenOption, setChosenOption] = useState<'chip' | 'corner' | 'dribble_gk'>('corner');

  const onGoalRef = useRef(onScoreGoal);
  const onMissRef = useRef(onMiss);

  useEffect(() => {
    onGoalRef.current = onScoreGoal;
    onMissRef.current = onMiss;
  }, [onScoreGoal, onMiss]);

  const simRef = useRef({
    state: 'aiming' as 'aiming' | 'resolving' | 'goal' | 'saved',
    option: 'corner' as 'chip' | 'corner' | 'dribble_gk',
    cornerX: 165,
    gkX: 280,
    gkY: 104,
    gkTilt: 0,
    playerX: 280,
    playerY: 318,
    ballX: 280,
    ballY: 300,
    ballZ: 0,
    trail: [] as { x: number; y: number; z: number }[],
    progress: 0,
    willScore: false,
    netStretch: 0,
  });

  const resetPlay = useCallback(() => {
    simRef.current = {
      state: 'aiming',
      option: chosenOption,
      cornerX: 165,
      gkX: 280,
      gkY: 104,
      gkTilt: 0,
      playerX: 280,
      playerY: 318,
      ballX: 280,
      ballY: 300,
      ballZ: 0,
      trail: [],
      progress: 0,
      willScore: false,
      netStretch: 0,
    };
    setBoxState('aiming');
    setFeedbackText('O goleiro está saindo! Escolha a jogada ou toque no canto do gol!');
  }, [chosenOption]);

  useEffect(() => {
    simRef.current.option = chosenOption;
  }, [chosenOption]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = simRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (s.state === 'aiming') {
        s.gkY = Math.min(235, s.gkY + 0.55 * balanceRef.current.keeperSpeedMult);
        s.gkX = 280 + Math.sin(Date.now() * (0.004 * balanceRef.current.keeperSpeedMult)) * 18;
      } else if (s.state === 'resolving') {
        s.progress = Math.min(1, s.progress + 0.045);
        const t = s.progress;

        if (s.option === 'chip') {
          s.ballX = 280;
          s.ballY = 300 + (72 - 300) * t;
          s.ballZ = Math.sin(t * Math.PI) * 72;
          s.gkY = Math.min(245, s.gkY + 1.2);
          if (!s.willScore && t > 0.6) {
            s.gkTilt = -0.35;
          }
        } else if (s.option === 'corner') {
          const targetX = s.willScore ? s.cornerX : s.cornerX < 280 ? 225 : 335;
          s.ballX = 280 + (targetX - 280) * t;
          s.ballY = 300 + (72 - 300) * t;
          s.ballZ = Math.sin(t * Math.PI) * 16;
          const diveDir = targetX < 280 ? -1 : 1;
          s.gkX += (s.willScore ? -diveDir : diveDir) * 2.6;
          s.gkTilt = (s.willScore ? -diveDir : diveDir) * 0.55;
        } else {
          // Dribble GK
          const side = s.cornerX < 280 ? -1 : 1;
          s.playerX = 280 + Math.sin(t * Math.PI) * side * 62;
          s.playerY = 318 + (108 - 318) * t;
          s.ballX = s.playerX + side * 8;
          s.ballY = s.playerY - 14;
          s.gkX = 280 - side * (s.willScore ? 28 : 5) * t;
          s.gkTilt = side * 0.45 * t;
        }

        s.trail.push({ x: s.ballX, y: s.ballY, z: s.ballZ });
        if (s.trail.length > 9) s.trail.shift();

        if (t >= 1) {
          if (s.willScore) {
            s.state = 'goal';
            s.netStretch = 10;
            setBoxState('goal');
            sound.playGoal();
            if (s.option === 'chip') {
              setFeedbackText('CAVADINHA DE ANTOLOGIA! Encobriu o goleiro com frieza absurda! 🔥');
            } else if (s.option === 'corner') {
              setFeedbackText('TAPA NO CONTRA-PÉ! Chapa cirúrgica no cantinho indefensável!');
            } else {
              setFeedbackText('DRIBLE DA VACA NO GOLEIRO! Deixou o arqueiro no chão e guardou!');
            }
            confetti({
              particleCount: 75,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#10b981', '#fbbf24', '#ffffff'],
            });
            onGoalRef.current?.(0.5);
          } else {
            s.state = 'saved';
            setBoxState('saved');
            sound.playWoodwork();
            setFeedbackText('MILAGRE DO GOLEIRO! Fechou o ângulo e salvou no reflexo!');
            onMissRef.current?.();
          }
        }
      } else if (s.netStretch > 0) {
        s.netStretch = Math.max(0, s.netStretch - 0.35);
      }

      drawPitchBackground(ctx, w, h, 32);

      // Linha de fundo/gol, pequena área e grande área a partir da linha do gol (y = 102)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(12, 102);
      ctx.lineTo(w - 12, 102);
      ctx.stroke();
      ctx.strokeRect(90, 102, 380, 195);
      ctx.strokeRect(185, 102, 190, 68);

      drawGoalWithNet(ctx, 140, 24, 280, 78, s.netStretch);

      // Prévia da trajetória durante mira
      if (s.state === 'aiming') {
        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(s.ballX, s.ballY);
        if (s.option === 'chip') {
          ctx.quadraticCurveTo(280, 175, 280, 72);
        } else if (s.option === 'corner') {
          ctx.lineTo(s.cornerX, 72);
        } else {
          const side = s.cornerX < 280 ? -1 : 1;
          ctx.quadraticCurveTo(280 + side * 65, (300 + s.gkY) / 2, 280, 76);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Goleiro
      drawCartoonPlayer(ctx, s.gkX, s.gkY, {
        jerseyColor: '#f59e0b',
        shortsColor: '#0f172a',
        gloveColor: '#22c55e',
        label: 'GOL',
        labelColor: '#fde68a',
        scale: 1.05,
        divingTilt: s.gkTilt,
      });

      // Atacante (Você)
      drawCartoonPlayer(ctx, s.playerX, s.playerY, {
        jerseyColor: '#10b981',
        shortsColor: '#0f172a',
        label: 'VOCÊ',
        labelColor: '#6ee7b7',
        scale: 1.1,
      });

      // Bola com altura e rastro
      drawStyledBall(ctx, s.ballX, s.ballY, 9, s.ballZ, s.trail);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleCanvasAim = (clientX: number, clientY: number) => {
    const s = simRef.current;
    if (s.state !== 'aiming' || !canvasRef.current) return;
    const { x } = getCanvasPointerCoords(canvasRef.current, clientX, clientY);
    s.cornerX = Math.max(158, Math.min(402, x));
  };

  const handleResolve = () => {
    const s = simRef.current;
    if (s.state !== 'aiming') return;

    const playerFinishing = playerProfile?.attributes?.finishing || 75;
    const playerDribbling = playerProfile?.attributes?.dribbling || 75;

    let successChance = 0.68;
    if (s.option === 'chip') {
      successChance = s.gkY >= 185 ? 0.88 : 0.48;
    } else if (s.option === 'corner') {
      const edgeBonus = Math.abs(s.cornerX - 280) > 65 ? 0.1 : 0;
      successChance = Math.min(0.92, (playerFinishing / 100) * 0.8 + edgeBonus);
    } else {
      successChance = Math.min(0.9, (playerDribbling / 100) * 0.82);
    }

    const balancedChance = Math.max(0.24, Math.min(0.96, successChance - balance.aiReactionBonus * 0.85));
    s.willScore = Math.random() < balancedChance;
    s.state = 'resolving';
    s.progress = 0;
    s.trail = [];
    setBoxState('resolving');
    sound.playKick();
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
              {chosenOption === 'chip'
                ? 'Espere o goleiro avançar bastante para encobrir!'
                : 'Toque no canto do gol para mirar e finalize!'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <DifficultyBadge balance={balance} compact />
          {matchInfo && (
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-secondary text-foreground">
              {matchInfo.oppClubName} • {matchInfo.minute}&apos;
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[560/380] bg-zinc-950 rounded-2xl overflow-hidden border border-border/60 shadow-inner">
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          onClick={(e) => handleCanvasAim(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              e.preventDefault();
              handleCanvasAim(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {(boxState === 'goal' || boxState === 'saved') && (
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

            <div className="mt-4 flex gap-2">
              {!matchInfo && (
                <button
                  type="button"
                  onClick={resetPlay}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Novo Lance
                </button>
              )}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-all shadow-lg cursor-pointer"
                >
                  Voltar à Partida
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-border">
        <button
          type="button"
          onClick={() => setChosenOption('corner')}
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 border cursor-pointer ${
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
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 border cursor-pointer ${
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
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 border cursor-pointer ${
            chosenOption === 'dribble_gk'
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : 'bg-secondary border-border text-muted-foreground'
          }`}
        >
          <span>🕺 Driblar Goleiro</span>
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
