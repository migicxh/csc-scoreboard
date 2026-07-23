
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
    clock: "00:00",
    homeLogo: "https://placehold.co/48x48",
    awayLogo: "https://placehold.co/48x48"
};
};

function formatClock() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function sendState() {
    channel.postMessage(state);
    localStorage.setItem("scoreboardState", JSON.stringify(state));
}

function updateOverlay() {
    state.homeName = document.getElementById("homeNameInput").value;
    state.awayName = document.getElementById("awayNameInput").value;
    state.period = document.getElementById("periodInput").value;
    state.clock = document.getElementById("clockInput").value;

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
        state.clock = formatClock();

        document.getElementById("clockInput").value = state.clock;

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
    state.clock = "00:00";

    document.getElementById("clockInput").value = state.clock;

    sendState();
}

function resetMatch() {
    pauseClock();

    seconds = 0;

    state = {
        homeName: "HOME FC",
        awayName: "AWAY FC",
        homeScore: 0,
        awayScore: 0,
        period: "1ST",
        clock: "00:00",
        homeLogo: "https://placehold.co/48x48",
        awayLogo: "https://placehold.co/48x48"
    };

    document.getElementById("homeNameInput").value = state.homeName;
    document.getElementById("awayNameInput").value = state.awayName;
    document.getElementById("periodInput").value = state.period;
    document.getElementById("clockInput").value = state.clock;

    sendState();
}

// Initialize
sendState();
