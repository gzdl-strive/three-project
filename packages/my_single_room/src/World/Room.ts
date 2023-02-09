import * as THREE from 'three';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import { RoomType } from '../utils/typing';
import { Time } from '@gzdl/utils';

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
        const tank = child as THREE.Mesh;
        const tankMaterial = new THREE.MeshPhysicalMaterial;
        tank.material = tankMaterial;
        tankMaterial.roughness = 0;
        tankMaterial.color.set(0x549dd2);
        tankMaterial.ior = 3;
        tankMaterial.transmission = 1;
        tankMaterial.opacity = 1;
      }
      // 设置魔方
      if (child.name.startsWith('magic')) {
        if (child.name === 'magic_main' || child.name === 'magic_top') {
          const magicFrame = child as THREE.Mesh;
          const magicFrameMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
          });
          magicFrame.material = magicFrameMaterial;
        } else {
          const nameArr = child.name.split('_');
          if (nameArr.length === 3) {
            const color = nameArr[2];
            const magicBlock = child as THREE.Mesh;
            const magicBlockMaterial = new THREE.MeshBasicMaterial({
              color
            });
            magicBlock.material = magicBlockMaterial;
          }
        }
      }
      // 设置键盘
      if (child.name.startsWith('keyboard')) {
        const keyboard = child as THREE.Mesh;
        const keyboardMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000
        });
        keyboard.material = keyboardMaterial;
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