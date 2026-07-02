// Prerender SPA routes to static HTML for SEO.
//
// Stopgap before the Next.js migration: the site is a client-rendered Vite +
// React SPA, so crawlers that don't execute JS (and JS-capable crawlers on a
// tight budget) see an empty <div id="root">. This script serves the built
// dist/ folder, visits each route with a headless browser, waits for React +
// Sanity content + the react-helmet-async <head> to settle, then writes the
// fully rendered HTML back to dist/<route>/index.html.
//
// Run after `vite build` (wired up as the `postbuild` npm script).

import http from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 4567;
const ORIGIN = `http://localhost:${PORT}`;

// Seed routes — the static pages defined in src/app/routes.tsx. Dynamic detail
// pages (/portfolio/:slug, /shop/:slug) are discovered by crawling links on
// these pages. Checkout pages are intentionally excluded (no SEO value, and
// they expect Stripe redirect params).
const SEED_ROUTES = [
  '/',
  '/portfolio',
  '/shop',
  '/commissions',
  '/celebrate',
  '/about',
  '/contact',
];

// Paths we never want to prerender even if linked.
const EXCLUDE = [/^\/checkout(\/|$)/];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

// Minimal static file server with SPA history fallback so client-side routes
// resolve to index.html (and React Router takes over from there).
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        let filePath = path.join(DIST, urlPath);

        let isFile = false;
        try {
          const s = await stat(filePath);
          if (s.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
            isFile = true;
          } else {
            isFile = s.isFile();
          }
        } catch {
          isFile = false;
        }

        // Fallback: anything without a file extension is treated as an SPA
        // route and served the root index.html.
        if (!isFile) {
          if (path.extname(urlPath)) {
            res.statusCode = 404;
            res.end('Not found');
            return;
          }
          filePath = path.join(DIST, 'index.html');
        }

        res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
        createReadStream(filePath).pipe(res);
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

// Where the rendered HTML for a given route is written.
function outputPathFor(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

// Canonical origin used in the generated sitemap. Must match the <link
// rel="canonical"> tags rendered by the pages (react-helmet-async).
const SITE_ORIGIN = 'https://nicolajonespaints.com';

// Per-route sitemap hints. Detail pages (/shop/*, /portfolio/*) fall back to a
// sensible default. Keep in sync with public/sitemap.xml priorities.
function sitemapMetaFor(route) {
  const table = {
    '/': { changefreq: 'monthly', priority: '1.0' },
    '/shop': { changefreq: 'weekly', priority: '0.9' },
    '/portfolio': { changefreq: 'weekly', priority: '0.9' },
    '/commissions': { changefreq: 'monthly', priority: '0.8' },
    '/celebrate': { changefreq: 'monthly', priority: '0.8' },
    '/about': { changefreq: 'monthly', priority: '0.7' },
    '/contact': { changefreq: 'monthly', priority: '0.7' },
  };
  if (table[route]) return table[route];
  if (route.startsWith('/shop/')) return { changefreq: 'weekly', priority: '0.7' };
  if (route.startsWith('/portfolio/')) return { changefreq: 'monthly', priority: '0.6' };
  return { changefreq: 'monthly', priority: '0.5' };
}

// Build a sitemap.xml from the successfully prerendered routes and write it to
// dist/. This supersedes the hand-maintained public/sitemap.xml so newly added
// products and portfolio projects are picked up automatically at build time.
async function writeSitemap(routes) {
  const urls = [...routes]
    .sort()
    .map((route) => {
      const { changefreq, priority } = sitemapMetaFor(route);
      const loc = `${SITE_ORIGIN}${route === '/' ? '/' : route}`;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
}

function isInternalRoute(href) {
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  let url;
  try {
    url = new URL(href, ORIGIN);
  } catch {
    return false;
  }
  // Only same-origin links are internal routes. External absolute URLs
  // (e.g. https://instagram.com/…) must not be crawled or added to the sitemap.
  if (url.origin !== ORIGIN) return false;
  if (EXCLUDE.some((re) => re.test(url.pathname))) return false;
  return true;
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });

    // Wait until React has actually mounted content into #root.
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.children.length > 0 && root.innerText.trim().length > 0;
      },
      { timeout: 45000 }
    );

    // Give async Sanity fetches + Helmet head updates a moment to settle.
    //
    // NOTE: Sanity data queries (XHR to apicdn.sanity.io) are blocked by CORS
    // when prerendering from the localhost origin, so dynamic detail pages
    // (/shop/:slug, /portfolio/:slug) currently prerender their fallback/loading
    // state rather than live content. The per-page <Helmet> SEO tags still apply
    // client-side and for JS-executing crawlers (e.g. Googlebot). Fully
    // prerendering that content requires whitelisting the build origin in the
    // Sanity CORS settings or fetching via a token-authenticated server-side call.
    await new Promise((r) => setTimeout(r, 600));

    const html = await page.content();

    // Discover internal links for further crawling (detail pages, etc.).
    const links = await page.$$eval('a[href]', (els) => els.map((el) => el.getAttribute('href')));

    return { html, links };
  } finally {
    await page.close();
  }
}

async function main() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const queue = [...SEED_ROUTES];
  const seen = new Set(queue);
  const rendered = [];
  const failed = [];

  try {
    while (queue.length) {
      const route = queue.shift();
      try {
        const { html, links } = await renderRoute(browser, route);
        const outPath = outputPathFor(route);
        await mkdir(path.dirname(outPath), { recursive: true });
        await writeFile(outPath, html, 'utf-8');
        rendered.push(route);
        console.log(`  ✓ ${route} -> ${path.relative(DIST, outPath)}`);

        // Enqueue newly discovered internal routes.
        for (const href of links) {
          if (!isInternalRoute(href)) continue;
          const pathname = new URL(href, ORIGIN).pathname.replace(/\/$/, '') || '/';
          if (!seen.has(pathname)) {
            seen.add(pathname);
            queue.push(pathname);
          }
        }
      } catch (err) {
        failed.push(route);
        console.warn(`  ✗ ${route} — ${err.message}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\nPrerendered ${rendered.length} route(s).`);

  // Generate sitemap.xml from every route we successfully rendered (includes
  // crawled /shop/* and /portfolio/* detail pages).
  try {
    await writeSitemap(rendered);
    console.log(`  ✓ sitemap.xml (${rendered.length} url(s))`);
  } catch (err) {
    console.warn(`  ✗ sitemap.xml — ${err.message}`);
  }

  if (failed.length) {
    console.error(`Failed ${failed.length} route(s): ${failed.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
