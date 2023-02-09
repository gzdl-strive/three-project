import * as THREE from 'three';
import GSAP from 'gsap';
import Experience from "../Experience/Experience";
import Resources from '../utils/Resources';
import Environment from './Environment';
import Room from './Room';
import Tv from './Tv';
import Floor from './Floor';
import { Lerp } from '../utils/typing';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  environment!: Environment;
  room!: Room;
  tv!: Tv;
  floor!: Floor;
  lerp: Lerp;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    // Wait from resources
    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.room = new Room();
      this.tv = new Tv();
      this.floor = new Floor();
    });

    // 鼠标滑动时
    this.onMousemove();    
  }

  onMousemove() {
    window.addEventListener('mousemove', (e) => {
      this.lerp.target = (e.clientX / window.innerWidth - 0.5) * 2 * 0.1;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    if (this.room) {
      this.room.actualRoom.rotation.y = this.lerp.current;
    }
    if (this.tv) {
      this.tv.actualTv.rotation.y = this.lerp.current;
    }

    this.room?.update && (this.room.update());
  }
}