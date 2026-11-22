// ==============================================================================
// BOLA NA REDE: CARREIRA - MOTOR DE FÍSICA E ANIMAÇÃO REALISTA DA BOLA (CANVAS 2D)
// Física proporcional de força (fraco vs bomba), rastro visual, efeito 3D de sombra e altura
// Integração completa com Catálogo de Bolas (Jabulani, Brazuca, Fogo, Cyber, Ouro, etc.)
// ==============================================================================

import { BallItem } from '@/types/game';
import { getBallById } from '@/data/balls';

export type ShotType = 'weak' | 'medium' | 'power' | 'lob';

export interface BallPoint {
  x: number;
  y: number;
  z: number;
  alpha: number;
  sparkle?: boolean;
}

export interface BallPhysicsState {
  x: number;
  y: number;
  z: number;           // Altura da bola em relação ao gramado
  vx: number;
  vy: number;
  vz: number;          // Velocidade vertical (gravidade/arco)
  radius: number;
  baseRadius: number;
  spinCurve: number;   // Efeito de curva (-1 a +1)
  rotationAngle?: number; // Ângulo de rotação visual da bola no ar
  rotationSpeed?: number; // Velocidade de rotação do spin
  friction: number;    // Desaceleração de atrito no gramado
  gravity: number;     // Aceleração da gravidade puxando z para 0
  shotType: ShotType;
  hasMotionTrail: boolean;
  trailPoints: BallPoint[];
  screenShake: number; // Intensidade do tremor (0 a 10)
  isOffTarget: boolean;
  offTargetReason?: 'high' | 'wide_left' | 'wide_right';
  inFlight: boolean;
  bouncedCount: number;
  impactDescription?: string;
  ballId?: string;     // ID da bola equipada
}

export interface ShotPhysicsInput {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  power: number;         // 0 a 100%
  curve?: number;        // -1 a +1
  impactPoint?: { x: number; y: number }; // x: -1 (esquerda) a +1 (direita), y: -1 (topo) a +1 (baixo)
  finishingAttr?: number;// 40 a 99
  composureAttr?: number;// 40 a 99
  preferredFoot?: 'right' | 'left' | 'both';
  isLob?: boolean;       // Chapéu / Cavaadinha
  ballId?: string;       // ID da bola equipada
}

export interface ShotPhysicsResult {
  ball: BallPhysicsState;
  shotType: ShotType;
  commentaryKey: string;
  impactLabel: string;
}

/**
 * Calcula a velocidade inicial, trajetória física e probabilidade de desvio
 * com base no ponto de impacto na bola, na barra de força e atributos técnicos do atleta.
 */
export function calculateShotPhysics(input: ShotPhysicsInput): ShotPhysicsResult {
  const {
    startX,
    startY,
    targetX,
    targetY,
    power,
    curve = 0,
    impactPoint = { x: 0, y: 0 },
    finishingAttr = 65,
    composureAttr = 65,
    preferredFoot = 'right',
    isLob = false,
    ballId,
  } = input;

  const equippedBall = getBallById(ballId);
  const { physics: ballPhysics } = equippedBall;

  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const dirX = dx / dist;
  const dirY = dy / dist;

  // Analisa o Ponto de Impacto na Bola (New Star Soccer / Score Hero style)
  // x: -1 = lateral esquerda, +1 = lateral direita
  // y: -1 = topo da bola, +1 = fundo/embaixo da bola
  const impX = Math.max(-1, Math.min(1, impactPoint.x || 0));
  const impY = Math.max(-1, Math.min(1, impactPoint.y || 0));

  let impactLabel = 'Chute Firme no Meio (Trajetória Reta)';
  let curveFromImpact = 0;
  let verticalBoost = 0;
  let gravityMultiplier = 1.0;

  // 1. Efeito Lateral (Curva) derivado de bater na lateral esquerda ou direita da bola
  if (impX < -0.2) {
    // Chutou na lateral esquerda -> rotação empurra a bola para a DIREITA
    curveFromImpact = Math.abs(impX) * 1.15;
    impactLabel = preferredFoot === 'left' ? 'Curva de Chapa para a Direita' : 'Efeito Trivela para a Direita';
  } else if (impX > 0.2) {
    // Chutou na lateral direita -> rotação empurra a bola para a ESQUERDA
    curveFromImpact = -Math.abs(impX) * 1.15;
    impactLabel = preferredFoot === 'right' ? 'Curva de Chapa para a Esquerda' : 'Efeito Trivela para a Esquerda';
  }

  // Combinação ponderada de curva do ponto de impacto com curva manual e multiplicador da bola (ex: Jabulani +35%)
  const combinedCurve = (curveFromImpact !== 0 ? (curveFromImpact + curve * 0.35) : curve) * ballPhysics.curveMultiplier;
  const totalCurve = Math.max(-1.8, Math.min(1.8, combinedCurve));

  // 2. Altura da Bola (Subida ou Mergulho) derivado de bater por baixo, no meio ou em cima
  if (impY > 0.25) {
    // Bateu por baixo da bola -> Bola Sobe!
    verticalBoost = impY * 3.8;
    gravityMultiplier = 0.88; // Flutua mais no ar
    if (impX < -0.25 || impX > 0.25) {
      impactLabel = `Batida por Baixo com Efeito (${impX < 0 ? 'Ângulo Direito' : 'Ângulo Esquerdo'})`;
    } else {
      impactLabel = 'Batida por Baixo (Bola Sobe / Cavada)';
    }
  } else if (impY < -0.25) {
    // Bateu por cima da bola -> Topspin / Folha Seca (Mergulha rápido)
    verticalBoost = Math.max(-1.5, impY * 1.8);
    gravityMultiplier = 1.45; // Gravidade puxa a bola mais rápido para baixo
    if (impX < -0.25 || impX > 0.25) {
      impactLabel = 'Folha Seca com Efeito Curvado';
    } else {
      impactLabel = 'Batida no Topo (Topspin / Rasante Mergulhante)';
    }
  }

  // Classificação do Chute pela Barra de Força
  let shotType: ShotType = 'medium';
  let speedMultiplier = 1.0 * ballPhysics.speedMultiplier;
  let hasMotionTrail = ballPhysics.trailType !== 'classic' || power >= 65;
  let screenShake = 0;
  let friction = 0.985 / ballPhysics.frictionMultiplier;
  let gravity = 0.26 * gravityMultiplier;
  let initialVz = 1.8 + verticalBoost;
  let isOffTarget = false;
  let offTargetReason: 'high' | 'wide_left' | 'wide_right' | undefined;
  let commentaryKey = 'shot_medium';

  if (isLob) {
    // Chapéu ou Cavadinha
    shotType = 'lob';
    speedMultiplier = 0.75;
    initialVz = 4.2;
    gravity = 0.22;
    commentaryKey = 'dribble_chapeu';
    impactLabel = 'Cavadinha Magistral (Chapéu)';
  } else if (power < 38) {
    // 1. Chute Fraco (Pegou mascado)
    shotType = 'weak';
    speedMultiplier = 0.55;
    friction = 0.955;
    initialVz = Math.max(0.4, 0.6 + verticalBoost * 0.4);
    commentaryKey = 'shot_weak';
  } else if (power > 86) {
    // 2. Chute Forte / Bomba
    shotType = 'power';
    speedMultiplier = 1.65;
    hasMotionTrail = true;
    screenShake = 6.5;
    initialVz = Math.max(1.0, 3.6 + verticalBoost);
    friction = 0.992;
    commentaryKey = 'shot_power_goal';

    // Se bateu muito embaixo com força máxima, grande probabilidade de isolar por cima
    const errorChance = Math.max(0.12, (100 - composureAttr) / 100);
    if (impY > 0.55 || Math.random() < errorChance) {
      isOffTarget = true;
      offTargetReason = 'high';
      initialVz = Math.max(5.8, 4.5 + verticalBoost * 1.5); // Sobe descontroladamente
      commentaryKey = 'shot_off_target_high';
    }
  } else {
    // 3. Chute Médio / Equilibrado (Zona Verde)
    shotType = 'medium';
    speedMultiplier = 1.1;
    initialVz = Math.max(0.5, 2.0 + verticalBoost);
    friction = 0.98;

    // Desvio sutil se a finalização for muito baixa e o atleta tentar efeito extremo
    if (finishingAttr < 52 && Math.abs(totalCurve) > 0.7 && Math.random() < 0.28) {
      isOffTarget = true;
      offTargetReason = totalCurve > 0 ? 'wide_right' : 'wide_left';
      commentaryKey = 'shot_off_target_wide';
    }
  }

  // Velocidade inicial da bola
  const baseSpeed = 10 * speedMultiplier;
  let vx = dirX * baseSpeed;
  let vy = dirY * baseSpeed;

  if (offTargetReason === 'wide_left') {
    vx -= 2.5;
  } else if (offTargetReason === 'wide_right') {
    vx += 2.5;
  }

  const ballState: BallPhysicsState = {
    x: startX,
    y: startY,
    z: 0,
    vx,
    vy,
    vz: initialVz,
    radius: 9,
    baseRadius: 9,
    spinCurve: totalCurve,
    rotationAngle: 0,
    rotationSpeed: totalCurve !== 0 ? totalCurve * 0.16 : (Math.hypot(vx, vy) * 0.025),
    friction,
    gravity,
    shotType,
    hasMotionTrail,
    trailPoints: [],
    screenShake,
    isOffTarget,
    offTargetReason,
    inFlight: true,
    bouncedCount: 0,
    impactDescription: impactLabel,
    ballId: equippedBall.id,
  };

  return {
    ball: ballState,
    shotType,
    commentaryKey,
    impactLabel,
  };
}

/**
 * Atualiza a física da bola a cada quadro de animação (Delta Time).
 */
export function updateBallPhysicsStep(ball: BallPhysicsState): void {
  if (!ball.inFlight) return;

  // Guarda ponto para o rastro visual (Motion Trail)
  if (ball.hasMotionTrail) {
    ball.trailPoints.push({
      x: ball.x,
      y: ball.y,
      z: ball.z,
      alpha: 1.0,
    });

    // Mantém no máximo os últimos 8 pontos
    if (ball.trailPoints.length > 8) {
      ball.trailPoints.shift();
    }

    // Desvanece pontos antigos
    for (const p of ball.trailPoints) {
      p.alpha = Math.max(0, p.alpha - 0.12);
    }
  }

  // Rotação visual com base no spin e deslocamento
  ball.rotationAngle = (ball.rotationAngle || 0) + (ball.rotationSpeed || 0);

  // Movimento no plano (X, Y) com efeito de curva (Magnus) e atrito
  ball.x += ball.vx + (ball.spinCurve * 0.48);
  ball.y += ball.vy;

  ball.vx *= ball.friction;
  ball.vy *= ball.friction;

  // Movimento vertical (Z) com gravidade e quique
  ball.z += ball.vz;
  ball.vz -= ball.gravity;

  if (ball.z <= 0) {
    ball.z = 0;
    // Quique no chão
    if (Math.abs(ball.vz) > 1.2 && ball.bouncedCount < 3) {
      ball.vz = -ball.vz * 0.45; // Perda de energia no impacto
      ball.bouncedCount++;
    } else {
      ball.vz = 0;
    }
  }

  // Decai o screen shake suavemente
  if (ball.screenShake > 0) {
    ball.screenShake = Math.max(0, ball.screenShake - 0.35);
  }
}

/**
 * Renderiza o rastro visual (Motion Trail) em chutes bomba ou bolas especiais.
 */
export function renderMotionTrail(ctx: CanvasRenderingContext2D, points: BallPoint[], ballId?: string): void {
  if (!points || points.length < 2) return;

  const ball = getBallById(ballId);
  const trailType = ball.physics.trailType;

  for (const [i, p] of points.entries()) {
    if (p.alpha <= 0.05) continue;

    ctx.save();
    const size = 3 + (i * 0.7);
    const posY = p.y - p.z * 0.7;

    if (trailType === 'fire') {
      // Meteoro de fogo: faíscas e chamas vermelho-laranja-ouro
      const fireColor = i % 2 === 0 ? 'rgba(239, 68, 68, ' : 'rgba(249, 115, 22, ';
      ctx.fillStyle = `${fireColor}${p.alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Faíscas estalando
      if (p.sparkle) {
        ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x + (Math.sin(i * 3) * 6), posY - (i * 2), 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (trailType === 'cyber') {
      // Cyber Neon: rastro ciano holográfico neon
      ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.75})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(34, 211, 238, ${p.alpha * 0.9})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (trailType === 'gold') {
      // Bola de Ouro: partículas douradas e estrelas reluzentes
      ctx.fillStyle = `rgba(234, 179, 8, ${p.alpha * 0.85})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size, 0, Math.PI * 2);
      ctx.fill();

      if (p.sparkle) {
        ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
        ctx.fillRect(p.x + (Math.sin(i) * 5), posY - 3, 3, 3);
      }
    } else if (trailType === 'brazuca') {
      // Brasilidade Pro: faixas verde e amarelo suaves
      const color = i % 2 === 0 ? 'rgba(22, 163, 74, ' : 'rgba(234, 179, 8, ';
      ctx.fillStyle = `${color}${p.alpha * 0.65})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (trailType === 'neon') {
      // Laranja alta visibilidade
      ctx.fillStyle = `rgba(255, 102, 0, ${p.alpha * 0.75})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (trailType === 'jabulani') {
      // Jabulani: azul celeste e dourado
      ctx.fillStyle = `rgba(2, 132, 199, ${p.alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Clássico âmbar
      ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(p.x, posY, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Renderiza a bola com sombra proporcional, projeção de altura realista em 2D e giro do spin.
 * Adapta texturas e cores conforme o modelo de bola equipado.
 */
export function renderBallWithShadow(
  ctx: CanvasRenderingContext2D,
  ball: BallPhysicsState,
  options?: { perspectiveProgress?: number; customScale?: number }
): void {
  const { perspectiveProgress = 1, customScale = 1 } = options || {};
  const ballItem = getBallById(ball.ballId);

  // Rastro visual se for chute bomba ou bola especial
  if (ball.hasMotionTrail && ball.trailPoints.length > 0) {
    renderMotionTrail(ctx, ball.trailPoints, ball.ballId);
  }

  // Altura Z simula bola no alto
  const heightOffset = ball.z * 0.85;

  // 1. Sombra da Bola no Gramado (afasta-se e fica mais suave conforme a bola sobe)
  const shadowRadius = Math.max(3, (ball.baseRadius * perspectiveProgress * customScale) * (1 - Math.min(0.5, ball.z * 0.02)));
  const shadowAlpha = Math.max(0.12, 0.45 - (ball.z * 0.015));

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
  ctx.beginPath();
  // Sombra fica no plano do chão (Y), levemente projetada para a direita/baixo
  ctx.ellipse(ball.x + (ball.z * 0.3), ball.y + 4, shadowRadius, shadowRadius * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. A Bola no Ar com Rotação (cresce ligeiramente com a altura para dar sensação 3D)
  const visualRadius = Math.max(4, (ball.baseRadius * perspectiveProgress * customScale) * (1 + ball.z * 0.04));
  const ballVisualY = ball.y - heightOffset;

  ctx.save();
  ctx.translate(ball.x, ballVisualY);
  ctx.rotate(ball.rotationAngle || 0);

  // Corpo base da bola com cor do modelo equipado
  ctx.fillStyle = ballItem.primaryColor;
  ctx.beginPath();
  ctx.arc(0, 0, visualRadius, 0, Math.PI * 2);
  ctx.fill();

  // Contorno da bola
  ctx.strokeStyle = ballItem.secondaryColor || '#18181b';
  ctx.lineWidth = Math.max(1, visualRadius * 0.14);
  ctx.stroke();

  // Gomo central e detalhes específicos de textura por modelo
  if (ballItem.id === 'varzea_heavy') {
    // Bola de várzea: costuras cruzadas de couro cru
    ctx.strokeStyle = ballItem.accentColor || '#d97706';
    ctx.lineWidth = Math.max(1, visualRadius * 0.1);
    ctx.beginPath();
    ctx.moveTo(-visualRadius * 0.7, 0);
    ctx.lineTo(visualRadius * 0.7, 0);
    ctx.moveTo(0, -visualRadius * 0.7);
    ctx.lineTo(0, visualRadius * 0.7);
    ctx.stroke();
  } else if (ballItem.id === 'cyber_neon') {
    // Cyber Neon: anel concêntrico ciano e traços tecnológicos
    ctx.strokeStyle = ballItem.accentColor || '#22d3ee';
    ctx.lineWidth = Math.max(1, visualRadius * 0.12);
    ctx.beginPath();
    ctx.arc(0, 0, visualRadius * 0.55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(0, 0, visualRadius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else if (ballItem.id === 'golden_ball') {
    // Bola de Ouro: gomo central dourado metálico escuro com reflexo estelar
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    const innerR = visualRadius * 0.44;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const px = Math.cos(angle) * innerR;
      const py = Math.sin(angle) * innerR;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (ballItem.id === 'brazuca_pro') {
    // Brazuca: faixas fluidas verde e azul
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(0, 0, visualRadius * 0.7, visualRadius * 0.35, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(0, 0, visualRadius * 0.4, visualRadius * 0.2, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (ballItem.id === 'fire_meteor') {
    // Meteoro de fogo: núcleo vulcânico incandescente
    const grad = ctx.createRadialGradient(0, 0, visualRadius * 0.1, 0, 0, visualRadius);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#dc2626');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, visualRadius * 0.75, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Padrão clássico / pentagonal
    ctx.fillStyle = ballItem.secondaryColor || '#18181b';
    ctx.beginPath();
    const innerR = visualRadius * 0.42;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const px = Math.cos(angle) * innerR;
      const py = Math.sin(angle) * innerR;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Traços dos gomos laterais conectando à borda
    ctx.strokeStyle = ballItem.secondaryColor || '#27272a';
    ctx.lineWidth = Math.max(1, visualRadius * 0.08);
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const px = Math.cos(angle) * innerR;
      const py = Math.sin(angle) * innerR;
      const outerX = Math.cos(angle) * visualRadius;
      const outerY = Math.sin(angle) * visualRadius;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }
  }

  // Brilho de iluminação no topo
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.arc(-visualRadius * 0.3, -visualRadius * 0.3, visualRadius * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Aplica efeito de tremor de tela (Screen Shake) temporário no Canvas.
 */
export function applyScreenShake(ctx: CanvasRenderingContext2D, shakeIntensity: number): void {
  if (shakeIntensity <= 0) return;
  const offsetX = (Math.random() * 2 - 1) * shakeIntensity;
  const offsetY = (Math.random() * 2 - 1) * shakeIntensity;
  ctx.translate(offsetX, offsetY);
}
