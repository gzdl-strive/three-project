import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Resources from '../utils/Resources';
import { BasedType } from '../utils/typing';

class BaseObjects {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  basedObjects: BasedType;
  actualBasedObjects: THREE.Group;
  basedObjectsList: THREE.Mesh[];
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.basedObjects = (this.resources.items.based as BasedType);
    this.actualBasedObjects = this.basedObjects.scene;    
    this.basedObjectsList = [];

    // 设置基座
    this.setBased();
  }

  setBased() {
    this.actualBasedObjects.children.forEach(child => {
      child.castShadow = true;
      child.receiveShadow = true;
      
      if (child.name === 'based') {
        child.rotateX(Math.PI / 2);
        child.scale.set(3, 3, 3);
        child.position.y = -15;
        this.basedObjectsList.push(child as THREE.Mesh);
        this.scene.add(child); 
      }
    });
  }
}
export default BaseObjects;