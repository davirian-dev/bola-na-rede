'use client';

import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { Flame, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { BallImpactSelector, BallImpact } from './BallImpactSelector';

interface NSSLongShotMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
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
  matchInfo,
}: NSSLongShotMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  const [shotResult, setShotResult] = useState<'aiming' | 'shooting' | 'goal' | 'saved' | 'blocked' | 'out'>('aiming');
  const [feedbackText, setFeedbackText] = useState('Os zagueiros estão chegando! Mire rápido e solte a bomba!');
  const [power, setPower] = useState<number>(65);
  const [impact, setImpact] = useState<BallImpact>({ x: 0, y: -0.2 }); // Pancada seca rasteira/meia altura
  const [targetAim, setTargetAim] = useState<{ x: number; y: number }>({ x: 380, y: 110 });

  // Posição dos Zagueiros Fechando em Ângulo
  const defender1Ref = useRef<{ x: number; y: number; speed: number }>({ x: 150, y: 220, speed: 2.2 });
  const defender2Ref = useRef<{ x: number; y: number; speed: number }>({ x: 410, y: 220, speed: 2.4 });

  const ballPosRef = useRef<{ x: number; y: number; z: number; vx: number; vy: number; vz: number }>({
    x: 280,
    y: 340,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
  });

  // Loop de animação dos defensores fechando enquanto você mira
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gramado
      const grassGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grassGrad.addColorStop(0, '#15803d');
      grassGrad.addColorStop(1, '#14532d');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gol ao fundo
      const goalLeft = 140;
      const goalRight = 420;
      const goalTop = 60;
      const goalBottom = 160;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.strokeRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);

      // Goleiro
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(280, 135, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(270, 145, 20, 24);

      // Movimentação dos zagueiros fechando em direção à bola
      const def1 = defender1Ref.current;
      const def2 = defender2Ref.current;

      if (shotResult === 'aiming') {
        // Zagueiro 1 corre em diagonal
        const angle1 = Math.atan2(340 - def1.y, 280 - def1.x);
        def1.x += Math.cos(angle1) * def1.speed;
        def1.y += Math.sin(angle1) * def1.speed;

        // Zagueiro 2 corre em diagonal
        const angle2 = Math.atan2(340 - def2.y, 280 - def2.x);
        def2.x += Math.cos(angle2) * def2.speed;
        def2.y += Math.sin(angle2) * def2.speed;

        // Se algum zagueiro chegar na bola antes do chute
        const dist1 = Math.hypot(def1.x - 280, def1.y - 340);
        const dist2 = Math.hypot(def2.x - 280, def2.y - 340);

        if (dist1 < 25 || dist2 < 25) {
          setShotResult('blocked');
          setFeedbackText('DESARMADO! O zagueiro chegou de carrinho antes do seu chute!');
          sound.play('whistle');
          if (onMiss) onMiss();
          return;
        }
      }

      // Desenha Zagueiro 1
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(def1.x, def1.y - 20, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(def1.x - 8, def1.y - 10, 16, 24);

      // Desenha Zagueiro 2
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(def2.x, def2.y - 20, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(def2.x - 8, def2.y - 10, 16, 24);

      // Mira
      if (shotResult === 'aiming') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetAim.x, targetAim.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.beginPath();
        ctx.moveTo(280, 340);
        ctx.lineTo(targetAim.x, targetAim.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Bola em Voo
      const ball = ballPosRef.current;
      if (shotResult === 'shooting') {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.z += ball.vz;
        ball.vz -= 0.22;

        // Checagem de Trave e Gol (Y <= 160)
        if (ball.y <= 160) {
          const isInsideWidth = ball.x >= goalLeft + 6 && ball.x <= goalRight - 6;
          const isInsideHeight = ball.y >= goalTop && ball.z >= 0 && ball.z <= 65;

          if (isInsideWidth && isInsideHeight) {
            setShotResult('goal');
            setFeedbackText('POMBO SEM ASA! Uma verdadeira bomba indefensável no ângulo! 🔥');
            sound.play('goal');
            confetti({
              particleCount: 85,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#10b981', '#ef4444', '#ffffff'],
            });
            if (onScoreGoal) onScoreGoal(0.5);
          } else {
            setShotResult('out');
            setFeedbackText('Subiu demais! O chute explodiu na arquibancada!');
            sound.play('whistle');
            if (onMiss) onMiss();
          }
          return;
        }
      }

      // Desenha Bola
      ctx.beginPath();
      ctx.arc(ball.x, ball.y - ball.z, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (shotResult === 'aiming' || shotResult === 'shooting') {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [shotResult, targetAim, onScoreGoal, onMiss]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (shotResult !== 'aiming') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setTargetAim({
      x: Math.max(130, Math.min(430, x)),
      y: Math.max(55, Math.min(170, y)),
    });
  };

  const handleShoot = () => {
    if (shotResult !== 'aiming') return;
    setShotResult('shooting');
    sound.play('kick');

    const dx = (targetAim.x - 280) / 16;
    const dy = -11.5 * (power / 55);
    const dz = 3.8 + impact.y * 2.5;

    ballPosRef.current = {
      x: 280,
      y: 340,
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
              Mire e solte a pancada antes que os zagueiros travem o chute!
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
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          onClick={handleCanvasClick}
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
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Chute Bloqueado</h4>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4 pt-3 border-t border-border">
        <div className="flex flex-col items-center">
          <BallImpactSelector value={impact} onChange={setImpact} disabled={shotResult !== 'aiming'} size="sm" />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black mb-1.5">
              <span className="text-muted-foreground uppercase text-[10px]">Força da Pancada:</span>
              <span className="font-mono text-rose-400 font-extrabold">{power}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              disabled={shotResult !== 'aiming'}
              className="w-full accent-rose-500"
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
