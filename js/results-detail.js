let teamsData = [];

// URLから試合ID取得
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get('id');

const scoreCard = document.getElementById('score-card');
const statsArea = document.getElementById('stats-area');

// チーム情報取得
fetch('data/teams.json')
  .then(res => res.json())
  .then(data => {
    teamsData = data;
    loadMatch(matchId);
  })
  .catch(err => console.error(err));

function loadMatch(id) {
  fetch('data/matches.json')
    .then(res => res.json())
    .then(matches => {
      const match = matches.find(m => m.id === id);
      if (!match) {
        scoreCard.innerHTML = '<p>試合情報が見つかりません</p>';
        return;
      }

      // チームカラー
      const homeTeam = teamsData.find(t => t.team_name === match.home.team_name);
      const awayTeam = teamsData.find(t => t.team_name === match.away.team_name);

      match.home.color = homeTeam ? homeTeam.color : '#ff6b6b';
      match.away.color = awayTeam ? awayTeam.color : '#4caf50';

      // スコアカード
      scoreCard.innerHTML = `
        <div class="score-card-inner">
          <div class="team home">
            <img src="${match.home.team_logo}" class="team-logo" alt="${match.home.team_name}">
            <div class="team-name">${match.home.team_name}</div>
          </div>

          <div class="match-score-wrapper">
            <h2>${match.tournament}</h2>
            <strong>${match.round}</strong>
            <div class="match-score">${match.score}</div>
          </div>

          <div class="team away">
            <img src="${match.away.team_logo}" class="team-logo" alt="${match.away.team_name}">
            <div class="team-name">${match.away.team_name}</div>
          </div>
        </div>
      `;

        // 評価点にスタイルを適用
        function getRatingStyle(rating) {
        let style = '';

        if (rating <= 4.9) {
            style = 'background-color: #f3274b; color: white; padding: 1px 2px; border-radius: 8px; font-size: 12px;';
        } else if (rating >= 5.0 && rating <= 5.9) {
            style = 'background-color: #fc7f1c; color: white; padding: 1px 2px; border-radius: 8px; font-size: 12px;';
        } else if (rating >= 6.0 && rating <= 6.9) {
            style = 'background-color: #e6ad01; color: white; padding: 1px 2px; border-radius: 8px; font-size: 12px;';
        } else if (rating >= 7.0 && rating <= 8.4) {
            style = 'background-color: #32cd31; color: white; padding: 1px 2px; border-radius: 8px; font-size: 12px;';
        } else if (rating >= 8.5 && rating <= 10.0) {
            style = 'background-color: #10ab15; color: white; padding: 1px 2px; border-radius: 8px; font-size: 12px;';
        }

        return style;  // スタイルを返す
        }




        function createPlayersTable(players) {
        return `
            <table class="players-table">
            <tbody>
                ${players.map(p => `
                <tr>
                    <td>
                    <strong>${p.position}</strong>
                    </td>
                    <td style="${getRatingStyle(p.rating)}">
                    <strong>${p.rating !== undefined ? p.rating.toFixed(1) : 'N/A'}</strong>
                    </td>
                    <td>
                    <strong>${p.name} ${p.goals > 0 ? `<span style="color: #e6ad01;">⚽×${p.goals}</span>` : ''}${p.assists > 0 ? ` 👟×${p.assists}` : ''} </strong>
                    </td>
                </tr>
                `).join('')}
            </tbody>
            </table>
        `;
        }


      // スタッツ＋選手列をまとめるラッパー
      const wrapper = document.createElement('div');
      wrapper.className = 'stats-wrapper';
      wrapper.style.display = 'grid';
      wrapper.style.gridTemplateColumns = '200px 1fr 200px'; // 左:ホーム選手, 中央:スタッツ, 右:アウェイ選手
      wrapper.style.alignItems = 'stretch';
      wrapper.style.gap = '12px';

      // 左右の選手列（テーブル形式）
      const homePlayersDiv = document.createElement('div');
      homePlayersDiv.innerHTML = createPlayersTable(match.home.players || []);
      homePlayersDiv.className = 'players-column';

      const awayPlayersDiv = document.createElement('div');
      awayPlayersDiv.innerHTML = createPlayersTable(match.away.players || []);
      awayPlayersDiv.className = 'players-column';

      // 中央のスタッツ
      const statsDiv = document.createElement('div');
      statsDiv.className = 'stats-column';

      const stats = [
        {name: '支配率', home: match.home.team_stats.possession, away: match.away.team_stats.possession},
        {name: 'シュート', home: match.home.team_stats.shots, away: match.away.team_stats.shots},
        {name: '枠内シュート', home: match.home.team_stats.shots_on_target, away: match.away.team_stats.shots_on_target},
        {name: 'ドリブル精度', home: match.home.team_stats.successful_dribbles, away: match.away.team_stats.successful_dribbles},
        {name: 'パス成功', home: match.home.team_stats.pass_success, away: match.away.team_stats.pass_success},
        {name: 'パス精度', home: match.home.team_stats.successful_passes, away: match.away.team_stats.successful_passes},
        {name: 'セーブ', home: match.home.team_stats.saves, away: match.away.team_stats.saves}
      ];

      stats.forEach(stat => {
        const row = document.createElement('div');
        row.className = 'stat-row';

        const total = stat.home + stat.away;
        const homeWidth = total ? (stat.home / total * 100) : 50;
        const awayWidth = total ? (stat.away / total * 100) : 50;

        row.innerHTML = `
          <div class="stat-value" style="position: relative; left: 250px; top: -7px;">${stat.away}</div>
          <div class="stat-bar-wrapper">
              <strong class="stat-name">${stat.name}</strong>
              <div class="stat-gauge">
              <div class="stat-left" style="width:${homeWidth}%; background-color:${match.home.color}"></div>
              <div class="stat-right" style="width:${awayWidth}%; background-color:${match.away.color}"></div>
              </div>
          </div>
          <div class="stat-value" style="position: relative; left: -250px; top: -7px;">${stat.home}</div>
        `;
        statsDiv.appendChild(row);
      });

      // wrapperに追加
      wrapper.appendChild(homePlayersDiv);
      wrapper.appendChild(statsDiv);
      wrapper.appendChild(awayPlayersDiv);

      statsArea.appendChild(wrapper);

    })
    .catch(err => console.error(err));
}
