let players = [];

function addPlayer() {
    const name = document.getElementById("playerName").value.trim();
    const role = document.getElementById("playerRole").value;

    if (name === "") {
        alert("Please enter a player name.");
        return;
    }

    players.push({ name, role });
    document.getElementById("playerName").value = ""; // Clear input
}

function generateTeams() {
    const teamA = [];
    const teamB = [];

    // Shuffle the players randomly
    players = players.sort(() => Math.random() - 0.5);

    // Distribute players evenly into teams based on roles
    const roles = ["spiker", "setter", "libero", "middle blocker"];
    const roleGroups = {};

    roles.forEach(role => {
        roleGroups[role] = players.filter(player => player.role === role);
    });

    roles.forEach(role => {
        roleGroups[role].forEach((player, index) => {
            if (index % 2 === 0) {
                teamA.push(player);
            } else {
                teamB.push(player);
            }
        });
    });

    displayTeams(teamA, teamB);
}

function displayTeams(teamA, teamB) {
    document.getElementById("teamA").innerHTML = teamA.map(p => `<li>${p.name} - ${p.role}</li>`).join("");
    document.getElementById("teamB").innerHTML = teamB.map(p => `<li>${p.name} - ${p.role}</li>`).join("");
}
