let startTime;
let elapsedTime = 0;
let timerInterval;
let previousLapTime = 0;

const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsEl = document.getElementById('laps');

function timeToString(time) {
    const date = new Date(time);
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    const sec = String(date.getUTCSeconds()).padStart(2, '0');
    const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${min}:${sec}.${ms}`;
}

function printTime() {
    timeEl.textContent = timeToString(elapsedTime);
}

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        printTime();
    }, 10);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    resetBtn.disabled = false;
}

function pause() {
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    previousLapTime = 0;
    printTime();
    lapsEl.innerHTML = '';

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

function lap() {
    const currentLapTime = elapsedTime;
    const lapDiff = currentLapTime - previousLapTime;
    previousLapTime = currentLapTime;

    const lapText = timeToString(currentLapTime);
    const diffText = `+${timeToString(lapDiff)}`;

    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span>Lap ${lapsEl.children.length + 1}</span>
        <span>${lapText}</span>
        <span>${diffText}</span>
    `;
    lapsEl.prepend(lapItem);
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

/* 전체화면 모드 */
const fullscreenBtn = document.getElementById('fullscreen-btn');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            alert(`전체화면 전환 실패: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});