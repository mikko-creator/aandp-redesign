// shop.mjs - SHOP lane: /shop/ (the full menu), /products/<slug>/ x9 (category pages), /collection/<slug>/ x5 and
// /deals/ (all 19 promotions as glass deal cards + the specials ticker).
// Words: A&P's own (menu.json, site.json, pages/categories.json, pages/home.json, articles). New words are neutral glue
// only: section labels, button labels, empty states, breadcrumbs, one-line intros that state no fact.
// Every price, product, promotion and count comes from menu.json; menu.note is printed once per page that shows them.
// Every link goes through href()/linkAttrs(); no inline script is emitted (D6).
import { page, crumbsHtml, icon } from './shell.mjs';
import { esc, escA, linkAttrs, gimg, photo, absUrl, productCard, productsByIds, hasGenerated, imgUrl, media } from './util.mjs';

const SHOP = '/shop/';
const DEALS = '/deals/';
const catPath = (c) => '/products/' + c.slug + '/';
const colPath = (c) => '/collection/' + c.slug + '/';

// generated art per category (BUILD-CONTRACT "Generated image ids") and the cut-out that breaks out of its case
const ART = { flower: 'g-bud-macro', prerolls: 'g-prerolls', edibles: 'g-edibles', vapes: 'g-vape', concentrates: 'g-concentrate', tinctures: 'g-tincture', topicals: 'g-topical', accessories: 'g-accessories', merch: 'g-cabinet-deals' };
const CUT = { flower: 'g-bud-cut', prerolls: 'g-bud-cut', concentrates: 'g-bud-cut' };
const cutFor = (slug) => CUT[slug] || 'g-leaf-cut';
// A&P's own category icons (assets/photos/icon-<slug>.png); accessories and merch have none
const ICONS = new Set(['flower', 'prerolls', 'edibles', 'vapes', 'concentrates', 'tinctures', 'topicals']);
// A&P articles that fit each category (slugs = src/content/articles/*.json)
const RELATED = {
  flower: ['indica-sativa-hybrid', 'how-to-store-cannabis', 'terpene-profile'],
  prerolls: ['how-to-store-cannabis', 'indica-sativa-hybrid', 'first-time-visiting'],
  edibles: ['first-time-visiting', 'thc-vs-cbd', 'how-to-store-cannabis'],
  vapes: ['thc-vs-cbd', 'understanding-cannabinoids', 'first-time-visiting'],
  concentrates: ['understanding-cannabinoids', 'thc-vs-cbd', 'first-time-visiting'],
  tinctures: ['benefits-of-cbd-oil', 'cbd-for-stress-relief', 'thc-vs-cbd'],
  topicals: ['benefits-of-cbd-oil', 'understanding-cannabinoids', 'beginners-guide'],
  accessories: ['how-to-store-cannabis', 'beginners-guide', 'first-time-visiting'],
  merch: ['first-time-visiting', 'beginners-guide', 'terpene-profile'],
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (s) => {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : '';
};
const arrow = () => icon('arrow', 's-ico');

// ---------- shared pieces ----------
const crumbLd = (ctx, crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(([h, l], i) => ({ '@type': 'ListItem', position: i + 1, name: l, item: absUrl(ctx, h) })),
});
const ogImg = (id) => (hasGenerated(id) ? imgUrl(id, 1200) : undefined);

function out(ctx, { path, name, description, main, crumbs, bodyClass = '', og }) {
  const title = `${name} | ${ctx.site.name}`;
  return {
    path,
    html: page({
      ctx, path, title, description, canonical: absUrl(ctx, path),
      og: { title, description, type: 'website', image: og },
      jsonld: [crumbLd(ctx, crumbs)],
      bodyClass: ('s-page ' + bodyClass).trim(),
      main, crumbs, heroCrumbs: true,
    }),
  };
}

// product cards (util.productCard) with a reveal stagger
const cards = (ctx, prods, { eager = 0, headingLevel = 'h3', sizes } = {}) => prods
  .map((p, i) => productCard(ctx, p, { eager: i < eager, headingLevel, sizes }).replace('<article ', `<article style="--i:${i % 4}" `))
  .join('\n');
const grid = (ctx, prods, opts = {}) => `<div class="pgrid s-pgrid${opts.cls ? ' ' + opts.cls : ''}">
${cards(ctx, prods, opts)}
</div>`;
const note = (ctx) => `<p class="s-note"><span class="s-note__dot" aria-hidden="true"></span>${esc(ctx.menu.note)}</p>`;

// the category's generated art in a black-framed glass case, a cut-out breaking out past the frame
function caseArt(id, cutId, { eager = false, cls = '' } = {}) {
  return `<div class="s-hero__art${cls ? ' ' + cls : ''}" aria-hidden="true">
<div class="case case--wide s-case" data-tilt>
<div class="case__media">${gimg(id, { alt: '', cls: 's-case__img', eager, sizes: '(min-width: 1024px) 560px, 86vw' })}</div>
<span class="case__glass"></span><span class="case__light"></span>
</div>
<span class="protrude s-cut" data-depth="0.12">${gimg(cutId, { alt: '', cls: 'cut s-cut__img', sizes: '(min-width: 1024px) 220px, 120px' })}</span>
</div>`;
}

// chips: every category (with its live-menu count) + Deals
function catChips(ctx, current, { counts = true } = {}) {
  const chips = ctx.menu.categories.filter((c) => c.slug !== current).map((c) => `<li><a class="chip s-chip"${linkAttrs(catPath(c))}>${esc(c.label)}${counts ? ` <span class="s-chip__n">${esc(c.count)}</span>` : ''}</a></li>`).join('');
  return `<ul class="s-chips" role="list">${chips}<li><a class="chip chip--deal s-chip"${linkAttrs(DEALS)}>${icon('tag')}Deals</a></li></ul>`;
}

// ---------- /shop/ ----------
function shopPage(ctx) {
  const path = SHOP;
  const crumbs = [['/', 'Home'], [SHOP, 'Shop']];
  const hp = (ctx.content.home && ctx.content.home.products) || {};
  const withProducts = ctx.menu.categories.filter((c) => productsByIds(ctx, c.ids).length);
  const empty = ctx.menu.categories.filter((c) => !productsByIds(ctx, c.ids).length);

  const sections = withProducts.map((c, ci) => {
    const prods = productsByIds(ctx, c.ids).slice(0, 8);
    const ic = ICONS.has(c.slug) ? `<span class="s-cat__icon" aria-hidden="true">${photo(ctx, 'icon-' + c.slug + '.png', { alt: '', sizes: '56px' })}</span>` : '';
    return `<section class="s-cat" id="${escA(c.slug)}" aria-labelledby="s-cat-${escA(c.slug)}">
<header class="s-cat__head" data-reveal>
${ic}<h2 class="display s-cat__h" id="s-cat-${escA(c.slug)}">${esc(c.label)}</h2>
<a class="link-arrow s-cat__all"${linkAttrs(catPath(c))}>View all (${esc(c.count)})</a>
</header>
${grid(ctx, prods, { eager: ci === 0 ? 4 : 0 })}
</section>`;
  }).join('\n');

  const emptyLine = empty.length
    ? `<p class="s-cat__empty">${empty.map((c) => `<a class="link-arrow"${linkAttrs(catPath(c))}>${esc(c.label)}</a>`).join(' <span aria-hidden="true">·</span> ')}: nothing on the live menu today.</p>`
    : '';

  const colChips = ctx.menu.collections.map((c) => `<li><a class="chip chip--leaf s-chip"${linkAttrs(colPath(c))}>${esc(c.label)}</a></li>`).join('');

  const main = `
<section class="band band--lit s-hero s-hero--shop" aria-labelledby="s-h1">
<div class="band__clip" aria-hidden="true"><span class="s-pool"></span><span class="s-glow"></span><span class="grain"></span></div>
<div class="wrap wrap--wide s-hero__in">
<div class="s-hero__copy">
${crumbsHtml(crumbs)}
<p class="kicker">Shop · ${esc(ctx.site.store.locality)}</p>
<h1 class="display s-hero__h" id="s-h1">${esc(hp.title || 'Our Products').replace(/Products$/, '<span class="accent">Products</span>')}</h1>
<p class="lede s-hero__lede">${esc(hp.text || '')}</p>
<nav class="s-filter" aria-label="Shop by category">${catChips(ctx, null)}</nav>
</div>
${caseArt('g-cabinet-deals', 'g-bud-cut', { eager: true })}
</div>
</section>

<section class="band band--void s-menu" aria-label="Menu by category">
<div class="band__clip" aria-hidden="true"><span class="s-edge s-edge--l"></span><span class="s-edge s-edge--r"></span></div>
<div class="wrap wrap--wide">
${sections}
${emptyLine}
</div>
</section>

<section class="band band--lit s-cols" aria-labelledby="s-cols-h">
<div class="band__clip" aria-hidden="true"><span class="s-pool s-pool--low"></span><span class="grain"></span></div>
<div class="wrap wrap--wide s-cols__in" data-reveal>
<p class="kicker">Collections</p>
<h2 class="display s-cols__h" id="s-cols-h">Shop the <span class="accent--gold">lists</span></h2>
<ul class="s-chips s-chips--big" role="list">${colChips}<li><a class="chip chip--deal s-chip"${linkAttrs(DEALS)}>${icon('tag')}view deals</a></li></ul>
${note(ctx)}
</div>
</section>`;

  return out(ctx, {
    path,
    name: 'Shop',
    description: `Shop A&P Dispensary's menu in Kew Gardens, NY: ${ctx.menu.categories.filter((c) => c.count).map((c) => c.label.toLowerCase()).join(', ')}. ${hp.text || ''}`.trim(),
    main, crumbs, bodyClass: 's-page--shop', og: ogImg('g-cabinet-deals'),
  });
}

// ---------- /products/<slug>/ ----------
function categoryPage(ctx, c) {
  const path = catPath(c);
  const crumbs = [['/', 'Home'], [SHOP, 'Shop'], [path, c.label]];
  const intro = ((ctx.content.categories || {}).intros || {})[c.slug];
  const all = productsByIds(ctx, c.ids);
  const shown = productsByIds(ctx, (c.ids || []).slice(0, 24));
  const src = intro && intro.src && ctx.articles[String(intro.src).split('/').filter(Boolean).pop()];
  const introHtml = intro && intro.text && intro.text.length
    ? `<div class="s-hero__intro">${intro.text.map((t, i) => `<p${i === 0 ? ' class="lede"' : ''}>${esc(t)}</p>`).join('\n')}</div>${src ? `\n<p class="s-src">From <a class="link-arrow"${linkAttrs(src.path || intro.src)}>${esc(src.title)}</a></p>` : ''}`
    : `<div class="s-hero__intro"><p class="lede">Browse ${esc(c.label.toLowerCase())} on the A&amp;P menu.</p></div>`;

  const list = shown.length
    ? `<section class="band band--void s-list" aria-labelledby="s-list-h">
<div class="band__clip" aria-hidden="true"><span class="s-edge s-edge--l"></span><span class="s-edge s-edge--r"></span></div>
<div class="wrap wrap--wide">
<header class="s-list__head" data-reveal>
<h2 class="s-list__h" id="s-list-h">${esc(c.label)} on the menu</h2>
<p class="s-count" aria-live="off">Showing ${shown.length} of ${esc(c.count || all.length)}</p>
</header>
${grid(ctx, shown, { eager: 4 })}
${note(ctx)}
</div>
</section>`
    : `<section class="band band--void s-empty" aria-labelledby="s-empty-h">
<div class="band__clip" aria-hidden="true"><span class="s-pool s-pool--low"></span></div>
<div class="wrap wrap--narrow">
<div class="s-empty__pane glass glass--strong glass--lit" data-reveal>
<p class="kicker">${esc(c.label)}</p>
<h2 class="s-empty__h" id="s-empty-h">Nothing in ${esc(c.label)} on the live menu today.</h2>
<p class="s-empty__t">Browse the other categories or see what is on special.</p>
${catChips(ctx, c.slug)}
<div class="btn-row"><a class="btn btn--leaf btn--sm"${linkAttrs(DEALS)}>view deals ${arrow()}</a><a class="btn btn--ghost btn--sm"${linkAttrs(SHOP)}>view full menu</a></div>
${note(ctx)}
</div>
</div>
</section>`;

  const rel = (RELATED[c.slug] || []).map((s) => ctx.articles[s]).filter(Boolean);
  const read = rel.length
    ? `<section class="band band--lit s-read" aria-labelledby="s-read-h">
<div class="band__clip" aria-hidden="true"><span class="s-pool s-pool--right"></span><span class="grain"></span></div>
<div class="wrap wrap--wide">
<header class="s-read__head" data-reveal><p class="kicker">Learn</p><h2 class="display s-read__h" id="s-read-h">Related reading</h2><a class="link-arrow"${linkAttrs('/learn/')}>read all articles</a></header>
<ul class="s-read__list" role="list">
${rel.map((a, i) => `<li data-reveal style="--i:${i}"><a class="s-article glass glass--lit glass--lift"${linkAttrs(a.path || '/learn/' + a.slug + '/')}>
<span class="s-article__k">Article</span>
<span class="s-article__t">${esc(a.title)}</span>
<span class="s-article__x">${esc(a.excerpt || '')}</span>
<span class="s-article__go">read more ${arrow()}</span>
</a></li>`).join('\n')}
</ul>
</div>
</section>`
    : '';

  const bar = `<nav class="band band--void s-catbar" aria-label="Other categories">
<div class="wrap wrap--wide">
<p class="kicker">Shop by category</p>
<ul class="s-tiles" role="list">
${ctx.menu.categories.filter((x) => x.slug !== c.slug).map((x, i) => `<li data-reveal style="--i:${i % 4}"><a class="s-tile glass glass--lift"${linkAttrs(catPath(x))}>${ICONS.has(x.slug) ? `<span class="s-tile__icon" aria-hidden="true">${photo(ctx, 'icon-' + x.slug + '.png', { alt: '', sizes: '44px' })}</span>` : `<span class="s-tile__icon s-tile__icon--mono" aria-hidden="true">${esc(x.label.slice(0, 1))}</span>`}<span class="s-tile__t">${esc(x.label)}</span><span class="s-tile__n">${esc(x.count)}</span></a></li>`).join('\n')}
<li data-reveal style="--i:0"><a class="s-tile s-tile--deal glass glass--gold glass--lift"${linkAttrs(DEALS)}><span class="s-tile__icon s-tile__icon--mono" aria-hidden="true">${icon('tag')}</span><span class="s-tile__t">Deals</span><span class="s-tile__n">${esc(ctx.menu.promotions.length)}</span></a></li>
</ul>
</div>
</nav>`;

  const kick = c.count ? `${c.count} on the live menu` : 'Shop by category';
  const main = `
<section class="band band--lit s-hero s-hero--cat s-hero--${escA(c.slug)}" aria-labelledby="s-h1">
<div class="band__clip" aria-hidden="true"><span class="s-pool"></span><span class="s-glow"></span><span class="grain"></span></div>
<div class="wrap wrap--wide s-hero__in">
<div class="s-hero__copy">
${crumbsHtml(crumbs)}
<p class="kicker">${esc(kick)}</p>
<h1 class="display s-hero__h" id="s-h1">${esc(c.label)}</h1>
${introHtml}
</div>
${caseArt(ART[c.slug], cutFor(c.slug), { eager: true })}
</div>
</section>
${list}
${read}
${bar}`;

  const desc = intro && intro.text && intro.text[0]
    ? `${c.label} at A&P Dispensary, Kew Gardens, NY. ${intro.text[0]}`
    : shown.length ? `${c.label} on A&P Dispensary's menu in Kew Gardens, NY.` : `${c.label} at A&P Dispensary, Kew Gardens, NY: nothing on the live menu today.`;
  return out(ctx, { path, name: c.label, description: desc, main, crumbs, bodyClass: 's-page--cat', og: ogImg(ART[c.slug]) });
}

// ---------- /collection/<slug>/ ----------
function collectionPage(ctx, c) {
  const path = colPath(c);
  const crumbs = [['/', 'Home'], [SHOP, 'Shop'], [path, c.label]];
  const prods = productsByIds(ctx, c.ids);
  const others = ctx.menu.collections.filter((x) => x.slug !== c.slug);
  const main = `
<section class="band band--lit s-hero s-hero--col" aria-labelledby="s-h1">
<div class="band__clip" aria-hidden="true"><span class="s-pool"></span><span class="s-glow"></span><span class="grain"></span></div>
<div class="wrap wrap--wide s-hero__in s-hero__in--col">
<div class="s-hero__copy">
${crumbsHtml(crumbs)}
<p class="kicker">Collection</p>
<h1 class="display s-hero__h" id="s-h1">${esc(c.label)}</h1>
<p class="lede s-hero__lede">The ${esc(c.label)} list from A&amp;P's menu.</p>
<nav class="s-filter" aria-label="Other collections"><ul class="s-chips" role="list">${others.map((x) => `<li><a class="chip chip--leaf s-chip"${linkAttrs(colPath(x))}>${esc(x.label)}</a></li>`).join('')}<li><a class="chip s-chip"${linkAttrs(SHOP)}>view full menu</a></li></ul></nav>
</div>
</div>
</section>
<section class="band band--void s-list" aria-labelledby="s-list-h">
<div class="band__clip" aria-hidden="true"><span class="s-edge s-edge--l"></span><span class="s-edge s-edge--r"></span></div>
<div class="wrap wrap--wide">
<header class="s-list__head" data-reveal>
<h2 class="s-list__h" id="s-list-h">${esc(c.label)}</h2>
<p class="s-count">Showing ${prods.length} of ${prods.length}</p>
</header>
${grid(ctx, prods, { eager: 4 })}
${note(ctx)}
</div>
</section>
<nav class="band band--void s-catbar" aria-label="Shop by category">
<div class="wrap wrap--wide">
<p class="kicker">Shop by category</p>
${catChips(ctx, null)}
</div>
</nav>`;
  return out(ctx, {
    path, name: c.label,
    description: `${c.label} at A&P Dispensary, Kew Gardens, NY: ${prods.length} products from A&P's menu.`,
    main, crumbs, bodyClass: 's-page--col', og: ogImg('g-cabinet-deals'),
  });
}

// ---------- /deals/ ----------
function dealsPage(ctx) {
  const path = DEALS;
  const crumbs = [['/', 'Home'], [DEALS, 'Deals']];
  const promos = ctx.menu.promotions;
  const withP = promos.filter((p) => productsByIds(ctx, p.productIds).length);
  const without = promos.filter((p) => !productsByIds(ctx, p.productIds).length);
  const info = (p, H) => `<p class="kicker s-deal__k">${p.ends ? `Ends ${esc(fmtDate(p.ends))}` : 'Special'}</p>
<${H} class="s-deal__name">${esc(p.name)}</${H}>
${p.description ? `<p class="s-deal__desc">${esc(p.description)}</p>` : ''}`;

  const rows = withP.map((p, i) => {
    const prods = productsByIds(ctx, p.productIds);
    return `<article class="s-deal" id="deal-${escA(p.id)}" aria-labelledby="deal-h-${escA(p.id)}">
<div class="s-deal__info glass glass--gold glass--lit glass--lift" data-reveal style="--i:0">
${info(p, 'h3').replace('<h3 class="s-deal__name">', `<h3 class="s-deal__name" id="deal-h-${escA(p.id)}">`)}
${prods.length > 4 ? `<p class="s-deal__more">${prods.length} products on this menu</p>` : ''}
</div>
${grid(ctx, prods.slice(0, 4), { headingLevel: 'h4', eager: i === 0 ? 4 : 0, cls: 's-pgrid--mini', sizes: '(min-width: 1024px) 180px, 44vw' })}
</article>`;
  }).join('\n');

  const minis = without.map((p, i) => `<li class="s-deal__card glass glass--gold glass--lit glass--lift" data-reveal style="--i:${i % 4}" id="deal-${escA(p.id)}">
${info(p, 'h3')}
</li>`).join('\n');

  const haze = ctx.images && ctx.images.media && ctx.images.media['haze-loop'];
  const ticker = (ctx.site.ticker || []).map((t) => `<span class="s-tick"><span class="s-tick__dot" aria-hidden="true"></span>${esc(t)}</span>`).join('');

  const main = `
<section class="band band--lit s-hero s-hero--deals" aria-labelledby="s-h1">
<div class="band__clip" aria-hidden="true">${haze ? `<div class="band__bg s-haze">${media(ctx, 'haze-loop', { cls: 'screen' })}</div>` : ''}<span class="s-pool"></span><span class="s-glow s-glow--gold"></span><span class="grain"></span></div>
<div class="wrap wrap--wide s-hero__in">
<div class="s-hero__copy">
${crumbsHtml(crumbs)}
<p class="kicker">Deals at this store</p>
<h1 class="display s-hero__h" id="s-h1">Our <span class="accent--gold">Specials</span></h1>
<p class="lede s-hero__lede">Every special on A&amp;P's live menu, with the date it ends.</p>
<div class="btn-row"><a class="btn btn--leaf"${linkAttrs(SHOP)}>view full menu ${arrow()}</a><a class="btn btn--glass"${linkAttrs('/collection/our-specials/')}>shop the specials</a></div>
</div>
${caseArt('g-cabinet-deals', 'g-leaf-cut', { eager: true })}
</div>
</section>

<div class="ticker s-ticker" data-marquee aria-label="Specials on the menu">${ticker}</div>

<section class="band band--void s-deals" aria-labelledby="s-deals-h">
<div class="band__clip" aria-hidden="true"><span class="s-edge s-edge--l"></span><span class="s-edge s-edge--r"></span></div>
<div class="wrap wrap--wide">
<header class="s-list__head" data-reveal>
<h2 class="s-list__h" id="s-deals-h">Specials with products on this menu</h2>
<p class="s-count">${withP.length} of ${promos.length} specials</p>
</header>
<div class="s-deals__rows">
${rows}
</div>
${without.length ? `<h2 class="s-list__h s-deals__more-h" data-reveal>More specials</h2>
<ul class="s-deals__grid" role="list">
${minis}
</ul>` : ''}
${note(ctx)}
<div class="btn-row s-deals__cta"><a class="btn btn--leaf"${linkAttrs(SHOP)}>view full menu ${arrow()}</a></div>
</div>
</section>`;

  return out(ctx, {
    path, name: 'Deals',
    description: `Our Specials: ${promos.length} specials on A&P Dispensary's menu in Kew Gardens, NY, each with the date it ends.`,
    main, crumbs, bodyClass: 's-page--deals', og: ogImg('g-cabinet-deals'),
  });
}

export async function render(ctx) {
  return [
    shopPage(ctx),
    ...ctx.menu.categories.map((c) => categoryPage(ctx, c)),
    ...ctx.menu.collections.map((c) => collectionPage(ctx, c)),
    dealsPage(ctx),
  ];
}
