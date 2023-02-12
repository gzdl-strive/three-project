import * as THREE from 'three';
import Experience from '../Experience/Experience';
// import GSAP from 'gsap';

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  sunLight: THREE.DirectionalLight | null;
  ambientLight: THREE.AmbientLight | null;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.sunLight = null;
    this.ambientLight = null;

    this.setSunLight();
    this.setAmbientLight();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.normalBias = 0.05;

    this.sunLight.position.set(4, 7, -3);
    this.scene.add(this.sunLight);
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);
  }
}