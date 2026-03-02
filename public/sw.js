// キャッシュの名前
const CACHE_NAME = 'chem-quiz-v1';

// インストール時の処理
self.addEventListener('install', (event) => {
    console.log('[Service Worker] インストール完了');
    self.skipWaiting();
});

// 通信に割り込む処理（今回はそのままネットワークを通すだけ）
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            console.log('[Service Worker] オフラインのため通信できません');
        })
    );
});