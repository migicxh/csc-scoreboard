
const defaultState = {
    matchTitle: "HOURLY KNOCKOUT",
    homeName: "HOME FC",
    awayName: "AWAY FC",
    homeScore: 0,
    awayScore: 0,
    period: "1ST",
    timer: "00:00",
    homeLogo: "https://placehold.co/48x48",
    awayLogo: "https://placehold.co/48x48"
};

let lastState = "";

function updateOverlay() {
    const state = {
        ...defaultState,
        ...(JSON.parse(localStorage.getItem("scoreboardState")) || {})
    };

    document.getElementById("matchTitle").textContent = state.matchTitle;
    document.getElementById("homeName").textContent = state.homeName;
    document.getElementById("awayName").textContent = state.awayName;
    document.getElementById("homeScore").textContent = state.homeScore;
    document.getElementById("awayScore").textContent = state.awayScore;
    document.getElementById("timer").textContent = state.timer;
    document.getElementById("period").textContent = state.period;
    document.getElementById("homeLogo").src = state.homeLogo;
    document.getElementById("awayLogo").src = state.awayLogo;
}

setInterval(() => {
    const current = localStorage.getItem("scoreboardState") || "";

    if (current !== lastState) {
        lastState = current;
        updateOverlay();
    }
}, 100);

updateOverlay();
