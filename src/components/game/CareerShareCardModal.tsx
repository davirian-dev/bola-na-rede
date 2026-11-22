'use client';

import React, { useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ClubBadge } from '@/components/game/ClubBadge';
import { OverallBadge } from '@/components/game/OverallBadge';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Trophy, 
  Flame, 
  X,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CareerShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CareerShareCardModal({ isOpen, onClose }: CareerShareCardModalProps) {
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const mode = useGameStore((s) => s.mode);
  const generation = useGameStore((s) => s.generation);
  const trophies = useGameStore((s) => s.trophies);
  const seasonYear = useGameStore((s) => s.seasonYear);

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const activeClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;
  const currentClub = activeClubId ? clubs[activeClubId] : undefined;

  const actorName = mode === 'player' 
    ? (playerProfile?.nickname || playerProfile?.name || 'Craque Brasileiro') 
    : (managerProfile?.name || 'Professor');

  const overall = mode === 'player' ? (playerProfile?.overall || 75) : 80;
  const position = mode === 'player' ? (playerProfile?.position || 'ATA') : 'TEC';

  // Atributos de Destaque
  const attrs = playerProfile?.attributes || {
    pace: 75,
    shooting: 78,
    passing: 74,
    dribbling: 76,
    defending: 50,
    physical: 72,
  };

  // Geração do Canvas de Alta Resolução e Download em PNG
  const handleDownloadCard = () => {
    setDownloading(true);

    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1050;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setDownloading(false);
      return;
    }

    // 1. Fundo do Card com Gradiente Premium Dourado/Esmeralda
    const bgGrad = ctx.createLinearGradient(0, 0, 750, 1050);
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.3, '#0c0a09');
    bgGrad.addColorStop(0.7, '#064e3b');
    bgGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 750, 1050);

    // Borda Dourada Externa Dupla
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 710, 1010);

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 678, 978);

    // 2. Topo da Cartinha: Overall & Posição
    ctx.fillStyle = '#facc15';
    ctx.font = '900 96px sans-serif';
    ctx.fillText(`${overall}`, 70, 150);

    ctx.font = '900 42px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${position}`, 75, 205);

    // Bandeira do Brasil 🇧🇷
    ctx.font = '54px sans-serif';
    ctx.fillText('🇧🇷', 75, 275);

    // Escudo do Clube
    if (currentClub) {
      ctx.fillStyle = currentClub.primaryColor || '#10b981';
      ctx.beginPath();
      ctx.arc(102, 340, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = currentClub.secondaryColor || '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentClub.shortName, 102, 347);
      ctx.textAlign = 'left';
    }

    // 3. Silhueta / Círculo Central do Atleta
    ctx.fillStyle = 'rgba(250, 204, 21, 0.12)';
    ctx.beginPath();
    ctx.arc(440, 260, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '140px sans-serif';
    ctx.fillText('⚽', 370, 310);

    // 4. Faixa de Nome do Atleta
    ctx.fillStyle = '#facc15';
    ctx.font = '900 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(actorName.toUpperCase(), 375, 480);

    // Subtítulo: Clube e Temporada
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '700 24px sans-serif';
    ctx.fillText(
      `${currentClub?.name || 'Futebol Brasileiro'} • Temporada ${seasonYear} • Geração ${generation}`,
      375,
      525
    );

    // Linha divisória dourada
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(90, 560);
    ctx.lineTo(660, 560);
    ctx.stroke();

    // 5. Grid dos 6 Atributos FIFA Style
    const stats = [
      { label: 'RIT', val: attrs.pace },
      { label: 'FIN', val: attrs.shooting },
      { label: 'PAS', val: attrs.passing },
      { label: 'DRI', val: attrs.dribbling },
      { label: 'DEF', val: attrs.defending },
      { label: 'FIS', val: attrs.physical },
    ];

    ctx.textAlign = 'left';
    stats.forEach((st, idx) => {
      const col = idx < 3 ? 0 : 1;
      const row = idx % 3;
      const x = col === 0 ? 140 : 420;
      const y = 630 + row * 65;

      ctx.fillStyle = '#facc15';
      ctx.font = '900 40px sans-serif';
      ctx.fillText(`${st.val}`, x, y);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 32px sans-serif';
      ctx.fillText(st.label, x + 65, y);
    });

    // 6. Rodapé: Títulos e Marca do Jogo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 830);
    ctx.lineTo(660, 830);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#34d399';
    ctx.font = '800 24px sans-serif';
    ctx.fillText(`🏆 ${trophies.length} TÍTULOS CONQUISTADOS NA CARREIRA`, 375, 875);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '700 20px sans-serif';
    ctx.fillText('JOGUE GRÁTIS EM: BOLA NA REDE • CARREIRA', 375, 940);

    // Download do PNG
    const link = document.createElement('a');
    link.download = `cartinha-${actorName.toLowerCase().replace(/\s+/g, '-')}-bolanarede.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative flex flex-col items-center max-h-[95vh] overflow-y-auto">
        
        {/* Glow de Fundo Dourado */}
        <div className="absolute top-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Topo com Botão Fechar */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-display text-sm font-black text-foreground uppercase tracking-wider">
              Cartinha Oficial da Carreira
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual da Cartinha (Pré-Visualização na Tela) */}
        <div className="w-full max-w-[320px] rounded-3xl bg-gradient-to-b from-stone-900 via-zinc-950 to-emerald-950 p-5 border-4 border-amber-400 shadow-2xl relative overflow-hidden my-3">
          {/* Brilho Dourado */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Topo: Over, Pos e Escudo */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-display text-5xl font-black text-amber-400 block leading-none">
                {overall}
              </span>
              <span className="font-black text-sm text-foreground uppercase block mt-0.5">
                {position}
              </span>
              <span className="text-xl block mt-1">🇧🇷</span>
            </div>

            {currentClub && (
              <ClubBadge
                primaryColor={currentClub.primaryColor}
                secondaryColor={currentClub.secondaryColor}
                shortName={currentClub.shortName}
                size="md"
              />
            )}
          </div>

          {/* Ícone Central */}
          <div className="my-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-4xl shadow-inner">
              ⚽
            </div>
          </div>

          {/* Nome e Clube */}
          <div className="text-center mb-3">
            <h3 className="font-display text-xl font-black text-amber-400 truncate">
              {actorName.toUpperCase()}
            </h3>
            <p className="text-[11px] text-muted-foreground font-semibold truncate">
              {currentClub?.name || 'Futebol Brasileiro'} • Geração {generation}
            </p>
          </div>

          {/* Grid de Atributos */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-amber-500/30">
            <div className="flex items-center justify-between px-2">
              <span className="text-muted-foreground font-bold">RIT</span>
              <span className="font-black text-amber-400 font-mono">{attrs.pace}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-muted-foreground font-bold">DRI</span>
              <span className="font-black text-amber-400 font-mono">{attrs.dribbling}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-muted-foreground font-bold">FIN</span>
              <span className="font-black text-amber-400 font-mono">{attrs.shooting}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-muted-foreground font-bold">DEF</span>
              <span className="font-black text-amber-400 font-mono">{attrs.defending}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-muted-foreground font-bold">PAS</span>
              <span className="font-black text-amber-400 font-mono">{attrs.passing}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-muted-foreground font-bold">FIS</span>
              <span className="font-black text-amber-400 font-mono">{attrs.physical}</span>
            </div>
          </div>

          {/* Rodapé da Cartinha */}
          <div className="pt-2 border-t border-border/40 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              🏆 {trophies.length} Títulos • Bola na Rede
            </span>
          </div>
        </div>

        {/* Botões de Compartilhamento */}
        <div className="w-full space-y-2.5 mt-2">
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Gerando Imagem...' : 'Baixar Cartinha PNG (Instagram/WhatsApp)'}
          </button>

          <p className="text-[11px] text-muted-foreground text-center font-semibold">
            Poste nos seus stories ou status e mostre a evolução do seu craque!
          </p>
        </div>
      </div>
    </div>
  );
}