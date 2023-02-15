import * as THREE from 'three';
import { Sizes } from '@gzdl/utils';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Renderer from './Renderer';

class Camera {
  experience: Experience;
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement | undefined;
  renderer: Renderer;
  perspectiveCamera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
  helper: THREE.CameraHelper | null;
  target: THREE.Vector3;
  targetEased: THREE.Vector3;
  easing: number;
  angle: any;
  zoom: any;
  pan: any;
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.renderer = this.experience.renderer;

    this.perspectiveCamera = null;
    this.controls = null;
    this.helper = null;

    this.target = new THREE.Vector3(0, 0, 0);
    this.targetEased = new THREE.Vector3(0, 0, 0);
    this.easing = 0.15;

    this.angle = {};

    this.setAngle();
    this.setPerspectiveCamera();
    this.setZoom();
    this.setPan();
    this.setOrbitControls();
    this.setCameraHelper();
  }

  setAngle() {
    // Items
    this.angle.items = {
      default: new THREE.Vector3(1.135, - 1.45, 1.15),
      projects: new THREE.Vector3(0.38, - 1.4, 1.63)
    };
    // Value
    this.angle.value = new THREE.Vector3();
    this.angle.value.copy(this.angle.items.default);
  }

  // 设置perspectiveCamera
  setPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      40,
      this.sizes.aspect,
      1,
      80
    );
    this.perspectiveCamera.up.set(0, 0, 1);
    this.perspectiveCamera.position.copy(this.angle.value);
    this.perspectiveCamera.lookAt(new THREE.Vector3());
    this.scene.add(this.perspectiveCamera);
  }

  setZoom() {
    this.zoom = {}
    this.zoom.easing = 0.1
    this.zoom.minDistance = 14
    this.zoom.amplitude = 15
    this.zoom.value = 0.5
    this.zoom.targetValue = this.zoom.value
    this.zoom.distance = this.zoom.minDistance + this.zoom.amplitude * this.zoom.value

    // Listen to mousewheel event
    document.addEventListener('mousewheel', (_event: any) => {
      this.zoom.targetValue += _event.deltaY * 0.001
      this.zoom.targetValue = Math.min(Math.max(this.zoom.targetValue, 0), 1)
      console.log(this.zoom.targetValue);
    }, { passive: true })
  }

  setPan() {
    // Set up
    this.pan = {}
    this.pan.enabled = false
    this.pan.active = false
    this.pan.easing = 0.1
    this.pan.start = {}
    this.pan.start.x = 0
    this.pan.start.y = 0
    this.pan.value = {}
    this.pan.value.x = 0
    this.pan.value.y = 0
    this.pan.targetValue = {}
    this.pan.targetValue.x = this.pan.value.x
    this.pan.targetValue.y = this.pan.value.y
    this.pan.raycaster = new THREE.Raycaster()
    this.pan.mouse = new THREE.Vector2()
    this.pan.needsUpdate = false
    this.pan.hitMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })
    )
    this.scene.add(this.pan.hitMesh)

    this.pan.reset = () => {
      this.pan.targetValue.x = 0
      this.pan.targetValue.y = 0
    }

    this.pan.enable = () => {
      this.pan.enabled = true

      // Update cursor
      // this.renderer.domElement.classList.add('has-cursor-grab')
    }

    this.pan.disable = () => {
      this.pan.enabled = false

      // Update cursor
      // this.renderer.domElement.classList.remove('has-cursor-grab')
    }

    this.pan.down = (_x: number, _y: number) => {
      if (!this.pan.enabled) {
        return
      }

      // Update cursor
      // this.renderer.domElement.classList.add('has-cursor-grabbing')

      // Activate
      this.pan.active = true

      // Update mouse position
      // this.pan.mouse.x = (_x / this.sizes.viewport.width) * 2 - 1
      // this.pan.mouse.y = - (_y / this.sizes.viewport.height) * 2 + 1

      // Get start position
      this.pan.raycaster.setFromCamera(this.pan.mouse, this.perspectiveCamera)

      const intersects = this.pan.raycaster.intersectObjects([this.pan.hitMesh])

      if (intersects.length) {
        this.pan.start.x = intersects[0].point.x
        this.pan.start.y = intersects[0].point.y
      }
    }

    this.pan.move = (_x: number, _y: number) => {
      if (!this.pan.enabled) {
        return
      }

      if (!this.pan.active) {
        return
      }

      // this.pan.mouse.x = (_x / this.sizes.viewport.width) * 2 - 1
      // this.pan.mouse.y = - (_y / this.sizes.viewport.height) * 2 + 1

      this.pan.needsUpdate = true
    }

    this.pan.up = () => {
      // Deactivate
      this.pan.active = false

      // Update cursor
      // this.renderer.domElement.classList.remove('has-cursor-grabbing')
    }

    // Mouse
    window.addEventListener('mousedown', (_event) => {
      this.pan.down(_event.clientX, _event.clientY)
    })

    window.addEventListener('mousemove', (_event) => {
      this.pan.move(_event.clientX, _event.clientY)
    })

    window.addEventListener('mouseup', () => {
      this.pan.up()
    })
  }

  setOrbitControls() {
    if (!this.perspectiveCamera) return;
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enabled = false;
    this.controls.zoomSpeed = 0.5;
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
    if (this.controls && !this.controls.enabled) {
      this.targetEased.x += (this.target.x - this.targetEased.x) * this.easing;
      this.targetEased.y += (this.target.y - this.targetEased.y) * this.easing;
      this.targetEased.z += (this.target.z - this.targetEased.z) * this.easing;

      if (!this.perspectiveCamera) return;

      // Apply zoom
      this.perspectiveCamera.position.copy(this.targetEased).add(this.angle.value.clone().normalize().multiplyScalar(this.zoom.distance))

      // Look at target
      this.perspectiveCamera.lookAt(this.targetEased);

      // Apply pan
      this.perspectiveCamera.position.x += this.pan.value.x
      this.perspectiveCamera.position.y += this.pan.value.y
    }
    if (this.zoom) {
      this.zoom.value += (this.zoom.targetValue - this.zoom.value) * this.zoom.easing
      this.zoom.distance = this.zoom.minDistance + this.zoom.amplitude * this.zoom.value
    }

    // If active
    if (this.pan.active && this.pan.needsUpdate) {
      // Update target value
      this.pan.raycaster.setFromCamera(this.pan.mouse, this.perspectiveCamera)

      const intersects = this.pan.raycaster.intersectObjects([this.pan.hitMesh])

      if (intersects.length) {
        this.pan.targetValue.x = - (intersects[0].point.x - this.pan.start.x)
        this.pan.targetValue.y = - (intersects[0].point.y - this.pan.start.y)
      }

      // Update needsUpdate
      this.pan.needsUpdate = false
    }

    // Update value and apply easing
    this.pan.value.x += (this.pan.targetValue.x - this.pan.value.x) * this.pan.easing
    this.pan.value.y += (this.pan.targetValue.y - this.pan.value.y) * this.pan.easing
  }
}

export default Camera;