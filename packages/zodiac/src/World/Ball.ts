// import * as THREE from 'three';
import Experience from "../Experience/Experience";

class Ball {
  experience: Experience;
  scene: THREE.Scene;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
  }
}

export default Ball;