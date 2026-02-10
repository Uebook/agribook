const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Create server
const server = http.createServer((req, res) => {
    // If the request is for /admin or starts with /admin/, proxy to Admin Panel
    if (req.url === '/admin' || req.url.startsWith('/admin/') || req.url.startsWith('/admin?')) {
        // Next.js Admin Panel (port 3001)
        proxy.web(req, res, {
            target: 'http://localhost:3001',
            changeOrigin: true,
            ws: true
        });
    } else {
        // Proxy all other requests to Next.js Website (port 3002)
        proxy.web(req, res, {
            target: 'http://localhost:3002',
            changeOrigin: true,
            ws: true
        });
    }
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Admin panel is not running. Please start it first.');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Website: http://localhost:${PORT}`);
    console.log(`⚙️  Admin Panel: http://localhost:${PORT}/admin\n`);
});
