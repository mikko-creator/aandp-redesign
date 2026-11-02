// data.mjs - load every content file once (main session).
//   ctx.site     src/content/site.json   A&P facts and global copy (store, hours, newsletter, reviews, ticker, gate)
//   ctx.ia       src/content/ia.json     navigation, mega menus, category bar, footer columns, redirects
//   ctx.menu     src/content/menu.json   A&P's live menu sample: categories, collections, promotions, products
//   ctx.content  src/content/pages/*.json  page copy by name: home, about, delivery, learn, faq, store, categories
//   ctx.articles src/content/articles/*.json  the 9 A&P articles by slug (verbatim bodies)
//   ctx.images   src/content/images.json  photo alts + media (video) registry written by IMAGERY ({} until it exists)
// A product whose photo is not on disk (assets/products/) gets image null, so cards fall back to a lettered tile.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './paths.mjs';

const readJson = (rel, fallback) => {
  const f = path.join(ROOT, rel);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fallback;
};
const readDir = (rel) => {
  const dir = path.join(ROOT, rel);
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) out[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  return out;
};

export function loadAll() {
  const site = readJson('src/content/site.json');
  const ia = readJson('src/content/ia.json');
  const menu = readJson('src/content/menu.json');
  const images = readJson('src/content/images.json', { photos: {}, media: {} });
  images.photos = images.photos || {};
  images.media = images.media || {};
  for (const p of Object.values(menu.products)) {
    if (p.image && !fs.existsSync(path.join(ROOT, p.image.replace(/^\//, '')))) p.image = null;
  }
  const content = readDir('src/content/pages');
  const articles = readDir('src/content/articles');
  return { site, ia, menu, images, content, articles };
}
