export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc2.type = 'triangle';

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 320;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc1.start();
    this.engineOsc2.start();

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.screechFilter = this.ctx.createBiquadFilter();
    this.screechFilter.type = 'bandpass';
    this.screechFilter.frequency.value = 1400;
    this.screechFilter.Q.value = 6.0;

    this.screechGain = this.ctx.createGain();
    this.screechGain.gain.value = 0;

    this.noiseSource.connect(this.screechFilter);
    this.screechFilter.connect(this.screechGain);
    this.screechGain.connect(this.ctx.destination);
    this.noiseSource.start();

    this.initialized = true;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.engineGain && this.muted) {
      this.engineGain.gain.value = 0;
      this.screechGain.gain.value = 0;
    }
    return this.muted;
  }

  update(rpmRatio, throttle, isDrifting, isNitro, active) {
    if (!this.initialized || this.muted || !active) {
      if (this.engineGain) this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      if (this.screechGain) this.screechGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      return;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const baseFreq = 45 + rpmRatio * 155 + (isNitro ? 35 : 0);
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.03);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 0.5, this.ctx.currentTime, 0.03);
    this.engineFilter.frequency.setTargetAtTime(220 + rpmRatio * 900 + throttle * 400, this.ctx.currentTime, 0.04);
    this.engineGain.gain.setTargetAtTime(0.08 + throttle * 0.07, this.ctx.currentTime, 0.05);

    const screechTarget = isDrifting ? 0.07 : (isNitro ? 0.05 : 0);
    this.screechFilter.frequency.setTargetAtTime(isNitro ? 420 : 1450, this.ctx.currentTime, 0.05);
    this.screechGain.gain.setTargetAtTime(screechTarget, this.ctx.currentTime, 0.05);
  }

  playCollision(intensity = 0.5) {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(Math.min(0.25, intensity * 0.25), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.21);
  }
}