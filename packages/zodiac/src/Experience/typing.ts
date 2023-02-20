type SourceType = 'glbModel' | 'cubeTexture' | 'texture';

export interface SourceItem {
  name: string;
  type: SourceType;
  path: string;
  imgPath?: string;
}