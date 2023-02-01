import * as THREE from 'three';
import Experience from '../Experience/Experience';

export default class Floor {
  experience: Experience;
  scene: THREE.Scene;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setFloor();
  }

  setFloor() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xfed833,
      side: THREE.BackSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.position.y = -0.1;
    this.scene.add(mesh);
  }
}