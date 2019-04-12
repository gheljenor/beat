const page = document.querySelector(".page");
const indicator = document.querySelector(".indicator");
const start = document.querySelector(".start");
const settings = document.querySelector(".settings");

const beat = document.querySelector(".beat");
const total = document.querySelector(".total");

let timer;
let interval;
let started = false;

settings.value = localStorage.getItem("saved");

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
        clearInterval(interval);

        if (!program.length) {
            showStart();
            return console.log("Done");
        }

        const [bpm, duration] = program.shift();
        beat.innerHTML = `${ bpm } x ${ duration }`;

        console.log("Running", "BPM:", bpm, "Duration:", duration);

        const beatDuration = 60000 / bpm;
        indicator.style = `animation-duration: ${ beatDuration.toFixed(1) }ms;`;
        interval = setInterval(showBeat, beatDuration);
        timer = setTimeout(runLine, duration * 1000);
    }

    runLine();
}

function showStart() {
    started = false;
    page.classList.remove("playing");
}

function showStop() {
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

settings.addEventListener("input", update);
setTimeout(update, 0);

function showBeat() {
    console.log("bip");
    try { navigator.vibrate(45); } catch (e) {}
}

start.addEventListener("click", run);
