// util.mjs - shared helpers (main session owns this file; lanes import, never edit - ask through your report).
import { img, picture, imgUrl, hasGenerated } from '../lib/images.mjs';
export { img, picture, imgUrl, hasGenerated };

// Generated image by id (docs/BUILD-CONTRACT.md "Generated image ids"). While IMAGERY is still producing, a lane build
// with ALLOW_MISSING_GEN=1 gets a styled placeholder slot instead of a build failure; the final build (no env) fails on
// any missing id.
export function gimg(id, opts = {}) {
  if (hasGenerated(id) || process.env.ALLOW_MISSING_GEN !== '1') return img(id, opts);
  return `<span class="img-slot ${opts.cls || ''}" data-slot="${String(id).replace(/"/g, '')}" role="img" aria-label="${String(opts.alt || '').replace(/"/g, '&quot;')}"></span>`;
}

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escA = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const attrs = (o = {}) => Object.entries(o).filter(([, v]) => v !== false && v != null && v !== '').map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escA(v)}"`)).join('');
export const isExternal = (u) => /^(https?:)?\/\//i.test(String(u)) || /^(mailto|tel|sms):/i.test(String(u));

// Internal page paths are directories ("/shop" -> "/shop/"); "#frag" and "?q" survive; files ("/404.html",
// "/assets/...") are left alone. External URLs unchanged.
export function href(u) {
  const s = String(u ?? '');
  if (!s || isExternal(s) || s.startsWith('#')) return s;
  const m = s.match(/^([^?#]*)([?#].*)?$/);
  let p = m[1];
  const rest = m[2] || '';
  if (!p.startsWith('/')) return s;
  if (p.startsWith('/assets/') || /\.[a-z0-9]{2,5}$/i.test(p)) return s;
  if (!p.endsWith('/')) p += '/';
  return p + rest;
}

// <a> attributes for any URL: external links open in a new tab with rel noopener (mailto/tel stay in place).
export function linkAttrs(u, extra = {}) {
  const h = href(String(u ?? ''));
  const ext = /^(https?:)?\/\//i.test(h);
  return attrs({ href: h, ...(ext ? { target: '_blank', rel: 'noopener' } : {}), ...extra });
}

// Client photo by file name in assets/photos ("storefront.webp"): <img> with WebP variants + srcset.
export function photo(ctx, file, opts = {}) {
  const meta = ((ctx.images && ctx.images.photos) || {})[file] || {};
  return img({ src: '/assets/photos/' + file, alt: opts.alt != null ? opts.alt : meta.alt || '' }, opts);
}

export const slugify = (s) => String(s).toLowerCase().replace(/&[a-z]+;/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Absolute URL for canonicals / og:url on the preview origin (site.json origin).
export const absUrl = (ctx, p) => ctx.site.origin + href(p);

// Relative URL from one page directory to another ("/store/" -> "/shop/" = "../shop/"); used by redirect stubs so they
// work under any path prefix.
export function relPath(from, to) {
  const a = href(from).split('/').filter(Boolean);
  const b = href(to).split('/').filter(Boolean);
  return ('../'.repeat(a.length) + b.join('/') + (b.length ? '/' : '')) || './';
}

// ---------------------------------------------------------------- menu (src/content/menu.json)
export const money = (n) => (n == null ? '' : '$' + Number(n).toFixed(2));
export const category = (ctx, slug) => ctx.menu.categories.find((c) => c.slug === slug);
export const collection = (ctx, slug) => ctx.menu.collections.find((c) => c.slug === slug);
export const productsByIds = (ctx, ids) => (ids || []).map((id) => ctx.menu.products[String(id)]).filter(Boolean);
export const promoFor = (ctx, id) => ctx.menu.promotions.filter((p) => (p.productIds || []).includes(id));

// One product card (markup contract; styles are FOUNDATION's .pcard in components.css). Every value comes from A&P's
// live menu capture. The "+" is a demo button: site.js shows the toast "Preview menu: ordering connects at launch."
// opts: { eager, sizes, headingLevel ('h3'), showPromo (true), cls }
export function productCard(ctx, p, opts = {}) {
  const H = opts.headingLevel || 'h3';
  const promos = opts.showPromo === false ? [] : promoFor(ctx, p.id);
  const meta = [p.strain, p.thc ? 'THC ' + p.thc : null, p.cbd ? 'CBD ' + p.cbd : null].filter(Boolean);
  const media = p.image
    ? img({ src: p.image, alt: p.name, w: 500, h: 500 }, { cls: 'pcard__img', sizes: opts.sizes || '(min-width: 1024px) 220px, 44vw', eager: !!opts.eager })
    : `<span class="pcard__noimg" aria-hidden="true">${esc((p.name || '?').slice(0, 1))}</span>`;
  return `<article class="pcard${opts.cls ? ' ' + opts.cls : ''}" data-reveal>
<div class="pcard__media">${media}${promos.length ? `<span class="chip chip--deal pcard__flag">${esc(promos[0].name)}</span>` : ''}</div>
<div class="pcard__body">
${p.brand ? `<p class="pcard__brand">${esc(p.brand)}</p>` : ''}<${H} class="pcard__name">${esc(p.name)}</${H}>
${meta.length ? `<p class="pcard__meta">${meta.map(esc).join(' <span aria-hidden="true">·</span> ')}</p>` : ''}
<p class="pcard__price"><span class="pcard__amount">${esc(money(p.price))}</span>${p.options && p.options[0] && /[a-z]/i.test(p.options[0].label || '') ? ` <span class="pcard__unit">${esc(p.options[0].label)}</span>` : ''}</p>
</div>
<button class="pcard__add" type="button" data-demo-add aria-label="Add ${escA(p.name)} (preview)"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14"/></svg></button>
</article>`;
}

// Video by registry id (src/content/images.json "media"): muted decorative loop with poster; reduced motion = poster.
// opts: { cls, eager, label (accessible name when not decorative), controls }
export function media(ctx, id, opts = {}) {
  const m = ((ctx.images && ctx.images.media) || {})[id];
  if (!m) {
    if (process.env.ALLOW_MISSING_GEN === '1') return `<span class="img-slot ${opts.cls || ''}" data-slot="${escA(id)}"></span>`;
    throw new Error('missing image: unknown media id "' + id + '"');
  }
  const a = opts.label ? ` role="img" aria-label="${escA(opts.label)}"` : ' aria-hidden="true"';
  return `<video class="${escA(opts.cls || '')}" muted loop playsinline${opts.controls ? ' controls' : ' autoplay'} preload="${opts.eager ? 'auto' : 'none'}" poster="${escA(m.poster)}" width="${m.w}" height="${m.h}" data-video${a}>${m.mp4Small ? `<source src="${escA(m.mp4Small)}" type="video/mp4" media="(max-width: 700px)">` : ''}<source src="${escA(m.mp4)}" type="video/mp4"></video>`;
}

// Preview forms are NOT wired to any service: every form renders with data-demo-form; site.js stops the submit and
// shows the inline note. Use demoForm() for every form so the wording stays one sentence site-wide.
export const DEMO_NOTE = 'This preview form is not connected yet, so nothing is sent.';
export function demoForm({ id = '', fields = [], button = 'Submit', cls = '', textarea = [] } = {}) {
  const field = (f) => {
    const name = slugify(f);
    if (textarea.includes(f)) return `<label class="demo-form__field demo-form__field--wide"><span class="demo-form__label">${esc(f)}</span><textarea class="demo-form__input" name="${name}" rows="4"></textarea></label>`;
    const type = /email/i.test(f) ? 'email' : /phone/i.test(f) ? 'tel' : 'text';
    return `<label class="demo-form__field"><span class="demo-form__label">${esc(f)}</span><input class="demo-form__input" type="${type}" name="${name}" autocomplete="${/email/i.test(f) ? 'email' : /phone/i.test(f) ? 'tel' : /name/i.test(f) ? 'name' : 'off'}"></label>`;
  };
  return `<form class="demo-form ${cls}" data-demo-form method="post" action="#" novalidate${id ? ` id="${escA(id)}"` : ''}>
${fields.map(field).join('\n')}
<button class="btn btn--leaf demo-form__btn" type="submit">${esc(button)}</button>
<p class="demo-form__note" data-demo-note hidden role="status">${esc(DEMO_NOTE)}</p>
</form>`;
}
