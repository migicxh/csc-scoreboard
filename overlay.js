
const channel = new BroadcastChannel("csc-scoreboard");

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

let state = {
    ...defaultState,
    ...(JSON.parse(localStorage.getItem("scoreboardState")) || {})
};

function updateOverlay() {
    document.getElementById("matchTitle").textContent = state.matchTitle || "HOURLY KNOCKOUT";

    document.getElementById("homeName").textContent = state.homeName;
    document.getElementById("awayName").textContent = state.awayName;

    document.getElementById("homeScore").textContent = state.homeScore;
    document.getElementById("awayScore").textContent = state.awayScore;

    document.getElementById("timer").textContent = state.timer;
    document.getElementById("period").textContent = state.period;

    document.getElementById("homeLogo").src = state.homeLogo;
    document.getElementById("awayLogo").src = state.awayLogo;
}

updateOverlay();

channel.onmessage = (event) => {
    state = {
        ...defaultState,
        ...event.data
    };

    localStorage.setItem("scoreboardState", JSON.stringify(state));
    updateOverlay();
};

window.addEventListener("storage", () => {
    const saved = localStorage.getItem("scoreboardState");
    if (saved) {
        state = {
            ...defaultState,
            ...JSON.parse(saved)
        };
        updateOverlay();
    }
});
