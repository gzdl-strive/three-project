import * as THREE from 'three';

import shaderFragment from '../shaders/loadingBorder/fragment.glsl?raw';
import shaderVertex from '../shaders/loadingBorder/vertex.glsl?raw';

export default function () {
  const uniforms = {
    uColor: { value: null },
    uAlpha: { value: null },
    uLoadProgress: { value: null },
    uProgress: { value: null }
  }

  const material = new THREE.ShaderMaterial({
    wireframe: false,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    uniforms,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment
  });

  return material;
}
