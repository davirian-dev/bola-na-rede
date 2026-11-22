'use client';

import React, { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Club, CustomKit, KitPattern } from '@/types/game';
import { ClubBadge } from '@/components/game/ClubBadge';
import { 
  Shirt, 
  Palette, 
  Upload, 
  Download, 
  Check, 
  Sparkles, 
  Layers, 
  RotateCcw,
  Shield,
  Eye,
  CheckCircle2,
  FileJson
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommunityKitHubProps {
  initialClubId?: string;
}

const KIT_PATTERNS: { id: KitPattern; label: string; icon: string; desc: string }[] = [
  { id: 'solid', label: 'Liso Clássico', icon: '👕', desc: 'Cor pura minimalista' },
  { id: 'stripes_v', label: 'Listras Verticais', icon: '🦓', desc: 'Estilo Juventus, Santos, Milan' },
  { id: 'stripes_h', label: 'Listras Horizontais', icon: '🏴‍☠️', desc: 'Estilo Flamengo, Sporting, Celtic' },
  { id: 'diagonal_sash', label: 'Faixa Diagonal', icon: '⚡', desc: 'Estilo Vasco, River Plate, Ponte Preta' },
  { id: 'half_and_half', label: 'Meio a Meio', icon: '🎭', desc: 'Estilo AS Monaco, Blackburn' },
  { id: 'gradient', label: 'Degradê Moderno', icon: '🌊', desc: 'Transição suave entre duas cores' },
  { id: 'checkered', label: 'Xadrez Tradicional', icon: '🏁', desc: 'Estilo Seleção da Croácia, Boavista' },
];

const PRESET_KITS: {
  id: string;
  name: string;
  clubName: string;
  author: string;
  kit: CustomKit;
}[] = [
  {
    id: 'fla-retro-81',
    name: 'Manto da Glória 1981',
    clubName: 'Flamengo',
    author: 'Nação Retrô',
    kit: {
      primaryColor: '#c5161d',
      secondaryColor: '#18181b',
      detailColor: '#ffffff',
      pattern: 'stripes_h',
      collarType: 'v_neck',
      sponsorText: 'LUBRAX',
      shortsColor: '#ffffff',
      socksColor: '#c5161d',
    },
  },
  {
    id: 'vas-faixa-ouro',
    name: 'Faixa Cruzmaltina Ouro',
    clubName: 'Vasco da Gama',
    author: 'Colina Histórica',
    kit: {
      primaryColor: '#18181b',
      secondaryColor: '#f59e0b',
      detailColor: '#ffffff',
      pattern: 'diagonal_sash',
      collarType: 'round',
      sponsorText: 'PIXBET',
      shortsColor: '#18181b',
      socksColor: '#ffffff',
    },
  },
  {
    id: 'pal-allianz-modern',
    name: 'Verdão Neon Cyber',
    clubName: 'Palmeiras',
    author: 'Avanti Dev',
    kit: {
      primaryColor: '#05603a',
      secondaryColor: '#10b981',
      detailColor: '#ffffff',
      pattern: 'gradient',
      collarType: 'polo',
      sponsorText: 'CREFISA',
      shortsColor: '#05603a',
      socksColor: '#10b981',
    },
  },
  {
    id: 'cor-alvinegro-raiz',
    name: 'Timão Democracia 1982',
    clubName: 'Corinthians',
    author: 'Fiel Torcida',
    kit: {
      primaryColor: '#ffffff',
      secondaryColor: '#18181b',
      detailColor: '#dc2626',
      pattern: 'stripes_v',
      collarType: 'round',
      sponsorText: 'DEMOCRACIA',
      shortsColor: '#18181b',
      socksColor: '#ffffff',
    },
  },
  {
    id: 'rma-galacticos-gold',
    name: 'Blanco Imperial Dourado',
    clubName: 'Real Madrid',
    author: 'Madridismo Brasil',
    kit: {
      primaryColor: '#ffffff',
      secondaryColor: '#d97706',
      detailColor: '#1e3a8a',
      pattern: 'solid',
      collarType: 'polo',
      sponsorText: 'FLY EMIRATES',
      shortsColor: '#ffffff',
      socksColor: '#ffffff',
    },
  },
  {
    id: 'bar-blaugrana-vintage',
    name: 'Blaugrana Tiki-Taka 2009',
    clubName: 'FC Barcelona',
    author: 'Culers BR',
    kit: {
      primaryColor: '#004d98',
      secondaryColor: '#a50044',
      detailColor: '#facc15',
      pattern: 'stripes_v',
      collarType: 'v_neck',
      sponsorText: 'UNICEF',
      shortsColor: '#a50044',
      socksColor: '#004d98',
    },
  },
];

export function CommunityKitHub({ initialClubId }: CommunityKitHubProps) {
  const clubs = useGameStore((s) => s.clubs);
  const updateClub = useGameStore((s) => s.updateClub);

  const clubList = Object.values(clubs);
  const [selectedClubId, setSelectedClubId] = useState<string>(initialClubId || 'fla');
  const [activeKitType, setActiveKitType] = useState<'home' | 'away'>('home');
  const [searchClub, setSearchClub] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  const currentClub: Club = clubs[selectedClubId] || clubList[0];

  // Estado do Kit atual
  const [kit, setKit] = useState<CustomKit>({
    primaryColor: currentClub?.primaryColor || '#c5161d',
    secondaryColor: currentClub?.secondaryColor || '#18181b',
    detailColor: '#ffffff',
    pattern: 'solid',
    collarType: 'round',
    sponsorText: 'PATROCÍNIO MASTER',
    shortsColor: currentClub?.secondaryColor || '#18181b',
    socksColor: currentClub?.primaryColor || '#c5161d',
  });

  // Atualiza cores quando troca de clube
  const handleSelectClub = (cId: string) => {
    setSelectedClubId(cId);
    const c = clubs[cId];
    if (c) {
      const existingKit = activeKitType === 'home' ? c.customKits?.home : c.customKits?.away;
      setKit({
        primaryColor: existingKit?.primaryColor || c.primaryColor,
        secondaryColor: existingKit?.secondaryColor || c.secondaryColor,
        detailColor: existingKit?.detailColor || '#ffffff',
        pattern: existingKit?.pattern || 'solid',
        collarType: existingKit?.collarType || 'round',
        sponsorText: existingKit?.sponsorText || 'PATROCÍNIO MASTER',
        sponsorLogoUrl: existingKit?.sponsorLogoUrl,
        shortsColor: existingKit?.shortsColor || c.secondaryColor,
        socksColor: existingKit?.socksColor || c.primaryColor,
      });
    }
  };

  // Alterna Titular / Reserva
  const handleToggleKitType = (type: 'home' | 'away') => {
    setActiveKitType(type);
    const existingKit = type === 'home' ? currentClub?.customKits?.home : currentClub?.customKits?.away;
    if (existingKit) {
      setKit(existingKit);
    } else {
      if (type === 'away') {
        setKit((prev) => ({
          ...prev,
          primaryColor: currentClub.secondaryColor === '#ffffff' ? '#ffffff' : '#f4f4f5',
          secondaryColor: currentClub.primaryColor,
          shortsColor: currentClub.primaryColor,
          socksColor: '#ffffff',
        }));
      } else {
        setKit((prev) => ({
          ...prev,
          primaryColor: currentClub.primaryColor,
          secondaryColor: currentClub.secondaryColor,
          shortsColor: currentClub.secondaryColor,
          socksColor: currentClub.primaryColor,
        }));
      }
    }
  };

  // Upload de Imagem de Logo ou Estampa
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setKit((prev) => ({
        ...prev,
        sponsorLogoUrl: base64,
      }));
      setStatusMessage('Logo / Estampa importada com sucesso!');
      setTimeout(() => setStatusMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Salvar no Clube Atual
  const handleSaveToClub = () => {
    const existingKits = currentClub.customKits || {
      home: {
        primaryColor: currentClub.primaryColor,
        secondaryColor: currentClub.secondaryColor,
        pattern: 'solid',
      },
      away: {
        primaryColor: currentClub.secondaryColor,
        secondaryColor: currentClub.primaryColor,
        pattern: 'solid',
      },
    };

    const updatedKits = {
      ...existingKits,
      [activeKitType]: kit,
    };

    updateClub(currentClub.id, {
      customKits: updatedKits,
      // Se for titular, também sincroniza cores base do clube
      ...(activeKitType === 'home' ? {
        primaryColor: kit.primaryColor,
        secondaryColor: kit.secondaryColor,
      } : {}),
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setStatusMessage(`Uniforme ${activeKitType === 'home' ? 'Titular' : 'Reserva'} salvo no ${currentClub.name}!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Exportar Kit (.json)
  const handleExportKitJson = () => {
    const kitData = {
      version: '1.0',
      clubName: currentClub.name,
      clubId: currentClub.id,
      kitType: activeKitType,
      kit,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(kitData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kit-${currentClub.shortName.toLowerCase()}-${activeKitType}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage('Arquivo JSON do uniforme exportado com sucesso!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Importar Kit (.json)
  const handleImportKitJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.kit) {
          setKit(parsed.kit);
          setStatusMessage(`Uniforme da comunidade "${parsed.kit.name || parsed.clubName || 'Personalizado'}" importado!`);
          setTimeout(() => setStatusMessage(null), 3500);
        }
      } catch {
        setStatusMessage('Erro ao ler arquivo JSON do uniforme.');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Aplicar Preset da Galeria
  const handleApplyPreset = (preset: typeof PRESET_KITS[0]) => {
    setKit(preset.kit);
    setStatusMessage(`Modelo "${preset.name}" aplicado! Clique em "Salvar no Clube" para confirmar.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const filteredClubs = clubList.filter((c) =>
    c.name.toLowerCase().includes(searchClub.toLowerCase()) ||
    c.shortName.toLowerCase().includes(searchClub.toLowerCase()) ||
    (c.country && c.country.toLowerCase().includes(searchClub.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Alerta de Feedback */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
      )}

      {/* Grid Principal do Kit Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Seletor de Clube & Configurações de Estampa e Cores */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Seleção do Clube & Alternador Titular/Reserva */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Customização Oficial
                </span>
                <h3 className="font-display text-xl font-black text-foreground">
                  Escolha o Clube e Tipo de Manto
                </h3>
              </div>

              {/* Botões Titular / Reserva */}
              <div className="flex items-center p-1 bg-secondary rounded-2xl border border-border">
                <button
                  type="button"
                  onClick={() => handleToggleKitType('home')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeKitType === 'home'
                      ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Titular (1º)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleKitType('away')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeKitType === 'away'
                      ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Reserva (2º)</span>
                </button>
              </div>
            </div>

            {/* Busca e Lista Rápida de Clubes */}
            <div className="space-y-2">
              <input
                type="text"
                value={searchClub}
                onChange={(e) => setSearchClub(e.target.value)}
                placeholder="Buscar clube (ex: Flamengo, Real Madrid, City, Milan...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                {filteredClubs.slice(0, 10).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectClub(c.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedClubId === c.id
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                        : 'border-border bg-secondary/60 hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    <ClubBadge
                      primaryColor={c.primaryColor}
                      secondaryColor={c.secondaryColor}
                      shortName={c.shortName}
                      size="sm"
                    />
                    <span>{c.name}</span>
                    {c.countryFlag && <span className="text-[11px]">{c.countryFlag}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Estampa do Manto (Kit Patterns) */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h4 className="font-display text-base font-black text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Estampa e Padrão da Camisa
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {KIT_PATTERNS.map((p) => {
                const isSelected = kit.pattern === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setKit({ ...kit, pattern: p.id })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                        : 'border-border bg-secondary/50 hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    <span className="text-xl p-2 rounded-xl bg-card border border-border shrink-0">
                      {p.icon}
                    </span>
                    <div className="min-w-0">
                      <h5 className="font-display text-xs font-black text-foreground truncate">
                        {p.label}
                      </h5>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Seletor de Cores e Detalhes */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h4 className="font-display text-base font-black text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              Paleta de Cores do Uniforme
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Cor Primária */}
              <div className="p-3 rounded-2xl bg-secondary/60 border border-border space-y-1.5">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                  Cor Principal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kit.primaryColor}
                    onChange={(e) => setKit({ ...kit, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-border shrink-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={kit.primaryColor}
                    onChange={(e) => setKit({ ...kit, primaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold bg-transparent border-none text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Cor Secundária */}
              <div className="p-3 rounded-2xl bg-secondary/60 border border-border space-y-1.5">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                  Listras / Faixas
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kit.secondaryColor}
                    onChange={(e) => setKit({ ...kit, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-border shrink-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={kit.secondaryColor}
                    onChange={(e) => setKit({ ...kit, secondaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold bg-transparent border-none text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Calção */}
              <div className="p-3 rounded-2xl bg-secondary/60 border border-border space-y-1.5">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                  Calção
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kit.shortsColor || kit.secondaryColor}
                    onChange={(e) => setKit({ ...kit, shortsColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-border shrink-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={kit.shortsColor || kit.secondaryColor}
                    onChange={(e) => setKit({ ...kit, shortsColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold bg-transparent border-none text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Meiões */}
              <div className="p-3 rounded-2xl bg-secondary/60 border border-border space-y-1.5">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                  Meiões
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kit.socksColor || kit.primaryColor}
                    onChange={(e) => setKit({ ...kit, socksColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-border shrink-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={kit.socksColor || kit.primaryColor}
                    onChange={(e) => setKit({ ...kit, socksColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold bg-transparent border-none text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Patrocinador Master & Tipo de Gola */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                  Patrocinador Master (Texto no Peito)
                </label>
                <input
                  type="text"
                  value={kit.sponsorText || ''}
                  onChange={(e) => setKit({ ...kit, sponsorText: e.target.value })}
                  placeholder="Ex: FLY EMIRATES, PIXBET, BETANO"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                  Estilo de Gola
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['round', 'v_neck', 'polo'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setKit({ ...kit, collarType: g })}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        kit.collarType === g
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                          : 'border-border bg-secondary/50 text-muted-foreground'
                      }`}
                    >
                      {g === 'round' ? 'Redonda' : g === 'v_neck' ? 'Gola V' : 'Polo'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload de Imagem de Logo / Estampa */}
            <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Estampa ou Logo Customizado (PNG / WebP / SVG)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Suba sua própria estampa ou logotipo da comunidade
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subir Imagem</span>
                </button>

                {kit.sponsorLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setKit({ ...kit, sponsorLogoUrl: undefined })}
                    className="px-2.5 py-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-black cursor-pointer hover:bg-rose-500/25"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Preview do Uniforme em SVG Realista + Ações da Comunidade */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card de Preview da Camisa */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-card to-secondary border border-border shadow-xl text-center space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <ClubBadge
                  primaryColor={kit.primaryColor}
                  secondaryColor={kit.secondaryColor}
                  shortName={currentClub.shortName}
                  size="sm"
                />
                <div className="text-left">
                  <h4 className="font-display text-sm font-black text-foreground">{currentClub.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">
                    Manto {activeKitType === 'home' ? 'Titular Oficial' : 'Reserva Oficial'}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                HD Preview
              </span>
            </div>

            {/* SVG REALISTA DA CAMISA COM ESTAMPA E PATROCÍNIO */}
            <div className="w-56 h-64 mx-auto relative flex items-center justify-center drop-shadow-2xl">
              <svg viewBox="0 0 200 220" className="w-full h-full">
                <defs>
                  {/* Gradiente do Degradê Moderno */}
                  <linearGradient id="kitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={kit.primaryColor} />
                    <stop offset="100%" stopColor={kit.secondaryColor} />
                  </linearGradient>

                  {/* Sombra de dobra atlética */}
                  <linearGradient id="kitShadow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
                  </linearGradient>

                  {/* Padrão de Listras Verticais */}
                  <pattern id="patStripesV" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="10" height="20" fill={kit.primaryColor} />
                    <rect x="10" y="0" width="10" height="20" fill={kit.secondaryColor} />
                  </pattern>

                  {/* Padrão de Listras Horizontais */}
                  <pattern id="patStripesH" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="20" height="10" fill={kit.primaryColor} />
                    <rect x="0" y="10" width="20" height="10" fill={kit.secondaryColor} />
                  </pattern>

                  {/* Padrão Xadrez */}
                  <pattern id="patCheckered" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="10" height="10" fill={kit.primaryColor} />
                    <rect x="10" y="0" width="10" height="10" fill={kit.secondaryColor} />
                    <rect x="0" y="10" width="10" height="10" fill={kit.secondaryColor} />
                    <rect x="10" y="10" width="10" height="10" fill={kit.primaryColor} />
                  </pattern>

                  {/* Clip da Silhueta da Camisa */}
                  <clipPath id="shirtClip">
                    <path d="M60 20 L20 45 L40 85 L65 70 L65 175 L135 175 L135 70 L160 85 L180 45 L140 20 Q100 35 60 20 Z" />
                  </clipPath>
                </defs>

                {/* Sombra da Camisa */}
                <path
                  d="M60 22 L20 47 L40 87 L65 72 L65 177 L135 177 L135 72 L160 87 L180 47 L140 22 Q100 37 60 22 Z"
                  fill="rgba(0,0,0,0.3)"
                />

                {/* Corpo Base da Camisa */}
                <g clipPath="url(#shirtClip)">
                  {/* Fundo Principal */}
                  <rect
                    x="0"
                    y="0"
                    width="200"
                    height="200"
                    fill={
                      kit.pattern === 'gradient'
                        ? 'url(#kitGrad)'
                        : kit.pattern === 'stripes_v'
                        ? 'url(#patStripesV)'
                        : kit.pattern === 'stripes_h'
                        ? 'url(#patStripesH)'
                        : kit.pattern === 'checkered'
                        ? 'url(#patCheckered)'
                        : kit.primaryColor
                    }
                  />

                  {/* Estampa Meio a Meio */}
                  {kit.pattern === 'half_and_half' && (
                    <rect x="100" y="0" width="100" height="200" fill={kit.secondaryColor} />
                  )}

                  {/* Estampa Faixa Diagonal (Vasco / River Plate) */}
                  {kit.pattern === 'diagonal_sash' && (
                    <polygon
                      points="40,20 80,20 160,180 120,180"
                      fill={kit.secondaryColor}
                    />
                  )}

                  {/* Sombreamento Lateral Tridimensional */}
                  <rect x="0" y="0" width="200" height="200" fill="url(#kitShadow)" />

                  {/* Mangas com cor secundária */}
                  <path d="M20 45 L40 85 L50 80 L30 40 Z" fill={kit.secondaryColor} opacity="0.6" />
                  <path d="M180 45 L160 85 L150 80 L170 40 Z" fill={kit.secondaryColor} opacity="0.6" />
                </g>

                {/* Borda Externa da Camisa */}
                <path
                  d="M60 20 L20 45 L40 85 L65 70 L65 175 L135 175 L135 70 L160 85 L180 45 L140 20 Q100 35 60 20 Z"
                  fill="none"
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.5"
                />

                {/* Gola da Camisa */}
                {kit.collarType === 'v_neck' ? (
                  <polygon points="85,22 100,42 115,22 100,32" fill={kit.detailColor || '#ffffff'} stroke="#000000" strokeWidth="0.5" />
                ) : kit.collarType === 'polo' ? (
                  <g fill={kit.detailColor || '#ffffff'}>
                    <polygon points="85,20 100,35 115,20 100,24" />
                    <line x1="100" y1="35" x2="100" y2="50" stroke="#000000" strokeWidth="1" />
                  </g>
                ) : (
                  <path d="M85 22 Q100 38 115 22" fill="none" stroke={kit.detailColor || '#ffffff'} strokeWidth="3" />
                )}

                {/* Escudo do Clube no Peito Esquerdo */}
                <circle cx="80" cy="55" r="7" fill={kit.primaryColor} stroke="#ffffff" strokeWidth="1" />
                <text x="80" y="58" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle">
                  {currentClub.shortName.slice(0, 3)}
                </text>

                {/* Logo da Marca no Peito Direito */}
                <path d="M115 53 Q120 57 125 54" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                {/* Patrocinador Master */}
                {kit.sponsorLogoUrl ? (
                  <image href={kit.sponsorLogoUrl} x="70" y="85" width="60" height="22" preserveAspectRatio="xMidYMid meet" />
                ) : kit.sponsorText ? (
                  <text
                    x="100"
                    y="100"
                    fill={kit.detailColor || '#ffffff'}
                    fontSize="9"
                    fontWeight="900"
                    letterSpacing="1"
                    textAnchor="middle"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {kit.sponsorText}
                  </text>
                ) : null}

                {/* Número 10 Estilizado nas Costas/Frente */}
                <text
                  x="100"
                  y="145"
                  fill={kit.detailColor || '#ffffff'}
                  fontSize="22"
                  fontWeight="900"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  opacity="0.85"
                >
                  10
                </text>
              </svg>
            </div>

            {/* Calção e Meiões Coordenados */}
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <span className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: kit.shortsColor || kit.secondaryColor }} />
                <span>Calção</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <span className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: kit.socksColor || kit.primaryColor }} />
                <span>Meiões</span>
              </div>
            </div>

            {/* Botão de Salvar no Clube */}
            <button
              type="button"
              onClick={handleSaveToClub}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Salvar Uniforme no {currentClub.name}
            </button>
          </div>

          {/* Card de Ações da Comunidade (Importar, Exportar & Presets Históricos) */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h4 className="font-display text-base font-black text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Kits Lendários da Comunidade
            </h4>

            {/* Presets Rápidos com 1 Clique */}
            <div className="space-y-2">
              {PRESET_KITS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: p.kit.primaryColor }}
                    />
                    <div>
                      <h5 className="text-xs font-black text-foreground">{p.name}</h5>
                      <span className="text-[10px] text-muted-foreground block">
                        {p.clubName} • por {p.author}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Aplicar
                  </span>
                </div>
              ))}
            </div>

            {/* Botões Importar / Exportar JSON */}
            <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
              <input
                type="file"
                ref={jsonImportRef}
                onChange={handleImportKitJson}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => jsonImportRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Importar (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleExportKitJson}
                className="py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exportar (.json)</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
