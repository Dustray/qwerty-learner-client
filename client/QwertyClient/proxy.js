// Simple CORS proxy server
const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
    // 解析请求URL
    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.url;
    
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing target URL' }));
        return;
    }
    
    // 解析目标URL
    const targetParsed = url.parse(targetUrl);
    const options = {
        hostname: targetParsed.hostname,
        port: targetParsed.port || (targetParsed.protocol === 'https:' ? 443 : 80),
        path: targetParsed.path,
        method: req.method,
        headers: req.headers
    };
    
    // 移除可能导致问题的头
    delete options.headers.host;
    
    // 创建代理请求
    const proxyReq = (targetParsed.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
        // 添加CORS头
        const headers = {
            ...proxyRes.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
        
        // 发送响应
        res.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(res);
    });
    
    // 处理错误
    proxyReq.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    });
    
    // 处理请求体
    req.pipe(proxyReq);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`CORS proxy server running on port ${PORT}`);
});