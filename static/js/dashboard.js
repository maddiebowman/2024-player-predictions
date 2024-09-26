document.addEventListener("DOMContentLoaded", () => {
    const positionSelect = document.getElementById('positionSelect');
    const playerDataBody = document.getElementById('playerDataBody');
    const tableHeader = document.getElementById('tableHeader');
    const playerDataContainer = document.getElementById('playerDataContainer');
    const positionTitle = document.getElementById('positionTitle');

    // Popup elements
    const playerPopup = document.getElementById('playerPopup');
    const playerImage = document.getElementById('playerImage');
    const playerNameElement = document.getElementById('playerName');
    const playerPosition = document.getElementById('playerPosition');
    const playerRank = document.getElementById('playerRank');
    const playerAge = document.getElementById('playerAge');
    const playerHeight = document.getElementById('playerHeight');
    const playerWeight = document.getElementById('playerWeight');
    const playerDraft = document.getElementById('playerDraft');
    const playerSeasons = document.getElementById('playerSeasons');

    const closePopupBtn = document.getElementById('closePopup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hidePlayerPopup);
    }

    // Check for popup elements
    if (!playerPopup || !playerImage || !playerNameElement || !playerPosition || 
        !playerRank || !playerAge || !playerHeight || !playerWeight || 
        !playerDraft || !playerSeasons) {
        console.error("One or more popup elements are missing from the DOM");
    }

    // Store popup data
    let popupData = [];

    // convertHeight function
    function convertHeight(heightInInches) {
        if (!heightInInches) return 'N/A';
        const feet = Math.floor(heightInInches / 12);
        const inches = heightInInches % 12;
        return `${feet}'${inches}"`;
    }

    // Fetch and display data based on the selected position
    positionSelect.addEventListener('change', () => {
        const selectedPosition = positionSelect.value;

        // Remove previous position classes
        playerDataContainer.classList.remove('qb', 'wr', 'rb', 'te');
        tableHeader.className = ''; // Reset header class

        if (selectedPosition) {
            playerDataContainer.classList.add(selectedPosition);
            tableHeader.classList.add(`header-${selectedPosition}`); // Add new header class
            fetchPlayerData(selectedPosition);
        } else {
            clearTable();
            playerDataContainer.style.display = "none"; // Hide table if no position is selected
        }
    });

    // Fetch player data for selected position
    function fetchPlayerData(position) {
        fetch(`/get_data/${position}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (response.error) {
                    console.error(`Error fetching data: ${response.error}`);
                    return;
                }
                displayPlayerData(response.main_data, response.main_columns, position);
                popupData = response.popup_data; // Store popup data
                console.log("Received popup data:", popupData); // Log received popup data
            })
            .catch(error => {
                console.error(`Error fetching player data: ${error}`);
            });
    }
    
    function displayPlayerData(data, columns, position) {
        clearTable();
    
        if (data.length > 0) {
            // Make container visible
            playerDataContainer.style.display = "block";
    
            // Set title based on selected position
            positionTitle.textContent = `Projected Fantasy Stats for ${getPositionTitle(position)}`;
    
            // Create table headers
            columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col.replace(/_/g, ' ').toUpperCase();
                tableHeader.appendChild(th);
            });
    
            // Add player rows
            data.forEach(player => {
                const row = document.createElement('tr');
    
                columns.forEach(col => {
                    const cell = document.createElement('td');
                    cell.textContent = player[col];
                    
                    if (col === 'player_name') {
                        cell.style.cursor = 'pointer';
                        cell.addEventListener('click', (e) => showPlayerPopup(e, player.player_name));
                    }
                    
                    row.appendChild(cell);
                });
    
                playerDataBody.appendChild(row);
            });
        }
    }

    // Clear table when new position is selected
    function clearTable() {
        playerDataBody.innerHTML = '';
        tableHeader.innerHTML = '';
    }

    // Get position title for display
    function getPositionTitle(position) {
        switch (position) {
            case 'qb':
                return 'Quarterbacks';
            case 'wr':
                return 'Wide Receivers';
            case 'rb':
                return 'Running Backs';
            case 'te':
                return 'Tight Ends';
            default:
                return '';
        }
    }

    // Function to show player popup
    function showPlayerPopup(event, playerName) {
        if (!playerPopup) {
            console.error("Player popup element not found");
            return;
        }
    
        const player = popupData.find(p => p.player_name === playerName);
        if (!player) {
            console.error(`No popup data found for player: ${playerName}`);
            console.log("Available popup data:", popupData);

            playerPopup.innerHTML = `
                <p>Sorry, no additional information available for ${playerName}.</p>
                <button id="closePopup" class="close-btn">X</button>
            `;
            const newCloseBtn = playerPopup.querySelector('#closePopup');
            if (newCloseBtn) {
                newCloseBtn.addEventListener('click', hidePlayerPopup);
            }
        } else {
            
            // Populate popup with player data
            if (playerImage) {
                const formattedName = playerName.toLowerCase().replace(/\s+/g, '_');
                const positionFolder = player.position.toLowerCase();
                playerImage.src = `../static/images/${positionFolder}/${formattedName}.jpeg`;
                playerImage.onerror = function() {
                    this.src = '../static/images/placeholder.jpeg';
                };
            }
            if (playerNameElement) playerNameElement.textContent = playerName;
            if (playerPosition) playerPosition.textContent = player.position;
            if (playerRank) playerRank.textContent = `Position Rank: ${player.position_fantasy_rank}`;
            if (playerAge) playerAge.textContent = `Age: ${player.age}`;
            if (playerHeight) playerHeight.textContent = `Height: ${convertHeight(player.height)}`;
            if (playerWeight) playerWeight.textContent = `Weight: ${player.weight} lbs`;
            if (playerDraft) playerDraft.textContent = `Draft Pick: ${player.draft_ovr}`;
            if (playerSeasons) playerSeasons.textContent = `Seasons Played: ${player.seasons_played}`;
            
            // Add team name and logo
            const teamNameElement = document.getElementById('teamName');
            if (teamNameElement) {
                const teamNames = {
                    'BUF': 'Buffalo Bills',
                    'DAL': 'Dallas Cowboys',
                    'PHI': 'Philadelphia Eagles',
                    'MIA': 'Miami Dolphins',
                    'SF': 'San Francisco 49ers',
                    'BAL': 'Baltimore Ravens',
                    'GB': 'Green Bay Packers',
                    'KC': 'Kansas City Chiefs',
                    'HOU': 'Houston Texans',
                    'NO': 'New Orleans Saints',
                    'JAX': 'Jaxonville Jaguars',
                    'TB': 'Tampa Bay Buccaneers',
                    'CLE': 'Cleveland Browns',
                    'LAC': 'Los Angeles Chargers',
                    'PIT': 'Pittsburgh Steelers',
                    'LV': 'Las Vegas Raiders',
                    'LA': 'Los Angeles Rams',
                    'ARI': 'Arizona Cardinals',
                    'CAR': 'Carolina Panthers',
                    'SEA': 'Seattle Seahawks',
                    'CIN': 'Cincinnati Bengals',
                    'ATL': 'Atlanta Falcons',
                    'TEN': 'Tennessee Titans',
                    'MIN': 'Minnesota Vikings',
                    'NYJ': 'New York Jets',
                    'IND': 'Indianapolis Colts',
                    'NYG': 'New York Giants',
                    'DET': 'Detroit Lions',
                    'NE': 'New England Patriots',
                    'WAS': 'Washington Commanders',
                    'DEN': 'Denver Broncos',
                    'CHI': 'Chicago Bears',
                };
                teamNameElement.textContent = teamNames[player.team] || player.team;
            }
            if (teamLogo) {
                teamLogo.src = `../static/images/teams/${player.team}.jpeg`;
                teamLogo.onerror = function() {
                    this.src = '../static/images/placeholder_team.jpeg';
                };
            }
        }
    
        playerPopup.style.display = 'block';
        playerPopup.style.left = `${event.pageX + 10}px`;
        playerPopup.style.top = `${event.pageY + 10}px`;
    }

    // Function to hide the player popup
    function hidePlayerPopup() {
        if (playerPopup) {
            playerPopup.style.display = 'none';
        }
    }
});
