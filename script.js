let currentScore = 0;

function generateSchedule() {
    const sleep = parseFloat(document.getElementById('sleepTime').value) || 0;
    const work = parseFloat(document.getElementById('workTime').value) || 0;
    const subject = document.getElementById('subject').value;
    const days = parseInt(document.getElementById('targetDays').value) || 1;

    // คำนวณเวลาว่าง (24 ชม. - เวลานอน - เวลาเรียน/ทำงาน - เวลาส่วนตัวคงที่ 2 ชม.)
    const freeTime = 24 - sleep - work - 2;

    const resultDiv = document.getElementById('scheduleResult');

    if (freeTime <= 0) {
        resultDiv.innerHTML = "<p style='color:red;'>เวลาไม่พอ! คุณไม่มีเวลาว่างเหลือสำหรับติว</p>";
        return;
    }

    // สมมุติต้องใช้เวลาเรียนวิชานั้นรวม 20 ชั่วโมง
    const totalStudyNeeded = 20; 
    const hoursPerDay = (totalStudyNeeded / days).toFixed(1);

    resultDiv.innerHTML = `
        <p>⏱️ เวลาว่างที่คุณเหลือ: <b>${freeTime} ชม./วัน</b></p>
        <p>🎯 เป้าหมาย: เรียน <b>${subject}</b> ให้จบใน ${days} วัน</p>
        <p>📅 ตารางที่แนะนำ: ต้องติววันละ <b>${hoursPerDay} ชม.</b></p>
        <hr>
        <p><b>ตัวอย่างตารางวันนี้:</b></p>
        <ul>
            <li>18:00 - 19:00 : ติววิชา ${subject}</li>
            <li>19:00 เป็นต้นไป : เวลาพักผ่อน</li>
        </ul>
    `;
}

function addScore(points) {
    currentScore += points;
    document.getElementById('score').innerText = currentScore;
    alert(`ยินดีด้วย! ได้รับ ${points} แต้ม (ส่งข้อมูลไปที่ Tamagotchi แล้ว)`);
}