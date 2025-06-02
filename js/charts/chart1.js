// chart1.js

// Variable to hold the Chart.js instance for Chart 1
let chart1Instance = null;

/**
 * @function drawChart1
 * @description
 * Core logic that renders Chart 1, displaying monthly solar generation vs. user consumption.
 * Uses realistic data generated during form submission, stored in latestResults.
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
 * await drawChart1();
 */
async function drawChart1() {
  const ctx = document.getElementById("chart1").getContext("2d");

  // STEP 1: Define month labels for the x-axis
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // STEP 2: Retrieve realistic data from latestResults
  const generationData = latestResults.realisticMonthlyGeneration;
  const consumptionData = latestResults.realisticMonthlyConsumptions;

  // STEP 3: Validate that both data arrays exist
  if (!generationData || !consumptionData) {
    console.error("Missing realistic data for Chart 1.");
    return;
  }

  // STEP 4: Destroy previous chart instance if exists
  if (chart1Instance) {
    chart1Instance.destroy();
  }

  // STEP 5: Create the bar chart
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
          label: "User Consumption (kWh)",
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
 * @function renderChart1
 * @description
 * Global function exposed to chart-switcher. Calls drawChart1() to render Chart 1 when selected.
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
window.renderChart1 = async function () {
  await drawChart1();
};
