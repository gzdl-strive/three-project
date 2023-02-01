import * as THREE from 'three';
import GSAP from 'gsap';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import { RoomType } from '../utils/typing';
import { Time } from '@gzdl/utils';
import { VideoTexture } from 'three';

class Room {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  time: Time;
  room: RoomType;
  actualRoom: THREE.Group;
  mixer!: THREE.AnimationMixer;
  swim!: THREE.AnimationAction;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = (this.resources.items.room as RoomType);
    this.actualRoom = this.room.scene;

    
    // 设置模型
    this.setModel();
    // 设置动画
    this.setAnimation();
  }

  setModel() {
    this.actualRoom.children.forEach(child => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach(subChild => {
          subChild.castShadow = true;
          subChild.receiveShadow = true;
        })
      }
      // 设置鱼缸为透明材质
      if (child.name === 'fish_tank') {
        const tank = child.children[0] as THREE.Mesh;
        const tankMaterial = new THREE.MeshPhysicalMaterial;
        tank.material = tankMaterial;
        tankMaterial.roughness = 0;
        tankMaterial.color.set(0x549dd2);
        tankMaterial.ior = 3;
        tankMaterial.transmission = 1;
        tankMaterial.opacity = 1;
      }
      // 设置TV
      if (child.name === 'tv') {
        (child.children[1] as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          map: (this.resources.items.screen as VideoTexture)
        });
      }

      this.actualRoom.scale.set(0.4, 0.4, 0.4);
      this.scene.add(this.actualRoom);
    });
  }

  setAnimation() {
    // Mixer
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    // Actions_fish
    this.swim = this.mixer.clipAction(this.room.animations[0]);

    // play
    this.swim.play();
  }

  update() {
    this.mixer.update(this.time.delta * 0.0009);
  }
}

export default Room;