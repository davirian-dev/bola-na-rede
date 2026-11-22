'use client';

import React from 'react';
import { AvatarDisplay } from '@/components/game/AvatarDisplay';
import { CharacterAvatar as CharacterAvatarType } from '@/types/game';

interface CharacterAvatarProps {
  avatar?: CharacterAvatarType;
  age?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clubPrimaryColor?: string;
  clubSecondaryColor?: string;
  className?: string;
}

/**
 * Componente oficial de Avatar com Envelhecimento Progressivo Automático por Idade.
 */
export function CharacterAvatar({
  avatar,
  age = 22,
  size = 'md',
  clubPrimaryColor = '#10b981',
  clubSecondaryColor = '#ffffff',
  className = '',
}: CharacterAvatarProps) {
  return (
    <AvatarDisplay
      avatar={avatar}
      age={age}
      size={size}
      clubPrimaryColor={clubPrimaryColor}
      clubSecondaryColor={clubSecondaryColor}
      className={className}
    />
  );
}

export default CharacterAvatar;
