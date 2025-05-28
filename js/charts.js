// charts.js

let generationChartInstance = null;

/**
 * Renders a bar chart comparing estimated generation vs. consumption.
 * Uses monthly irradiance data per department for realistic generation values.
 * 
 * @param {number} numberOfPanels
 * @param {number} panelPower - in kW
 * @param {number} efficiency - decimal (e.g. 0.789)
 * @param {number} averageMonthlyConsumption - kWh
 * @param {string} department
 */
async function renderGenerationChart(numberOfPanels, panelPower, efficiency, averageMonthlyConsumption, department) {
  const ctx = document.getElementById("generationChart").getContext("2d");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 1. Load monthly irradiance data from file
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

  // 2. Calculate monthly generation based on actual values
  const generationData = generateMonthlyGeneration(numberOfPanels, panelPower, efficiency, monthlyIrradiance);

  // 3. Create consumption data (same every month for now)
  const annualConsumption = averageMonthlyConsumption * 12;
  const consumptionData = generateRealisticMonthlyData(annualConsumption, 0.05);

  // 4. Destroy previous chart instance if exists
  if (generationChartInstance) {
    generationChartInstance.destroy();
  }

  // 5. Create new chart
  generationChartInstance = new Chart(ctx, {
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
      animation: {
        duration: 1000
      },
      scales: {
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
            font: {
              weight: 'bold'
            }
          }
        }
      }
    }
  });
}
