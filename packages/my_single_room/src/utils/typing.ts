/* 资源列表 */
export type SourceList = Record<string, string>;
/* 文件类型 */
export type FileType = Record<string, Object>;
/* 视频类型 */
export interface Video {
  [key: string]: HTMLVideoElement;
}
/* 视频Texture类型 */
export interface VideoTexture {
  [key: string]: THREE.VideoTexture;
}
/* 房子 */
export interface RoomType {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}
/* TV */
export interface TvType {
  scene: THREE.Group;
}
export type Lerp = Record<'current' | 'target' | 'ease', number>;