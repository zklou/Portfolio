/**
 * 三张「深度学习博物画」。
 *
 * 版式照搬十九世纪科学图版——压边框、图版号、衬线斜体标题、脚注、纸面颗粒，
 * 只是标本换成了研究对象：裂缝的扩展、注意力矩阵、残差流。裂缝的分叉本来就
 * 长得像叶脉，放进这套语言里几乎是天生的。
 *
 * 用运行时生成的 data URI 而不是静态资源：既绕开 SVG 打包管线的不确定性，
 * 也让这几张图永远和配色、文案保持同一个出处。
 */
const W = 900,
  H = 1200;
const PAPER = '#efe7d7',
  INK = '#3a2f26',
  SEPIA = '#7a6449',
  ACCENT = '#c2560c';

const rng = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};
const f = (n: number) => Number(n.toFixed(2));

/** 纸面、压边框、图版号、标题、脚注——每张图版共用的外壳 */
const frame = (
  roman: string,
  title: string,
  sub: string,
  foot: string,
  body: string,
) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.055"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
    <filter id="edge" x="-6%" y="-6%" width="112%" height="112%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <g filter="url(#edge)">
    <rect x="46" y="46" width="${W - 92}" height="${
  H - 92
}" fill="none" stroke="${INK}" stroke-width="1.6" opacity="0.5"/>
    <rect x="56" y="56" width="${W - 112}" height="${
  H - 112
}" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.32"/>
  </g>

  <text x="${
    W / 2
  }" y="132" text-anchor="middle" font-family="Georgia, serif" font-size="30"
        letter-spacing="7" fill="${INK}">PLATE ${roman}</text>
  <line x1="300" y1="152" x2="${
    W - 300
  }" y2="152" stroke="${INK}" stroke-width="0.8" opacity="0.45"/>

  ${body}

  <text x="${W / 2}" y="${
  H - 148
}" text-anchor="middle" font-family="Georgia, serif"
        font-size="34" font-style="italic" fill="${INK}">${title}</text>
  <text x="${W / 2}" y="${
  H - 116
}" text-anchor="middle" font-family="Georgia, serif"
        font-size="19" fill="${SEPIA}" letter-spacing="2">${sub}</text>
  <text x="${W / 2}" y="${
  H - 80
}" text-anchor="middle" font-family="Georgia, serif"
        font-size="15" fill="${SEPIA}" opacity="0.8" letter-spacing="1.4">${foot}</text>

  <rect width="${W}" height="${H}" filter="url(#grain)" fill="none" opacity="0.5"/>
</svg>`;

/* ── PLATE I · 裂缝扩展：分叉本来就长得像叶脉，直接按植物图版画 ───────────── */
function crackPlate() {
  const r = rng(20240816);
  const seg: string[] = [];
  const YEARS: string[] = ['2012', '2015', '2018', '2021', '2024'];
  const ROOT_X = W / 2,
    ROOT_Y = 960;

  // 递归分枝：越往末梢越细、越抖，和真实裂缝的扩展一致
  const branch = (
    x: number,
    y: number,
    ang: number,
    len: number,
    width: number,
    depth: number,
  ) => {
    if (depth > 7 || len < 8) return;
    let cx = x,
      cy = y,
      a = ang;
    const steps = 5 + Math.floor(r() * 4);
    let d = `M ${f(cx)} ${f(cy)}`;
    for (let i = 0; i < steps; i += 1) {
      a += (r() - 0.5) * 0.4;
      cx += Math.cos(a) * (len / steps);
      cy += Math.sin(a) * (len / steps);
      d += ` L ${f(cx)} ${f(cy)}`;
    }
    seg.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(
      width,
    )}"
      stroke-linecap="round" opacity="${f(0.5 + 0.45 * (1 - depth / 8))}"/>`);

    const kids = depth < 3 ? 2 : r() < 0.75 ? 2 : 1;
    for (let k = 0; k < kids; k += 1) {
      const spread = (k === 0 ? -1 : 1) * (0.3 + r() * 0.4);
      branch(
        cx,
        cy,
        a + spread,
        len * (0.62 + r() * 0.2),
        width * 0.64,
        depth + 1,
      );
    }
  };
  branch(ROOT_X, ROOT_Y, -Math.PI / 2 + 0.06, 205, 9, 0);
  const tree = seg.join('');

  // 沿主干标年份，和植物图版上的尺标是同一种语言
  const ticks = YEARS.map((yr: string, i: number) => {
    const y = ROOT_Y - 30 - i * 168;
    return `<g opacity="0.7">
      <line x1="120" y1="${y}" x2="152" y2="${y}" stroke="${SEPIA}" stroke-width="1.1"/>
      <text x="104" y="${y + 5}" text-anchor="end" font-family="Georgia, serif"
            font-size="17" fill="${SEPIA}">${yr}</text></g>`;
  }).join('');

  // 放大镜里放同一棵树的放大件——图版的标准做法，圈里不能是空的
  const CX = 664,
    CY = 372,
    R = 96,
    ZOOM = 3.4,
    SX = 470,
    SY = 560;
  const inset = `
    <defs><clipPath id="lens"><circle cx="${CX}" cy="${CY}" r="${R}"/></clipPath></defs>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="${PAPER}" opacity="0.92"/>
    <g clip-path="url(#lens)" transform="translate(${f(CX)} ${f(
    CY,
  )}) scale(${ZOOM}) translate(${f(-SX)} ${f(-SY)})">
      ${tree}
    </g>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${ACCENT}" stroke-width="1.7" opacity="0.9"/>
    <circle cx="${SX}" cy="${SY}" r="${f(
    R / ZOOM,
  )}" fill="none" stroke="${ACCENT}"
            stroke-width="1" opacity="0.7"/>
    <line x1="${f(SX + (R / ZOOM) * 0.7)}" y1="${f(SY - (R / ZOOM) * 0.7)}"
          x2="${f(CX - R * 0.72)}" y2="${f(CY + R * 0.68)}"
          stroke="${ACCENT}" stroke-width="0.9" opacity="0.6"/>
    <text x="${CX}" y="${
    CY + R + 28
  }" text-anchor="middle" font-family="Georgia, serif"
          font-size="17" fill="${ACCENT}">branching mode &#215;${ZOOM}</text>
    <text x="${CX}" y="${
    CY + R + 50
  }" text-anchor="middle" font-family="Georgia, serif"
          font-size="14" fill="${SEPIA}">0.247% positive pixels</text>`;

  return frame(
    'I',
    'Crack Propagation',
    'municipal pavement &#183; 69 sequences &#183; 2012&#8212;2024',
    'U-Net Mini + ConvLSTM &#183; 3.27M param &#183; F1 = 0.80 &#177; 0.03',
    `<line x1="140" y1="${ROOT_Y}" x2="${
      W - 140
    }" y2="${ROOT_Y}" stroke="${INK}" stroke-width="1.3" opacity="0.5"/>
     ${ticks}${tree}${inset}`,
  );
}

/* ── PLATE II · 注意力图：把矩阵当标本，一格一格拓印 ────────────────────── */
function attentionPlate() {
  const r = rng(77002);
  const N = 20,
    cell = 33,
    x0 = (W - N * cell) / 2,
    y0 = 286;
  const cells: string[] = [];
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      // 因果掩码下的真实形态：对角带 + 少数被反复回看的列
      const diag = Math.exp(-Math.pow(i - j, 2) / 7);
      // 首 token 是注意力汇，几乎每个 query 都会回看它
      const sink = j === 0 ? 0.62 : j === 3 ? 0.34 : 0;
      const v = Math.min(1, diag + sink + r() * 0.12);
      if (v < 0.05) continue;
      cells.push(`<rect x="${f(x0 + j * cell)}" y="${f(y0 + i * cell)}"
        width="${cell - 1.5}" height="${cell - 1.5}" fill="${INK}" opacity="${f(
        v * 0.8,
      )}"/>`);
    }
  }
  const axis = `
    <line x1="${f(x0)}" y1="${f(y0 - 12)}" x2="${f(x0 + N * cell)}" y2="${f(
    y0 - 12,
  )}"
          stroke="${SEPIA}" stroke-width="1"/>
    <line x1="${f(x0 - 12)}" y1="${f(y0)}" x2="${f(x0 - 12)}" y2="${f(
    y0 + N * cell,
  )}"
          stroke="${SEPIA}" stroke-width="1"/>
    <text x="${f(x0)}" y="${f(
    y0 - 26,
  )}" font-family="Georgia, serif" font-size="16"
          fill="${SEPIA}">key</text>
    <text x="${f(x0 - 22)}" y="${f(
    y0 - 26,
  )}" text-anchor="end" font-family="Georgia, serif"
          font-size="16" fill="${SEPIA}">query</text>`;
  const call = `
    <rect x="${f(x0 - 4)}" y="${f(y0 + 3 * cell - 4)}" width="${
    cell + 8
  }" height="${cell + 8}"
          fill="none" stroke="${ACCENT}" stroke-width="1.8"/>
    <line x1="${f(x0 + cell + 6)}" y1="${f(y0 + 3.5 * cell)}" x2="${f(
    x0 + 6 * cell,
  )}"
          y2="${f(
            y0 + 2 * cell,
          )}" stroke="${ACCENT}" stroke-width="1" opacity="0.7"/>
    <text x="${f(x0 + 6.3 * cell)}" y="${f(
    y0 + 2 * cell + 5,
  )}" font-family="Georgia, serif"
          font-size="17" fill="${ACCENT}">attention sink</text>`;
  return frame(
    'II',
    'Attention Rollout',
    'LLaMA · layer 26 · causal mask',
    '5,800+ contrastive pairs · bootstrap CI',
    `${axis}${cells.join('')}${call}`,
  );
}

/* ── PLATE III · 残差流：32 层画成地质剖面 ─────────────────────────────── */
function residualPlate() {
  const r = rng(31337);
  const L = 32,
    top = 270,
    bottom = 950,
    x0 = 180,
    x1 = W - 180;
  const lines: string[] = [];
  for (let i = 0; i < L; i += 1) {
    const y = top + (i / (L - 1)) * (bottom - top);
    const strong = i === 25 || i === 26 || i === 27;
    lines.push(`<line x1="${x0}" y1="${f(y)}" x2="${x1}" y2="${f(y)}"
      stroke="${strong ? ACCENT : SEPIA}" stroke-width="${strong ? 1.3 : 0.6}"
      opacity="${strong ? 0.75 : 0.34}"/>`);
    if (i % 4 === 0) {
      lines.push(`<text x="${x0 - 16}" y="${f(y + 5)}" text-anchor="end"
        font-family="Georgia, serif" font-size="14" fill="${SEPIA}" opacity="0.8">L${i}</text>`);
    }
  }
  // 信号沿层往下走，在阻抗层上被压回去
  let d = `M ${x0 + 40} ${top}`;
  for (let i = 1; i < L; i += 1) {
    const y = top + (i / (L - 1)) * (bottom - top);
    const resist = i >= 25 && i <= 27 ? -1 : 1;
    const x =
      x0 +
      40 +
      Math.sin(i * 0.55) * 90 * (i / L) +
      resist * r() * 46 +
      (i > 27 ? 150 : 0);
    d += ` L ${f(x)} ${f(y)}`;
  }
  const sig = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.6"
    stroke-linejoin="round" opacity="0.9"/>
    <path d="${d}" fill="none" stroke="${SEPIA}" stroke-width="9"
    stroke-linejoin="round" opacity="0.14"/>`;
  const note = `
    <text x="${x1 - 6}" y="${f(
    top + (26 / 31) * (bottom - top) - 12,
  )}" text-anchor="end"
          font-family="Georgia, serif" font-size="17" fill="${ACCENT}">resistance · −0.82</text>`;
  return frame(
    'III',
    'Residual Stream',
    'truthfulness circuits · 32 layers',
    'ROI pipeline · 80% less patching compute',
    `${lines.join('')}${sig}${note}`,
  );
}

const toDataUri = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;

export const PLATE_CRACK = toDataUri(crackPlate());
export const PLATE_ATTENTION = toDataUri(attentionPlate());
export const PLATE_RESIDUAL = toDataUri(residualPlate());
