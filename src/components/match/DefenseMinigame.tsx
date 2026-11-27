'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '@/lib/soundEffects';
import { Shield } from 'lucide-react';
import { drawPitchBackground, drawCartoonPlayer, drawStyledBall } from '@/lib/minigameCanvas';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from '@/components/game/DifficultyBadge';

export type DefenseVariant = 'tackle_1v1' | 'interception' | 'aerial_duel';

interface DefenseMinigameProps {
  variant: DefenseVariant;
  difficulty?: number;
  divisionOverride?: Division;
  opponentOverall?: number;
  weather?: 'sunny' | 'rainy' | 'snowy' | 'windy';
  playerName: string;
  playerTackling: number;
  playerHeading: number;
  playerJumping: number;
  playerPositioning: number;
  onResult: (result: {
    success: boolean;
    type: 'clean_tackle' | 'foul' | 'beaten' | 'interception' | 'deflection' | 'passed_through' | 'header_won' | 'header_lost';
    rating: number;
    cardRisk?: boolean;
    commentary?: string;
  }) => void;
  onCancel: () => void;
}

export function DefenseMinigame({
  variant,
  difficulty = 5,
  divisionOverride,
  opponentOverall,
  weather = 'sunny',
  playerName,
  playerTackling,
  playerHeading,
  playerJumping,
  onResult,
  onCancel,
}: DefenseMinigameProps) {
  const balance = useMinigameBalance({
    division: divisionOverride,
    opponentOverall,
  });
  const effectiveDifficulty = Math.max(1, Math.min(10, difficulty + (balance.difficultyScore - 0.5) * 6));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const progressRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
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

  const handleAction = useCallback(
    (action: 'tackle' | 'wait' | 'intercept' | 'jump') => {
      if (gameState !== 'playing' || endedRef.current) return;
      endedRef.current = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setGameState('ended');

      const prog = progressRef.current;

      if (variant === 'tackle_1v1') {
        if (action === 'tackle') {
          const isGoodTiming = prog >= 0.52 && prog <= 0.88;
          const tacklingBonus = playerTackling / 150;
          const success = isGoodTiming && Math.random() < 0.72 + tacklingBonus;

          if (success) {
            sound.playKick();
            sound.playCheer();
            setFeedback({ text: 'DESARME LIMPO E CIRÚRGICO!', success: true });
            setTimeout(() => {
              onResultRef.current({
                success: true,
                type: 'clean_tackle',
                rating: 8.5,
                commentary: `${playerName} deu um bote cirúrgico, roubou a bola e puxou o contra-ataque!`,
              });
            }, 1000);
          } else {
            sound.playCardSound();
            setFeedback({ text: 'FALTA PERIGOSA! RISCO DE CARTÃO', success: false });
            setTimeout(() => {
              onResultRef.current({
                success: false,
                type: 'foul',
                rating: 5.9,
                cardRisk: true,
                commentary: `${playerName} errou o tempo da dividida e cometeu falta na entrada da área!`,
              });
            }, 1000);
          }
        } else {
          sound.playWhistle();
          setFeedback({ text: 'DRIBLADO! O ATACANTE PASSOU...', success: false });
          setTimeout(() => {
            onResultRef.current({
              success: false,
              type: 'beaten',
              rating: 5.5,
              commentary: `${playerName} hesitou na marcação e foi batido no drible!`,
            });
          }, 1000);
        }
      } else if (variant === 'interception') {
        const isGoodTiming = prog >= 0.36 && prog <= 0.68;
        if (isGoodTiming) {
          sound.playKick();
          sound.playCheer();
          setFeedback({ text: 'INTERCEPTAÇÃO SALVADORA!', success: true });
          setTimeout(() => {
            onResultRef.current({
              success: true,
              type: 'interception',
              rating: 8.3,
              commentary: `Visão defensiva espetacular! ${playerName} leu o passe e cortou o perigo!`,
            });
          }, 1000);
        } else {
          sound.playWhistle();
          setFeedback({ text: 'PASSE PASSOU... DEFESA EXPOSTA', success: false });
          setTimeout(() => {
            onResultRef.current({
              success: false,
              type: 'passed_through',
              rating: 6.0,
              commentary: `${playerName} tentou a interceptação, mas o passe encontrou o atacante livre!`,
            });
          }, 1000);
        }
      } else {
        const isPeak = prog >= 0.35 && prog <= 0.65;
        const aerialStats = (playerHeading + playerJumping) / 200;
        const success = isPeak && Math.random() < 0.65 + aerialStats * 0.35;

        if (success) {
          sound.playKick();
          sound.playCheer();
          setFeedback({ text: 'GANHOU NO ALTO! CABECEIO FIRME', success: true });
          setTimeout(() => {
            onResultRef.current({
              success: true,
              type: 'header_won',
              rating: 8.4,
              commentary: `${playerName} subiu no terceiro andar com autoridade e afastou pelo alto!`,
            });
          }, 1000);
        } else {
          sound.playWhistle();
          setFeedback({ text: 'PERDEU A DISPUTA AÉREA...', success: false });
          setTimeout(() => {
            onResultRef.current({
              success: false,
              type: 'header_lost',
              rating: 5.8,
              commentary: `${playerName} perdeu no alto e o adversário cabeceou com perigo!`,
            });
          }, 1000);
        }
      }
    },
    [gameState, variant, playerTackling, playerHeading, playerJumping, playerName]
  );

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = Date.now();
    const duration = Math.max(1150, Math.round((2450 - effectiveDifficulty * 95) / Math.sqrt(balance.defenderSpeedMult)));

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      progressRef.current = progress;

      drawPitchBackground(ctx, canvas.width, canvas.height, 28);

      if (weather === 'rainy') {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 18; i++) {
          const rx = (Math.sin(now * 0.005 + i) * 0.5 + 0.5) * canvas.width;
          const ry = (now * 0.4 + i * 20) % canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 10);
          ctx.stroke();
        }
      }

      if (variant === 'tackle_1v1') {
        const attX = canvas.width * 0.16 + canvas.width * 0.58 * progress;
        const attY = canvas.height * 0.54;
        const defX = canvas.width * 0.76;
        const defY = canvas.height * 0.54;

        const isSweet = progress >= 0.52 && progress <= 0.88;
        ctx.save();
        ctx.strokeStyle = isSweet ? '#34d399' : 'rgba(52, 211, 153, 0.45)';
        ctx.lineWidth = isSweet ? 3 : 1.5;
        ctx.fillStyle = isSweet ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.1)';
        ctx.fillRect(canvas.width * 0.52, canvas.height * 0.3, canvas.width * 0.24, canvas.height * 0.48);
        ctx.strokeRect(canvas.width * 0.52, canvas.height * 0.3, canvas.width * 0.24, canvas.height * 0.48);
        ctx.restore();

        drawCartoonPlayer(ctx, defX, defY, {
          jerseyColor: '#10b981',
          shortsColor: '#0f172a',
          label: 'VOCÊ',
          labelColor: '#6ee7b7',
        });

        drawCartoonPlayer(ctx, attX, attY, {
          jerseyColor: '#dc2626',
          shortsColor: '#ffffff',
          label: 'RIVAL',
          labelColor: '#fca5a5',
        });

        drawStyledBall(ctx, attX + 14, attY + 8, 6.5);

        if (progress >= 1) {
          handleAction('wait');
          return;
        }
      } else if (variant === 'interception') {
        const passStartX = canvas.width * 0.12;
        const passStartY = canvas.height * 0.2;
        const passEndX = canvas.width * 0.88;
        const passEndY = canvas.height * 0.8;
        const currentBallX = passStartX + (passEndX - passStartX) * progress;
        const currentBallY = passStartY + (passEndY - passStartY) * progress;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(passStartX, passStartY);
        ctx.lineTo(passEndX, passEndY);
        ctx.stroke();
        ctx.setLineDash([]);

        const zoneX = canvas.width * 0.48;
        const zoneY = canvas.height * 0.48;
        const isSweet = progress >= 0.36 && progress <= 0.68;

        ctx.fillStyle = isSweet ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.12)';
        ctx.strokeStyle = isSweet ? '#34d399' : '#10b981';
        ctx.lineWidth = isSweet ? 3 : 1.5;
        ctx.fillRect(zoneX - 28, zoneY - 28, 56, 56);
        ctx.strokeRect(zoneX - 28, zoneY - 28, 56, 56);

        drawCartoonPlayer(ctx, zoneX - 38, zoneY + 12, {
          jerseyColor: '#10b981',
          shortsColor: '#0f172a',
          label: 'VOCÊ',
          labelColor: '#6ee7b7',
        });

        drawStyledBall(ctx, currentBallX, currentBallY, 7.5);

        if (progress >= 1) {
          handleAction('intercept');
          return;
        }
      } else {
        const ballY = canvas.height * 0.85 - Math.sin(progress * Math.PI) * (canvas.height * 0.62);
        const ballX = canvas.width * 0.5;
        const isSweet = progress >= 0.35 && progress <= 0.65;

        ctx.fillStyle = isSweet ? 'rgba(250, 204, 21, 0.32)' : 'rgba(251, 191, 36, 0.12)';
        ctx.strokeStyle = isSweet ? '#facc15' : 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = isSweet ? 3 : 2;
        ctx.fillRect(ballX - 24, canvas.height * 0.2 - 12, 48, 44);
        ctx.strokeRect(ballX - 24, canvas.height * 0.2 - 12, 48, 44);

        drawCartoonPlayer(ctx, ballX - 24, canvas.height * 0.72, {
          jerseyColor: '#10b981',
          shortsColor: '#0f172a',
          label: 'VOCÊ',
          labelColor: '#6ee7b7',
        });
        drawCartoonPlayer(ctx, ballX + 24, canvas.height * 0.72, {
          jerseyColor: '#dc2626',
          shortsColor: '#ffffff',
          label: 'RIVAL',
          labelColor: '#fca5a5',
        });

        drawStyledBall(ctx, ballX, ballY, 9, Math.sin(progress * Math.PI) * 18);

        if (progress >= 1) {
          handleAction('jump');
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, variant, difficulty, weather, handleAction]);

  const primaryAction = variant === 'tackle_1v1' ? 'tackle' : variant === 'interception' ? 'intercept' : 'jump';

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
                {variant === 'tackle_1v1' ? 'Desarme 1x1' : variant === 'interception' ? 'Interceptação de Passe' : 'Duelo Aéreo'}
              </h3>
              <p className="text-xs text-zinc-400">
                Defensor: <span className="text-emerald-400 font-semibold">{playerName}</span>
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
            height={240}
            onClick={() => handleAction(primaryAction)}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                e.preventDefault();
                handleAction(primaryAction);
              }
            }}
            className="rounded-xl border border-zinc-700 shadow-inner bg-zinc-950 touch-none max-w-full cursor-pointer"
          />

          {countdown > 0 && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-extrabold text-emerald-400 animate-pulse font-mono">
                {countdown}
              </span>
              <span className="text-xs text-zinc-300 mt-2 font-medium">Postura defensiva firme!</span>
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
            {variant === 'tackle_1v1' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction('wait')}
                  className="py-3 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition cursor-pointer"
                >
                  Recuar / Esperar 🛡️
                </button>
                <button
                  onClick={() => handleAction('tackle')}
                  className="py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
                >
                  DAR O BOTE AGORA! ⚡
                </button>
              </div>
            )}

            {variant === 'interception' && (
              <button
                onClick={() => handleAction('intercept')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-95 text-xs md:text-sm cursor-pointer"
              >
                INTERCEPTAR LINHA DE PASSE ⚡
              </button>
            )}

            {variant === 'aerial_duel' && (
              <button
                onClick={() => handleAction('jump')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-95 text-xs md:text-sm cursor-pointer"
              >
                SALTAR PARA O CABECEIO ⚽
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
