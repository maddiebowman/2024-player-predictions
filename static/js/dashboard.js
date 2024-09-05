document.addEventListener("DOMContentLoaded", () => {
    const positionSelect = document.getElementById('positionSelect');
    const playerDataBody = document.getElementById('playerDataBody');
    const tableHeader = document.getElementById('tableHeader');
    const playerDataContainer = document.getElementById('playerDataContainer');
    const positionTitle = document.getElementById('positionTitle');

    // Fetch and display data based on the selected position
    positionSelect.addEventListener('change', () => {
        const selectedPosition = positionSelect.value;

        if (selectedPosition) {
            fetchPlayerData(selectedPosition);
        } else {
            clearTable();
            playerDataContainer.style.display = "none"; // Hide the table if no position is selected
        }
    });

    // Fetch player data for the selected position
    function fetchPlayerData(position) {
        fetch(`/get_data/${position}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error(`Error fetching data: ${data.error}`);
                    return;
                }
                displayPlayerData(data, position);
            })
            .catch(error => {
                console.error(`Error fetching player data: ${error}`);
            });
    }

    // Display player data in the table
    function displayPlayerData(data, position) {
        clearTable();

        if (data.length > 0) {
            // Make the container visible
            playerDataContainer.style.display = "block";

            // Set the title based on the position
            positionTitle.textContent = `Fantasy Stats for ${getPositionTitle(position)}`;

            // Create table headers dynamically
            const columns = Object.keys(data[0]);
            columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col.replace(/_/g, ' ').toUpperCase();
                tableHeader.appendChild(th);
            });

            // Add player rows dynamically
            data.forEach(player => {
                const row = document.createElement('tr');

                Object.values(player).forEach(val => {
                    const cell = document.createElement('td');
                    cell.textContent = val;
                    row.appendChild(cell);
                });

                playerDataBody.appendChild(row);
            });
        }
    }

    // Clear the table when a new position is selected
    function clearTable() {
        playerDataBody.innerHTML = '';
        tableHeader.innerHTML = '';
    }

    // Get the position title for display
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
});
