document.addEventListener('DOMContentLoaded', function() {
    const scrollContent = document.getElementById('scrollContent');
    let currentWeek = 4;

    function fetchScores(week) {
        const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2024&seasontype=2&week=${week}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayScores(data.events);
            })
            .catch(error => console.error('Error:', error));
    }

    function displayScores(events) {
        scrollContent.innerHTML = ''; // Clear previous scores

        // Create and append week header
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-header';
        weekHeader.textContent = `Week ${currentWeek} Matchups`;
        scrollContent.appendChild(weekHeader);

        events.forEach(event => {
            const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
            const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');

            const gameContainer = document.createElement('div');
            gameContainer.className = 'game-container';
            gameContainer.innerHTML = `
                <div class="team away">
                    <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName} logo" class="team-logo">
                </div>
                <div class="at-symbol">@</div> <!-- Replaces the "VS" with "@" symbol -->
                <div class="team home">
                    <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName} logo" class="team-logo">
                </div>
            `;

            scrollContent.appendChild(gameContainer);
        });

        // Clone first game container for scrolling scores
        scrollContent.appendChild(scrollContent.firstElementChild.cloneNode(true));
    }

    // Initial load
    fetchScores(currentWeek);
});

