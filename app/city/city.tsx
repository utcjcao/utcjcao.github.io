'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DitherPass } from './dither-pass';
import styles from './city.module.css';

// Seeded randomness keeps the skyline stable when recycled street sections move.
function random(seed: number) {
  const n = Math.sin(seed * 127.1 + 31.7) * 43758.5453;
  return n - Math.floor(n);
}

export default function MidnightCity() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<'home' | 'blog'>('home');

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    element.classList.remove(styles.ready);
    const renderer = new THREE.WebGLRenderer({canvas: element, antialias: true, powerPreference: 'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const filter = new DitherPass(renderer);
    const scene = new THREE.Scene();
    // Show a little more sky without changing the canvas proportions.
    const verticalFov = THREE.MathUtils.radToDeg(2*Math.atan(2.3*Math.tan(THREE.MathUtils.degToRad(58)/2)));
    const camera = new THREE.PerspectiveCamera(verticalFov, 1, .1, 850);
    camera.position.set(0, 2.45, 0);
    camera.lookAt(0, 2, -70);

    // Keep the backdrop to a dark sky, stars, and the moon.
    const skyCanvas = document.createElement('canvas'); skyCanvas.width = 2048; skyCanvas.height = 1024;
    const sky = skyCanvas.getContext('2d')!;
    sky.fillStyle = '#141213'; sky.fillRect(0,0,skyCanvas.width,skyCanvas.height);
    // Keep the sky quiet enough to sit behind portfolio content.
    for (let i = 0; i < 120; i++) {
      const x = random(i * 9 + 4) * skyCanvas.width;
      const y = 80 + random(i * 9 + 5) * 340;
      const size = 2;
      sky.fillStyle = '#fff8e4';
      sky.fillRect(x, y, size, size);
    }
    // Add stars around the forward horizon, within the camera's usual view.
    for (let i = 0; i < 67; i++) {
      const x = 310 + random(i*11+1200)*460;
      const y = 360 + random(i*11+1201)*115;
      const size = 2;
      sky.fillStyle = '#fff8e4';
      sky.fillRect(x,y,size,size);
    }
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.mapping = THREE.EquirectangularReflectionMapping;
    skyTexture.colorSpace = THREE.SRGBColorSpace; scene.background = skyTexture;
    // NASA's lunar mosaic replaces the painted circle in the forward view.
    const moonImage = new Image();
    moonImage.onload = () => {
      sky.save();
      sky.beginPath(); sky.arc(570, 315, 24, 0, Math.PI * 2); sky.clip();
      sky.drawImage(moonImage, 546, 291, 48, 48);
      sky.restore();
      // Three.js caches the converted sky cube; dispose it so the updated
      // canvas is converted again after the asynchronous image load.
      skyTexture.dispose();
      skyTexture.needsUpdate = true;
    };
    moonImage.src = '/moon.png';

    scene.add(new THREE.HemisphereLight(0x8d9cac, 0x1b222b, .8));
    const geometry = new THREE.BoxGeometry(1,1,1);
    const roundTowerGeometry = new THREE.CylinderGeometry(.5,.5,1,12,1);
    const taperedTowerGeometry = new THREE.CylinderGeometry(.32,.5,1,4,1);
    const foliageGeometry = new THREE.IcosahedronGeometry(1,1);
    const signalLensGeometry = new THREE.CircleGeometry(.17,16);
    const darkMaterial = new THREE.MeshLambertMaterial({color: 0x211e1e});
    const roadMaterial = new THREE.MeshLambertMaterial({color: 0x45403d});
    const curbMaterial = new THREE.MeshLambertMaterial({color: 0x82776b, side: THREE.DoubleSide});
    const sidewalkMaterial = new THREE.MeshLambertMaterial({color: 0x70655a, side: THREE.DoubleSide});
    const pavementPatch = new THREE.MeshLambertMaterial({color: 0x393432});
    const sidewalkJoint = new THREE.MeshLambertMaterial({color: 0x60564e});
    const lineMaterial = new THREE.MeshBasicMaterial({color: 0x9a9a91});
    const lampMaterial = new THREE.MeshBasicMaterial({color: 0xd8bb89});
    const shopAwning = new THREE.MeshLambertMaterial({color: 0x354958});
    const shopAwnings = [shopAwning, new THREE.MeshLambertMaterial({color: 0x4b4e57}), new THREE.MeshLambertMaterial({color: 0x344c57}), new THREE.MeshLambertMaterial({color: 0x414b60})];
    const signalRed = new THREE.MeshBasicMaterial({color: 0xc94a3e});
    const signalAmber = new THREE.MeshBasicMaterial({color: 0xd8a858});
    const signalGreen = new THREE.MeshBasicMaterial({color: 0x68a983});
    const signalOff = new THREE.MeshBasicMaterial({color: 0x1a242b});
    const signalHeads: { lenses: THREE.Mesh[]; mainRoad: boolean }[] = [];
    const foliageMaterial = new THREE.MeshLambertMaterial({color: 0x293d43});
    const trunkMaterial = new THREE.MeshLambertMaterial({color: 0x39434b});
    const streetFurniture = new THREE.MeshLambertMaterial({color: 0x4c5a63});
    const dumpsterMaterial = new THREE.MeshLambertMaterial({color: 0x454d43});
    const shelterGlass = new THREE.MeshBasicMaterial({color: 0x718592,transparent:true,opacity:.28,depthWrite:false});
    const treeImages: HTMLImageElement[] = [];
    let cityDisposed = false;
    function treeTexture(src: string, cropPine: boolean) {
      const surface = document.createElement('canvas'); surface.width=512; surface.height=512;
      const ctx = surface.getContext('2d',{willReadFrequently:true})!;
      const texture = new THREE.CanvasTexture(surface); texture.colorSpace = THREE.SRGBColorSpace;
      const image = new Image(); treeImages.push(image);
      image.onload = () => {
        if (cityDisposed) return;
        const sx = cropPine ? image.naturalWidth*.33 : 0, sy = cropPine ? image.naturalHeight*.04 : 0;
        const sw = cropPine ? image.naturalWidth*.37 : image.naturalWidth, sh = cropPine ? image.naturalHeight*.72 : image.naturalHeight;
        const scale = Math.min(512/sw,512/sh), width=sw*scale, height=sh*scale;
        ctx.drawImage(image,sx,sy,sw,sh,(512-width)/2,512-height,width,height);
        const pixels = ctx.getImageData(0,0,512,512);
        for (let p=0;p<pixels.data.length;p+=4) {
          const lightest = Math.min(pixels.data[p],pixels.data[p+1],pixels.data[p+2]);
          pixels.data[p+3] *= Math.max(0,Math.min(1,(250-lightest)/22));
        }
        ctx.putImageData(pixels,0,0); texture.needsUpdate = true;
      };
      image.src = src;
      return texture;
    }
    const treeTextures = [treeTexture('/scenery/tree.jpg',false),treeTexture('/scenery/pine-small.jpg',true)];
    const treeMaterials = treeTextures.map(map => new THREE.SpriteMaterial({map,color:0x606c61,transparent:true,alphaTest:.08,depthWrite:true}));
    const signCanvas = document.createElement('canvas'); signCanvas.width = 256; signCanvas.height = 64;
    const signContext = signCanvas.getContext('2d')!;
    signContext.fillStyle = '#354b4a'; signContext.fillRect(0,0,256,64);
    signContext.fillStyle = '#d1d0ba'; signContext.font = 'bold 27px sans-serif';
    signContext.textAlign = 'center'; signContext.textBaseline = 'middle';
    signContext.fillText('NIGHT AVE',128,33);
    const signTexture = new THREE.CanvasTexture(signCanvas); signTexture.colorSpace = THREE.SRGBColorSpace;
    const signMaterial = new THREE.MeshBasicMaterial({map: signTexture});
    const graffitiImages: HTMLImageElement[] = [];
    const graffitiTextures = Array.from({length: 2}, (_, variant) => {
      const canvas = document.createElement('canvas'); canvas.width=512; canvas.height=192;
      const ctx = canvas.getContext('2d')!;
      const texture = new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace;
      const image = new Image(); graffitiImages.push(image);
      image.onload = () => {
        if (cityDisposed) return;
        ctx.drawImage(image,0,0,canvas.width,canvas.height);
        // Recolor only the transparent clip art; the wall remains visible.
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle='#000000';
        ctx.fillRect(0,0,512,192);
        ctx.globalCompositeOperation = 'source-over'; texture.needsUpdate=true;
      };
      image.src = `/city-tag-${variant%2+1}.png`;
      return texture;
    });
    const graffitiMaterials = graffitiTextures.map(map => new THREE.MeshBasicMaterial({map,color:0xffffff,transparent:true,opacity:1,depthWrite:false}));
    const muralImages: HTMLImageElement[] = [];
    const muralTextures = Array.from({length:3}, (_,index) => {
      const canvas = document.createElement('canvas'); canvas.width=512; canvas.height=512;
      const ctx = canvas.getContext('2d',{willReadFrequently:true})!;
      const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
      const image = new Image(); muralImages.push(image);
      image.onload = () => {
        if (cityDisposed) return;
        ctx.drawImage(image,0,0,512,512);
        const pixels = ctx.getImageData(0,0,512,512);
        for (let p=0; p<pixels.data.length; p+=4) {
          const r=pixels.data[p], g=pixels.data[p+1], b=pixels.data[p+2];
          const min=Math.min(r,g,b), max=Math.max(r,g,b);
          // Remove the flat grey or white image background, exposing the facade.
          const alpha = index === 0
            ? Math.max(0,Math.min(1,(max-min-8)/22))
            : Math.max(0,Math.min(1,(245-min)/35));
          pixels.data[p+3] *= alpha;
          pixels.data[p]=0; pixels.data[p+1]=0; pixels.data[p+2]=0;
        }
        ctx.putImageData(pixels,0,0); texture.needsUpdate=true;
      };
      image.src = `/city-mural-${index+1}.jpg`;
      return texture;
    });
    const muralMaterials = muralTextures.map(map => new THREE.MeshBasicMaterial({map,color:0xffffff,transparent:true,alphaTest:.03,depthWrite:false}));
    function block(parent: THREE.Object3D, material: THREE.Material | THREE.Material[], x: number,y: number,z: number,w: number,h: number,d: number) {
      const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x,y,z); mesh.scale.set(w,h,d); parent.add(mesh); return mesh;
    }
    // Blend photographic wall materials with the lit-window patterns.
    // Brick and concrete photographs: Poly Haven, CC0.
    const wallImages = Array.from({length: 2}, () => new Image());
    const facadeColors = ['#48403c', '#4d4540', '#514943', '#45403c', '#554b45', '#48413e', '#4f4843', '#4d443f'];
    const balconyMaterials = facadeColors.map(color => new THREE.MeshBasicMaterial({color: new THREE.Color(color).multiplyScalar(1.3)}));
    const blankWallMaterials = facadeColors.map(color => new THREE.MeshBasicMaterial({color}));
    // Facades use unlit textures, so their details need the same unlit colors.
    const facadeDetailMaterials = Array.from({length:16},(_,index) => new THREE.MeshBasicMaterial({color:facadeColors[index%8]}));
    const streetBaseMaterials = [0x514943,0x49423e,0x5a5048,0x454444].map(color => new THREE.MeshBasicMaterial({color}));
    const baseArchGeometry = new THREE.TorusGeometry(.95,.10,6,16,Math.PI);
    const redrawFacades: (() => void)[] = [];
    const windowTextures = Array.from({length: 16}, (_, index) => {
      const variant = index % 8;
      const buildingType = Math.floor(index / 8) + 1;
      const surface = document.createElement('canvas'); surface.width = 128; surface.height = 256;
      const ctx = surface.getContext('2d')!;
      const texture = new THREE.CanvasTexture(surface); texture.colorSpace=THREE.SRGBColorSpace;
      texture.magFilter=THREE.NearestFilter; texture.minFilter=THREE.LinearMipmapLinearFilter;
      const drawFacade = () => {
      ctx.fillStyle = facadeColors[variant]; ctx.fillRect(0,0,128,256);
      const wall = wallImages[(variant + buildingType) % wallImages.length];
      if (wall.complete && wall.naturalWidth) {
        ctx.globalAlpha = .25;
        ctx.drawImage(wall,0,0,128,256);
        ctx.globalAlpha = 1;
      }
      // Match the projecting parts to the actual blended facade background.
      const backgroundPixels = ctx.getImageData(0,0,128,256).data;
      let red=0, green=0, blue=0, samples=0;
      for (let pixel=0; pixel<backgroundPixels.length; pixel+=256) {
        red+=backgroundPixels[pixel]; green+=backgroundPixels[pixel+1]; blue+=backgroundPixels[pixel+2]; samples++;
      }
      facadeDetailMaterials[index].color.setRGB(red/samples/255,green/samples/255,blue/samples/255,THREE.SRGBColorSpace);
      // Subtle floor bands and vertical panels give the facade some depth.
      const floors = [4, 8, 18][buildingType];
      const floorHeight = 256 / floors;
      ctx.fillStyle = 'rgba(115, 130, 139, 0.14)';
      for (let row=0; row<floors; row++) ctx.fillRect(0, 8+row*floorHeight, 128, 1);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let col=0; col<9; col++) ctx.fillRect(3+col*13, 0, 1, 256);
      // A few faint irregular marks break up the repeated facade panels.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let mark=0; mark<5; mark++) {
        const x = random(variant*91+mark*7)*126;
        const y = random(buildingType*131+variant*17+mark*11)*248;
        ctx.fillRect(x,y,1,2+random(mark*23+variant)*8);
      }
      for (let row=0;row<floors;row++) for (let col=0;col<9;col++) {
        const value = random(variant * 10000 + row * 29 + col * 71);
        // Some buildings are mostly dark; others have clusters of lit floors.
        const darkFloor = random(variant * 700 + row * 23) > .74;
        const quietBuilding = variant === 0 || variant === 4;
        const columnBias = variant % 3 === 0 && col % 3 === 0 ? .04 : 0;
        const light = darkFloor || quietBuilding ? 0 : value + columnBias;
        const litThreshold = variant % 3 === 0 ? .84 : .9;
        ctx.fillStyle = light > .98 ? '#fff9ed' : light > litThreshold ? '#f8edda' : buildingType === 2 ? '#242321' : '#191817';
        const windowWidth = buildingType === 2 ? 4.5 : [5, 8, 10, 7][variant % 4];
        const windowHeight = buildingType === 2 ? 9 : Math.min(floorHeight * .62, [floorHeight*.38, floorHeight*.5, 8, 10][variant % 4]);
        ctx.fillRect(6 + col*13, (row+1)*floorHeight-windowHeight, windowWidth, windowHeight);
      }
      texture.needsUpdate = true;
      };
      redrawFacades.push(drawFacade); drawFacade();
      return texture;
    });
    ['/city-brick.jpg','/city-painted-brick.jpg'].forEach((src,index) => {
      wallImages[index].onload = () => redrawFacades.forEach(draw => draw());
      wallImages[index].src = src;
    });
    const facadeMaterials = windowTextures.map(map => new THREE.MeshBasicMaterial({map}));
    const shadedFacades = windowTextures.map(map => new THREE.MeshBasicMaterial({map, color: 0xc8b8a8}));
    const facadeSets = facadeMaterials.map((m,i) => [shadedFacades[i],shadedFacades[i],darkMaterial,darkMaterial,m,m]);
    // A small shape grammar subdivides each building's bounded volume into
    // a base and optional upper parts. The seed selects repeatable rules.
    const officeShapes = [0,2,3,4,5,6,7,8,9,10];
    const baseFraction = (shape: number) => ({0:.62,4:.48,5:.38,6:.3,7:.4,8:.34,9:.32,10:.42} as Record<number,number>)[shape] ?? 1;
    function buildingMass(parent: THREE.Group, facade: THREE.Material[], x: number, z: number, width: number, depth: number, height: number, shape: number, outward: number) {
      const part = (cx: number, bottom: number, cz: number, w: number, h: number, d: number) =>
        block(parent,facade,cx,bottom+h/2,cz,w,h,d);
      if (shape === 0) {
        const base = height*.62;
        part(x,0,z,width,base,depth);
        part(x,base,z,width*.62,height-base,depth*.7);
      } else if (shape === 1) {
        part(x,0,z,width*.72,height,depth*.8);
        part(x+outward*width*.37,0,z,width*.45,height*.44,depth);
      } else if (shape === 4) {
        // Three successively smaller volumes make a stepped skyline.
        const first = height*.48, second = height*.31;
        part(x,0,z,width,first,depth);
        part(x,first,z,width*.78,second,depth*.82);
        part(x,first+second,z,width*.53,height-first-second,depth*.61);
      } else if (shape === 5) {
        // A round upper tower sits over a rectangular street-level base.
        const base = height*.38;
        part(x,0,z,width,base,depth);
        const tower = new THREE.Mesh(roundTowerGeometry,facade[0]);
        tower.position.set(x,base+(height-base)/2,z);
        tower.scale.set(width*.72,height-base,depth*.72); parent.add(tower);
      } else if (shape === 6) {
        // Two unequal wings sit on a shared podium.
        const base = height*.3;
        part(x,0,z,width,base,depth);
        part(x-width*.2,base,z,width*.55,height-base,depth*.76);
        part(x+width*.25,base,z,width*.4,(height-base)*.7,depth*.68);
      } else if (shape === 7) {
        // Offset terraces create a different profile from centered setbacks.
        const base=height*.4, middle=height*.34;
        part(x,0,z,width,base,depth);
        part(x+outward*width*.1,base,z,width*.8,middle,depth*.82);
        part(x+outward*width*.2,base+middle,z,width*.52,height-base-middle,depth*.62);
      } else if (shape === 8) {
        // A tapered, square tower on a broad base.
        const base=height*.34;
        part(x,0,z,width,base,depth);
        const tower = new THREE.Mesh(taperedTowerGeometry,facade[0]);
        tower.position.set(x,base+(height-base)/2,z);
        tower.rotation.y = Math.PI/4;
        tower.scale.set(width*.84,height-base,depth*.84); parent.add(tower);
      } else if (shape === 9) {
        // A slim central shaft with lower side wings.
        const base=height*.32;
        part(x,0,z,width,base,depth);
        part(x,base,z,width*.48,height-base,depth*.68);
        for (const side of [-1,1]) part(x+side*width*.32,base,z,width*.32,(height-base)*.52,depth*.76);
      } else if (shape === 10) {
        // A staggered pair of upper masses gives the roof an asymmetric edge.
        const base=height*.42;
        part(x,0,z,width,base,depth);
        part(x-outward*width*.16,base,z,width*.66,(height-base)*.78,depth*.8);
        part(x+outward*width*.22,base,z,width*.44,height-base,depth*.62);
      } else {
        part(x,0,z,width,height,depth);
        if (shape === 2) block(parent,darkMaterial,x,height+2,z,width*.28,4,depth*.3);
      }
    }
    function addStreetBase(parent: THREE.Group, x: number, z: number, width: number, depth: number, shape: number, outward: number, seed: number, narrow: boolean, firstPart: number, frontAxis: 'x' | 'z', variant: number) {
      // Leave a few facades uniform; give the rest a one- or two-story base.
      if (random(seed+140) < .2) {
        // Cover the ground floor of the original textured mass, leaving its
        // upper floors visible; the doorway sits just in front of this panel.
        const groundWall = blankWallMaterials[variant];
        const groundParts=parent.children.slice(firstPart);
        for (const part of groundParts) {
          const mesh=part as THREE.Mesh;
          if (!mesh.isMesh || !mesh.geometry) continue;
          if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
          mesh.updateMatrix();
          const box=mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrix);
          if (box.min.y > .1 || box.max.y < 3.5) continue;
          const cx=(box.min.x+box.max.x)/2, cz=(box.min.z+box.max.z)/2;
          for (const side of [-1,1]) {
            block(parent,groundWall,side<0?box.min.x-.025:box.max.x+.025,1.75,cz,.05,3.5,box.max.z-box.min.z);
            block(parent,groundWall,cx,1.75,side<0?box.min.z-.025:box.max.z+.025,box.max.x-box.min.x,3.5,.05);
          }
        }
        const face = (frontAxis === 'x' ? x : z) - outward * (frontAxis === 'x' ? width*(shape === 1 ? .36 : .5) : depth*(shape === 1 ? .4 : .5));
        if (frontAxis === 'x') block(parent,darkMaterial,face-outward*.08,1.5,z,.16,3,1.5);
        else block(parent,darkMaterial,x,1.5,face-outward*.08,1.5,3,.16);
        return;
      }
      const baseHeight = random(seed+141) < .5 ? 3.5 : 7;
      const baseVariant = Math.floor(random(seed+142)*streetBaseMaterials.length);
      const material = streetBaseMaterials[baseVariant];
      const detailMaterial = material;
      const addDetails = () => {
        const span = (frontAxis === 'x' ? depth*(shape === 1 ? .8 : 1) : width) * (narrow ? .8 : 1.24);
        const halfDepth = frontAxis === 'x' ? width*(shape === 1 ? .36 : narrow ? .4 : .5) : depth*(narrow ? .4 : .5);
        const face = (frontAxis === 'x' ? x : z) - outward*halfDepth;
        const part = (along: number, y: number, forward: number, w: number, h: number, d: number, finish: THREE.Material) => {
          if (frontAxis === 'x') block(parent,finish,face-outward*forward,y,z+along,d,h,w);
          else block(parent,finish,x+along,y,face-outward*forward,w,h,d);
        };
        const style = Math.floor(random(seed+144)*3);
        // A pair of door leaves forms the entrance to every separate base.
        for (const side of [-1,1]) part(side*.43,1.5,.48,.8,3,.16,darkMaterial);
        if (baseHeight > 5) {
          // Two shallow arch frames leave the central double entrance clear.
          for (const side of [-1,1]) {
            const along=side*span*.29;
            for (const edge of [-1,1]) part(along+edge*.95,2.6,.22,.2,3.6,.25,detailMaterial);
            const arch=new THREE.Mesh(baseArchGeometry,detailMaterial);
            if (frontAxis === 'x') { arch.position.set(face-outward*.22,4.4,z+along); arch.rotation.y=Math.PI/2; }
            else arch.position.set(x+along,4.4,face-outward*.22);
            parent.add(arch);
          }
        }
        // Recessed vertical supports, a street-level canopy, or a simple cornice.
        if (style === 0) {
          for (const end of [-1,1]) part(end*span*.42,baseHeight/2,.13,.3,baseHeight,.26,detailMaterial);
          part(0,baseHeight-.15,.2,span,.25,.4,detailMaterial);
        } else if (style === 1) {
          part(0,Math.min(baseHeight-.25,4.1),.35,span*.9,.22,.7,detailMaterial);
          for (const end of [-1,1]) part(end*span*.36,baseHeight/2,.1,.18,baseHeight,.2,detailMaterial);
        } else {
          part(0,baseHeight-.12,.22,span,.24,.44,detailMaterial);
          part(0,baseHeight*.68,.1,span*.85,.12,.2,detailMaterial);
        }
      };
      if (narrow) {
        // Trim the full-width mass above the smaller base to form an overhang.
        for (let index=firstPart; index<parent.children.length; index++) {
          const mesh=parent.children[index] as THREE.Mesh;
          const bottom=mesh.position.y-mesh.scale.y/2, top=mesh.position.y+mesh.scale.y/2;
          if (bottom < baseHeight && top > baseHeight) {
            mesh.scale.y=top-baseHeight;
            mesh.position.y=(top+baseHeight)/2;
          }
        }
        block(parent,material,x,baseHeight/2,z,width*.8,baseHeight,depth*.8);
        block(parent,darkMaterial,x,baseHeight+.1,z,width+.08,.2,depth+.08);
        addDetails();
        return;
      }
      // Expand the base away from the street, leaving the sidewalk clear.
      const widePart = (cx: number, cz: number, w: number, d: number) => {
        const dx = frontAxis === 'x' ? outward*w*.12 : 0;
        const dz = frontAxis === 'z' ? outward*d*.12 : 0;
        block(parent,material,cx+dx,baseHeight/2,cz+dz,w*1.24+.04,baseHeight,d*1.24+.04);
      };
      if (shape === 1) {
        widePart(x,z,width*.72,depth*.8);
        widePart(x+outward*width*.37,z,width*.45,depth);
      } else {
        widePart(x,z,width,depth);
      }
      addDetails();
    }
    // Decorate every emitted mass, including upper setbacks and towers.
    function decorateBuildingMasses(parent: THREE.Group, masses: THREE.Object3D[], facadeIndex: number, seed: number) {
      const baseTop = random(seed+140) < .2 ? 0 : (random(seed+141) < .5 ? 3.5 : 7);
      const finish = facadeDetailMaterials[facadeIndex];
      for (const part of masses) {
        const mesh=part as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) continue;
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        mesh.updateMatrix();
        const box=mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrix);
        const bottom=Math.max(baseTop,box.min.y), top=box.max.y;
        if (top-bottom<.5) continue;
        const cx=(box.min.x+box.max.x)/2, cz=(box.min.z+box.max.z)/2;
        const width=box.max.x-box.min.x, depth=box.max.z-box.min.z;
        for (const side of [-1,1]) {
          // Vertical piers and regular ledges cover all four faces.
          for (const offset of [-.35,.35]) {
            block(parent,finish,side<0?box.min.x-.08:box.max.x+.08,(bottom+top)/2,cz+offset*depth,.16,top-bottom,.18);
            block(parent,finish,cx+offset*width,(bottom+top)/2,side<0?box.min.z-.08:box.max.z+.08,.18,top-bottom,.16);
          }
          const floors=Math.max(1,Math.ceil((top-bottom)/8));
          for (let floor=1;floor<=floors;floor++) {
            const y=bottom+(top-bottom)*floor/floors-.08;
            block(parent,finish,side<0?box.min.x-.1:box.max.x+.1,y,cz,.2,.16,depth*.94);
            block(parent,finish,cx,y,side<0?box.min.z-.1:box.max.z+.1,width*.94,.16,.2);
          }
        }
      }
    }
    function addBayWindow(parent: THREE.Group, facade: THREE.Material[], x: number, z: number, width: number, depth: number, height: number, shape: number, outward: number, frontAxis: 'x' | 'z') {
      const bottom = Math.max(8,height*.2), bayHeight = height*.58;
      if (frontAxis === 'x') {
        const face=x-outward*width*(shape === 1 ? .36 : .5);
        block(parent,facade,face-outward*.42,bottom+bayHeight/2,z+depth*.36,.84,bayHeight,depth*.18);
      } else {
        const face=z-outward*depth/2;
        block(parent,facade,x+width*.36,bottom+bayHeight/2,face-outward*.42,width*.18,bayHeight,.84);
      }
    }
    // Orient alley fixtures to either axis and keep them near the street end.
    function addAlleyDetails(parent: THREE.Group, x: number, z: number, normalX: number, normalZ: number, wallHeight: number, seed: number) {
      const alongX = normalZ !== 0;
      const piece = (along: number, y: number, outward: number, w: number, h: number, d: number, material: THREE.Material) => {
        const px=x+(alongX ? along : normalX*outward);
        const pz=z+(alongX ? normalZ*outward : along);
        return block(parent,material,px,y,pz,alongX ? w : d,h,alongX ? d : w);
      };
      // Utility meter and conduit.
      piece(-1.1,2.3,.12,.55,.85,.2,streetFurniture);
      piece(-1.1,4,.1,.1,3,.12,curbMaterial);
      if (random(seed+101) > .35) {
        // Service door and a lintel.
        piece(.75,1.6,.08,1.45,3.2,.12,darkMaterial);
        piece(.75,3.25,.14,1.6,.12,.18,streetFurniture);
      }
      if (random(seed+102) > .38) {
        piece(.2,.85,1,2.2,1.5,1.15,dumpsterMaterial);
        piece(.2,1.65,1,2.3,.12,1.25,darkMaterial);
      } else {
        // Recycling bins and crates occupy less space on some lots.
        piece(-.55,.55,.8,.65,1,.65,dumpsterMaterial);
        piece(.35,.55,.8,.65,1,.65,streetFurniture);
        piece(1.15,.3,.85,.55,.55,.55,trunkMaterial);
      }
      if (random(seed+103) > .48) {
        // A narrow fire escape stands out in the silhouette of the alley.
        const levels = Math.min(3,Math.floor((wallHeight-4)/4));
        for (let level=0; level<levels; level++) {
          const y=5+level*4;
          piece(0,y,.8,2.3,.12,1.5,streetFurniture);
          piece(0,y+.9,1.5,2.3,.1,.1,streetFurniture);
          for (const end of [-1,1]) piece(end*1.05,y+.45,1.5,.1,.9,.1,streetFurniture);
        }
        if (levels > 0) piece(1,3+levels*2,1.4,.12,levels*4,.12,streetFurniture);
      }
    }
    // Sample a continuous route so adjacent street sections share their edges.
    const route = (s: number) => {
      const x = 55 * Math.sin(s / 190) + 18 * Math.sin(s / 72);
      const slope = 55 / 190 * Math.cos(s / 190) + 18 / 72 * Math.cos(s / 72);
      return { x, y: 7 * Math.sin(s / 135) + 3 * Math.sin(s / 57), z: -s, slope };
    };
    const sections: { group: THREE.Group; strips: { geometry: THREE.BufferGeometry; left: number; right: number; height: number; rightHeight: number }[]; corners: { geometry: THREE.BufferGeometry; side: number; end: number; curb: boolean }[]; intersectionRoad: THREE.BufferGeometry | null; marking: THREE.BufferGeometry; markingSamples: number[]; index: number }[] = [];
    const segmentLength = 60, segmentCount = 12;
    for (let i=0; i<segmentCount; i++) {
      const group = new THREE.Group(); scene.add(group);
      const strips: { geometry: THREE.BufferGeometry; left: number; right: number; height: number; rightHeight: number }[] = [];
      const corners: { geometry: THREE.BufferGeometry; side: number; end: number; curb: boolean }[] = [];
      function strip(left: number, right: number, height: number, material: THREE.Material, rightHeight = height) {
        const stripGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(13 * 2 * 3);
        const indices: number[] = [];
        for (let j=0; j<12; j++) {
          // Open the curb where the side street meets the main road.
          if (i % 4 === 0 && (material === curbMaterial || (material === sidewalkMaterial && right-left < 10)) && j >= 4 && j < 8) continue;
          const a = j*2; indices.push(a,a+1,a+2,a+1,a+3,a+2);
        }
        stripGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        stripGeometry.setIndex(indices);
        const mesh = new THREE.Mesh(stripGeometry, material);
        mesh.frustumCulled = false; scene.add(mesh);
        strips.push({geometry: stripGeometry, left, right, height, rightHeight});
      }
      // Extend the connected ground beneath the buildings so there is no
      // open gap beyond the sidewalks, including on hills and bends.
      strip(-90,90,-.08,sidewalkMaterial);
      strip(-10,10,0,roadMaterial);
      strip(-13.5,-10.35,.18,sidewalkMaterial);
      strip(10.35,13.5,.18,sidewalkMaterial);
      strip(-10.35,-10,.18,curbMaterial);
      strip(10,10.35,.18,curbMaterial);
      // Vertical faces connect the curb tops to the road surface.
      strip(-10,-10,.18,curbMaterial,0);
      strip(10,10,0,curbMaterial,.18);
      let intersectionRoad: THREE.BufferGeometry | null = null;
      if (i % 4 === 0) {
        intersectionRoad = new THREE.BufferGeometry();
        intersectionRoad.setAttribute('position',new THREE.BufferAttribute(new Float32Array(12),3));
        intersectionRoad.setIndex([0,1,2,1,3,2]);
        const crossing = new THREE.Mesh(intersectionRoad,roadMaterial);
        crossing.frustumCulled = false; scene.add(crossing);
        for (const side of [-1,1]) for (const end of [-1,1]) for (const curb of [false,true]) {
          const cornerGeometry = new THREE.BufferGeometry();
          cornerGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(12),3));
          cornerGeometry.setIndex([0,1,2,1,3,2]);
          const mesh = new THREE.Mesh(cornerGeometry,curb ? curbMaterial : sidewalkMaterial);
          mesh.frustumCulled = false; scene.add(mesh);
          corners.push({geometry: cornerGeometry,side,end,curb});
        }
      }
      // Subdivide each dash at road mesh vertices so it follows the same triangles.
      const markingSamples: number[] = [], markingIndices: number[] = [];
      for (let dash=0; dash<4; dash++) {
        const start = 7.5 + dash*15 - 2.75, end = start + 5.5;
        const samples = [start];
        for (let at=Math.ceil(start/5)*5; at<end; at+=5) samples.push(at);
        samples.push(end);
        const base = markingSamples.length * 2;
        markingSamples.push(...samples);
        for (let k=0; k<samples.length-1; k++) {
          const a=base+k*2; markingIndices.push(a,a+1,a+2,a+1,a+3,a+2);
        }
      }
      const marking = new THREE.BufferGeometry();
      marking.setAttribute('position', new THREE.BufferAttribute(new Float32Array(markingSamples.length*6),3));
      marking.setIndex(markingIndices);
      const markingMesh = new THREE.Mesh(marking,lineMaterial);
      markingMesh.frustumCulled = false; scene.add(markingMesh);
      sections.push({group,strips,corners,intersectionRoad,marking,markingSamples,index: Number.NaN});
      for (const side of [-1,1]) {
        for (let j=0;j<4;j++) {
          if (i % 4 === 0 && (j === 1 || j === 2)) continue;
          const seed = i*41 + j*7 + (side+1)*101;
          // Keep corner lots occupied so each intersection has a real corner.
          const corner = i % 4 === 0 && (j === 0 || j === 3);
          // Keep some other lots open and vary neighboring spacing.
          if (!corner && random(seed+32) < .15) continue;
          const width = 13 + random(seed+1)*12, depth = 10.5 + random(seed+2)*1.9;
          let height = 25 + random(seed+3)*75;
          const offset = 14 + width*.5 + random(seed+4)*3;
          const apartment = random(seed+14) > .45;
          const variant = Math.floor(random(seed+5)*8);
          const facadeIndex = (apartment ? 0 : 1)*8 + variant;
          const z = -22.5+j*15 + (random(seed+33)-.5)*2.4;
          // The buildings flanking a cross street have a second public face.
          const cornerFace = j === 0 ? 1 : -1;
          const shape = corner ? (apartment ? 2 : 3) : apartment ? 1 + Math.floor(random(seed+6)*3) : officeShapes[Math.floor(random(seed+6)*officeShapes.length)];
          const narrowBase = !corner && (shape === 2 || shape === 3) && random(seed+140) >= .2 && random(seed+143) > .45 && random(seed+9) <= .42;
          const graffitiBuilding = !corner && !narrowBase && (shape === 2 || shape === 3) && random(seed+140) >= .2 && random(seed+171) > .65;
          if (graffitiBuilding) height = 12 + random(seed+172)*6;
          const graffitiSide = random(seed+173) > .5 ? 1 : -1;
          const artForSide = (alleySide: number) => graffitiBuilding && alleySide === graffitiSide ? 'graffiti' : 'none';
          const facade = [...facadeSets[facadeIndex]];
          for (const alleySide of [-1,1]) if (artForSide(alleySide) !== 'none') facade[alleySide > 0 ? 4 : 5] = blankWallMaterials[variant];
          const firstBuildingPart = group.children.length;
          buildingMass(group,facade,side*offset,z,width,depth,height,shape,side);
          const buildingParts=group.children.slice(firstBuildingPart);
          addStreetBase(group,side*offset,z,width,depth,shape,side,seed,narrowBase,firstBuildingPart,'x',variant);
          const exitSide=corner ? cornerFace : graffitiBuilding ? -graffitiSide : (random(seed+174) > .5 ? 1 : -1);
          const hasBase=random(seed+140)>=.2;
          const exitZ=z+exitSide*(depth*(shape === 1 ? (hasBase ? .496 : .4) : narrowBase ? .4 : hasBase ? .62 : .5)+.16);
          block(group,darkMaterial,side*(offset-width*.2),1.5,exitZ,1.5,3,.16);
          if (!graffitiBuilding) decorateBuildingMasses(group,buildingParts,facadeIndex,seed);
          if (apartment && shape !== 1 && random(seed+161) > .5) addBayWindow(group,facade,side*offset,z,width,depth,height,shape,side,'x');
          // Side walls get utility details and occasional paint in the alleys.
          const sideDepth = depth*(shape === 1 ? .4 : .5);
          const wallHeight = height*baseFraction(shape);
          for (const alleySide of [-1,1]) {
            const art = artForSide(alleySide);
            const wallZ = z+alleySide*(sideDepth+(art === 'graffiti' ? depth*.12 : 0)+.04);
            if (art === 'none' && !narrowBase) {
            block(group,balconyMaterials[variant],side*offset,wallHeight*.55,wallZ,width*(shape === 1 ? .65 : .9),.12,.08);
            block(group,balconyMaterials[variant],side*(offset+width*.25),wallHeight*.45,wallZ,.14,wallHeight*.9,.14);
            // Small vents and sills add depth to the alley-facing walls.
            const detailX = side*(offset-width*.18);
            const detailY = Math.max(4,wallHeight*.3);
            if (random(seed+alleySide*13+51) > .38) {
              block(group,streetFurniture,detailX,detailY,wallZ+alleySide*.18,1.4,.85,.3);
              block(group,darkMaterial,detailX,detailY,wallZ+alleySide*.35,1.05,.42,.04);
            }
            for (const level of [.48,.72]) {
              const sillY = wallHeight*level;
              block(group,curbMaterial,side*(offset+width*.08),sillY,wallZ+alleySide*.12,2.1,.12,.2);
            }
            if (corner && alleySide === cornerFace) {
              // A second shopfront faces the intersecting street.
              const shopWidth = Math.min(width*.6,12);
              block(group,darkMaterial,side*(offset+shopWidth*.26),1.55,wallZ+alleySide*.24,1.3,3,.08);
              block(group,shopAwnings[variant%shopAwnings.length],side*offset,4.05,wallZ+alleySide*.5,shopWidth+.5,.22,.9);
            } else if (!hasBase || alleySide === exitSide) {
              addAlleyDetails(group,side*(offset-width*.27),wallZ,0,alleySide,wallHeight,seed+alleySide*31);
            }
            }
            const coverage = random(seed+alleySide*19+21);
            if (art === 'graffiti') {
              const baseHeight = random(seed+141) < .5 ? 3.5 : 7;
              const count = coverage > .72 && baseHeight > 5 ? 2 : 1;
              for (let tag=0; tag<count; tag++) {
                const tagMaterial = graffitiMaterials[(variant+tag)%graffitiMaterials.length];
                const tagWidth = count > 1 ? width*(shape === 1 ? .6 : .8) : Math.min(8,width*.35);
                const tagX = count > 1 ? side*offset : side*(offset-width*.18);
                block(group,tagMaterial,tagX,1.25+tag*2.1,wallZ+alleySide*(.07+tag*.005),tagWidth,2.1,.04);
              }
            }
          }
          if (hasBase && !graffitiBuilding) {
            const artSide=-exitSide, baseHeight=random(seed+141)<.5 ? 3.5 : 7;
            const wallDistance=depth*(shape === 1 ? (narrowBase ? .32 : .496) : narrowBase ? .4 : .62);
            const artWidth=width*(shape === 1 ? .55 : narrowBase ? .68 : .82);
            const mural=muralMaterials[Math.floor(random(seed+178)*muralMaterials.length)];
            block(group,mural,side*offset,baseHeight/2,z+artSide*(wallDistance+.1),artWidth,baseHeight-.4,.04);
          }
          // Occasional rooftop equipment gives the skyline more detail.
          const roofDetail = random(seed+13);
          if (apartment) {
            const roofWidth = width*(shape === 1 ? .72 : 1);
            const roofDepth = depth*(shape === 1 ? .8 : 1);
            const roofStyle = Math.floor(random(seed+16)*3);
            if (roofStyle === 0) {
              block(group,balconyMaterials[variant],side*offset,height+.25,z,roofWidth+.3,.5,roofDepth+.3);
            } else if (roofStyle === 1) {
              block(group,darkMaterial,side*offset,height+.9,z,roofWidth*.52,1.8,roofDepth*.45);
            } else {
              for (const dz of [-1,1]) block(group,balconyMaterials[variant],side*offset,height+.5,z+dz*roofDepth*.48,roofWidth,.95,.15);
            }
          }
          if (roofDetail > .42) {
            block(group,curbMaterial,side*offset,height+1.3,z,1.2,2.6,1.2);
          }
          if (roofDetail > .7) {
            block(group,curbMaterial,side*(offset+width*.12),height+4,z,.12,8,.12);
            block(group,curbMaterial,side*(offset+width*.12),height+6,z,1.1,.1,.1);
          }
          if (apartment) {
            const face = side*(offset-width*(shape === 1 ? .36 : .5)-.04);
            const balcony = balconyMaterials[variant];
            const style = Math.floor(random(seed+15)*3);
            for (let floor=1; floor<8; floor++) {
              const y = height*floor/8;
              const baseTop=hasBase ? (random(seed+141)<.5 ? 3.5 : 7) : 3.5;
              if (y-.07 <= baseTop) continue;
              const balconyDepth = style === 1 ? .9 : 1.4;
              const balconyWidth = depth * (style === 2 ? .52 : .32);
              block(group,balcony,face-side*balconyDepth/2,y,z,balconyDepth,.14,balconyWidth);
              if (style === 0) {
                // Open rail with slim posts.
                block(group,balcony,face-side*balconyDepth,y+1,z,.1,.1,balconyWidth);
                for (const end of [-1,1]) block(group,balcony,face-side*balconyDepth,y+.5,z+end*balconyWidth*.45,.1,1,.1);
              } else {
                // Solid parapet or a wider, shallow balcony.
                block(group,balcony,face-side*balconyDepth,y+.55,z,.1,1.1,balconyWidth);
                for (const end of [-1,1]) block(group,balcony,face-side*balconyDepth/2,y+.55,z+end*balconyWidth/2,balconyDepth,1.1,.08);
              }
            }
          }
          // Keep some storefront awnings above the window-free ground floor.
          if (random(seed+9) > .42) {
            const face = side*(offset-width*(shape === 1 ? .36 : .5)-.08);
            const shopWidth = depth*.72;
            const awning = shopAwnings[Math.floor(random(seed+11)*shopAwnings.length)];
            block(group,awning,face-side*.6,4.1,z,1.2,.25,shopWidth+1);
          }
          // Sink the building slightly into the ground to hide gaps on slopes.
          for (let part=firstBuildingPart; part<group.children.length; part++) {
            group.children[part].position.y -= .75;
          }
        }
        // Alternate one and two lamps per section for 1.5 times the density.
        const polePositions = i % 2 === 0 ? [-20, 20] : [0];
        for (const poleZ of polePositions) {
          block(group,curbMaterial,side*11.7,4.4,poleZ,.18,8.8,.18);
          block(group,curbMaterial,side*10.9,8.8,poleZ,1.8,.14,.14);
          block(group,lampMaterial,side*10.1,8.7,poleZ,.55,.14,.3);
        }
        if (i % 4 !== 0) {
          for (const z of [-25,0,25]) {
            const joint = block(group,sidewalkJoint,side*11.9,.19,z,2.7,.015,.06);
            joint.userData.roadDecal = true; joint.userData.lateral = joint.position.x;
          }
          if (i % 3 === 1) {
            const x = side*12.25, z = 7;
            // Glass shelter with a roof, slim supports, and a small bench.
            block(group,streetFurniture,x,2.9,z,1.8,.16,4.5);
            block(group,shelterGlass,x+side*.8,1.55,z,.06,2.6,4.3);
            for (const dz of [-2.1,2.1]) {
              block(group,streetFurniture,x+side*.8,1.5,z+dz,.1,2.8,.1);
              block(group,shelterGlass,x,1.55,z+dz,1.6,2.6,.06);
            }
            block(group,streetFurniture,x+side*.35,.65,z,.65,.12,2.5);
            for (const dz of [-.8,.8]) block(group,streetFurniture,x+side*.35,.35,z+dz,.5,.6,.1);
          }
          for (let item=0; item<2; item++) {
            const seed = i*193 + item*53 + (side+1)*71;
            const z = item === 0 ? -12 : 28;
            const x = side*12.25;
            const kind = Math.floor(random(seed+1)*4);
            const leaves = (y: number, sx: number, sy: number, sz: number) => {
              const mesh = new THREE.Mesh(foliageGeometry,foliageMaterial);
              mesh.position.set(x,y,z); mesh.scale.set(sx,sy,sz); group.add(mesh);
            };
            if (kind === 0) {
              // The photographed tree is a dark, camera-facing cutout.
              const tree = new THREE.Sprite(treeMaterials[Math.floor(random(seed+2)*treeMaterials.length)]);
              tree.position.set(x,3.2,z); tree.scale.set(5.2,6.4,1); group.add(tree);
            } else if (kind === 1) {
              block(group,streetFurniture,x,.55,z,.7,.18,2.2);
              block(group,streetFurniture,x+side*.28,.95,z,.12,.75,2.2);
              for (const dz of [-.75,.75]) block(group,trunkMaterial,x,.25,z+dz,.5,.5,.12);
            } else if (kind === 2) {
              block(group,streetFurniture,x,.25,z,.8,.5,.8);
              leaves(.85,.55,.6,.55);
            } else {
              leaves(.55,.65,.55,.9);
            }
          }
        }
      }
      if (i % 4 !== 0) {
        // Small, low-contrast repairs make the road less uniform.
        for (let repair=0; repair<2; repair++) {
          const x = (random(i*53+repair*11)-.5)*14;
          const z = -17+repair*31;
          const mark = block(group,pavementPatch,x,.018,z,1.1,.012,2.5+random(i*17+repair)*2);
          mark.userData.roadDecal = true; mark.userData.lateral = x;
        }
      }
      if (i % 4 === 0) {
        // Extend the city down both sides of each cross street. Keep these
        // buildings beyond the corner lots and outside the sidewalk.
        for (const streetEnd of [-1,1]) for (const streetSide of [-1,1]) for (let lot=0; lot<2; lot++) {
          const seed = i*307 + (streetEnd+1)*43 + (streetSide+1)*79 + lot*17;
          if (random(seed+32) < .15) continue;
          const x = streetEnd*(52 + lot*22 + (random(seed+33)-.5)*1.6);
          const lotWidth = 16 + random(seed+34)*3;
          const depth = 13 + random(seed+1)*2;
          const z = streetSide*(15.5 + depth/2);
          let height = 25 + random(seed+2)*55;
          const apartment = random(seed+3) > .45;
          const variant = Math.floor(random(seed+4)*8);
          const facadeIndex = (apartment ? 0 : 1)*8+variant;
          const firstPart = group.children.length;
          const shape = apartment ? 2 : officeShapes[Math.floor(random(seed+8)*officeShapes.length)];
          const narrowBase = (shape === 2 || shape === 3) && random(seed+140) >= .2 && random(seed+143) > .45 && random(seed+6) <= .5;
          const graffitiBuilding = !narrowBase && (shape === 2 || shape === 3) && random(seed+140) >= .2 && random(seed+171) > .65;
          if (graffitiBuilding) height = 12 + random(seed+172)*6;
          const graffitiSide = random(seed+173) > .5 ? 1 : -1;
          const artForSide = (alleySide: number) => graffitiBuilding && alleySide === graffitiSide ? 'graffiti' : 'none';
          const facade = [...facadeSets[facadeIndex]];
          for (const alleySide of [-1,1]) if (artForSide(alleySide) !== 'none') facade[alleySide > 0 ? 0 : 1] = blankWallMaterials[variant];
          buildingMass(group,facade,x,z,lotWidth,depth,height,shape,streetEnd);
          const buildingParts=group.children.slice(firstPart);
          addStreetBase(group,x,z,lotWidth,depth,shape,streetSide,seed,narrowBase,firstPart,'z',variant);
          const exitSide=graffitiBuilding ? -graffitiSide : (random(seed+174) > .5 ? 1 : -1);
          const hasBase=random(seed+140)>=.2;
          const exitX=x+exitSide*(lotWidth*(shape === 1 ? (hasBase ? .4464 : .36) : narrowBase ? .4 : hasBase ? .62 : .5)+.16);
          block(group,darkMaterial,exitX,1.5,z-streetSide*depth*.2,.16,3,1.5);
          if (!graffitiBuilding) decorateBuildingMasses(group,buildingParts,facadeIndex,seed);
          if (apartment && random(seed+161) > .5) addBayWindow(group,facade,x,z,lotWidth,depth,height,shape,streetSide,'z');
          const wallHeight = height*baseFraction(shape);
          for (const alleySide of [-1,1]) {
            const art = artForSide(alleySide);
            const wallX = x+alleySide*(lotWidth*(art === 'graffiti' ? .62 : .5)+.04);
            if (art === 'none' && !narrowBase) {
            block(group,balconyMaterials[variant],wallX,wallHeight*.55,z,.08,.12,depth*.85);
            block(group,balconyMaterials[variant],wallX,wallHeight*.45,z+depth*.28,.14,wallHeight*.9,.14);
            const detailY = Math.max(4,wallHeight*.3);
            if (random(seed+alleySide*13+51) > .38) {
              block(group,streetFurniture,wallX+alleySide*.18,detailY,z-streetSide*depth*.16,.3,.85,1.4);
              block(group,darkMaterial,wallX+alleySide*.35,detailY,z-streetSide*depth*.16,.04,.42,1.05);
            }
            for (const level of [.48,.72]) {
              block(group,curbMaterial,wallX+alleySide*.12,wallHeight*level,z+streetSide*depth*.08,.2,.12,2.1);
            }
            if (!hasBase || alleySide === exitSide) addAlleyDetails(group,wallX,z-streetSide*depth*.3,alleySide,0,wallHeight,seed+alleySide*31);
            }
            const coverage = random(seed+alleySide*19+21);
            if (art === 'graffiti') {
              const baseHeight = random(seed+141) < .5 ? 3.5 : 7;
              const count = coverage > .72 && baseHeight > 5 ? 2 : 1;
              for (let tag=0; tag<count; tag++) {
                const tagMaterial = graffitiMaterials[(variant+tag)%graffitiMaterials.length];
                const tagZ = count > 1 ? z : z-streetSide*depth*.18;
                block(group,tagMaterial,wallX+alleySide*(.07+tag*.005),1.25+tag*2.1,tagZ,.04,2.1,count > 1 ? depth*.85 : Math.min(8,depth*.55));
              }
            }
          }
          if (hasBase && !graffitiBuilding) {
            const artSide=-exitSide, baseHeight=random(seed+141)<.5 ? 3.5 : 7;
            const wallDistance=lotWidth*(narrowBase ? .4 : .62);
            const artWidth=depth*(narrowBase ? .68 : .82);
            const mural=muralMaterials[Math.floor(random(seed+178)*muralMaterials.length)];
            block(group,mural,x+artSide*(wallDistance+.1),baseHeight/2,z,.04,baseHeight-.4,artWidth);
          }
          if (apartment) {
            const balcony = balconyMaterials[variant];
            const face = z-streetSide*(depth/2+.05);
            const wide = random(seed+5) > .5;
            const balconyWidth = wide ? 8 : 5;
            for (let floor=1; floor<8; floor++) {
              const y=height*floor/8;
              const baseTop=hasBase ? (random(seed+141)<.5 ? 3.5 : 7) : 3.5;
              if (y-.07 <= baseTop) continue;
              block(group,balcony,x,y,face-streetSide*.65,balconyWidth,.14,1.3);
              if (wide) {
                block(group,balcony,x,y+.5,face-streetSide*1.25,balconyWidth,1,.1);
              } else {
                block(group,balcony,x,y+1,face-streetSide*1.25,balconyWidth,.1,.1);
                for (const edge of [-1,1]) block(group,balcony,x+edge*balconyWidth*.45,y+.5,face-streetSide*1.25,.1,1,.1);
              }
            }
          }
          if (random(seed+6) > .5) {
            const face = z-streetSide*(depth/2+.08);
            const awning = shopAwnings[variant%shopAwnings.length];
            block(group,awning,x,4.1,face-streetSide*.6,11.5,.25,1.2);
          }
          if (random(seed+7) > .5) block(group,curbMaterial,x,height+2,z,.12,4,.12);
          for (let part=firstPart; part<group.children.length; part++) group.children[part].position.y -= .75;
        }
        // Give the cross-street sidewalks the same furniture and greenery.
        for (const streetEnd of [-1,1]) for (const streetSide of [-1,1]) for (let item=0; item<3; item++) {
          const seed = i*401 + (streetEnd+1)*61 + (streetSide+1)*89 + item*31;
          const x = streetEnd*(40+item*20), z = streetSide*11.8;
          const kind = Math.floor(random(seed+1)*4);
          if (kind === 0) {
            const tree = new THREE.Sprite(treeMaterials[Math.floor(random(seed+2)*treeMaterials.length)]);
            tree.position.set(x,3.2,z); tree.scale.set(5.2,6.4,1); group.add(tree);
          } else if (kind === 1) {
            block(group,streetFurniture,x,.55,z,2.2,.18,.7);
            block(group,streetFurniture,x,.95,z+streetSide*.28,2.2,.75,.12);
            for (const dx of [-.75,.75]) block(group,trunkMaterial,x+dx,.25,z,.12,.5,.5);
          } else {
            if (kind === 2) block(group,streetFurniture,x,.25,z,.8,.5,.8);
            const shrub = new THREE.Mesh(foliageGeometry,foliageMaterial);
            shrub.position.set(x,kind === 2 ? .85 : .55,z);
            shrub.scale.set(kind === 2 ? .55 : .9,.55,.55); group.add(shrub);
          }
        }
        for (const streetEnd of [-1,1]) {
          const streetSide = streetEnd, x = streetEnd*30, z = streetSide*11.8;
          // A side-street shelter faces its own roadway.
          block(group,streetFurniture,x,2.9,z,4.5,.16,1.8);
          block(group,shelterGlass,x,1.55,z+streetSide*.8,4.3,2.6,.06);
          for (const dx of [-2.1,2.1]) {
            block(group,streetFurniture,x+dx,1.5,z+streetSide*.8,.1,2.8,.1);
            block(group,shelterGlass,x+dx,1.55,z,.06,2.6,1.6);
          }
          block(group,streetFurniture,x,.65,z+streetSide*.35,2.5,.12,.65);
          for (const dx of [-.8,.8]) block(group,streetFurniture,x+dx,.35,z+streetSide*.35,.1,.6,.5);
        }
        // Crosswalks sit on either side of the open side street.
        for (const z of [-23,23]) for (let stripe=0; stripe<8; stripe++) {
          const mark = block(group,lineMaterial,-8.75+stripe*2.5,.025,z,1.2,.025,3.2);
          mark.userData.roadDecal = true;
          mark.userData.lateral = mark.position.x;
        }
        // The side-street approaches also need crossings on both sides.
        for (const x of [-18,18]) for (let stripe=0; stripe<8; stripe++) {
          const mark = block(group,lineMaterial,x,.025,-8.75+stripe*2.5,3.2,.025,1.2);
          mark.userData.roadDecal = true;
          mark.userData.lateral = x;
        }
        function signalHead(x: number, z: number, angle: number, mainRoad: boolean) {
          const housing = block(group,darkMaterial,x,7.1,z,1.05,2.1,.28);
          housing.rotation.y = angle;
          const lenses: THREE.Mesh[] = [];
          for (let lens=0; lens<3; lens++) {
            const mesh = new THREE.Mesh(signalLensGeometry,signalOff);
            mesh.position.set(x+Math.sin(angle)*.15,7.65-lens*.55,z+Math.cos(angle)*.15);
            mesh.rotation.y = angle; group.add(mesh); lenses.push(mesh);
          }
          signalHeads.push({lenses,mainRoad});
        }
        // Each approach faces a signal on the far side of the intersection.
        for (const side of [-1,1]) {
          const z = -side*13.5, x = side*4;
          block(group,curbMaterial,side*11.7,4.1,z,.22,8.2,.22);
          block(group,curbMaterial,side*7.85,8.2,z,7.7,.16,.16);
          signalHead(x,z,side > 0 ? 0 : Math.PI,true);
          block(group,signMaterial,side*11.7,5.85,z+.15,3.2,.7,.12);
          const crossX = -side*13.5, crossZ = -side*4;
          block(group,curbMaterial,crossX,4.1,-side*11.7,.22,8.2,.22);
          block(group,curbMaterial,crossX,8.2,-side*7.85,.16,.16,7.7);
          signalHead(crossX,crossZ,side*Math.PI/2,false);
        }
      }
    }

    function placeSection(section: typeof sections[number], index: number) {
      if (section.index === index) return;
      section.index = index;
      const middle = route(index * segmentLength);
      section.group.position.set(middle.x,middle.y,middle.z);
      section.group.rotation.y = -Math.atan(middle.slope);
      // Place each object at its own road elevation; keep buildings upright.
      for (const child of section.group.children) {
        const mesh = child as THREE.Mesh;
        const sample = route(index * segmentLength - mesh.position.z);
        if (mesh.userData.roadDecal) {
          const angle = Math.atan(middle.slope);
          mesh.position.x = mesh.userData.lateral + (sample.x-middle.x)*Math.cos(angle) + (sample.z-middle.z)*Math.sin(angle);
          mesh.rotation.y = -Math.atan(sample.slope) + angle;
          const before = route(index * segmentLength - mesh.position.z - 1);
          const after = route(index * segmentLength - mesh.position.z + 1);
          mesh.rotation.x = Math.atan2(after.y-before.y,2);
        }
        // The original local Y includes each object's height above the road.
        const originalY = mesh.userData.originalY ?? mesh.position.y;
        mesh.userData.originalY = originalY;
        mesh.position.y = originalY + sample.y - middle.y;
      }
      for (const strip of section.strips) {
        const position = strip.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let j=0; j<=12; j++) {
          const point = route(index * segmentLength - segmentLength/2 + j*segmentLength/12);
          const norm = Math.hypot(1,point.slope);
          for (let side=0; side<2; side++) {
            const lateral = side ? strip.right : strip.left;
            position.setXYZ(j*2+side,point.x + lateral/norm,point.y + (side ? strip.rightHeight : strip.height),point.z + lateral*point.slope/norm);
          }
        }
        position.needsUpdate = true;
        strip.geometry.computeVertexNormals();
      }
      // Continue the sidewalks away from the main road along each side street.
      for (const corner of section.corners) {
        const vertices = corner.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let row=0; row<2; row++) for (let col=0; col<2; col++) {
          const distance = index*segmentLength + corner.end * (10 + (corner.curb ? 0 : row*3.15));
          const point = route(distance);
          const lateral = corner.side * (10.35 + col*79.65);
          const norm = Math.hypot(1,point.slope);
          vertices.setXYZ(row*2+col,point.x+lateral/norm,point.y+(corner.curb && row === 0 ? 0 : .18),point.z+lateral*point.slope/norm);
        }
        vertices.needsUpdate = true;
        corner.geometry.computeVertexNormals();
      }
      if (section.intersectionRoad) {
        const vertices = section.intersectionRoad.getAttribute('position') as THREE.BufferAttribute;
        for (let row=0; row<2; row++) for (let col=0; col<2; col++) {
          const point = route(index*segmentLength - 10 + row*20);
          const lateral = col ? 90 : -90, norm = Math.hypot(1,point.slope);
          vertices.setXYZ(row*2+col,point.x+lateral/norm,point.y-.02,point.z+lateral*point.slope/norm);
        }
        vertices.needsUpdate = true;
        section.intersectionRoad.computeVertexNormals();
      }
      const road = section.strips[1].geometry.getAttribute('position') as THREE.BufferAttribute;
      const marks = section.marking.getAttribute('position') as THREE.BufferAttribute;
      section.markingSamples.forEach((distance, sampleIndex) => {
        const row = Math.min(11, Math.floor(distance/5));
        const fraction = (distance-row*5)/5;
        for (let side=0; side<2; side++) {
          // Interpolate across the road width and along its existing mesh edges.
          const across = side === 0 ? .49625 : .50375;
          const value = (component: 'getX' | 'getY' | 'getZ') => {
            const a = THREE.MathUtils.lerp(road[component](row*2),road[component](row*2+1),across);
            const b = THREE.MathUtils.lerp(road[component]((row+1)*2),road[component]((row+1)*2+1),across);
            return THREE.MathUtils.lerp(a,b,fraction);
          };
          marks.setXYZ(sampleIndex*2+side,value('getX'),value('getY')+.015,value('getZ'));
        }
      });
      marks.needsUpdate = true;
    }

    let travel = 0, speed = 23, previous = performance.now(), frame = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let assetsReady = false, revealed = false;
    const images = [moonImage, ...treeImages, ...graffitiImages, ...muralImages, ...wallImages];
    Promise.all(images.map(image => new Promise<void>(resolve => {
      if (image.complete) { resolve(); return; }
      image.addEventListener('load', () => resolve(), {once:true});
      image.addEventListener('error', () => resolve(), {once:true});
    }))).then(() => { if (!cityDisposed) assetsReady = true; });
    const resize = () => {
      const rect=element.getBoundingClientRect(); if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false); filter.setSize(rect.width, rect.height);
      camera.aspect=rect.width/rect.height;
      camera.updateProjectionMatrix();
      // Shift the projection down without changing its scale or field of view.
      camera.projectionMatrix.elements[9] = .28;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    };
    resize();
    window.addEventListener('resize',resize);
    function render(now: number) {
      const dt = Math.min((now - previous)/1000,.05); previous=now;
      // Opposing approaches share a phase; cross traffic has the other phase.
      const phase = (now / 1000) % 40;
      for (const head of signalHeads) {
        const state = head.mainRoad ? (phase < 15 ? 2 : phase < 18 ? 1 : 0) : (phase < 20 || phase >= 38 ? 0 : phase < 35 ? 2 : 1);
        const active = [signalRed,signalAmber,signalGreen];
        head.lenses.forEach((lens,index) => { lens.material = index === state ? active[index] : signalOff; });
      }
      if(assetsReady && !reduceMotion.matches) {
        const bend = Math.abs(route(travel+55).slope - route(travel).slope);
        const targetSpeed = Math.max(14, 23 - bend * 38);
        speed += Math.max(-4*dt, Math.min(1.5*dt, targetSpeed-speed));
        travel += speed * dt * .8;
      }
      const first = Math.floor(travel / segmentLength);
      for(let i=0;i<sections.length;i++) {
        const index = first - 1 + i;
        placeSection(sections[((index % segmentCount) + segmentCount) % segmentCount], index);
      }
      const here = route(travel), ahead = route(travel + 35);
      camera.position.set(here.x,here.y + 2.45 + (!reduceMotion.matches ? Math.sin(travel*.035)*.008 : 0),here.z);
      // Tilt upward to show more sky and less road.
      const lookDistance = Math.hypot(ahead.x-here.x,ahead.z-here.z);
      camera.lookAt(ahead.x,ahead.y + 2.45 + Math.tan(25*Math.PI/180)*lookDistance,ahead.z);
      filter.render(scene,camera);
      if (assetsReady && !revealed) {
        revealed = true;
        renderer.domElement.classList.add(styles.ready);
      }
      frame=requestAnimationFrame(render);
    }
    frame=requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);window.removeEventListener('resize',resize);
      cityDisposed = true; treeImages.forEach(image => { image.onload = null; }); treeTextures.forEach(texture => texture.dispose()); treeMaterials.forEach(material => material.dispose());
      geometry.dispose(); roundTowerGeometry.dispose(); taperedTowerGeometry.dispose(); baseArchGeometry.dispose(); foliageGeometry.dispose(); signalLensGeometry.dispose(); sections.forEach(section => { section.strips.forEach(strip => strip.geometry.dispose()); section.corners.forEach(corner => corner.geometry.dispose()); section.intersectionRoad?.dispose(); section.marking.dispose(); }); windowTextures.forEach(texture=>texture.dispose());facadeMaterials.forEach(material=>material.dispose());shadedFacades.forEach(material=>material.dispose());
      graffitiImages.forEach(image=>{image.onload=null;}); graffitiTextures.forEach(texture=>texture.dispose()); graffitiMaterials.forEach(material=>material.dispose());
      muralImages.forEach(image=>{image.onload=null;}); muralTextures.forEach(texture=>texture.dispose()); muralMaterials.forEach(material=>material.dispose());
      [darkMaterial,roadMaterial,curbMaterial,sidewalkMaterial,pavementPatch,sidewalkJoint,lineMaterial,lampMaterial,...shopAwnings,...balconyMaterials,...blankWallMaterials,...facadeDetailMaterials,...streetBaseMaterials,signalRed,signalAmber,signalGreen,signalOff,signMaterial,foliageMaterial,trunkMaterial,streetFurniture,dumpsterMaterial,shelterGlass].forEach(material=>material.dispose());
      signTexture.dispose();
      wallImages.forEach(image => { image.onload = null; }); moonImage.onload = null; skyTexture.dispose();filter.dispose();renderer.dispose();
    };
  }, []);

  return <main className={styles.page}>
    <canvas ref={canvas} className={styles.canvas} aria-label="A slow drive through a midnight city" />
    <section className={styles.intro} aria-label="About Chris Cao">
      <header className={styles.introHeader}>
        <h1>Chris Cao</h1>
        <p>Computer Science @ University of Toronto</p>
      </header>
      <nav className={styles.introNav} aria-label="Page sections">
        <button type="button" aria-pressed={tab === 'home'} onClick={() => setTab('home')}>Home</button>
        <button type="button" aria-pressed={tab === 'blog'} onClick={() => setTab('blog')}>Blog</button>
      </nav>
      {tab === 'home' && <>
      <div className={styles.introCopy}>
        <ul>
          <li>Incoming Intern at Stripe</li>
          <li>Previous Intern at Amazon</li>
          <li>Likes: Clash Royale, Outkast</li>
        </ul>
      </div>
      <div className={styles.introLinks}>
        <h2>Links</h2>
        <a href="mailto:cjcao.work@gmail.com">Email</a>
        <a href="https://github.com/utcjcao">GitHub</a>
        <a href="https://linkedin.com/in/cjao">LinkedIn</a>
      </div>
      </>}
    </section>
  </main>;
}
