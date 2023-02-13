import { CubeTexture } from "three";

/* 环境太阳光Debug参数 */
export interface EnvironmentDebugParameter {
  color: number;
  intensity: number;
}
/* 环境贴图 */
export interface EnvironmentMap {
  intensity?: number;
  texture: CubeTexture;
  updateMaterials?: () => void;
}
/* Floor 纹理 */
export interface FloorTexture {
  color?: THREE.Texture;
  normal?: THREE.Texture;
}