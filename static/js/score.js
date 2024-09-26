document.addEventListener('DOMContentLoaded', function() {
    const scoresGrid = document.getElementById('scoresGrid');
    const currentWeekSpan = document.getElementById('currentWeek');
    const weekList = document.querySelector('.week-list');
    let currentWeek = 4;

    function fetchScores(week) {
        const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2024&seasontype=2&week=${week}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayScores(data.events);
                currentWeekSpan.textContent = `Week ${week}`;
                highlightCurrentWeek(week);
            })
            .catch(error => console.error('Error:', error));
    }

    function displayScores(events) {
        scoresGrid.innerHTML = ''; // Clear previous scores

        events.forEach(event => {
            const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
            const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');

            const homeScore = parseInt(homeTeam.score);
            const awayScore = parseInt(awayTeam.score);
            const homeWinner = homeScore > awayScore;
            const awayWinner = awayScore > homeScore;

            const gameContainer = document.createElement('div');
            gameContainer.className = 'game-container';
            gameContainer.innerHTML = `
                <div class="team away ${awayWinner ? 'winner' : ''}">
                    <div class="team-info">
                        <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName} logo" class="team-logo">
                        <span class="team-name">${awayTeam.team.displayName}</span>
                    </div>
                    <span class="score">${awayTeam.score}</span>
                </div>
                <div class="team home ${homeWinner ? 'winner' : ''}">
                    <div class="team-info">
                        <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName} logo" class="team-logo">
                        <span class="team-name">${homeTeam.team.displayName}</span>
                    </div>
                    <span class="score">${homeTeam.score}</span>
                </div>
            `;

            scoresGrid.appendChild(gameContainer);
        });
    }

    // Highlight current week button
    function highlightCurrentWeek(week) {
        const weekButtons = document.querySelectorAll('.week-btn');
        weekButtons.forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.textContent) === week) {
                button.classList.add('active');
            }
        });
    }

    // Generate week buttons
    function generateWeekButtons() {
        for (let i = 1; i <= 18; i++) {
            const weekButton = document.createElement('button');
            weekButton.textContent = i;
            weekButton.classList.add('week-btn');
            weekButton.addEventListener('click', function() {
                currentWeek = i;
                fetchScores(currentWeek);
            });
            weekList.appendChild(weekButton);
        }
    }

    // Initial load
    fetchScores(currentWeek);
    generateWeekButtons();

    // Event listeners for week navigation
    document.getElementById('prevWeek').addEventListener('click', function() {
        if (currentWeek > 1) {
            currentWeek--;
            fetchScores(currentWeek);
        }
    });

    document.getElementById('nextWeek').addEventListener('click', function() {
        if (currentWeek < 18) {
            currentWeek++;
            fetchScores(currentWeek);
        }
    });
});
