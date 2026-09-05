import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRoute } from './src/server/resendEndpoints.js';

function resendApiPlugin() {
  return {
    name: 'resend-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Strip query params to get clean pathname
        const pathname = req.url.split('?')[0];

        if (!pathname.startsWith('/api/')) {
          return next();
        }

        // Handle CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'GET') {
          try {
            const result = await handleApiRoute(pathname, {});
            res.statusCode = result.status || 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Handle POST body
        let rawBody = '';
        req.on('data', chunk => {
          rawBody += chunk;
        });

        req.on('end', async () => {
          try {
            const body = rawBody ? JSON.parse(rawBody) : {};
            const result = await handleApiRoute(pathname, body);
            res.statusCode = result.status || 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), resendApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
