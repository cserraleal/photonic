// chart1.js

let chart1Instance = null;

/**
 * Core logic that renders Chart 1 using realistic data from latestResults.
 */
async function drawChart1() {
  const ctx = document.getElementById("chart1").getContext("2d");

  // STEP 1: Define month labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // STEP 2: Use realistic data from latestResults
  const generationData = latestResults.realisticMonthlyGeneration;
  const consumptionData = latestResults.realisticMonthlyConsumptions;

  if (!generationData || !consumptionData) {
    console.error("Missing realistic data for Chart 1.");
    return;
  }

  // STEP 3: Destroy previous instance if exists
  if (chart1Instance) {
    chart1Instance.destroy();
  }

  // STEP 4: Create the bar chart
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
 * Global function exposed to chart-switcher.
 */
window.renderChart1 = async function () {
  await drawChart1();
};
