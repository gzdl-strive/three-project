import * as THREE from 'three';
import { Sizes } from '@gzdl/utils';
import Experience from './Experience';

class Camera {
  experience: Experience;
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement | undefined;
  orthographicCamera: THREE.OrthographicCamera | null;
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.orthographicCamera = null;

    this.setOrthographicCamera();
  }

  // 设置orthographicCamera——正交相机
  setOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      -this.sizes.aspect * this.sizes.orthographicNum / 2,
      this.sizes.aspect * this.sizes.orthographicNum / 2,
      this.sizes.orthographicNum / 2,
      -this.sizes.orthographicNum / 2,
      -50,
      50
    );

    this.orthographicCamera.rotation.x = - Math.PI / 2;

    this.scene.add(this.orthographicCamera);
  }

  resize() {
    // 更新orthographicCamera
    if (!this.orthographicCamera) return;
    this.orthographicCamera.left = -this.sizes.aspect * this.sizes.orthographicNum / 2;
    this.orthographicCamera.right = this.sizes.aspect * this.sizes.orthographicNum / 2;
    this.orthographicCamera.top = this.sizes.orthographicNum / 2;
    this.orthographicCamera.bottom = -this.sizes.orthographicNum / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update() {}
}

export default Camera;