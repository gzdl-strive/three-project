// import * as THREE from 'three';
import { Pubsub } from '@gzdl/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { SourceItem } from '../Experience/typing';
import { FileType, ModelType, Loaders_Partial } from './typing';

export default class Resources extends Pubsub {
  sources: SourceItem[];
  loaders: Loaders_Partial;
  items: FileType;
  loaded: number;
  toLoad: number;
  constructor(_sources: SourceItem[]) {
    super();

    this.sources = _sources;
    this.loaders = {};

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
      if (source.type === 'glbModel') {
        this.loaders.gltfLoader?.load(
            source.path as string,
            (file: ModelType) => {
              this.sourceLoaded(source, file);
            }
          )
      }
    }
  }

  sourceLoaded(source: SourceItem, file: ModelType) {
    this.items[source.name] = file;

    this.loaded++;
    this.emit('progress', [this.loaded / this.toLoad]);
    if (this.loaded === this.toLoad) {
      this.emit('ready');
    }
  }
}