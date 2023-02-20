import GSAP from 'gsap';
import * as THREE from 'three';
import Experience from "../Experience/Experience";
import Camera from '../Experience/Camera';
import Resources from '../utils/Resources';
import { Pubsub, Time } from '@gzdl/utils';
import LoadingBorderGeometry from '../Geometries/LoadingBorderProgress';
import LoadingBorderMaterial from '../Materials/LoadingBorderProgress';
import BorderFenceGeometry from '../Geometries/BorderFenceGeometry';
import BorderFenceMaterial from '../Materials/BorderFenceMaterial';
import {
  LoadingOrStartText,
  LoadingOrStartTextPartial,
  BorderFence,
  Mouse
} from './typing';
import Renderer from '../Experience/Renderer';

class Loading extends Pubsub {
  experience: Experience;
  scene: THREE.Scene;
  renderer: Renderer;
  camera: Camera;
  resources: Resources;
  time: Time;
  loadingBorderMaterial: THREE.ShaderMaterial | null;
  loadingText: LoadingOrStartTextPartial;
  startText: LoadingOrStartTextPartial;
  fence: BorderFence;
  mouseMesh: THREE.Mesh;
  mouse: Mouse;
  active: Boolean;
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.loadingBorderMaterial = null;
    this.loadingText = {};
    this.startText = {};
    this.fence = {
      depth: 0.5,
      offset: 0.5
    };
    this.mouseMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 3, 1, 1),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    this.mouse = {
      raycaster: new THREE.Raycaster(),
      coordinates: new THREE.Vector2(),
      currentArea: null,
      needsUpdate: false,
    };
    this.active = true;

    // 设置加载框
    this.setLoadingBorder();
    // 设置加载文字
    this.setLoadingText();
    // 设置开始文字
    this.setStartText();
    // 设置栅栏
    this.setBorderFence();
    // 设置交互
    this.setInteractions();
    // 设置鼠标事件
    this.setMouse();

    // 监听资源加载——改变边框
    this.resources.on('progress', (_progress) => {
      if (!this.loadingBorderMaterial) return;
      this.loadingBorderMaterial.uniforms.uAlpha.value = 1
      this.loadingBorderMaterial.uniforms.uLoadProgress.value = _progress;
    });

    // 监听资源加载完毕——改变文本——边框重新变为透明
    this.resources.on('ready', () => {
      window.requestAnimationFrame(() => {
        // this.loadingBorderMaterial && GSAP.to(this.loadingBorderMaterial.uniforms.uAlpha, 0.3, { value: 0.3 });
        GSAP.to((this.loadingText as LoadingOrStartText).material, { opacity: 0, delay: 0.1 });
        GSAP.to((this.startText as LoadingOrStartText).material, { opacity: 1, delay: 0.3 });
      });
    });
  }

  setLoadingBorder() {
    const geometryFunc = new LoadingBorderGeometry(5, 3, 0.25);
    const geometry = geometryFunc.setBorder();
    this.loadingBorderMaterial = LoadingBorderMaterial();
    this.loadingBorderMaterial.uniforms.uColor.value = new THREE.Color(0xffffff)
    this.loadingBorderMaterial.uniforms.uAlpha.value = 0.5
    this.loadingBorderMaterial.uniforms.uLoadProgress.value = 1
    this.loadingBorderMaterial.uniforms.uProgress.value = 1
    const mesh = new THREE.Mesh(geometry, this.loadingBorderMaterial)
    mesh.matrixAutoUpdate = false

    this.scene.add(mesh);
  }

  setLoadingText() {
    // Loading label
    this.loadingText.geometry = new THREE.PlaneGeometry(2.5, 2.5 / 4);
    this.loadingText.image = new Image();
    this.loadingText.image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABABAMAAAAHc7SNAAAAMFBMVEUAAAD///9ra2ucnJzR0dH09PQmJiaNjY24uLjp6end3d1CQkLFxcVYWFiqqqp9fX3nQ5qrAAAEVUlEQVRo3u3YT08TQRQA8JEtW6CATGnDdvljaTwYE2IBI/HGRrwSetGTsZh4MPFQYiQe229gE++WePFY9Oqh1cRzieEDYIgXLxjPJu5M33vbZQszW+fgoS+B7ewO836znRl2lg1jGMP4P2Okw0yFvaKsklr3I99Tvl3iPPelGbQhKqxB4eN6N/7gVcsvbEAz1F4RLn67zzl/v6/oLvejGBQ9LsNphio4UFjmEAsVJuOK/zkDtc6w+gyTcZ3LyP6IAzjBDA+pj6LkEgAjW4kANsMAC6vmOvqAMU5RgVOTskQACicCmCcA9AXjkT5gj1MswqlxWcoTgKJ6HuAQAD5guNoAu8QpMnBul1ONMGD2PCBbRgDAKYq6AEtmXvtdj3S6GhRyW1t1DvkAgM0ggG7mu1t3xWFHFzAqv3wYCi0mY1UCGgiQPU+1oWIY8LoXcAA3qeYfr+kClvHW14PJ5OfCAgHYNAoDAORBQIrDvHjqH5c0ANTbORzBacbAQgUC2IAKAzI9gCSHlWEMLmgBPJxMvyARpIICALDm4nkAbwIA71EZx5UOgO48JnLoOhQIAN9sOgKoBoAE5r0aB8ARcNhtFzrg0VQmwCp8CAMeAADGc44S5GMBsF1aCEU2LcAcAPDCvwFytBDehCaUgJxRAKeF8BNUUQJ43iiAUlqwFKoBrTCAHjiagwEgU0YM5IYWYD4KoIgPwIXQwUbVgCXzgLpIBJNeDciWTQNskVsq1ADX/6kYBdCTjse5owbMiX+IpgGWOCPSuWpA2vN/TAMm5QTYg5IC4FdbMA0YF5Nb5s2rAaLyhzBgektGZWDArrgqi0U1QHxf38OABDwUDgTAjGfyPlTVgJT/67FBACbqyGYaaoBctQwD2vI4DecVAPkgZRhQlxPQks2rAePGAbZsRlaa1QBYEQBUHRCAmaXD0QDYxgFWdye05R9cDQCrmQYkeBA6gGXTgNEeQF4DMG4S4MLjOUZRA5A0CcjADgmjqgGwSwSg9wK1GIBS74KTgTxv/EHoiaVQsTOS5RoCJuiZyosB8EIrHpyowFiYofO0i4wCjhCQwL0hq2sCaFNM22S4JXloLk0AuLDTBzCBAAt3xykeA7CHe/mDbgdTvQ9GswSAwdbqA0giYASHjQUJnhQKhQ6z/d8rDA4hAG2Dsk042ejubHMM2nV6AMf93pCkaRjhh0WsWuz+6aasl2FwiAImReEts1/CSaFfwFouAJxC4RW+I4oCThBQE1X2WbKkBFDkqYDtJ0SHaYKq3pJJwCECjjiFPoC1w+2P0gumurgeBjT6AhIIGKOelGIAngWlFnRnMZjMIYBb7gtIIsAuYU+8GICpEhYyZVgIZ2g9rYYAX1lfAKvjnxzjnWrHALDn9K1h2k2aoI1ewGd2AWAVAVMHcKdW4wDYje739pNufJXhkJohgLu9zy4CHCKAJYUge4ddCojGyPrp9kaHmYjUi9N7+2wYwxjGZfEXMKxGE0GkkfIAAAAASUVORK5CYII=';
    this.loadingText.texture = new THREE.Texture(this.loadingText.image);
    this.loadingText.texture.magFilter = THREE.NearestFilter;
    this.loadingText.texture.minFilter = THREE.LinearFilter;
    this.loadingText.texture.needsUpdate = true;
    this.loadingText.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: this.loadingText.texture });
    this.loadingText.mesh = new THREE.Mesh(this.loadingText.geometry, this.loadingText.material);
    this.loadingText.mesh.matrixAutoUpdate = false;
    this.scene.add(this.loadingText.mesh);
  }

  setStartText() {
    this.startText.geometry = new THREE.PlaneGeometry(2.5, 2.5 / 4)
    this.startText.image = new Image()
    this.startText.image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABABAMAAAAHc7SNAAAAMFBMVEUAAAD///+cnJxra2vR0dHd3d0mJib09PRYWFjp6em4uLhCQkKqqqqNjY19fX3FxcV3XeRgAAADsklEQVRo3u3YsU9TQRwH8KNgLSDQg9ZCAak1IdE4PKPu1NTEsSzOMDl3I3GpcXAxBhLjXFxNjJgQJ2ON0Rnj4uAAEyv8B/L7tV++5/VN+CM69Ldwfa+534d7d793VzeIQQzi/49c4v5lPF/1vvhFm++rjIpcyErrmrSCuz+cxng1iL/If8drPJD2Lc/Iy4VhaZWlFd4tLPfuMc6e/5LvRilJA2SkVSQA8c0OsI0uNtIAU9rsB8y1rAAZjyimAUa1mQDAeGwF+MA+9lIA69qs9AMKVoDP8vhf35A+NiMAc7YJKFSrX7tcI8BW9+k/O/kz6zSunjSnncMHiQYBcmdXrh3xCVbc2WO8N/YZZI0AxxwMArKivmwAwFKSPmV0UwBbCpj5E+C+yzUbQAaJVwUSA9SFjwFgHQ0jAMrBWgzAPCtHgFFbQAlpEwKC2zWUQgJGbAH+naSdu/fTxQAthPL5/ADD6OCpQwCAsb6LsbEGcBluOAYBmG2fkMIawHVWXEsDIGUGpZCAIRsAS93DPgDbhUmUQgKe2NUB90hfhK0YwEJYHkYpJGDbqBKiB86CGLAlzd6/S8CEvh8sACiBvrSXCshKblWEgNy2vkAMAHwGfjECcJHOu5qUQgDm6vXulshZAXJNL9GJAeg+LxeKPQBj1gzgdlnuCWAhbOi7LwaU9u0A2VWPpUgAC+GR5k0iwBtnB3Bj3qMaRYB17X0IOQhYcjYA7guxxyIAGfd1HNqchPfly7aACQUshAA2W1r5G1yG415YpgB3qIIkAHBH2D075QnQ10fHDsCl+CoGSKpiN8kMAVqIN00BsitnVgKyPIBMB4ADKU92AA5BKQIgszjKBGBLagpwB5xZBGS6pbcuizQAXMA6NAK86OCQ3okAI55BQPe7VoDxXzU/iwPASgS4GAASAiYxWgYAzvAa1loA2AkAFQIU2zEELCJtDDgIAG0CFLvp7LblC2kAtF6eTEJJ2CBAr88bAXKY4WkASbzXmwt5AvTvohHA4WSUBmj2Jt+IThQChrAOLQC13vPFMAOAQwuyTAeAKVQto3OBDOdESh2YxNZPbpYBQNbEAoBfod7e1i1BiwB0voSZWgwAOWgtAGPhD18E8ASIiRIAXNPwXJBtcqMbAFAIr5weIJMAcIx1aAAIqk0lAuycompyFwBMHAsAZlj/lgw0rsy2AkhbsgK4Q+70CUBjxeFXsUb0G1HJDJC9rketZRcCWCJwHM8DgJm7b7ch+XizXm25QQxiEOcXvwGCWOhbCZC0qAAAAABJRU5ErkJggg=='
    this.startText.texture = new THREE.Texture(this.startText.image)
    this.startText.texture.magFilter = THREE.NearestFilter
    this.startText.texture.minFilter = THREE.LinearFilter
    this.startText.texture.needsUpdate = true
    this.startText.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: this.startText.texture })
    this.startText.material.opacity = 0
    this.startText.mesh = new THREE.Mesh(this.startText.geometry, this.startText.material)
    this.startText.mesh.matrixAutoUpdate = false
    this.scene.add(this.startText.mesh);
  }

  setBorderFence() {
    const fenceFunc = new BorderFenceGeometry(5, 3, this.fence.depth);
    this.fence.geometry = fenceFunc.setFence();
    this.fence.material = BorderFenceMaterial();
    this.fence.material.uniforms.uBorderAlpha.value = 0.5;
    this.fence.material.uniforms.uStrikeAlpha.value = 0.25;
    this.fence.mesh = new THREE.Mesh(this.fence.geometry, this.fence.material);
    this.fence.mesh.position.z = - this.fence.depth;
    this.scene.add(this.fence.mesh);
  }

  setInteractions() {
    this.mouseMesh.position.z = -0.01;
    this.mouseMesh.matrixAutoUpdate = false;
    this.mouseMesh.updateMatrix();
    this.scene.add(this.mouseMesh);
  }

  setMouse() {
    window.addEventListener('mousemove', (_event: MouseEvent) => {
      if (!this.active) return;
      this.mouse.coordinates.x = (_event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.coordinates.y = - (_event.clientY / window.innerHeight) * 2 + 1;
      this.mouse.needsUpdate = true;
    });
    window.addEventListener('mousedown', () => {
      if (!this.active) return;
      if (this.mouse.currentArea) {
        this.interact();
      }
    });
  }

  fenceOut() {
    this.fence.mesh && GSAP.to(this.fence.mesh.position, {
      duration: 0.5,
      z: -0.5
    });
    this.renderer.canvas!.classList.remove('loading-pointer');
  }

  fenceIn() {
    this.fence.mesh && GSAP.to(this.fence.mesh.position, {
      duration: 0.3,
      ease: "back.out(2)",
      z: 0.5
    });
    this.renderer.canvas!.classList.add('loading-pointer');
  }

  interact() {
    GSAP.killTweensOf(this.fence.mesh!.position);
    GSAP.killTweensOf(this.loadingBorderMaterial!.uniforms.uAlpha);
    GSAP.killTweensOf(this.fence.material!.uniforms.uBorderAlpha);

    const borderVal = this.loadingBorderMaterial!.uniforms.uAlpha.value > 0.5 ? 1 : 0.5;
    // Animate
    GSAP.to(this.fence.mesh!.position, {
      z: -0.5,
      duration: 0.3,
      onComplete: () => {
        // 栅栏
        this.fenceOut();
        GSAP.fromTo(this.fence.material!.uniforms.uBorderAlpha, { value: 1 }, { value: 0 });
        // 边框
        GSAP.fromTo(this.loadingBorderMaterial!.uniforms.uLoadProgress, { value: 0.5 }, { value: 0 });
        GSAP.fromTo(this.loadingBorderMaterial!.uniforms.uAlpha, { value: borderVal }, { value: 0, delay: 0.15 });
        // 开始文本
        GSAP.to((this.startText as LoadingOrStartText).material, { opacity: 0, delay: 0.3 });
        this.active = false;
        this.emit('start');
      }
    });
  }

  update() {
    if (!this.active) return;
    if (this.fence.material) {
      this.fence.material.uniforms.uTime.value = this.time.elapsed;
    }
    if (this.mouse.needsUpdate && this.fence.mesh) {
      this.mouse.needsUpdate = false;
      this.camera.perspectiveCamera && this.mouse.raycaster.setFromCamera(this.mouse.coordinates, this.camera.perspectiveCamera);
      const objects = [this.mouseMesh];
      const intersects = this.mouse.raycaster.intersectObjects(objects);

      if (intersects.length > 0) {
        const area = this;
        if (area !== this.mouse.currentArea) {
          if (this.mouse.currentArea !== null) {
            this.fenceOut();
          }
          this.mouse.currentArea = this;
          this.fenceIn();
        }
      } else if (this.mouse.currentArea !== null) {
        this.fenceOut();
        this.mouse.currentArea = null;
      }
    }
  }
}

export default Loading;