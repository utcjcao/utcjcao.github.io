import * as THREE from 'three';
import { POST_VERT, POST_FRAG } from './dither-shader';

// Canvas UI Dithered Object's Bayer shader, adapted as a scene post-process.
// See CANVAS_UI_LICENSE.md for the original license.
export class DitherPass {
  private readonly gridSize = 3;
  private target = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
  private material: THREE.ShaderMaterial;
  private geometry = new THREE.BufferGeometry();
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  constructor(private renderer: THREE.WebGLRenderer) {
    this.target.texture.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: POST_VERT, fragmentShader: POST_FRAG,
      uniforms: {
        tDiffuse: { value: this.target.texture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uGridSize: { value: this.gridSize },
      },
      depthTest: false, depthWrite: false, blending: THREE.NoBlending,
    });
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]), 3));
    const mesh = new THREE.Mesh(this.geometry, this.material); mesh.frustumCulled = false; this.scene.add(mesh);
  }

  setSize(width: number, height: number) {
    const ratio = this.renderer.getPixelRatio();
    const w = Math.max(1, Math.round(width * ratio)), h = Math.max(1, Math.round(height * ratio));
    const targetScale = Math.min(1, 2 / (this.gridSize * ratio));
    this.target.setSize(Math.max(1, Math.round(w * targetScale)), Math.max(1, Math.round(h * targetScale)));
    this.material.uniforms.uResolution.value.set(w, h);
    this.material.uniforms.uGridSize.value = this.gridSize * ratio;
  }

  render(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() { this.target.dispose(); this.material.dispose(); this.geometry.dispose(); }
}
