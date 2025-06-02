// chart4.js

// Variable to hold the Chart.js instance for Chart 4
let chart4Instance = null;

/**
 * @function drawChart4
 * @description
 * Draws Chart 4: Annual Cost Comparison with and without Solar (stacked bar chart).
 * Visualizes the annual cost without solar vs. the annual cost with solar and savings.
 * Uses data from realistic calculations stored in latestResults.
 *
 * @param {number} annualCostWithoutSolar - Annual cost without solar panels (GTQ).
 * @param {number} annualCostWithSolar - Annual cost with solar panels (GTQ).
 * @param {number} annualSavings - Annual savings achieved by solar panels (GTQ).
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
 * await drawChart4(7500, 5000, 2500);
 */
async function drawChart4(annualCostWithoutSolar, annualCostWithSolar, annualSavings) {
  const ctx = document.getElementById("chart3").getContext("2d");

  // STEP 1: Destroy previous chart instance if exists
  if (chart4Instance) {
    chart4Instance.destroy();
  }

  // STEP 2: Define labels for the x-axis
  const labels = ['Without Solar', 'With Solar'];

  // STEP 3: Create the stacked bar chart
  chart4Instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Without Solar',
          data: [annualCostWithoutSolar, null],
          backgroundColor: '#B0B0B0',
          stack: 'Stack 0'
        },
        {
          label: 'With Solar - Cost',
          data: [null, annualCostWithSolar],
          backgroundColor: '#B0B0B0',
          stack: 'Stack 1'
        },
        {
          label: 'With Solar - Savings',
          data: [null, annualSavings],
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
          stacked: true
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
 * @function window.renderChart3
 * @description
 * Global function exposed to chart-switcher. Calls drawChart4() to render Chart 4 when selected.
 * Uses realistic data from latestResults to generate the annual cost comparison.
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

  const annualConsumptionKwh = latestResults.realisticAnnualConsumption;
  const annualGenerationKwh = latestResults.realisticAnnualGeneration;
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

    const { annualCostWithoutSolar, annualCostWithSolar, annualSavings } =
      generateAnnualCostComparisonData(
        latestResults.realisticMonthlyConsumptions,
        distributor,
        rateType,
        department,
        latestResults.realisticMonthlyGeneration
      );

    await drawChart4(annualCostWithoutSolar, annualCostWithSolar, annualSavings);

  } catch (error) {
    console.error("Error loading monthly irradiance:", error);
  }
};
