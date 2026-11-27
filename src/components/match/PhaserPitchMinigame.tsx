'use client';

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Flag, Flame, RotateCcw, Send, Target, Trophy, X } from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { Division } from '@/types/game';
import { useMinigameBalance } from '@/engine/minigameBalance';
import { DifficultyBadge } from '@/components/game/DifficultyBadge';

export type PitchActionMode = 'shoot' | 'pass';

interface PhaserPitchMinigameProps {
  mode?: 'free' | 'training' | 'match_clutch';
  onGoal?: (viaPass: boolean) => void;
  onMiss?: () => void;
  onOffside?: () => void;
  onClose?: () => void;
  title?: string;
  divisionOverride?: Division;
  opponentOverall?: number;
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export default function PhaserPitchMinigame({
  mode = 'free',
  onGoal,
  onMiss,
  onOffside,
  onClose,
  title = 'Arena 2D — Bola na Rede',
  divisionOverride,
  opponentOverall,
  matchInfo,
}: PhaserPitchMinigameProps) {
  const balance = useMinigameBalance({
    division: divisionOverride,
    opponentOverall,
  });
  const balanceRef = useRef(balance);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  const containerRef = useRef<HTMLDivElement>(null);
  const actionModeRef = useRef<PitchActionMode>('shoot');
  const triggerQuickPassRef = useRef<(() => void) | null>(null);
  const resetMatchStatsRef = useRef<(() => void) | null>(null);

  const [challengeMode, setChallengeMode] = useState<'free' | 'challenge5'>('free');
  const [challengeDone, setChallengeDone] = useState(false);
  const challengeModeRef = useRef<'free' | 'challenge5'>('free');
  useEffect(() => {
    challengeModeRef.current = challengeMode;
  }, [challengeMode]);

  const [actionMode, setActionMode] = useState<PitchActionMode>('shoot');
  const [status, setStatus] = useState<
    'ready' | 'aiming' | 'shot' | 'passing' | 'pass_ok' | 'goal' | 'miss' | 'offside'
  >('ready');
  const [statusBanner, setStatusBanner] = useState('Arraste a bola para trás e solte!');
  const [isTeammateOffside, setIsTeammateOffside] = useState(false);
  const [hasAssistedThisPlay, setHasAssistedThisPlay] = useState(false);
  const [stats, setStats] = useState({
    goals: 0,
    assists: 0,
    offsides: 0,
    attempts: 0,
    streak: 0,
    bestStreak: 0,
  });
  const attemptsRef = useRef(0);

  const onGoalRef = useRef(onGoal);
  const onMissRef = useRef(onMiss);
  const onOffsideRef = useRef(onOffside);

  useEffect(() => {
    onGoalRef.current = onGoal;
    onMissRef.current = onMiss;
    onOffsideRef.current = onOffside;
  }, [onGoal, onMiss, onOffside]);

  const setModeSafe = (next: PitchActionMode) => {
    actionModeRef.current = next;
    setActionMode(next);
    sound.playUiClick();
    if (next === 'pass') {
      setStatusBanner('Modo PASSE: arraste em direção ao companheiro ou clique em "Tocar Agora"!');
    } else {
      setStatusBanner('Modo CHUTE: arraste a bola para trás e solte para finalizar!');
    }
  };

  useEffect(() => {
    let game: import('phaser').Game | null = null;
    let isMounted = true;

    async function initPhaser() {
      const Phaser = (await import('phaser')).default;
      if (!isMounted || !containerRef.current) return;

      const curBal = balanceRef.current;
      const WIDTH = 360;
      const HEIGHT = 540;
      const GOAL_WIDTH = Math.round(156 * Math.max(0.84, Math.min(1.16, curBal.sweetSpotScale)));
      const GOAL_LEFT = (WIDTH - GOAL_WIDTH) / 2;
      const GOAL_RIGHT = GOAL_LEFT + GOAL_WIDTH;
      const GOAL_Y = 26;

      class PitchScene extends Phaser.Scene {
        private ball!: Phaser.Physics.Arcade.Image;
        private ballShadow!: Phaser.GameObjects.Ellipse;
        private keeper!: Phaser.Physics.Arcade.Image;
        private defenders: Phaser.Physics.Arcade.Image[] = [];
        private striker!: Phaser.GameObjects.Image;
        private teammate!: Phaser.Physics.Arcade.Image;
        private teammateBadge!: Phaser.GameObjects.Text;
        private offsideLineGfx!: Phaser.GameObjects.Graphics;
        private offsideLabel!: Phaser.GameObjects.Text;
        private aimLine!: Phaser.GameObjects.Graphics;
        private trailGfx!: Phaser.GameObjects.Graphics;
        private netGfx!: Phaser.GameObjects.Graphics;
        private postLeft!: Phaser.Physics.Arcade.Image;
        private postRight!: Phaser.Physics.Arcade.Image;
        private goalZone!: Phaser.GameObjects.Zone;

        private isDragging = false;
        private shotActive = false;
        private passInFlight = false;
        private passWasOffside = false;
        private viaPassPhase = false;
        private dragStart = new Phaser.Math.Vector2();
        private trailPoints: { x: number; y: number }[] = [];
        private currentOffsideY = 175;
        private keeperTween?: Phaser.Tweens.Tween;
        private defTweens: Phaser.Tweens.Tween[] = [];
        private teammateTweenX?: Phaser.Tweens.Tween;
        private teammateTweenY?: Phaser.Tweens.Tween;

        constructor() {
          super('PitchScene');
        }

        private createPlayerTexture(
          key: string,
          jerseyColor: number,
          shortsColor: number,
          gloveColor?: number,
          accentColor?: number
        ) {
          const gfx = this.make.graphics({ x: 0, y: 0 });
          // Sombra no gramado
          gfx.fillStyle(0x000000, 0.28);
          gfx.fillEllipse(20, 39, 24, 8);
          // Chuteiras
          gfx.fillStyle(0x111827, 1);
          gfx.fillRoundedRect(11, 33, 6, 5, 2);
          gfx.fillRoundedRect(23, 33, 6, 5, 2);
          // Meiões
          gfx.fillStyle(accentColor ?? jerseyColor, 1);
          gfx.fillRect(13, 29, 4, 5);
          gfx.fillRect(23, 29, 4, 5);
          // Shorts
          gfx.fillStyle(shortsColor, 1);
          gfx.fillRoundedRect(12, 23, 16, 8, 2);
          // Camisa
          gfx.fillStyle(jerseyColor, 1);
          gfx.fillRoundedRect(10, 11, 20, 13, 4);
          // Faixa central da camisa
          gfx.fillStyle(0xffffff, 0.22);
          gfx.fillRect(17, 11, 6, 13);
          // Braços / Luvas
          gfx.fillStyle(gloveColor ?? 0xf1c27d, 1);
          gfx.fillCircle(7, 18, gloveColor ? 4.5 : 3.5);
          gfx.fillCircle(33, 18, gloveColor ? 4.5 : 3.5);
          // Cabeça
          gfx.fillStyle(0xf1c27d, 1);
          gfx.fillCircle(20, 7.5, 6.2);
          // Cabelo
          gfx.fillStyle(0x1f2937, 1);
          gfx.fillEllipse(20, 3.8, 11, 4.8);
          gfx.generateTexture(key, 40, 44);
          gfx.destroy();
        }

        private createBallTexture() {
          const gfx = this.make.graphics({ x: 0, y: 0 });
          gfx.fillStyle(0xffffff, 1);
          gfx.fillCircle(13, 13, 12);
          gfx.lineStyle(1.8, 0x111827, 1);
          gfx.strokeCircle(13, 13, 12);
          // Gomos clássicos
          gfx.fillStyle(0x111827, 1);
          gfx.fillCircle(13, 13, 4);
          gfx.fillCircle(6, 8, 2.3);
          gfx.fillCircle(20, 8, 2.3);
          gfx.fillCircle(7, 19, 2.3);
          gfx.fillCircle(19, 19, 2.3);
          gfx.generateTexture('ball', 26, 26);
          gfx.destroy();
        }

        private createPostTexture() {
          const gfx = this.make.graphics({ x: 0, y: 0 });
          gfx.fillStyle(0xffffff, 1);
          gfx.fillCircle(5, 5, 5);
          gfx.lineStyle(1.5, 0x94a3b8, 1);
          gfx.strokeCircle(5, 5, 5);
          gfx.generateTexture('post', 10, 10);
          gfx.destroy();
        }

        private drawPitch() {
          const bg = this.add.graphics();
          bg.fillStyle(0x14532d, 1);
          bg.fillRect(0, 0, WIDTH, HEIGHT);

          // Listras de corte do gramado
          bg.fillStyle(0x166534, 0.7);
          for (let y = 0; y < HEIGHT; y += 45) {
            if ((y / 45) % 2 === 0) bg.fillRect(0, y, WIDTH, 45);
          }

          // Linhas externas
          bg.lineStyle(2.5, 0xffffff, 0.85);
          bg.strokeRect(16, GOAL_Y, WIDTH - 32, HEIGHT - GOAL_Y - 16);

          // Grande área
          bg.strokeRect(58, GOAL_Y, WIDTH - 116, 132);
          // Pequena área
          bg.strokeRect(108, GOAL_Y, WIDTH - 216, 48);
          // Marca do pênalti
          bg.fillStyle(0xffffff, 0.9);
          bg.fillCircle(WIDTH / 2, GOAL_Y + 96, 3.5);
          // Meia-lua da grande área
          bg.beginPath();
          bg.arc(WIDTH / 2, GOAL_Y + 96, 52, Phaser.Math.DegToRad(38), Phaser.Math.DegToRad(142), false);
          bg.strokePath();

          // Semicírculo central na parte inferior
          bg.beginPath();
          bg.arc(WIDTH / 2, HEIGHT - 16, 56, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
          bg.strokePath();

          // Bandeirinhas de escanteio
          bg.lineStyle(2, 0xfacc15, 1);
          bg.strokeCircle(16, GOAL_Y, 10);
          bg.strokeCircle(WIDTH - 16, GOAL_Y, 10);
        }

        private drawGoalNet(stretchY = 0) {
          this.netGfx.clear();
          // Fundo da rede
          this.netGfx.fillStyle(0xffffff, 0.14);
          this.netGfx.fillRect(GOAL_LEFT, 6 - stretchY, GOAL_WIDTH, 20 + stretchY);
          // Malha
          this.netGfx.lineStyle(1, 0xe2e8f0, 0.45);
          for (let x = GOAL_LEFT; x <= GOAL_RIGHT; x += 12) {
            this.netGfx.lineBetween(x, 6 - stretchY, x, GOAL_Y);
          }
          for (let y = 8; y <= GOAL_Y; y += 6) {
            this.netGfx.lineBetween(GOAL_LEFT, y, GOAL_RIGHT, y);
          }
          // Travessão e traves
          this.netGfx.lineStyle(4.5, 0xffffff, 1);
          this.netGfx.lineBetween(GOAL_LEFT, 6, GOAL_RIGHT, 6);
          this.netGfx.lineBetween(GOAL_LEFT, 6, GOAL_LEFT, GOAL_Y);
          this.netGfx.lineBetween(GOAL_RIGHT, 6, GOAL_RIGHT, GOAL_Y);
        }

        create() {
          this.drawPitch();
          this.netGfx = this.add.graphics();
          this.drawGoalNet();

          // Texturas
          this.createBallTexture();
          this.createPostTexture();
          this.createPlayerTexture('keeper', 0xf97316, 0x0f172a, 0x22c55e, 0xf97316);
          this.createPlayerTexture('defender', 0xdc2626, 0xffffff, undefined, 0xdc2626);
          this.createPlayerTexture('striker', 0x10b981, 0x0f172a, undefined, 0x10b981);
          this.createPlayerTexture('teammate', 0x06b6d4, 0x0f172a, undefined, 0x06b6d4);

          // Linha de Impedimento dinâmica
          this.offsideLineGfx = this.add.graphics();
          this.offsideLabel = this.add
            .text(22, 160, 'LINHA DE IMPEDIMENTO', {
              fontSize: '9px',
              fontStyle: 'bold',
              color: '#fef08a',
              backgroundColor: 'rgba(0,0,0,0.55)',
              padding: { x: 4, y: 2 },
            })
            .setDepth(5);

          // Traves físicas
          this.postLeft = this.physics.add.image(GOAL_LEFT, GOAL_Y, 'post').setImmovable(true).setCircle(5);
          this.postRight = this.physics.add.image(GOAL_RIGHT, GOAL_Y, 'post').setImmovable(true).setCircle(5);

          // Zona do Gol
          this.goalZone = this.add.zone(WIDTH / 2, GOAL_Y - 8, GOAL_WIDTH - 12, 16);
          this.physics.add.existing(this.goalZone, true);

          // Goleiro
          this.keeper = this.physics.add.image(WIDTH / 2, GOAL_Y + 26, 'keeper');
          this.keeper.setImmovable(true);
          this.keeper.setSize(28, 28);
          this.keeper.setDepth(6);
          this.keeperTween = this.tweens.add({
            targets: this.keeper,
            x: { from: GOAL_LEFT + 22, to: GOAL_RIGHT - 22 },
            duration: Math.max(620, Math.round(1050 / curBal.keeperSpeedMult)),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });

          // 2 Zagueiros (definem a linha de impedimento!)
          const def1 = this.physics.add.image(WIDTH * 0.34, 175, 'defender').setImmovable(true).setSize(24, 28).setDepth(6);
          const def2 = this.physics.add.image(WIDTH * 0.68, 220, 'defender').setImmovable(true).setSize(24, 28).setDepth(6);

          this.defTweens = [
            this.tweens.add({
              targets: def1,
              x: { from: 66, to: WIDTH * 0.48 },
              y: { from: 155, to: 195 },
              duration: Math.max(1050, Math.round(1900 / curBal.defenderSpeedMult)),
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            }),
            this.tweens.add({
              targets: def2,
              x: { from: WIDTH - 66, to: WIDTH * 0.52 },
              y: { from: 190, to: 235 },
              duration: Math.max(920, Math.round(1650 / curBal.defenderSpeedMult)),
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            }),
          ];
          this.defenders = [def1, def2];

          // Companheiro de equipe (infiltra e volta da linha de impedimento!)
          this.teammate = this.physics.add
            .image(WIDTH * 0.78, 210, 'teammate')
            .setImmovable(true)
            .setSize(42, 42)
            .setDepth(6);
          this.teammateBadge = this.add
            .text(this.teammate.x, this.teammate.y - 28, 'PARCEIRO', {
              fontSize: '9px',
              fontStyle: 'bold',
              color: '#67e8f9',
              backgroundColor: 'rgba(0,0,0,0.65)',
              padding: { x: 4, y: 1 },
            })
            .setOrigin(0.5)
            .setDepth(7);

          this.teammateTweenY = this.tweens.add({
            targets: this.teammate,
            y: { from: 235, to: 130 },
            duration: 2100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          this.teammateTweenX = this.tweens.add({
            targets: this.teammate,
            x: { from: WIDTH * 0.82, to: WIDTH * 0.64 },
            duration: 2800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });

          // Atacante (Você)
          this.striker = this.add.image(WIDTH / 2 - 22, HEIGHT - 92, 'striker').setDepth(6);

          // Rastro & Mira
          this.trailGfx = this.add.graphics().setDepth(4);
          this.aimLine = this.add.graphics().setDepth(8);

          // Sombra + Bola
          this.ballShadow = this.add.ellipse(WIDTH / 2, HEIGHT - 108, 18, 8, 0x000000, 0.35).setDepth(4);
          this.ball = this.physics.add.image(WIDTH / 2, HEIGHT - 115, 'ball').setDepth(7);
          this.ball.setCircle(12);
          this.ball.setBounce(0.7);
          this.ball.setDamping(true);
          this.ball.setDrag(0.982);
          this.ball.setCollideWorldBounds(true);

          // Colisões
          this.physics.add.collider(this.ball, this.keeper, () => {
            if (!this.shotActive) return;
            sound.playWoodwork();
            this.cameras.main.shake(120, 0.006);
            this.finishShot(false, '🧤 DEFESAÇA DO GOLEIRO!');
          });

          this.physics.add.collider(this.ball, [this.postLeft, this.postRight], () => {
            sound.playWoodwork();
            this.cameras.main.shake(180, 0.01);
          });

          this.defenders.forEach((def) => {
            this.physics.add.collider(this.ball, def, () => {
              if (!this.shotActive && !this.passInFlight) return;
              sound.playKick();
              if (this.passInFlight) {
                this.passInFlight = false;
                this.finishShot(false, '🛡️ Zagueiro interceptou o passe!');
              } else {
                this.finishShot(false, '🛡️ Bloqueado pelo zagueiro!');
              }
            });
          });

          // Recepção do Passe pelo Companheiro!
          this.physics.add.overlap(this.ball, this.teammate, () => {
            if (!this.passInFlight) return;
            this.passInFlight = false;
            this.ball.setVelocity(0, 0);

            if (this.passWasOffside) {
              sound.playWhistle();
              sound.playCardSound();
              this.cameras.main.shake(150, 0.008);
              this.handleOffsidePlay();
              return;
            }

            // Passe Legal! Companheiro domina livre na cara do gol!
            sound.playCheer();
            this.viaPassPhase = true;
            setHasAssistedThisPlay(true);
            setStats((s) => ({ ...s, assists: s.assists + 1 }));
            setStatus('pass_ok');
            setStatusBanner('✨ PASSE PERFEITO! Zagueiros batidos — chute livre agora!');

            // Pausa zagueiros atrás da linha da bola e coloca companheiro para finalizar
            this.teammateTweenX?.pause();
            this.teammateTweenY?.pause();
            this.defenders.forEach((d) => {
              d.y = Math.max(d.y, 330);
              d.setAlpha(0.45);
            });
            this.defTweens.forEach((t) => t.pause());

            this.striker.setAlpha(0.4);
            this.ball.setPosition(this.teammate.x, this.teammate.y - 18);
            actionModeRef.current = 'shoot';
            setActionMode('shoot');
          });

          // Gol!
          this.physics.add.overlap(this.ball, this.goalZone, () => {
            if (!this.shotActive) return;
            this.drawGoalNet(8);
            this.time.delayedCall(280, () => this.drawGoalNet(0));
            this.finishShot(true, this.viaPassPhase ? '⚽ GOLAÇO DE ASSISTÊNCIA!' : '⚽ GOLAÇO!');
          });

          // Expor ações rápidas para os botões React (Tocar Agora / Zerar)
          triggerQuickPassRef.current = () => {
            if (this.shotActive || this.passInFlight || this.viaPassPhase) return;
            this.executePassToward(this.teammate.x, this.teammate.y);
          };

          resetMatchStatsRef.current = () => {
            attemptsRef.current = 0;
            setChallengeDone(false);
            setStats({ goals: 0, assists: 0, offsides: 0, attempts: 0, streak: 0, bestStreak: 0 });
            this.resetRound();
          };

          // Input Touch/Mouse
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.shotActive || this.passInFlight) return;
            const distBall = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.ball.x, this.ball.y);
            const distMate = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.teammate.x, this.teammate.y);

            // Se estiver no modo PASSE e tocar direto no companheiro, toca direto!
            if (actionModeRef.current === 'pass' && !this.viaPassPhase && distMate <= 38) {
              this.executePassToward(this.teammate.x, this.teammate.y);
              return;
            }

            if (distBall <= 78) {
              this.isDragging = true;
              this.dragStart.set(this.ball.x, this.ball.y);
              setStatus('aiming');
            }
          });

          this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging) return;
            this.aimLine.clear();

            const isPass = actionModeRef.current === 'pass' && !this.viaPassPhase;
            // No modo chute arrasta estilo estilingue; no passe pode apontar direto ou estilingue
            const dx = isPass ? pointer.x - this.dragStart.x : this.dragStart.x - pointer.x;
            const dy = isPass ? pointer.y - this.dragStart.y : this.dragStart.y - pointer.y;
            const power = Math.min(Math.hypot(dx, dy), 145);
            const angle = Math.atan2(dy, dx);
            const ratio = power / 145;

            const color = isPass
              ? 0x22d3ee
              : ratio < 0.45
              ? 0xfacc15
              : ratio < 0.8
              ? 0xf97316
              : 0xef4444;

            this.aimLine.lineStyle(4, color, 0.95);
            this.aimLine.beginPath();
            this.aimLine.moveTo(this.ball.x, this.ball.y);
            this.aimLine.lineTo(
              this.ball.x + Math.cos(angle) * power * 1.45,
              this.ball.y + Math.sin(angle) * power * 1.45
            );
            this.aimLine.strokePath();

            // Pontos guia
            this.aimLine.fillStyle(color, 0.85);
            for (let i = 1; i <= 3; i++) {
              const step = (power * 1.45 * i) / 3;
              this.aimLine.fillCircle(
                this.ball.x + Math.cos(angle) * step,
                this.ball.y + Math.sin(angle) * step,
                3.5 - i * 0.5
              );
            }
          });

          this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.aimLine.clear();

            const isPass = actionModeRef.current === 'pass' && !this.viaPassPhase;
            const dx = isPass ? pointer.x - this.dragStart.x : this.dragStart.x - pointer.x;
            const dy = isPass ? pointer.y - this.dragStart.y : this.dragStart.y - pointer.y;
            const power = Math.min(Math.hypot(dx, dy), 145);

            if (power < 14) {
              setStatus(this.viaPassPhase ? 'pass_ok' : 'ready');
              return;
            }

            if (isPass) {
              const targetX = this.ball.x + dx * 1.8;
              const targetY = this.ball.y + dy * 1.8;
              this.executePassToward(targetX, targetY);
              return;
            }

            this.executeShot(dx, dy);
          });
        }

        private executePassToward(targetX: number, targetY: number) {
          this.passInFlight = true;
          // Regra oficial: checa impedimento no EXATO momento do passe
          this.passWasOffside = this.teammate.y < this.currentOffsideY - 4;
          setStatus('passing');
          setStatusBanner(
            this.passWasOffside ? '🚩 Atenção à linha de impedimento...' : '👟 Passe enfiado!'
          );
          attemptsRef.current += 1;
          setStats((s) => ({ ...s, attempts: s.attempts + 1 }));
          sound.playKick();

          // Animação de passe do atacante
          this.tweens.add({
            targets: this.striker,
            x: this.ball.x,
            y: this.ball.y + 8,
            duration: 110,
            ease: 'Power2',
          });

          const angle = Math.atan2(targetY - this.ball.y, targetX - this.ball.x);
          const speed = 560;
          this.ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

          this.time.delayedCall(1500, () => {
            if (this.passInFlight) {
              this.passInFlight = false;
              this.finishShot(false, 'Passe foi pra fora!');
            }
          });
        }

        private executeShot(dx: number, dy: number) {
          this.shotActive = true;
          this.trailPoints = [];
          setStatus('shot');
          setStatusBanner('🚀 Bola viajando para o gol...');
          if (!this.viaPassPhase) {
            attemptsRef.current += 1;
            setStats((s) => ({ ...s, attempts: s.attempts + 1 }));
          }
          sound.playKick();

          const shooter = this.viaPassPhase ? this.teammate : this.striker;
          this.tweens.add({
            targets: shooter,
            x: this.ball.x,
            y: this.ball.y + 10,
            duration: 110,
            ease: 'Power2',
          });

          const speedMultiplier = 6.4;
          this.ball.setVelocity(dx * speedMultiplier, dy * speedMultiplier);

          this.time.delayedCall(2100, () => {
            if (this.shotActive) {
              this.finishShot(false, 'Pra fora! Passou raspando!');
            }
          });
        }

        private handleOffsidePlay() {
          setStatus('offside');
          setStatusBanner('🚩 IMPEDIMENTO! O parceiro estava além do último zagueiro!');
          setStats((s) => ({ ...s, offsides: s.offsides + 1, streak: 0 }));

          const badge = this.add
            .text(WIDTH / 2, HEIGHT / 2 - 20, '🚩 IMPEDIMENTO!', {
              fontSize: '22px',
              fontStyle: 'bold',
              color: '#fef08a',
              backgroundColor: '#991b1b',
              padding: { x: 14, y: 8 },
            })
            .setOrigin(0.5)
            .setDepth(20);

          this.time.delayedCall(1350, () => {
            badge.destroy();
            if (!isMounted) return;
            onOffsideRef.current?.();
            if (mode !== 'match_clutch') {
              if (challengeModeRef.current === 'challenge5' && attemptsRef.current >= 5) {
                setChallengeDone(true);
              } else {
                this.resetRound();
              }
            }
          });
        }

        private finishShot(isGoal: boolean, msg: string) {
          this.shotActive = false;
          this.passInFlight = false;
          this.ball.setVelocity(0, 0);

          if (isGoal) {
            const wasAssist = this.viaPassPhase;
            let currentCombo = 1;
            setStatus('goal');
            setStats((s) => {
              const nextStreak = s.streak + 1;
              currentCombo = nextStreak;
              return {
                ...s,
                goals: s.goals + 1,
                streak: nextStreak,
                bestStreak: Math.max(s.bestStreak, nextStreak),
              };
            });
            setStatusBanner(currentCombo >= 2 ? `🔥 COMBO x${currentCombo}! ${msg}` : msg);
            sound.playGoal();
            this.cameras.main.shake(200, 0.012);
            confetti({
              particleCount: currentCombo >= 2 ? 90 : 55,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#10b981', '#facc15', '#ffffff'],
            });

            const goalBanner = this.add
              .text(WIDTH / 2, HEIGHT / 2 - 20, currentCombo >= 2 ? `🔥 COMBO x${currentCombo}!` : '⚽ GOLAÇO!', {
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffffff',
                backgroundColor: currentCombo >= 2 ? '#d97706' : '#059669',
                padding: { x: 16, y: 8 },
              })
              .setOrigin(0.5)
              .setDepth(20);

            this.time.delayedCall(1300, () => {
              goalBanner.destroy();
              if (!isMounted) return;
              onGoalRef.current?.(wasAssist);
              if (mode !== 'match_clutch') {
                if (challengeModeRef.current === 'challenge5' && attemptsRef.current >= 5) {
                  setChallengeDone(true);
                } else {
                  this.resetRound();
                }
              }
            });
          } else {
            setStatus('miss');
            setStatusBanner(msg);
            setStats((s) => ({ ...s, streak: 0 }));
            this.time.delayedCall(1200, () => {
              if (!isMounted) return;
              onMissRef.current?.();
              if (mode !== 'match_clutch') {
                if (challengeModeRef.current === 'challenge5' && attemptsRef.current >= 5) {
                  setChallengeDone(true);
                } else {
                  this.resetRound();
                }
              }
            });
          }
        }

        private resetRound() {
          this.shotActive = false;
          this.passInFlight = false;
          this.passWasOffside = false;
          this.viaPassPhase = false;
          this.trailPoints = [];
          this.trailGfx.clear();

          setHasAssistedThisPlay(false);
          this.ball.setPosition(WIDTH / 2, HEIGHT - 115);
          this.ball.setVelocity(0, 0);
          this.striker.setPosition(WIDTH / 2 - 22, HEIGHT - 92).setAlpha(1);
          this.teammate.setPosition(WIDTH * 0.78, 210);
          this.defenders.forEach((d) => d.setAlpha(1));
          this.defTweens.forEach((t) => t.resume());
          this.teammateTweenX?.resume();
          this.teammateTweenY?.resume();

          setStatus('ready');
          setStatusBanner(
            actionModeRef.current === 'pass'
              ? 'Modo PASSE: observe a linha de impedimento e toque!'
              : 'Arraste a bola para trás e solte para chutar!'
          );
        }

        update() {
          // Linha de Impedimento acompanha o zagueiro mais recuado (menor Y)
          const minDefY = Math.min(...this.defenders.map((d) => d.y));
          this.currentOffsideY = minDefY;

          const offsideNow = !this.viaPassPhase && this.teammate.y < minDefY - 4;
          setIsTeammateOffside(offsideNow);

          // Desenha linha tracejada de impedimento
          this.offsideLineGfx.clear();
          const lineColor = offsideNow ? 0xef4444 : 0xfacc15;
          this.offsideLineGfx.lineStyle(2, lineColor, 0.8);
          for (let x = 18; x < WIDTH - 18; x += 14) {
            this.offsideLineGfx.lineBetween(x, minDefY, x + 8, minDefY);
          }
          this.offsideLabel.setPosition(20, minDefY - 16);
          this.offsideLabel.setText(offsideNow ? '🚩 IMPEDIMENTO' : 'LINHA DEFENSIVA');
          this.offsideLabel.setColor(offsideNow ? '#fca5a5' : '#fef08a');

          // Badge do Companheiro
          this.teammateBadge.setPosition(this.teammate.x, this.teammate.y - 26);
          if (this.viaPassPhase) {
            this.teammateBadge.setText('CHUTE LIVRE!');
            this.teammateBadge.setColor('#4ade80');
          } else if (offsideNow) {
            this.teammateBadge.setText('IMPEDIDO!');
            this.teammateBadge.setColor('#f87171');
          } else {
            this.teammateBadge.setText('LIVRE (TOQUE)');
            this.teammateBadge.setColor('#67e8f9');
          }

          // Sombra e rotação da bola
          this.ballShadow.setPosition(this.ball.x, this.ball.y + 8);
          if (
            this.shotActive &&
            this.ball.y <= GOAL_Y &&
            (this.ball.x < GOAL_LEFT || this.ball.x > GOAL_RIGHT)
          ) {
            this.finishShot(false, 'Pra fora! Passou raspando na trave!');
          }
          const vel = this.ball.body?.velocity;
          if (vel && (Math.abs(vel.x) > 8 || Math.abs(vel.y) > 8)) {
            this.ball.angle += Math.hypot(vel.x, vel.y) * 0.03;
            this.trailPoints.push({ x: this.ball.x, y: this.ball.y });
            if (this.trailPoints.length > 10) this.trailPoints.shift();
          } else if (this.trailPoints.length > 0) {
            this.trailPoints.shift();
          }

          this.trailGfx.clear();
          this.trailPoints.forEach((pt, idx) => {
            const alpha = (idx + 1) / this.trailPoints.length;
            this.trailGfx.fillStyle(this.passInFlight ? 0x22d3ee : 0xfacc15, alpha * 0.45);
            this.trailGfx.fillCircle(pt.x, pt.y, 3 + alpha * 4);
          });
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: WIDTH,
        height: HEIGHT,
        parent: containerRef.current,
        backgroundColor: '#14532d',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        scene: PitchScene,
      });
    }

    initPhaser();

    return () => {
      isMounted = false;
      game?.destroy(true);
    };
  }, [mode, balance.difficultyScore]);

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-zinc-950 p-3.5 text-white shadow-2xl">
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <Trophy className="h-4 w-4 shrink-0 text-emerald-400" />
          <div className="truncate">
            <h3 className="truncate text-xs font-black uppercase tracking-wider text-white">{title}</h3>
            {matchInfo && (
              <p className="text-[10px] text-zinc-400">
                {matchInfo.minute}&apos; • vs {matchInfo.oppClubName} ({matchInfo.currentScore})
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {stats.streak >= 2 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-black text-amber-300 animate-pulse">
              <Flame className="h-3 w-3 fill-amber-400" /> {stats.streak}x
            </span>
          )}
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
            ⚽ {stats.goals}{challengeMode === 'challenge5' ? '/5' : ''}
          </span>
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[11px] font-bold text-cyan-300">
            👟 {stats.assists}
          </span>
          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-300">
            🚩 {stats.offsides}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Dificuldade OVR × Liga & Modo Desafio */}
      <div className="flex w-full items-center justify-between gap-2 flex-wrap">
        <DifficultyBadge balance={balance} compact />
        {mode !== 'match_clutch' && (
          <div className="flex items-center gap-1 rounded-xl bg-zinc-900 p-0.5 border border-zinc-800 text-[10px] font-black">
            <button
              type="button"
              onClick={() => {
                setChallengeMode('free');
                resetMatchStatsRef.current?.();
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                challengeMode === 'free' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Treino Livre
            </button>
            <button
              type="button"
              onClick={() => {
                setChallengeMode('challenge5');
                resetMatchStatsRef.current?.();
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                challengeMode === 'challenge5' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Desafio 5 Chutes
            </button>
          </div>
        )}
      </div>

      {/* Seletor Chutar vs Tocar (Otimizado para Celular) */}
      <div className="grid w-full grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setModeSafe('shoot')}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition cursor-pointer ${
            actionMode === 'shoot'
              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/25'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Target className="h-3.5 w-3.5" /> CHUTAR NO GOL
        </button>
        <button
          type="button"
          disabled={hasAssistedThisPlay}
          onClick={() => setModeSafe('pass')}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition cursor-pointer disabled:opacity-40 ${
            actionMode === 'pass'
              ? 'bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-400/25'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Send className="h-3.5 w-3.5" /> TOCAR P/ PARCEIRO
        </button>
      </div>

      {/* Atalho de Passe Rápido quando está no modo Tocar */}
      {actionMode === 'pass' && !hasAssistedThisPlay && status !== 'passing' && (
        <button
          type="button"
          onClick={() => triggerQuickPassRef.current?.()}
          className={`w-full rounded-xl py-1.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            isTeammateOffside
              ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
              : 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/30'
          }`}
        >
          {isTeammateOffside ? (
            <>
              <Flag className="h-3.5 w-3.5" /> Parceiro Impedido — Aguarde ele voltar!
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" /> Tocar Agora (Posição Legal!)
            </>
          )}
        </button>
      )}

      {/* Canvas Phaser 3 */}
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 touch-none">
        <div ref={containerRef} className="w-full" />

        {challengeDone && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-5 text-center space-y-3 animate-in fade-in">
            <span className="text-3xl">{stats.goals >= 3 ? '🏆' : '⚽'}</span>
            <h4 className="font-display text-lg font-black text-white">
              Desafio 5 Chutes Concluído!
            </h4>
            <p className="text-xs text-zinc-300">
              Você marcou <strong className="text-emerald-400">{stats.goals} de 5 gols</strong> ({stats.assists} assistências) • Melhor Combo: <strong className="text-amber-400">{stats.bestStreak}x</strong>
            </p>
            <button
              type="button"
              onClick={() => resetMatchStatsRef.current?.()}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs cursor-pointer shadow-lg"
            >
              Jogar Novo Desafio
            </button>
          </div>
        )}
      </div>

      {/* Rodapé de Feedback */}
      <div className="flex w-full items-center justify-between gap-2 text-[11px] text-zinc-300">
        <span className="truncate font-medium">{statusBanner}</span>
        {mode !== 'match_clutch' && (
          <button
            type="button"
            onClick={() => resetMatchStatsRef.current?.()}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-zinc-900 px-2 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Zerar
          </button>
        )}
      </div>
    </div>
  );
}
