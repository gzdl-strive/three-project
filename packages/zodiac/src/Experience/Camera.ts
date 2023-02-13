import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Sizes } from '@gzdl/utils';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Debug from '../utils/Debug';

class Camera {
  experience: Experience;
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement | undefined;
  debug: Debug;
  debugFolder: dat.GUI | null;
  perspectiveCamera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
  helper: THREE.CameraHelper | null;
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.debugFolder = null;

    this.perspectiveCamera = null;
    this.controls = null;
    this.helper = null;

    this.debug.active && this.initDebug();

    this.setPerspectiveCamera();
    this.setOrbitControls();
    this.setCameraHelper();
  }

  // 初始化debug
  initDebug() {
    if (!this.debug.ui) return;
    this.debugFolder = this.debug.ui.addFolder('camera');
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
    this.perspectiveCamera.position.set(0, 20, 0);

    // debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.perspectiveCamera.position, 'x')
        .name('位置X')
        .min(-5)
        .max(5)
        .step(0.001);
      this.debugFolder
        .add(this.perspectiveCamera.position, 'y')
        .name('位置Y')
        .min(-20)
        .max(20)
        .step(0.001);
      this.debugFolder
        .add(this.perspectiveCamera.position, 'z')
        .name('位置Z')
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setOrbitControls() {
    if (!this.perspectiveCamera) return;
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
  }

  setCameraHelper() {
    if (!this.perspectiveCamera) return;
    // this.helper = new THREE.CameraHelper(this.perspectiveCamera);
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
    // 更新perspectiveCamera
    if (!this.perspectiveCamera) return;
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();
  }

  update() {
    // 更新OrbitControls
    this.controls && this.controls.update();
  }
}

export default Camera;