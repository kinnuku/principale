fetch('data/news.json')
  .then(res => res.json())
  .then(newsList => {
      // 日付の新しい順にソート
      newsList.sort((a,b) => new Date(b.date) - new Date(a.date));

      // 最新6件を取得
      const latestSix = newsList.slice(0,6);
      const container = document.getElementById('latest-news');
      container.innerHTML = '';

      if(latestSix.length === 0){
          container.innerHTML = '<p>現在ニュースはありません。</p>';
          return;
      }

      latestSix.forEach(news => {
          const card = document.createElement('div');
          card.className = 'news-card';
          card.innerHTML = `
              <p class="news-date">${news.date}</p>
              <h3>${news.title}</h3>
              <p class="news-summary">${news.summary}</p>
              <a href="news_detail.html?id=${news.id}" class="read-more-btn">続きを読む →</a>
          `;
          container.appendChild(card);
      });
  })
  .catch(err => console.error('ニュース読み込みエラー:', err));
