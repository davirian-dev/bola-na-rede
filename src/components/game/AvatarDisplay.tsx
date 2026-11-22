'use client';

import React from 'react';
import { CharacterAvatar } from '@/types/game';

interface AvatarDisplayProps {
  avatar?: CharacterAvatar;
  age?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clubPrimaryColor?: string;
  clubSecondaryColor?: string;
  className?: string;
}

/**
 * AvatarDisplay Oficial - Boneco Esportivo Estilo Cartoon / AAA
 * Geometria calibrada com traços anatômicos vivos e cabelos modernos.
 */
export function AvatarDisplay({
  avatar,
  age = 22,
  size = 'md',
  clubPrimaryColor = '#10b981',
  clubSecondaryColor = '#ffffff',
  className = '',
}: AvatarDisplayProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const safeColor = (c?: string, fallback: string = '#10b981') => {
    if (!c) return fallback;
    const trimmed = c.trim();
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed) ? trimmed : fallback;
  };

  const skinTone = safeColor(avatar?.skinTone, '#e0a96d');
  const hairStyle = avatar?.hairStyle || 'short';
  const rawHairColor = safeColor(avatar?.hairColor, '#18181b');
  const facialHair = avatar?.facialHair || 'none';
  const clothingStyle = avatar?.clothingStyle || 'jersey';
  const number = Math.max(1, Math.min(99, Math.round(Number(avatar?.jerseyNumber) || 10)));
  const primaryColor = safeColor(clubPrimaryColor, '#10b981');
  const secondaryColor = safeColor(clubSecondaryColor, '#ffffff');

  // Envelhecimento visual proporcional à idade do atleta/treinador
  const isYouth = age >= 16 && age <= 19;
  const isPrime = age >= 20 && age <= 29;
  const isExperienced = age >= 30 && age <= 36;
  const isVeteran = age >= 37 && age <= 47;
  const isLegend = age >= 48;

  // Cor do cabelo adaptada aos fios grisalhos com a maturidade
  let hairColor = rawHairColor;
  if (isLegend) {
    hairColor = rawHairColor === '#ffffff' ? '#ffffff' : '#e4e4e7'; // Majoritariamente prateado/branco
  } else if (isVeteran) {
    hairColor = rawHairColor === '#ffffff' ? '#ffffff' : '#71717a'; // Meio grisalho elegante
  }

  // Garante contraste das sobrancelhas e mechas caso o cabelo seja platinado/branco
  const isLightHair = hairColor === '#ffffff' || hairColor === '#f4f4f5' || hairColor === '#f5f5f5' || hairColor === '#e4e4e7';
  const eyebrowColor = isLightHair ? '#3f3f46' : hairColor;
  const hairBorderColor = isLightHair ? '#a1a1aa' : 'rgba(0,0,0,0.25)';

  return (
    <div className={`relative rounded-2xl overflow-hidden shrink-0 shadow-inner bg-gradient-to-b from-stone-900 to-zinc-950 flex items-center justify-center border border-border/50 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sombreamento sutil para pele */}
          <linearGradient id={`skinGrad_${skinTone.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor={skinTone} stopOpacity="0.88" />
          </linearGradient>
        </defs>

        {/* Fundo circular sutil esportivo */}
        <circle cx="50" cy="50" r="48" fill="#121214" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1" />

        {/* ============================================================ */}
        {/* CAMADA 1: CABELO TRASEIRO (Back Hair / Volume atrás da cabeça) */}
        {/* ============================================================ */}
        {hairStyle === 'afro' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.8">
            <circle cx="50" cy="32" r="19" />
            <circle cx="36" cy="35" r="11" />
            <circle cx="64" cy="35" r="11" />
            {/* Cachos estilizados */}
            <circle cx="38" cy="25" r="5" fill="#ffffff" opacity="0.15" stroke="none" />
            <circle cx="60" cy="26" r="4" fill="#ffffff" opacity="0.15" stroke="none" />
          </g>
        )}

        {hairStyle === 'dreads' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.8">
            <circle cx="50" cy="32" r="18" />
            {/* Tranças caindo atrás dos ombros */}
            <rect x="25" y="38" width="5.5" height="26" rx="2.5" />
            <rect x="32" y="35" width="5.5" height="30" rx="2.5" />
            <rect x="62.5" y="35" width="5.5" height="30" rx="2.5" />
            <rect x="69.5" y="38" width="5.5" height="26" rx="2.5" />
            {/* Anéis dourados nas pontas */}
            <rect x="25" y="55" width="5.5" height="2.5" rx="0.5" fill="#f59e0b" stroke="none" />
            <rect x="69.5" y="55" width="5.5" height="2.5" rx="0.5" fill="#f59e0b" stroke="none" />
          </g>
        )}

        {/* ============================================================ */}
        {/* CAMADA 2: PESCOÇO E VESTIMENTA (Ombros, Camisa/Terno)        */}
        {/* ============================================================ */}
        {/* Pescoço atlético */}
        <path d="M43 56 L43 73 Q50 76 57 73 L57 56 Z" fill={skinTone} />
        {/* Sombra sob o queixo */}
        <path d="M43 56 Q50 62 57 56 L57 60 Q50 65 43 60 Z" fill="rgba(0,0,0,0.18)" />

        {/* Vestimentas Oficiais */}
        {clothingStyle === 'suit' ? (
          // Terno Alinhado de Comandante Técnico
          <g>
            <path d="M16 95 Q50 67 84 95 Z" fill="#27272a" />
            <path d="M40 73 L50 95 L60 73 Z" fill="#ffffff" />
            <path d="M48 76 L52 76 L51 95 L49 95 Z" fill="#dc2626" />
            <path d="M26 88 L44 75 L40 95 Z" fill="#18181b" />
            <path d="M74 88 L56 75 L60 95 Z" fill="#18181b" />
          </g>
        ) : clothingStyle === 'tracksuit' ? (
          // Agasalho Esportivo de Treino
          <g>
            <path d="M16 95 Q50 67 84 95 Z" fill="#0284c7" />
            <path d="M48 73 L52 73 L52 95 L48 95 Z" fill="#ffffff" />
            <circle cx="34" cy="85" r="3" fill="#ffffff" />
          </g>
        ) : (
          // Camisa Oficial do Clube
          <g>
            <path d="M16 95 Q50 67 84 95 Z" fill={primaryColor} />
            <path d="M39 71 Q50 80 61 71 L61 74 Q50 83 39 74 Z" fill={secondaryColor} />
            <text
              x="50"
              y="91"
              fill={secondaryColor}
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {number}
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CAMADA 3: CABEÇA, MANDÍBULA E ORELHAS ANATÔMICAS             */}
        {/* ============================================================ */}
        {/* Orelha Esquerda */}
        <path d="M32 42 Q28 42 28 47 Q28 53 33 52" fill={skinTone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.7" />
        <path d="M30.5 45 Q31.5 47 30.5 50" stroke="rgba(0,0,0,0.2)" strokeWidth="0.7" fill="none" />

        {/* Orelha Direita */}
        <path d="M68 42 Q72 42 72 47 Q72 53 67 52" fill={skinTone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.7" />
        <path d="M69.5 45 Q68.5 47 69.5 50" stroke="rgba(0,0,0,0.2)" strokeWidth="0.7" fill="none" />

        {/* Cabeça e Mandíbula Atlética (formato esportivo moderno) */}
        <path
          d="M33 38 C33 24 67 24 67 38 C67 52 64 61 50 63 C36 61 33 52 33 38 Z"
          fill={skinTone}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.8"
        />

        {/* ============================================================ */}
        {/* CAMADA 4: CABELOS MODERNOS (JAMAIS DESCEM ABAIXO DE Y=33)    */}
        {/* ============================================================ */}
        {hairStyle === 'short' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.7">
            {/* Volume nas têmporas e topo com silhueta dinâmica */}
            <path d="M31 38 C31 20 40 16 52 16 C65 16 69 22 69 38 C66 33 62 33 57 31 C52 29 45 32 40 33 C35 34 33 36 31 38 Z" />
            {/* Mechas do topete */}
            <path d="M43 20 Q48 14 55 17 Q50 18 48 22 Z" />
            <path d="M52 18 Q58 13 64 18 Q58 19 55 23 Z" />
            {/* Brilho suave */}
            <path d="M42 22 Q50 19 58 22" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {hairStyle === 'undercut' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.7">
            {/* Laterais com fade disfarçado */}
            <path d="M33 38 C33 32 36 30 40 31 C37 34 35 37 33 38 Z" opacity="0.4" />
            <path d="M67 38 C67 32 64 30 60 31 C63 34 65 37 67 38 Z" opacity="0.4" />
            {/* Topete arrepiado alto */}
            <path d="M34 32 C34 16 45 13 52 13 C61 13 66 18 66 32 C62 29 55 28 50 28 C45 28 38 29 34 32 Z" />
            <path d="M46 17 Q52 10 58 14 Q53 16 50 19 Z" />
            {/* Risco navalhado estiloso */}
            <line x1="36" y1="34" x2="40" y2="30" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}

        {hairStyle === 'buzz' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.6">
            <path
              d="M33 38 C33 22 40 19 50 19 C60 19 67 22 67 38 C64 34 58 33 50 33 C42 33 36 34 33 38 Z"
              opacity="0.9"
            />
          </g>
        )}

        {hairStyle === 'afro' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.7">
            {/* Linha frontal do afro na testa */}
            <path d="M32 37 C34 32 42 31 50 31 C58 31 66 32 68 37 C63 34 57 33 50 33 C43 33 37 34 32 37 Z" />
          </g>
        )}

        {hairStyle === 'dreads' && (
          <g fill={hairColor} stroke={hairBorderColor} strokeWidth="0.7">
            {/* Base no topo da testa */}
            <path d="M32 37 C34 32 42 31 50 31 C58 31 66 32 68 37 C63 34 57 33 50 33 C43 33 37 34 32 37 Z" />
            {/* Mechas frontais estilizadas acima dos olhos */}
            <rect x="42" y="27" width="4" height="6" rx="1.5" />
            <rect x="48" y="26" width="4" height="7" rx="1.5" />
            <rect x="54" y="27" width="4" height="6" rx="1.5" />
          </g>
        )}

        {hairStyle === 'bald' && (
          // Brilho no topo do crânio
          <ellipse cx="46" cy="27" rx="4" ry="2" fill="rgba(255,255,255,0.22)" />
        )}

        {/* ============================================================ */}
        {/* CAMADA 5: TRAÇOS FACIAIS (Olhos, Sobrancelhas, Nariz, Boca)   */}
        {/* 100% Livres e Desimpedidos                                  */}
        {/* ============================================================ */}
        {/* Sobrancelhas Marcantes */}
        <path
          d="M38 38.5 Q43 36 47 38"
          stroke={eyebrowColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M53 38 Q57 36 62 38.5"
          stroke={eyebrowColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Olhos Vivos de Craque */}
        {/* Olho Esquerdo */}
        <ellipse cx="42.5" cy="44.5" rx="3.6" ry="3" fill="#ffffff" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <circle cx="42.8" cy="44.5" r="2" fill="#1e293b" />
        <circle cx="43" cy="44.5" r="1.1" fill="#020617" />
        <circle cx="43.8" cy="43.6" r="0.7" fill="#ffffff" />

        {/* Olho Direito */}
        <ellipse cx="57.5" cy="44.5" rx="3.6" ry="3" fill="#ffffff" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <circle cx="57.2" cy="44.5" r="2" fill="#1e293b" />
        <circle cx="57" cy="44.5" r="1.1" fill="#020617" />
        <circle cx="58" cy="43.6" r="0.7" fill="#ffffff" />

        {/* Nariz Atlético */}
        <path
          d="M50 43 L48.2 50.5 Q50 52 51.8 50.5"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Sorriso Confiante */}
        <path
          d="M44 56.5 Q50 61.5 56 56.5"
          stroke="#991b1b"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M45.5 56.5 Q50 59.8 54.5 56.5"
          fill="#ffffff"
        />

        {/* ============================================================ */}
        {/* ENVELHECIMENTO PROGRESSIVO                                   */}
        {/* ============================================================ */}
        {/* Linhas de expressão na testa para veteranos */}
        {(isExperienced || isVeteran || isLegend) && (
          <g stroke="rgba(0,0,0,0.2)" strokeWidth="0.9" strokeLinecap="round" fill="none">
            <path d="M43 34 Q50 32.5 57 34" />
            {isLegend && <path d="M44 31 Q50 29.5 56 31" stroke="rgba(0,0,0,0.25)" />}
          </g>
        )}

        {/* Pés de galinha nos olhos */}
        {(isVeteran || isLegend) && (
          <g stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" strokeLinecap="round" fill="none">
            <path d="M38 45 L35 44" />
            <path d="M62 45 L65 44" />
          </g>
        )}

        {/* Óculos clássicos de comandante lendário (48+ anos) */}
        {isLegend && (
          <g stroke="#d4d4d8" strokeWidth="1.2" fill="none">
            <rect x="37" y="41" width="11" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
            <rect x="52" y="41" width="11" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
            <path d="M48 44 Q50 43 52 44" />
            <path d="M37 43 L32 44" />
            <path d="M63 43 L68 44" />
          </g>
        )}

        {/* ============================================================ */}
        {/* CAMADA 6: BARBA E BIGODE COM ENCAIXE ANATÔMICO               */}
        {/* ============================================================ */}
        {facialHair === 'stubble' && (
          <path
            d="M34 49 C34 59 40 62 50 63 C60 62 66 59 66 49 C62 54 56 55 50 55 C44 55 38 54 34 49 Z"
            fill="rgba(0,0,0,0.24)"
            opacity={isYouth ? 0.45 : 1}
          />
        )}

        {facialHair === 'beard' && (
          <g fill={hairColor} opacity={isYouth ? 0.45 : 0.95}>
            {/* Barba na mandíbula */}
            <path
              d="M33 47 C33 59 39 63 50 64 C61 63 67 59 67 47 C63 53 57 55 50 55 C43 55 37 53 33 47 Z"
            />
            {/* Bigode integrado sem cobrir lábio */}
            <path d="M44 53.5 Q50 51.5 56 53.5 Q50 55.5 44 53.5 Z" />
            {/* Fios grisalhos para veteranos */}
            {(isVeteran || isLegend) && (
              <path
                d="M46 62 Q50 65 54 62"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
                fill="none"
              />
            )}
          </g>
        )}

        {facialHair === 'mustache' && (
          <path
            d="M44 53.5 Q50 51.5 56 53.5 Q50 55.5 44 53.5 Z"
            fill={hairColor}
            opacity={isYouth ? 0.45 : 1}
          />
        )}
      </svg>
    </div>
  );
}
