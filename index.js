const indicator = document.querySelector(".indicator");
const start = document.querySelector(".start");
const settings = document.querySelector(".settings");

const beat = document.querySelector(".beat");
const count = document.querySelector(".count");

let timer;
let interval;

let counter = 0;

function run() {
    counter = 0;
    timer = clearTimeout(timer);
    interval = clearInterval(interval);

    const program = settings.value.split("\n");

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
    try { navigator.vibrate(60); }catch (e) {}
    setTimeout(() => indicator.classList.remove("on"), 100);
}

start.addEventListener("click", run);
