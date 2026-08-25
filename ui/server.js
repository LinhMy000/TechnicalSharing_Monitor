const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname);

const server = http.createServer((req, res) => {

    // Proxy API requests to demo-service
    if (req.url.startsWith('/api')) {
        const options = {
            hostname: process.env.DEMO_SERVICE_HOST || 'localhost',
            port: 8080,
            path: req.url,
            method: req.method,
            headers: req.headers
        };

        const proxy = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxy.on('error', (err) => {
            console.error('Proxy error:', err);

            res.writeHead(502, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Cannot connect to demo-service',
                message: err.message
            }));
        });

        req.pipe(proxy);

        return;
    }

    // Serve static files
    let filePath = path.join(
        PUBLIC_DIR,
        req.url === '/' ? 'index.html' : req.url
    );

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            const extname = path.extname(filePath);

            const contentType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json'
            }[extname] || 'text/html';

            res.writeHead(200, {
                'Content-Type': contentType
            });

            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`UI server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});