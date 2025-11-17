// public/service-worker.js
const CACHE_NAME = 'vue2-mavon-image-cache-v1'; // 缓存版本号（更新时修改）
const CACHE_EXPIRE_TIME = 10 * 60 * 1000; // 10分钟过期
const CACHE_ASSETS = [
    // 预缓存的核心资源（根据项目实际调整）
    '/',
    '/index.html',
    // '/static/js/app.js',
    // '/static/css/app.css',
    '/favicon.ico'
];

// 1. 安装阶段：缓存核心资源
self.addEventListener('install', (event) => {
    console.log('Service Worker 安装中...');
    // 等待缓存完成后再激活
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
            .then(() => self.skipWaiting()) // 跳过等待，直接激活新 SW
    );
});

// 2. 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活成功');
    event.waitUntil(
        Promise.all([
            // 清理当前缓存中的过期图片
            caches.open(CACHE_NAME).then(cache => {
                return cache.keys().then(requests => {
                    const imageReg = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
                    const expirePromises = requests
                        .filter(request => imageReg.test(request.url)) // 只处理图片
                        .map(request => {
                            return cache.match(request).then(response => {
                                // 兼容没有 X-Cached-Time 头的情况
                                const cachedTime = response?.headers.get('X-Cached-Time');
                                if (!cachedTime) return cache.delete(request); // 无时间戳则删除
                                if (Date.now() - Number(cachedTime) > CACHE_EXPIRE_TIME) {
                                    return cache.delete(request); // 过期则删除
                                }
                            });
                        });
                    return Promise.all(expirePromises);
                });
            }),
            // 清理旧版本缓存
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
                );
            })
        ]).then(() => self.clients.claim()) // 控制所有打开的页面
    );
});

// 3. 拦截网络请求：实现缓存策略
self.addEventListener('fetch', (event) => {
    const request = event.request;
    // console.log(request)
    // 过滤无效请求：只处理 GET 请求（缓存只适用于 GET）
    if (request.method !== 'GET') {
        event.respondWith(fetch(request));
        return;
    }

    // 对 API 请求使用 Stale-While-Revalidate（先返回缓存，后台更新）
    if (request.url.includes('/image-cache/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => { // 必须先打开缓存实例
                return cache.match(request).then(cacheResponse => {
                    const cacheExpireTime = CACHE_EXPIRE_TIME;

                    // 缓存存在且未过期：直接返回缓存
                    if (cacheResponse) {
                        const cachedTime = cacheResponse.headers.get('X-Cached-Time');
                        if (cachedTime && Date.now() - Number(cachedTime) < cacheExpireTime) {
                            return cacheResponse;
                        }
                    }

                    // 过期/无缓存：请求网络并更新缓存 // 克隆请求，避免原流被消费
                    return fetch(request.clone()).then(networkResponse => {
                        // 克隆响应：避免流被重复消费（关键！）
                        const networkResponseClone = networkResponse.clone();
                        // 兼容跨域图片：如果是 no-cors 响应，不添加自定义头
                        const canModifyHeaders = true;
                        const responseToCache = canModifyHeaders
                            ? new Response(networkResponseClone.body, {
                                headers: {
                                    ...networkResponseClone.headers,
                                    'X-Cached-Time': Date.now().toString() // 添加缓存时间戳
                                }
                            })
                            : networkResponseClone; // no-cors 响应直接克隆
                        // 克隆响应，添加缓存时间头
                        // const responseWithTime = new Response(networkResponse.body, {
                        //     headers: {
                        //         ...networkResponse.headers,
                        //         'X-Cached-Time': Date.now().toString()
                        //     }
                        // });
                        // 更新缓存
                        cache.put(request, responseToCache);
                        return networkResponse;
                    }).catch((err) => {
                        console.error('[SW] 网络请求失败：', err.message, request);
                        // 网络失败：返回旧缓存（即使过期也比空白好）
                        return cacheResponse
                    });
                });
            })
        );
        return;
    }

    // 处理其他资源（HTML/JS/CSS/非 OSS 图片）：默认策略
    // event.respondWith(
    //     caches.match(request).then(cacheResponse => {
    //         // 缓存优先，网络兜底（适合静态资源）
    //         return cacheResponse || fetch(request).then(networkResponse => {
    //             // 只缓存核心静态资源（避免缓存过多无用资源）
    //             const staticReg = /\.(js|css|png|jpg|gif|webp|svg|ico|html)$/i;
    //             if (staticReg.test(request.url)) {
    //                 caches.open(CACHE_NAME).then(cache => {
    //                     cache.put(request, networkResponse.clone());
    //                 });
    //             }
    //             return networkResponse;
    //         });
    //     })
    // );
});