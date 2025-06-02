// chart2.js

let chart2Instance = null;

/**
 * Renders Chart 2: Cumulative Cashflow from solar investment using realistic data.
 */
async function renderChart2() {
  // STEP 1: Validate that latestResults exists
  if (!latestResults) return;

  const ctx = document.getElementById("chart2").getContext("2d");

  // STEP 2: Destroy previous instance if exists
  if (chart2Instance) {
    chart2Instance.destroy();
  }

  // STEP 3: Extract input values
  const { investmentCost, annualElectricityCost } = latestResults;

  // STEP 4: Generate cumulative cashflow data
  const cashflowData = generateCumulativeCashflow(investmentCost, annualElectricityCost);

  const labels = cashflowData.map(item => `${item.year}`);
  const values = cashflowData.map(item => parseFloat(item.value.toFixed(2)));

  // STEP 5: Create the chart
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
 * Global function exposed to chart-switcher.
 */
window.renderChart2 = renderChart2;
