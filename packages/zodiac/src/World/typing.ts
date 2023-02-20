/* 太阳光参数 */
export interface SunLightParameter {
  position: THREE.Vector3;
  vector: THREE.Vector3;
  update?: () => void
}
/* Shadow Material */
export interface ShadowMaterials {
  wireframe: THREE.MeshBasicMaterial;
  base: THREE.ShaderMaterial;
}
/* Physics Floor */
export interface PhysicsFloor {
  body?: CANNON.Body;
}
/* Physics Materials */
export interface PhysicsMaterials {
  items?: Record<'floor' | 'dummy', CANNON.Material>;
  contacts?: Record<'floorDummy' | 'dummyDummy', CANNON.ContactMaterial>;
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
/* Controls_actions */
export type ControlsAction = Record<'up' | 'down' | 'left' | 'right', Boolean>;
/* Controls_keyboard*/
export type ControlsKeyboard = {
  keyDown?: (e: KeyboardEvent) => void;
  keyUp?: (e: KeyboardEvent) => void;
}