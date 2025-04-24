let watchId = null;
let prevPos = null;
let totalDistance = 0;
let isRunning = false;
let startTime = null;
let timerInterval = null;

const distanceEl = document.getElementById('distance');
const timeEl = document.getElementById('time');

document.getElementById('start').addEventListener('click', () => {
    if (isRunning) return;

    isRunning = true;
    startTime = Date.now() - (startTime ? (Date.now() - startTime) : 0);
    timerInterval = setInterval(updateTime, 1000);

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    });
});

document.getElementById('pause').addEventListener('click', () => {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerInterval);
    navigator.geolocation.clearWatch(watchId);
});

document.getElementById('reset').addEventListener('click', () => {
    isRunning = false;
    clearInterval(timerInterval);
    navigator.geolocation.clearWatch(watchId);

    totalDistance = 0;
    prevPos = null;
    startTime = null;
    distanceEl.textContent = '0.00';
    timeEl.textContent = '00:00:00';
});

function onSuccess(pos) {
    const { latitude, longitude } = pos.coords;

    if (prevPos) {
        const dist = getDistanceFromLatLonInKm(prevPos.lat, prevPos.lon, latitude, longitude);
        totalDistance += dist;
        distanceEl.textContent = totalDistance.toFixed(2);
    }

    prevPos = { lat: latitude, lon: longitude };
}

function onError(err) {
    console.error('GPS 오류:', err.message);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function updateTime() {
    const elapsed = Date.now() - startTime;
    const hours = String(Math.floor(elapsed / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((elapsed / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((elapsed / 1000) % 60)).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}
