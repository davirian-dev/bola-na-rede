'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '@/lib/soundEffects';
import { Shield } from 'lucide-react';
import {
  drawPitchBackground,
  drawGoalWithNet,
  drawCartoonPlayer,
  drawStyledBall,
  getCanvasPointerCoords,
} from '@/lib/minigameCanvas';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from '@/components/game/DifficultyBadge';

export type GoalkeeperVariant = 'shot_save' | 'rush_1v1' | 'cross_catch';

interface GoalkeeperMinigameProps {
  variant: GoalkeeperVariant;
  difficulty?: number;
  divisionOverride?: Division;
  opponentOverall?: number;
  weather?: 'sunny' | 'rainy' | 'snowy' | 'windy';
  playerName: string;
  playerReflexes: number;
  playerPositioning: number;
  onResult: (result: {
    success: boolean;
    type: 'save' | 'goal_conceded' | 'catch' | 'punch' | 'dropped';
    rating: number;
    commentary?: string;
  }) => void;
  onCancel: () => void;
}

export function GoalkeeperMinigame({
  variant,
  difficulty = 5,
  divisionOverride,
  opponentOverall,
  weather = 'sunny',
  playerName,
  playerReflexes,
  playerPositioning,
  onResult,
  onCancel,
}: GoalkeeperMinigameProps) {
  const balance = useMinigameBalance({
    division: divisionOverride,
    opponentOverall,
  });
  const effectiveDifficulty = Math.max(1, Math.min(10, difficulty + (balance.difficultyScore - 0.5) * 6));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const [targetZone] = useState<number>(() => Math.floor(Math.random() * 6));
  const animFrameRef = useRef<number | null>(null);
  const rushCursorRef = useRef<number>(0.5);
  const crossHeightRef = useRef<number>(0.5);
  const gkPosRef = useRef<{ x: number; y: number; tilt: number }>({ x: 190, y: 120, tilt: 0 });
  const endedRef = useRef(false);

  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => {
        const next = c - 1;
        if (next === 0) {
          setGameState('playing');
          sound.playWhistle();
        }
        return next;
      });
    }, 550);
    return () => clearTimeout(timer);
  }, [countdown]);

  const finishResult = useCallback(
    (
      success: boolean,
      type: 'save' | 'goal_conceded' | 'catch' | 'punch' | 'dropped',
      rating: number,
      feedbackMsg: string,
      commentary: string
    ) => {
      if (endedRef.current) return;
      endedRef.current = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setGameState('ended');
      setFeedback({ text: feedbackMsg, success });

      setTimeout(() => {
        onResultRef.current({ success, type, rating, commentary });
      }, 1050);
    },
    []
  );

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = Date.now();
    const duration = Math.max(1050, Math.round((2300 - effectiveDifficulty * 85) / Math.sqrt(balance.keeperSpeedMult)));

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      drawPitchBackground(ctx, canvas.width, canvas.height, 26);

      if (weather === 'rainy') {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          const rx = (Math.sin(now * 0.005 + i) * 0.5 + 0.5) * canvas.width;
          const ry = (now * 0.4 + i * 20) % canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 12);
          ctx.stroke();
        }
      }

      const goalW = canvas.width * 0.76;
      const goalH = canvas.height * 0.52;
      const goalX = (canvas.width - goalW) / 2;
      const goalY = canvas.height * 0.1;

      drawGoalWithNet(ctx, goalX, goalY, goalW, goalH);

      if (variant === 'shot_save') {
        const zoneW = goalW / 3;
        const zoneH = goalH / 2;
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            const zX = goalX + col * zoneW;
            const zY = goalY + row * zoneH;
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(zX + 2, zY + 2, zoneW - 4, zoneH - 4);
          }
        }

        // Goleiro (Você) no gol
        drawCartoonPlayer(ctx, gkPosRef.current.x, gkPosRef.current.y, {
          jerseyColor: '#f59e0b',
          shortsColor: '#0f172a',
          gloveColor: '#22c55e',
          divingTilt: gkPosRef.current.tilt,
        });

        // Bola viajando para o quadrante alvo
        const targetCol = targetZone % 3;
        const targetRow = Math.floor(targetZone / 3);
        const destX = goalX + targetCol * zoneW + zoneW / 2;
        const destY = goalY + targetRow * zoneH + zoneH / 2;
        const currentX = canvas.width / 2 + (destX - canvas.width / 2) * progress;
        const currentY = canvas.height * 0.9 + (destY - canvas.height * 0.9) * progress;
        const ballSize = 13 - 5 * progress;

        drawStyledBall(ctx, currentX, currentY, ballSize, Math.sin(progress * Math.PI) * 14);

        if (progress >= 1) {
          sound.playGoal();
          finishResult(
            false,
            'goal_conceded',
            6.0,
            'GOL DO ADVERSÁRIO...',
            `Chute colocado no canto sem reação de ${playerName}!`
          );
          return;
        }
      } else if (variant === 'rush_1v1') {
        const attY = canvas.height * 0.85 - progress * canvas.height * 0.38;
        drawCartoonPlayer(ctx, canvas.width / 2, attY, {
          jerseyColor: '#dc2626',
          shortsColor: '#ffffff',
          label: 'ATACANTE',
          labelColor: '#fca5a5',
        });
        drawStyledBall(ctx, canvas.width / 2, attY - 14, 7);

        drawCartoonPlayer(ctx, gkPosRef.current.x, goalY + goalH - 12, {
          jerseyColor: '#f59e0b',
          shortsColor: '#0f172a',
          gloveColor: '#22c55e',
          label: 'VOCÊ',
          labelColor: '#fde68a',
        });

        const barW = canvas.width * 0.68;
        const barH = 16;
        const barX = (canvas.width - barW) / 2;
        const barY = canvas.height * 0.82;

        ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
        ctx.fillRect(barX, barY, barW, barH);

        const perfectStart = barX + barW * 0.36;
        const perfectW = barW * 0.28;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(perfectStart, barY, perfectW, barH);

        const cursorRatio = Math.sin(now * 0.0065) * 0.5 + 0.5;
        rushCursorRef.current = cursorRatio;
        const cursorX = barX + barW * cursorRatio;
        ctx.fillStyle = '#facc15';
        ctx.fillRect(cursorX - 3, barY - 4, 6, barH + 8);
      } else if (variant === 'cross_catch') {
        const arcProgress = Math.sin(now * 0.0045) * 0.5 + 0.5;
        crossHeightRef.current = arcProgress;

        const bx = canvas.width * 0.5;
        const by = goalY + goalH * (1 - arcProgress);

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 22, goalY + goalH * 0.32 - 22, 44, 44);

        drawCartoonPlayer(ctx, bx, goalY + goalH - 10, {
          jerseyColor: '#f59e0b',
          shortsColor: '#0f172a',
          gloveColor: '#22c55e',
          label: 'VOCÊ',
          labelColor: '#fde68a',
        });

        drawStyledBall(ctx, bx, by, 10, 12);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, targetZone, difficulty, weather, variant, finishResult, playerName]);

  const handleZoneClick = (clickedZone: number) => {
    if (gameState !== 'playing' || endedRef.current) return;

    const col = clickedZone % 3;
    const row = Math.floor(clickedZone / 3);
    gkPosRef.current = {
      x: 85 + col * 105,
      y: 78 + row * 48,
      tilt: col === 0 ? -0.5 : col === 2 ? 0.5 : 0,
    };

    const reflexesBonus = playerReflexes > 75 ? 1 : 0;
    const isExact = clickedZone === targetZone;
    const isClose = Math.abs(clickedZone - targetZone) <= reflexesBonus && Math.floor(clickedZone / 3) === Math.floor(targetZone / 3);

    if (isExact || (isClose && Math.random() < 0.55)) {
      sound.playCheer();
      finishResult(
        true,
        'save',
        8.6 + (playerReflexes / 100) * 1.1,
        'MILAGRE! DEFESA HISTÓRICA!',
        `DEFESAÇA DE ${playerName}! Voou no canto e operou um verdadeiro milagre!`
      );
    } else {
      sound.playGoal();
      finishResult(
        false,
        'goal_conceded',
        6.0,
        'GOL DO ADVERSÁRIO...',
        `Bola indefensável no canto! ${playerName} se esticou, mas não alcançou!`
      );
    }
  };

  const handleCanvasTap = (clientX: number, clientY: number) => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    if (variant === 'shot_save') {
      const { x, y } = getCanvasPointerCoords(canvasRef.current, clientX, clientY);
      const goalW = canvasRef.current.width * 0.76;
      const goalH = canvasRef.current.height * 0.52;
      const goalX = (canvasRef.current.width - goalW) / 2;
      const goalY = canvasRef.current.height * 0.1;

      const col = Math.max(0, Math.min(2, Math.floor(((x - goalX) / goalW) * 3)));
      const row = Math.max(0, Math.min(1, Math.floor(((y - goalY) / goalH) * 2)));
      handleZoneClick(row * 3 + col);
    } else if (variant === 'rush_1v1') {
      handleRushClick();
    } else {
      handleCrossCatch();
    }
  };

  const handleRushClick = () => {
    if (gameState !== 'playing' || endedRef.current) return;
    const ratio = rushCursorRef.current;
    const inGreenZone = ratio >= 0.36 && ratio <= 0.64;
    const isSuccess = inGreenZone || Math.random() < playerPositioning / 240;

    if (isSuccess) {
      sound.playCheer();
      finishResult(
        true,
        'save',
        inGreenZone ? 8.8 : 7.9,
        'ABAFOU O CHUTE! SAÍDA PERFEITA!',
        `${playerName} saiu no tempo perfeito, fechou o ângulo e salvou cara a cara!`
      );
    } else {
      sound.playGoal();
      finishResult(
        false,
        'goal_conceded',
        5.8,
        'DRIBLADO! GOL DO RIVAL...',
        `${playerName} saiu fora de hora e o atacante tocou por cima!`
      );
    }
  };

  const handleCrossCatch = () => {
    if (gameState !== 'playing' || endedRef.current) return;
    const h = crossHeightRef.current;
    const isGoodTiming = h >= 0.25 && h <= 0.65;

    if (isGoodTiming) {
      sound.playCheer();
      finishResult(
        true,
        'catch',
        8.4,
        'BOLA ENCAIXADA NO ALTO!',
        `${playerName} subiu no terceiro andar com segurança e ficou com a bola!`
      );
    } else {
      sound.playKick();
      finishResult(
        true,
        'punch',
        7.3,
        'ESPALMOU PARA ESCANTEIO!',
        `${playerName} afastou o perigo dando um soco providencial na bola!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/40 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-zinc-100">
                {variant === 'shot_save'
                  ? 'Defesa de Chute'
                  : variant === 'rush_1v1'
                  ? 'Saída 1x1 Cara a Cara'
                  : 'Cruzamento na Área'}
              </h3>
              <p className="text-xs text-zinc-400">
                Goleiro: <span className="text-emerald-400 font-semibold">{playerName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DifficultyBadge balance={balance} compact />
            <button
              onClick={onCancel}
              className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition cursor-pointer"
            >
              Pular Lance
            </button>
          </div>
        </div>

        <div className="relative my-4 w-full flex justify-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={260}
            onClick={(e) => handleCanvasTap(e.clientX, e.clientY)}
            onTouchStart={(e) => {
              if (e.touches[0]) {
                e.preventDefault();
                handleCanvasTap(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            className="rounded-xl border border-zinc-700 shadow-inner bg-zinc-950 touch-none max-w-full cursor-pointer"
          />

          {countdown > 0 && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-extrabold text-emerald-400 animate-pulse font-mono">
                {countdown}
              </span>
              <span className="text-xs text-zinc-300 mt-2 font-medium">Prepare as luvas!</span>
            </div>
          )}

          {feedback && (
            <div
              className={`absolute inset-0 rounded-xl flex items-center justify-center font-bold text-base md:text-lg px-4 text-center ${
                feedback.success ? 'bg-emerald-950/85 text-emerald-300' : 'bg-red-950/85 text-red-300'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </div>

        {gameState === 'playing' && (
          <div className="w-full">
            {variant === 'shot_save' && (
              <div className="space-y-2 text-center">
                <p className="text-xs text-zinc-300 font-medium">
                  Toque direto no canto do gol ou escolha o quadrante:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {['Sup. Esq', 'Sup. Centro', 'Sup. Dir', 'Inf. Esq', 'Inf. Centro', 'Inf. Dir'].map((label, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleZoneClick(idx)}
                      className="py-2.5 px-1 bg-zinc-800/80 hover:bg-emerald-600/30 hover:border-emerald-500 border border-zinc-700 rounded-lg text-[11px] font-bold text-zinc-200 transition active:scale-95 cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {variant === 'rush_1v1' && (
              <div className="text-center space-y-3">
                <p className="text-xs text-zinc-300">Acerte a barra amarela na zona verde e feche o ângulo:</p>
                <button
                  onClick={handleRushClick}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
                >
                  ABAFAR AGORA! 🧤
                </button>
              </div>
            )}

            {variant === 'cross_catch' && (
              <div className="text-center space-y-3">
                <p className="text-xs text-zinc-300">Pule quando a bola cruzar o quadrado dourado:</p>
                <button
                  onClick={handleCrossCatch}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
                >
                  SALTAR PARA ENCAIXAR ⚽
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
