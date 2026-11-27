import { describe, expect, it } from 'vitest';
import { calculateShotPhysics, updateBallPhysicsStep } from '../ballPhysics';

describe('ballPhysics', () => {
  it('classifica chute fraco quando power < 38', () => {
    const result = calculateShotPhysics({
      startX: 100,
      startY: 300,
      targetX: 100,
      targetY: 100,
      power: 25,
    });

    expect(result.shotType).toBe('weak');
    expect(result.commentaryKey).toBe('shot_weak');
    expect(result.ball.inFlight).toBe(true);
    expect(result.ball.vy).toBeLessThan(0);
  });

  it('classifica chute médio equilibrado na zona verde (38..86)', () => {
    const result = calculateShotPhysics({
      startX: 200,
      startY: 400,
      targetX: 200,
      targetY: 120,
      power: 65,
      composureAttr: 90,
      finishingAttr: 90,
    });

    expect(result.shotType).toBe('medium');
    expect(result.commentaryKey).toBe('shot_medium');
    expect(result.ball.hasMotionTrail).toBe(true);
    expect(result.ball.isOffTarget).toBe(false);
  });

  it('classifica chute forte (bomba) quando power > 86 com rastro e screenShake', () => {
    const result = calculateShotPhysics({
      startX: 200,
      startY: 400,
      targetX: 200,
      targetY: 100,
      power: 95,
      composureAttr: 99,
      impactPoint: { x: 0, y: 0 },
    });

    expect(result.shotType).toBe('power');
    expect(result.ball.hasMotionTrail).toBe(true);
    expect(result.ball.screenShake).toBe(6.5);
  });

  it('isola por cima quando chute bomba acerta muito embaixo da bola (impY > 0.55)', () => {
    const result = calculateShotPhysics({
      startX: 200,
      startY: 400,
      targetX: 200,
      targetY: 100,
      power: 92,
      impactPoint: { x: 0, y: 0.8 },
    });

    expect(result.shotType).toBe('power');
    expect(result.ball.isOffTarget).toBe(true);
    expect(result.ball.offTargetReason).toBe('high');
    expect(result.commentaryKey).toBe('shot_off_target_high');
  });

  it('aplica cavadinha (lob) quando isLob é true', () => {
    const result = calculateShotPhysics({
      startX: 150,
      startY: 300,
      targetX: 150,
      targetY: 150,
      power: 70,
      isLob: true,
    });

    expect(result.shotType).toBe('lob');
    expect(result.commentaryKey).toBe('dribble_chapeu');
    expect(result.ball.vz).toBeCloseTo(4.2, 5);
  });

  it('aplica curva lateral conforme o ponto de impacto', () => {
    const rightCurve = calculateShotPhysics({
      startX: 200,
      startY: 350,
      targetX: 200,
      targetY: 100,
      power: 60,
      impactPoint: { x: -0.8, y: 0 },
    });

    const leftCurve = calculateShotPhysics({
      startX: 200,
      startY: 350,
      targetX: 200,
      targetY: 100,
      power: 60,
      impactPoint: { x: 0.8, y: 0 },
    });

    expect(rightCurve.ball.spinCurve).toBeGreaterThan(0);
    expect(leftCurve.ball.spinCurve).toBeLessThan(0);
  });

  it('atualiza posição, gravidade, quique e rastro em updateBallPhysicsStep', () => {
    const { ball } = calculateShotPhysics({
      startX: 100,
      startY: 300,
      targetX: 100,
      targetY: 100,
      power: 75,
    });

    const initialY = ball.y;
    for (let i = 0; i < 40; i++) {
      updateBallPhysicsStep(ball);
    }

    expect(ball.y).toBeLessThan(initialY);
    expect(ball.trailPoints.length).toBeGreaterThan(0);
    expect(ball.trailPoints.length).toBeLessThanOrEqual(8);
    expect(ball.z).toBeGreaterThanOrEqual(0);
  });
});
