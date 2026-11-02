// pages.mjs - PAGES lane (p- prefix): /store/kew-gardens-ny/, /locations/, /delivery/, /about/, /faq/, /reviews/,
// /contact/, /drops/, /learn/ and the 9 /learn/<slug>/ articles. Every fact and sentence is A&P's own (site.json,
// pages/*.json, articles/*.json, menu.json); new words are neutral glue only (section labels, buttons, alt text).
// The look (glass, case, bands, buttons, kicker, faq, review, demo form, motion hooks) is FOUNDATION's component
// contract; pages.css only lays the pages out. Pseudo-elements of .band/.glass/.case/.btn/.kicker are never used here.
import { page, crumbsHtml, icon } from './shell.mjs';
import { esc, escA, attrs, linkAttrs, photo, gimg, media, demoForm, absUrl } from './util.mjs';

// ---------------------------------------------------------------- head + page
function out(ctx, { path, name, description, crumbs, main, mod, jsonld = [], image = 'storefront.webp' }) {
  const title = `${name} | ${ctx.site.name}`;
  const url = absUrl(ctx, path);
  return {
    path,
    html: page({
      ctx, path, title, description, canonical: url,
      og: { 'og:title': title, 'og:description': description, 'og:url': url, 'og:type': mod === 'article' ? 'article' : 'website', 'og:site_name': ctx.site.name, 'og:image': ctx.site.origin + '/assets/photos/' + image },
      jsonld, bodyClass: `p-page p-page--${mod}`, main, crumbs, heroCrumbs: true,
    }),
  };
}

// ---------------------------------------------------------------- pieces
const btn = (h, label, cls = 'btn--leaf', ico = '') => `<a class="btn ${cls}"${linkAttrs(h)}>${ico ? icon(ico) : ''}<span>${esc(label)}</span></a>`;
const arrow = (h, label, cls = '') => `<a class="link-arrow ${cls}"${linkAttrs(h)}>${esc(label)}${icon('arrow')}</a>`;
const kicker = (t, cls = '') => (t ? `<p class="kicker${cls ? ' ' + cls : ''}">${esc(t)}</p>` : '');
const reveal = (i) => ` data-reveal style="--i:${i}"`;
// two-line display titles from the JSON arrays; the second line carries the one accent
const lines = (arr, accent = 'accent') => arr.map((l, i) => `<span class="p-line${i === arr.length - 1 && arr.length > 1 && accent ? ' ' + accent : ''}">${esc(l)}</span>`).join(' ');
const paras = (arr) => (Array.isArray(arr) ? arr : [arr]).map((t) => `<p>${esc(t)}</p>`).join('');

// A&P's own black-framed glass display case (.case, FOUNDATION) holding a photo or a film
function caseBox(inner, { cls = '', tall = false, wide = false, attrsObj = {} } = {}) {
  const c = ['case', tall ? 'case--tall' : '', wide ? 'case--wide' : '', cls].filter(Boolean).join(' ');
  return `<figure${attrs({ class: c, ...attrsObj })}><div class="case__media">${inner}</div><span class="case__glass" aria-hidden="true"></span><span class="case__light" aria-hidden="true"></span></figure>`;
}

// the page hero: dark ground, one key light (data-spot), the backdrop on the lit side behind a local scrim; crumbs,
// kicker, H1, lede and buttons sit straight on the ground (no glass box behind hero text, D10). `aside` = an optional
// case or cut-out on the right (the protruding one crosses the lower seam; the next band gets extra top padding).
function hero(ctx, { crumbs, kick, title, lede = '', ctas = [], bg = '', mod = '', aside = '', extra = '', titleCls = '' }) {
  return `<section class="band band--void p-hero ${mod}" data-spot>
<div class="band__clip p-hero__clip" aria-hidden="true">
${bg ? `<div class="band__bg p-hero__bg">${bg}</div>` : ''}<span class="p-hero__pool"></span><span class="p-hero__leaf"></span><span class="p-hero__scrim"></span><span class="grain"></span>
</div>
<div class="wrap p-hero__inner">
<div class="p-hero__text">
<div class="p-hero__crumbs">${crumbsHtml(crumbs)}</div>
${kicker(kick, 'p-hero__kicker')}
<h1 class="display p-hero__title ${titleCls}">${title}</h1>
${lede ? `<p class="lede p-hero__lede">${lede}</p>` : ''}
${extra}
${ctas.length ? `<div class="btn-row p-hero__ctas">${ctas.join('')}</div>` : ''}
</div>
${aside}
</div>
</section>`;
}

function band(inner, { tone = 'void', mod = '', id = '', label = '', clip = '' } = {}) {
  return `<section${attrs({ class: `band band--${tone} p-band ${mod}`.trim(), id: id || null, 'aria-labelledby': label || null })}>
<div class="band__clip" aria-hidden="true">${clip}<span class="grain"></span></div>
${inner}
</section>`;
}
const pool = (cls = '') => `<span class="p-pool ${cls}"></span>`;
const head = (id, kick, title, intro = '', cls = '') => `<header class="p-head ${cls}" data-reveal>${kicker(kick)}<h2 class="display p-head__title" id="${escA(id)}">${title}</h2>${intro ? `<p class="p-head__intro">${intro}</p>` : ''}</header>`;

// store facts, A&P's words (site.json)
function infoList(ctx, { directions = true, cls = '' } = {}) {
  const s = ctx.site.store;
  return `<ul class="p-info ${cls}" role="list">
<li>${icon('pin', 'p-info__ico')}<span><span class="p-info__label">Address</span><span class="p-info__val">${esc(s.address)}</span></span></li>
<li>${icon('clock', 'p-info__ico')}<span><span class="p-info__label">Hours</span><span class="p-info__val">${esc(s.hours)}</span></span></li>
<li>${icon('phone', 'p-info__ico')}<span><span class="p-info__label">Phone</span><a class="p-info__val p-info__link"${linkAttrs('tel:' + s.tel)}>${esc(s.phone)}</a></span></li>
${directions ? `<li>${icon('ext', 'p-info__ico')}<span><span class="p-info__label">Directions</span><a class="p-info__val p-info__link"${linkAttrs(s.directions.href)}>${esc(s.directions.label)}</a></span></li>` : ''}
</ul>`;
}

// Google reviews as A&P shows them (no stars, no ratings: none are in the source)
function reviewCard(r, i, cls = '') {
  return `<figure class="review glass glass--lit p-review ${cls}"${reveal(i % 4)}>
<blockquote class="p-review__text"><p>${esc(r.text)}</p></blockquote>
<figcaption class="p-review__by"><span class="p-review__name">${esc(r.name)}</span><span class="p-review__src">${esc(r.source)}</span></figcaption>
</figure>`;
}

// ---------------------------------------------------------------- article art (A&P images; one generated still)
const ART = {
  'beginners-guide': { file: 'guide-beginners.svg', icon: true },
  'understanding-cannabinoids': { file: 'guide-cannabinoids.svg', icon: true },
  'terpene-profile': { file: 'guide-terpenes.svg', icon: true },
  'benefits-of-cbd-oil': { file: 'article-cbd-oil.png' },
  'cbd-for-stress-relief': { file: 'article-cbd-stress.png' },
  'indica-sativa-hybrid': { file: 'article-strains.png' },
  'first-time-visiting': { file: 'interior.webp' },
  'how-to-store-cannabis': { file: 'bud.webp' },
  'thc-vs-cbd': { gen: 'g-bud-macro' },
};
function artImg(ctx, slug, sizes = '(min-width: 1024px) 380px, 92vw') {
  const a = ART[slug] || {};
  if (a.gen) return gimg(a.gen, { alt: '', sizes, cls: 'p-post__img' });
  if (a.icon) return photo(ctx, a.file, { alt: '', cls: 'p-post__icon' });
  return photo(ctx, a.file || 'herbs.webp', { alt: '', sizes, cls: 'p-post__img' });
}
const articleList = (ctx) => (ctx.content.learn.articles || Object.keys(ctx.articles)).map((s) => ctx.articles[s]).filter(Boolean);
function postCard(ctx, a, i, { h = 'h3' } = {}) {
  const icn = ART[a.slug] && ART[a.slug].icon;
  return `<article class="p-post glass glass--lift${icn ? ' p-post--icon' : ''}"${reveal(i % 3)}>
<a class="p-post__link"${linkAttrs(a.path)}>
<span class="p-post__media" aria-hidden="true">${artImg(ctx, a.slug)}</span>
<span class="p-post__body"><${h} class="p-post__title">${esc(a.title)}</${h}><span class="p-post__excerpt">${esc(a.excerpt)}</span><span class="link-arrow p-post__more">Read More${icon('arrow')}</span></span>
</a>
</article>`;
}

// ---------------------------------------------------------------- /store/kew-gardens-ny/
function storeJsonLd(ctx) {
  const s = ctx.site.store;
  return {
    '@context': 'https://schema.org', '@type': 'Store', name: ctx.site.name,
    address: { '@type': 'PostalAddress', streetAddress: s.street, addressLocality: s.locality, addressRegion: s.region, postalCode: s.postalCode, addressCountry: s.country },
    telephone: s.phone, url: absUrl(ctx, '/store/' + s.slug + '/'), openingHours: 'Mo-Su 12:00-22:00',
    image: ctx.site.origin + '/assets/photos/storefront.webp', hasMap: s.directions.href,
  };
}
function stepInside(ctx, c, id) {
  const films = [1, 2, 3, 4, 5, 6].map((n, i) => caseBox(media(ctx, 'inside-' + n, { cls: 'p-film__video' }), { tall: true, cls: 'p-film', attrsObj: { 'data-reveal': true, style: `--i:${i}` } })).join('');
  return band(`<div class="wrap wrap--wide">
${head(id, ctx.site.kicker, esc(c.title), esc(c.text), 'p-head--center')}
<div class="p-films" role="list" aria-label="${escA(c.title)}">${films.replace(/<figure /g, '<figure role="listitem" ')}</div>
</div>`, { tone: 'void', mod: 'p-band--inside', label: id, clip: pool('p-pool--center') + '<span class="p-leaf"></span>' });
}
function mapBlock(ctx, id) {
  const s = ctx.site.store;
  return band(`<div class="wrap p-visit">
<div class="p-visit__info" data-reveal>
${kicker(ctx.site.kicker)}
<h2 class="display p-head__title" id="${id}">Visit A&amp;P</h2>
<p class="p-visit__blurb">${esc(s.blurb)}</p>
${infoList(ctx, { directions: false })}
<div class="btn-row">${btn(s.directions.href, s.directions.label, 'btn--leaf', 'pin')}${btn('tel:' + s.tel, s.phoneShort, 'btn--glass', 'phone')}</div>
</div>
<div class="p-map case case--wide" data-reveal style="--i:1"><div class="case__media"><iframe class="p-map__frame" src="${escA(s.mapEmbed)}" title="Map: ${escA(ctx.site.name)}, ${escA(s.street)}, ${escA(s.locality)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><span class="case__light" aria-hidden="true"></span></div>
</div>`, { tone: 'lit', mod: 'p-band--visit', label: id, clip: pool('p-pool--left') });
}

function store(ctx) {
  const c = ctx.content.store;
  const s = ctx.site.store;
  const path = '/store/' + s.slug + '/';
  const promos = ctx.menu.promotions;
  const crumbs = [['/', 'Home'], ['/locations/', 'Find Us'], [path, s.name]];
  const main = `${hero(ctx, {
    crumbs, kick: c.kicker, mod: 'p-hero--store',
    title: `A&amp;P Dispensary, <span class="p-line accent">Kew Gardens</span>`,
    bg: media(ctx, 'store-room', { eager: true, cls: 'p-hero__film' }),
    extra: `<ul class="p-hero__facts" role="list"><li>${icon('pin')}<span>${esc(s.street)}, ${esc(s.locality)}, ${esc(s.region)} ${esc(s.postalCode)}</span></li><li>${icon('clock')}<span>${esc(s.hours)}</span></li></ul>`,
    ctas: [btn('/shop/', 'Shop', 'btn--leaf', 'bag'), btn('tel:' + s.tel, s.phoneShort, 'btn--glass', 'phone'), btn(s.directions.href, s.directions.label, 'btn--ghost', 'pin')],
  })}
${band(`<div class="wrap">
<div class="p-head p-head--row" data-reveal><div>${kicker('Deals at this store')}<h2 class="display p-head__title" id="p-savings">Savings at this store</h2></div>${arrow('/deals/', 'View all deals')}</div>
<ul class="p-promos" role="list">${promos.map((p, i) => `<li><a class="glass glass--gold glass--lift p-promo"${linkAttrs('/deals/')}${reveal(i % 6)}><span class="p-promo__name">${esc(p.name)}</span><span class="p-promo__desc">${esc(p.description)}</span>${icon('arrow', 'p-promo__ico')}</a></li>`).join('')}</ul>
<p class="p-note">${esc(ctx.menu.note)}</p>
</div>`, { tone: 'void', mod: 'p-band--savings', label: 'p-savings', clip: pool('p-pool--right') })}
${band(`<div class="wrap p-split">
<div class="p-split__text" data-reveal>${kicker(c.kicker)}<h2 class="display p-head__title" id="p-about">${esc(c.about.title)}</h2><div class="p-copy">${paras(c.about.text)}</div>${btn('/about/', 'About Us', 'btn--glass')}</div>
<div class="p-split__media" data-reveal style="--i:1">${caseBox(photo(ctx, 'interior.webp', { alt: 'Inside A&P Dispensary: black glass display cases along a brick wall', sizes: '(min-width: 1024px) 520px, 92vw', cls: 'p-case__img' }), { wide: true, cls: 'p-case' })}</div>
</div>`, { tone: 'lit', mod: 'p-band--about', label: 'p-about', clip: pool('p-pool--left') })}
${band(`<div class="wrap">
${head('p-how', 'Your visit', esc(c.how.title))}
<ol class="p-steps" role="list">${c.how.steps.map((st, i) => `<li class="glass glass--lit glass--lift p-step"${reveal(i)}><span class="p-step__num">${String(i + 1).padStart(2, '0')}</span><h3 class="p-step__title">${esc(st.title)}</h3><p class="p-step__text">${esc(st.text)}</p></li>`).join('')}</ol>
<div class="p-bring glass glass--leaf" data-reveal>${icon('id', 'p-bring__ico')}<div><h3 class="p-bring__title" id="p-bring">${esc(c.bring.title)}</h3><p class="p-bring__text">${esc(c.bring.text)}</p></div>${arrow(c.how.src, 'First visit guide')}</div>
</div>`, { tone: 'void', mod: 'p-band--how', label: 'p-how', clip: pool('p-pool--right') })}
${stepInside(ctx, c.inside, 'p-inside')}
${band(`<div class="wrap wrap--wide">
<div class="p-head p-head--row" data-reveal><div>${kicker(ctx.site.reviews.kicker)}<h2 class="display p-head__title p-head__title--md" id="p-reviews">${esc(ctx.site.reviews.title)}</h2></div></div>
<div class="p-rrow" role="list">${ctx.site.reviews.items.map((r, i) => `<div role="listitem" class="p-rrow__item">${reviewCard(r, i)}</div>`).join('')}</div>
<div class="p-howd glass glass--gold" data-reveal><h3 class="p-howd__title">${esc(c.review.title)}</h3><p class="p-note p-howd__note">${esc(ctx.site.reviews.note)}</p>${btn(c.review.cta.href, c.review.cta.label, 'btn--gold', 'star')}</div>
</div>`, { tone: 'void', mod: 'p-band--reviews', label: 'p-reviews', clip: pool('p-pool--center') })}
${mapBlock(ctx, 'p-visit')}`;
  return out(ctx, { path, name: s.name, description: c.description, crumbs, main, mod: 'store', jsonld: [storeJsonLd(ctx)] });
}

// ---------------------------------------------------------------- /locations/
function locations(ctx) {
  const s = ctx.site.store;
  const d = ctx.content.delivery;
  const crumbs = [['/', 'Home'], ['/locations/', 'Find Us']];
  const main = `${hero(ctx, {
    crumbs, kick: ctx.site.kicker, mod: 'p-hero--compact',
    title: `Find <span class="accent">Us</span>`,
    lede: esc(s.blurb),
    bg: gimg('g-smoke-glass', { alt: '', eager: true, sizes: '(min-width: 1024px) 70vw, 100vw', cls: 'screen p-hero__img' }),
  })}
${band(`<div class="wrap p-locs">
<article class="glass glass--lit p-loc" data-reveal aria-labelledby="p-loc-store">
<div class="p-loc__media">${caseBox(photo(ctx, 'storefront.webp', { alt: 'The A&P Dispensary shop front on Lefferts Blvd: black awning and the green and white A&P DISPENSARY sign', sizes: '(min-width: 1024px) 300px, 80vw', cls: 'p-case__img' }), { tall: true, cls: 'p-case' })}</div>
<div class="p-loc__body">
${kicker(s.name)}
<h2 class="display p-loc__title" id="p-loc-store">${esc(ctx.content.store.h1)}</h2>
${infoList(ctx)}
<div class="btn-row">${btn('/store/' + s.slug + '/', 'Store details', 'btn--leaf')}${btn('tel:' + s.tel, s.phoneShort, 'btn--glass', 'phone')}</div>
</div>
</article>
<article class="glass glass--leaf p-loc p-loc--delivery" data-reveal style="--i:1" aria-labelledby="p-loc-delivery">
<div class="p-loc__media p-loc__media--wide">${caseBox(photo(ctx, 'van.webp', { alt: 'The A&P Dispensary delivery van wrap', sizes: '(min-width: 1024px) 420px, 92vw', cls: 'p-case__img' }), { wide: true, cls: 'p-case' })}</div>
<div class="p-loc__body">
${kicker(d.hero.kicker)}
<h2 class="display p-loc__title" id="p-loc-delivery">Delivery</h2>
<p class="p-loc__text">${esc(d.hero.text)}</p>
<div class="btn-row">${btn('/delivery/', 'Delivery', 'btn--glass', 'truck')}</div>
</div>
</article>
</div>`, { tone: 'void', mod: 'p-band--locs', clip: pool('p-pool--left') })}`;
  return out(ctx, { path: '/locations/', name: 'Find Us', description: `${s.address}. ${s.hours}.`, crumbs, main, mod: 'locations' });
}

// ---------------------------------------------------------------- /delivery/
const STEP_PHOTO = ['web-mockup.webp', 'bud.webp', 'van.webp'];
const STEP_ALT = ['The A&P Dispensary website shown on a laptop, tablet and phone', 'A cannabis bud', 'The A&P Dispensary delivery van wrap'];
function visitBlock(ctx, id) {
  const s = ctx.site.store;
  return band(`<div class="wrap p-split">
<div class="p-split__text" data-reveal>${kicker(ctx.site.kicker)}<h2 class="display p-head__title" id="${id}">Visit A&amp;P</h2><p class="p-copy">${esc(s.blurb)}</p>${infoList(ctx, { directions: false })}<div class="btn-row">${btn(s.directions.href, s.directions.label, 'btn--leaf', 'pin')}${btn('/store/' + s.slug + '/', 'Store details', 'btn--glass')}</div></div>
<div class="p-split__media" data-reveal style="--i:1">${caseBox(photo(ctx, 'storefront.webp', { alt: 'The A&P Dispensary shop front on Lefferts Blvd', sizes: '(min-width: 1024px) 380px, 80vw', cls: 'p-case__img' }), { tall: true, cls: 'p-case p-case--portrait' })}</div>
</div>`, { tone: 'lit', mod: 'p-band--visit', label: id, clip: pool('p-pool--right') });
}
function delivery(ctx) {
  const c = ctx.content.delivery;
  const crumbs = [['/', 'Home'], ['/delivery/', 'Delivery']];
  const main = `${hero(ctx, {
    crumbs, kick: c.hero.kicker, mod: 'p-hero--cut', titleCls: 'p-hero__title--fit',
    title: lines(c.hero.title, 'accent--gold'), lede: esc(c.hero.text),
    ctas: c.hero.ctas.map((b, i) => btn(b.href, b.label, i ? 'btn--glass' : 'btn--leaf')),
    bg: gimg('g-smoke-glass', { alt: '', eager: true, sizes: '(min-width: 1024px) 70vw, 100vw', cls: 'screen p-hero__img' }),
    aside: `<div class="p-hero__cut protrude" aria-hidden="true"><div class="p-hero__cut-in" data-depth="0.12">${gimg('g-bud-cut', { alt: '', cls: 'cut p-hero__cut-img', sizes: '(min-width: 1024px) 420px, 150px' })}</div></div>`,
  })}
${band(`<div class="wrap">
${head('p-steps-h', 'Delivery', 'How it works')}
<ol class="p-dsteps" role="list">${c.steps.map((st, i) => `<li class="p-dstep${i % 2 ? ' p-dstep--flip' : ''}">
<div class="p-dstep__media" data-reveal>${caseBox(photo(ctx, STEP_PHOTO[i], { alt: STEP_ALT[i], sizes: '(min-width: 1024px) 560px, 92vw', cls: 'p-case__img' }), { wide: true, cls: 'p-case' })}</div>
<div class="p-dstep__text" data-reveal style="--i:1"><span class="p-step__num">${String(i + 1).padStart(2, '0')}</span><h3 class="display p-dstep__title">${esc(st.title)}</h3><div class="p-copy">${paras(st.text)}</div></div>
</li>`).join('')}</ol>
</div>`, { tone: 'void', mod: 'p-band--dsteps', label: 'p-steps-h', clip: pool('p-pool--left') + '<span class="p-leaf"></span>' })}
${visitBlock(ctx, 'p-visit')}`;
  return out(ctx, { path: '/delivery/', name: 'Delivery', description: c.description, crumbs, main, mod: 'delivery', image: 'van.webp' });
}

// ---------------------------------------------------------------- /about/
const BLOCK_PHOTO = [['trichomes.png', 'A cannabis bud close up, trichomes catching the light'], ['prerolls.webp', 'Pre-rolls']];
function reviewsGrid(ctx, id, cls = '') {
  const r = ctx.site.reviews;
  return band(`<div class="wrap wrap--wide">
${head(id, r.kicker, esc(r.title), '', 'p-head--center p-head--md')}
<div class="p-reviews ${cls}">${r.items.map((x, i) => reviewCard(x, i)).join('')}</div>
<p class="p-note p-note--center">${esc(r.note)}</p>
</div>`, { tone: 'void', mod: 'p-band--reviews', label: id, clip: pool('p-pool--center') + '<span class="p-leaf"></span>' });
}
function about(ctx) {
  const c = ctx.content.about;
  const crumbs = [['/', 'Home'], ['/about/', 'About Us']];
  const main = `${hero(ctx, {
    crumbs, kick: c.hero.kicker, mod: 'p-hero--about p-hero--cut', titleCls: 'p-hero__title--fit',
    title: lines(c.hero.title), lede: esc(c.hero.text),
    ctas: c.hero.ctas.map((b, i) => btn(b.href, b.label, i ? 'btn--glass' : 'btn--leaf')),
    aside: `<div class="p-hero__case" data-reveal>${caseBox(photo(ctx, 'storefront.webp', { alt: 'The A&P Dispensary shop front on Lefferts Blvd at dusk: black awning and the green and white A&P DISPENSARY sign', eager: true, sizes: '(min-width: 1024px) 340px, 60vw', cls: 'p-case__img' }), { tall: true, cls: 'p-case p-case--portrait' })}</div>`,
  })}
${band(`<div class="wrap p-values">
<div class="p-values__art protrude" aria-hidden="true"><div class="p-values__art-in" data-depth="0.1">${photo(ctx, 'buds-cut.png', { alt: '', cls: 'cut p-values__img', sizes: '(min-width: 1024px) 340px, 160px' })}</div></div>
<div class="p-values__main">
${head('p-values-h', c.hero.kicker, 'Our <span class="accent--gold">values</span>')}
<ul class="p-values__grid" role="list">${c.values.map((v, i) => `<li class="glass glass--lit glass--lift p-value"${reveal(i)}><span class="p-step__num">${String(i + 1).padStart(2, '0')}</span><h3 class="p-value__title">${esc(v.title)}</h3><p class="p-value__text">${esc(v.text)}</p></li>`).join('')}</ul>
</div>
</div>`, { tone: 'lit', mod: 'p-band--values', id: 'story', label: 'p-values-h', clip: pool('p-pool--left') })}
${c.blocks.map((b, i) => band(`<div class="wrap p-split${i % 2 ? ' p-split--flip' : ''}">
<div class="p-split__text" data-reveal><h2 class="display p-head__title" id="p-block-${i}">${esc(b.title)}</h2><div class="p-copy">${paras(b.text)}</div>${i ? btn('/store/' + ctx.site.store.slug + '/', 'Visit A&P', 'btn--glass') : btn('/shop/', 'Shop', 'btn--leaf', 'bag')}</div>
<div class="p-split__media" data-reveal style="--i:1">${caseBox(photo(ctx, BLOCK_PHOTO[i][0], { alt: BLOCK_PHOTO[i][1], sizes: '(min-width: 1024px) 520px, 92vw', cls: 'p-case__img' }), { wide: true, cls: 'p-case' + (i ? '' : ' p-case--dark') })}</div>
</div>`, { tone: i ? 'lit' : 'void', mod: 'p-band--block', label: 'p-block-' + i, clip: pool(i ? 'p-pool--left' : 'p-pool--right') })).join('\n')}
${reviewsGrid(ctx, 'p-reviews')}`;
  return out(ctx, { path: '/about/', name: 'About Us', description: c.description, crumbs, main, mod: 'about' });
}

// ---------------------------------------------------------------- /faq/
function faq(ctx) {
  const c = ctx.content.faq;
  const s = ctx.site.store;
  const crumbs = [['/', 'Home'], ['/faq/', 'FAQ']];
  const gid = (g) => 'faq-' + g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const main = `${hero(ctx, {
    crumbs, kick: ctx.site.kicker, mod: 'p-hero--compact',
    title: `Frequently Asked <span class="accent">Questions</span>`, lede: esc(c.hero.text),
    bg: gimg('g-smoke-glass', { alt: '', eager: true, sizes: '(min-width: 1024px) 70vw, 100vw', cls: 'screen p-hero__img' }),
  })}
${band(`<div class="wrap p-faq">
<aside class="p-faq__side" aria-label="Topics">
<nav class="p-faq__nav glass" data-reveal><p class="p-faq__navlabel">Topics</p><ul role="list">${c.groups.map((g) => `<li><a class="p-faq__navlink"${linkAttrs('#' + gid(g))}>${esc(g.title)}${icon('arrow')}</a></li>`).join('')}</ul></nav>
<div class="p-faq__ask glass glass--gold" data-reveal style="--i:1"><p class="p-faq__asktitle">Still have a question?</p>${infoList(ctx, { directions: false, cls: 'p-info--sm' })}<div class="btn-row">${btn('tel:' + s.tel, s.phoneShort, 'btn--gold btn--sm', 'phone')}${btn('/contact/', 'Contact Us', 'btn--ghost btn--sm')}</div></div>
</aside>
<div class="p-faq__groups">${c.groups.map((g) => `<section class="p-faq__group" aria-labelledby="${gid(g)}" data-reveal>
<h2 class="display p-faq__title" id="${gid(g)}">${esc(g.title)}</h2>
<div class="faq">${g.items.map((it) => `<details><summary>${esc(it.q)}</summary><p>${esc(it.a)}</p></details>`).join('')}</div>
</section>`).join('')}</div>
</div>`, { tone: 'void', mod: 'p-band--faq', clip: pool('p-pool--left') })}`;
  return out(ctx, { path: '/faq/', name: 'FAQ', description: c.description, crumbs, main, mod: 'faq' });
}

// ---------------------------------------------------------------- /reviews/
function reviews(ctx) {
  const r = ctx.site.reviews;
  const t = ctx.site.testimonial;
  const crumbs = [['/', 'Home'], ['/reviews/', 'Review Us']];
  const main = `${hero(ctx, {
    crumbs, kick: r.kicker, mod: 'p-hero--compact p-hero--reviews', titleCls: 'p-hero__title--md',
    title: esc(r.title), lede: esc(r.note),
    ctas: [btn(ctx.site.store.directions.href, 'Leave us a review on Google', 'btn--gold', 'star')],
  })}
${band(`<div class="wrap p-quote">
<figure class="glass glass--gold glass--strong p-quote__card" data-reveal>
<span class="p-quote__mark" aria-hidden="true">&ldquo;</span>
<blockquote class="p-quote__text"><p>${esc(t.quote)}</p></blockquote>
<figcaption class="p-quote__by">${esc(t.by)}</figcaption>
</figure>
</div>`, { tone: 'lit', mod: 'p-band--quote', clip: pool('p-pool--left') + '<span class="p-leaf"></span>' })}
${band(`<div class="wrap wrap--wide">
<h2 class="p-sr" id="p-google">Reviews on Google</h2>
<div class="p-reviews">${r.items.map((x, i) => reviewCard(x, i)).join('')}</div>
<div class="p-howd glass glass--gold" data-reveal><h3 class="p-howd__title">${esc(ctx.content.store.review.title)}</h3><p class="p-note p-howd__note">${esc(r.note)}</p>${btn(ctx.site.store.directions.href, 'Leave us a review on Google', 'btn--gold', 'star')}</div>
</div>`, { tone: 'void', mod: 'p-band--reviews', label: 'p-google', clip: pool('p-pool--center') })}`;
  return out(ctx, { path: '/reviews/', name: 'Review Us', description: `${r.title} ${r.note}`, crumbs, main, mod: 'reviews' });
}

// ---------------------------------------------------------------- /contact/
function contact(ctx) {
  const s = ctx.site.store;
  const crumbs = [['/', 'Home'], ['/contact/', 'Contact Us']];
  const main = `${hero(ctx, {
    crumbs, kick: ctx.site.kicker, mod: 'p-hero--compact',
    title: `Contact <span class="accent">Us</span>`, lede: esc(s.blurb),
    bg: gimg('g-smoke-glass', { alt: '', eager: true, sizes: '(min-width: 1024px) 70vw, 100vw', cls: 'screen p-hero__img' }),
  })}
${band(`<div class="wrap p-contact">
<div class="glass glass--lit p-contact__info" data-reveal>
<h2 class="display p-contact__title" id="p-contact-store">${esc(ctx.content.store.h1)}</h2>
${infoList(ctx)}
<div class="btn-row">${btn('tel:' + s.tel, s.phoneShort, 'btn--leaf', 'phone')}${btn(s.directions.href, s.directions.label, 'btn--glass', 'pin')}</div>
</div>
<div class="glass glass--strong p-contact__form" data-reveal style="--i:1">
<h2 class="display p-contact__title" id="p-contact-form">Send a message</h2>
${demoForm({ id: 'contact-form', fields: ['Name', 'Email', 'Phone', 'Message'], textarea: ['Message'], button: 'Send', cls: 'p-form' })}
</div>
</div>`, { tone: 'void', mod: 'p-band--contact', clip: pool('p-pool--left') })}`;
  return out(ctx, { path: '/contact/', name: 'Contact Us', description: `${s.address}. ${s.hours}. ${s.phone}.`, crumbs, main, mod: 'contact' });
}

// ---------------------------------------------------------------- /drops/
function drops(ctx) {
  const n = ctx.site.newsletter;
  const hp = ctx.content.home.products;
  const spec = (hp.tabs || []).find((t) => t.collection === 'our-specials');
  const crumbs = [['/', 'Home'], ['/drops/', 'Small-Batch Drops']];
  const main = `${hero(ctx, {
    crumbs, kick: 'Small-Batch Drops', mod: 'p-hero--drops',
    title: esc(n.title), lede: esc(n.text),
    bg: media(ctx, 'haze-loop', { eager: true, cls: 'p-hero__film p-hero__film--full' }),
    extra: `<div class="p-drops__form">${demoForm({ id: 'drops-form', fields: ['Email'], button: n.button, cls: 'p-form p-form--inline' })}<p class="p-note">${esc(n.note)}</p></div>`,
  })}
${band(`<div class="wrap">
${head('p-fresh', hp.title, esc(hp.text), '', 'p-head--center')}
<div class="p-fresh">
<a class="glass glass--leaf glass--lift p-fresh__card"${linkAttrs('/collection/our-specials/')} data-reveal><span class="p-fresh__media" aria-hidden="true">${gimg('g-cabinet-deals', { alt: '', sizes: '(min-width: 1024px) 560px, 92vw', cls: 'p-fresh__img' })}</span><span class="p-fresh__body"><span class="p-fresh__title">${esc(spec ? spec.label : 'Our Specials')}</span><span class="link-arrow">View the collection${icon('arrow')}</span></span></a>
<a class="glass glass--gold glass--lift p-fresh__card"${linkAttrs('/deals/')} data-reveal style="--i:1"><span class="p-fresh__media" aria-hidden="true">${gimg('g-bud-macro', { alt: '', sizes: '(min-width: 1024px) 560px, 92vw', cls: 'p-fresh__img' })}</span><span class="p-fresh__body"><span class="p-fresh__title">Deals</span><span class="link-arrow">View all deals${icon('arrow')}</span></span></a>
</div>
</div>`, { tone: 'void', mod: 'p-band--fresh', label: 'p-fresh', clip: pool('p-pool--center') })}`;
  return out(ctx, { path: '/drops/', name: 'Small-Batch Drops', description: `${n.text} ${n.note}`, crumbs, main, mod: 'drops' });
}

// ---------------------------------------------------------------- /learn/
const GUIDE_ART = { '/learn/beginners-guide/': 'guide-beginners.svg', '/learn/understanding-cannabinoids/': 'guide-cannabinoids.svg', '/learn/terpene-profile/': 'guide-terpenes.svg' };
function learn(ctx) {
  const c = ctx.content.learn;
  const f = c.featured;
  const fa = ctx.articles[f.slug];
  const crumbs = [['/', 'Home'], ['/learn/', 'Learn']];
  const main = `${hero(ctx, {
    crumbs, kick: c.hero.kicker, mod: 'p-hero--learn', titleCls: 'p-hero__title--fit',
    title: lines(c.hero.title, 'outline'), lede: esc(c.hero.text),
    ctas: c.hero.ctas.map((b, i) => btn(b.href, b.label, i ? 'btn--glass' : 'btn--leaf')),
    bg: media(ctx, 'smoke', { eager: true, cls: 'p-hero__film p-hero__film--full p-hero__film--screen' }),
  })}
${band(`<div class="wrap">
${head('p-guides', 'Start here', esc(c.guides.title))}
<ul class="p-guides" role="list">${c.guides.items.map((g, i) => `<li class="glass glass--lit glass--lift p-guide"${reveal(i)}>
<span class="p-guide__art" aria-hidden="true">${photo(ctx, GUIDE_ART[g.href] || 'guide-beginners.svg', { alt: '', cls: 'p-guide__img' })}</span>
<h3 class="p-guide__title">${esc(g.title)}</h3><p class="p-guide__text">${esc(g.text)}</p>${arrow(g.href, g.cta)}
</li>`).join('')}</ul>
</div>`, { tone: 'void', mod: 'p-band--guides', label: 'p-guides', clip: pool('p-pool--left') })}
${band(`<div class="wrap p-feature">
<div class="p-feature__media" data-reveal>${caseBox(photo(ctx, 'calm-cbd.webp', { alt: '', sizes: '(min-width: 1024px) 480px, 92vw', cls: 'p-case__img' }), { tall: true, cls: 'p-case p-case--portrait' })}</div>
<div class="p-feature__text" data-reveal style="--i:1">${kicker('Featured')}<h2 class="display p-feature__title" id="p-feature">${esc(f.title)}</h2><p class="p-copy">${esc(f.text)}</p>${btn(fa ? fa.path : '/learn/', f.cta, 'btn--leaf')}</div>
</div>`, { tone: 'lit', mod: 'p-band--feature', label: 'p-feature', clip: pool('p-pool--right') + '<span class="p-leaf"></span>' })}
${band(`<div class="wrap">
${head('p-benefits', '', esc(c.benefits.title))}
<ul class="p-benefits" role="list">${c.benefits.items.map((b, i) => `<li class="p-benefit"${reveal(i % 3)}><h3 class="p-benefit__title">${esc(b.title)}</h3><p class="p-benefit__text">${esc(b.text)}</p></li>`).join('')}</ul>
</div>`, { tone: 'mist', mod: 'p-band--benefits', label: 'p-benefits' })}
${band(`<div class="wrap p-basics">
<div class="p-basics__media" data-reveal>${caseBox(photo(ctx, 'herbs.webp', { alt: 'Rolling papers, a pre-roll and a jar of herbs on a gold frame', sizes: '(min-width: 1024px) 480px, 92vw', cls: 'p-case__img' }), { wide: true, cls: 'p-case' })}</div>
<div class="p-basics__list">${c.basics.map((b, i) => `<section class="p-basic"${reveal(i)}><h2 class="display p-basic__title"${i === 0 ? ' id="p-basics"' : ''}>${esc(b.title)}</h2><p class="p-copy">${esc(b.text)}</p></section>`).join('')}</div>
</div>`, { tone: 'void', mod: 'p-band--basics', label: 'p-basics', clip: pool('p-pool--left') })}
${band(`<div class="wrap">
${head('p-articles', 'Learn', 'All <span class="accent">articles</span>')}
<div class="p-posts">${articleList(ctx).map((a, i) => postCard(ctx, a, i)).join('')}</div>
</div>`, { tone: 'void', mod: 'p-band--articles', id: 'articles', label: 'p-articles', clip: pool('p-pool--right') })}`;
  return out(ctx, { path: '/learn/', name: 'Learn About Cannabis', description: c.description, crumbs, main, mod: 'learn', image: 'herbs.webp' });
}

// ---------------------------------------------------------------- /learn/<slug>/
function article(ctx, a) {
  const list = articleList(ctx);
  const at = list.findIndex((x) => x.slug === a.slug);
  const related = [1, 2, 3].map((k) => list[(at + k) % list.length]).filter((x) => x && x.slug !== a.slug);
  const hp = ctx.content.home.products;
  const crumbs = [['/', 'Home'], ['/learn/', 'Learn'], [a.path, a.title]];
  const long = a.title.length > 48;
  const main = `${hero(ctx, {
    crumbs, kick: 'Learn About Cannabis', mod: 'p-hero--article', titleCls: long ? 'p-hero__title--long' : 'p-hero__title--md',
    title: esc(a.title),
    bg: media(ctx, 'plants', { eager: true, cls: 'p-hero__film p-hero__film--full p-hero__film--dim' }),
  })}
<section class="band band--void p-band p-band--prose" aria-label="${escA(a.title)}">
<div class="band__clip" aria-hidden="true">${pool('p-pool--left')}<span class="grain"></span></div>
<div class="wrap wrap--narrow">
<div class="prose p-prose">
${a.html}
</div>
<div class="p-prose__end">${arrow('/learn/', 'All articles')}</div>
</div>
</section>
${band(`<div class="wrap">
${head('p-related', 'Learn', 'Keep <span class="accent">learning</span>')}
<div class="p-posts">${related.map((x, i) => postCard(ctx, x, i)).join('')}</div>
</div>`, { tone: 'lit', mod: 'p-band--related', label: 'p-related', clip: pool('p-pool--right') })}
${band(`<div class="wrap p-cta" data-reveal>
<div><h2 class="display p-cta__title" id="p-cta">${esc(hp.title)}</h2><p class="p-cta__text">${esc(hp.text)}</p></div>
<div class="btn-row">${btn(hp.cta.href, hp.cta.label, 'btn--leaf', 'bag')}${btn('/deals/', 'Deals', 'btn--ghost')}</div>
</div>`, { tone: 'mist', mod: 'p-band--cta', label: 'p-cta' })}`;
  return out(ctx, { path: a.path, name: a.title, description: a.excerpt, crumbs, main, mod: 'article', image: 'herbs.webp' });
}

export async function render(ctx) {
  return [
    store(ctx), locations(ctx), delivery(ctx), about(ctx), faq(ctx), reviews(ctx), contact(ctx), drops(ctx), learn(ctx),
    ...articleList(ctx).map((a) => article(ctx, a)),
  ];
}
