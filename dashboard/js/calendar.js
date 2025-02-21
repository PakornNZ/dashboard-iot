document.addEventListener("DOMContentLoaded", function () {
    const monthYear = document.getElementById("monthYear");
    const calendarDates = document.getElementById("calendarDates");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    let currentDate = new Date(); // ตัวแปรหลักที่เก็บเดือนปัจจุบัน

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // รีเซ็ตวันที่ให้เป็นวันที่ 1
        currentDate.setDate(1);

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // อัปเดตชื่อเดือน-ปี
        monthYear.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

        // ใช้ DocumentFragment เพื่อลดอาการกระพริบ
        const fragment = document.createDocumentFragment();

        // ช่องว่างก่อนวันที่ 1 (เติมให้ตรงกับวันในสัปดาห์)
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("empty");
            fragment.appendChild(emptyCell);
        }

        // วนลูปสร้างวันที่
        for (let day = 1; day <= lastDate; day++) {
            const dateCell = document.createElement("div");
            dateCell.textContent = day;
            dateCell.classList.add("date");

            // ไฮไลต์วันที่ปัจจุบัน
            if (
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
            ) {
                dateCell.classList.add("today");
            }

            fragment.appendChild(dateCell);
        }

        // แทนที่เนื้อหาใหม่โดยไม่รีโหลดหน้า
        calendarDates.innerHTML = "";
        calendarDates.appendChild(fragment);
    }

    // กดเปลี่ยนเดือน (โดยไม่รีโหลด)
    prevMonth.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar(); // เรียกครั้งแรก
});
