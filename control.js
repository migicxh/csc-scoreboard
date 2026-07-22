
const channel = new BroadcastChannel("csc-scoreboard");

let state = JSON.parse(localStorage.getItem("csc-scoreboard")) || {
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

function loadInputs() {
    document.getElementById("homeName").value = state.homeName;
    document.getElementById("awayName").value = state.awayName;
    document.getElementById("period").value = state.period;
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
    state.clock = document.getElementById("clock").value || "00:00";

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

function resetMatch() {
    state = {
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

    loadInputs();
    sendState();
}

loadInputs();
sendState();
