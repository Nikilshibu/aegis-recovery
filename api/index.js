import { handleApiRoute } from '../src/server/resendEndpoints.js';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const pathname = req.url.split('?')[0];

  try {
    const body = req.body || {};
    const result = await handleApiRoute(pathname, body);
    return res.status(result.status || 200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
