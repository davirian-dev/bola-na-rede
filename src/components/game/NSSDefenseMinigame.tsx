'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Shield, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { drawPitchBackground, drawCartoonPlayer, drawStyledBall } from '@/lib/minigameCanvas';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from './DifficultyBadge';

interface NSSDefenseMinigameProps {
  onDefendSuccess?: (ratingBonus: number) => void;
  onDefendFail?: () => void;
  onClose?: () => void;
  divisionOverride?: Division;
  opponentOverall?: number;
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export function NSSDefenseMinigame({
  onDefendSuccess,
  onDefendFail,
  onClose,
  divisionOverride,
  opponentOverall,
  matchInfo,
}: NSSDefenseMinigameProps) {
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

  const [defenseState, setDefenseState] = useState<'approaching' | 'success' | 'foul' | 'beaten'>('approaching');
  const [feedbackText, setFeedbackText] = useState('Aguarde o atacante entrar na zona verde e dê o bote limpo!');
  const [inZoneNow, setInZoneNow] = useState(false);

  const onSuccessRef = useRef(onDefendSuccess);
  const onFailRef = useRef(onDefendFail);

  useEffect(() => {
    onSuccessRef.current = onDefendSuccess;
    onFailRef.current = onDefendFail;
  }, [onDefendSuccess, onDefendFail]);

  const tacklingStat = playerProfile?.attributes?.tackling || 72;
  const sweetRadius = Math.round((46 + Math.max(0, (tacklingStat - 65) * 0.4)) * balance.sweetSpotScale);

  const simRef = useRef({
    attX: 110,
    attY: 95,
    defX: 290,
    defY: 255,
    state: 'approaching' as 'approaching' | 'success' | 'foul' | 'beaten',
    slideProgress: 0,
  });

  const resetPlay = useCallback(() => {
    simRef.current = {
      attX: 110,
      attY: 95,
      defX: 290,
      defY: 255,
      state: 'approaching',
      slideProgress: 0,
    };
    setDefenseState('approaching');
    setInZoneNow(false);
    setFeedbackText('Aguarde o atacante entrar na zona verde e dê o bote limpo!');
  }, []);

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

      if (s.state === 'approaching') {
        const attMult = balanceRef.current.defenderSpeedMult;
        s.attX += 2.35 * attMult;
        s.attY += 2.05 * attMult;

        const dist = Math.hypot(s.attX - s.defX, s.attY - s.defY);
        setInZoneNow(dist <= sweetRadius);

        if (s.attY >= 325) {
          s.state = 'beaten';
          setDefenseState('beaten');
          setFeedbackText('Driblado! O atacante passou em velocidade rumo à área!');
          sound.playWhistle();
          onFailRef.current?.();
        }
      } else if (s.slideProgress < 1) {
        s.slideProgress = Math.min(1, s.slideProgress + 0.12);
      }

      drawPitchBackground(ctx, w, h, 34);

      // Linha da área defensiva
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(20, 325);
      ctx.lineTo(w - 20, 325);
      ctx.stroke();

      // Zona ideal de bote pulsante
      const distNow = Math.hypot(s.attX - s.defX, s.attY - s.defY);
      const isHot = distNow <= sweetRadius && s.state === 'approaching';
      const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.05;

      ctx.save();
      ctx.beginPath();
      ctx.arc(s.defX, s.defY, sweetRadius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = isHot ? 'rgba(16, 185, 129, 0.35)' : 'rgba(59, 130, 246, 0.15)';
      ctx.fill();
      ctx.strokeStyle = isHot ? '#34d399' : 'rgba(96, 165, 250, 0.7)';
      ctx.lineWidth = isHot ? 3 : 2;
      ctx.setLineDash([6, 5]);
      ctx.stroke();
      ctx.restore();

      // Atacante adversário conduzindo
      drawCartoonPlayer(ctx, s.attX, s.attY, {
        jerseyColor: '#dc2626',
        shortsColor: '#ffffff',
        label: 'RIVAL',
        labelColor: '#fca5a5',
        scale: 1.05,
      });

      // Bola nos pés (ou afastada após desarme)
      const ballX = s.state === 'success' ? s.defX - 28 * s.slideProgress : s.attX + 12;
      const ballY = s.state === 'success' ? s.defY - 18 * s.slideProgress : s.attY + 14;
      drawStyledBall(ctx, ballX, ballY, 8, s.state === 'success' ? 6 * s.slideProgress : 0);

      // Defensor (Você)
      const curDefX =
        s.state === 'success' || s.state === 'foul'
          ? s.defX + (s.attX - s.defX) * 0.55 * s.slideProgress
          : s.defX;
      const curDefY =
        s.state === 'success' || s.state === 'foul'
          ? s.defY + (s.attY - s.defY) * 0.55 * s.slideProgress
          : s.defY;

      drawCartoonPlayer(ctx, curDefX, curDefY, {
        jerseyColor: '#0284c7',
        shortsColor: '#0f172a',
        label: 'VOCÊ',
        labelColor: '#7dd3fc',
        scale: 1.1,
        sliding: s.state === 'success' || s.state === 'foul',
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [sweetRadius]);

  const handleTackle = () => {
    const s = simRef.current;
    if (s.state !== 'approaching') return;

    const dist = Math.hypot(s.attX - s.defX, s.attY - s.defY);

    if (dist <= sweetRadius) {
      s.state = 'success';
      setDefenseState('success');
      sound.playKick();
      sound.playCheer();
      setFeedbackText('DESARME PERFEITO! Bote limpo na bola sem cometer falta! 🛡️');
      onSuccessRef.current?.(0.45);
    } else if (dist <= sweetRadius + 36) {
      s.state = 'foul';
      setDefenseState('foul');
      sound.playWhistle();
      sound.playCardSound();
      setFeedbackText('FALTA TÁTICA! Chegou atrasado e derrubou o atacante!');
      onFailRef.current?.();
    } else {
      s.state = 'beaten';
      setDefenseState('beaten');
      sound.playWhistle();
      setFeedbackText('Bote no vazio! O atacante passou livre!');
      onFailRef.current?.();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
            🛡️
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Lance Defensivo • Desarme 1x1
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold uppercase">
                Desarme {tacklingStat}
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Toque no campo ou no botão quando o círculo ficar VERDE!
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
          onClick={handleTackle}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              e.preventDefault();
              handleTackle();
            }
          }}
          className="w-full h-full cursor-pointer touch-none"
        />

        {defenseState !== 'approaching' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {defenseState === 'success' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Desarme Limpo!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">
                  {defenseState === 'foul' ? 'Falta Marcada' : 'Lance Perdido'}
                </h4>
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

      <button
        type="button"
        disabled={defenseState !== 'approaching'}
        onClick={handleTackle}
        className={`w-full mt-4 py-3.5 px-4 rounded-xl disabled:opacity-50 font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
          inZoneNow
            ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}
      >
        <Shield className="w-5 h-5" />
        {inZoneNow ? 'MOMENTO IDEAL — DAR O BOTE AGORA! ⚡' : 'DAR O BOTE LIMPO AGORA!'}
      </button>
    </div>
  );
}
