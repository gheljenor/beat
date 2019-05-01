if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(function(registration) {
            // Registration was successful
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
            registration.update();
        }, function(err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
        });
}

const page = document.querySelector(".page");
const indicator = document.querySelector(".indicator");
const title = document.querySelector(".title");
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
let done = 0;

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

    done = 0;
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

    if (!isFinite(line[0])) {
        title.innerHTML = line.join(" ");
        line = program.shift();
    }

    played = 0;
    ts = Date.now();

    resume();
}

function runLine() {
    const [duration, bpm, targetBpm] = line;

    console.log(
        "Running", "BPM:", bpm,
        "Duration:", duration,
        "Played:", played,
        "Target:", targetBpm || bpm
    );

    const durationMs = duration * 1000;

    timer = setTimeout(nextLine, durationMs - played);
    tick();
}

function tick() {
    if (!line) { return; }

    const now = Date.now();
    const lastBeat = now - ts;
    played += lastBeat;
    ts = now;

    const [duration, fromBpm, target] = line;

    const toBpm = target || fromBpm;

    const durationMs = duration * 1000;
    const currentBpm = parseInt(fromBpm) + (played / durationMs) * (toBpm - fromBpm);
    const beatDuration = 60000 / (currentBpm + 1);

    beat.innerHTML = `${ currentBpm.toFixed(1) } x ${ (duration - played / 1000).toFixed(1) }`;

    indicator.style = "animation: none;";
    indicator.offsetWidth;
    indicator.style = `animation-duration: ${ beatDuration.toFixed(1) }ms;`;

    console.log(
        "Done:", done,
        "Current BPM:", currentBpm,
        "Calc BPM:", 60000 / lastBeat,
        "Last beat:", lastBeat,
        "Played:", played / 1000
    );

    done++;

    setTimeout(() => navigator.vibrate(30), 0);
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
    const programm = settings.value.split("\n").map(v => v.split(" "));
    if (programm[0][0] === "shuffle") {
        return shuffle(programm.slice(1));
    } else {
        return programm;
    }
}

function showTotal(program) {
    let totalBeats = 0;
    let totalDuration = 0;

    program.forEach(([bpm, duration, to]) => {
        if (!isFinite(bpm)) { return; }
        const target = to || bpm;
        totalDuration += +duration;
        totalBeats += ((+bpm + +target) * duration / 120);
    });

    total.innerHTML = `${ totalBeats } : ${ totalDuration }`;
}

function update() {
    localStorage.setItem("saved", settings.value);
    showTotal(getProgram());
}

function shuffle(lines) {
    const result = [];
    while (lines.length) {
        const i = Math.floor(Math.random() * lines.length);
        result.push(lines.splice(i, 1)[0]);
    }
    return result;
}

indicator.addEventListener("animationiteration", tick);

settings.addEventListener("input", update);
setTimeout(update, 0);

start.addEventListener("click", run);
indicator.addEventListener("click", toggle);
