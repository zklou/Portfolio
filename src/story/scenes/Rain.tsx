import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mulberry32, smoothstep } from '../lib/math';
import { pick } from '../lib/quality';
import { useDiscrete } from '../ScrollDriver';
import { chapterProgress, palette, story } from '../state';
import { GROUND_Y } from './Ground';

const COUNT = pick(20000, 8000);
const RADIUS = 18;
const HEIGHT = 22;

const vertex = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aSpeed;
  attribute float aRand;
  attribute vec4 aFlake;

  uniform float uFall;
  uniform float uSnow;
  uniform float uTimeScale;
  uniform float uHeight;
  uniform float uGround;

  varying vec2 vUv;
  varying float vBead;
  varying float vSnow;
  varying float vSpin;
  varying float vDepth;
  varying vec4 vFlake;

  void main() {
    // 相位只有一条，速率已经在 CPU 侧按雨/雪插值过了
    float fall = mod(aOffset.y - uFall * aSpeed, uHeight);
    vec3 base = vec3(aOffset.x, fall + uGround, aOffset.z);

    // 雨是直线，雪会打旋。两个不同频率叠起来才不像正弦波。
    // 频率按雪的相位标定——雪速只有雨速的百分之二，沿用雨的频率会僵成贴纸。
    float sway = sin(uFall * 26.0 + aRand * 41.0) * 0.22
               + sin(uFall * 11.0 + aRand * 17.0) * 0.12;
    base.x += sway * uSnow;
    base.z += cos(uFall * 19.0 + aRand * 29.0) * 0.14 * uSnow;

    vec4 mv = modelViewMatrix * vec4(base, 1.0);

    float bead = 1.0 - uTimeScale;
    // 雨：拖影长度 = 速度 × 时间流速，时间一慢运动模糊自己收回去。
    // 雪：没有拖影，只有一片有体积的六角。
    float streak = aSpeed * 0.035 * uTimeScale * (1.0 - uSnow);
    // 枝状的舒展、板状的紧实，尺寸也各不相同
    float size = 0.055 + aFlake.x * 0.045;
    float len = 0.04 + streak + uSnow * size;
    float wid = 0.019 + bead * 0.05 * (1.0 - uSnow) + uSnow * size;
    mv.xy += position.xy * vec2(wid, len) * (1.0 + aRand * 0.6);

    gl_Position = projectionMatrix * mv;
    vUv = uv;
    vBead = bead;
    vSnow = uSnow;
    vSpin = uFall * 14.0 + aRand * 62.0;
    vFlake = aFlake;
    vDepth = -mv.z;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uRainColor;
  uniform vec3 uSnowColor;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vBead;
  varying float vSnow;
  varying float vSpin;
  varying float vDepth;

  varying vec4 vFlake;

  /** 主臂上斜生的一根枝，沿 60 度方向 */
  float barb(vec2 a, float pos, float len, float w) {
    vec2 o = a - vec2(pos, 0.0);
    vec2 dir = vec2(0.5, 0.8660254);
    float along = dot(o, dir);
    float off = abs(o.x * dir.y - o.y * dir.x);
    return smoothstep(w, 0.0, off) *
           smoothstep(0.0, 0.012, along) *
           smoothstep(len, len * 0.5, along);
  }

  /**
   * 六角雪晶。把极角折进一个 60 度扇区，画一次就得到六重对称。
   *
   * 形态参数逐片不同 —— 世界上没有两片一样的雪：
   *   k.x 主臂长度   k.y 侧枝间距   k.z 侧枝长度   k.w 板状程度
   *
   * 两族形态各有画法：
   *   枝晶（dendrite）—— 主臂 + 三对越往末梢越短的侧枝，真实星状晶就是这个规律
   *   板晶（plate）  —— 六边形的**轮廓**。画成实心块的话，浅色背景上就是一坨黑
   */
  float flake(vec2 p, vec4 k) {
    float r = length(p);
    float sector = 1.0471976;
    float f = mod(atan(p.y, p.x) + sector * 0.5, sector) - sector * 0.5;
    vec2 q = vec2(cos(f), sin(f)) * r;
    vec2 a = vec2(q.x, abs(q.y));

    // 笔画要细。冰晶是长出来的针，不是涂出来的块。
    // 四个分量已经排满了，再从里面折出两个伪独立值当变化轴：笔画粗细、侧枝对数
    float w = 0.026 + fract(k.y * 7.3) * 0.016;
    float sparse = step(0.35, fract(k.z * 11.7));

    float arm = smoothstep(w, 0.0, a.y) * smoothstep(k.x, k.x * 0.88, a.x);

    // 侧枝的位置按主臂长度取比例，而不是给绝对值 ——
    // 给绝对值的话主臂末梢会空出一大截光杆，看着像蜘蛛腿不像雪
    float spread = 0.26 + k.y * 0.22;
    float b = barb(a, k.x * spread, k.z * 1.2, w * 0.85);
    b = max(b, barb(a, k.x * (spread + 0.26), k.z * 0.86, w * 0.72));
    b = max(b, barb(a, k.x * (spread + 0.5), k.z * 0.5, w * 0.6) * sparse);
    float core = smoothstep(0.075, 0.045, q.x);

    float dendrite = max(max(arm, b), core);

    // 折进扇区之后，「到中线的距离 = 常数」就是一条六边形的边
    float R = k.x * 0.58;
    float ring = smoothstep(w * 1.15, 0.0, abs(q.x - R));
    // 板晶的肋只长到六边形内壁，穿出去就成了插着棍的六边形
    float rib = smoothstep(w * 0.85, 0.0, a.y) * smoothstep(R, R * 0.88, a.x);
    float inner = smoothstep(w * 0.9, 0.0, abs(q.x - R * 0.46)) *
                  smoothstep(0.78, 0.86, k.w);
    float plate = max(max(ring, rib), max(inner, core));

    return clamp(mix(dendrite, plate, step(0.55, k.w)), 0.0, 1.0);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float body =
      (1.0 - smoothstep(0.15, 1.0, abs(p.x))) *
      (1.0 - smoothstep(0.30, 1.0, abs(p.y)));
    // 冻住之后每颗水珠中心亮起来，像被定在空中的玻璃
    float core = pow(max(0.0, 1.0 - length(p)), 3.0) * vBead;
    float rainA = body * 0.4 + core;

    float c = cos(vSpin);
    float sn = sin(vSpin);
    float snowA = flake(mat2(c, -sn, sn, c) * p, vFlake) * 0.68;

    float fog = 1.0 - smoothstep(6.0, 26.0, vDepth);
    vec3 col = mix(uRainColor, uSnowColor, vSnow);
    col = mix(col, uSnowColor, core * 0.85 * (1.0 - vSnow));

    float a = mix(rainA, snowA, vSnow) * uOpacity * fog;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, a);
  }
`;

/**
 * 第 4、5 章的天气。雨和雪不是两套素材，是同一批粒子在两个时间速度下的样子：
 * 水跑得快是雨，慢下来结成雪，停住就悬着。整站的规则在这里被演示出来。
 */
const Rain: React.FC = () => {
  const { theme } = useDiscrete();
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uFall: { value: 0 },
      uSnow: { value: 0 },
      uTimeScale: { value: 1 },
      uHeight: { value: HEIGHT },
      uGround: { value: GROUND_Y },
      uOpacity: { value: 0 },
      uRainColor: { value: new THREE.Color() },
      uSnowColor: { value: new THREE.Color() },
    }),
    [],
  );

  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = plane.index;
    geo.setAttribute('position', plane.attributes.position);
    geo.setAttribute('uv', plane.attributes.uv);

    const rand = mulberry32(23);
    const offset = new Float32Array(COUNT * 3);
    const speed = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);
    const flake = new Float32Array(COUNT * 4);

    for (let i = 0; i < COUNT; i += 1) {
      // 指数小于 0.5 会把点堆到中心：相机就站在中心，近处才有密度
      const r = RADIUS * Math.pow(rand(), 0.62);
      const a = rand() * Math.PI * 2;
      offset[i * 3] = Math.cos(a) * r;
      offset[i * 3 + 1] = rand() * HEIGHT;
      offset[i * 3 + 2] = Math.sin(a) * r;
      speed[i] = 5.5 + rand() * 9;
      seed[i] = rand();

      // 每片雪一组自己的形态。板状是少数，所以把 rand 平方压到低位
      flake[i * 4] = 0.58 + rand() * 0.42;
      flake[i * 4 + 1] = 0.26 + rand() * 0.3;
      flake[i * 4 + 2] = 0.16 + rand() * 0.28;
      flake[i * 4 + 3] = Math.pow(rand(), 2.2);
    }

    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offset, 3));
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speed, 1));
    geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(seed, 1));
    geo.setAttribute('aFlake', new THREE.InstancedBufferAttribute(flake, 4));
    geo.instanceCount = COUNT;
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RADIUS * 1.6);
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    uniforms.uRainColor.value.set(palette().rain);
    uniforms.uSnowColor.value.set(palette().snow);
  }, [theme, uniforms]);

  useFrame(() => {
    uniforms.uFall.value = story.fall;
    uniforms.uSnow.value = story.snow;
    uniforms.uTimeScale.value = story.timeScale;
    // 作品看完、主界面站稳之后雨才开始下；收尾时压暗，给终端让出可读性
    uniforms.uOpacity.value =
      smoothstep(0.55, 1, chapterProgress('arrival')) *
      (1 - 0.6 * smoothstep(0.1, 0.7, chapterProgress('restart')));
    story.rainVisible = uniforms.uOpacity.value;
    // 前四章根本看不到雨，两万个加性四边形不该还在烧填充率
    if (mesh.current) mesh.current.visible = uniforms.uOpacity.value > 0.002;
  });

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false} visible={false}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        // 暗色下相加发光；亮色下相加只会越加越白，必须换回常规混合
        blending={
          palette().additive ? THREE.AdditiveBlending : THREE.NormalBlending
        }
        key={theme}
      />
    </mesh>
  );
};

export default Rain;
