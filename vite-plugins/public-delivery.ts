import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import react from '@vitejs/plugin-react';
import { build, type Connect, type Plugin, type ResolvedConfig } from 'vite';

// Shared by the workspace and standalone export. No runtime server is needed.
export function publicDelivery(): Plugin {
  let config: ResolvedConfig;
  const notFoundHtml = async () => (await readFile(path.join(config.root, 'public/404.html'), 'utf8'))
    .replace('href="/"', `href="${config.base}"`);
  const notFound: Connect.NextHandleFunction = async (req, res, next) => {
    // Vite runs post hooks after exact-file handling but BEFORE its HTML
    // transform handler. Let the real homepage reach that handler.
    if (req.url?.split('?')[0] === '/index.html') {
      next();
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 404;
      res.end();
      return;
    }
    try {
      const html = await notFoundHtml();
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(req.method === 'HEAD' ? undefined : html);
    } catch {
      res.statusCode = 500;
      res.end('Unable to load the not-found page.');
    }
  };
  return {
    name: 'quick-pass-public-delivery',
    configResolved(resolved) {
      config = resolved;
    },
    // Run after Vite's exact-file handlers. No SPA fallback.
    configureServer(server) {
      return () => { server.middlewares.use(notFound); };
    },
    configurePreviewServer(server) {
      return () => { server.middlewares.use(notFound); };
    },
    async closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return;
      const outDir = path.resolve(config.root, config.build.outDir);
      await writeFile(path.join(outDir, '404.html'), await notFoundHtml());
      const serverDir = path.resolve(outDir, '../prerender');
      await build({
        configFile: false,
        root: config.root,
        base: config.base,
        plugins: [react()],
        resolve: { alias: { '@': path.join(config.root, 'src') } },
        logLevel: 'warn',
        build: {
          ssr: path.join(config.root, 'src/entry-server.tsx'),
          outDir: serverDir,
          emptyOutDir: true,
          rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
        },
      });
      const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.mjs')).href);
      const indexPath = path.join(outDir, 'index.html');
      const template = await readFile(indexPath, 'utf8');
      const marker = '<div id="root"></div>';
      if (!template.includes(marker)) throw new Error('Missing prerender insertion point in index.html');
      await writeFile(indexPath, template.replace(marker, () => `<div id="root">${render()}</div>`));
    },
  };
}
