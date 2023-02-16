/* 环境太阳光Debug参数 */
export interface EnvironmentDebugParameter {
  color: number;
  intensity: number;
}
/* Floor颜色 */
export type FloorColors = Record<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', string>;
/* Loading-Text */
export type LoadingOrStartText = {
  geometry: THREE.PlaneGeometry;
  image: any;
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
}
export type LoadingOrStartTextPartial = Partial<LoadingOrStartText>;
/* Border-Fence */
export interface BorderFence {
  depth: number;
  offset: number;
  geometry?: THREE.BufferGeometry;
  material?: THREE.ShaderMaterial;
  mesh?: THREE.Mesh;
}
/* Mouse */
export interface Mouse {
  raycaster: THREE.Raycaster;
  coordinates: THREE.Vector2;
  currentArea: any;
  needsUpdate: Boolean;
}