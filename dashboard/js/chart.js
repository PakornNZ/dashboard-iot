window.onload = function () {
  const canvas = document.getElementById("myChart");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas not found!");
    return;
  }

  const createGradient = (ctx, color) => {
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color.replace("1)", "0.5)"));
    gradient.addColorStop(1, color.replace("1)", "0)"));
    return gradient;
  };

  const temGradient = createGradient(ctx, "rgba(255, 99, 132, 1)");
  const humGradient = createGradient(ctx, "rgba(54, 162, 235, 1)");
  const lightGradient = createGradient(ctx, "rgba(255, 206, 86, 1)");
  const waterGradient = createGradient(ctx, "rgba(75, 192, 192, 1)");
  const phGradient = createGradient(ctx, "rgba(153, 102, 255, 1)");

  let labels = [];
  let temperatureData = [];
  let humidityData = [];
  let lightData = [];
  let waterData = [];
  let phData = [];

  const avgChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatureData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: temGradient,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: "y-temperature",
        },
        {
          label: "Humidity (%)",
          data: humidityData,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: humGradient,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: "y-humidity",
        },
        {
          label: "Light Intensity (Lux)",
          data: lightData,
          borderColor: "rgba(255, 206, 86, 1)",
          backgroundColor: lightGradient,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: "y-light",
        },
        {
          label: "Water Flow (L/min)",
          data: waterData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: waterGradient,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: "y-water",
        },
        {
          label: "pH Level",
          data: phData,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: phGradient,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: "y-ph",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true,
          },
          onClick: (e, legendItem, legend) => {
            const index = legendItem.datasetIndex;
            const chart = legend.chart;

            const meta = chart.getDatasetMeta(index);
            const isCurrentlyHidden = meta.hidden === false;

            meta.hidden = isCurrentlyHidden;

            chart.options.scales[chart.data.datasets[index].yAxisID].display =
              !isCurrentlyHidden;

            chart.update();
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Time (Hours)", color: "black" },
          ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
        },
        "y-temperature": {
          type: "linear",
          position: "left",
          title: { display: true, text: "Temperature (°C)", color: "rgba(255, 99, 132, 1)" },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 60,
        },
        "y-humidity": {
          type: "linear",
          position: "left",
          title: { display: true, text: "Humidity (%)", color: "rgba(54, 162, 235, 1)" },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 100,
        },
        "y-light": {
          type: "linear",
          position: "left",
          title: { display: true, text: "Light Intensity (Lux)", color: "rgba(255, 206, 86, 1)" },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 4096,
        },
        "y-water": {
          type: "linear",
          position: "left",
          title: { display: true, text: "Water Flow (L/min)", color: "rgba(75, 192, 192, 1)" },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 30,
        },
        "y-ph": {
          type: "linear",
          position: "left",
          title: { display: true, text: "pH Level", color: "rgba(153, 102, 255, 1)" },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 14,
        },
      },
    },
  });

  async function fetchDataAVG() {
    try {
      const res = await fetch(`${API_BASE_URL}fetchAVG.php`);
      const data = await res.json();

      const labels = data.map((row) => `${new Date(row.hour).getHours()}:00`);
      const temperatureData = data.map((row) => row.avg_temp ?? 0);
      const humidityData = data.map((row) => row.avg_hum ?? 0);
      const lightData = data.map((row) => row.avg_light ?? 0);
      const waterData = data.map((row) => row.avg_water ?? 0);
      const phData = data.map((row) => row.avg_ph ?? 0);

      avgChart.data.labels = labels;
      avgChart.data.datasets[0].data = temperatureData;
      avgChart.data.datasets[1].data = humidityData;
      avgChart.data.datasets[2].data = lightData;
      avgChart.data.datasets[3].data = waterData;
      avgChart.data.datasets[4].data = phData;
      avgChart.update();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchDataAVG();
  setInterval(fetchDataAVG, 3600000);
};