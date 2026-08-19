let currentScore = 0;
let currentDate = new Date();
let scheduleEvents = {}; // เก็บแผนการติวตามวันที่

const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

function generateSchedule() {
    const sleep = parseFloat(document.getElementById('sleepTime').value) || 0;
    const work = parseFloat(document.getElementById('workTime').value) || 0;
    const subject = document.getElementById('subject').value;
    const days = parseInt(document.getElementById('targetDays').value) || 1;

    const freeTime = 24 - sleep - work - 2;

    if (freeTime <= 0) {
        alert("เวลาไม่พอ! คุณไม่มีเวลาว่างเหลือสำหรับติว");
        return;
    }

    scheduleEvents = {}; // ล้างข้อมูลเก่า
    const today = new Date();

    // สร้างแผนการเรียนเริ่มตั้งแต่วันนี้ ไปจนครบจำนวนวันที่ตั้งเป้าไว้
    for (let i = 0; i < days; i++) {
        let eventDate = new Date(today);
        eventDate.setDate(today.getDate() + i);
        
        let dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
        scheduleEvents[dateKey] = {
            subject: subject,
            hours: (20 / days).toFixed(1), // สมมุติต้องเรียน 20 ชม.
            timeSlot: "18:00 - 19:30 น."
        };
    }

    alert(`คำนวณสำเร็จ! สร้างแผนติว ${subject} ลงปฏิทิน ${days} วันเรียบร้อย`);
    renderCalendar();
}

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
        let dateKey = `${year}-${month}-${day}`;
        let event = scheduleEvents[dateKey];

        let hasEventClass = event ? 'has-event' : '';
        let badgeHtml = event ? `<span class="badge">${event.subject}</span>` : '';
        let onClickAttr = event ? `onclick="openDetail('${day} ${monthNames[month]} ${year}', '${event.subject}', '${event.hours}', '${event.timeSlot}')"` : '';

        grid.innerHTML += `
            <div class="day-box ${hasEventClass}" ${onClickAttr}>
                <b>${day}</b>
                ${badgeHtml}
            </div>
        `;
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

function openDetail(dateText, subject, hours, timeSlot) {
    document.getElementById('modalDate').innerText = '📅 ' + dateText;
    document.getElementById('modalTimeSlots').innerHTML = `
        <p>🎯 วิชา: <b>${subject}</b></p>
        <p>⏱️ ช่วงเวลาติว: <b>${timeSlot}</b> (${hours} ชม.)</p>
    `;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('detailModal').style.display = 'none';
}

function addScore(points) {
    currentScore += points;
    document.getElementById('score').innerText = currentScore;
    alert(`เช็กอินเรียบร้อย! ได้รับ ${points} แต้ม`);
    closeDetail();
}

// แสดงปฏิทินเดือนปัจจุบันทันทีเมื่อเปิดหน้าเว็บ
renderCalendar();