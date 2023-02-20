import * as THREE from 'three';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import { Time } from '@gzdl/utils';
import { ZodiacType } from '../utils/typing';

class Zodiac {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  time: Time;
  zodiac: ZodiacType;
  actualZodiac: THREE.Group;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.zodiac = (this.resources.items.zodiac as ZodiacType);
    this.actualZodiac = this.zodiac.scene;

    // 设置模型
    this.setModel();
  }

  setModel() {
    this.actualZodiac.children.forEach(child => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach(subChild => {
          subChild.castShadow = true;
          subChild.receiveShadow = true;
        })
      }
      this.actualZodiac.scale.set(0.6, 0.6, 0.6);
      this.scene.add(child);
    });
  }

  update() {}
}

export default Zodiac;