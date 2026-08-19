let currentScore = Number(localStorage.getItem('studyFlowScore')) || 0;
let currentDate = new Date();
let scheduleEvents = {};
let selectedDateKey = null;

const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

function readPlanInputs() {
    const sleep = parseFloat(document.getElementById('sleepTime').value) || 0;
    const work = parseFloat(document.getElementById('workTime').value) || 0;
    const subject = document.getElementById('subject').value;
    const days = parseInt(document.getElementById('targetDays').value) || 1;
    return { sleep, work, subject, days };
}

function getTimeSlot(hours, index) {
    const startHour = index % 2 === 0 ? 18 : 19;
    const endHour = startHour + Math.ceil(Number(hours));
    return `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00 น.`;
}

function buildSchedule(showAlert = true) {
    const { sleep, work, subject, days } = readPlanInputs();

    const freeTime = 24 - sleep - work - 2;

    if (freeTime <= 0) {
        alert("เวลาไม่พอ! คุณไม่มีเวลาว่างเหลือสำหรับติว");
        return false;
    }

    if (sleep + work > 24 || days < 1) {
        alert("กรุณาตรวจสอบจำนวนชั่วโมงและจำนวนวันอีกครั้ง");
        return false;
    }
    scheduleEvents = {};
    const today = new Date();
    const studyHours = Math.min(3, Math.max(1, freeTime / 5)).toFixed(1);

    // สร้างแผนการเรียนเริ่มตั้งแต่วันนี้ ไปจนครบจำนวนวันที่ตั้งเป้าไว้
    for (let i = 0; i < days; i++) {
        let eventDate = new Date(today);
        eventDate.setDate(today.getDate() + i);
        
        const dateKey = getDateKey(eventDate);
        scheduleEvents[dateKey] = {
            subject: subject,
            hours: studyHours,
            timeSlot: getTimeSlot(studyHours, i),
            completed: false
        };
    }

    currentDate = new Date(today);
    renderCalendar();
    if (showAlert) alert(`สร้างแผน ${subject} จำนวน ${days} วันเรียบร้อย`);
    return true;
}

function generateSchedule() {
    buildSchedule(true);
}

function getDateKey(date) { return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; }
function isToday(date) { return getDateKey(date) === getDateKey(new Date()); }

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('currentMonthYear').innerText = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // สร้าง Header หัววัน
    const daysHeader = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    daysHeader.forEach(d => {
        grid.innerHTML += `<div class="day-header">${d}</div>`;
    });

    // หาวันแรกของเดือนและจำนวนวันทั้งหมดในเดือนนั้น
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // ช่องว่างก่อนวันแรกของเดือน
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="day-box empty"></div>`;
    }

    // สร้างช่องวันที่
    for (let day = 1; day <= totalDays; day++) {
        const dateKey = getDateKey(new Date(year, month, day));
        const event = scheduleEvents[dateKey];

        const hasEventClass = event ? 'has-event' : '';
        const todayClass = isToday(new Date(year, month, day)) ? 'today' : '';
        const badgeHtml = event ? `<span class="badge">${event.subject}</span><span class="more-badge">${event.timeSlot}</span>` : '';

        grid.innerHTML += `
            <div class="day-box ${hasEventClass} ${todayClass}" data-date="${dateKey}">
                <b class="date-number">${day}</b>
                ${badgeHtml}
            </div>
        `;
    }
    grid.querySelectorAll('.day-box.has-event').forEach(box => box.addEventListener('click', () => openDetail(box.dataset.date)));
    updateSummary();
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

function openDetail(dateKey) {
    const event = scheduleEvents[dateKey];
    if (!event) return;
    selectedDateKey = dateKey;
    const [year, month, day] = dateKey.split('-').map(Number);
    document.getElementById('modalDate').innerText = `วันที่ ${day} ${monthNames[month]} ${year}`;
    document.getElementById('modalTimeSlots').innerHTML = `
        <p>วิชา: <b>${event.subject}</b></p>
        <p>ช่วงเวลา: <b>${event.timeSlot}</b></p>
        <p>ระยะเวลา: <b>${event.hours} ชั่วโมง</b></p>
    `;
    document.getElementById('checkinBtn').innerText = event.completed ? 'ทำเสร็จแล้ว' : '✓ ทำเสร็จแล้ว (+50 แต้ม)';
    document.getElementById('detailModal').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('detailModal').style.display = 'none';
}

function addScore(points) {
    if (!selectedDateKey || scheduleEvents[selectedDateKey].completed) return closeDetail();
    scheduleEvents[selectedDateKey].completed = true;
    currentScore += points;
    localStorage.setItem('studyFlowScore', currentScore);
    document.getElementById('score').innerText = currentScore;
    alert(`เช็กอินเรียบร้อย! ได้รับ ${points} แต้ม`);
    closeDetail();
    renderCalendar();
}

function updateSummary() {
    const events = Object.values(scheduleEvents);
    const todayEvent = scheduleEvents[getDateKey(new Date())];
    document.getElementById('score').innerHTML = `${currentScore} <small>แต้ม</small>`;
    document.getElementById('focusHours').innerText = `${todayEvent ? todayEvent.hours : 0} ชม.`;
    document.getElementById('completedCount').innerText = `${events.filter(event => event.completed).length} งาน`;
    const upcoming = events.filter((event, index) => !event.completed).slice(0, 3);
    document.getElementById('upNextCount').innerText = events.length;
    document.getElementById('upNextList').innerHTML = upcoming.length ? upcoming.map(event => {
        const key = Object.keys(scheduleEvents).find(item => scheduleEvents[item] === event);
        const [, month, day] = key.split('-').map(Number);
        return `<div class="next-item"><div class="next-date">${day}<small>${monthNames[month].slice(0, 3)}</small></div><div><strong>${event.subject}</strong><span>${event.timeSlot} · ${event.hours} ชม.</span></div></div>`;
    }).join('') : '<p class="empty-state">ยังไม่มีตารางที่กำลังจะถึง</p>';
}

document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
document.getElementById('todayBtn').addEventListener('click', () => { currentDate = new Date(); renderCalendar(); });
document.getElementById('generateBtn').addEventListener('click', generateSchedule);
document.getElementById('closeModal').addEventListener('click', closeDetail);
document.getElementById('checkinBtn').addEventListener('click', () => addScore(50));
document.getElementById('detailModal').addEventListener('click', event => { if (event.target.id === 'detailModal') closeDetail(); });
document.getElementById('todayLabel').innerText = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
buildSchedule(false);
renderCalendar();