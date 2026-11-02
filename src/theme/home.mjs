// home.mjs - the home page "/" (HOME lane, "CABINET OF LIGHT"). Section order = contract section 6 HOME (11 sections).
// Every visible fact is read from ctx (home.json, site.json, menu.json, faq.json); new words are neutral glue only
// (section labels, button labels). No inline JS; root-absolute URLs only in HTML attributes (contract D6).
import { page, icon } from './shell.mjs';
import { esc, escA, linkAttrs, gimg, photo, media, absUrl, productCard, collection, productsByIds, imgUrl, hasGenerated } from './util.mjs';

const must = (v, what) => {
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) throw new Error('home: missing content: ' + what);
  return v;
};
const lines = (t) => (Array.isArray(t) ? t : [t]);
const photoAlt = (ctx, file, fallback) => (((ctx.images && ctx.images.photos) || {})[file] || {}).alt || fallback;

// the generated category art per category slug (contract "Generated image ids")
const CAT_ART = { flower: 'g-bud-macro', prerolls: 'g-prerolls', edibles: 'g-edibles', vapes: 'g-vape', concentrates: 'g-concentrate', tinctures: 'g-tincture', topicals: 'g-topical' };

// a case: black-framed glass display case around media (classes owned by FOUNDATION's components.css)
const caseHtml = (inner, cls = '', extra = '') => `<div class="case ${cls}"${extra}><div class="case__media">${inner}</div><span class="case__light" aria-hidden="true"></span><span class="case__glass" aria-hidden="true"></span></div>`;

// a section head: optional kicker + h2 (+ optional lede)
const head = (id, title, { kicker, lede, cls = '' } = {}) => `<div class="h-head ${cls}" data-reveal>${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}<h2 id="${id}" class="display h-head__title">${esc(title)}</h2>${lede ? `<p class="lede h-head__lede">${esc(lede)}</p>` : ''}</div>`;

// line 2 of the hero title: the words before its first comma carry the one gold accent ("by hand,")
function accentFirstClause(s) {
  const t = String(s);
  const i = t.indexOf(',');
  if (i < 1) return esc(t);
  return `<span class="accent--gold">${esc(t.slice(0, i + 1))}</span>${esc(t.slice(i + 1))}`;
}

function hero(ctx) {
  const h = must(ctx.content.home.hero, 'home.hero');
  const t = must(h.title, 'home.hero.title');
  const slides = must(ctx.content.home.slides, 'home.slides');
  const ctas = must(h.ctas, 'home.hero.ctas');
  const slide = (s, i) => `<article class="h-slide" data-slide id="h-slide-${escA(s.id)}" aria-labelledby="h-slide-${escA(s.id)}-t">
${s.kicker ? `<p class="kicker h-slide__kicker">${esc(s.kicker)}</p>` : ''}<h2 class="h-slide__title" id="h-slide-${escA(s.id)}-t">${lines(s.title).map(esc).join(' ')}</h2>
<p class="h-slide__text">${esc(s.text)}</p>
<a class="link-arrow h-slide__cta"${linkAttrs(s.cta.href)}>${esc(s.cta.label)}</a>
</article>`;
  return `<section class="band h-hero" data-spot aria-labelledby="h-hero-title">
<div class="band__clip" aria-hidden="true">
<div class="band__bg h-hero__film">${media(ctx, 'store-room', { eager: true })}</div>
<div class="h-hero__smoke">${media(ctx, 'smoke')}</div>
<div class="h-hero__grade"></div>
<div class="h-hero__pool"></div>
<div class="h-hero__leaf"></div>
<div class="grain"></div>
</div>
<div class="wrap wrap--wide h-hero__grid">
<div class="h-hero__copy">
<p class="kicker h-hero__kicker" data-reveal>${esc(h.kicker)}</p>
<h1 id="h-hero-title" class="display h-hero__title" data-reveal style="--i:1"><span class="h-hero__line">${esc(t[0])}</span> <span class="h-hero__line">${t[1] ? accentFirstClause(t[1]) : ''}</span></h1>
<p class="h-hero__text" data-reveal style="--i:2">${esc(h.text)}</p>
<div class="btn-row h-hero__ctas" data-reveal style="--i:3">${ctas.map((c, i) => `<a class="btn ${i ? 'btn--glass' : 'btn--leaf'}"${linkAttrs(c.href)}>${esc(c.label)}${i ? '' : icon('arrow')}</a>`).join('')}</div>
</div>
<div class="h-hero__stage">
<div class="h-hero__casewrap" data-depth="0.05">
${caseHtml(gimg('g-hero-case', { alt: '', eager: true, sizes: '(min-width: 1024px) 520px, 92vw' }), 'case--wide h-hero__case', ' data-tilt="3"')}
<div class="protrude h-hero__bud" aria-hidden="true">${gimg('g-bud-cut', { alt: '', cls: 'cut', sizes: '(min-width: 1024px) 220px, 34vw' })}</div>
</div>
<div class="glass glass--lit glass--strong h-slides" data-rotator="6500" role="region" aria-roledescription="carousel" aria-label="A&amp;P highlights">
<div class="h-slides__stage">
${slides.map(slide).join('\n')}
</div>
<div class="h-slides__dots" data-rotator-dots></div>
</div>
</div>
</div>
</section>`;
}

function ticker(ctx) {
  const items = must(ctx.site.ticker, 'site.ticker');
  return `<section class="h-ticker" aria-label="Specials">
<a class="h-ticker__label" href="/deals/">${icon('tag')}<span>Specials</span></a>
<div class="ticker h-ticker__run" data-marquee>${items.map((t) => `<span class="h-ticker__item">${esc(t)}</span><span class="h-ticker__dot" aria-hidden="true"></span>`).join('')}</div>
</section>`;
}

function deals(ctx) {
  const promos = must(ctx.menu.promotions, 'menu.promotions').slice(0, 5);
  const store = ctx.site.store;
  return `<section class="band band--void h-deals" aria-labelledby="h-deals-title">
<div class="band__clip" aria-hidden="true"><div class="h-deals__light"></div></div>
<div class="wrap">
<div class="h-split">
${head('h-deals-title', 'Deals at this store', { kicker: store.name })}
<a class="link-arrow h-split__link" href="/deals/">view all deals</a>
</div>
<ul class="h-deals__grid" role="list">
${promos.map((p, i) => `<li class="h-deals__item" data-reveal style="--i:${i}"><a class="glass glass--gold glass--lit glass--lift h-deal" href="/deals/" data-tilt="3">
<span class="h-deal__tag" aria-hidden="true">${icon('tag')}</span>
<h3 class="h-deal__name">${esc(p.name)}</h3>
<p class="h-deal__text">${esc(p.description)}</p>
<span class="h-deal__go" aria-hidden="true">${icon('arrow')}</span>
</a></li>`).join('\n')}
</ul>
</div>
</section>`;
}

function categories(ctx) {
  const cats = must(ctx.content.home.categories, 'home.categories');
  return `<section class="band band--lit h-cats" aria-labelledby="h-cats-title" style="--lx:16%;--ly:8%">
<div class="wrap wrap--wide">
${head('h-cats-title', 'Shop by category', { kicker: 'The menu' })}
<ul class="h-cats__grid" role="list">
${cats.map((c, i) => `<li data-reveal style="--i:${i}"><a class="case h-cat" href="/products/${escA(c.slug)}/" data-tilt="5">
<span class="case__media h-cat__art">${CAT_ART[c.slug] ? gimg(CAT_ART[c.slug], { alt: '', sizes: '(min-width: 1024px) 180px, 46vw', cls: 'h-cat__img' }) : ''}</span>
<span class="case__light" aria-hidden="true"></span><span class="case__glass" aria-hidden="true"></span>
<span class="h-cat__icon">${photo(ctx, 'icon-' + c.slug + '.png', { alt: '', sizes: '84px' })}</span>
<span class="h-cat__label">${esc(c.label)}</span>
</a></li>`).join('\n')}
</ul>
</div>
</section>`;
}

function products(ctx) {
  const pr = must(ctx.content.home.products, 'home.products');
  const tabs = must(pr.tabs, 'home.products.tabs').map((t) => ({ ...t, col: must(collection(ctx, t.collection), 'collection ' + t.collection) }));
  return `<section class="band band--void h-products" aria-labelledby="h-products-title">
<div class="band__clip" aria-hidden="true"><div class="h-products__glow"></div></div>
<div class="wrap wrap--wide">
<div class="h-split">
${head('h-products-title', pr.title, { lede: pr.text })}
<a class="link-arrow h-split__link"${linkAttrs(pr.cta.href)}>${esc(pr.cta.label)}</a>
</div>
<div class="h-tabs" data-tabs>
<div class="h-tabs__list" role="tablist" aria-label="${escA(pr.title)}">
${tabs.map((t, i) => `<button class="h-tab" type="button" role="tab" id="h-tab-${escA(t.collection)}" aria-controls="h-panel-${escA(t.collection)}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''} data-tab>${esc(t.label)}</button>`).join('\n')}
</div>
${tabs.map((t, i) => `<div class="h-tabs__panel" role="tabpanel" id="h-panel-${escA(t.collection)}" aria-labelledby="h-tab-${escA(t.collection)}" tabindex="0" data-panel${i ? ' hidden' : ''}>
<div class="pgrid h-pgrid">
${productsByIds(ctx, t.col.ids).slice(0, 8).map((p) => productCard(ctx, p, { sizes: '(min-width: 1280px) 290px, (min-width: 1024px) 23vw, 46vw' })).join('\n')}
</div>
<p class="h-tabs__more"><a class="link-arrow" href="/collection/${escA(t.collection)}/">Shop all ${esc(t.label)}</a></p>
</div>`).join('\n')}
</div>
<p class="h-products__note">${esc(must(ctx.menu.note, 'menu.note'))}</p>
<div class="btn-row h-products__cta"><a class="btn btn--leaf"${linkAttrs(pr.cta.href)}>${esc(pr.cta.label)}${icon('arrow')}</a></div>
</div>
</section>`;
}

function story(ctx) {
  const s = must(ctx.content.home.story, 'home.story');
  return `<section class="band band--lit h-story" aria-labelledby="h-story-title" style="--lx:24%;--ly:26%">
<div class="wrap h-story__grid">
<div class="h-story__media" data-reveal>
${caseHtml(photo(ctx, 'storefront.webp', { alt: photoAlt(ctx, 'storefront.webp', 'The A&P Dispensary shop front on Lefferts Blvd'), sizes: '(min-width: 1024px) 440px, 84vw' }), 'case--tall h-story__case')}
<div class="protrude h-story__cut" aria-hidden="true" data-depth="0.1">${photo(ctx, 'buds-cut.png', { alt: '', cls: 'cut', sizes: '(min-width: 1024px) 240px, 34vw' })}</div>
</div>
<div class="h-story__copy">
<div class="h-head" data-reveal><p class="kicker">${esc(s.kicker)}</p><h2 id="h-story-title" class="display h-head__title">${esc(s.title)}</h2></div>
<p class="lede h-story__text" data-reveal style="--i:1">${esc(s.text)}</p>
<ol class="h-points" role="list">
${s.points.map((p, i) => `<li class="h-point" data-reveal style="--i:${i + 2}"><span class="h-point__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h3 class="h-point__title">${esc(p.title)}</h3><p class="h-point__text">${esc(p.text)}</p></div></li>`).join('\n')}
</ol>
<div class="btn-row" data-reveal style="--i:5"><a class="btn btn--gold"${linkAttrs(s.cta.href)}>${esc(s.cta.label)}${icon('arrow')}</a></div>
</div>
</div>
</section>`;
}

function testimonial(ctx) {
  const q = must(ctx.site.testimonial, 'site.testimonial');
  return `<section class="band h-quote" aria-label="Testimonial">
<div class="band__clip" aria-hidden="true"><div class="band__bg h-quote__bg">${gimg('g-smoke-glass', { alt: '', cls: 'screen', sizes: '100vw' })}</div><div class="h-quote__pool"></div></div>
<div class="wrap h-quote__wrap">
<figure class="glass glass--lit glass--strong h-quote__card" data-reveal>
<span class="h-quote__mark" aria-hidden="true">&ldquo;</span>
<blockquote class="h-quote__text"><p>${esc(q.quote)}</p></blockquote>
<figcaption class="h-quote__by">${esc(q.by)}</figcaption>
</figure>
</div>
</section>`;
}

function visit(ctx) {
  const st = must(ctx.site.store, 'site.store');
  return `<section class="band band--mist h-visit" aria-labelledby="h-visit-title">
<div class="wrap h-visit__grid">
<div class="h-visit__copy">
<div class="h-head" data-reveal><p class="kicker">Visit the shop</p><h2 id="h-visit-title" class="display h-head__title">${esc(st.name)}</h2></div>
<p class="h-visit__blurb" data-reveal style="--i:1">${esc(st.blurb)}</p>
<dl class="h-visit__facts" data-reveal style="--i:2">
<div class="h-fact">${icon('pin')}<dt>Address</dt><dd>${esc(st.address)}</dd></div>
<div class="h-fact">${icon('clock')}<dt>Hours</dt><dd>${esc(st.hours)}</dd></div>
<div class="h-fact">${icon('phone')}<dt>Phone</dt><dd><a href="tel:${escA(st.tel)}">${esc(st.phone)}</a></dd></div>
</dl>
<div class="btn-row" data-reveal style="--i:3"><a class="btn btn--leaf"${linkAttrs(st.directions.href)}>${esc(st.directions.label)}${icon('ext')}</a><a class="btn btn--ghost h-visit__store" href="/store/${escA(st.slug)}/">Store details</a></div>
</div>
<div class="h-visit__media" data-reveal style="--i:1">
${caseHtml(photo(ctx, 'interior.webp', { alt: photoAlt(ctx, 'interior.webp', 'Inside A&P Dispensary: black-framed glass cases along an exposed brick wall'), sizes: '(min-width: 1024px) 560px, 92vw' }), 'case--wide h-visit__case', ' data-tilt="3"')}
</div>
</div>
</section>`;
}

function inside(ctx) {
  const ins = must(ctx.content.home.inside, 'home.inside');
  const n = [1, 2, 3, 4, 5, 6];
  return `<section class="band band--void h-inside" aria-labelledby="h-inside-title">
<div class="band__clip" aria-hidden="true"><div class="h-inside__light"></div></div>
<div class="wrap wrap--wide">
${head('h-inside-title', ins.title, { lede: ins.text })}
</div>
<div class="h-inside__scroller" role="region" aria-label="${escA(ins.title)}" tabindex="0">
<ul class="h-inside__row" role="list">
${n.map((k, i) => `<li class="h-inside__item" data-reveal style="--i:${i}">${caseHtml(media(ctx, 'inside-' + k), 'case--tall h-inside__case')}</li>`).join('\n')}
</ul>
</div>
</section>`;
}

function learn(ctx) {
  const l = must(ctx.content.home.learn, 'home.learn');
  return `<section class="band h-learn" aria-labelledby="h-learn-title">
<div class="band__clip" aria-hidden="true"><div class="band__bg h-learn__film">${media(ctx, 'plants')}</div><div class="h-learn__grade"></div></div>
<div class="wrap">
<div class="h-split">
${head('h-learn-title', l.title)}
<a class="link-arrow h-split__link"${linkAttrs(l.all.href)}>${esc(l.all.label)}</a>
</div>
<ul class="h-learn__grid" role="list">
${l.cards.map((c, i) => `<li data-reveal style="--i:${i}"><a class="glass glass--lit glass--lift h-lcard"${linkAttrs(c.href)} data-tilt="3">
<span class="h-lcard__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
<h3 class="h-lcard__title">${esc(c.title)}</h3>
<p class="h-lcard__text">${esc(c.text)}</p>
<span class="link-arrow h-lcard__cta">${esc(c.cta)}</span>
</a></li>`).join('\n')}
</ul>
</div>
</section>`;
}

function faq(ctx) {
  const f = must(ctx.content.faq, 'faq');
  const items = must(f.groups && f.groups[0] && f.groups[0].items, 'faq.groups[0].items').slice(0, 4);
  return `<section class="band band--lit h-faq" aria-labelledby="h-faq-title" style="--lx:80%;--ly:20%">
<div class="wrap h-faq__grid">
<div class="h-faq__head">
${head('h-faq-title', f.hero && f.hero.title ? f.hero.title : 'FAQ', { kicker: f.groups[0].title || 'FAQ' })}
<a class="link-arrow" href="/faq/" data-reveal style="--i:1">All questions</a>
</div>
<div class="faq h-faq__list">
${items.map((it, i) => `<details class="faq__item" data-reveal style="--i:${i}"><summary class="faq__q">${esc(it.q)}</summary><div class="faq__a"><p>${esc(it.a)}</p></div></details>`).join('\n')}
</div>
</div>
</section>`;
}

export async function render(ctx) {
  const home = must(ctx.content && ctx.content.home, 'pages/home.json');
  const site = must(ctx.site, 'site.json');
  const st = must(site.store, 'site.store');
  const ogImage = hasGenerated('g-hero-case') ? imgUrl('g-hero-case', 1200) : '/assets/photos/storefront.webp';
  const store = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: site.name,
    url: absUrl(ctx, '/'),
    telephone: st.phone,
    address: { '@type': 'PostalAddress', streetAddress: st.street, addressLocality: st.locality, addressRegion: st.region, postalCode: st.postalCode, addressCountry: st.country },
    openingHours: 'Mo-Su 12:00-22:00',
    image: absUrl(ctx, '/assets/photos/storefront.webp'),
  };
  const filmMeta = ((ctx.images && ctx.images.media) || {})['store-room'];
  const preload = filmMeta && filmMeta.poster ? [{ href: filmMeta.poster, as: 'image', fetchpriority: 'high' }] : [];
  const main = [hero(ctx), ticker(ctx), deals(ctx), categories(ctx), products(ctx), story(ctx), testimonial(ctx), visit(ctx), inside(ctx), learn(ctx), faq(ctx)].join('\n');
  const html = page({
    ctx,
    path: '/',
    title: must(home.title, 'home.title'),
    description: must(home.description, 'home.description'),
    canonical: absUrl(ctx, '/'),
    og: { title: home.title, description: home.description, type: 'website', image: ogImage },
    jsonld: [store],
    bodyClass: 'header-over page-home',
    main,
    preload,
  });
  return [{ path: '/', html }];
}
