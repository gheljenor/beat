const indicator = document.querySelector(".indicator");
const start = document.querySelector(".start");
const settings = document.querySelector(".settings");

const beat = document.querySelector(".beat");
const count = document.querySelector(".count");

let timer;
let interval;
let started = false;

let counter = 0;

const saved = localStorage.getItem("saved");
if (saved) {
    settings.innerHTML = saved;
}

function run() {
    counter = 0;
    timer = clearTimeout(timer);
    interval = clearInterval(interval);

    if (started) {
        started = false;
        start.innerHTML = 'start';
        return;
    } else {
        started = true;
        start.innerHTML = 'stop';
    }

    const program = settings.value.split("\n");

    localStorage.setItem("saved", program);

    function runLine() {
        showBeat();
        clearInterval(interval);
        const [bpm, duration] = (program.shift() || "").split(" ");
        if (!bpm) {
            console.log("Done");
            return;
        }

        beat.innerHTML = `${bpm} x ${duration}`;

        console.log("Running", "BPM:", bpm, "Duration:", duration );
        interval = setInterval(showBeat, 60000 / bpm);
        timer = setTimeout(runLine, duration * 1000);
    }

    runLine();
}

function showBeat() {
    console.log("bip");
    count.innerHTML = ` [${counter++}]`;
    indicator.classList.add("on");
    try { navigator.vibrate(40); }catch (e) {}
    setTimeout(() => indicator.classList.remove("on"), 100);
}

start.addEventListener("click", run);
