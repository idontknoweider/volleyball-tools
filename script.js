let players = JSON.parse(localStorage.getItem("players")) || [];

function savePlayers() {
    localStorage.setItem("players", JSON.stringify(players));
}

function addPlayer() {
    const name = document.getElementById("playerName").value.trim();
    const role = document.getElementById("playerRole").value;

    if (name === "") {
        alert("Please enter a player name.");
        return;
    }

    players.push({ name, role });
    savePlayers();
    displayPlayers();
    document.getElementById("playerName").value = ""; // Clear input
}

function removePlayer(index) {
    players.splice(index, 1);
    savePlayers();
    displayPlayers();
}

function displayPlayers() {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = "";
    
    players.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("draggable");
        playerDiv.draggable = true;
        playerDiv.ondragstart = (event) => drag(event, index);
        playerDiv.innerHTML = `${player.name} - ${player.role} 
            <button onclick="removePlayer(${index})">Remove</button>`;
        playersList.appendChild(playerDiv);
    });
}

function generateTeams() {
    const noLiberoMode = document.getElementById("noLiberoMode").checked;
    
    let filteredPlayers = [...players];
    
    if (noLiberoMode) {
        filteredPlayers = filteredPlayers.filter(player => player.role !== "libero");
    }

    const teamA = document.getElementById("teamA");
    const teamB = document.getElementById("teamB");
    
    teamA.innerHTML = "<h2>Team A</h2>";
    teamB.innerHTML = "<h2>Team B</h2>";

    let roleGroups = {
        spiker: [],
        setter: [],
        libero: [],
        "middle blocker": [],
    };

    filteredPlayers.forEach(player => {
        roleGroups[player.role].push(player);
    });

    let teamAPlayers = [];
    let teamBPlayers = [];

    function assignPlayers(role, maxPerTeam) {
        let rolePlayers = roleGroups[role].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < rolePlayers.length; i++) {
            if (i % 2 === 0 && teamAPlayers.filter(p => p.role === role).length < maxPerTeam) {
                teamAPlayers.push(rolePlayers[i]);
            } else if (teamBPlayers.filter(p => p.role === role).length < maxPerTeam) {
                teamBPlayers.push(rolePlayers[i]);
            }
        }
    }

    assignPlayers("spiker", 3);
    assignPlayers("setter", 1);
    assignPlayers("middle blocker", noLiberoMode ? 2 : 1);
    
    if (!noLiberoMode) {
        assignPlayers("libero", 1);
    }

    function displayTeam(teamElement, teamArray) {
        teamArray.forEach((player, index) => {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("draggable");
            playerDiv.draggable = true;
            playerDiv.ondragstart = (event) => drag(event, index);
            playerDiv.id = `player-${index}`;
            playerDiv.textContent = `${player.name} - ${player.role}`;
            teamElement.appendChild(playerDiv);
        });
    }

    displayTeam(teamA, teamAPlayers);
    displayTeam(teamB, teamBPlayers);
}

function drag(event, playerId) {
    event.dataTransfer.setData("playerId", playerId);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, teamId) {
    event.preventDefault();
    const playerId = event.dataTransfer.getData("playerId");
    const playerElement = document.getElementById(`player-${playerId}`);

    if (playerElement) {
        document.getElementById(teamId).appendChild(playerElement);
    }
}

document.addEventListener("DOMContentLoaded", displayPlayers);
