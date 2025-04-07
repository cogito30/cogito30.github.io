let timer;
let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
let isRunning = false;
let lapCounter = 0;
let lastRecordedTime = 0;
let recordList = document.getElementById('record-list');

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateTime, 10);
    }
}

function stopTimer() {
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    isRunning = false;
    lapCounter = 0;
    lastRecordedTime = 0;
    updateDisplay();
}

function updateTime() {
    milliseconds += 10;
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }
    }
    updateDisplay();
}

function updateDisplay() {
    document.querySelector('#timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

function formatTime(timeInMs) {
    let h = Math.floor(timeInMs / 3600000);
    let m = Math.floor((timeInMs % 3600000) / 60000);
    let s = Math.floor((timeInMs % 60000) / 1000);
    let ms = timeInMs % 1000;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function recordTime() {
    let currentTime = hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
    let splitTime = currentTime - lastRecordedTime;
    lastRecordedTime = currentTime;
    lapCounter++;
    
    let currentDate = new Date().toLocaleDateString();
    let dateSection = document.getElementById(`date-${currentDate}`);
    if (!dateSection) {
        dateSection = document.createElement('div');
        dateSection.id = `date-${currentDate}`;
        dateSection.classList.add('record-date');
        dateSection.innerHTML = `<strong>${currentDate}</strong><table><thead><tr><th>Lap No</th><th>Split</th><th>Total</th></tr></thead><tbody></tbody></table>`;
        recordList.appendChild(dateSection);
    }
    
    let tbody = dateSection.querySelector('tbody');
    let row = document.createElement('tr');
    row.innerHTML = `<td>${lapCounter}</td><td>${formatTime(splitTime)}</td><td>${formatTime(currentTime)}</td>`;
    tbody.appendChild(row);
}

function resetRecords() {
    if (!isRunning) {
        recordList.innerHTML = '';
    }
}

function saveRecords() {
    let recordsText = '';
    document.querySelectorAll('.record-date').forEach(dateSection => {
        recordsText += dateSection.querySelector('strong').textContent + "\n";
        recordsText += "Lap No | Split | Total\n";
        dateSection.querySelectorAll('tbody tr').forEach(row => {
            recordsText += row.children[0].textContent + " | " + row.children[1].textContent + " | " + row.children[2].textContent + "\n";
        });
        recordsText += "\n";
    });
    
    let blob = new Blob([recordsText], { type: 'text/plain' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'stopwatch_records.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const startButton = document.querySelector("#start-button");
const stopButton = document.querySelector("#stop-button");
const resetButton = document.querySelector("#reset-button");
startButton.onclick = startTimer;
stopButton.onclick = stopTimer;
resetButton.onclick = resetTimer;

const recordButton = document.querySelector("#record-button");
const recordResetButton = document.querySelector("#record-reset-button");
const recordSaveButton = document.querySelector("#record-save-button");
recordButton.onclick = recordTime;
recordResetButton.onclick = resetRecords;
recordSaveButton.onclick = saveRecords;