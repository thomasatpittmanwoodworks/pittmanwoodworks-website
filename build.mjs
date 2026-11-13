// Netlify build: copies the site into dist/ and generates the blog from content/blog/*.json.
// No dependencies, so it runs the same locally (node build.mjs) and on Netlify.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist');
const SITE = 'https://www.pittmanwoodworks.com';
const SKIP = new Set(['dist', 'content', 'node_modules', '.git', '.github', 'build.mjs', 'netlify.toml', 'README.md', 'package.json', 'package-lock.json']);

/* ---------- copy the static site ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name) || name.startsWith('.')) continue;
  fs.cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (d) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Small Markdown renderer for what the admin editor produces:
   headings, paragraphs, bold/italic, links, images, lists, quotes, rules, code. */
function inline(t) {
  let s = esc(t);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, src, title) =>
    `<img src="${src}" alt="${alt}" loading="lazy"${title ? ` title="${title}"` : ''}>`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) => {
    const ext = /^https?:\/\//.test(href) && !href.includes('pittmanwoodworks.com');
    return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${txt}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>').replace(/(^|[^\w])_([^_\n]+)_/g, '$1<em>$2</em>');
  s = s.replace(/\\\n/g, '<br>').replace(/ {2,}\n/g, '<br>');
  return s;
}
function markdown(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = []; let i = 0;
  const isBlockStart = (l) => /^(#{1,6}\s|>|\s*[-*+]\s|\s*\d+[.)]\s|```|(-{3,}|\*{3,}|_{3,})\s*$)/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if (line.startsWith('```')) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); continue;
    }
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      const lvl = Math.min(Math.max(m[1].length, 2), 4); // keep h1 for the post title
      out.push(`<h${lvl} id="${slugify(m[2])}">${inline(m[2].replace(/\s+#+\s*$/, ''))}</h${lvl}>`); i++; continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (line.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(q.join('\n'))}</blockquote>`); continue;
    }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line); const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
        let item = lines[i++].replace(/^\s*([-*+]|\d+[.)])\s+/, '');
        while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) item += '\n' + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
        while (i < lines.length && !lines[i].trim() && i + 1 < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i + 1])) i++;
      }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`); continue;
    }
    const para = [line]; i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) para.push(lines[i++]);
    const text = para.join('\n');
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(text.trim())) out.push(`<figure>${inline(text.trim())}</figure>`);
    else out.push(`<p>${inline(text)}</p>`);
  }
  return out.join('\n');
}

/* ---------- load posts ---------- */
const DIR = path.join(ROOT, 'content', 'blog');
const posts = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => {
  const p = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const slug = slugify(p.slug || f.replace(/\.json$/, ''));
  const date = new Date(p.date || Date.now());
  const words = String(p.body || '').split(/\s+/).filter(Boolean).length;
  return { ...p, slug, date, minutes: Math.max(1, Math.round(words / 225)) };
}).filter((p) => p.title && !p.draft && p.date <= new Date())
  .sort((a, b) => b.date - a.date) : [];

/* ---------- shared page chrome (taken from the homepage so it always matches) ---------- */
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const header = home.match(/<header class="top">[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer>[\s\S]*?<\/footer>/)[0];
const fonts = home.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/)[0];
const img = (p, w) => (/^\//.test(p) ? `/.netlify/images?url=${encodeURIComponent(p)}&w=${w}&q=80` : p);
const abs = (p) => (/^https?:/.test(p) ? p : SITE + p);

function page({ title, description, canonical, image, jsonld, main, type = 'website' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
${image ? `<meta property="og:image" content="${esc(abs(img(image, 1200)))}">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="alternate" type="application/rss+xml" title="Pittman Woodworks blog" href="/blog/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
<link rel="stylesheet" href="/styles.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
${header}

<main>
${main}
</main>

${footer}
<script src="/site.js"></script>
</body>
</html>
`;
}

const CATS = { spotlight: 'Project spotlight', guide: 'Guides', news: 'Company news', industry: 'Industry insights' };
const cat = (p) => CATS[p.category] || 'Insights';
const meta = (p) => `<span>${esc(cat(p))}</span><span>${fmtDate(p.date)}</span><span>${p.minutes} min read</span>`;
const card = (p) => `<a class="post-card" href="/blog/${p.slug}" data-cat="${esc(p.category || '')}">
  <span class="post-img"${p.image ? ` style="background-image:url('${esc(img(p.image, 800))}')"` : ''}>${p.image ? '' : '<span class="post-noimg">PW</span>'}</span>
  <span class="post-meta">${meta(p)}</span>
  <b>${esc(p.title)}</b>
  ${p.summary ? `<span class="post-sum">${esc(p.summary)}</span>` : ''}
  <span class="go">Read article</span>
</a>`;
const CTA = `<section class="cta-band"><div class="wrap"><div><h2>Have a project out to bid?</h2><p>Send us your plans and specifications. We respond to every bid request within one business day.</p></div><div class="ctas"><a class="btn" href="/bidding#bid">Submit plans for bid</a><a class="btn ghost" href="/contact">Contact our team</a></div></div></section>`;

/* ---------- blog index ---------- */
fs.mkdirSync(path.join(OUT, 'blog'), { recursive: true });
const usedCats = [...new Set(posts.map((p) => p.category).filter((c) => CATS[c]))];
const [lead, ...rest] = posts;
const indexMain = `<section class="pg-hero"><div class="wrap"><p class="tag">Blog</p><h1>News &amp; insights</h1><p class="sub">Project spotlights, practical casework guides and news from the Pittman Woodworks shop, posted every week.</p></div></section>
<section class="sheet blog-list"><div class="wrap">
${posts.length ? `
  ${usedCats.length > 1 ? `<div class="blog-filter" role="group" aria-label="Filter posts"><button type="button" aria-pressed="true" data-f="">All</button>${usedCats.map((c) => `<button type="button" aria-pressed="false" data-f="${c}">${CATS[c]}</button>`).join('')}</div>` : ''}
  <a class="post-lead" href="/blog/${lead.slug}" data-cat="${esc(lead.category || '')}">
    <span class="post-img"${lead.image ? ` style="background-image:url('${esc(img(lead.image, 1400))}')"` : ''}>${lead.image ? '' : '<span class="post-noimg">PW</span>'}</span>
    <span class="lead-txt"><span class="post-meta">${meta(lead)}</span><b>${esc(lead.title)}</b>${lead.summary ? `<span class="post-sum">${esc(lead.summary)}</span>` : ''}<span class="go">Read article</span></span>
  </a>
  ${rest.length ? `<div class="post-grid">${rest.map(card).join('\n')}</div>` : ''}
` : `<div class="blog-empty"><b>First posts coming soon.</b><p>Check back for project spotlights and practical guides from our shop.</p></div>`}
</div></section>
${CTA}
<script>
(function(){var bs=document.querySelectorAll('.blog-filter button');bs.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f');
  bs.forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
  document.querySelectorAll('.post-lead,.post-card').forEach(function(c){c.hidden=!!f&&c.getAttribute('data-cat')!==f})})})})();
</script>`;
fs.writeFileSync(path.join(OUT, 'blog', 'index.html'), page({
  title: 'Blog · Pittman Woodworks',
  description: 'Project spotlights, commercial casework guides and news from Pittman Woodworks in North Richland Hills, Texas.',
  canonical: `${SITE}/blog/`, main: indexMain,
}));

/* ---------- post pages ---------- */
for (const p of posts) {
  const more = posts.filter((x) => x !== p).slice(0, 3);
  const author = p.author || 'Pittman Woodworks';
  const main = `<article>
<section class="pg-hero post-hero"><div class="wrap">
  <nav class="crumb" aria-label="Breadcrumb"><a href="/blog/">Blog</a><span>/</span><span>${esc(cat(p))}</span></nav>
  <h1>${esc(p.title)}</h1>
  ${p.summary ? `<p class="sub">${esc(p.summary)}</p>` : ''}
  <p class="post-byline"><span>By ${esc(author)}</span><span>${fmtDate(p.date)}</span><span>${p.minutes} min read</span></p>
</div></section>
<div class="wrap post-wrap">
  ${p.image ? `<figure class="post-cover"><img src="${esc(img(p.image, 1600))}" alt="${esc(p.imageAlt || p.title)}"></figure>` : ''}
  <div class="prose">
${markdown(p.body)}
  </div>
  <div class="post-end"><a class="sec-link" href="/blog/">All posts</a><button class="btn ghost sm" type="button" id="shareBtn">Copy link</button></div>
</div>
</article>
${more.length ? `<section class="sheet" style="padding-top:0"><div class="wrap"><div class="head-row"><div class="sheet-head"><span class="no">Keep reading</span><h2>More from the shop</h2></div><a class="sec-link" href="/blog/">All posts</a></div><div class="post-grid">${more.map(card).join('\n')}</div></div></section>` : ''}
${CTA}
<script>
(function(){var b=document.getElementById('shareBtn');if(!b)return;b.addEventListener('click',function(){
  var done=function(){b.textContent='Link copied';setTimeout(function(){b.textContent='Copy link'},1800)};
  try{navigator.clipboard.writeText(location.href).then(done,function(){prompt('Copy this link:',location.href)})}catch(e){}})})();
</script>`;
  fs.writeFileSync(path.join(OUT, 'blog', `${p.slug}.html`), page({
    title: `${p.title} · Pittman Woodworks`,
    description: p.summary || `${p.title}, from the Pittman Woodworks blog.`,
    canonical: `${SITE}/blog/${p.slug}`, image: p.image, type: 'article', main,
    jsonld: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.summary || '',
      datePublished: p.date.toISOString(), author: { '@type': 'Person', name: author },
      publisher: { '@type': 'Organization', name: 'Pittman Woodworks' }, mainEntityOfPage: `${SITE}/blog/${p.slug}`,
      ...(p.image ? { image: abs(p.image) } : {}) },
  }));
}

/* ---------- RSS feed + sitemap ---------- */
fs.writeFileSync(path.join(OUT, 'blog', 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Pittman Woodworks blog</title><link>${SITE}/blog/</link><description>Project spotlights, casework guides and shop news.</description>
${posts.slice(0, 30).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/blog/${p.slug}</link><guid>${SITE}/blog/${p.slug}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.summary || '')}</description></item>`).join('\n')}
</channel></rss>
`);
const smPath = path.join(OUT, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
const blogUrls = [`${SITE}/blog/`, ...posts.map((p) => `${SITE}/blog/${p.slug}`)];
sm = sm.replace('</urlset>', blogUrls.map((u) => `  <url><loc>${u}</loc></url>\n`).join('') + '</urlset>');
fs.writeFileSync(smPath, sm);

console.log(`Built site with ${posts.length} published blog post(s).`);
