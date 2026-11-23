'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Share2, 
  Sparkles, 
  Trophy, 
  X, 
  Check, 
  Smartphone, 
  Square 
} from 'lucide-react';

interface CareerCardProps {
  playerName: string;
  clubName: string;
  position: string;
  overall: number;
  seasonYear: number;
  stats: {
    matches: number;
    goals: number;
    assists: number;
    rating: number;
  };
  onClose?: () => void;
}

export function CareerCardGenerator({
  playerName,
  clubName,
  position,
  overall,
  seasonYear,
  stats,
  onClose,
}: CareerCardProps) {
  const [format, setFormat] = useState<'stories' | 'square'>('stories');
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = format === 'stories' ? 1080 : 1080;
    const height = format === 'stories' ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // 1. Fundo Gradiente Escuro Esmeralda
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#09090b');
    bgGrad.addColorStop(0.5, '#064e3b');
    bgGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Efeito de Linhas Táticas de Fundo
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.08)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Moldura e Card Dourado / Neon
    const pad = 60;
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 6;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    // 3. Topo: Logo Bola na Rede
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚽ BOLA NA REDE: CARREIRA', width / 2, pad + 80);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 24px sans-serif';
    ctx.fillText(`TEMPORADA OFICIAL ${seasonYear}`, width / 2, pad + 125);

    // 4. Overall em Destaque Gigante
    const centerY = format === 'stories' ? height * 0.36 : height * 0.4;
    
    // Círculo com Brilho do Overall
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2, centerY, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 130px sans-serif';
    ctx.fillText(String(overall), width / 2, centerY + 45);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`OVERALL • ${position}`, width / 2, centerY + 105);

    // 5. Nome do Craque e Clube
    const nameY = format === 'stories' ? height * 0.55 : height * 0.65;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px sans-serif';
    ctx.fillText(playerName.toUpperCase(), width / 2, nameY);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = '700 36px sans-serif';
    ctx.fillText(`🛡️ ${clubName}`, width / 2, nameY + 55);

    // 6. Estatísticas Principais (Grid de 4 Caixas)
    const statsY = format === 'stories' ? height * 0.68 : height * 0.78;
    const boxW = 200;
    const boxH = 140;
    const gap = 24;
    const totalW = boxW * 4 + gap * 3;
    const startX = (width - totalW) / 2;

    const statList = [
      { label: 'JOGOS', val: String(stats.matches) },
      { label: 'GOLS', val: String(stats.goals) },
      { label: 'ASSISTS', val: String(stats.assists) },
      { label: 'NOTA MÉDIA', val: stats.rating.toFixed(1) },
    ];

    statList.forEach((st, i) => {
      const bx = startX + i * (boxW + gap);
      ctx.fillStyle = 'rgba(24, 24, 27, 0.7)';
      ctx.fillRect(bx, statsY, boxW, boxH);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, statsY, boxW, boxH);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px sans-serif';
      ctx.fillText(st.val, bx + boxW / 2, statsY + 65);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(st.label, bx + boxW / 2, statsY + 108);
    });

    // 7. Rodapé com Link e Marca d'Água
    const footerY = height - pad - 60;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('Crie sua história no futebol brasileiro: bola-na-rede-psi.vercel.app', width / 2, footerY);
  };

  useEffect(() => {
    drawCard();
  }, [format, playerName, clubName, position, overall, seasonYear, stats]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `card-${playerName.toLowerCase().replace(/\s+/g, '-')}-${seasonYear}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 'image/png');
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `card-${playerName}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Carreira de ${playerName} no Bola na Rede`,
            text: `Olha a minha temporada no Bola na Rede: Carreira! Overall ${overall} jogando pelo ${clubName}.`,
            files: [file],
          });
        } catch {
          handleDownload();
        }
      } else {
        handleDownload();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/40 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col items-center space-y-4">
        {/* Cabeçalho */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm md:text-base text-zinc-100">Card de Carreira Compartilhável</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 text-xs px-2.5 py-1 rounded bg-zinc-800"
            >
              Fechar
            </button>
          )}
        </div>

        {/* Seletor de Formato */}
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('stories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              format === 'stories'
                ? 'bg-emerald-500 text-zinc-950 shadow'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Stories (9:16)
          </button>
          <button
            onClick={() => setFormat('square')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              format === 'square'
                ? 'bg-emerald-500 text-zinc-950 shadow'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Square className="w-4 h-4" />
            Feed (1:1)
          </button>
        </div>

        {/* Prévia Canvas */}
        <div className="w-full flex justify-center overflow-hidden max-h-[380px] rounded-xl border border-zinc-800 bg-zinc-950 p-2">
          <canvas
            ref={canvasRef}
            className="max-h-[360px] max-w-full h-auto object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Ações */}
        <div className="w-full grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Gerando...' : 'Baixar Imagem PNG'}
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <Share2 className="w-4 h-4 fill-zinc-950" />
            Compartilhar Card
          </button>
        </div>
      </div>
    </div>
  );
}
