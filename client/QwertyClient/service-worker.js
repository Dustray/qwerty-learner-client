// service-worker.js
self.addEventListener('fetch', function(event) {
    // 检查是否是有道词典的音频请求
    if (event.request.url.includes('dict.youdao.com/dictvoice')) {
        // 拦截请求
        event.respondWith(
            // 发送请求到目标服务器
            fetch(event.request)
                .then(function(response) {
                    // 创建新的响应头
                    const headers = new Headers(response.headers);
                    // 添加CORS头
                    headers.set('Access-Control-Allow-Origin', '*');
                    
                    // 创建新的响应
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: headers
                    });
                })
                .catch(function(error) {
                    console.error('Error fetching:', error);
                    return new Response('Error fetching resource', {
                        status: 500
                    });
                })
        );
    }
});