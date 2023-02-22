import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Experience from '../Experience/Experience';
import { Time, Sizes } from '@gzdl/utils';
import { PhysicsFloor, PhysicsMaterials } from './typing';
import Controls from './Controls';

class Physics {
  experience: Experience;
  scene: THREE.Scene;
  controls: Controls;
  world: CANNON.World;
  floor: PhysicsFloor;
  materials: PhysicsMaterials;
  ball: CANNON.Body | null;
  scalingFactor: number;
  time: Time;
  sizes: Sizes;
  objectsToUpdate: any;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.controls = this.experience.world.controls;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;

    this.world = new CANNON.World();
    this.materials = {};
    this.floor = {};
    this.ball = null;
    this.scalingFactor = 0.05;

    this.objectsToUpdate = [];

    this.setWorld();
    this.setMaterials();
    this.setFloor();
    this.setBall();
  }

  setWorld() {
    this.world.gravity.set(0, 0, -3.25);
    this.world.allowSleep = true;
    this.world.defaultContactMaterial.friction = 0;
    this.world.defaultContactMaterial.restitution = 0.2;
  }

  setMaterials() {
    this.materials.items = {
      floor: new CANNON.Material('floorMaterial'),
      dummy: new CANNON.Material('dummyMaterial')
    }
    this.materials.contacts = {
      floorDummy: new CANNON.ContactMaterial(this.materials.items.floor, this.materials.items.dummy, { friction: 0.05, restitution: 0.3, contactEquationStiffness: 1000 }),
      dummyDummy: new CANNON.ContactMaterial(this.materials.items.dummy, this.materials.items.dummy, { friction: 0.3, restitution: 0, contactEquationStiffness: 1000 })
    }
  }

  setFloor() {
    this.floor.body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      material: this.materials.items!.floor
    });

    this.world.addBody(this.floor.body);
  }

  setBall() {
    const ball = new CANNON.Sphere(0.5);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0, 5),
      shape: ball,
      material: this.materials.items!.dummy,
      fixedRotation: false
    });
    body.position.set(0, 0, 5);
    this.world.addBody(body);

    this.ball = body;
    
    this.objectsToUpdate.push({
      mesh: this.experience.world.ball.ballMesh,
      body
    });
  }

  moveBall() {
    const { up, down, left, right } = this.controls.actions;
    const moveX = Number(right) - Number(left);
    const moveY = Number(up) - Number(down);

    if (!this.ball) return;
    if (moveX === 0 && moveY === 0) return;
    this.ball.position.x += this.scalingFactor * moveX;
    this.ball.position.y += this.scalingFactor * moveY;
    const rotationQuaternion = new CANNON.Quaternion(0, 0, 0, 1);
    if (moveX === 1 || moveX === -1) {
      rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, moveX, 0), 0.08);
    } else if (moveY === 1 || moveY === -1) {
      rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(-moveY, 0, 0), 0.08);
    }
    this.ball.quaternion = this.ball.quaternion.mult(rotationQuaternion);
  }

  update() {
    if (document.hasFocus()) {
      this.world.step(1 / 60, this.time.delta, 5);
      this.moveBall();
      for (const object of this.objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
      }
    }
  }
}

export default Physics;