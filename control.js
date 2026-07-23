
const channel = new BroadcastChannel("csc-scoreboard");

let timer = null;
let seconds = 0;

let state = {
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

const saved = localStorage.getItem("scoreboardState");
if (saved) {
    state = { ...state, ...JSON.parse(saved) };

    const parts = state.timer.split(":");
    seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function formatTimer() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function sendState() {
    channel.postMessage(state);
    localStorage.setItem("scoreboardState", JSON.stringify(state));
}

function updateOverlay() {
    state.matchTitle = document.getElementById("matchTitleInput").value;
    state.homeName = document.getElementById("homeNameInput").value;
    state.awayName = document.getElementById("awayNameInput").value;
    state.period = document.getElementById("periodInput").value;
    state.timer = document.getElementById("timerInput").value;

    sendState();
}

function changeScore(team, amount) {
    if (team === "home") {
        state.homeScore = Math.max(0, state.homeScore + amount);
    } else {
        state.awayScore = Math.max(0, state.awayScore + amount);
    }

    sendState();
}

function startClock() {
    if (timer) return;

    timer = setInterval(() => {
        seconds++;
        state.timer = formatTimer();

        document.getElementById("timerInput").value = state.timer;

        sendState();
    }, 1000);
}

function pauseClock() {
    clearInterval(timer);
    timer = null;
}

function resetClock() {
    pauseClock();

    seconds = 0;
    state.timer = "00:00";

    document.getElementById("timerInput").value = state.timer;

    sendState();
}

function resetMatch() {
    pauseClock();

    seconds = 0;

    state = {
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

    document.getElementById("matchTitleInput").value = state.matchTitle;
    document.getElementById("homeNameInput").value = state.homeName;
    document.getElementById("awayNameInput").value = state.awayName;
    document.getElementById("periodInput").value = state.period;
    document.getElementById("timerInput").value = state.timer;

    sendState();
}

window.onload = () => {
    document.getElementById("matchTitleInput").value = state.matchTitle;
    document.getElementById("homeNameInput").value = state.homeName;
    document.getElementById("awayNameInput").value = state.awayName;
    document.getElementById("periodInput").value = state.period;
    document.getElementById("timerInput").value = state.timer;

    sendState();
};
