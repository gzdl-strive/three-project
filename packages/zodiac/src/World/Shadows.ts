import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Renderer from '../Experience/Renderer';
import { Time } from '@gzdl/utils';
import ShadowMaterial from "../Materials/Shadow";
import World from './World';
import { ShadowMaterials, SunLightParameter } from './typing';

class Shadows {
  experience: Experience;
  scene: THREE.Scene;
  renderer: Renderer;
  world: World;
  sunLight: SunLightParameter;
  time: Time;
  geometry: THREE.PlaneGeometry;
  materials: ShadowMaterials;
  maxDistance: number;
  distancePower: number;
  color: string;
  items: any;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.world = this.experience.world;
    this.sunLight = this.world.environment.sunLight;
    this.time = this.experience.time;

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.materials = {
      wireframe: new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
      base: ShadowMaterial()
    };

    this.maxDistance = 3;
    this.distancePower = 2;
    this.color = "#000000";
    this.items = [];

    this.setMaterials();
  }

  setMaterials() {
    this.materials.base.depthWrite = false
    this.materials.base.uniforms.uColor.value = new THREE.Color(this.color)
    this.materials.base.uniforms.uAlpha.value = 0;
    this.materials.base.uniforms.uFadeRadius.value = 0.35;
  }

  add(_reference: any, _options: any) {
    const shadow: any = {}

    // Options
    shadow.offsetZ = typeof _options.offsetZ === 'undefined' ? 0 : _options.offsetZ;
    shadow.alpha = typeof _options.alpha === 'undefined' ? 1 : _options.alpha;

    // Reference
    shadow.reference = _reference;

    // Material
    shadow.material = this.materials.base.clone();

    // Mesh
    let geometry;
    if (_reference.name === 'ball') {
      geometry = new THREE.CircleGeometry(0.5, 32);
    }
    shadow.mesh = new THREE.Mesh(_reference.name === 'ball' ? geometry : this.geometry, shadow.material);
    shadow.mesh.position.z = 0.001;
    shadow.mesh.scale.set(_options.sizeX, _options.sizeY, 2.4);

    // Save
    this.scene.add(shadow.mesh);
    this.items.push(shadow);

    return shadow;
  }

  update() {
    for (const _shadow of this.items) {
      // Position
      const z = Math.max(_shadow.reference.position.z + _shadow.offsetZ, 0);
      const sunOffset = this.sunLight.vector.clone().multiplyScalar(z);

      _shadow.mesh.position.x = _shadow.reference.position.x + sunOffset.x
      _shadow.mesh.position.y = _shadow.reference.position.y + sunOffset.y

      // Angle
      const rotationVector = new THREE.Vector3(1, 0, 0)
      rotationVector.applyQuaternion(_shadow.reference.quaternion)
      const projectedRotationVector = rotationVector.clone().projectOnPlane(new THREE.Vector3(0, 0, 1))

      let orientationAlpha = Math.abs(rotationVector.angleTo(new THREE.Vector3(0, 0, 1)) - Math.PI * 0.5) / (Math.PI * 0.5)
      orientationAlpha /= 0.5
      orientationAlpha -= 1 / 0.5
      orientationAlpha = Math.abs(orientationAlpha)
      orientationAlpha = Math.min(Math.max(orientationAlpha, 0), 1)

      const angle = Math.atan2(projectedRotationVector.y, projectedRotationVector.x)
      _shadow.mesh.rotation.z = angle

      // Alpha
      let alpha = (this.maxDistance - z) / this.maxDistance
      alpha = Math.min(Math.max(alpha, 0), 1)
      alpha = Math.pow(alpha, this.distancePower)

      _shadow.material.uniforms.uAlpha.value = 0.3 * _shadow.alpha * orientationAlpha * alpha
    }
  }
}

export default Shadows;