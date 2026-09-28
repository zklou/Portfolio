import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PANELS, Panel as PanelData } from '../config';
import { lerp, smoothstep } from '../lib/math';
import {
  PANEL_ANGLES,
  PANEL_RADIUS,
  PANEL_Y,
  panelAlignment,
  yawAt,
} from '../lib/orbit';
import { useDiscrete } from '../ScrollDriver';
import { chapterProgress, palette, story } from '../state';

/** 展板的取景框。素材横竖不一，必须等比塞进来——竖图按宽度铺会顶穿整个画面 */
const PANEL_FIT = { w: 6.2, h: 4.9 };

const capVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const capFragment = /* glsl */ `
  uniform float uDepth;
  uniform float uOpacity;
  uniform float uSeed;
  uniform vec3 uCap;
  uniform vec3 uShade;
  varying vec2 vUv;

  /** 三个不成比例的频率叠起来，雪线才不像一条正弦 */
  float crest(float x) {
    return sin(x * 11.0 + uSeed) * 0.34 +
           sin(x * 23.7 + uSeed * 2.1) * 0.19 +
           sin(x * 47.3 + uSeed * 3.7) * 0.09;
  }

  void main() {
    // 薄的时候是一层匀净的浮尘，厚了才起伏 —— 雪本来就是这样堆的
    float line = uDepth * (0.5 + crest(vUv.x) * 0.5 * uDepth);
    float fill = 1.0 - smoothstep(line - 0.06, line + 0.02, vUv.y);
    if (fill < 0.01 || uDepth < 0.004) discard;

    // 贴着板沿那道接触阴影是关键：白雪没有它就只是一块贴上去的色块
    float contact = smoothstep(0.11, 0.0, vUv.y);
    vec3 col = mix(uCap, uShade, contact * 0.5);

    // 顶上那一线略透，底下压实
    float a = fill * uOpacity * (0.82 + 0.18 * smoothstep(line, 0.0, vUv.y));
    gl_FragColor = vec4(col, a);
  }
`;
const Panel: React.FC<{ project: PanelData; index: number }> = ({
  project,
  index,
}) => {
  const image = useRef<THREE.MeshBasicMaterial>(null);
  const capUniforms = useMemo(
    () => ({
      uDepth: { value: 0 },
      uOpacity: { value: 0 },
      uSeed: { value: index * 2.7 },
      uCap: { value: new THREE.Color() },
      uShade: { value: new THREE.Color() },
    }),
    [index],
  );
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(project.image);
  const { theme } = useDiscrete();

  useEffect(() => {
    mat.current?.color.set(palette().accent);
    capUniforms.uCap.value.set(palette().snowCap);
    capUniforms.uShade.value.set(palette().snowShade);
  }, [theme, capUniforms]);

  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img?.width ? img.width / img.height : 1.4;
  const h = Math.min(PANEL_FIT.h, PANEL_FIT.w / aspect);
  const w = h * aspect;
  const angle = PANEL_ANGLES[index];

  useFrame(() => {
    const appear = smoothstep(0.35, 1, chapterProgress('arrival'));
    const align = panelAlignment(index, yawAt(chapterProgress('orbit')));
    // 没对准的展板压暗，视线所及之处才亮起来
    const level = appear * lerp(0.28, 1, align);
    if (image.current) image.current.opacity = level;
    if (mat.current) {
      mat.current.opacity = appear * lerp(0.1, 0.4, align);
    }
    if (group.current) {
      group.current.position.y = PANEL_Y + (1 - appear) * -1.2;
      group.current.visible = appear > 0.002;
    }
    // 站着不动雪才堆得起来：停留是有回报的
    capUniforms.uDepth.value = story.drift;
    capUniforms.uOpacity.value = appear;
  });

  return (
    <group
      ref={group}
      position={[
        Math.sin(angle) * PANEL_RADIUS,
        PANEL_Y,
        Math.cos(angle) * PANEL_RADIUS,
      ]}
      rotation={[0, angle + Math.PI, 0]}
    >
      {/* 边上那圈发光的衬底，让展板从雨幕里被「框」出来 */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.2, h + 0.2]} />
        <meshBasicMaterial
          ref={mat}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      {/* 板沿上的积雪。雪天慢慢堆高，一下雨很快冲掉 */}
      <mesh position={[0, h / 2 + 0.21, 0.015]}>
        <planeGeometry args={[w, 0.42]} />
        <shaderMaterial
          vertexShader={capVertex}
          fragmentShader={capFragment}
          uniforms={capUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          ref={image}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

/** orbit 章的三块展板，围成一圈，相机从中心往外看着它们转过去 */
const ProjectRing: React.FC = () => (
  <group>
    {PANELS.map((project, i) => (
      <Panel key={project.title} project={project} index={i} />
    ))}
  </group>
);

export default ProjectRing;
