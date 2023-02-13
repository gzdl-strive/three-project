import * as THREE from 'three';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import { FloorTexture } from './typing';

export default class Floor {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setFloor();
  }

  setFloor() {
    const geometry = new THREE.CircleGeometry(5, 64);
    const textures: FloorTexture = {};

    textures.color = (this.resources.items.floorColorTexture as THREE.Texture);
    textures.color.encoding = THREE.sRGBEncoding;
    textures.color.repeat.set(1.5, 1.5);
    textures.color.wrapS = THREE.RepeatWrapping;
    textures.color.wrapT = THREE.RepeatWrapping;

    textures.normal = (this.resources.items.floorNormalTexture as THREE.Texture);
    textures.normal.repeat.set(1.5, 1.5);
    textures.normal.wrapS = THREE.RepeatWrapping;
    textures.normal.wrapT = THREE.RepeatWrapping;

    const material = new THREE.MeshStandardMaterial({
      map: textures.color,
      normalMap: textures.normal,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.position.y = -0.01;
    this.scene.add(mesh);
  }
}