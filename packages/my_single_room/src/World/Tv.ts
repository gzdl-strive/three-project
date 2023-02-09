import * as THREE from 'three';
import Experience from '../Experience/Experience';
import Resources from '../utils/Resources';
import { TvType } from '../utils/typing';
import { VideoTexture } from 'three';

class Tv {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources
  tv: TvType;
  actualTv: THREE.Group;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.tv = (this.resources.items.tv as TvType);
    this.actualTv = this.tv.scene;

    // 设置TV
    this.setTv();
  }

  setTv() {
    this.actualTv.children.forEach(child => {
      if (child.name === 'tv_screen') {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          map: (this.resources.items.tv_video as VideoTexture)
        });
      }

      this.actualTv.scale.set(0.4, 0.4, 0.4);
      this.scene.add(this.actualTv);
    });
  }
}

export default Tv;