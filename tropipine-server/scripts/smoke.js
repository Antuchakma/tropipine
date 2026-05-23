const http = require('http');

function check(path) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: 'localhost', port: process.env.PORT || 5000, path, timeout: 2000 }, (res) => {
      resolve({ path, status: res.statusCode });
    });
    req.on('error', () => resolve({ path, status: 'error' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ path, status: 'timeout' });
    });
  });
}

async function main() {
  const paths = ['/health', '/api/v1/products', '/api/v1/auth/me'];
  const results = await Promise.all(paths.map(check));
  for (const r of results) console.log(`${r.path}: ${r.status}`);
  const ok = results.every((r) => r.status === 200 || r.path === '/api/v1/auth/me' && (r.status === 401 || r.status === 200));
  process.exit(ok ? 0 : 1);
}

main();
