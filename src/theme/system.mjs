// system.mjs - /404.html (with the full chrome) and one noindex redirect stub per ia.redirects entry (FOUNDATION).
// Stubs use a RELATIVE meta refresh (relPath) so they work under any path prefix; the canonical is absolute.
import { esc, escA, href, linkAttrs, absUrl, relPath } from './util.mjs';
import { page, icon } from './shell.mjs';

function notFound(ctx) {
  const main = `<section class="band band--void band--lit sys404" data-spot>
<div class="band__clip" aria-hidden="true"><span class="band__bg sys404__bg"></span><span class="grain"></span></div>
<div class="wrap wrap--narrow sys404__in">
<img class="sys404__mark" src="/assets/brand/ap-mark.png" width="347" height="347" alt="" data-reveal>
<p class="kicker" data-reveal style="--i:1">404</p>
<h1 class="display sys404__h" data-reveal style="--i:2">Page not found</h1>
<p class="lede" data-reveal style="--i:3">This page is not here. Try the menu or start from home.</p>
<div class="btn-row sys404__btns" data-reveal style="--i:4">
<a class="btn btn--leaf"${linkAttrs('/shop/')}>${esc(ctx.ia.cta.label)} ${icon('arrow')}</a>
<a class="btn btn--glass" href="/">Home</a>
</div>
</div>
</section>`;
  return page({
    ctx,
    path: '/404.html',
    title: 'Page not found | ' + ctx.site.name,
    description: 'This page could not be found. ' + ctx.site.name + ', ' + ctx.site.store.address + '.',
    canonical: absUrl(ctx, '/404.html'),
    bodyClass: 'is-404',
    main,
  });
}

function stub(ctx, from, to) {
  const target = href(to);
  const rel = relPath(from, to);
  const canon = absUrl(ctx, target);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting | ${esc(ctx.site.name)}</title>
<meta name="description" content="This page moved to ${escA(canon)}.">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escA(canon)}">
<meta http-equiv="refresh" content="0; url=${escA(rel)}">
<meta name="theme-color" content="#000000">
<style>html{background:#000;color:#ebe7d7;font:16px/1.6 system-ui,sans-serif}main{max-width:40rem;margin:20vh auto;padding:0 24px}h1{font-size:1.4rem;margin:0 0 .5rem}a{color:#62dc45}</style>
</head>
<body>
<main id="main">
<h1>This page moved</h1>
<p><a href="${escA(rel)}">Continue to ${esc(target)}</a></p>
</main>
</body>
</html>`;
}

export async function render(ctx) {
  const out = [{ path: '/404.html', html: notFound(ctx) }];
  for (const r of ctx.ia.redirects || []) out.push({ path: href(r.from), html: stub(ctx, r.from, r.to) });
  return out;
}
