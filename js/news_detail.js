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
        document.getElementById('news-content').textContent = newsItem.fullContent;

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
