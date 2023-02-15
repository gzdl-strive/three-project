import * as THREE from 'three';
// import GSAP from 'gsap';
import Experience from "../Experience/Experience";
import Resources from '../utils/Resources';
import Environment from './Environment';
import Floor from './Floor';
import Loading from './Loading';
import Zodiac from './Zodiac';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  environment!: Environment;
  floor!: Floor;
  loading: Loading;
  zodiac!: Zodiac;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.floor = new Floor();
    this.loading = new Loading();

    // Wait from resources
    this.resources.on('ready', () => {
      this.environment = new Environment();
      // this.zodiac = new Zodiac();
    });
  }

  resize() {}

  update() {}
}