import * as dat from 'dat.gui';

class Debug {
  active: Boolean;
  ui: dat.GUI | null;
  constructor() {
    this.active = window.location.hash === '#debug';
    this.ui = null;

    this.active && this.setPanel();
  }

  // 设置Debug面板
  setPanel() {
    this.ui = new dat.GUI({
      width: 300
    });
    // this.ui.domElement.setAttribute('style', 'position: fixed; left: 10px; top: 0;');
  }
}

export default Debug;