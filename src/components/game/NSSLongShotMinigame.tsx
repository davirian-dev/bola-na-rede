'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Flame, CheckCircle2, XCircle, ShieldAlert, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { BallImpactSelector, BallImpact } from './BallImpactSelector';
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

interface NSSLongShotMinigameProps {
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

export function NSSLongShotMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  divisionOverride,
  opponentOverall,
  matchInfo,
}: NSSLongShotMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balance = useMinigameBalance({
    division: divisionOverride,
    opponentOverall,
  });
  const balanceRef = useRef(balance);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  const [shotResult, setShotResult] = useState<'aiming' | 'shooting' | 'goal' | 'saved' | 'blocked' | 'out'>('aiming');
  const [feedbackText, setFeedbackText] = useState('Os zagueiros estão fechando! Mire no gol e solte a bomba!');
  const [power, setPower] = useState<number>(72);
  const [impact, setImpact] = useState<BallImpact>({ x: 0, y: -0.2 });

  const onGoalRef = useRef(onScoreGoal);
  const onMissRef = useRef(onMiss);

  useEffect(() => {
    onGoalRef.current = onScoreGoal;
    onMissRef.current = onMiss;
  }, [onScoreGoal, onMiss]);

  const simRef = useRef({
    state: 'aiming' as 'aiming' | 'shooting' | 'goal' | 'saved' | 'blocked' | 'out',
    aim: { x: 375, y: 74 },
    impact: { x: 0, y: -0.2 },
    def1: { x: 145, y: 215, speed: 1.55 },
    def2: { x: 415, y: 215, speed: 1.65 },
    gk: { x: 280, tilt: 0 },
    ball: { x: 280, y: 335, z: 0, vx: 0, vy: 0, vz: 0 },
    trail: [] as { x: number; y: number; z: number }[],
    shake: 0,
    netStretch: 0,
  });

  useEffect(() => {
    simRef.current.impact = impact;
  }, [impact]);

  const resetPlay = useCallback(() => {
    simRef.current = {
      state: 'aiming',
      aim: { x: 375, y: 74 },
      impact,
      def1: { x: 145, y: 215, speed: 1.55 },
      def2: { x: 415, y: 215, speed: 1.65 },
      gk: { x: 280, tilt: 0 },
      ball: { x: 280, y: 335, z: 0, vx: 0, vy: 0, vz: 0 },
      trail: [],
      shake: 0,
      netStretch: 0,
    };
    setShotResult('aiming');
    setFeedbackText('Os zagueiros estão fechando! Mire no gol e solte a bomba!');
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
      const goalBottom = 106; // Linha do gol!

      ctx.save();
      if (s.shake > 0) {
        applyScreenShake(ctx, s.shake);
        s.shake = Math.max(0, s.shake - 0.45);
      }

      if (s.state === 'aiming') {
        const gkSpd = 0.0035 * balanceRef.current.keeperSpeedMult;
        const gkAmp = 32 * Math.max(0.78, Math.min(1.25, balanceRef.current.keeperSpeedMult));
        s.gk.x = 280 + Math.sin(Date.now() * gkSpd) * gkAmp;

        const defSpdMult = balanceRef.current.defenderSpeedMult;
        const a1 = Math.atan2(335 - s.def1.y, 280 - s.def1.x);
        s.def1.x += Math.cos(a1) * s.def1.speed * defSpdMult;
        s.def1.y += Math.sin(a1) * s.def1.speed * defSpdMult;

        const a2 = Math.atan2(335 - s.def2.y, 280 - s.def2.x);
        s.def2.x += Math.cos(a2) * s.def2.speed * defSpdMult;
        s.def2.y += Math.sin(a2) * s.def2.speed * defSpdMult;

        if (
          Math.hypot(s.def1.x - 280, s.def1.y - 335) < 26 ||
          Math.hypot(s.def2.x - 280, s.def2.y - 335) < 26
        ) {
          s.state = 'blocked';
          setShotResult('blocked');
          setFeedbackText('DESARMADO! O zagueiro travou na hora H!');
          sound.playWhistle();
          onMissRef.current?.();
        }
      } else if (s.state === 'shooting') {
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        s.ball.z = Math.max(0, s.ball.z + s.ball.vz);
        s.ball.vz -= 0.2;
        s.ball.vx += s.impact.x * 0.25;

        const gkDir = s.aim.x < s.gk.x ? -1 : 1;
        s.gk.x += gkDir * 2.4;
        s.gk.tilt = gkDir * 0.45;

        s.trail.push({ x: s.ball.x, y: s.ball.y, z: s.ball.z });
        if (s.trail.length > 10) s.trail.shift();

        // Bloqueio no caminho pelos zagueiros
        if (
          Math.hypot(s.ball.x - s.def1.x, s.ball.y - s.def1.y) < 18 && s.ball.z < 26 ||
          Math.hypot(s.ball.x - s.def2.x, s.ball.y - s.def2.y) < 18 && s.ball.z < 26
        ) {
          s.state = 'blocked';
          s.shake = 5;
          setShotResult('blocked');
          setFeedbackText('BLOQUEADO! A bomba explodiu na marcação!');
          sound.playWoodwork();
          onMissRef.current?.();
        } else if (s.ball.y <= goalBottom) {
          const hitPost =
            Math.abs(s.ball.x - goalLeft) < 10 || Math.abs(s.ball.x - goalRight) < 10;
          const distToGk = Math.abs(s.ball.x - s.gk.x);
          const isInsideWidth = s.ball.x >= goalLeft + 8 && s.ball.x <= goalRight - 8;
          const isInsideHeight = s.ball.z >= 0 && s.ball.z <= 66;

          if (hitPost) {
            s.state = 'out';
            s.shake = 9;
            setShotResult('out');
            setFeedbackText('NO TRAVESSÃO / TRAVE! Quase um golaço histórico!');
            sound.playWoodwork();
            onMissRef.current?.();
          } else if (distToGk < 22 * Math.max(0.75, Math.min(1.28, balanceRef.current.keeperSpeedMult)) && s.ball.z < 40) {
            s.state = 'saved';
            s.shake = 4;
            setShotResult('saved');
            setFeedbackText('DEFESAÇA! O goleiro voou para espalmar o foguete!');
            sound.playWoodwork();
            onMissRef.current?.();
          } else if (isInsideWidth && isInsideHeight) {
            s.state = 'goal';
            s.netStretch = 12;
            s.shake = 8;
            setShotResult('goal');
            setFeedbackText('POMBO SEM ASA! Bomba indefensável no ângulo! 🔥');
            sound.playGoal();
            confetti({
              particleCount: 85,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#10b981', '#ef4444', '#ffffff'],
            });
            onGoalRef.current?.(0.5);
          } else {
            s.state = 'out';
            setShotResult('out');
            setFeedbackText('Subiu demais! A bomba foi parar na arquibancada!');
            sound.playWhistle();
            onMissRef.current?.();
          }
        }
      } else if (s.netStretch > 0) {
        s.netStretch = Math.max(0, s.netStretch - 0.35);
      }

      drawPitchBackground(ctx, w, h, 32);

      // Linha de fundo/gol, grande área e meia-lua
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(12, goalBottom);
      ctx.lineTo(w - 12, goalBottom);
      ctx.stroke();
      ctx.strokeRect(90, goalBottom, 380, 144);
      ctx.beginPath();
      ctx.arc(280, goalBottom + 144, 48, 0, Math.PI);
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

      // Zagueiros fechando
      drawCartoonPlayer(ctx, s.def1.x, s.def1.y, {
        jerseyColor: '#dc2626',
        shortsColor: '#ffffff',
        label: 'ZAG',
        labelColor: '#fca5a5',
      });
      drawCartoonPlayer(ctx, s.def2.x, s.def2.y, {
        jerseyColor: '#dc2626',
        shortsColor: '#ffffff',
        label: 'ZAG',
        labelColor: '#fca5a5',
      });

      // Atacante atrás da bola
      drawCartoonPlayer(ctx, 258, 344, {
        jerseyColor: '#10b981',
        shortsColor: '#0f172a',
        label: 'VOCÊ',
        labelColor: '#6ee7b7',
        scale: 1.05,
      });

      // Mira & prévia de curva
      if (s.state === 'aiming') {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(s.aim.x, s.aim.y, 13, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
        ctx.beginPath();
        ctx.moveTo(s.ball.x, s.ball.y);
        const midX = (s.ball.x + s.aim.x) / 2 + s.impact.x * 40;
        const midY = (s.ball.y + s.aim.y) / 2;
        ctx.quadraticCurveTo(midX, midY, s.aim.x, s.aim.y);
        ctx.stroke();
        ctx.restore();
      }

      drawStyledBall(ctx, s.ball.x, s.ball.y, 9, s.ball.z, s.trail, '239, 68, 68');

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const updateAim = (clientX: number, clientY: number) => {
    const s = simRef.current;
    if (s.state !== 'aiming' || !canvasRef.current) return;
    const { x, y } = getCanvasPointerCoords(canvasRef.current, clientX, clientY);
    s.aim = {
      x: Math.max(135, Math.min(425, x)),
      y: Math.max(28, Math.min(110, y)),
    };
  };

  const handleShoot = () => {
    const s = simRef.current;
    if (s.state !== 'aiming') return;
    s.state = 'shooting';
    s.trail = [];
    setShotResult('shooting');
    sound.playKickPower(power);

    const dx = (s.aim.x - 280) / 16;
    const dy = -11.5 * (power / 58);
    const dz = 3.5 + impact.y * 2.5;

    s.ball = {
      x: 280,
      y: 335,
      z: 0,
      vx: dx,
      vy: dy,
      vz: dz,
    };
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
            💥
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Chute de Fora da Área • 26m
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold uppercase flex items-center gap-1">
                <ShieldAlert className="w-2.5 h-2.5" /> Pressão Rápida
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Arraste ou toque no gol para mirar e solte a bomba!
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
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Pombo Sem Asa!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Lance Desperdiçado</h4>
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
                  <RotateCcw className="w-3.5 h-3.5" /> Novo Chute
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
              <span className="text-muted-foreground uppercase text-[10px]">Força da Pancada:</span>
              <span className="font-mono text-rose-400 font-extrabold">{power}%</span>
            </div>
            <input
              type="range"
              min="45"
              max="100"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              disabled={shotResult !== 'aiming'}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <button
            type="button"
            disabled={shotResult !== 'aiming'}
            onClick={handleShoot}
            className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4" />
            SOLTAR A BOMBA!
          </button>
        </div>
      </div>
    </div>
  );
}
