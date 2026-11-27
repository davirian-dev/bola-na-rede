'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Flame, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { BallImpactSelector, BallImpact } from './BallImpactSelector';
import { MatchWeatherType } from '@/types/game';
import {
  drawPitchBackground,
  drawGoalWithNet,
  drawCartoonPlayer,
  drawStyledBall,
  getCanvasPointerCoords,
} from '@/lib/minigameCanvas';
import { applyScreenShake } from '@/engine/ballPhysics';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from './DifficultyBadge';

interface NSSFreeKickMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
  mode?: 'training' | 'match_clutch';
  weather?: MatchWeatherType;
  divisionOverride?: Division;
  opponentOverall?: number;
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export function NSSFreeKickMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  mode = 'training',
  weather = 'sunny',
  divisionOverride,
  opponentOverall,
  matchInfo,
}: NSSFreeKickMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balance = useMinigameBalance({
    division: divisionOverride,
    opponentOverall,
  });
  const balanceRef = useRef(balance);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  const [distanceMeters] = useState<number>(() => Math.floor(Math.random() * 11) + 20);
  const [windKnots] = useState<number>(() => {
    if (weather === 'windy') return Math.floor(Math.random() * 7) - 3;
    return Math.floor(Math.random() * 3) - 1;
  });

  const [shotResult, setShotResult] = useState<'aiming' | 'shooting' | 'goal' | 'saved' | 'woodwork' | 'blocked' | 'out'>('aiming');
  const [feedbackText, setFeedbackText] = useState('Ajuste o efeito, toque no gol para mirar e trave a potência!');
  const [power, setPower] = useState<number>(60);
  const [powerLocked, setPowerLocked] = useState<boolean>(false);
  const [impact, setImpact] = useState<BallImpact>({ x: 0.35, y: 0.4 });

  const onGoalRef = useRef(onScoreGoal);
  const onMissRef = useRef(onMiss);

  useEffect(() => {
    onGoalRef.current = onScoreGoal;
    onMissRef.current = onMiss;
  }, [onScoreGoal, onMiss]);

  const simRef = useRef({
    state: 'aiming' as 'aiming' | 'shooting' | 'goal' | 'saved' | 'woodwork' | 'blocked' | 'out',
    aim: { x: 205, y: 74 },
    impact: { x: 0.35, y: 0.4 },
    wallJumpOffset: 0,
    gk: { x: 310, tilt: 0, targetDiveX: 310 },
    ball: { x: 280, y: 338, z: 0, vx: 0, vy: 0, vz: 0 },
    trail: [] as { x: number; y: number; z: number }[],
    shake: 0,
    netStretch: 0,
  });

  useEffect(() => {
    simRef.current.impact = impact;
  }, [impact]);

  // Barra de força oscilando continuamente
  useEffect(() => {
    if (shotResult !== 'aiming' || powerLocked) return;
    let dir = 1;
    const interval = setInterval(() => {
      setPower((p) => {
        let next = p + dir * (3.8 * balanceRef.current.powerBarSpeedMult);
        if (next >= 100) {
          next = 100;
          dir = -1;
        } else if (next <= 12) {
          next = 12;
          dir = 1;
        }
        return Math.round(next);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [shotResult, powerLocked]);

  const resetPlay = useCallback(() => {
    simRef.current = {
      state: 'aiming',
      aim: { x: 205, y: 74 },
      impact,
      wallJumpOffset: 0,
      gk: { x: 310, tilt: 0, targetDiveX: 310 },
      ball: { x: 280, y: 338, z: 0, vx: 0, vy: 0, vz: 0 },
      trail: [],
      shake: 0,
      netStretch: 0,
    };
    setPowerLocked(false);
    setShotResult('aiming');
    setFeedbackText('Ajuste o efeito, toque no gol para mirar e trave a potência!');
  }, [impact]);

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
      const goalLeft = 140;
      const goalRight = 420;
      const goalTop = 24;
      const goalBottom = 108; // Linha do gol!

      ctx.save();
      if (s.shake > 0) {
        applyScreenShake(ctx, s.shake);
        s.shake = Math.max(0, s.shake - 0.45);
      }

      if (s.state === 'shooting') {
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        s.ball.z = Math.max(0, s.ball.z + s.ball.vz);
        s.ball.vz -= 0.17;
        s.ball.vx += s.impact.x * 0.34 + windKnots * 0.06;

        if (s.wallJumpOffset < 22) s.wallJumpOffset += 2.2;

        // Goleiro salta em direção ao chute (calibrado por OVR × Liga)
        const gkDiff = s.gk.targetDiveX - s.gk.x;
        s.gk.x += gkDiff * (0.085 * balanceRef.current.keeperSpeedMult);
        s.gk.tilt = Math.sign(gkDiff) * 0.45;

        s.trail.push({ x: s.ball.x, y: s.ball.y, z: s.ball.z });
        if (s.trail.length > 10) s.trail.shift();

        // Colisão com a barreira (4 jogadores em x = 218..302, y = 242)
        if (s.ball.y <= 252 && s.ball.y >= 232 && s.ball.z < 28 && s.ball.x >= 210 && s.ball.x <= 312) {
          s.state = 'blocked';
          s.shake = 5;
          setShotResult('blocked');
          setFeedbackText('Na barreira! A falta explodiu nos defensores!');
          sound.playWoodwork();
          onMissRef.current?.();
        } else if (s.ball.y <= goalBottom) {
          const hitPost =
            Math.abs(s.ball.x - goalLeft) < 10 || Math.abs(s.ball.x - goalRight) < 10;
          const distToGk = Math.abs(s.ball.x - s.gk.x);
          const isInsideWidth = s.ball.x >= goalLeft + 8 && s.ball.x <= goalRight - 8;
          const isInsideHeight = s.ball.z >= 0 && s.ball.z <= 64;

          if (hitPost) {
            s.state = 'woodwork';
            s.shake = 9;
            setShotResult('woodwork');
            setFeedbackText('NO ÂNGULO DA TRAVE! Explodiu no ferro!');
            sound.playWoodwork();
            onMissRef.current?.();
          } else if (distToGk < 22 * Math.max(0.72, Math.min(1.3, balanceRef.current.keeperSpeedMult)) && s.ball.z < 46) {
            s.state = 'saved';
            s.shake = 4;
            setShotResult('saved');
            setFeedbackText('DEFESA ESPETACULAR! O goleiro voou e espalmou a falta!');
            sound.playWoodwork();
            onMissRef.current?.();
          } else if (isInsideWidth && isInsideHeight) {
            s.state = 'goal';
            s.netStretch = 12;
            s.shake = 6;
            setShotResult('goal');
            setFeedbackText('GOLAÇO DE FALTA! Bola na gaveta com efeito indefensável! 🔥');
            sound.playGoal();
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#10b981', '#fbbf24', '#ffffff'],
            });
            onGoalRef.current?.(0.6);
          } else {
            s.state = 'out';
            setShotResult('out');
            setFeedbackText('Pra fora! A cobrança passou raspando o travessão!');
            sound.playWhistle();
            onMissRef.current?.();
          }
        }
      } else if (s.netStretch > 0) {
        s.netStretch = Math.max(0, s.netStretch - 0.35);
      }

      drawPitchBackground(ctx, w, h, 32);

      // Linha de fundo/gol, pequena área, grande área e meia-lua
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(12, goalBottom);
      ctx.lineTo(w - 12, goalBottom);
      ctx.stroke();
      ctx.strokeRect(185, goalBottom, 190, 52);
      ctx.strokeRect(90, goalBottom, 380, 142);
      ctx.beginPath();
      ctx.arc(280, goalBottom + 142, 48, 0, Math.PI);
      ctx.stroke();

      drawGoalWithNet(ctx, goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop, s.netStretch);

      // Goleiro em cima da linha do gol
      drawCartoonPlayer(ctx, s.gk.x, goalBottom - 8, {
        jerseyColor: '#f59e0b',
        shortsColor: '#0f172a',
        gloveColor: '#22c55e',
        label: 'GOL',
        labelColor: '#fde68a',
        divingTilt: s.gk.tilt,
      });

      // Barreira (4 bonequinhos)
      for (let i = 0; i < 4; i++) {
        const wx = 218 + i * 28;
        drawCartoonPlayer(ctx, wx, 242 - s.wallJumpOffset, {
          jerseyColor: '#dc2626',
          shortsColor: '#ffffff',
          scale: 0.95,
        });
      }

      // Cobrador (Você)
      drawCartoonPlayer(ctx, 252, 345, {
        jerseyColor: '#10b981',
        shortsColor: '#0f172a',
        label: 'VOCÊ',
        labelColor: '#6ee7b7',
        scale: 1.08,
      });

      // Mira com prévia da curva
      if (s.state === 'aiming') {
        ctx.save();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(s.aim.x, s.aim.y, 13, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
        ctx.beginPath();
        ctx.moveTo(s.ball.x, s.ball.y);
        const curveMidX = (s.ball.x + s.aim.x) / 2 + s.impact.x * 46;
        const curveMidY = (s.ball.y + s.aim.y) / 2 - s.impact.y * 28;
        ctx.quadraticCurveTo(curveMidX, curveMidY, s.aim.x, s.aim.y);
        ctx.stroke();
        ctx.restore();
      }

      drawStyledBall(ctx, s.ball.x, s.ball.y, 9, s.ball.z, s.trail);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [windKnots]);

  const updateAim = (clientX: number, clientY: number) => {
    const s = simRef.current;
    if (s.state !== 'aiming' || !canvasRef.current) return;
    const { x, y } = getCanvasPointerCoords(canvasRef.current, clientX, clientY);
    s.aim = {
      x: Math.max(132, Math.min(428, x)),
      y: Math.max(26, Math.min(112, y)),
    };
  };

  const handleKick = () => {
    const s = simRef.current;
    if (s.state !== 'aiming') return;
    setPowerLocked(true);
    s.state = 'shooting';
    s.trail = [];
    setShotResult('shooting');
    sound.playKickPower(power);

    // Goleiro tenta adivinhar o canto
    const predictedX = s.aim.x + s.impact.x * 38;
    const guess = Math.random() < 0.45 ? predictedX : s.aim.x < 280 ? 350 : 210;
    s.gk.targetDiveX = Math.max(goalLeftClamp(165), Math.min(395, guess));

    const dx = (s.aim.x - 280) / 22;
    const dy = -8.8 * (power / 60);
    const dz = 4.0 + impact.y * 3.1;

    s.ball = { x: 280, y: 338, z: 0, vx: dx, vy: dy, vz: dz };
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            🎯
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Cobrança de Falta • {distanceMeters}m
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase">
                Estilo NSS
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Vento: {windKnots > 0 ? `➡️ +${windKnots} nós` : windKnots < 0 ? `⬅️ ${windKnots} nós` : 'Calmo 🍃'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <DifficultyBadge balance={balance} compact />
          {matchInfo && (
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-secondary text-foreground">
              {matchInfo.oppClubName} • {matchInfo.minute}&apos; ({matchInfo.currentScore})
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[560/380] bg-zinc-950 rounded-2xl overflow-hidden border border-border/60 shadow-inner">
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          onClick={(e) => updateAim(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              e.preventDefault();
              updateAim(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              e.preventDefault();
              updateAim(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {shotResult !== 'aiming' && shotResult !== 'shooting' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {shotResult === 'goal' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Golaço de Falta!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Cobrança Desperdiçada</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {mode === 'training' && (
                <button
                  type="button"
                  onClick={resetPlay}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Nova Falta
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4 pt-3 border-t border-border">
        <div className="flex flex-col items-center">
          <BallImpactSelector value={impact} onChange={setImpact} disabled={shotResult !== 'aiming'} size="sm" />
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between text-xs font-black mb-1.5">
              <span className="text-muted-foreground uppercase text-[10px]">Potência do Chute:</span>
              <span
                className={`font-mono ${
                  power > 85 ? 'text-rose-400' : power > 55 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {power}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-800 border border-border/70 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-75 ${
                  power > 85 ? 'bg-rose-500' : power > 55 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${power}%` }}
              />
              <div className="absolute top-0 bottom-0 left-[62%] w-0.5 bg-white/50" />
            </div>
          </div>

          <button
            type="button"
            disabled={shotResult !== 'aiming'}
            onClick={handleKick}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4" />
            BATER COM EFEITO ({power}%)
          </button>
        </div>
      </div>
    </div>
  );
}

function goalLeftClamp(min: number) {
  return min;
}
