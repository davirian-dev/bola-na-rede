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

  // Garante contraste das sobrancelhas caso o cabelo seja platinado/branco
  const isLightHair = hairColor === '#ffffff' || hairColor === '#f4f4f5' || hairColor === '#f5f5f5' || hairColor === '#e4e4e7';
  const eyebrowColor = isLightHair ? '#52525b' : hairColor;

  return (
    <div className={`relative rounded-2xl overflow-hidden shrink-0 shadow-inner bg-gradient-to-b from-stone-900 to-zinc-950 flex items-center justify-center border border-border/50 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fundo sutil esportivo */}
        <circle cx="50" cy="50" r="48" fill="#121214" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* ============================================================ */}
        {/* CAMADA 1: CABELO TRASEIRO (Back Hair) - Volume atrás da cabeça */}
        {/* ============================================================ */}
        {hairStyle === 'afro' && (
          <g fill={hairColor}>
            <circle cx="50" cy="40" r="23" />
            <circle cx="34" cy="41" r="13" />
            <circle cx="66" cy="41" r="13" />
            <circle cx="50" cy="24" r="13" />
            {/* Textura sutil do afro */}
            <circle cx="38" cy="28" r="6" opacity="0.3" fill="#ffffff" />
            <circle cx="60" cy="29" r="5" opacity="0.2" fill="#ffffff" />
          </g>
        )}

        {hairStyle === 'dreads' && (
          <g fill={hairColor}>
            <circle cx="50" cy="38" r="21" />
            {/* Tranças caindo atrás dos ombros */}
            <rect x="25" y="38" width="6" height="28" rx="3" />
            <rect x="32" y="34" width="6" height="34" rx="3" />
            <rect x="62" y="34" width="6" height="34" rx="3" />
            <rect x="69" y="38" width="6" height="28" rx="3" />
            {/* Anéis decorativos dourados nas tranças */}
            <rect x="25" y="49" width="6" height="2" rx="0.5" fill="#f59e0b" />
            <rect x="69" y="49" width="6" height="2" rx="0.5" fill="#f59e0b" />
          </g>
        )}

        {/* ============================================================ */}
        {/* CAMADA 2: PESCOÇO E VESTIMENTA (Ombros, Camisa/Terno) */}
        {/* ============================================================ */}
        {/* Pescoço com tom de pele */}
        <rect x="44" y="58" width="12" height="17" fill={skinTone} rx="2" />
        {/* Sombra suave sob o queixo */}
        <path d="M44 60 Q50 64 56 60 L56 63 Q50 66 44 63 Z" fill="rgba(0,0,0,0.18)" />

        {/* Roupas */}
        {clothingStyle === 'suit' ? (
          // Terno de Treinador
          <g>
            <path d="M15 95 Q50 68 85 95 Z" fill="#27272a" />
            <path d="M40 76 L50 95 L60 76 Z" fill="#ffffff" />
            <path d="M47 80 L53 80 L51 95 L49 95 Z" fill="#dc2626" />
            <path d="M25 88 L44 76 L40 95 Z" fill="#18181b" />
            <path d="M75 88 L56 76 L60 95 Z" fill="#18181b" />
          </g>
        ) : clothingStyle === 'tracksuit' ? (
          // Agasalho de Treino
          <g>
            <path d="M15 95 Q50 68 85 95 Z" fill="#0284c7" />
            <path d="M48 76 L52 76 L52 95 L48 95 Z" fill="#ffffff" />
            <circle cx="34" cy="86" r="3" fill="#ffffff" />
          </g>
        ) : (
          // Camisa Oficial do Clube
          <g>
            <path d="M15 95 Q50 68 85 95 Z" fill={primaryColor} />
            <path d="M40 74 Q50 82 60 74 Z" fill={secondaryColor} />
            <text
              x="50"
              y="93"
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
        {/* CAMADA 3: CABEÇA, MANDÍBULA E ORELHAS */}
        {/* ============================================================ */}
        {/* Orelhas com detalhe anatômico */}
        <circle cx="31.5" cy="48" r="4.5" fill={skinTone} />
        <path d="M31 46 Q33 48 31 50" stroke="rgba(0,0,0,0.18)" strokeWidth="1" fill="none" />

        <circle cx="68.5" cy="48" r="4.5" fill={skinTone} />
        <path d="M69 46 Q67 48 69 50" stroke="rgba(0,0,0,0.18)" strokeWidth="1" fill="none" />

        {/* Formato do Rosto e Mandíbula */}
        <path
          d="M33 46 Q33 30 50 29 Q67 30 67 46 Q67 63 50 64 Q33 63 33 46 Z"
          fill={skinTone}
        />

        {/* ============================================================ */}
        {/* CAMADA 4: CABELO FRONTAL (Front Hair / Franja / Topo) */}
        {/* Nota: NUNCA desce abaixo de y=39 para JAMAIS cobrir olhos */}
        {/* ============================================================ */}
        {hairStyle === 'short' && (
          <g fill={hairColor}>
            <path d="M32 44 Q31 25 50 24 Q69 25 68 44 Q60 36 50 37 Q40 36 32 44 Z" />
            <path d="M38 31 Q50 28 62 31" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {hairStyle === 'undercut' && (
          <g fill={hairColor}>
            {/* Laterais disfarçadas */}
            <path d="M33 46 Q32 38 36 36 Q50 37 64 36 Q68 38 67 46 Z" opacity="0.35" />
            {/* Topete arrepiado moderno */}
            <path d="M35 38 Q33 22 51 21 Q67 22 65 38 Q55 33 45 34 Z" />
            {/* Risco na régua estiloso */}
            <path d="M36 41 L40 37" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        )}

        {hairStyle === 'buzz' && (
          <path
            d="M33 45 Q32 28 50 27 Q68 28 67 45 Q58 37 50 37 Q42 37 33 45 Z"
            fill={hairColor}
            opacity="0.85"
          />
        )}

        {hairStyle === 'afro' && (
          <path
            d="M32 44 Q31 24 50 23 Q69 24 68 44 Q60 36 50 36 Q40 36 32 44 Z"
            fill={hairColor}
          />
        )}

        {hairStyle === 'dreads' && (
          <g fill={hairColor}>
            {/* Contorno frontal no topo da testa */}
            <path d="M32 43 Q31 25 50 24 Q69 25 68 43 Q60 37 50 37 Q40 37 32 43 Z" />
            {/* Mechas frontais estilizadas acima dos olhos */}
            <rect x="41" y="30" width="4.5" height="9" rx="2" />
            <rect x="47" y="29" width="4.5" height="10" rx="2" />
            <rect x="54" y="30" width="4.5" height="9" rx="2" />
          </g>
        )}

        {hairStyle === 'bald' && (
          // Brilho no topo do crânio
          <ellipse cx="46" cy="33" rx="4" ry="2" fill="rgba(255,255,255,0.2)" />
        )}

        {/* ============================================================ */}
        {/* CAMADA 5: TRAÇOS FACIAIS (Olhos, Sobrancelhas, Nariz e Boca) */}
        {/* Sempre 100% visíveis, sem nunca serem cobertos por cabelo */}
        {/* ============================================================ */}
        {/* Olhos Vivos com Esclera Branca e Pupila Nítida */}
        <ellipse cx="43" cy="46.5" rx="3.2" ry="2.6" fill="#ffffff" />
        <ellipse cx="57" cy="46.5" rx="3.2" ry="2.6" fill="#ffffff" />
        <circle cx="43.2" cy="46.5" r="1.8" fill="#18181b" />
        <circle cx="57.2" cy="46.5" r="1.8" fill="#18181b" />
        {/* Brilho nos olhos */}
        <circle cx="44" cy="45.8" r="0.7" fill="#ffffff" />
        <circle cx="58" cy="45.8" r="0.7" fill="#ffffff" />

        {/* Sobrancelhas expressivas com cor contrastante segura */}
        <path
          d="M38.5 42 Q42.5 39.5 47 41.5"
          stroke={eyebrowColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M53 41.5 Q57.5 39.5 61.5 42"
          stroke={eyebrowColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nariz Atlético */}
        <path
          d="M50 46 L48.2 52.5 Q50 54 51.8 52.5"
          stroke="rgba(0,0,0,0.24)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Boca e Sorriso de Craque */}
        <path
          d="M44 58 Q50 63 56 58"
          stroke="#991b1b"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M45.5 58 Q50 61.5 54.5 58"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* ============================================================ */}
        {/* ENVELHECIMENTO VISUAL PROGRESSIVO (Rugas, Expressão e Óculos) */}
        {/* ============================================================ */}
        {/* Fios grisalhos nas têmporas (30 a 47 anos) */}
        {(isExperienced || isVeteran) && hairStyle !== 'bald' && (
          <g stroke="rgba(228, 228, 231, 0.65)" strokeWidth="1" strokeLinecap="round" fill="none">
            <path d="M33 42 Q32 38 35 36" />
            <path d="M67 42 Q68 38 65 36" />
          </g>
        )}

        {/* Linhas de Expressão na Testa (30+ anos) */}
        {(isExperienced || isVeteran || isLegend) && (
          <g stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round" fill="none">
            <path d="M42 35 Q50 33.5 58 35" />
            {isLegend && <path d="M43 32 Q50 30.5 57 32" stroke="rgba(0,0,0,0.28)" />}
          </g>
        )}

        {/* Pés de Galinha nos Olhos (30+ anos) */}
        {(isExperienced || isVeteran || isLegend) && (
          <g stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" strokeLinecap="round" fill="none">
            <path d="M38 46 L35 45" />
            <path d="M38 47.5 L35 48.5" />
            <path d="M62 46 L65 45" />
            <path d="M62 47.5 L65 48.5" />
          </g>
        )}

        {/* Sulco Nasolabial de Maturidade (37+ anos) */}
        {(isVeteran || isLegend) && (
          <g stroke="rgba(0,0,0,0.16)" strokeWidth="1" strokeLinecap="round" fill="none">
            <path d="M44 54 Q43 57 44 60" />
            <path d="M56 54 Q57 57 56 60" />
          </g>
        )}

        {/* Óculos Clássicos de Treinador Lendário (48+ anos) */}
        {isLegend && (
          <g stroke="#d4d4d8" strokeWidth="1.2" fill="none">
            {/* Lente Esquerda */}
            <rect x="38" y="43" width="10" height="7.5" rx="2" fill="rgba(255,255,255,0.12)" />
            {/* Lente Direita */}
            <rect x="52" y="43" width="10" height="7.5" rx="2" fill="rgba(255,255,255,0.12)" />
            {/* Ponte Central */}
            <path d="M48 45.5 Q50 44.5 52 45.5" />
            {/* Hastes */}
            <path d="M38 45 L32 46" />
            <path d="M62 45 L68 46" />
          </g>
        )}

        {/* ============================================================ */}
        {/* CAMADA 6: BARBA E BIGODE */}
        {/* ============================================================ */}
        {facialHair === 'stubble' && (
          <path
            d="M36 51 Q50 68 64 51 Q50 63 36 51"
            fill="rgba(0,0,0,0.22)"
            opacity={isYouth ? 0.45 : 1}
          />
        )}
        {facialHair === 'beard' && (
          <g fill={hairColor} opacity={isYouth ? 0.4 : 0.95}>
            <path
              d="M34 50 Q50 71 66 50 Q50 64 34 50"
            />
            {/* Bigode integrado à barba */}
            <path d="M43 55.5 Q50 53.5 57 55.5 Q50 57.5 43 55.5" />
            {/* Mechas grisalhas na barba para veteranos */}
            {(isVeteran || isLegend) && (
              <path
                d="M46 62 Q50 66 54 62"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
                fill="none"
              />
            )}
          </g>
        )}
        {facialHair === 'mustache' && (
          <path
            d="M43 55.5 Q50 53.5 57 55.5 Q50 57.5 43 55.5"
            fill={hairColor}
            opacity={isYouth ? 0.4 : 1}
          />
        )}
      </svg>
    </div>
  );
}
