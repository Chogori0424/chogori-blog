const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const CALLBACK_URL = 'https://chogori.xyz/api/callback';
const STATE_COOKIE = 'decap_oauth_state';
const ALLOWED_ORIGINS = ['https://chogori.xyz', 'https://www.chogori.xyz'];

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const prefix = `${name}=`;
  const match = cookies.find((cookie) => cookie.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : '';
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function renderHandoffPage(status, content, display) {
  const message = `authorization:github:${status}:${content}`;

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>GitHub OAuth - Chogori Blog</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #1f2937;
        background: #f8fafc;
      }

      main {
        width: min(32rem, calc(100vw - 2rem));
        padding: 2rem;
        border: 1px solid #dbe3ea;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 18px 50px rgb(15 23 42 / 8%);
      }

      p {
        margin: 0;
        line-height: 1.7;
      }

      .error {
        color: #b91c1c;
      }
    </style>
  </head>
  <body>
    <main>
      <p id="status">${display}</p>
      <p id="origin-error" class="error" hidden>无法确认后台页面来源，请回到 /admin/ 重新登录。</p>
    </main>
    <script>
      (function () {
        var message = ${safeJson(message)};
        var origins = ${safeJson(ALLOWED_ORIGINS)};

        if (!window.opener) {
          document.getElementById('status').textContent = '没有找到后台窗口，请关闭此页后从 /admin/ 重新登录。';
          return;
        }

        function receiveMessage(event) {
          if (origins.indexOf(event.origin) === -1) {
            document.getElementById('status').hidden = true;
            document.getElementById('origin-error').hidden = false;
            return;
          }

          window.removeEventListener('message', receiveMessage, false);
          window.opener.postMessage(message, event.origin);
          window.close();
        }

        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}

function sendHandoff(res, status, content, display) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader(
    'Set-Cookie',
    `${STATE_COOKIE}=; Path=/api/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );
  res.end(renderHandoffPage(status, content, display));
}

async function exchangeCodeForToken(code, clientId, clientSecret) {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'chogori-blog-decap-oauth',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: CALLBACK_URL,
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.error || !payload.access_token) {
    const reason = payload.error_description || payload.error || response.statusText;
    throw new Error(reason || 'GitHub token exchange failed.');
  }

  return payload.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  const code = first(req.query?.code);
  const state = first(req.query?.state);
  const error = first(req.query?.error);
  const errorDescription = first(req.query?.error_description);
  const expectedState = readCookie(req, STATE_COOKIE);
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (error) {
    sendHandoff(res, 'error', errorDescription || error, 'GitHub 授权没有完成。');
    return;
  }

  if (!code) {
    sendHandoff(res, 'error', 'Missing GitHub authorization code.', 'GitHub 没有返回授权码。');
    return;
  }

  if (!state || !expectedState || state !== expectedState) {
    sendHandoff(res, 'error', 'Invalid OAuth state.', 'OAuth 状态校验失败，请重新登录。');
    return;
  }

  if (!clientId || !clientSecret) {
    sendHandoff(
      res,
      'error',
      'Missing OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET.',
      'Vercel 还没有配置 GitHub OAuth 环境变量。',
    );
    return;
  }

  try {
    const token = await exchangeCodeForToken(code, clientId, clientSecret);
    const content = JSON.stringify({ token, provider: 'github' });
    sendHandoff(res, 'success', content, 'GitHub 登录成功，正在返回 Decap CMS。');
  } catch (oauthError) {
    sendHandoff(
      res,
      'error',
      oauthError instanceof Error ? oauthError.message : 'GitHub token exchange failed.',
      'GitHub token 交换失败。',
    );
  }
}
