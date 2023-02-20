import * as THREE from 'three';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import Debug from '../utils/Debug';
import { SunLightParameter } from './typing';
import { DebugFolder } from '../utils/typing';

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  debug: Debug;
  debugFolder: DebugFolder;
  sunLight: SunLightParameter;
  ambientLight: THREE.AmbientLight | null;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.debugFolder = null;

    this.sunLight = {
      position: new THREE.Vector3(0.6, 0.2, 3),
      vector: new THREE.Vector3
    };
    this.ambientLight = null;

    this.debug.active && this.initDebug();

    this.setSunLight();
    this.setAmbientLight();
  }

  // 初始化debug
  initDebug() {
    if (!this.debug.ui) return;
    this.debugFolder = this.debug.ui.addFolder('environment');
  }

  // 太阳光
  setSunLight() {
    this.sunLight.update = (): void => {
      this.sunLight.vector.copy(this.sunLight.position);
    }
    this.sunLight.update();
  }

  // 环境光
  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);
  }
}