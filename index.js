const indicator = document.querySelector(".indicator");
const start = document.querySelector(".start");
const settings = document.querySelector(".settings");

const beat = document.querySelector(".beat");
const total = document.querySelector(".total");

let timer;
let interval;
let started = false;

const saved = localStorage.getItem("saved");
if (saved) {
    settings.innerHTML = saved;
}

function run() {
    timer = clearTimeout(timer);
    interval = clearInterval(interval);

    if (started) {
        showStart();
        return;
    } else {
        showStop();
    }

    const program = getProgram();
    showTotal(program);

    function runLine() {
        showBeat();
        clearInterval(interval);

        if (!program.length) {
            showStart();
            return console.log("Done");
        }

        const [bpm, duration] = program.shift();
        beat.innerHTML = `${ bpm } x ${ duration }`;

        console.log("Running", "BPM:", bpm, "Duration:", duration);
        interval = setInterval(showBeat, 60000 / bpm);
        timer = setTimeout(runLine, duration * 1000);
    }

    runLine();
}

function showStart() {
    started = false;
    start.innerHTML = "start";
}

function showStop() {
    started = true;
    start.innerHTML = "stop";
}

function getProgram() {
    return settings.value.split("\n").map(v => v.split(" "));
}

function showTotal(program) {
    let totalBeats = 0;
    let totalDuration = 0;

    program.forEach(([bpm, duration]) => {
        totalDuration += +duration;
        totalBeats += (bpm * duration / 60);
    });

    total.innerHTML = `${ totalBeats } : ${ totalDuration }`;
}

function update() {
    localStorage.setItem("saved", settings.value);
    showTotal(getProgram());
}

settings.addEventListener("input", update);
update();

function showBeat() {
    console.log("bip");
    indicator.classList.add("on");
    try { navigator.vibrate(40); } catch (e) {}
    setTimeout(() => indicator.classList.remove("on"), 100);
}

start.addEventListener("click", run);
