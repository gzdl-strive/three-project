type SourceList = Record<string, string>;

const sources: SourceList[] = [
  {
    name: 'room',
    type: 'glbModel',
    path: '/models/room.glb',
    imgPath: '/textures/room_baked.jpg'
  },
  {
    name: 'tv',
    type: 'glbModel',
    path: '/models/tv.glb'
  },
  {
    name: 'tv_video',
    type: 'videoTexture',
    path: '/textures/test.mp4'
  }
];

export default sources;