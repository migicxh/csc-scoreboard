
let home = 0;
let away = 0;

function homeGoal() {
    home++;
    localStorage.setItem("homeScore", home);
}

function awayGoal() {
    away++;
    localStorage.setItem("awayScore", away);
}

function startClock() {
    localStorage.setItem("clockRunning", "true");
}

function pauseClock() {
    localStorage.setItem("clockRunning", "false");
}

function resetClock() {
    localStorage.setItem("clockReset", Date.now());
}
