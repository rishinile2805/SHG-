import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/app';
import { initDatabase } from './server/database/db';
import { config } from './server/config';

async function startServer() {
  console.log('[Server] Starting Jijamata Gruh Udyog full-stack application...');

  // Initialize database schema and connections
  await initDatabase();

  const app = createApp();

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server middlewares in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[Server] E-Commerce Server ready on http://0.0.0.0:${config.port}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Failed to initialize:', err);
  process.exit(1);
});
