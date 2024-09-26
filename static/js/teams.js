const nflData = {
    conferences: [
        {
            name: "AFC",
            divisions: [
                {
                    name: "AFC East",
                    teams: [
                        { name: "Buffalo Bills", record: "2-0", logo: "path/to/bills_logo.png" },
                        { name: "New York Jets", record: "2-1", logo: "path/to/jets_logo.png" },
                        { name: "Miami Dolphins", record: "1-1", logo: "path/to/dolphins_logo.png" },
                        { name: "New England Patriots", record: "1-2", logo: "path/to/patriots_logo.png" }
                    ]
                },
                {
                    name: "AFC West",
                    teams: [
                        { name: "Kansas City Chiefs", record: "2-0", logo: "path/to/chiefs_logo.png" },
                        { name: "Los Angeles Chargers", record: "2-0", logo: "path/to/chargers_logo.png" },
                        { name: "Las Vegas Raiders", record: "1-1", logo: "path/to/raiders_logo.png" },
                        { name: "Denver Broncos", record: "0-2", logo: "path/to/broncos_logo.png" }
                    ]
                },
                {
                    name: "AFC North",
                    teams: [
                        { name: "Pittsburgh Steelers", record: "2-0", logo: "path/to/steelers_logo.png" },
                        { name: "Cleveland Browns", record: "1-1", logo: "path/to/browns_logo.png" },
                        { name: "Cincinnati Bengals", record: "0-2", logo: "path/to/bengals_logo.png" },
                        { name: "Baltimore Ravens", record: "0-2", logo: "path/to/ravens_logo.png" }
                    ]
                },
                {
                    name: "AFC South",
                    teams: [
                        { name: "Houston Texans", record: "2-0", logo: "path/to/texans_logo.png" },
                        { name: "Tennessee Titans", record: "0-2", logo: "path/to/titans_logo.png" },
                        { name: "Jacksonville Jaguars", record: "0-2", logo: "path/to/jaguars_logo.png" },
                        { name: "Indianapolis Colts", record: "0-2", logo: "path/to/colts_logo.png" }
                    ]
                }
            ]
        },
        {
            name: "NFC",
            divisions: [
                {
                    name: "NFC East",
                    teams: [
                        { name: "Washington Commanders", record: "1-1", logo: "path/to/commanders_logo.png" },
                        { name: "Philadelphia Eagles", record: "1-1", logo: "path/to/eagles_logo.png" },
                        { name: "Dallas Cowboys", record: "1-1", logo: "path/to/cowboys_logo.png" },
                        { name: "New York Giants", record: "0-2", logo: "path/to/giants_logo.png" }
                    ]
                },
                {
                    name: "NFC West",
                    teams: [
                        { name: "Seattle Seahawks", record: "2-0", logo: "path/to/seahawks_logo.png" },
                        { name: "Arizona Cardinals", record: "1-1", logo: "path/to/cardinals_logo.png" },
                        { name: "San Francisco 49ers", record: "1-1", logo: "path/to/49ers_logo.png" },
                        { name: "Los Angeles Rams", record: "0-2", logo: "path/to/rams_logo.png" }
                    ]
                },
                {
                    name: "NFC North",
                    teams: [
                        { name: "Minnesota Vikings", record: "2-0", logo: "path/to/vikings_logo.png" },
                        { name: "Detroit Lions", record: "1-1", logo: "path/to/lions_logo.png" },
                        { name: "Chicago Bears", record: "1-1", logo: "path/to/bears_logo.png" },
                        { name: "Green Bay Packers", record: "1-1", logo: "path/to/packers_logo.png" }
                    ]
                },
                {
                    name: "NFC South",
                    teams: [
                        { name: "New Orleans Saints", record: "2-0", logo: "path/to/saints_logo.png" },
                        { name: "Tampa Bay Buccaneers", record: "2-0", logo: "path/to/buccaneers_logo.png" },
                        { name: "Atlanta Falcons", record: "1-1", logo: "path/to/falcons_logo.png" },
                        { name: "Carolina Panthers", record: "0-2", logo: "path/to/panthers_logo.png" }
                    ]
                }
            ]
        }
    ]
};

function recordToSortableValue(record) {
    const [wins, losses] = record.split('-').map(Number);
    return wins - losses;
}

function sortTeamsByRecord(teams) {
    return teams.sort((a, b) => {
        const aValue = recordToSortableValue(a.record);
        const bValue = recordToSortableValue(b.record);
        return bValue - aValue; // Sort in descending order
    });
}

function generateDivisionHTML(division) {
    const sortedTeams = sortTeamsByRecord(division.teams);
    
    let html = `
        <div class="division-container">
            <h3>${division.name}</h3>
            <div class="team-grid">
    `;
    
    sortedTeams.forEach(team => {
        html += `
            <div class="team-box">
                <div class="team-record">${team.record}</div>
                <div class="team-info">
                    <img src="${team.logo}" alt="${team.name}">
                    <p>${team.name}</p>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function generateConferenceHTML(conference) {
    let html = `<div class="conference-container"><h2>${conference.name}</h2>`;
    
    conference.divisions.forEach(division => {
        html += generateDivisionHTML(division);
    });
    
    html += `</div>`;
    
    return html;
}

// Generate HTML for conferences and divisions
let fullHTML = '';
nflData.conferences.forEach(conference => {
    fullHTML += generateConferenceHTML(conference);
});

// Insert generated HTML into container
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.container').innerHTML = fullHTML;
});