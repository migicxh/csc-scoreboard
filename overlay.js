
const channel = new BroadcastChannel("csc-scoreboard");

const defaultState = {
    matchTitle: "HOURLY KNOCKOUT",
    homeName: "HOME FC",
    awayName: "AWAY FC",
    homeScore: 0,
    awayScore: 0,
    period: "1ST",
    clock: "00:00",
    homeLogo: "https://placehold.co/48x48",
    awayLogo: "https://placehold.co/48x48"
};

let state = JSON.parse(localStorage.getItem("scoreboardState")) || defaultState;

function updateOverlay() {
    document.getElementById("matchTitle").textContent = state.matchTitle;
    
    document.getElementById("homeName").textContent = state.homeName;
    document.getElementById("awayName").textContent = state.awayName;

    document.getElementById("homeScore").textContent = state.homeScore;
    document.getElementById("awayScore").textContent = state.awayScore;

    document.getElementById("clock").textContent = state.clock;
    document.getElementById("period").textContent = state.period;

    document.getElementById("homeLogo").src = state.homeLogo;
    document.getElementById("awayLogo").src = state.awayLogo;
}

updateOverlay();

channel.onmessage = (event) => {
    state = event.data;
    localStorage.setItem("scoreboardState", JSON.stringify(state));
    updateOverlay();
};

window.addEventListener("storage", () => {
    const saved = localStorage.getItem("scoreboardState");
    if (saved) {
        state = JSON.parse(saved);
        updateOverlay();
    }
});
