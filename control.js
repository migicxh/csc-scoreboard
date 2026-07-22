
const channel = new BroadcastChannel("csc-scoreboard");

let timer = null;

let state = JSON.parse(localStorage.getItem("csc-scoreboard")) || {
    homeName: "HOME",
    awayName: "AWAY",
    homeScore: 0,
    awayScore: 0,
    period: "1ST",
    seconds: 0,
    clock: "00:00",
    stoppage: "",
    homeLogo: "assets/logos/default.png",
    awayLogo: "assets/logos/default.png"
};

function loadInputs() {
    document.getElementById("homeName").value = state.homeName;
    document.getElementById("awayName").value = state.awayName;
    document.getElementById("period").value = state.period;
    document.getElementById("clock").value = state.clock;
}

function formatClock() {
    const minutes = Math.floor(state.seconds / 60);
    const seconds = state.seconds % 60;

    state.clock =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    document.getElementById("clock").value = state.clock;
}

function sendState() {
    localStorage.setItem("csc-scoreboard", JSON.stringify(state));
    channel.postMessage(state);
}

function updateOverlay() {
    state.homeName = document.getElementById("homeName").value || "HOME";
    state.awayName = document.getElementById("awayName").value || "AWAY";
    state.period = document.getElementById("period").value;

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
        state.seconds++;
        formatClock();
        sendState();
    }, 1000);
}

function pauseClock() {
    clearInterval(timer);
    timer = null;
}

function resetClock() {
    pauseClock();
    state.seconds = 0;
    formatClock();
    sendState();
}

function resetMatch() {
    pauseClock();

    state = {
        homeName: "HOME",
        awayName: "AWAY",
        homeScore: 0,
        awayScore: 0,
        period: "1ST",
        seconds: 0,
        clock: "00:00",
        stoppage: "",
        homeLogo: "assets/logos/default.png",
        awayLogo: "assets/logos/default.png"
    };

    loadInputs();
    formatClock();
    sendState();
}

loadInputs();
formatClock();
sendState();
