import * as THREE from 'three';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import Debug from '../utils/Debug';
import { EnvironmentDebugParameter } from './typing';
import { DebugFolder } from '../utils/typing';

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  debug: Debug;
  debugFolder: DebugFolder;
  parameters: EnvironmentDebugParameter | null;
  sunLight: THREE.DirectionalLight | null;
  ambientLight: THREE.AmbientLight | null;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.debugFolder = null;
    this.parameters = null;

    this.sunLight = null;
    this.ambientLight = null;

    this.debug.active && this.initDebug();

    this.setSunLight();
    this.setAmbientLight();
  }

  // 初始化debug
  initDebug() {
    if (!this.debug.ui) return;
    this.debugFolder = this.debug.ui.addFolder('environment');
    this.parameters = {
      color: 0xffffff,
      intensity: 3
    };
  }

  // 太阳光
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.normalBias = 0.05;
    // helper
    // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(helper);

    this.sunLight.position.set(4, 7, -3);
    this.scene.add(this.sunLight);

    // debug
    if (
      this.debug.active
      && this.debugFolder
      && this.parameters
    ) {
      this.debugFolder
        .add(this.parameters, 'intensity')
        .name('太阳光光线强度')
        .min(0)
        .max(10)
        .step(0.001)
        .onChange(() => {
          if (!this.parameters) return;
          this.sunLight && (this.sunLight.intensity = this.parameters.intensity);
          this.ambientLight && (this.ambientLight.intensity = this.parameters.intensity);
        });
      this.debugFolder
        .addColor(this.parameters, 'color')
        .name('太阳光光线颜色')
        .onChange(() => {
          if (!this.parameters) return;
          this.sunLight && this.sunLight.color.set(this.parameters.color);
          this.ambientLight && this.ambientLight.color.set(this.parameters.color);
        });
      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('位置X')
        .min(-5)
        .max(5)
        .step(0.001);
      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('位置Y')
        .min(-5)
        .max(5)
        .step(0.001);
      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('位置Z')
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  // 环境光
  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);
  }
}