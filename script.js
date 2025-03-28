let playerPool = JSON.parse(localStorage.getItem("playerPool")) || [];
let signUpList = JSON.parse(localStorage.getItem("signUpList")) || [];
let teamA = JSON.parse(localStorage.getItem("teamA")) || [];
let teamB = JSON.parse(localStorage.getItem("teamB")) || [];

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function suffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to save data to local storage
function saveToStorage() {
    localStorage.setItem("playerPool", JSON.stringify(playerPool));
    localStorage.setItem("signUpList", JSON.stringify(signUpList));
    localStorage.setItem("teamA", JSON.stringify(teamA));
    localStorage.setItem("teamB", JSON.stringify(teamB));
}

// Interaction functions
function addToPool() {
    const name = document.getElementById("playerName").value.trim();
    const role = document.getElementById("playerRole").value;

    // Check that a name has been entered
    if (name === "") {
        alert("Por favor, introduce un nombre.");
        return;
    }

    // Check that player does not already exist in the pool
    for (let i = 0; i < playerPool.length; i++) {
        if (playerPool[i].name.toLowerCase() === name.toLowerCase()) {
            alert("La jugadora ya existe en la lista.");
            return;
        }
    }

    // Add player to the pool
    playerPool.push({ name, role });
    saveToStorage();
    displayPlayerPool();
    document.getElementById("playerName").value = ""; // Clear input field
}

function removeFromPool(index) {
    
    // Remove player from sign-up list if they are there
    for (let i = 0; i < signUpList.length; i++) {
        if (signUpList[i].name === playerPool[index].name) {
            signUpList.splice(i, 1);
            break;
        }
    }
    
    playerPool.splice(index, 1);

    saveToStorage();
    
    // Update sign-up list and player pool display
    displaySignUpList();
    displayPlayerPool();

}

function addToSignUp(index) {
    // Check if player is already in the sign-up list
    for (let i = 0; i < signUpList.length; i++) {
        if (signUpList[i].name === playerPool[index].name) {
            alert("La jugadora elegida ya está registrada para el partido.");
            return;
        }
    }

    // Add player to the sign-up list
    signUpList.push(playerPool[index]);
    saveToStorage();
    displaySignUpList();
    displayPlayerPool();
}

function removeFromSignUp(index) {
    signUpList.splice(index, 1);
    saveToStorage();
    displaySignUpList();
    displayPlayerPool();
}

function clearSignUp() {
    signUpList = [];
    saveToStorage();
    displaySignUpList();
    displayPlayerPool();
}

function displayPlayerPool() {
    const poolDiv = document.getElementById("playerPool");
    poolDiv.innerHTML = "";

    // Order the player pool by name
    playerPool.sort((a, b) => a.name.localeCompare(b.name));

    // Display each player in the pool
    playerPool.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player-item");
        playerDiv.innerHTML = `${player.name} - ${capitalizeFirstLetter(player.role)}
            <div class="button-holder">
                <button onclick="addToSignUp(${index})">Apuntar</button>
                <button onclick="removeFromPool(${index})">Eliminar</button>
            </div>`;
        poolDiv.appendChild(playerDiv);

        // Add color if player is in the sign-up list
        if (signUpList.some(signUpPlayer => signUpPlayer.name === player.name)) {
            playerDiv.classList.add("highlight");
        }
    });
}

function displaySignUpList() {
    const signUpDiv = document.getElementById("signUpList");
    signUpDiv.innerHTML = "";

    // Order the sign-up list by name
    signUpList.sort((a, b) => a.name.localeCompare(b.name));

    // Display each player in the sign-up list
    signUpList.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player-item");
        playerDiv.innerHTML = `${player.name} - ${capitalizeFirstLetter(player.role)}
            <div class="button-holder"> 
                <button onclick="removeFromSignUp(${index})">Desapuntar</button>
            </div>`;
        signUpDiv.appendChild(playerDiv);
    });
}

function generateTeams() {
    // Check that there are 12 players on the list
    if (signUpList.length < 12) {
        alert("Por favor, apunta al menos a 12 personas al partido.");
        return;
    }

    const noLiberoMode = document.getElementById("noLiberoMode").checked;
    
    let filteredPlayers = [...signUpList];
    if (noLiberoMode) {
        filteredPlayers = filteredPlayers.filter(player => player.role !== "libero");
    }

    // Separate players by role
    let setters = filteredPlayers.filter(player => player.role === "colocadora");
    let outsideHitters = filteredPlayers.filter(player => player.role === "punta");
    let middleBlockers = filteredPlayers.filter(player => player.role === "central");
    let opposites = filteredPlayers.filter(player => player.role === "opuesta");

    // Shuffle the players
    suffleArray(setters);
    suffleArray(outsideHitters);
    suffleArray(middleBlockers);
    suffleArray(opposites);

    // Create teams
    teamA = [];
    teamB = [];
    const maxTeamSize = Math.ceil(filteredPlayers.length / 2);
    const minTeamSize = Math.floor(filteredPlayers.length / 2);

    // Distribute players to teams
    while (teamA.length < maxTeamSize && teamB.length < minTeamSize) {
        if (setters.length > 0) {
            teamA.push(setters.shift());
        }
        if (setters.length > 0) {
            teamB.push(setters.shift());
        }
        if (outsideHitters.length > 0) {
            teamA.push(outsideHitters.shift());
        }
        if (outsideHitters.length > 0) {
            teamB.push(outsideHitters.shift());
        }
        if (middleBlockers.length > 0) {
            teamA.push(middleBlockers.shift());
        }
        if (middleBlockers.length > 0) {
            teamB.push(middleBlockers.shift());
        }
        if (opposites.length > 0) {
            teamA.push(opposites.shift());
        }
        if (opposites.length > 0) {
            teamB.push(opposites.shift());
        }
    }
    // If there are any players left, add them to the teams
    while (setters.length > 0) {
        if (teamA.length < maxTeamSize) {
            teamA.push(setters.shift());
        } else {
            teamB.push(setters.shift());
        }
    }

    while (outsideHitters.length > 0) {
        if (teamA.length < maxTeamSize) {
            teamA.push(outsideHitters.shift());
        } else {
            teamB.push(outsideHitters.shift());
        }
    }

    while (middleBlockers.length > 0) {
        if (teamA.length < maxTeamSize) {
            teamA.push(middleBlockers.shift());
        } else {
            teamB.push(middleBlockers.shift());
        }
    }

    while (opposites.length > 0) {
        if (teamA.length < maxTeamSize) {
            teamA.push(opposites.shift());
        } else {
            teamB.push(opposites.shift());
        }
    }

    displayTeams(teamA, teamB);
    saveToStorage();
}

function displayTeams(teamA, teamB) {
    const teamADiv = document.getElementById("teamA");
    const teamBDiv = document.getElementById("teamB");

    teamADiv.innerHTML = "";
    teamBDiv.innerHTML = "";
    teamADiv.ondrop = (event) => drop(event, "teamA");
    teamBDiv.ondrop = (event) => drop(event, "teamB");

    // Order the teams by role
    teamA.sort((a, b) => a.role.localeCompare(b.role));
    teamB.sort((a, b) => a.role.localeCompare(b.role));

    // Display team A
    teamA.forEach((player, index) => {
        let div = document.createElement("div");
        div.classList.add("player-item", "draggable");
        div.innerHTML = `${player.name} - ${capitalizeFirstLetter(player.role)} 
            <button onclick="removeFromTeam(${index}, 'A')">❌</button>`;
        teamADiv.appendChild(div);
    });

    // Display team B
    teamB.forEach((player, index) => {
        let div = document.createElement("div");
        div.classList.add("player-item", "draggable");
        div.innerHTML = `${player.name} - ${capitalizeFirstLetter(player.role)} 
            <button onclick="removeFromTeam(${index}, 'B')">❌</button>`;
        teamBDiv.appendChild(div);
    });

    enableDragAndDrop();
}

function clearTeam(team) {
    if (team === "A") {
        teamA = [];
    } else {
        teamB = [];
    }
    saveToStorage();
    displayTeams(teamA, teamB);
}


// Drag and drop functionality
function removeFromTeam(index, team) {
    if (team === "A") {
        teamA.splice(index, 1);
    } else {
        teamB.splice(index, 1);
    }
    displayTeams(teamA, teamB);
    saveToStorage();
}

function enableDragAndDrop() {
    let draggables = document.querySelectorAll(".draggable");
    let dropZones = [document.getElementsByClassName("team one")[0], document.getElementsByClassName("team two")[0]];

    draggables.forEach(draggable => {
        draggable.setAttribute("draggable", true);
        draggable.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", draggable.innerHTML);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        zone.addEventListener("drop", (event) => {
            event.preventDefault();

            // Get the data from the dragged element
            let data = event.dataTransfer.getData("text/plain");
            let playerName = data.split(" - ")[0];
            let playerRole = data.split(" - ")[1].split(" ")[0];

            // Determine the target team
            let team = zone.classList.contains("one") ? "A" : "B";
            let newTeamArray = team === "A" ? teamA : teamB;

            // Check if the player is already in the target team
            if (newTeamArray.some(player => player.name === playerName)) {
                return; // Prevent duplicates
            }

            // Remove the player from the original team
            let originalTeamArray = team === "A" ? teamB : teamA;
            let originalPlayerIndex = originalTeamArray.findIndex(player => player.name === playerName);

            if (originalPlayerIndex !== -1) {
                originalTeamArray.splice(originalPlayerIndex, 1);
            }

            // Add the player to the new team
            newTeamArray.push({ name: playerName, role: playerRole });

            // Update the display and storage
            displayTeams(teamA, teamB);
            saveToStorage();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayPlayerPool();
    displaySignUpList();
    displayTeams(teamA, teamB);
});
