// shell.mjs - the chrome on every page (FOUNDATION): <head>, utility bar, main bar with the Shop / Deals / Resources
// mega menus, the category bar, the drawer below 1024px, the footer, the 21+ gate and the toast region.
// Fixed API (every lane calls it):
//   page({ ctx, path, title, description, canonical, og, jsonld, bodyClass, main, crumbs, heroCrumbs, scripts, preload })
//     main       the page's <main> INNER html (page() wraps it in <main id="main">)
//     crumbs     [[href, label], ...] (last = current page) -> a breadcrumb bar under the header; when heroCrumbs is
//                true the template prints crumbsHtml(crumbs) itself inside its hero and page() prints none
//     og         { title, description, type ('website'), image (root-absolute or absolute URL) }
//     jsonld     array of objects -> <script type="application/ld+json">
//     bodyClass  extra body classes; "header-over" lets the header float over the first band (the band then needs
//                padding-top: var(--header-h) for its content)
//     scripts    extra script file names under /assets/js/ (site.js is always loaded)
//     preload    [{ href, as, type, media, imagesrcset, imagesizes, fetchpriority }] -> <link rel="preload">
//   crumbsHtml(crumbs), icon(name, cls), CSS_ORDER
// Every visible word comes from site.json / ia.json / menu.json, except neutral glue (Menu, Close menu, Search,
// Account, Cart, Skip to content).
import { esc, escA, attrs, href, linkAttrs, absUrl, gimg, photo, demoForm } from './util.mjs';

export const CSS_ORDER = ['fonts', 'tokens', 'base', 'components', 'motion', 'shell', 'home', 'shop', 'pages', 'mobile', 'fix'];

const ICON = {
  ext: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
  close: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  bag: '<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  cart: '<path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="M14 10h4M14 14h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
  play: '<path d="M8 5v14l11-7Z"/>',
  pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
};
export const icon = (name, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[name] || ''}</svg>`;

// Breadcrumbs: separators are a CSS "/" (contract D10: no dash separators).
export function crumbsHtml(crumbs) {
  if (!crumbs || !crumbs.length) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs.map(([h, l], i) => (i < crumbs.length - 1 ? `<li><a href="${escA(href(h))}">${esc(l)}</a></li>` : `<li aria-current="page">${esc(l)}</li>`)).join('')}</ol></nav>`;
}

// ---------------------------------------------------------------- pieces
const isCurrent = (path, h) => {
  const a = href(path || '/');
  const b = href(h || '');
  if (!b || b === '/') return a === '/';
  return a === b || a.startsWith(b);
};

// mega image card: "g-..." = generated id (gimg), "p-<name>" = A&P photo assets/photos/<name>.webp
function cardImage(ctx, id) {
  if (String(id).startsWith('p-')) return photo(ctx, String(id).slice(2) + '.webp', { alt: '', cls: 'mega__img', sizes: '300px' });
  return gimg(id, { alt: '', cls: 'mega__img', sizes: '300px' });
}

function megaCard(ctx, c) {
  return `<a class="mega__card case"${linkAttrs(c.href)}>
<span class="case__media">${cardImage(ctx, c.image)}</span><span class="case__glass" aria-hidden="true"></span><span class="case__light" aria-hidden="true"></span>
<span class="mega__card-text"><span class="mega__card-title">${esc(c.title)}</span><span class="mega__card-sub">${esc(c.text)}</span></span>
</a>`;
}

function megaCols(cols) {
  return cols.map((c) => `<div class="mega__col">
<p class="mega__title">${esc(c.title)}</p>
<ul class="mega__links">${c.links.map((l) => `<li><a class="mega__link"${linkAttrs(l.href)}>${esc(l.label)}</a></li>`).join('')}</ul>
${c.all ? `<a class="link-arrow mega__all"${linkAttrs(c.all.href)}>${esc(c.all.label)} ${icon('arrow')}</a>` : ''}
</div>`).join('');
}

function megaPanel(ctx, key) {
  const m = ctx.ia.megas[key];
  if (!m) return '';
  let inner = '';
  if (key === 'deals') {
    const promos = (ctx.menu.promotions || []).slice(0, m.max || 8);
    inner = `<div class="mega__deals">
<p class="mega__title">${esc(m.title)}</p>
<ul class="mega__promos">${promos.map((p) => `<li><a class="mega__promo"${linkAttrs(m.all.href)}><span class="mega__promo-ico" aria-hidden="true">${icon('tag')}</span><span class="mega__promo-text"><span class="mega__promo-name">${esc(p.name)}</span><span class="mega__promo-desc">${esc(p.description || '')}</span></span></a></li>`).join('')}</ul>
<a class="btn btn--gold btn--sm mega__cta"${linkAttrs(m.all.href)}>${esc(m.all.label)} ${icon('arrow')}</a>
</div>`;
  } else {
    inner = `<div class="mega__cols mega__cols--${(m.columns || []).length}">${megaCols(m.columns || [])}</div>
<div class="mega__cards mega__cards--${(m.cards || []).length}">${(m.cards || []).map((c) => megaCard(ctx, c)).join('')}</div>`;
  }
  return `<div class="mega mega--${key}" id="mega-${key}" data-mega-panel>
<div class="mega__pane"><div class="wrap wrap--wide mega__in">${inner}</div></div>
</div>`;
}

function desktopNav(ctx, path) {
  return ctx.ia.nav.map((n) => {
    const cur = isCurrent(path, n.href) ? ' aria-current="page"' : '';
    if (!n.mega) return `<li class="nav__item"><a class="nav__link"${linkAttrs(n.href)}${cur}>${esc(n.label)}</a></li>`;
    return `<li class="nav__item nav__item--mega" data-mega>
<a class="nav__link"${linkAttrs(n.href)}${cur}>${esc(n.label)}</a><button class="nav__trigger" type="button" aria-expanded="false" aria-controls="mega-${escA(n.mega)}"><span class="sr-only">${esc(n.label)} menu</span>${icon('chev')}</button>
${megaPanel(ctx, n.mega)}
</li>`;
  }).join('');
}

function categoryBar(ctx, path) {
  const items = ctx.ia.categoryBar || [];
  const out = [];
  for (const c of items) {
    if (c.children) {
      out.push(`<li class="cbar__item cbar__item--more"><details class="cbar__more" data-more><summary class="cbar__link">${esc(c.label)} ${icon('chev')}</summary>
<ul class="cbar__menu glass glass--strong">${c.children.map((k) => `<li><a class="cbar__menu-link"${linkAttrs(k.href)}${isCurrent(path, k.href) ? ' aria-current="page"' : ''}>${esc(k.label)}</a></li>`).join('')}</ul></details></li>`);
      // the same children inline for the phone scroller (no dropdown inside a scrolling strip)
      for (const k of c.children) out.push(`<li class="cbar__item cbar__item--flat"><a class="cbar__link"${linkAttrs(k.href)}${isCurrent(path, k.href) ? ' aria-current="page"' : ''}>${esc(k.label)}</a></li>`);
    } else {
      out.push(`<li class="cbar__item"><a class="cbar__link"${linkAttrs(c.href)}${isCurrent(path, c.href) ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`);
    }
  }
  return `<nav class="cbar" aria-label="Product categories"><div class="wrap wrap--wide cbar__in"><ul class="cbar__list">${out.join('')}</ul></div></nav>`;
}

function utilityBar(ctx) {
  const u = ctx.ia.utility;
  const s = ctx.site.store;
  return `<div class="util">
<div class="wrap wrap--wide util__in">
<p class="util__info">${ctx.site.topbar.map((t, i) => `${i ? '<span class="util__sep" aria-hidden="true">·</span>' : ''}<span>${esc(t)}</span>`).join('')}</p>
<div class="util__right">
<a class="util__store"${linkAttrs(u.store.href)}>${icon('pin')}<span class="util__store-text"><span class="util__store-name">${esc(u.store.label)}</span><span class="util__store-sub">${esc(u.store.sub)}</span></span></a>
${u.links.map((l) => `<a class="util__link"${linkAttrs(l.href)}>${esc(l.label)}</a>`).join('')}
<a class="util__link util__phone" href="tel:${escA(s.tel)}">${icon('phone')}<span>${esc(s.phoneShort)}</span></a>
</div>
</div>
</div>`;
}

function brandLink(ctx) {
  return `<a class="brand" href="/" aria-label="${escA(ctx.site.name)} home"><img class="brand__mark" src="/assets/brand/ap-mark.png" width="347" height="347" alt=""><img class="brand__word" src="/assets/brand/ap-wordmark-white.png" width="336" height="49" alt=""></a>`;
}

function drawer(ctx, path) {
  const ia = ctx.ia;
  const s = ctx.site.store;
  const group = (n) => {
    const m = ia.megas[n.mega];
    let links = [];
    if (n.mega === 'deals') {
      links = (ctx.menu.promotions || []).slice(0, m.max || 8).map((p) => ({ label: p.name, href: m.all.href }));
      links.push({ label: m.all.label, href: m.all.href });
    } else {
      for (const c of m.columns || []) { links.push(...c.links); if (c.all) links.push(c.all); }
      for (const c of m.cards || []) if (!links.some((l) => href(l.href) === href(c.href))) links.push({ label: c.title, href: c.href });
    }
    const seen = new Set();
    links = links.filter((l) => { const k = l.label + '|' + href(l.href); if (seen.has(k)) return false; seen.add(k); return true; });
    return `<li class="drawer__group"><details class="drawer__details"${isCurrent(path, n.href) ? ' open' : ''}>
<summary class="drawer__sum">${esc(n.label)} ${icon('chev')}</summary>
<ul class="drawer__sub">
<li><a class="drawer__sublink drawer__sublink--main"${linkAttrs(n.href)}>${esc(n.label)} ${icon('arrow')}</a></li>
${links.map((l) => `<li><a class="drawer__sublink"${linkAttrs(l.href)}>${esc(l.label)}</a></li>`).join('')}
</ul></details></li>`;
  };
  return `<div class="drawer" id="drawer" data-drawer hidden>
<div class="drawer__scrim" data-drawer-scrim></div>
<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
<div class="drawer__head">${brandLink(ctx)}<button class="drawer__close icon-btn" type="button" data-drawer-close>${icon('close')}<span class="sr-only">Close menu</span></button></div>
<a class="drawer__store"${linkAttrs(ia.utility.store.href)}>${icon('pin')}<span><span class="util__store-name">${esc(ia.utility.store.label)}</span><span class="util__store-sub">${esc(ia.utility.store.sub)}</span></span></a>
<ul class="drawer__list">
${ia.nav.map((n) => (n.mega ? group(n) : `<li><a class="drawer__link"${linkAttrs(n.href)}${isCurrent(path, n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`)).join('\n')}
${ia.utility.links.map((l) => `<li><a class="drawer__link"${linkAttrs(l.href)}>${esc(l.label)}</a></li>`).join('')}
</ul>
<div class="drawer__foot">
<a class="btn btn--leaf"${linkAttrs(ia.cta.href)}>${esc(ia.cta.label)} ${icon('arrow')}</a>
<a class="btn btn--glass" href="tel:${escA(s.tel)}">${icon('phone')} ${esc(s.phoneShort)}</a>
<p class="drawer__hours">${ctx.site.topbar.map(esc).join(' · ')}</p>
</div>
</div>
</div>`;
}

function header(ctx, path) {
  const ia = ctx.ia;
  return `<header class="hdr" data-header>
${utilityBar(ctx)}
<div class="bar">
<div class="wrap wrap--wide bar__in">
${brandLink(ctx)}
<nav class="nav" aria-label="Main"><ul class="nav__list">${desktopNav(ctx, path)}</ul></nav>
<div class="bar__tools">
<a class="icon-btn bar__tool" href="/shop/">${icon('search')}<span class="sr-only">Search</span></a>
<a class="icon-btn bar__tool bar__tool--acct" href="/drops/">${icon('user')}<span class="sr-only">Account</span></a>
<a class="icon-btn bar__tool" href="/shop/">${icon('cart')}<span class="sr-only">Cart</span></a>
<a class="btn btn--leaf btn--sm bar__cta"${linkAttrs(ia.cta.href)}>${esc(ia.cta.label)}</a>
<button class="icon-btn bar__toggle" type="button" data-drawer-toggle aria-expanded="false" aria-controls="drawer">${icon('menu')}<span class="sr-only">Menu</span></button>
</div>
</div>
</div>
${categoryBar(ctx, path)}
</header>`;
}

function footer(ctx) {
  const site = ctx.site;
  const s = site.store;
  const nl = site.newsletter;
  const link = site.compliancePlainLink;
  const compliance = esc(site.compliance).replace(esc(link.text), `<a${linkAttrs(link.href)}>${esc(link.text)}</a>`);
  const form = demoForm({ fields: [nl.field], button: nl.button, cls: 'demo-form--inline foot__form' });
  return `<footer class="foot">
<section class="foot__news band band--glow" aria-labelledby="foot-news-title">
<div class="band__clip" aria-hidden="true"><span class="band__bg foot__news-bg"></span><span class="grain"></span></div>
<div class="wrap foot__news-in">
<div class="foot__news-copy">
<h2 class="foot__news-title display" id="foot-news-title">${esc(nl.title)}</h2>
<p class="foot__news-text">${esc(nl.text)}</p>
</div>
<div class="foot__news-form glass glass--lit">
${form}
<p class="foot__news-note">${esc(nl.note)}</p>
</div>
</div>
</section>
<div class="foot__main">
<div class="wrap wrap--wide foot__grid">
<div class="foot__brand">
<a class="foot__logo" href="/" aria-label="${escA(site.name)} home"><img src="/assets/brand/ap-logo-white.png" width="347" height="396" alt="" loading="lazy" decoding="async"></a>
<p class="foot__blurb">${esc(site.footerBlurb)}</p>
<ul class="foot__social">${site.social.map((x) => `<li><a class="chip"${linkAttrs(x.href)}>${esc(x.name)} ${icon('ext')}</a></li>`).join('')}</ul>
</div>
${ctx.ia.footer.columns.map((c) => `<div class="foot__col">
<p class="foot__title">${esc(c.title)}</p>
<ul class="foot__links">${c.links.map((l) => `<li><a class="foot__link"${linkAttrs(l.href)}>${esc(l.label)}</a></li>`).join('')}</ul>
</div>`).join('\n')}
<div class="foot__col foot__visit">
<p class="foot__title">FIND US</p>
<p class="foot__line">${icon('pin')}<a${linkAttrs(s.directions.href)}>${esc(s.address)}</a></p>
<p class="foot__title foot__title--2">CONTACT</p>
<p class="foot__line">${icon('clock')}<span>${esc(s.hours)}</span></p>
<p class="foot__line">${icon('phone')}<a href="tel:${escA(s.tel)}">${esc(s.phone)}</a></p>
</div>
</div>
<div class="wrap wrap--wide foot__legal">
<p class="foot__compliance">${compliance}</p>
<p class="foot__license">${esc(s.license)}</p>
<p class="foot__copy">© 2026 ${esc(site.name)}</p>
</div>
</div>
<div class="foot__mark" aria-hidden="true"><span class="foot__mark-text">A&amp;P</span></div>
</footer>`;
}

function gate(ctx) {
  const g = ctx.site.ageGate;
  return `<div class="gate" data-age-gate data-age-key="${escA(g.storageKey || 'ap-age-ok')}" hidden>
<div class="gate__bg" aria-hidden="true"></div>
<div class="gate__panel glass glass--strong glass--lit" role="dialog" aria-modal="true" aria-labelledby="gate-q" aria-describedby="gate-t">
<img class="gate__mark" src="/assets/brand/ap-mark.png" width="347" height="347" alt="">
<p class="kicker">${esc(g.kicker)}</p>
<h2 class="gate__q" id="gate-q">${esc(g.question)}</h2>
<p class="gate__t" id="gate-t">${esc(g.text)}</p>
<div class="btn-row gate__btns"><button class="btn btn--leaf" type="button" data-age-yes>${esc(g.yes)}</button><button class="btn btn--ghost" type="button" data-age-no>${esc(g.no)}</button></div>
<p class="gate__msg" data-age-msg hidden role="status">Sorry, this site is only for adults 21 years of age and older.</p>
</div>
</div>`;
}

const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const absImg = (ctx, u) => (/^https?:/i.test(String(u)) ? String(u) : absUrl(ctx, u));

// ---------------------------------------------------------------- page
export function page({ ctx, path, title, description, canonical, og = {}, jsonld = [], bodyClass = '', main = '', crumbs, heroCrumbs = false, scripts = [], preload = [] }) {
  const css = ctx.cssFiles.map((f) => `<link rel="stylesheet" href="/assets/css/${f}.css">`).join('\n');
  const canon = canonical || absUrl(ctx, path);
  const ogTitle = og.title || title;
  const ogDesc = og.description || description;
  const ogImage = absImg(ctx, og.image || '/assets/brand/ap-logo-white.png');
  const pre = (preload || []).map((p) => `<link rel="preload"${attrs({ href: p.href, as: p.as, type: p.type, media: p.media, imagesrcset: p.imagesrcset, imagesizes: p.imagesizes, fetchpriority: p.fetchpriority, crossorigin: p.as === 'font' ? 'anonymous' : null })}>`).join('\n');
  const ld = (jsonld || []).filter(Boolean).map((o) => `<script type="application/ld+json">${ldJson(o)}</script>`).join('\n');
  const extra = (scripts || []).map((s) => `<script src="/assets/js/${escA(s)}" defer></script>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${escA(description)}">
<link rel="canonical" href="${escA(canon)}">
<meta property="og:site_name" content="${escA(ctx.site.name)}">
<meta property="og:title" content="${escA(ogTitle)}">
<meta property="og:description" content="${escA(ogDesc)}">
<meta property="og:url" content="${escA(canon)}">
<meta property="og:type" content="${escA(og.type || 'website')}">
<meta property="og:image" content="${escA(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fbf9f3">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/archivo-black-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/figtree-var.woff2" as="font" type="font/woff2" crossorigin>
${pre}
${css}
${ld}
</head>
<body class="${escA(['page', bodyClass].filter(Boolean).join(' '))}">
<a class="skip" href="#main">Skip to content</a>
${header(ctx, path)}
${drawer(ctx, path)}
${crumbs && !heroCrumbs ? `<div class="crumbs-bar"><div class="wrap wrap--wide">${crumbsHtml(crumbs)}</div></div>` : ''}
<main id="main" tabindex="-1">
${main}
</main>
${footer(ctx)}
${gate(ctx)}
<div class="toast" data-toast role="status" aria-live="polite"></div>
<script src="/assets/js/site.js" defer></script>
${extra}
</body>
</html>`;
}
