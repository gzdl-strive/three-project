import * as THREE from 'three';
import { Pubsub } from '@gzdl/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { SourceList, FileType, Video, VideoTexture } from './typing';

export default class Resources extends Pubsub {
  sources: SourceList[];
  loaders: any;
  items: FileType;
  loaded: number;
  toLoad: number;
  video: Video;
  videoTexture: VideoTexture;
  constructor(_sources: SourceList[]) {
    super();

    this.sources = _sources;
    this.loaders = {};
    this.video = {};
    this.videoTexture = {};

    this.items = {};
    this.loaded = 0;
    this.toLoad = this.sources.length;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath('/draco/');
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    // load each source
    for (const source of this.sources) {
      // 模型
      if (source.type === 'glbModel' && source.name === 'room') {
        const textureLoader = new THREE.TextureLoader();
        // Textures
        const bakedTexture = textureLoader.load(source.imgPath);
        bakedTexture.flipY = false;
        bakedTexture.encoding = THREE.sRGBEncoding;

        //Baked material
        const bakedMaterial = new THREE.MeshBasicMaterial({
          map: bakedTexture
        });
        this.loaders.gltfLoader.load(
          source.path,
          (file: any) => {
            file.scene.traverse((child: any) => {
              child.material = bakedMaterial;
            })
            this.sourceLoaded(source, file);
          }
        )
      } else if (source.type === 'glbModel' && source.name === 'tv') {
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff
        });
        this.loaders.gltfLoader.load(
          source.path,
          (file: any) => {
            file.scene.traverse((child: any) => {
              child.material = material;
            });
            this.sourceLoaded(source, file);
          }
        )
      } else if (source.type === 'videoTexture') {
        this.video[source.name] = document.createElement('video');
        this.video[source.name].src = source.path;
        this.video[source.name].muted = true;
        this.video[source.name].loop = true;
        this.video[source.name].controls = true;
        this.video[source.name].playsInline = true;
        this.video[source.name].autoplay = true;
        this.video[source.name].loop = true;
        this.video[source.name].play();

        this.videoTexture[source.name] = new THREE.VideoTexture(this.video[source.name]);
        this.videoTexture[source.name].minFilter = THREE.NearestFilter;
        this.videoTexture[source.name].magFilter = THREE.NearestFilter;
        this.videoTexture[source.name].generateMipmaps = false;
        this.videoTexture[source.name].encoding = THREE.sRGBEncoding;

        this.sourceLoaded(source, this.videoTexture[source.name]);
      }
    }
  }

  sourceLoaded(source: SourceList, file: Object) {
    this.items[source.name] = file;

    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.emit('ready');
    }
  }
}