import { SourceItem } from './typing';

const sources: SourceItem[] = [
  {
    name: 'earth',
    type: 'texture',
    path: '/textures/earth.jpg'
  },
  {
    name: 'zodiac',
    type: 'glbModel',
    path: '/models/zodiac.glb'
  },
  {
    name: 'based',
    type: 'glbModel',
    path: '/models/based.glb',
    imgPath: '/textures/based_baked.jpg'
  }
];

export default sources;