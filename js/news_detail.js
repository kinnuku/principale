// URL のクエリから id を取得
const params = new URLSearchParams(window.location.search);
const newsId = params.get('id');

fetch('data/news.json')
    .then(res => res.json())
    .then(newsData => {
        const newsItem = newsData.find(n => n.id === newsId);
        if (!newsItem) {
            alert('該当するニュースはありません');
            window.location.href = 'news.html';
            return;
        }

        document.getElementById('news-title').textContent = newsItem.title;
        document.getElementById('news-date').textContent = newsItem.date;

        // URLを自動的にリンクに変換する関数
        function linkify(text) {
            const urlPattern = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
        }

        // 本文の表示
        document.getElementById("news-content").innerHTML =
            newsItem.fullContent
                .map(line => linkify(line)) // URLをリンク化
                .join("<br>");


        const imgEl = document.getElementById('news-image');
        if (newsItem.image) {
            imgEl.src = newsItem.image;
            imgEl.alt = newsItem.title;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }
    })
    .catch(err => console.error('ニュース読み込みエラー:', err));

// 戻るボタン
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'news.html';
});
