import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Resources from '../utils/Resources';
import Environment from './Environment';
import Room from './Room';
import Floor from './Floor';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  environment!: Environment;
  room!: Room;
  floor!: Floor;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait from resources
    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.room = new Room();
      this.floor = new Floor();
    });
  }

  resize() {}

  update() {
    this.room?.update && (this.room.update());
  }
}