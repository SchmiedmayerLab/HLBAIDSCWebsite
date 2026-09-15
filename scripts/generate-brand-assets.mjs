// SPDX-FileCopyrightText: 2026 SchmiedmayerLab contributors
// SPDX-License-Identifier: MIT

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { siteConfig } from '../site.config.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(root, 'public', 'brand');
const svgOnly = process.argv.includes('--svg-only');
const sansFont = (
  await readFile(
    join(
      root,
      'node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2',
    ),
  )
).toString('base64');
const serifFont = (
  await readFile(
    join(
      root,
      'node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2',
    ),
  )
).toString('base64');
const stanfordMedicineSource = await readFile(
  join(outputDirectory, 'stanford-medicine-center-lockup.svg'),
  'utf8',
);
const stanfordMedicineWhiteSource = await readFile(
  join(outputDirectory, 'stanford-medicine-center-lockup-white.svg'),
  'utf8',
);
const stanfordMedicineBody = stanfordMedicineSource.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1];
const stanfordMedicineWhiteBody = stanfordMedicineWhiteSource.match(
  /<svg[^>]*>([\s\S]*?)<\/svg>/,
)?.[1];

if (!stanfordMedicineBody || !stanfordMedicineWhiteBody)
  throw new Error('Unable to read the Stanford Medicine SVG artwork.');

const colors = {
  cardinal: '#8c1515',
  cardinalBright: '#b83a4b',
  gold: '#e3c887',
  ink: '#2e2d29',
  muted: '#6f6a62',
  line: '#d5d0c0',
  paper: '#f8f6f2',
  teal: '#176d78',
  white: '#ffffff',
};

const title = siteConfig.name;
const tagline = siteConfig.tagline;
const fontStyles = `<style>
  @font-face {
    font-family: 'Source Sans 3';
    src: url(data:font/woff2;base64,${sansFont}) format('woff2');
    font-style: normal;
    font-weight: 200 900;
  }
  @font-face {
    font-family: 'Source Serif 4';
    src: url(data:font/woff2;base64,${serifFont}) format('woff2');
    font-style: normal;
    font-weight: 200 900;
  }
  .sans { font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif; }
  .serif { font-family: 'Source Serif 4', Georgia, serif; }
</style>`;

const officialLogo = ({ x, y, width, white = false }) =>
  `<svg x="${x}" y="${y}" width="${width}" height="${(width * 44) / 152}" viewBox="18 18 152 44" overflow="hidden">${white ? stanfordMedicineWhiteBody : stanfordMedicineBody}</svg>`;

const officialShield = ({ x, y, width, white = false }) =>
  `<svg x="${x}" y="${y}" width="${width}" height="${(width * 44) / 36}" viewBox="18 18 36 44" overflow="hidden">${white ? stanfordMedicineWhiteBody : stanfordMedicineBody}</svg>`;

const centerName = ({ x, y, color, size, weight = 650, lineGap = size * 1.08, anchor = 'start' }) =>
  `<text class="sans" x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">
    <tspan x="${x}" y="${y}">Heart, Lung, and Blood</tspan>
    <tspan x="${x}" y="${y + lineGap}">AI Data Science Center</tspan>
  </text>`;

const svgDocument = ({ width, height, body, background = '', description = tagline }) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<!-- Stanford Medicine artwork copyright Stanford University. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">${description}</desc>
  ${fontStyles}
  ${background ? `${background}\n  ` : ''}${body}
</svg>
`;

const avatar = ({ size, dark = false }) => {
  const scale = size / 1024;
  const background = dark ? colors.ink : colors.paper;
  const halo = dark ? colors.cardinalBright : colors.gold;
  return svgDocument({
    width: size,
    height: size,
    background: `<defs><radialGradient id="halo" cx="82%" cy="14%" r="82%"><stop offset="0" stop-color="${halo}" stop-opacity=".34"/><stop offset="1" stop-color="${background}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${size}" height="${size}" fill="${background}"/>
      <rect width="${size}" height="${size}" fill="url(#halo)"/>`,
    body: `<g transform="scale(${scale})">
        ${officialShield({ x: 232, y: 170, width: 560, white: dark })}
      </g>`,
    description: `${title} shield-only square profile image for small display sizes`,
  });
};

const icon = ({ size, background = colors.white }) => `<?xml version="1.0" encoding="UTF-8"?>
<!-- Stanford Medicine artwork copyright Stanford University. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">${title} icon</desc>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${background}"/>
  ${officialShield({ x: size * 0.255, y: size * 0.12, width: size * 0.49 })}
</svg>
`;

const lockup = ({ dark = false }) =>
  svgDocument({
    width: 586,
    height: 120,
    body: [
      officialLogo({ x: 22, y: 24, width: 230, white: dark }),
      centerName({
        x: 289,
        y: 50,
        color: dark ? colors.white : colors.ink,
        size: 27,
        weight: 650,
        lineGap: 31,
      }),
    ]
      .filter(Boolean)
      .join('\n      '),
    description: `${title}${dark ? ' dark-background' : ''} lockup`,
  });

const faviconSvg = icon({ size: 64 });
const svgAssets = [
  { path: join(outputDirectory, 'mark.svg'), svg: icon({ size: 80 }) },
  {
    path: join(outputDirectory, 'mark-light.svg'),
    svg: icon({ size: 80, background: colors.paper }),
  },
  { path: join(outputDirectory, 'lockup.svg'), svg: lockup({ dark: false }) },
  { path: join(outputDirectory, 'lockup-dark.svg'), svg: lockup({ dark: true }) },
  { path: join(root, 'public', 'favicon.svg'), svg: faviconSvg },
];

const assets = [
  {
    name: 'avatar-light',
    width: 1024,
    height: 1024,
    svg: avatar({ size: 1024 }),
  },
  {
    name: 'avatar-dark',
    width: 1024,
    height: 1024,
    svg: avatar({ size: 1024, dark: true }),
  },
  {
    name: 'avatar-512',
    width: 512,
    height: 512,
    svg: avatar({ size: 512 }),
    svgOutput: false,
  },
  {
    name: 'mark-1024',
    width: 1024,
    height: 1024,
    svg: icon({ size: 1024 }),
    svgOutput: false,
  },
  {
    name: 'social-preview',
    width: 1200,
    height: 630,
    svg: svgDocument({
      width: 1200,
      height: 630,
      background: `<defs>
          <radialGradient id="warm" cx="6%" cy="92%" r="86%"><stop offset="0" stop-color="${colors.cardinal}" stop-opacity=".2"/><stop offset="1" stop-color="${colors.paper}" stop-opacity="0"/></radialGradient>
          <radialGradient id="cool" cx="96%" cy="4%" r="72%"><stop offset="0" stop-color="${colors.teal}" stop-opacity=".22"/><stop offset="1" stop-color="${colors.paper}" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="1200" height="630" fill="${colors.paper}"/>
        <rect width="1200" height="630" fill="url(#warm)"/>
        <rect width="1200" height="630" fill="url(#cool)"/>`,
      body: `${officialLogo({ x: 70, y: 52, width: 250 })}
        ${centerName({ x: 352, y: 88, color: colors.ink, size: 29, weight: 650, lineGap: 33 })}
        <text class="serif" x="70" y="305" fill="${colors.ink}" font-size="70" font-weight="720">Agentic AI for</text>
        <text class="serif" x="70" y="382" fill="${colors.ink}" font-size="70" font-weight="720">biomedical discovery.</text>
        <text class="sans" x="74" y="466" fill="${colors.muted}" font-size="29" font-weight="540">Safe, reproducible AI systems for NHLBI-supported research.</text>
        <path d="M74 520h610" stroke="${colors.cardinal}" stroke-width="6" stroke-linecap="round"/>`,
    }),
  },
  {
    name: 'bluesky-banner',
    width: 1500,
    height: 500,
    svg: svgDocument({
      width: 1500,
      height: 500,
      background: `<defs><radialGradient id="glow" cx="88%" cy="5%" r="92%"><stop offset="0" stop-color="${colors.teal}" stop-opacity=".48"/><stop offset=".55" stop-color="${colors.cardinalBright}" stop-opacity=".2"/><stop offset="1" stop-color="${colors.ink}" stop-opacity="0"/></radialGradient></defs>
        <rect width="1500" height="500" fill="${colors.ink}"/>
        <rect width="1500" height="500" fill="url(#glow)"/>`,
      body: `${officialLogo({ x: 205, y: 133, width: 330, white: true })}
        ${centerName({ x: 585, y: 168, color: colors.white, size: 56, weight: 670, lineGap: 62 })}
        <text class="sans" x="590" y="318" fill="${colors.gold}" font-size="31" font-weight="650">${tagline}</text>
        <text class="sans" x="590" y="368" fill="${colors.line}" font-size="22" font-weight="620">Safe, reproducible AI systems for NHLBI-supported research.</text>`,
      description: `${title} Bluesky profile banner`,
    }),
  },
  {
    name: 'linkedin-cover',
    width: 1128,
    height: 191,
    svg: svgDocument({
      width: 1128,
      height: 191,
      background: `<defs><linearGradient id="cover" x1="0" x2="1"><stop offset="0" stop-color="${colors.ink}"/><stop offset=".72" stop-color="#383630"/><stop offset="1" stop-color="${colors.cardinal}"/></linearGradient></defs>
        <rect width="1128" height="191" fill="url(#cover)"/>`,
      body: `${officialLogo({ x: 318, y: 62, width: 235, white: true })}
        ${centerName({ x: 585, y: 62, color: colors.white, size: 31, weight: 680, lineGap: 36 })}
        <text class="sans" x="588" y="143" fill="${colors.gold}" font-size="21" font-weight="620">${tagline}</text>`,
      description: `${title} LinkedIn cover image`,
    }),
  },
];

const browserIcons = [
  { name: 'favicon-32x32', width: 32, height: 32 },
  { name: 'apple-touch-icon', width: 180, height: 180 },
];

await mkdir(outputDirectory, { recursive: true });
for (const asset of svgAssets) {
  await writeFile(asset.path, asset.svg, 'utf8');
}
for (const asset of assets) {
  if (asset.svgOutput !== false)
    await writeFile(join(outputDirectory, `${asset.name}.svg`), asset.svg, 'utf8');
}

if (!svgOnly) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const asset of assets) {
      const page = await browser.newPage({
        viewport: { width: asset.width, height: asset.height },
        deviceScaleFactor: 1,
      });
      await page.goto(`data:image/svg+xml;base64,${Buffer.from(asset.svg).toString('base64')}`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: join(outputDirectory, `${asset.name}.png`),
        omitBackground: false,
      });
      await page.close();
    }
    for (const browserIcon of browserIcons) {
      const page = await browser.newPage({
        viewport: { width: browserIcon.width, height: browserIcon.height },
        deviceScaleFactor: 1,
      });
      const browserIconSvg = icon({ size: browserIcon.width });
      await page.goto(
        `data:image/svg+xml;base64,${Buffer.from(browserIconSvg).toString('base64')}`,
      );
      await page.screenshot({
        path: join(root, 'public', `${browserIcon.name}.png`),
        omitBackground: false,
      });
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

process.stdout.write(
  `Generated ${svgAssets.length + assets.filter((asset) => asset.svgOutput !== false).length} SVG${svgOnly ? '' : `, ${assets.length} PNG, and ${browserIcons.length} browser icon`} center brand assets in public.\n`,
);
