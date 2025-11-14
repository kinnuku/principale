let newsData = [];
const itemsPerPage = 10;
let currentPage = 1;

const newsListContainer = document.getElementById('news-list');

fetch('data/news.json')
  .then(res => res.json())
  .then(newsList => {
    newsData = newsList.sort((a, b) => new Date(b.date) - new Date(a.date));
    showNewsList(currentPage);
  })
  .catch(err => console.error('ニュース読み込みエラー:', err));

// 一覧表示（ページネーション対応）
function showNewsList(page = 1) {
    newsListContainer.innerHTML = '';
    currentPage = page;

    if (newsData.length === 0) {
        newsListContainer.innerHTML = '<p>現在ニュースはありません。</p>';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, newsData.length);
    const pageItems = newsData.slice(startIndex, endIndex);

    pageItems.forEach(news => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <p class="news-date">${news.date}</p>
            <h3>${news.title}</h3>
            <p class="news-summary">${news.summary}</p>
            <a href="news_detail.html?id=${news.id}" class="read-more-btn">続きを読む →</a>
        `;
        newsListContainer.appendChild(card);
    });

    renderPagination('top');
    renderCount(startIndex + 1, endIndex, newsData.length, 'top');
    renderPagination('bottom');
    renderCount(startIndex + 1, endIndex, newsData.length, 'bottom');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 件数表示
function renderCount(start, end, total, position = 'top') {
    let countDiv = document.querySelector(`.news-count.${position}`);
    if (!countDiv) {
        countDiv = document.createElement('div');
        countDiv.className = `news-count ${position}`;
        countDiv.style.margin = '12px 0';
        countDiv.style.fontWeight = 'bold';
        if (position === 'top') {
            newsListContainer.prepend(countDiv);
        } else {
            newsListContainer.appendChild(countDiv);
        }
    }
    countDiv.textContent = `全 ${total} 件中 ${start}〜${end} 件表示しています`;
}

// ページネーション表示
function renderPagination(position = 'bottom') {
    const oldPager = document.querySelector(`.pagination.${position}`);
    if (oldPager) oldPager.remove();

    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    if (totalPages <= 1) return;

    const pager = document.createElement('div');
    pager.className = `pagination ${position}`;
    pager.style.margin = '2px 0';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀ 前へ';
    prevBtn.className = 'page-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => showNewsList(currentPage - 1));
    pager.appendChild(prevBtn);

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        pager.appendChild(createPageButton(1));
        if (startPage > 2) pager.appendChild(createEllipsis());
    }

    for (let i = startPage; i <= endPage; i++) {
        pager.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pager.appendChild(createEllipsis());
        pager.appendChild(createPageButton(totalPages));
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '次へ ▶';
    nextBtn.className = 'page-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => showNewsList(currentPage + 1));
    pager.appendChild(nextBtn);

    if (position === 'top') {
        newsListContainer.prepend(pager);
    } else {
        newsListContainer.appendChild(pager);
    }
}

function createPageButton(num) {
    const btn = document.createElement('button');
    btn.textContent = num;
    btn.className = 'page-btn';
    if (num === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => showNewsList(num));
    return btn;
}

function createEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.style.margin = '0 4px';
    span.style.fontWeight = 'bold';
    return span;
}
