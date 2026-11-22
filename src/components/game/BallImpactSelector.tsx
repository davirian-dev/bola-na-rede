'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Target, Sparkles, HelpCircle } from 'lucide-react';

export interface BallImpact {
  x: number; // -1 (extrema esquerda / trivela) a +1 (extrema direita / chapa com curva interna)
  y: number; // -1 (topo da bola / rasteiro violento) a +1 (embaixo da bola / cavadinha ou elevação)
}

interface BallImpactSelectorProps {
  value: BallImpact;
  onChange: (impact: BallImpact) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function BallImpactSelector({
  value,
  onChange,
  disabled = false,
  size = 'md',
  showLabels = true,
}: BallImpactSelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Dimensões base conforme o tamanho
  const dimension = size === 'sm' ? 100 : size === 'lg' ? 160 : 130;
  const radius = (dimension - 16) / 2;
  const centerX = dimension / 2;
  const centerY = dimension / 2;

  // Atualiza ponto de impacto a partir de coordenadas no canvas
  const updateImpactFromCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const rawX = clientX - rect.left - centerX;
      const rawY = clientY - rect.top - centerY;

      // Limita ao raio circular da bola (margem interna de 90%)
      const dist = Math.sqrt(rawX * rawX + rawY * rawY);
      const maxR = radius * 0.88;

      let clampedX = rawX;
      let clampedY = rawY;

      if (dist > maxR && dist > 0) {
        clampedX = (rawX / dist) * maxR;
        clampedY = (rawY / dist) * maxR;
      }

      const normX = Number((clampedX / maxR).toFixed(2));
      const normY = Number((clampedY / maxR).toFixed(2));

      onChange({ x: normX, y: normY });
    },
    [disabled, centerX, centerY, radius, onChange]
  );

  // Handlers de Mouse e Touch com touch-none
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsInteracting(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateImpactFromCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isInteracting || disabled) return;
    updateImpactFromCoords(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsInteracting(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignora erro se ponteiro já liberado
    }
  };

  // Renderização 2D da Bola estilo New Star Soccer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dimension, dimension);

    // 1. Sombra projetada
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + radius * 0.95, radius * 0.85, radius * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // 2. Base da Bola com Gradiente Tridimensional
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    const ballGrad = ctx.createRadialGradient(
      centerX - radius * 0.35,
      centerY - radius * 0.35,
      radius * 0.1,
      centerX,
      centerY,
      radius
    );
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.65, '#e4e4e7');
    ballGrad.addColorStop(1, '#71717a');

    ctx.fillStyle = ballGrad;
    ctx.fill();

    // 3. Gomos / Costuras Clássicas da Bola (Pentágonos Estilo Telstar)
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1.8;

    // Pentágono Central
    const drawPolygon = (ox: number, oy: number, r: number, sides: number) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const px = ox + r * Math.cos(angle);
        const py = oy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#18181b';
      ctx.fill();
      ctx.stroke();
    };

    drawPolygon(centerX, centerY - radius * 0.05, radius * 0.32, 5);

    // Linhas conectando os gomos externos
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = centerX + radius * 0.32 * Math.cos(angle);
      const py = centerY - radius * 0.05 + radius * 0.32 * Math.sin(angle);
      const outerX = centerX + radius * 0.88 * Math.cos(angle);
      const outerY = centerY - radius * 0.05 + radius * 0.88 * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }

    // 4. Eixos de Mira Pontilhados (Cruz Central)
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 0.8, centerY);
    ctx.lineTo(centerX + radius * 0.8, centerY);
    ctx.moveTo(centerX, centerY - radius * 0.8);
    ctx.lineTo(centerX, centerY + radius * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Borda Externa da Bola
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    // 6. Ponto de Impacto Marcado com Mira Tátil
    const maxR = radius * 0.88;
    const targetX = centerX + value.x * maxR;
    const targetY = centerY + value.y * maxR;

    // Círculo de pulso brilhante
    ctx.beginPath();
    ctx.arc(targetX, targetY, 11, 0, Math.PI * 2);
    ctx.fillStyle = isInteracting ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.35)';
    ctx.fill();

    // Círculo Central da Chuteira
    ctx.beginPath();
    ctx.arc(targetX, targetY, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = isInteracting ? '#ef4444' : '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mira em cruz vermelha/verde
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(targetX - 9, targetY);
    ctx.lineTo(targetX + 9, targetY);
    ctx.moveTo(targetX, targetY - 9);
    ctx.lineTo(targetX, targetY + 9);
    ctx.stroke();
  }, [dimension, radius, centerX, centerY, value, isInteracting]);

  // Interpretação do Efeito para Feedback Visual
  const getEffectDescription = () => {
    let curveText = 'Sem Curva (Reto)';
    if (value.x < -0.3) curveText = 'Curva Externa (Trivela / Efeito Esquerda) 🌪️';
    else if (value.x > 0.3) curveText = 'Curva Interna (Chapa / Efeito Direita) 💫';

    let heightText = 'Meia Altura';
    if (value.y > 0.35) heightText = 'Cavadinha / Alto ⬆️';
    else if (value.y < -0.3) heightText = 'Rasteiro / Seco ⬇️';

    return { curveText, heightText };
  };

  const { curveText, heightText } = getEffectDescription();

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={dimension}
          height={dimension}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`touch-none cursor-crosshair rounded-full border border-border/70 shadow-lg bg-zinc-950/60 transition-transform active:scale-95 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Toque na bola para definir o ponto de contato da chuteira"
        />

        {/* Badge Flutuante no Topo */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-zinc-900/90 border border-border text-[9px] font-black text-amber-400 whitespace-nowrap shadow pointer-events-none flex items-center gap-1">
          <Target className="w-2.5 h-2.5" />
          PONTO DE IMPACTO
        </div>
      </div>

      {showLabels && (
        <div className="mt-2 text-center w-full max-w-[200px]">
          <div className="text-[10px] font-extrabold text-foreground leading-tight">
            {curveText}
          </div>
          <div className="text-[9px] font-bold text-muted-foreground">
            Elevação: <span className="text-emerald-400">{heightText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
