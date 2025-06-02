// chart2.js

// Variable to hold the Chart.js instance for Chart 2
let chart2Instance = null;

/**
 * @function renderChart2
 * @description
 * Renders Chart 2, which displays the cumulative cashflow from solar investment over time.
 * Uses realistic annual savings and investment cost from latestResults.
 * Each year adds the annual electricity cost savings to the previous year’s cumulative cashflow.
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
 * await renderChart2();
 */
async function renderChart2() {
  // STEP 1: Validate that latestResults exists
  if (!latestResults) return;

  const ctx = document.getElementById("chart2").getContext("2d");

  // STEP 2: Destroy previous instance if it exists
  if (chart2Instance) {
    chart2Instance.destroy();
  }

  // STEP 3: Extract input values
  const { investmentCost, annualElectricityCost } = latestResults;

  // STEP 4: Generate cumulative cashflow data using helper function
  const cashflowData = generateCumulativeCashflow(investmentCost, annualElectricityCost);

  const labels = cashflowData.map(item => `${item.year}`);
  const values = cashflowData.map(item => parseFloat(item.value.toFixed(2)));

  // STEP 5: Create the bar chart using Chart.js
  chart2Instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cumulative Cashflow (Q)',
        data: values,
        backgroundColor: '#FFBF41'
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1000 },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Q ${context.raw}`;
            }
          }
        },
        legend: {
          labels: {
            color: "#0B284C",
            font: { weight: 'bold' }
          }
        }
      },
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
            text: 'Cumulative Cashflow (Q)'
          },
          ticks: {
            callback: function (value) {
              return `Q ${value}`;
            }
          }
        }
      }
    }
  });
}

/**
 * @function window.renderChart2
 * @description
 * Global function exposed to chart-switcher. Calls renderChart2() to render Chart 2 when selected.
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
window.renderChart2 = renderChart2;
