import { TextureLoader } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/* 模型类型 */
export type ModelType = {
  [key: string]: any;
}
/* 加载器类型 Loaders */
export interface Loaders {
  gltfLoader?: GLTFLoader;
  dracoLoader?: DRACOLoader;
  textureLoader?: TextureLoader;
}
export type Loaders_Partial = Partial<Loaders>;
/* 文件类型 */
export type FileType = Record<string, Object>;
/* 12生肖 */
export interface ZodiacType {
  scene: THREE.Group;
}
/* 基座类型 */
export interface BasedType {
  scene: THREE.Group;
}
export type DebugFolder = dat.GUI | null;