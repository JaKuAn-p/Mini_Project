let currentScore = 0;

function openDetail(dateText, detailText) {
    document.getElementById('modalDate').innerText = '📅 ' + dateText;
    document.getElementById('modalTimeSlots').innerHTML = '⏱️ ' + detailText;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('detailModal').style.display = 'none';
}

function addScore(points) {
    currentScore += points;
    document.getElementById('score').innerText = currentScore;
    alert(`เช็กอินสำเร็จ! ได้รับ ${points} แต้ม`);
    closeDetail();
}