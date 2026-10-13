import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { render } from './render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const b = JSON.parse(await readFile(path.join(root, 'content/business.json'), 'utf8'));
const publish = process.argv.includes('--publish');
// Validate before touching a previously generated preview.
const html = render(await readFile(path.join(root, 'src/index.html'), 'utf8'), b, publish);
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });
await Promise.all([
  writeFile(path.join(dist, 'index.html'), html),
  copyFile(path.join(root, 'src/styles.css'), path.join(dist, 'styles.css')),
  copyFile(path.join(root, 'src/app.js'), path.join(dist, 'app.js')),
  copyFile(path.join(root, 'src/assets/favicon.svg'), path.join(dist, 'assets/favicon.svg')),
  ...[800, 1600, 2000].map(width => sharp(path.join(root, 'src/assets/property-original.png')).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(path.join(dist, `assets/property-${width}.webp`))),
  writeFile(path.join(dist, 'robots.txt'), publish ? `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', b.siteUrl).href}\n` : 'User-agent: *\nDisallow: /\n'),
]);
if (publish) await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${b.siteUrl}</loc></url></urlset>`);
console.log(`Built ${publish ? 'publication' : 'unindexed preview'} in ${dist}`);
