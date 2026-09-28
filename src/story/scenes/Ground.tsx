import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { smoothstep } from '../lib/math';
import { useDiscrete } from '../ScrollDriver';
import { chapterProgress, palette, story } from '../state';

export const GROUND_Y = -4.2;

const vertex = /* glsl */ `
  varying vec2 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uRipple;
  uniform float uClock;

  varying vec2 vWorld;

  // 到最近一条网格线的世界空间距离。线宽随距离变粗，远处才不会闪
  float grid(vec2 p, float step, float w) {
    vec2 c = abs(fract(p / step - 0.5) - 0.5) * step;
    return 1.0 - smoothstep(0.0, w, min(c.x, c.y));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
  }

  /**
   * 雨点砸在地上的涟漪。每个格子里藏一个随机落点和随机相位，
   * 取 3x3 邻域是因为落点可能贴在格子边上，只看本格环会被切断。
   * 相位来自 uClock —— 时间冻住时涟漪也停在扩散到一半的地方。
   */
  float ripples(vec2 p) {
    float sum = 0.0;
    const float CELL = 3.4;
    vec2 base = floor(p / CELL);
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 cell = base + vec2(float(i), float(j));
        vec2 center = (cell + vec2(hash(cell), hash(cell + 17.0))) * CELL;
        float t = fract(uClock * 0.4 + hash(cell + 91.0));
        float r = t * 2.1;
        float d = distance(p, center);
        // 环一边扩散一边变粗变淡
        float ring = exp(-pow((d - r) / (0.045 + t * 0.14), 2.0));
        sum += ring * (1.0 - t) * (1.0 - t);
      }
    }
    return sum;
  }

  void main() {
    float d = length(vWorld);
    float w = 0.012 + d * 0.006;
    float fine = grid(vWorld, 1.0, w) * 0.22;
    float coarse = grid(vWorld, 5.0, w * 1.6) * 0.5;
    float fade = 1.0 - smoothstep(4.0, 26.0, d);

    // 涟漪只在收尾那章存在，其余时候直接跳过这段循环
    float ring = uRipple > 0.01 ? ripples(vWorld) * uRipple : 0.0;

    float a = (fine + coarse + ring * 1.1) * fade * uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), min(1.0, ring) * 0.55), a);
  }
`;

/** 落地之后脚下才有地面。细网格是开场那个终端留下的余味。 */
const Ground: React.FC = () => {
  const { theme } = useDiscrete();
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color() },
      uOpacity: { value: 0 },
      uRipple: { value: 0 },
      uClock: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uColor.value.set(palette().grid);
  }, [theme, uniforms]);

  useFrame(() => {
    uniforms.uOpacity.value = smoothstep(0.3, 0.9, chapterProgress('arrival'));
    // 时间重新流动，雨才砸得到地上
    uniforms.uRipple.value = smoothstep(0, 0.4, chapterProgress('restart'));
    uniforms.uClock.value = story.clock;
    if (mesh.current) mesh.current.visible = uniforms.uOpacity.value > 0.002;
  });

  return (
    <mesh
      ref={mesh}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, GROUND_Y, 0]}
      visible={false}
    >
      <planeGeometry args={[80, 80]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

export default Ground;
