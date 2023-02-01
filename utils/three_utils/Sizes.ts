import Pubsub from '../pubsub';

class Sizes extends Pubsub {
  width: number;
  height: number;
  aspect: number;
  pixelRatio: number;
  orthographicNum: number;
  constructor() {
    super();
    // 初始化参数
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.orthographicNum = 5;

    // 页面尺寸改变回调
    this.ListenerResize();
  }

  ListenerResize() {
    // Resize event
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.emit('resize');
    });
  }
}

export default Sizes;