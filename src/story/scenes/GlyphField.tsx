import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PANELS } from '../config';
import { clamp, mulberry32, smoothstep } from '../lib/math';
import { pick } from '../lib/quality';
import { imageToCanvas, loadImage, samplePixels } from '../lib/sample';
import { useDiscrete } from '../ScrollDriver';
import { chapterProgress, palette, setDiscrete, story } from '../state';

const COUNT = pick(28000, 12000);
const TEXT_FIT = { w: 13, h: 7.3125 };
/** 作品图的取景框，比相机在 develop 章看到的范围小一圈，留出呼吸 */
const IMAGE_FIT = { w: 7.6, h: 4.6 };

const vertex = /* glsl */ `
  attribute vec3 aSeed;
  attribute float aDelay;
  attribute vec3 aColor;
  attribute vec3 aT0;
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aC0;
  attribute vec3 aC1;
  attribute vec3 aC2;

  uniform float uDisperse;
  uniform float uMorph;
  uniform float uSlide;
  uniform float uSize;
  uniform float uPixel;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uInvert;

  varying vec3 vColor;
  varying float vAlpha;

  /**
   * 暗色主题下把墨色翻亮。按比例缩放而不是取反，色相和饱和度才留得住；
   * 本来就够亮的（图版上的橙色标注）原样放行。
   */
  vec3 lift(vec3 c) {
    float l = max(max(c.r, c.g), c.b);
    if (l > 0.5) return c;
    float target = clamp(1.0 - l, 0.5, 0.95);
    return clamp(c * (target / max(l, 0.02)), 0.0, 1.0);
  }

  void main() {
    // 每个粒子按「阅读顺序的倒序」先后脱离屏幕，整段文字像被倒着抽走
    float d = smoothstep(aDelay, aDelay + 0.45, uDisperse);

    vec3 dir = normalize(aSeed - 0.5 + vec3(0.0, 0.0, 0.4));
    vec3 cloud = position + dir * vec3(9.5, 6.5, 7.0) * (0.45 + aSeed.x);
    vec3 pos = mix(position, cloud, d);

    // 三张作品之间滑动：seg 选段，sf 是段内进度
    float s = clamp(uSlide, 0.0, 2.0);
    float seg = min(floor(s), 1.0);
    float sf = smoothstep(0.0, 1.0, s - seg);
    vec3 tA = seg < 0.5 ? aT0 : aT1;
    vec3 tB = seg < 0.5 ? aT1 : aT2;
    vec3 cA = seg < 0.5 ? aC0 : aC1;
    vec3 cB = seg < 0.5 ? aC1 : aC2;
    vec3 target = mix(tA, tB, sf);
    vec3 targetColor = mix(cA, cB, sf);
    targetColor = mix(targetColor, lift(targetColor), uInvert);

    float m = smoothstep(aDelay * 0.5, aDelay * 0.5 + 0.7, uMorph);
    pos = mix(pos, target, m);
    // 途中鼓一下，免得所有粒子走直线
    pos += normalize(aSeed - 0.5) * m * (1.0 - m) * 8.0;
    pos.z += sin(uTime * 0.5 + aSeed.y * 21.0) * 0.07 * (1.0 - m);

    vColor = mix(aColor, targetColor, m);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // 点的覆盖率要接近 1×：太大就是一团加性混合出来的白墙，太小图就散了
    gl_PointSize = uSize * uPixel * mix(0.7, 1.0, m) / max(0.001, -mv.z);

    // 飞散途中稍微暗一点，聚拢成画面时才重新亮起来
    vAlpha = uOpacity * 0.85 * mix(1.0, 0.5, d * (1.0 - m));
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, r);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

interface Props {
  terminal: HTMLCanvasElement;
}

/**
 * rewind + develop 两章共用的同一批粒子。
 * 它们的起点是终端里那首诗的像素，终点是三张作品图的像素——
 * 「诗句倒流后重新聚成作品」这件事因此是字面意义上的同一批点在移动。
 */
const GlyphField: React.FC<Props> = ({ terminal }) => {
  const { theme } = useDiscrete();
  const points = useRef<THREE.Points>(null);
  const seeded = useRef(false);
  // 采样失败时别硬morph：粒子会全部收敛到原点，那比不显影更难看
  const targetsReady = useRef(false);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const rand = mulberry32(7);
    const zeros = () =>
      new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3);

    geo.setAttribute('position', zeros());
    geo.setAttribute('aColor', zeros());
    (['aT0', 'aT1', 'aT2', 'aC0', 'aC1', 'aC2'] as const).forEach((name) =>
      geo.setAttribute(name, zeros()),
    );

    const seed = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i += 1) seed[i] = rand();
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    geo.setAttribute(
      'aDelay',
      new THREE.BufferAttribute(new Float32Array(COUNT), 1),
    );
    // 粒子位置全在 shader 里算，交给 three 的包围球判断会被误剔除
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);
    return geo;
  }, []);

  const uniforms = useMemo(
    () => ({
      uDisperse: { value: 0 },
      uMorph: { value: 0 },
      uSlide: { value: 0 },
      uSize: { value: 46 },
      uPixel: { value: Math.min(2, window.devicePixelRatio) },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uInvert: { value: 0 },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  // 作品图的采样在开场终端打字期间后台完成——那段动画就是加载屏
  useEffect(() => {
    let alive = true;
    Promise.all(PANELS.map((p) => loadImage(p.image)))
      .then((imgs) => {
        if (!alive) return;
        imgs.forEach((img, i) => {
          const { positions, colors } = samplePixels(
            imageToCanvas(img),
            COUNT,
            IMAGE_FIT,
            undefined,
            11 + i,
            // 图版是线描：采墨不采纸，否则整章只会显影出一块发光的矩形
            0.62,
          );
          const pos = geometry.getAttribute(`aT${i}`) as THREE.BufferAttribute;
          const col = geometry.getAttribute(`aC${i}`) as THREE.BufferAttribute;
          pos.copyArray(positions);
          col.copyArray(colors);
          pos.needsUpdate = true;
          col.needsUpdate = true;
        });
        targetsReady.current = true;
        story.ready = true;
        setDiscrete({ ready: true });
      })
      .catch(() => {
        // 图挂了也别把整条故事线卡死，让访客照样能往下滚
        targetsReady.current = true;
        story.ready = true;
        setDiscrete({ ready: true });
      });
    return () => {
      alive = false;
    };
  }, [geometry]);

  useFrame(() => {
    // 终端打完的那一帧，把屏幕上的像素原地转成粒子的起始位置
    if (story.booted && !seeded.current) {
      seeded.current = true;
      const { positions, colors } = samplePixels(
        terminal,
        COUNT,
        TEXT_FIT,
        0.32,
      );
      const home = geometry.getAttribute('position') as THREE.BufferAttribute;
      const color = geometry.getAttribute('aColor') as THREE.BufferAttribute;
      const delay = geometry.getAttribute('aDelay') as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i += 1) {
        // 越靠上的字越晚被抽走 —— 就是打字顺序倒过来
        const yNorm = positions[i * 3 + 1] / TEXT_FIT.h + 0.5;
        const xNorm = positions[i * 3] / TEXT_FIT.w + 0.5;
        delay.setX(i, clamp(yNorm * 0.5 + (1 - xNorm) * 0.08));
      }
      home.copyArray(positions);
      color.copyArray(colors);
      home.needsUpdate = true;
      color.needsUpdate = true;
      delay.needsUpdate = true;
    }

    const rewind = chapterProgress('rewind');
    const develop = chapterProgress('develop');
    const arrival = chapterProgress('arrival');

    uniforms.uDisperse.value = rewind;
    // 显影用前六成行程聚成画面，剩下四成在三张作品之间滑过去
    // 没有目标就停在飞散状态，让这章降级成「代码散开后淡出」
    uniforms.uMorph.value = targetsReady.current
      ? smoothstep(0, 0.55, develop)
      : 0;
    uniforms.uSlide.value = smoothstep(0.5, 1, develop) * 2;
    uniforms.uTime.value = story.clock;
    uniforms.uInvert.value = palette().additive ? 1 : 0;
    // 作品看完后整片粒子沉下去，主界面才浮出来
    uniforms.uOpacity.value =
      smoothstep(0, 0.08, rewind) * (1 - smoothstep(0, 0.45, arrival));
    // 落地之后这批粒子就退场了，别再让两万八千个点走一遍顶点着色器
    if (points.current)
      points.current.visible = uniforms.uOpacity.value > 0.002;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={
          palette().additive ? THREE.AdditiveBlending : THREE.NormalBlending
        }
        key={theme}
      />
    </points>
  );
};

export default GlyphField;
