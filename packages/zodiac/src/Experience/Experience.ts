import * as THREE from 'three';

import { Sizes, Time } from '@gzdl/utils';
import Debug from '../utils/Debug';
import Resources from '../utils/Resources';
import Sources from './Sources';

import Camera from './Camera';
import Renderer from './Renderer';

import World from '../World/World';

class Experience {
  static instance: Experience;
  canvas: HTMLCanvasElement | undefined;
  sizes!: Sizes;
  time!: Time;
  debug!: Debug;
  scene!: THREE.Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  resources!: Resources;
  constructor(_canvas?: HTMLCanvasElement) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.scene = new THREE.Scene();
    this.sizes = new Sizes();
    this.time = new Time();
    this.debug = new Debug();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(Sources);
    this.world = new World();

    // Resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.world.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}

export default Experience;