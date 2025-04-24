let watchId = null;
let prevPos = null;
let totalDistance = 0;
let isRunning = false;
let startTime = null;
let timerInterval = null;
let elapsedSeconds = 0;
let map, marker, path;

const distanceEl = document.getElementById('distance');
const timeEl = document.getElementById('time');
const speedEl = document.getElementById('speed');

function initMap() {
    map = L.map('map').setView([37.5665, 126.9780], 15); // 서울 기본 위치

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    path = L.polyline([], { color: 'blue' }).addTo(map);
}

document.getElementById('start').addEventListener('click', () => {
    if (isRunning) return;

    isRunning = true;
    startTime = Date.now() - (elapsedSeconds * 1000);
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
    elapsedSeconds = 0;
    prevPos = null;
    startTime = null;

    distanceEl.textContent = '0.00';
    timeEl.textContent = '00:00:00';
    speedEl.textContent = '0.00';

    map.setView([37.5665, 126.9780], 15);
    path.setLatLngs([]);
    if (marker) marker.remove();
});

function onSuccess(pos) {
    const { latitude, longitude } = pos.coords;

    if (prevPos) {
        const dist = getDistanceFromLatLonInKm(prevPos.lat, prevPos.lon, latitude, longitude);
        totalDistance += dist;
        distanceEl.textContent = totalDistance.toFixed(2);

        const speed = totalDistance / (elapsedSeconds / 3600);
        speedEl.textContent = speed.toFixed(2);
    }

    prevPos = { lat: latitude, lon: longitude };

    if (!marker) {
        marker = L.marker([latitude, longitude]).addTo(map);
    } else {
        marker.setLatLng([latitude, longitude]);
    }

    path.addLatLng([latitude, longitude]);
    map.setView([latitude, longitude], map.getZoom());
}

function onError(err) {
    console.error('GPS 오류:', err.message);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function updateTime() {
    elapsedSeconds++;
    const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}

initMap();
