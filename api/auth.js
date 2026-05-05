import { randomBytes } from 'node:crypto';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const CALLBACK_URL = 'https://chogori.xyz/api/callback';
const OAUTH_SCOPES = 'repo,user';
const STATE_COOKIE = 'decap_oauth_state';

function sendError(res, message) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(message);
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const clientId = process.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    sendError(res, 'Missing OAUTH_CLIENT_ID in Vercel environment variables.');
    return;
  }

  const state = randomBytes(24).toString('hex');
  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', CALLBACK_URL);
  authorizeUrl.searchParams.set('scope', OAUTH_SCOPES);
  authorizeUrl.searchParams.set('state', state);

  res.statusCode = 302;
  res.setHeader('Location', authorizeUrl.toString());
  res.setHeader(
    'Set-Cookie',
    `${STATE_COOKIE}=${state}; Path=/api/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  );
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}
