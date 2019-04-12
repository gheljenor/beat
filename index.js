const page = document.querySelector(".page");
const indicator = document.querySelector(".indicator");
const start = document.querySelector(".start");
const settings = document.querySelector(".settings");

const beat = document.querySelector(".beat");
const total = document.querySelector(".total");

let timer;
let interval;
let started = false;
let program;
let line;
let played;
let ts;

settings.value = localStorage.getItem("saved");

function run() {
    timer = clearTimeout(timer);
    interval = clearInterval(interval);

    if (started) {
        showStopped();
        return;
    } else {
        showPlaying();
    }

    program = getProgram();
    showTotal(program);

    nextLine();
}

function nextLine() {
    clearInterval(interval);

    if (!program.length) {
        showStopped();
        line = null;
        return console.log("Done");
    }

    line = program.shift();
    played = 0;

    resume();
}

function runLine() {
    const [bpm, duration] = line;
    beat.innerHTML = `${ bpm } x ${ duration }`;

    console.log("Running", "BPM:", bpm, "Duration:", duration, "Played:", played);

    const beatDuration = 60000 / bpm;
    indicator.style = `animation-duration: ${ beatDuration.toFixed(1) }ms;`;
    interval = setInterval(showBeat, beatDuration);
    timer = setTimeout(nextLine, duration * 1000 - played);
}

function toggle() {
    if (!line) {
        return run();
    }

    if (started) {
        pause();
    } else {
        resume();
    }
}

function pause() {
    played += Date.now() - ts;
    clearInterval(interval);
    clearTimeout(timer);
    showStopped();
}

function resume() {
    ts = Date.now();
    showPlaying();
    runLine();
}

function showStopped() {
    started = false;
    page.classList.remove("playing");
}

function showPlaying() {
    started = true;
    page.classList.add("playing");
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

function showBeat() {
    console.log("bip");
    try { navigator.vibrate(30); } catch (e) {}
}

settings.addEventListener("input", update);
setTimeout(update, 0);

start.addEventListener("click", run);
indicator.addEventListener("click", toggle);
