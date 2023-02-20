import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Resources from '../utils/Resources';
import Camera from '../Experience/Camera';
import Shadows from './Shadows';
import Environment from './Environment';
import Floor from './Floor';
import Loading from './Loading';
import Zodiac from './Zodiac';
import Ball from './Ball';
import BaseObjects from './BaseObjects';
import Controls from './Controls';
import Physics from './Physics';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  camera: Camera;
  shadows!: Shadows;
  physics!: Physics;
  environment!: Environment;
  floor!: Floor;
  loading: Loading;
  zodiac!: Zodiac;
  ball!: Ball;
  baseObjects!: BaseObjects;
  controls!: Controls;
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
    });

    // Start
    this.loading.on('start', () => {
      setTimeout(() => {
        this.camera.pan.enable();
      }, 2000);
      this.shadows = new Shadows();
      this.ball = new Ball();
      this.baseObjects = new BaseObjects();
      this.controls = new Controls();
      this.physics = new Physics();
      // this.zodiac = new Zodiac();
    });
  }

  resize() {}

  update() {
    this.loading.active && this.loading.update();
    this.shadows && this.shadows.update();
    this.physics && this.physics.update();
    // ball移动——更新相机目标位置
    if (this.ball && this.ball.ballMesh) {
      this.camera.target.x = this.ball.ballMesh.position.x;
      this.camera.target.y = this.ball.ballMesh.position.y;
    }
  }
}