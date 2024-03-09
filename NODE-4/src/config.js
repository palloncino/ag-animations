import * as THREE from 'three';

export const cameraSettings = {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 500,
    position: new THREE.Vector3(0, 20, 100)
};

export const rendererSettings = {
    antialias: true
};

export const environmentSettings = {
    ground: {
        color: 0x000000,
        roughness: 0.1,
        metalness: 0.5,
        positionY: -5
    },
    sky: {
        color: 0xcccccc,
        innerRadius: 500,
        widthSegments: 32,
        heightSegments: 32
    }
};

export const objectSettings = {
    cube: {
        geometry: [10, 10, 10],
        material: {color: 0xffaa00},
        spaceBetween: 20
    }
};

export const scaleSettings = {
    hoverScale: new THREE.Vector3(1.1, 1.1, 1.1),
    normalScale: new THREE.Vector3(1, 1, 1)
};

// New utility function to initialize and return a renderer
export function createRenderer(options) {
  const renderer = new THREE.WebGLRenderer(options.antialias ? { antialias: true } : undefined);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

// New generalized object creation function
export function createObject(geometryArgs, materialOptions, position) {
  const geometry = new THREE.BoxGeometry(...geometryArgs);
  const material = new THREE.MeshBasicMaterial(materialOptions);
  const object = new THREE.Mesh(geometry, material);
  object.position.copy(position);
  return object;
}
