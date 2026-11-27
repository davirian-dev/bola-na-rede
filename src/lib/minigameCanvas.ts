// Utilitários compartilhados de renderização Canvas 2D para os minigames do Bola na Rede

export interface DrawPlayerOptions {
  jerseyColor: string;
  shortsColor?: string;
  skinColor?: string;
  hairColor?: string;
  gloveColor?: string;
  label?: string;
  labelColor?: string;
  scale?: number;
  divingTilt?: number; // radianos para animação de salto/pulo
  sliding?: boolean;
}

/**
 * Desenha gramado com faixas em 2 tons de verde e linhas básicas.
 */
export function drawPitchBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stripeSize = 28
) {
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#047857';
  for (let y = 0; y < h; y += stripeSize * 2) {
    ctx.fillRect(0, y, w, stripeSize);
  }

  // Borda externa sutil do campo
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 10, w - 24, h - 20);
}

/**
 * Desenha trave com rede em malha, sombra e postes brancos.
 */
export function drawGoalWithNet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  netStretch = 0
) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 25, 20, 0.55)';
  ctx.fillRect(x, y - netStretch, w, h + netStretch);

  // Malha da rede
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  for (let rx = x + 12; rx < x + w; rx += 14) {
    ctx.beginPath();
    ctx.moveTo(rx, y - netStretch);
    ctx.lineTo(rx, y + h);
    ctx.stroke();
  }
  for (let ry = y + 10; ry < y + h; ry += 12) {
    ctx.beginPath();
    ctx.moveTo(x, ry);
    ctx.lineTo(x + w, ry);
    ctx.stroke();
  }

  // Postes e travessão
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();
  ctx.restore();
}

/**
 * Desenha bonequinho estilizado de futebol (cabeça, cabelo, camisa, braços/luvas, shorts, chuteiras e etiqueta).
 */
export function drawCartoonPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  opts: DrawPlayerOptions
) {
  const {
    jerseyColor,
    shortsColor = '#0f172a',
    skinColor = '#f1c27d',
    hairColor = '#1f2937',
    gloveColor,
    label,
    labelColor = '#ffffff',
    scale = 1,
    divingTilt = 0,
    sliding = false,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  if (divingTilt !== 0) ctx.rotate(divingTilt);
  if (sliding) ctx.rotate(-0.45);
  ctx.scale(scale, scale);

  // Sombra no gramado
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 12, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chuteiras
  ctx.fillStyle = '#111827';
  ctx.fillRect(-7, 13, 5, 4);
  ctx.fillRect(2, 13, 5, 4);

  // Shorts
  ctx.fillStyle = shortsColor;
  ctx.fillRect(-8, 5, 16, 8);

  // Camisa
  ctx.fillStyle = jerseyColor;
  ctx.beginPath();
  ctx.roundRect(-10, -8, 20, 14, 4);
  ctx.fill();

  // Faixa vertical na camisa
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(-2.5, -8, 5, 14);

  // Braços / Luvas
  ctx.fillStyle = gloveColor || skinColor;
  const armY = gloveColor ? -4 : 0;
  const armX = gloveColor ? 13.5 : 11.5;
  ctx.beginPath();
  ctx.arc(-armX, armY, gloveColor ? 4.2 : 3.2, 0, Math.PI * 2);
  ctx.arc(armX, armY, gloveColor ? 4.2 : 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Cabeça
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(0, -13, 6.2, 0, Math.PI * 2);
  ctx.fill();

  // Cabelo
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.ellipse(0, -17, 5.8, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  if (label) {
    ctx.save();
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(label).width + 8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.roundRect(x - textW / 2, y - 34 * scale, textW, 13, 4);
    ctx.fill();
    ctx.fillStyle = labelColor;
    ctx.fillText(label, x, y - 24.5 * scale);
    ctx.restore();
  }
}

/**
 * Desenha bola estilizada com sombra em altura Z e rastro opcional.
 */
export function drawStyledBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  z = 0,
  trailPoints: { x: number; y: number; z?: number }[] = [],
  trailColor = '250, 204, 21'
) {
  ctx.save();
  // Rastro de velocidade
  trailPoints.forEach((pt, idx) => {
    const ratio = (idx + 1) / trailPoints.length;
    ctx.fillStyle = `rgba(${trailColor}, ${ratio * 0.4})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y - (pt.z || 0), Math.max(2, radius * ratio * 0.85), 0, Math.PI * 2);
    ctx.fill();
  });

  // Sombra proporcional à altura
  const shadowScale = Math.max(0.4, 1 - z * 0.01);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x, y + 3, radius * shadowScale, radius * 0.4 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Esfera da bola
  const drawY = y - z;
  const drawR = radius * (1 + Math.min(0.45, z * 0.006));
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, drawY, drawR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Gomos
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.arc(x, drawY, drawR * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Converte coordenadas de cliente (mouse/touch) para coordenadas reais do Canvas.
 */
export function getCanvasPointerCoords(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}
