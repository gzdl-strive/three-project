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
export interface RoomType {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}