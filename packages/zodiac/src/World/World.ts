import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Resources from '../utils/Resources';
import Camera from '../Experience/Camera';
import Environment from './Environment';
import Floor from './Floor';
import Loading from './Loading';
import Zodiac from './Zodiac';
import Ball from './Ball';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  camera: Camera;
  environment!: Environment;
  floor!: Floor;
  loading: Loading;
  zodiac!: Zodiac;
  Ball!: Ball;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.floor = new Floor();
    this.loading = new Loading();

    // Wait from resources
    this.resources.on('ready', () => {
      this.environment = new Environment();
      // this.zodiac = new Zodiac();
      // this.ball = new Ball();
    });

    // Start
    this.loading.on('start', () => {
      this.camera.pan.enable();
    });
  }

  resize() {}

  update() {
    this.loading.active && this.loading.update();
  }
}