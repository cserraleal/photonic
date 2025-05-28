// submit-data.js

let lastAnnualGeneration = 0;
let lastAvgMonthlyConsumption = 0;
let latestResults = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("solarForm");
  const numericResultsList = document.getElementById("numericResults");
  const resultsSection = document.getElementById("resultsSection");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // 1. Get form values
    const formData = Object.fromEntries(new FormData(form).entries());

    const month1 = parseFloat(formData.month1);
    const month2 = parseFloat(formData.month2);
    const month3 = parseFloat(formData.month3);
    const month4 = parseFloat(formData.month4);
    const department = formData.department;
    const sizingPreference = formData.sizingPreference;

    // 2. Load irradiance from JSON
    let irradianceValue = 0;
    try {
      const response = await fetch("data/irradiance.json");
      const irradianceData = await response.json();
      irradianceValue = irradianceData[department];
    } catch (error) {
      console.error("Failed to load irradiance data:", error);
      alert("Failed to load irradiance data. Please try again.");
      return;
    }

    // 3. Perform calculations
    const avgMonthlyConsumption = calculateAverageMonthlyConsumption(month1, month2, month3, month4);
    let requiredSystemSizeKw = calculateRequiredSystemSizeKw(avgMonthlyConsumption, irradianceValue);

    // Adjust system size based on preference
    if (sizingPreference === "minimum") {
      requiredSystemSizeKw *= 0.8;
    } else if (sizingPreference === "maximum") {
      requiredSystemSizeKw *= 1.2;
    } else {
      // Treat as 'balanced'
      requiredSystemSizeKw *= 1.0;
    }

    const numberOfPanels = calculateNumberOfPanels(requiredSystemSizeKw);
    const installedPowerKw = calculateInstalledPowerKw(numberOfPanels);
    const requiredArea = calculateRequiredAreaM2(numberOfPanels);
    const annualGeneration = calculateAnnualGenerationKwh(numberOfPanels, irradianceValue);
    const coverage = calculateCoveragePercentage(annualGeneration, avgMonthlyConsumption);
    console.log("Average Monthly Consumption:", avgMonthlyConsumption);
    console.log("Annual Consumption:", avgMonthlyConsumption * 12);
    console.log("Annual Generation:", annualGeneration);
    console.log("Coverage (%):", coverage);
    const co2Saved = calculateAnnualCO2Saved(annualGeneration);
    const treeEquivalents = calculateTreeEquivalents(annualGeneration);

    // 4. Store for charts
    lastAnnualGeneration = annualGeneration;
    lastAvgMonthlyConsumption = avgMonthlyConsumption;

    // 5. Store latestResults for later use
    latestResults = {
      installedPowerKw,
      numberOfPanels,
      requiredArea,
      annualGeneration,
      coverage,
      co2Saved,
      treeEquivalents,
      department,
      averageMonthlyConsumption: avgMonthlyConsumption
    };

    // 6. Show results section
    form.style.display = "none";
    resultsSection.style.display = "block";
    document.getElementById("tab-numeric").classList.add("active");
    document.getElementById("tab-charts").classList.remove("active");

    // 7. Create and render numeric results
    const displayResults = [
      { label: "Installed Power (kW)", value: installedPowerKw },
      { label: "Number of Panels", value: numberOfPanels },
      { label: "Required Area (m²)", value: requiredArea },
      { label: "Annual Generation (kWh)", value: annualGeneration.toFixed(2) },
      { label: "Coverage (%)", value: coverage.toFixed(2) },
      { label: "CO₂ Saved (kg/year)", value: co2Saved },
      { label: "Tree Equivalents", value: treeEquivalents }
    ];

    numericResultsList.innerHTML = "";
    displayResults.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.label}: ${item.value}`;
      numericResultsList.appendChild(li);
    });

    console.log("All results calculated and displayed.");
    console.log("Results object:", latestResults);
  });

  // Tab switching + delayed chart rendering
  document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", async () => {
      document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

      const tabId = button.dataset.tab;
      const tabContent = document.getElementById(`tab-${tabId}`);
      button.classList.add("active");
      tabContent.classList.add("active");

      if (tabId === "charts" && latestResults) {
        const activeChart = document.querySelector(".chart-tab-button.active")?.dataset.chart;
        if (activeChart === "chart1") {
          await renderChart1_Generation(
            latestResults.numberOfPanels,
            PANEL_POWER_KW,
            SYSTEM_EFFICIENCY,
            latestResults.averageMonthlyConsumption,
            latestResults.department
          );
        }
      }
    });
  });
});
