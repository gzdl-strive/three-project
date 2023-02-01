import Pubsub from '../pubsub';

class Time extends Pubsub {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  constructor() {
    super();

    // 初始化
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.tick();
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.emit('tick');

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}

export default Time;