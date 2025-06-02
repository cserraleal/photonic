// chart3.js

let chart3Instance = null;

/**
 * Draws Chart 3: Annual Solar Generation vs. Annual User Consumption with realistic variations.
 * Uses realistic values from latestResults for consistency.
 */
async function drawChart3(annualGeneration, annualConsumption, systemLifetimeYears) {
  const ctx = document.getElementById("chart3").getContext("2d");

  // Destroy previous instance if exists
  if (chart3Instance) {
    chart3Instance.destroy();
  }

  // Create data arrays
  const years = Array.from({ length: systemLifetimeYears }, (_, i) => i + 1);

  // Generate realistic annual data with ±5% variation
  const generationData = generateRealisticAnnualData(annualGeneration, systemLifetimeYears, 0.05);
  const consumptionData = generateRealisticAnnualData(annualConsumption, systemLifetimeYears, 0.05);

  // Create the chart
  chart3Instance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: "Annual Solar Generation (kWh)",
          data: generationData,
          borderColor: "#FFBF41",
          backgroundColor: "rgba(255, 191, 65, 0.2)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Annual User Consumption (kWh)",
          data: consumptionData,
          borderColor: "#0B284C",
          backgroundColor: "rgba(11, 40, 76, 0.2)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 1000 },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Energy (kWh)'
          }
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
window.renderChart3 = async function () {
  if (!latestResults) return;

  // Use realistic values from latestResults
  const annualGeneration = latestResults.realisticAnnualGeneration;
  const annualConsumption = latestResults.realisticAnnualConsumption;
  const systemLifetimeYears = SYSTEM_LIFETIME_YEARS;

  await drawChart3(annualGeneration, annualConsumption, systemLifetimeYears);
};
