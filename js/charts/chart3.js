// chart3.js

// Variable to hold the Chart.js instance for Chart 3
let chart3Instance = null;

/**
 * @function drawChart3
 * @description
 * Draws Chart 3: Annual Solar Generation vs. Annual User Consumption with realistic variations.
 * Uses realistic annual generation and consumption data from latestResults for consistency.
 * Displays the data as a line chart over the system lifetime.
 *
 * @param {number} annualGeneration - Annual solar generation in kWh.
 * @param {number} annualConsumption - Annual user consumption in kWh.
 * @param {number} systemLifetimeYears - The system lifetime in years.
 *
 * @author
 * Cristobal Serra
 *
 * @company
 * Siempre Energy
 *
 * @version
 * 1.0.0
 *
 * @example
 * await drawChart3(5000, 4500, 25);
 */
async function drawChart3(annualGeneration, annualConsumption, systemLifetimeYears) {
  const ctx = document.getElementById("chart3").getContext("2d");

  // STEP 1: Destroy previous chart instance if exists
  if (chart3Instance) {
    chart3Instance.destroy();
  }

  // STEP 2: Create labels for the x-axis
  const years = Array.from({ length: systemLifetimeYears }, (_, i) => i + 1);

  // STEP 3: Generate realistic annual data with ±5% variation
  const generationData = generateRealisticAnnualData(annualGeneration, systemLifetimeYears, 0.05);
  const consumptionData = generateRealisticAnnualData(annualConsumption, systemLifetimeYears, 0.05);

  // STEP 4: Create the line chart
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
 * @function window.renderChart3
 * @description
 * Global function exposed to chart-switcher. Calls drawChart3() to render Chart 3 when selected.
 * Pulls data from latestResults for consistency with numeric results.
 *
 * @author
 * Cristobal Serra
 *
 * @company
 * Siempre Energy
 *
 * @version
 * 1.0.0
 */
window.renderChart3 = async function () {
  if (!latestResults) return;

  // Use realistic values from latestResults
  const annualGeneration = latestResults.realisticAnnualGeneration;
  const annualConsumption = latestResults.realisticAnnualConsumption;
  const systemLifetimeYears = SYSTEM_LIFETIME_YEARS;

  await drawChart3(annualGeneration, annualConsumption, systemLifetimeYears);
};
