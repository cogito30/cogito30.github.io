let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

const generateCalendar = (year, month) => {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const today = new Date();
    const todayDate = today.getDate();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    document.getElementById('month-year').textContent = `${year}년 ${month + 1}월`;

    dayNames.forEach((day, index) => {
        const div = document.createElement('div');
        div.classList.add('day', 'header');
        if (index === 0) div.classList.add('sunday');
        if (index === 6) div.classList.add('saturday')
        div.textContent = day;
        calendar.appendChild(div);
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendar.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement('div');
        div.classList.add('day');
        if ((firstDay + day - 1) % 7 === 0) div.classList.add('sunday');
        if ((firstDay + day - 1) % 7 === 6) div.classList.add('saturday');
        if (year === todayYear && month === todayMonth && day === todayDate) {
            div.classList.add('today');
        }
        div.textContent = day;
        calendar.appendChild(div);
    }
};

function changeMonth(step) {
    currentMonth += step;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
}

function goToToday() {
    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth();
    generateCalendar(currentYear, currentMonth);
}

const updateDate = () => {
    const locale = document.getElementById('locale-selector').value || navigator.language;
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(locale, options);
    
    document.getElementById('date').textContent = formattedDate;
};

// const updateDate2 = () => {
//     const timezone = document.getElementById('timezone-selector').value;
//     const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const date = String(now.getDate()).padStart(2, '0');
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const day = days[now.getDay()];

//     const timeString = `${year}-${month}-${date} (${day})`;
//     document.getElementById('date').textContent = timeString;
// };

const updateClock = () => {
    const timezone = document.getElementById('timezone-selector').value;
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
};

generateCalendar(currentYear, currentMonth);
document.getElementById('today').addEventListener('click', goToToday);
document.getElementById('locale-selector').addEventListener('change', updateDate);
document.getElementById('timezone-selector').addEventListener('change', updateClock);
setInterval(updateDate, 1000);
setInterval(updateClock, 1000);
updateDate();
updateClock();