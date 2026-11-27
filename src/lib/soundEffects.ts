// ==============================================================================
// BOLA NA REDE: CARREIRA - SISTEMA DE EFEITOS SONOROS (Web Audio API Puro)
// Leve, zero dependências pesadas, sem arquivos de áudio externos para 4G instantâneo
// ==============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bnr_sound_muted');
      this.muted = saved === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bnr_sound_muted', String(this.muted));
    }
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bnr_sound_muted', String(this.muted));
    }
  }

  // 1. Apito de Árbitro de Futebol (Fox 40)
  public playWhistle() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Duas frequências próximas criam o batimento clássico do apito
      osc1.frequency.setValueAtTime(2800, now);
      osc2.frequency.setValueAtTime(2950, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.38);
      osc2.stop(now + 0.38);
    } catch {
      // Ignora silenciosamente em navegadores com restrição de autoplay
    }
  }

  // 2. Chute Seco na Bola
  public playKick() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // 3. Bola na Trave! (Impacto metálico percussivo)
  public playWoodwork() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const oscHarmo = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      oscHarmo.type = 'sine';
      oscHarmo.frequency.setValueAtTime(520, now);
      oscHarmo.frequency.exponentialRampToValueAtTime(120, now + 0.2);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      oscHarmo.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      oscHarmo.start(now);
      osc.stop(now + 0.32);
      oscHarmo.stop(now + 0.32);
    } catch {}
  }

  // 4. Torcida Vibrando / Lance Perigoso
  public playCheer() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Ruído branco filtrado
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.5);
    } catch {}
  }

  // 5. Golaço & Comemoração com Apito Longo
  public playGoal() {
    if (this.muted) return;
    this.playWhistle();
    setTimeout(() => {
      this.playCheer();
    }, 150);
  }

  // 6. Som de Cartão (Amarelo/Vermelho) — Alerta tenso
  public playCardSound() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  // 7. Som de Chuva Ambiente
  private rainNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  public playRainAmbient(active: boolean) {
    if (active && this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      if (!active) {
        if (this.rainGain) {
          this.rainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          setTimeout(() => { 
            this.rainNode?.stop(); 
            this.rainNode = null; 
            this.rainGain = null; 
          }, 600);
        }
        return;
      }
      if (this.rainNode) return; // já tocando
      const bufSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      this.rainNode = noise;
      this.rainGain = gain;
    } catch {}
  }

  // 8. Som de UI Click leve
  public playUiClick() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // 9. Som de Desbloqueio / Conquista
  public playUnlock() {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.15, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.22);
      });
    } catch {}
  }

  // 10. Chute com potência variável
  public playKickPower(power: number) {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 80 + (power / 100) * 100;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
      const vol = 0.2 + (power / 100) * 0.3;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Wrapper Universal para Minigames
  public play(type: 'whistle' | 'kick' | 'goal' | 'woodwork' | 'cheer' | 'card' | 'rain_on' | 'rain_off' | 'ui_click' | 'unlock' | string) {
    if (this.muted) return;
    switch (type) {
      case 'whistle': return this.playWhistle();
      case 'kick': return this.playKick();
      case 'goal': return this.playGoal();
      case 'woodwork': return this.playWoodwork();
      case 'cheer': return this.playCheer();
      case 'card': return this.playCardSound();
      case 'rain_on': return this.playRainAmbient(true);
      case 'rain_off': return this.playRainAmbient(false);
      case 'ui_click': return this.playUiClick();
      case 'unlock': return this.playUnlock();
      default: return this.playKick();
    }
  }
}

export const sound = new SoundEngine();

// Funções utilitárias diretas para facilidade de import
export const playWhistle = () => sound.playWhistle();
export const playKick = () => sound.playKick();
export const playWoodwork = () => sound.playWoodwork();
export const playCheer = () => sound.playCheer();
export const playGoal = () => sound.playGoal();
export const playCardSound = () => sound.playCardSound();
export const playRainAmbient = (active: boolean) => sound.playRainAmbient(active);
export const playUiClick = () => sound.playUiClick();
export const playUnlock = () => sound.playUnlock();
export const playKickPower = (power: number) => sound.playKickPower(power);
export const toggleMute = () => sound.toggleMute();
export const isMuted = () => sound.isMuted();