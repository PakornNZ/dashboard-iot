async function fetchWeather() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=16.4322&longitude=102.8236&current=temperature_2m&timezone=Asia/Bangkok");
        const data = await response.json();
        const temperature = data.current.temperature_2m;

        let tempEmoji;
        if (temperature < 15) {
            tempEmoji = "❄️ หนาวมาก";
        } else if (temperature >= 15 && temperature < 25) {
            tempEmoji = "🥶 หนาว";
        } else if (temperature >= 25 && temperature < 35) {
            tempEmoji = "😊 อากาศดี";
        } else if (temperature >= 35 && temperature < 40) {
            tempEmoji = "🥵 ร้อน";
        } else {
            tempEmoji = "🔥 ร้อนมาก";
        }

        document.getElementById("temperature").innerHTML = `${temperature}°C`;
        document.getElementById("tempEmoji").textContent = tempEmoji;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function updateTime() {
    const now = new Date();
    const weekday = now.toLocaleDateString('th-TH', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('th-TH', { month: 'long' });
    const year = now.getFullYear() + 543;
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    document.getElementById("weekday").textContent = weekday;
    document.getElementById("day").textContent = day;
    document.getElementById("month").textContent = month;
    document.getElementById("year").textContent = year;
    document.getElementById("time").textContent = `${hours}:${minutes}`;
    
}

fetchWeather();
setInterval(fetchWeather, 60000);
updateTime();
setInterval(updateTime, 1000);