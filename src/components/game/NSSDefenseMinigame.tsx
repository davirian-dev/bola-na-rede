'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Shield, CheckCircle2, XCircle, Footprints } from 'lucide-react';
import { sound } from '@/lib/soundEffects';

interface NSSDefenseMinigameProps {
  onDefendSuccess?: (ratingBonus: number) => void;
  onDefendFail?: () => void;
  onClose?: () => void;
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
  matchInfo,
}: NSSDefenseMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  const [defenseState, setDefenseState] = useState<'approaching' | 'tackling' | 'success' | 'foul' | 'beaten'>('approaching');
  const [feedbackText, setFeedbackText] = useState('O atacante adversário vem com a bola dominada! Aguarde a zona perfeita e dê o bote limpo!');

  // Atacante adversário correndo em direção ao gol
  const [attackerX, setAttackerX] = useState(120);
  const [attackerY, setAttackerY] = useState(120);

  // Zona do Bote Defensivo
  const tackleZoneX = 280;
  const tackleZoneY = 250;
  const tackleZoneRadius = 45;

  useEffect(() => {
    if (defenseState !== 'approaching') return;

    const interval = setInterval(() => {
      setAttackerX((x) => x + 3.2);
      setAttackerY((y) => y + 2.6);

      // Se passou da zona sem tomar bote
      if (attackerY >= 310) {
        setDefenseState('beaten');
        setFeedbackText('Driblado! O adversário passou em velocidade rumo à área!');
        sound.play('whistle');
        if (onDefendFail) onDefendFail();
      }
    }, 45);

    return () => clearInterval(interval);
  }, [defenseState, attackerY, onDefendFail]);

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

    // Linha defensiva
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.lineTo(canvas.width, 310);
    ctx.stroke();

    // Zona Ideal de Bote (Círculo Verde Pulsante)
    ctx.beginPath();
    ctx.arc(tackleZoneX, tackleZoneY, tackleZoneRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Atacante Adversário com Bola
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(attackerX, attackerY - 20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(attackerX - 8, attackerY - 10, 16, 22);

    // Bola sendo conduzida
    ctx.beginPath();
    ctx.arc(attackerX + 10, attackerY + 10, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Defensor (Você) aguardando na base
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(tackleZoneX, tackleZoneY - 10, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(tackleZoneX - 9, tackleZoneY, 18, 24);
  }, [attackerX, attackerY, defenseState]);

  // Ação de Dar o Bote
  const handleTackle = () => {
    if (defenseState !== 'approaching') return;

    const dist = Math.hypot(attackerX - tackleZoneX, attackerY - tackleZoneY);
    const tacklingStat = playerProfile?.attributes?.tackling || 70;
    const isInsideSweetSpot = dist <= tackleZoneRadius;

    if (isInsideSweetSpot) {
      setDefenseState('success');
      sound.play('kick');
      setFeedbackText('DESARME PERFEITO! Bote limpo na bola, desarmando o atacante sem cometer falta! 🛡️');
      if (onDefendSuccess) onDefendSuccess(0.4);
    } else if (dist < tackleZoneRadius + 30) {
      // Falta tática
      setDefenseState('foul');
      sound.play('whistle');
      setFeedbackText('FALTA TÁTICA! Chegou atrasado e parou a jogada com infração na intermediária!');
      if (onDefendFail) onDefendFail();
    } else {
      setDefenseState('beaten');
      sound.play('whistle');
      setFeedbackText('Bote no vazio! O atacante passou ileso!');
      if (onDefendFail) onDefendFail();
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
                Postura Defensiva
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Acerte o tempo de bola e roube a posse sem fazer falta!
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

        {defenseState !== 'approaching' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {defenseState === 'success' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-blue-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-blue-400 uppercase tracking-wide">Desarme Limpo!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Lance Perdido</h4>
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

      <button
        type="button"
        disabled={defenseState !== 'approaching'}
        onClick={handleTackle}
        className="w-full mt-4 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <Shield className="w-5 h-5" />
        DAR O BOTE LIMPO AGORA!
      </button>
    </div>
  );
}
