let matchesData = [];

const selectTournament = document.getElementById('tournament-select');
const resultsContainer = document.getElementById('results-container');

fetch('data/matches.json')
  .then(res => res.json())
  .then(data => {
    // IDの大きい順（新しい順）
    matchesData = data.sort((a, b) => Number(b.id) - Number(a.id));

    // 大会名をセレクトボックスに追加
    const tournaments = Array.from(new Set(matchesData.map(m => m.tournament)));
    tournaments.forEach(t => {
      const option = document.createElement('option');
      option.value = t;
      option.textContent = t;
      selectTournament.appendChild(option);
    });

    showMatches('all');
  })
  .catch(err => console.error('試合結果読み込みエラー:', err));

selectTournament.addEventListener('change', () => {
  showMatches(selectTournament.value);
});

function showMatches(tournament) {
  resultsContainer.innerHTML = '';

  const filtered = tournament === 'all'
    ? matchesData
    : matchesData.filter(m => m.tournament === tournament);

  if (filtered.length === 0) {
    resultsContainer.innerHTML = '<p>試合結果はありません</p>';
    return;
  }

  filtered.forEach(m => {
    const card = document.createElement('div');
    card.className = 'match-card';

    // HOME / AWAYバッジ色
    const haClass = m.home_away === "HOME" ? "home-badge" : "away-badge";

    // ホーム側の得点者を表示（常にホームチームの得点者を表示）
    const homeScorers = m.home.scorers.join('<br>');  // ホームチームのみ得点者を表示

    // カードの中身
    card.innerHTML = `
      <div class="match-header">
        <span class="match-date">${m.date} ${m.time}</span>
        <span class="match-ha ${haClass}">${m.home_away}</span>
      </div>

      <h2 class="match-title">${m.tournament}</h2>

      <h4 class="match-round">${m.round}</h4>

      <div class="match-vs">
        <div class="team home">
          <span>${m.home.team_name}</span>
          <img src="${m.home.team_logo}" class="team-logo" alt="${m.home.team_name}">
        </div>

        <div class="score-box">
          <a href="results-detail.html?id=${m.id}" class="score-link">
            <strong class="score">${m.score}</strong>
          </a>
        </div>

        <div class="team away">
          <img src="${m.away.team_logo}" class="team-logo" alt="${m.away.team_name}">
          <span>${m.away.team_name}</span>
        </div>
      </div>

      <p class="scorer">得点者<br>${homeScorers}</p>
    `;

    resultsContainer.appendChild(card);
  });
}
