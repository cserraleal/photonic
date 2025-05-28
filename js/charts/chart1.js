// chart1.js

let chart1Instance = null;

/**
 * Core logic that renders the chart.
 */
async function drawChart1(numberOfPanels, panelPower, efficiency, averageMonthlyConsumption, department) {
  const ctx = document.getElementById("chart1").getContext("2d");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  const generationData = generateMonthlyGeneration(numberOfPanels, panelPower, efficiency, monthlyIrradiance);
  const annualConsumption = averageMonthlyConsumption * 12;
  const consumptionData = generateRealisticMonthlyData(annualConsumption, 0.05);

  if (chart1Instance) {
    chart1Instance.destroy();
  }

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

/**
 * Global function exposed to chart-switcher.
 */
window.renderChart1 = async function () {
  await drawChart1(
    latestResults.numberOfPanels,
    PANEL_POWER_KW,
    SYSTEM_EFFICIENCY,
    latestResults.averageMonthlyConsumption,
    latestResults.department
  );
};
