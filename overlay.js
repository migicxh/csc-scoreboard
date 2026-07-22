const DEFAULT_STATE = {
    homeName: "HOME",
    awayName: "AWAY",
    homeScore: 0,
    awayScore: 0,
    period: "1ST",
    clock: "00:00",
    stoppage: "",
    homeLogo: "assets/logos/default.png",
    awayLogo: "assets/logos/default.png"
};

const channel = new BroadcastChannel("csc-scoreboard");

let state = {
    ...DEFAULT_STATE,
    ...JSON.parse(localStorage.getItem("csc-scoreboard") || "{}")
};

function updateOverlay() {
    document.getElementById("homeName").textContent = state.homeName;
    document.getElementById("awayName").textContent = state.awayName;

    document.getElementById("homeScore").textContent = state.homeScore;
    document.getElementById("awayScore").textContent = state.awayScore;

    document.getElementById("period").textContent = state.period;
    document.getElementById("clock").textContent = state.clock;
    document.getElementById("stoppage").textContent = state.stoppage;

    document.getElementById("homeLogo").src = state.homeLogo;
    document.getElementById("awayLogo").src = state.awayLogo;
}

channel.onmessage = (event) => {
    state = event.data;
    localStorage.setItem("csc-scoreboard", JSON.stringify(state));
    updateOverlay();
};

window.addEventListener("storage", () => {
    state = {
        ...DEFAULT_STATE,
        ...JSON.parse(localStorage.getItem("csc-scoreboard") || "{}")
    };
    updateOverlay();
});

updateOverlay();
