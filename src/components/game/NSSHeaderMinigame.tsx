'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { CheckCircle2, XCircle, ArrowUp, RotateCcw } from 'lucide-react';
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

interface NSSHeaderMinigameProps {
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

export function NSSHeaderMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  divisionOverride,
  opponentOverall,
  matchInfo,
}: NSSHeaderMinigameProps) {
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

  const athleteHeight = playerProfile?.height || 178;
  const isTall = athleteHeight >= 185;
  const isGiant = athleteHeight >= 190;
  const timingTolerance = Math.round((isGiant ? 46 : isTall ? 36 : 28) * balance.sweetSpotScale);

  const [headerState, setHeaderState] = useState<'incoming' | 'jumping' | 'goal' | 'saved' | 'out'>('incoming');
  const [feedbackText, setFeedbackText] = useState(
    isGiant
      ? `Torre de ${athleteHeight}cm! Toque para cabecear quando a bola entrar na zona dourada!`
      : `Suba no terceiro andar! Toque no campo ou botão quando a bola cruzar a zona dourada!`
  );
  const [aimX, setAimX] = useState<number>(175);

  const onGoalRef = useRef(onScoreGoal);
  const onMissRef = useRef(onMiss);

  useEffect(() => {
    onGoalRef.current = onScoreGoal;
    onMissRef.current = onMiss;
  }, [onScoreGoal, onMiss]);

  const simRef = useRef({
    state: 'incoming' as 'incoming' | 'jumping' | 'goal' | 'saved' | 'out',
    aimX: 175,
    playerX: 260,
    playerBaseY: 286,
    jumpY: 0,
    jumpVy: 0,
    gkX: 280,
    gkTilt: 0,
    ball: { x: 520, y: 195, z: 85, vx: -4.4, vy: 1.05, vz: -0.42 },
    trail: [] as { x: number; y: number; z: number }[],
    netStretch: 0,
  });

  useEffect(() => {
    simRef.current.aimX = aimX;
  }, [aimX]);

  const resetPlay = useCallback(() => {
    simRef.current = {
      state: 'incoming',
      aimX,
      playerX: 260,
      playerBaseY: 286,
      jumpY: 0,
      jumpVy: 0,
      gkX: 280,
      gkTilt: 0,
      ball: { x: 520, y: 195, z: 85, vx: -4.4, vy: 1.05, vz: -0.42 },
      trail: [],
      netStretch: 0,
    };
    setHeaderState('incoming');
    setFeedbackText('Suba no terceiro andar! Acerte o tempo na zona dourada!');
  }, [aimX]);

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
      const goalLeft = 130;
      const goalRight = 430;
      const goalTop = 22;
      const goalBottom = 108; // Linha do gol!

      // Atualiza salto do atacante
      if (s.jumpY > 0 || s.jumpVy > 0) {
        s.jumpY += s.jumpVy;
        s.jumpVy -= 0.7;
        if (s.jumpY <= 0) {
          s.jumpY = 0;
          s.jumpVy = 0;
        }
      }

      if (s.state === 'incoming') {
        const crossScale = 0.8 + balanceRef.current.defenderSpeedMult * 0.22;
        s.ball.x += s.ball.vx * crossScale;
        s.ball.y += s.ball.vy * crossScale;
        s.ball.z = Math.max(8, s.ball.z + s.ball.vz * crossScale);
        s.gkX = 280 + Math.sin(Date.now() * (0.004 * balanceRef.current.keeperSpeedMult)) * 28;

        s.trail.push({ x: s.ball.x, y: s.ball.y, z: s.ball.z * 0.7 });
        if (s.trail.length > 8) s.trail.shift();

        if (s.ball.x < 130) {
          s.state = 'out';
          setHeaderState('out');
          setFeedbackText('Passou da bola! O cruzamento viajou sem ninguém desviar!');
          sound.playWhistle();
          onMissRef.current?.();
        }
      } else if (s.state === 'jumping') {
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        s.ball.z = Math.max(0, s.ball.z + s.ball.vz);

        // Goleiro salta tentando alcançar (calibrado por OVR × Liga)
        const gkDir = s.aimX < s.gkX ? -1 : 1;
        s.gkX += gkDir * (2.1 * balanceRef.current.keeperSpeedMult);
        s.gkTilt = gkDir * 0.45;

        s.trail.push({ x: s.ball.x, y: s.ball.y, z: s.ball.z * 0.7 });
        if (s.trail.length > 8) s.trail.shift();

        if (s.ball.y <= goalBottom - 16) {
          const distToGk = Math.abs(s.ball.x - s.gkX);
          const isInside = s.ball.x >= goalLeft + 10 && s.ball.x <= goalRight - 10;

          if (distToGk < 24 * Math.max(0.75, Math.min(1.25, balanceRef.current.keeperSpeedMult))) {
            s.state = 'saved';
            setHeaderState('saved');
            setFeedbackText('MILAGRE! O goleiro voou no reflexo e espalmou a cabeçada!');
            sound.playWoodwork();
            onMissRef.current?.();
          } else if (isInside) {
            s.state = 'goal';
            s.netStretch = 10;
            setHeaderState('goal');
            setFeedbackText(`TESTADA MORTÍFERA! ${athleteHeight}cm de puro perigo aéreo guardando na rede! ⚽`);
            sound.playGoal();
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#10b981', '#fbbf24', '#ffffff'],
            });
            onGoalRef.current?.(0.45);
          } else {
            s.state = 'out';
            setHeaderState('out');
            setFeedbackText('Cabeceou pra fora! Passou tirando tinta da trave!');
            sound.playWhistle();
            onMissRef.current?.();
          }
        }
      } else if (s.netStretch > 0) {
        s.netStretch = Math.max(0, s.netStretch - 0.35);
      }

      drawPitchBackground(ctx, w, h, 32);

      // Linha de fundo/gol, pequena área e grande área partindo da linha do gol
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(12, goalBottom);
      ctx.lineTo(w - 12, goalBottom);
      ctx.stroke();
      ctx.strokeRect(95, goalBottom, 370, 170);
      ctx.strokeRect(180, goalBottom, 200, 58);

      drawGoalWithNet(ctx, goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop, s.netStretch);

      // Alvo no gol
      if (s.state === 'incoming') {
        ctx.save();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.aimX, 74, 11, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Goleiro em cima da linha do gol
      drawCartoonPlayer(ctx, s.gkX, goalBottom - 8, {
        jerseyColor: '#f59e0b',
        shortsColor: '#0f172a',
        gloveColor: '#22c55e',
        label: 'GOL',
        labelColor: '#fde68a',
        divingTilt: s.gkTilt,
      });

      // Zona Dourada do Sweet Spot
      const sweetX = s.playerX;
      const sweetY = s.playerBaseY - 56;
      const ballDrawY = s.ball.y - s.ball.z * 0.7;
      const isSweetNow =
        s.state === 'incoming' &&
        Math.hypot(s.ball.x - sweetX, ballDrawY - sweetY) <= timingTolerance * 1.35;

      ctx.save();
      ctx.beginPath();
      ctx.arc(sweetX, sweetY, timingTolerance, 0, Math.PI * 2);
      ctx.fillStyle = isSweetNow ? 'rgba(16, 185, 129, 0.32)' : 'rgba(234, 179, 8, 0.2)';
      ctx.fill();
      ctx.strokeStyle = isSweetNow ? '#34d399' : '#facc15';
      ctx.lineWidth = isSweetNow ? 3 : 2;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.restore();

      // Atacante saltando
      drawCartoonPlayer(ctx, s.playerX, s.playerBaseY - s.jumpY, {
        jerseyColor: '#10b981',
        shortsColor: '#0f172a',
        label: 'VOCÊ',
        labelColor: '#6ee7b7',
        scale: 1.12,
      });

      // Bola com elevação
      drawStyledBall(ctx, s.ball.x, s.ball.y, 9, s.ball.z * 0.7, s.trail);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [athleteHeight, timingTolerance]);

  const handleHeaderJump = () => {
    const s = simRef.current;
    if (s.state !== 'incoming') return;

    s.jumpVy = 9.5;
    const ballDrawY = s.ball.y - s.ball.z * 0.7;
    const distToSweetSpot = Math.hypot(s.ball.x - s.playerX, ballDrawY - (s.playerBaseY - 56));

    if (distToSweetSpot <= timingTolerance * 1.45) {
      s.state = 'jumping';
      setHeaderState('jumping');
      sound.playKick();

      s.ball.vx = (s.aimX - s.ball.x) / 14;
      s.ball.vy = (76 - s.ball.y) / 14;
      s.ball.vz = -1.2;
    } else {
      s.state = 'out';
      setHeaderState('out');
      setFeedbackText('Subiu fora de hora! O cabeceio saiu mascado pela linha de fundo.');
      sound.playWhistle();
      onMissRef.current?.();
    }
  };

  const handleCanvasTap = (clientX: number, clientY: number) => {
    const s = simRef.current;
    if (s.state !== 'incoming' || !canvasRef.current) return;
    const { x, y } = getCanvasPointerCoords(canvasRef.current, clientX, clientY);
    if (y <= 165) {
      setAimX(Math.max(145, Math.min(415, x)));
    } else {
      handleHeaderJump();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            👤
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Cruzamento Aéreo • Cabeceio
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                  isGiant
                    ? 'bg-amber-500 text-zinc-950'
                    : isTall
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {athleteHeight}cm {isGiant ? '• Bônus +40% 🦒' : isTall ? '• Bônus +25% ⬆️' : ''}
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Toque no gol para mirar e no botão quando a bola entrar na zona!
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
          onClick={(e) => handleCanvasTap(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              e.preventDefault();
              handleCanvasTap(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="w-full h-full cursor-pointer touch-none"
        />

        {headerState !== 'incoming' && headerState !== 'jumping' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {headerState === 'goal' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Testada Fulminante!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Cabeceio Desperdiçado</h4>
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
                  <RotateCcw className="w-3.5 h-3.5" /> Novo Cruzamento
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black text-muted-foreground uppercase">Canto:</span>
          <button
            type="button"
            onClick={() => setAimX(175)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              aimX <= 220 ? 'bg-emerald-500 text-zinc-950' : 'bg-secondary text-muted-foreground'
            }`}
          >
            ⬅️ Esquerdo
          </button>
          <button
            type="button"
            onClick={() => setAimX(385)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              aimX >= 340 ? 'bg-emerald-500 text-zinc-950' : 'bg-secondary text-muted-foreground'
            }`}
          >
            ➡️ Direito
          </button>
        </div>

        <button
          type="button"
          disabled={headerState !== 'incoming'}
          onClick={handleHeaderJump}
          className="w-full sm:w-auto py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
          SUBIR DE CABEÇA AGORA!
        </button>
      </div>
    </div>
  );
}
