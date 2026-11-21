export class InputController {
  constructor() {
    this.keys = {};
    this.touch = { left: false, right: false, gas: false, brake: false, nitro: false, handbrake: false };
    this.shiftUpQueued = false;
    this.shiftDownQueued = false;

    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.code === 'KeyE') this.shiftUpQueued = true;
      if (e.code === 'KeyQ') this.shiftDownQueued = true;
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });

    this.bindTouch('touch-left', 'left');
    this.bindTouch('touch-right', 'right');
    this.bindTouch('touch-gas', 'gas');
    this.bindTouch('touch-brake', 'brake');
    this.bindTouch('touch-nitro', 'nitro');
    this.bindTouch('touch-handbrake', 'handbrake');
  }

  bindTouch(id, prop) {
    const el = document.getElementById(id);
    if (!el) return;
    const setVal = v => e => { e.preventDefault(); this.touch[prop] = v; };
    el.addEventListener('touchstart', setVal(true), { passive: false });
    el.addEventListener('touchend', setVal(false), { passive: false });
    el.addEventListener('mousedown', setVal(true));
    el.addEventListener('mouseup', setVal(false));
  }

  poll(transmission) {
    let steer = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touch.left) steer += 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touch.right) steer -= 1;

    let throttle = (this.keys['ArrowUp'] || this.keys['KeyW'] || this.touch.gas) ? 1 : 0;
    let brake = (this.keys['ArrowDown'] || this.keys['KeyS'] || this.touch.brake) ? 1 : 0;
    let nitro = Boolean(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['KeyN'] || this.touch.nitro);
    let handbrake = Boolean(this.keys['Space'] || this.touch.handbrake);

    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = pads[0];
    if (gp) {
      if (Math.abs(gp.axes[0]) > 0.12) steer = -gp.axes[0];
      if (gp.buttons[7]?.value > 0.05) throttle = gp.buttons[7].value;
      if (gp.buttons[6]?.value > 0.05) brake = gp.buttons[6].value;
      if (gp.buttons[0]?.pressed) handbrake = true;
      if (gp.buttons[1]?.pressed) nitro = true;
    }

    const shiftUp = this.shiftUpQueued;
    const shiftDown = this.shiftDownQueued;
    this.shiftUpQueued = false;
    this.shiftDownQueued = false;

    return { steer, throttle, brake, nitro, handbrake, transmission, shiftUp, shiftDown };
  }
}