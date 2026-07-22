
let seconds = 0;
let running = true;

const clock = document.getElementById("clock");

function updateClock() {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    clock.innerHTML =
        String(mins).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0");

    seconds++;
}

setInterval(() => {
    if (running) updateClock();
}, 1000);
