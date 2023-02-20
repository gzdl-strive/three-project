import * as THREE from 'three';
import Experience from '../Experience/Experience';
import floorFragment from '../shaders/floor/fragment.glsl?raw';
import floorVertex from '../shaders/floor/vertex.glsl?raw';
import Debug from '../utils/Debug';
import { FloorColors } from './typing';
import { DebugFolder } from '../utils/typing';

class Floor {
  experience: Experience;
  scene: THREE.Scene;
  floor: THREE.Object3D;
  floor_colors: FloorColors;
  debug: Debug;
  debugFolder: DebugFolder;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.floor = new THREE.Object3D();
    this.floor_colors = {
      topLeft: '#b93cf5',
      topRight: '#fb42ff',
      bottomLeft: '#3136c4',
      bottomRight: '#cc52ea' 
    };
    this.debug = this.experience.debug;
    this.debugFolder = null;

    this.debug.active && this.initDebug();

    this.setFloor();
  }

  // 初始化Debug
  initDebug() {
    if (!this.debug.ui) return;
    this.debugFolder = this.debug.ui.addFolder('floor');
  }

  // 设置地板
  setFloor() {
    const that = this;
    this.floor.matrixAutoUpdate = false;
    // Geometry
    const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
    // Material
    const material = this.generateFloorMaterial();
    updateMaterial();

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    mesh.receiveShadow = true;
    mesh.updateMatrix();
    this.floor.add(mesh);
    this.scene.add(this.floor);

    function updateMaterial() {
      const topLeft = new THREE.Color(that.floor_colors.topLeft)
      const topRight = new THREE.Color(that.floor_colors.topRight)
      const bottomRight = new THREE.Color(that.floor_colors.bottomRight)
      const bottomLeft = new THREE.Color(that.floor_colors.bottomLeft)

      const data = new Uint8Array([
        Math.round(bottomLeft.r * 255), Math.round(bottomLeft.g * 255), Math.round(bottomLeft.b * 255), 200,
        Math.round(bottomRight.r * 255), Math.round(bottomRight.g * 255), Math.round(bottomRight.b * 255), 255,
        Math.round(topLeft.r * 255), Math.round(topLeft.g * 255), Math.round(topLeft.b * 255),255,
        Math.round(topRight.r * 255), Math.round(topRight.g * 255), Math.round(topRight.b * 255), 255
      ]);

      const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
      
      backgroundTexture.magFilter = THREE.LinearFilter;
      backgroundTexture.needsUpdate = true;

      material.uniforms.tBackground.value = backgroundTexture;
    }

    if (this.debugFolder) {
      this.debugFolder.addColor(this.floor_colors, 'topLeft').onChange(updateMaterial);
      this.debugFolder.addColor(this.floor_colors, 'topRight').onChange(updateMaterial);
      this.debugFolder.addColor(this.floor_colors, 'bottomRight').onChange(updateMaterial);
      this.debugFolder.addColor(this.floor_colors, 'bottomLeft').onChange(updateMaterial);
    }
  }

  // 生成地板材质
  generateFloorMaterial() {
    return new THREE.ShaderMaterial({
      wireframe: false,
      transparent: false,
      uniforms: {
        tBackground: { value: null }
      },
      vertexShader: floorVertex,
      fragmentShader: floorFragment
    });
  }
}

export default Floor;