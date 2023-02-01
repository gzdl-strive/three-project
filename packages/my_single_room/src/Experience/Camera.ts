import * as THREE from 'three';
import { Sizes } from '@gzdl/utils';
import Experience from './Experience';

export default class Camera {
  experience: Experience;
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement | undefined;
  perspectiveCamera: THREE.PerspectiveCamera | null;
  orthographicCamera: THREE.OrthographicCamera | null;
  helper: THREE.CameraHelper | null;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.perspectiveCamera = null;
    this.orthographicCamera = null;
    this.helper = null;

    this.setPerspectiveCamera();
    this.setOrthographicCamera();
  }

  // 设置perspectiveCamera
  setPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    );
    this.scene.add(this.perspectiveCamera);
    this.perspectiveCamera.position.x = 22;
    this.perspectiveCamera.position.y = 36;
    this.perspectiveCamera.position.z = 2;
  }

  // 设置orthographicCamera--正交相机
  setOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      -this.sizes.aspect * this.sizes.orthographicNum / 2,
      this.sizes.aspect * this.sizes.orthographicNum / 2,
      this.sizes.orthographicNum / 2,
      -this.sizes.orthographicNum / 2,
      -50,
      50
    );

    this.orthographicCamera.position.y = 4;
    this.orthographicCamera.position.z = 5;
    this.orthographicCamera.rotation.x = - Math.PI / 6;

    this.scene.add(this.orthographicCamera);

    // this.helper = new THREE.CameraHelper(this.orthographicCamera);
    // this.scene.add(this.helper);

    // 网格
    // const size = 20;
    // const divisions = 20;
    // const gridHelper = new THREE.GridHelper(size, divisions);
    // this.scene.add(gridHelper);
    // 坐标轴
    // const axesHelper = new THREE.AxesHelper(10);
    // this.scene.add(axesHelper);
  }

  resize() {
    if (!this.perspectiveCamera) return;
    // 更新perspectiveCamera
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();
    // 更新orthographicCamera
    if (!this.orthographicCamera) return;
    this.orthographicCamera.left = -this.sizes.aspect * this.sizes.orthographicNum / 2;
    this.orthographicCamera.right = this.sizes.aspect * this.sizes.orthographicNum / 2;
    this.orthographicCamera.top = this.sizes.orthographicNum / 2;
    this.orthographicCamera.bottom = -this.sizes.orthographicNum / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update() {
    // 更新OrbitControls
    // this.controls.update();
  }
}