#!/usr/bin/env node
/**
 * Generates all required brand raster assets from the canonical SVG
 * logo. Outputs:
 *
 *   assets/icons/icon.png               (1024x1024, iOS)
 *   assets/icons/adaptive-icon.png      (1024x1024, Android foreground)
 *   assets/icons/favicon.png            (48x48, web)
 *   assets/splash/splash.png            (1284x2778, universal)
 *   assets/splash/splash-android.png    (1080x1920, Android 12+)
 *   assets/store/feature-graphic.png    (1024x500, Play feature graphic)
 *
 * Dependency: `sharp` (added as an optional dev dep). Install once:
 *
 *   yarn add -D sharp
 *
 * Then run: `node scripts/generate-brand-assets.mjs`
 *
 * The script is intentionally dependency-light so CI can regenerate
 * assets without a full design tool round-trip.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const OBSIDIAN = '#0B0B0C';
const BONE = '#F4F1EA';

function markSvg({ size, bg = OBSIDIAN, fg = BONE, scale = 1, wordmark = true }) {
  const cx = size / 2;
  const cy = size / 2;
  const w = 260 * scale * (size / 1024);
  const h = 100 * scale * (size / 1024);
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g transform="translate(${x},${y}) scale(${w / 260})">
    <path d="M12 14 L12 78" stroke="${fg}" stroke-width="3"/>
    <path d="M46 14 L46 78" stroke="${fg}" stroke-width="3"/>
    <path d="M12 46 L46 46" stroke="${fg}" stroke-width="3"/>
    ${wordmark ? `<text x="72" y="54" fill="${fg}" font-family="serif" font-size="28" letter-spacing="2">HUMN SPRT</text>` : ''}
    <path d="M12 92 L248 92" stroke="${fg}" stroke-width="0.8" opacity="0.6"/>
  </g>
</svg>`;
}

function splashSvg({ w, h, bg = OBSIDIAN, fg = BONE }) {
  const mw = 520;
  const mh = 200;
  const x = (w - mw) / 2;
  const y = (h - mh) / 2;
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <g transform="translate(${x},${y}) scale(2)">
    <path d="M12 14 L12 78" stroke="${fg}" stroke-width="3"/>
    <path d="M46 14 L46 78" stroke="${fg}" stroke-width="3"/>
    <path d="M12 46 L46 46" stroke="${fg}" stroke-width="3"/>
    <text x="72" y="54" fill="${fg}" font-family="serif" font-size="28" letter-spacing="2">HUMN SPRT</text>
    <path d="M12 92 L248 92" stroke="${fg}" stroke-width="0.8" opacity="0.6"/>
  </g>
</svg>`;
}

async function tryLoadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    console.warn(
      '[brand] sharp not installed; writing SVG sources only. Run `yarn add -D sharp` then rerun.',
    );
    return null;
  }
}

async function write(path, contents) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents);
}

async function emit(name, svg, outputs) {
  const sharp = await tryLoadSharp();
  const svgPath = resolve(root, `assets/_sources/${name}.svg`);
  await write(svgPath, svg);
  if (!sharp) return;
  for (const { path, width, height } of outputs) {
    const out = resolve(root, path);
    await mkdir(dirname(out), { recursive: true });
    await sharp(Buffer.from(svg)).resize(width, height).png().toFile(out);
    console.log(`[brand] wrote ${path}`);
  }
}

async function main() {
  // App icon (square, full-bleed, centred mark with wordmark below).
  await emit('icon', markSvg({ size: 1024 }), [
    { path: 'assets/icons/icon.png', width: 1024, height: 1024 },
    { path: 'assets/icons/favicon.png', width: 48, height: 48 },
  ]);

  // Adaptive icon foreground — needs wider safe area.
  await emit(
    'adaptive-icon',
    markSvg({ size: 1024, scale: 0.66, wordmark: false }),
    [{ path: 'assets/icons/adaptive-icon.png', width: 1024, height: 1024 }],
  );

  // Splash screens.
  await emit(
    'splash',
    splashSvg({ w: 1284, h: 2778 }),
    [{ path: 'assets/splash/splash.png', width: 1284, height: 2778 }],
  );
  await emit(
    'splash-android',
    splashSvg({ w: 1080, h: 1920 }),
    [{ path: 'assets/splash/splash-android.png', width: 1080, height: 1920 }],
  );

  // Play feature graphic.
  await emit(
    'feature-graphic',
    splashSvg({ w: 1024, h: 500 }),
    [{ path: 'assets/store/feature-graphic.png', width: 1024, height: 500 }],
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
