import Experience from "../Experience/Experience";
import Camera from "../Experience/Camera";
import { ControlsAction, ControlsKeyboard } from './typing';

class Controls {
  experience: Experience;
  camera: Camera;
  actions: ControlsAction;
  keyboard: ControlsKeyboard;
  constructor() {
    this.experience = new Experience;
    this.camera = this.experience.camera;

    this.actions = {
      left: false,
      right: false,
      up: false,
      down: false
    };
    this.keyboard = {};

    this.setActions();
    this.setKeyboard();
  }

  setActions() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.actions.up = false;
        this.actions.right = false;
        this.actions.down = false;
        this.actions.left = false;
      }
    })
  }

  resetActions() {
    this.actions.up = false;
    this.actions.down = false;
    this.actions.left = false;
    this.actions.right = false;
  }

  setKeyboard() {
    this.keyboard.keyDown = (_event: KeyboardEvent) => {
      switch (_event.key) {
        case 'ArrowUp':
        case 'w':
          this.camera.pan.reset();
          this.actions.up = true;
          break

        case 'ArrowRight':
        case 'd':
          this.actions.right = true;
          break

        case 'ArrowDown':
        case 's':
          this.camera.pan.reset();
          this.actions.down = true;
          break

        case 'ArrowLeft':
        case 'a':
          this.actions.left = true;
          break;
      }
    }
    this.keyboard.keyUp = (_event: KeyboardEvent) => {
      switch (_event.key) {
        case 'ArrowUp':
        case 'w':
          this.camera.pan.reset();
          this.actions.up = false;
          break;

        case 'ArrowRight':
        case 'd':
          this.actions.right = false;
          break;

        case 'ArrowDown':
        case 's':
          this.camera.pan.reset();
          this.actions.down = false;
          break;

        case 'ArrowLeft':
        case 'a':
          this.actions.left = false;
          break;
        // case 'r':
        //   this.trigger('action', ['reset'])
        //   break
      }
    }

    document.addEventListener('keydown', this.keyboard.keyDown);
    document.addEventListener('keyup', this.keyboard.keyUp);
  }
}

export default Controls;