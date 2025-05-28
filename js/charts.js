// charts.js

let chart1Instance = null; // previously generationChartInstance

async function renderChart1_Generation(numberOfPanels, panelPower, efficiency, averageMonthlyConsumption, department) {
  const ctx = document.getElementById("chart1").getContext("2d");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 1. Load irradiance
  let monthlyIrradiance = [];
  try {
    const response = await fetch("data/irradiance_monthly.json");
    const data = await response.json();
    monthlyIrradiance = data[department];

    if (!monthlyIrradiance || monthlyIrradiance.length !== 12) {
      throw new Error("Missing or invalid irradiance data for department: " + department);
    }
  } catch (err) {
    console.error("Failed to load monthly irradiance:", err);
    return;
  }

  // 2. Generate data
  const generationData = generateMonthlyGeneration(numberOfPanels, panelPower, efficiency, monthlyIrradiance);
  const annualConsumption = averageMonthlyConsumption * 12;
  const consumptionData = generateRealisticMonthlyData(annualConsumption, 0.05);

  // 3. Clear previous chart
  if (chart1Instance) {
    chart1Instance.destroy();
  }

  // 4. Render new chart
  chart1Instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: "Estimated Solar Generation (kWh)",
          data: generationData,
          backgroundColor: "#FFBF41"
        },
        {
          label: "User Avg. Consumption (kWh)",
          data: consumptionData,
          backgroundColor: "#0B284C"
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 1000 },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Energy (kWh)' }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "#0B284C",
            font: { weight: 'bold' }
          }
        }
      }
    }
  });
}
