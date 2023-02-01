import * as THREE from 'three';
import { Sizes } from '@gzdl/utils';
import Experience from './Experience';
import Camera from './Camera';

export default class Renderer {
  experience: Experience;
  canvas: HTMLCanvasElement | undefined;
  sizes: Sizes;
  scene: THREE.Scene;
  camera: Camera;
  renderer: THREE.WebGLRenderer | null;

  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.renderer = null;

    this.setRenderer();
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    if (!this.renderer) return;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (!this.renderer) return;
    this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
    this.camera.orthographicCamera && this.renderer.render(this.scene, this.camera.orthographicCamera);
  }
}