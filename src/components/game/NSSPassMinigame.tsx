'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { playWhistle, playGoal, playKick } from '@/lib/soundEffects';
import { renderBallWithShadow } from '@/engine/ballPhysics';
import { drawCartoonPlayer, drawGoalWithNet } from '@/lib/minigameCanvas';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from './DifficultyBadge';
import { 
  RotateCcw, 
  Zap
} from 'lucide-react';

interface NSSPassMinigameProps {
  onCompletePass?: (assistBonus: number) => void;
  onInterception?: () => void;
  onClose?: () => void;
  mode?: 'training' | 'match_clutch';
  teammateName?: string;
  divisionOverride?: Division;
  opponentOverall?: number;
}

export function NSSPassMinigame({
  onCompletePass,
  onInterception,
  onClose,
  mode = 'training',
  teammateName = 'Companheiro',
  divisionOverride,
  opponentOverall,
}: NSSPassMinigameProps) {
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

  const skinToneColor = {
    1: '#fce7d2',
    2: '#f5cba7',
    3: '#c68b59',
    4: '#8d5524',
    5: '#402414',
  }[playerProfile?.skinTone || 3] || '#c68b59';

  const safeTeammateName = teammateName.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').slice(0, 10) || 'Companheiro';

  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [passResult, setPassResult] = useState<'idle' | 'aiming' | 'passing' | 'assist' | 'intercepted' | 'out' | 'offside'>('idle');
  const [feedbackText, setFeedbackText] = useState('Toque ou arraste no campo para lançar a bola! Cuidado com a Linha de Impedimento 🚩!');
  const [power, setPower] = useState<number>(55); // Barra de Força 10% a 100%

  // Estado da simulação física em Canvas2D (declarado antes dos effects)
  const simRef = useRef({
    ball: { x: 200, y: 290, vx: 0, vy: 0, moving: false, radius: 7 },
    passer: { x: 200, y: 300, radius: 10 },
    receiver: { x: 90, y: 155, targetX: 310, targetY: 155, vx: 1.4, vy: 0.5, radius: 10, reachedBall: false },
    defenders: [
      { x: 160, y: 190, vx: 1.1, minX: 110, maxX: 230, radius: 11 },
      { x: 270, y: 170, vx: -1.2, minX: 200, maxX: 330, radius: 11 },
    ],
    wasOffsideAtKick: false,
    aim: { active: false, startX: 200, startY: 290, targetX: 200, targetY: 130 },
  });

  // Oscilação Contínua da Barra de Força
  useEffect(() => {
    if (passResult === 'passing') return;

    let dir = 1;
    const interval = setInterval(() => {
      if (simRef.current.ball.moving) return;
      setPower((p) => {
        let next = p + dir * (3.5 * balanceRef.current.powerBarSpeedMult);
        if (next >= 100) {
          next = 100;
          dir = -1;
        } else if (next <= 10) {
          next = 10;
          dir = 1;
        }
        return Math.round(next);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [passResult]);

  const resetPass = useCallback(() => {
    const s = simRef.current;
    s.ball = { x: 200, y: 290, vx: 0, vy: 0, moving: false, radius: 7 };
    s.receiver = { x: 80, y: 150, targetX: 320, targetY: 150, vx: 1.4, vy: 0.5, radius: 10, reachedBall: false };
    s.defenders = [
      { x: 150, y: 190, vx: 1.1, minX: 100, maxX: 220, radius: 11 },
      { x: 260, y: 175, vx: -1.2, minX: 190, maxX: 320, radius: 11 },
    ];
    s.wasOffsideAtKick = false;
    s.aim.active = false;
    setPassResult('idle');
    setFeedbackText('Antecipe a corrida do atacante e passe na frente dos zagueiros! Atenção à linha tracejada de impedimento 🚩');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = simRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Gramado Verde Estilo New Star Soccer
      ctx.fillStyle = '#065f46';
      ctx.fillRect(0, 0, width, height);

      // Faixas de grama
      const stripeH = 30;
      for (let y = 0; y < height; y += stripeH * 2) {
        ctx.fillStyle = '#047857';
        ctx.fillRect(0, y, width, stripeH);
      }

      // Linhas da Grande Área e Gol no Topo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(10, 26);
      ctx.lineTo(width - 10, 26);
      ctx.stroke();
      ctx.strokeRect(40, 26, width - 80, 118);
      ctx.strokeRect(120, 26, width - 240, 48);

      // Gol no topo com rede atrás da linha do gol (y = 26)
      drawGoalWithNet(ctx, 140, 2, 120, 24);

      // Goleiro adversário (Bonequinho na linha do gol)
      drawCartoonPlayer(ctx, 200, 24, {
        jerseyColor: '#f59e0b',
        shortsColor: '#0f172a',
        gloveColor: '#22c55e',
        scale: 0.78,
      });

      // 2. Movimentação dos Zagueiros (Patrulha calibrada por OVR × Liga)
      if (!s.ball.moving && passResult === 'idle') {
        s.defenders.forEach((def) => {
          def.x += def.vx * balanceRef.current.defenderSpeedMult;
          if (def.x > def.maxX || def.x < def.minX) def.vx *= -1;
        });

        // Movimentação do atacante (desmarcando em velocidade e buscando a linha)
        s.receiver.x += s.receiver.vx;
        s.receiver.y += s.receiver.vy;
        if (s.receiver.x > s.receiver.targetX || s.receiver.x < 70) s.receiver.vx *= -1;
        if (s.receiver.y > 185 || s.receiver.y < 125) s.receiver.vy *= -1;
      }

      // Linha de Impedimento Tática (Baseada na posição do penúltimo defensor / zagueiro mais recuado)
      const minDefY = Math.min(...s.defenders.map((d) => d.y));
      const isCurrentlyOffside = s.receiver.y < minDefY - 3;

      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = isCurrentlyOffside ? 'rgba(239, 68, 68, 0.85)' : 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.moveTo(30, minDefY);
      ctx.lineTo(width - 30, minDefY);
      ctx.stroke();

      // Tag de Status do Impedimento no Gramado
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = isCurrentlyOffside ? '#ef4444' : '#38bdf8';
      ctx.textAlign = 'right';
      ctx.fillText(
        isCurrentlyOffside ? '🚩 IMPEDIDO (ATACANTE ADIANTADO)' : '✓ POSIÇÃO LEGAL',
        width - 35,
        minDefY - 4
      );
      ctx.restore();

      // 3. Renderiza Zagueiros (Bonequinhos Vermelhos)
      s.defenders.forEach((def) => {
        drawCartoonPlayer(ctx, def.x, def.y, {
          jerseyColor: '#dc2626',
          shortsColor: '#ffffff',
          label: 'ZAG',
          labelColor: '#fca5a5',
          scale: 0.85,
        });
      });

      // 4. Renderiza Atacante / Receptor (Bonequinho Ciano)
      drawCartoonPlayer(ctx, s.receiver.x, s.receiver.y, {
        jerseyColor: '#06b6d4',
        shortsColor: '#0f172a',
        label: safeTeammateName,
        labelColor: '#67e8f9',
        scale: 0.88,
      });

      // Indicador de seta de corrida no atacante
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.receiver.x, s.receiver.y - 26);
      ctx.lineTo(s.receiver.x + s.receiver.vx * 14, s.receiver.y - 26);
      ctx.stroke();

      // 5. Renderiza Passador (Você - Bonequinho Verde)
      drawCartoonPlayer(ctx, s.passer.x, s.passer.y - 4, {
        jerseyColor: '#10b981',
        shortsColor: '#0f172a',
        skinColor: skinToneColor,
        label: 'VOCÊ',
        labelColor: '#6ee7b7',
        scale: 0.92,
      });

      // 6. Linha de Mira
      if (s.aim.active && !s.ball.moving) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(s.ball.x, s.ball.y);
        ctx.lineTo(s.aim.targetX, s.aim.targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ponto de destino da bola
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(s.aim.targetX, s.aim.targetY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.stroke();
      }

      // 7. Física da Bola em Movimento
      if (s.ball.moving) {
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        s.ball.vx *= 0.985;
        s.ball.vy *= 0.985;

        // O atacante corre em direção à trajetória da bola
        const dxRec = s.ball.x - s.receiver.x;
        const dyRec = s.ball.y - s.receiver.y;
        const distRec = Math.sqrt(dxRec * dxRec + dyRec * dyRec);
        if (distRec > 5) {
          s.receiver.x += (dxRec / distRec) * 2.2;
          s.receiver.y += (dyRec / distRec) * 2.2;
        }

        // Checa colisão com zagueiros (Interceptação)
        s.defenders.forEach((def) => {
          const ddx = s.ball.x - def.x;
          const ddy = s.ball.y - def.y;
          const distDef = Math.sqrt(ddx * ddx + ddy * ddy);
          if (distDef < def.radius + s.ball.radius && s.ball.moving) {
            s.ball.moving = false;
            setPassResult('intercepted');
            setAttempts((a) => a + 1);
            setFeedbackText('❌ Passe interceptado pela zaga adversária!');
            if (onInterception) onInterception();
          }
        });

        // Checa se o atacante alcançou a bola (Assistência ou Impedimento!)
        if (distRec < s.receiver.radius + s.ball.radius && s.ball.moving) {
          s.ball.moving = false;

          // Regra Oficial: se estava à frente no milésimo do lançamento -> IMPEDIMENTO!
          if (s.wasOffsideAtKick) {
            s.wasOffsideAtKick = false;
            setPassResult('offside');
            setAttempts((a) => a + 1);
            setFeedbackText(`🚩 IMPEDIMENTO MARCADO! ${teammateName} estava à frente da linha defensiva no momento do passe! Gol anulado!`);
            playWhistle();
            if (onInterception) onInterception();
          } else {
            setPassResult('assist');
            setAttempts((a) => a + 1);
            setSuccesses((s) => s + 1);
            setFeedbackText(`⚽ GOLAÇO! ${teammateName} recebeu em posição 100% legal e mandou no fundo da rede!`);
            playGoal();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.5 },
              colors: ['#10b981', '#fbbf24', '#ffffff'],
            });
            if (onCompletePass) onCompletePass(1.2);
          }
        }

        // Checa se saiu de campo
        if (s.ball.x < 10 || s.ball.x > width - 10 || s.ball.y < 10 || s.ball.y > height - 10) {
          if (s.ball.moving) {
            s.ball.moving = false;
            setPassResult('out');
            setAttempts((a) => a + 1);
            setFeedbackText('⚠️ A bola correu demais e saiu pela linha de fundo.');
            if (onInterception) onInterception();
          }
        }
      }

      // Renderiza a Bola Oficial Personalizada
      const activeBallId = playerProfile?.equippedBallId || (useGameStore.getState().equippedBallId) || 'classic_capotao';
      renderBallWithShadow(ctx, {
        x: s.ball.x,
        y: s.ball.y,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: s.ball.radius || 6,
        baseRadius: s.ball.radius || 6,
        spinCurve: 0,
        rotationAngle: 0,
        friction: 0.985,
        gravity: 0.25,
        shotType: 'medium',
        isOffTarget: false,
        inFlight: true,
        bouncedCount: 0,
        ballId: activeBallId,
        trailPoints: [],
        hasMotionTrail: false,
        screenShake: 0,
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [passResult, teammateName, onCompletePass, onInterception, playerProfile?.equippedBallId, safeTeammateName, skinToneColor]);

  // Controles de Toque e Mouse
  const handleAimStart = (clientX: number, clientY: number) => {
    if (passResult === 'passing' || simRef.current.ball.moving) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    simRef.current.aim.active = true;
    simRef.current.aim.targetX = x;
    simRef.current.aim.targetY = y;
    setPassResult('aiming');
  };

  const handleAimMove = (clientX: number, clientY: number) => {
    if (!simRef.current.aim.active || simRef.current.ball.moving) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    simRef.current.aim.targetX = x;
    simRef.current.aim.targetY = y;
  };

  const handleAimRelease = () => {
    const s = simRef.current;
    if (s.ball.moving) return;

    if (!s.aim.active) {
      // Se não mirou arrastando, passa na direção do atacante
      s.aim.targetX = s.receiver.x + 40;
      s.aim.targetY = s.receiver.y;
    }

    s.aim.active = false;
    const dx = s.aim.targetX - s.ball.x;
    const dy = s.aim.targetY - s.ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 15) {
      // Regra Oficial do Impedimento: Salva se o atacante estava adiantado no milésimo exato do passe
      const minDefY = Math.min(...s.defenders.map((d) => d.y));
      s.wasOffsideAtKick = s.receiver.y < minDefY - 3;
      playKick();

      let speedMult = 1.0;
      if (power > 88) {
        speedMult = 1.5;
        setFeedbackText(`⚠️ Muita força (${power}%)! O passe correu demais e saiu do alcance.`);
      } else if (power < 35) {
        speedMult = 0.6;
        setFeedbackText(`🐢 Pouca força (${power}%)! A bola parou no meio do caminho.`);
      } else {
        speedMult = 1.2;
        setFeedbackText(`🔥 Força perfeita em ${power}%! O passe foi açucarado.`);
      }

      const speed = Math.min(9.5, Math.max(3.0, dist * 0.045)) * speedMult;
      s.ball.vx = (dx / dist) * speed;
      s.ball.vy = (dy / dist) * speed;
      s.ball.moving = true;
      setPassResult('passing');
    } else {
      setPassResult('idle');
    }
  };

  return (
    <div className="bg-card border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl max-w-lg w-full mx-auto space-y-4">
      {/* Topo do Minigame */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
            👟
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block">
              Minigame de Habilidade • NSS
            </span>
            <h4 className="font-display text-sm font-black text-foreground">
              {mode === 'match_clutch' ? 'Assistência Decisiva na Partida' : 'Treino de Passe & Visão de Jogo'}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <DifficultyBadge balance={balance} compact />
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
            <span>Sucessos:</span>
            <span className="text-emerald-500 font-mono font-black">{successes}/{attempts}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Canvas2D Interativo */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/60 shadow-inner bg-emerald-950 flex justify-center touch-none select-none overscroll-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          className="w-full h-full cursor-crosshair touch-none select-none overscroll-none"
          onMouseDown={(e) => handleAimStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleAimMove(e.clientX, e.clientY)}
          onMouseUp={handleAimRelease}
          onTouchStart={(e) => {
            if (e.touches && e.touches.length > 0) {
              e.preventDefault();
              handleAimStart(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches && e.touches.length > 0) {
              e.preventDefault();
              handleAimMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handleAimRelease}
        />

        {passResult === 'assist' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-in zoom-in-95 duration-200 pointer-events-none">
            <div className="text-center">
              <span className="font-display text-3xl font-black text-emerald-400 drop-shadow-lg block animate-bounce">
                ASSISTÊNCIA PERFEITA!
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-100 bg-emerald-600 px-3 py-1 rounded-full">
                Nota +1.2 no Jogo ⭐
              </span>
            </div>
          </div>
        )}

        {passResult === 'offside' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in zoom-in-95 duration-200 pointer-events-none">
            <div className="text-center p-4 rounded-2xl bg-zinc-950/90 border-2 border-red-500 shadow-2xl">
              <span className="text-4xl block mb-1">🚩</span>
              <span className="font-display text-2xl font-black text-red-400 drop-shadow-lg block">
                IMPEDIMENTO!
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-100 bg-red-600 px-3 py-1 rounded-full mt-1 inline-block">
                Gol Anulado pela Arbitragem
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Força do Passe (New Star Soccer) */}
      <div className="p-3 rounded-2xl bg-secondary/50 border border-border space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-foreground">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Força do Passe:
          </span>
          <span className={`font-mono font-black px-2 py-0.5 rounded text-[11px] ${
            power > 88 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
              : power >= 55 && power <= 85 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {power}% {power > 88 ? '• Longo Demais' : power >= 55 && power <= 85 ? '• Ideal ⭐' : '• Curto'}
          </span>
        </div>

        {/* Trilho da Barra */}
        <div className="relative w-full h-3.5 bg-zinc-950 rounded-full overflow-hidden border border-border">
          <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-blue-500/50" />
          <div className="absolute left-[35%] top-0 bottom-0 w-[20%] bg-yellow-500/50" />
          <div className="absolute left-[55%] top-0 bottom-0 w-[30%] bg-emerald-500 animate-pulse" />
          <div className="absolute left-[85%] top-0 bottom-0 w-[15%] bg-rose-600" />
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white shadow-[0_0_8px_#ffffff] rounded-full -ml-1 transition-all duration-75 pointer-events-none"
            style={{ left: `${power}%` }}
          />
        </div>

        {/* Botão de Passe por Clique */}
        {passResult === 'idle' && (
          <button
            type="button"
            onClick={handleAimRelease}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Lançar Passe com Força Atual ({power}%)
          </button>
        )}
      </div>

      {/* Instruções e Próximo Lance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-xs font-semibold text-muted-foreground text-center sm:text-left">
          {feedbackText}
        </p>

        {passResult !== 'idle' && passResult !== 'aiming' && passResult !== 'passing' && (
          <button
            type="button"
            onClick={resetPass}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0 shadow-md shadow-emerald-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Tentar Novo Passe
          </button>
        )}
      </div>
    </div>
  );
}