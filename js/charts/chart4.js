// chart4.js

// Variable to hold the Chart.js instance so we can destroy it before redrawing
let chart4Instance = null;

/**
 * Draws Chart 4: Annual Cost Comparison with and without Solar (stacked bar)
 * @param {number} annualCostWithoutSolar - Annual cost without solar panels (GTQ)
 * @param {number} annualCostWithSolar - Annual cost with solar panels (GTQ)
 * @param {number} annualSavings - Annual savings achieved by solar panels (GTQ)
 */
async function drawChart4(annualCostWithoutSolar, annualCostWithSolar, annualSavings) {
  const ctx = document.getElementById("chart3").getContext("2d");

  if (chart4Instance) {
    chart4Instance.destroy();
  }

  const labels = ['Without Solar', 'With Solar'];

  chart4Instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Without Solar',
          data: [annualCostWithoutSolar, null], // First bar only
          backgroundColor: '#B0B0B0',
          stack: 'Stack 0'
        },
        {
          label: 'With Solar - Cost',
          data: [null, annualCostWithSolar], // Second bar only
          backgroundColor: '#B0B0B0',
          stack: 'Stack 1'
        },
        {
          label: 'With Solar - Savings',
          data: [null, annualSavings], // Second bar only (stacked)
          backgroundColor: '#A8E6A3',
          stack: 'Stack 1'
        }
      ]
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
          stacked: true,
          title: {
            display: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cost (GTQ)'
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
 * Global function exposed to chart-switcher
 */
window.renderChart3 = async function () {
  if (!latestResults) return;

  const annualConsumptionKwh = latestResults.averageMonthlyConsumption * 12;
  const annualGenerationKwh = latestResults.annualGeneration;
  const distributor = latestResults.distributor;
  const rateType = latestResults.rateType;
  const department = latestResults.department;

  try {
    const response = await fetch("data/irradiance_monthly.json");
    const data = await response.json();
    const monthlyIrradiance = data[department];

    if (!monthlyIrradiance || monthlyIrradiance.length !== 12) {
      console.warn("Missing or invalid monthly irradiance data for:", department);
      return;
    }

    const {
      annualCostWithoutSolar,
      annualCostWithSolar,
      annualSavings
    } = generateAnnualCostComparisonData(
      annualConsumptionKwh,
      distributor,
      rateType,
      department,
      annualGenerationKwh,
      latestResults.numberOfPanels,
      PANEL_POWER_KW,
      SYSTEM_EFFICIENCY,
      monthlyIrradiance
    );

    await drawChart4(annualCostWithoutSolar, annualCostWithSolar, annualSavings);

  } catch (error) {
    console.error("Error loading monthly irradiance:", error);
  }
};

