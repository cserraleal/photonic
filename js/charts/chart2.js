// chart2.js

let chart2Instance = null;

/**
 * Renders a bar chart of cumulative cashflow from solar investment.
 */
async function renderChart2() {
  if (!latestResults) return;

  const ctx = document.getElementById("chart2").getContext("2d");

  // Clean up previous chart if needed
  if (chart2Instance) {
    chart2Instance.destroy();
  }

  // Get input values
  const { investmentCost, annualElectricityCost } = latestResults;

  // Generate cashflow data
  const data = generateCumulativeCashflow(investmentCost, annualElectricityCost);

  const labels = data.map(item => `Year ${item.year}`);
  const values = data.map(item => item.value.toFixed(2));

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
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Q ${context.raw}`;
            }
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

  // Make it callable from global scope
  window.renderChart2 = renderChart2;
}
