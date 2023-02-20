import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Resources from "../utils/Resources";
import World from './World';
import Shadows from './Shadows';

class Ball {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  world: World;
  shadows: Shadows;
  ball: THREE.Texture;
  ballMesh: THREE.Mesh;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.world = this.experience.world;
    this.shadows = this.world.shadows;
    this.ball = this.resources.items.earth as THREE.Texture;
    this.ballMesh = new THREE.Mesh();

    this.setBall();
  }

  setBall() {
    this.ball.wrapS = THREE.RepeatWrapping;
    this.ball.wrapT = THREE.RepeatWrapping;
    this.ball.repeat.set(1, 1);
    this.ball.anisotropy = 1;
    this.ball.encoding = THREE.sRGBEncoding;
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      map: this.ball
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'ball';
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeBoundingBox();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, 0, 5);
    this.ballMesh = mesh;

    this.shadows.add(mesh, { sizeX: 1.4, sizeY: 1.4, offsetZ: 0.1 });

    this.scene.add(mesh);
  }
}

export default Ball;