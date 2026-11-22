'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CharacterAvatar } from '@/types/game';
import { AvatarDisplay } from './AvatarDisplay';
import { useGameStore } from '@/store/gameStore';
import { Sparkles, Check, X, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AvatarCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAvatar?: CharacterAvatar;
  onSave?: (avatar: CharacterAvatar) => void;
  characterName?: string;
  clubName?: string;
  clubPrimaryColor?: string;
  clubSecondaryColor?: string;
}

const SKIN_TONES = [
  { label: 'Marfim Claro', hex: '#fde5d2' },
  { label: 'Clara Natural', hex: '#f5cba7' },
  { label: 'Média / Parda', hex: '#c68b59' },
  { label: 'Morena / Bronze', hex: '#9e673a' },
  { label: 'Negra', hex: '#6a3b1f' },
  { label: 'Negra Retinta', hex: '#3a1e12' },
];

const HAIR_STYLES = [
  { id: 'short', label: 'Curto Clássico' },
  { id: 'undercut', label: 'Degradê / Disfarçado' },
  { id: 'buzz', label: 'Raspado / Militar' },
  { id: 'afro', label: 'Black Power / Afro' },
  { id: 'dreads', label: 'Dreads / Tranças' },
  { id: 'bald', label: 'Careca' },
] as const;

const HAIR_COLORS = [
  { label: 'Preto Natural', hex: '#18181b' },
  { label: 'Castanho Escuro', hex: '#3e2723' },
  { label: 'Castanho Dourado', hex: '#795548' },
  { label: 'Loiro Dourado', hex: '#d4a373' },
  { label: 'Platinado / Nevou', hex: '#f4f4f5' },
  { label: 'Ruivo / Acobreado', hex: '#991b1b' },
  { label: 'Azul Real (Ousado)', hex: '#2563eb' },
  { label: 'Verde Neon (Craque)', hex: '#10b981' },
];

const FACIAL_HAIR = [
  { id: 'none', label: 'Sem Barba' },
  { id: 'stubble', label: 'Barba Sombreada' },
  { id: 'beard', label: 'Barba Completa' },
  { id: 'mustache', label: 'Bigode' },
] as const;

export function AvatarCreatorModal({
  isOpen,
  onClose,
  initialAvatar,
  onSave,
  characterName,
  clubName,
  clubPrimaryColor,
  clubSecondaryColor,
}: AvatarCreatorModalProps) {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);

  const activeClubId = mode === 'player' ? playerProfile?.clubId : managerProfile?.clubId;
  const currentClub = activeClubId ? clubs[activeClubId] : null;

  const [avatar, setAvatar] = useState<CharacterAvatar>(
    initialAvatar ||
    playerProfile?.avatar ||
    managerProfile?.avatar || {
      skinTone: '#c68b59',
      hairStyle: 'short',
      hairColor: '#18181b',
      facialHair: 'none',
      clothingStyle: mode === 'manager' ? 'suit' : 'jersey',
      jerseyNumber: playerProfile?.jerseyNumber || 10,
    }
  );

  const [mounted, setMounted] = useState(false);
  const [previewAge, setPreviewAge] = useState<number>(
    mode === 'player' ? (playerProfile?.age || 18) : (managerProfile?.age || 42)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trava scroll da página ao abrir modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Sincroniza quando initialAvatar ou isOpen mudar
  useEffect(() => {
    if (initialAvatar) {
      setAvatar(initialAvatar);
    }
  }, [initialAvatar, isOpen]);

  if (!isOpen || !mounted) return null;

  const displayName = characterName || (mode === 'player' ? playerProfile?.name : managerProfile?.name) || 'Seu Personagem';
  const displayClub = clubName || currentClub?.name || 'Clube Profissional';
  const primaryCol = clubPrimaryColor || currentClub?.primaryColor || '#10b981';
  const secondaryCol = clubSecondaryColor || currentClub?.secondaryColor || '#ffffff';

  const handleSave = () => {
    // Salva no Zustand
    if (mode === 'player' && playerProfile) {
      useGameStore.setState({
        playerProfile: {
          ...playerProfile,
          avatar,
        },
      });
    } else if (managerProfile) {
      useGameStore.setState({
        managerProfile: {
          ...managerProfile,
          avatar,
        },
      });
    }

    onSave?.(avatar);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 text-foreground border border-border/80 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <User className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display text-base font-black text-foreground">
                Personalização Visual do Personagem
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Customize seu tom de pele, cabelo, barba e estilo de uniforme
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prévia do Avatar Central com Nome, Clube e Envelhecimento */}
        <div className="flex flex-col items-center justify-center py-4 bg-secondary/40 rounded-2xl border border-border/60 mb-5 relative">
          <AvatarDisplay
            avatar={avatar}
            age={previewAge}
            size="xl"
            clubPrimaryColor={primaryCol}
            clubSecondaryColor={secondaryCol}
          />
          <span className="text-sm font-black text-foreground mt-2.5">
            {displayName}
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            {displayClub}
          </span>

          {/* Controle de Prévia de Idade / Envelhecimento */}
          <div className="w-full px-4 sm:px-8 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Simulação de Envelhecimento:
              </span>
              <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {previewAge} anos {previewAge <= 19 ? '• Promessa' : previewAge <= 29 ? '• Auge' : previewAge <= 36 ? '• Experiente' : previewAge <= 47 ? '• Veterano' : '• Comandante'}
              </span>
            </div>

            <input
              type="range"
              min={16}
              max={65}
              value={previewAge}
              onChange={(e) => setPreviewAge(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-secondary rounded-lg"
            />

            <div className="flex items-center justify-between gap-1 mt-2">
              {[17, 24, 34, 42, 55].map((agePreset) => (
                <button
                  key={agePreset}
                  type="button"
                  onClick={() => setPreviewAge(agePreset)}
                  className={`text-[10px] font-bold py-1 px-2 rounded-lg border transition-all cursor-pointer ${
                    previewAge === agePreset
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-500 font-black'
                      : 'bg-secondary/60 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {agePreset}a
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opções de Customização */}
        <div className="space-y-4">
          {/* 1. Tom de Pele */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-2">
              Tom de Pele
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {SKIN_TONES.map((t) => (
                <button
                  key={t.hex}
                  type="button"
                  onClick={() => setAvatar({ ...avatar, skinTone: t.hex })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer shrink-0 ${
                    avatar.skinTone === t.hex ? 'border-emerald-500 scale-110 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/30' : 'border-border'
                  }`}
                  style={{ backgroundColor: t.hex }}
                  title={t.label}
                />
              ))}
            </div>
          </div>

          {/* 2. Estilo de Cabelo */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-2">
              Corte de Cabelo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HAIR_STYLES.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setAvatar({ ...avatar, hairStyle: h.id })}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    avatar.hairStyle === h.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                      : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cor do Cabelo */}
          {avatar.hairStyle !== 'bald' && (
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-2">
                Cor do Cabelo
              </label>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, hairColor: c.hex })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer shrink-0 ${
                      avatar.hairColor === c.hex ? 'border-emerald-500 scale-110 shadow-md ring-2 ring-emerald-500/30' : 'border-border'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 4. Barba & Bigode */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-2">
              Barba & Bigode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FACIAL_HAIR.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAvatar({ ...avatar, facialHair: f.id })}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    avatar.facialHair === f.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                      : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Estilo de Roupa */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-2">
              Vestimenta
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAvatar({ ...avatar, clothingStyle: 'jersey' })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  avatar.clothingStyle === 'jersey'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                    : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                }`}
              >
                👕 Camisa do Clube
              </button>
              <button
                type="button"
                onClick={() => setAvatar({ ...avatar, clothingStyle: 'suit' })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  avatar.clothingStyle === 'suit'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                    : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                }`}
              >
                👔 Terno de Técnico
              </button>
              <button
                type="button"
                onClick={() => setAvatar({ ...avatar, clothingStyle: 'tracksuit' })}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  avatar.clothingStyle === 'tracksuit'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                    : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                }`}
              >
                🧥 Agasalho de Treino
              </button>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            Salvar Aparência
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
