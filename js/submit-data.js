// submit-data.js

/**
 * @file submit-data.js
 * @description
 * Handles the main solar calculator form submission, including data collection,
 * fetching irradiance data, performing all core calculations (generation, consumption,
 * costs, financial metrics), and rendering the numeric results.
 * Also manages tab switching and chart rendering.
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

// Variables to store key results
let lastAnnualGeneration = 0;
let lastAvgMonthlyConsumption = 0;
let latestResults = null;

document.addEventListener("DOMContentLoaded", async () => {
  // STEP 1: Load pricing data on startup
  /**
   * @function loadElectricityPricing
   * @description
   * Fetches the pricing data JSON file and stores it globally.
   */
  async function loadElectricityPricing() {
    try {
      const response = await fetch("data/pricing.json");
      window.electricityPricing = await response.json();
      console.log("Electricity pricing loaded:", window.electricityPricing);
    } catch (error) {
      console.error("Failed to load pricing data:", error);
      alert("Error loading electricity pricing configuration.");
    }
  }

  // Call the loader on page load
  await loadElectricityPricing();

  const form = document.getElementById("solarForm");
  const numericResultsList = document.getElementById("numericResults");
  const resultsSection = document.getElementById("resultsSection");

  // Handle form submission
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // STEP 2: Collect form values
    const formData = Object.fromEntries(new FormData(form).entries());
    const month1 = parseFloat(formData.month1);
    const month2 = parseFloat(formData.month2);
    const month3 = parseFloat(formData.month3);
    const month4 = parseFloat(formData.month4);
    const department = formData.department;
    const sizingPreference = formData.sizingPreference;
    const distributor = formData.distributor;
    const rateType = formData.rateType;

    // STEP 3: Load irradiance data (annual)
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

    // STEP 4: Load monthly irradiance data
    let monthlyIrradiance = [];
    try {
      const response = await fetch("data/irradiance_monthly.json");
      const irradianceData = await response.json();
      monthlyIrradiance = irradianceData[department];
      if (!monthlyIrradiance || monthlyIrradiance.length !== 12) {
        throw new Error("Missing or invalid monthly irradiance data for department: " + department);
      }
    } catch (error) {
      console.error("Failed to load monthly irradiance data:", error);
      alert("Failed to load monthly irradiance data. Please try again.");
      return;
    }

    // STEP 5: Calculate initial estimate of average monthly consumption
    const avgMonthlyConsumption = calculateAverageMonthlyConsumption(month1, month2, month3, month4);

    // STEP 6: Generate realistic monthly consumption data
    const realisticMonthlyConsumptions = generateRealisticMonthlyData(avgMonthlyConsumption * 12, 0.05);
    const realisticAnnualConsumption = realisticMonthlyConsumptions.reduce((sum, val) => sum + val, 0);
    const realisticAverageMonthlyConsumption = realisticAnnualConsumption / 12;

    // STEP 7: Calculate required system size using realistic average monthly consumption
    let requiredSystemSizeKw = calculateRequiredSystemSizeKw(realisticAverageMonthlyConsumption, irradianceValue);

    // STEP 8: Adjust system size based on sizing preference
    if (sizingPreference === "minimum") {
      requiredSystemSizeKw *= 0.8;
    } else if (sizingPreference === "maximum") {
      requiredSystemSizeKw *= 1.2;
    }

    // STEP 9: Calculate system components
    const numberOfPanels = calculateNumberOfPanels(requiredSystemSizeKw);
    const installedPowerKw = calculateInstalledPowerKw(numberOfPanels);
    const requiredArea = calculateRequiredAreaM2(numberOfPanels);

    // STEP 10: Calculate annual generation (initial estimate)
    const annualGeneration = calculateAnnualGenerationKwh(numberOfPanels, irradianceValue);

    // STEP 11: Calculate realistic monthly and annual generation
    const realisticMonthlyGeneration = generateMonthlyGeneration(
      numberOfPanels,
      PANEL_POWER_KW,
      SYSTEM_EFFICIENCY,
      monthlyIrradiance
    );
    const realisticAnnualGeneration = realisticMonthlyGeneration.reduce((sum, val) => sum + val, 0);

    // STEP 12: Calculate coverage
    const coverage = calculateCoveragePercentage(
      realisticAnnualGeneration,
      realisticAverageMonthlyConsumption,
      sizingPreference
    );

    // STEP 13: Calculate environmental impact
    const co2Saved = calculateAnnualCO2Saved(realisticAnnualGeneration);
    const treeEquivalents = calculateTreeEquivalents(realisticAnnualGeneration);

    // STEP 14: Calculate realistic monthly bills and annual cost
    const realisticMonthlyBills = realisticMonthlyConsumptions.map(kwh =>
      calculateMonthlyBill(kwh, distributor, rateType, department)
    );
    const annualElectricityCost = realisticMonthlyBills.reduce((sum, val) => sum + val, 0);

    // STEP 15: Calculate financial metrics
    const investmentCost = calculateInvestmentCost(installedPowerKw);
    const paybackYears = investmentCost / annualElectricityCost;
    const roiPercent =
      ((annualElectricityCost * SYSTEM_LIFETIME_YEARS - investmentCost) / investmentCost) * 100;

    // Calculate cash flow array for IRR
    const cashFlows = [-investmentCost];
    for (let year = 1; year <= SYSTEM_LIFETIME_YEARS; year++) {
      cashFlows.push(annualElectricityCost);
    }
    const irr = calculateIRR(cashFlows);

    // STEP 16: Store results
    lastAnnualGeneration = annualGeneration;
    lastAvgMonthlyConsumption = avgMonthlyConsumption;

    latestResults = {
      installedPowerKw,
      numberOfPanels,
      requiredArea,
      annualGeneration, // Keep for reference
      realisticMonthlyGeneration,
      realisticAnnualGeneration,
      coverage,
      co2Saved,
      treeEquivalents,
      department,
      averageMonthlyConsumption: avgMonthlyConsumption,
      realisticMonthlyConsumptions,
      realisticAnnualConsumption,
      realisticAverageMonthlyConsumption,
      annualElectricityCost,
      investmentCost,
      paybackYears,
      roiPercent,
      irr,
      distributor,
      rateType
    };

    // STEP 17: Show results section
    form.style.display = "none";
    resultsSection.style.display = "block";
    document.getElementById("tab-numeric").classList.add("active");
    document.getElementById("tab-charts").classList.remove("active");

    // STEP 18: Render numeric results
    const displayResults = [
      { label: "Installed Power (kW)", value: installedPowerKw },
      { label: "Number of Panels", value: numberOfPanels },
      { label: "Required Area (m²)", value: requiredArea },
      { label: "Annual Generation (kWh)", value: realisticAnnualGeneration.toFixed(2) },
      { label: "Coverage (%)", value: coverage.toFixed(2) },
      { label: "CO₂ Saved (kg/year)", value: co2Saved },
      { label: "Tree Equivalents", value: treeEquivalents },
      { label: "Annual Electricity Bill (Q)", value: annualElectricityCost.toFixed(2) },
      { label: "Investment Cost (Q)", value: investmentCost.toFixed(2) },
      { label: "Payback Period (years)", value: paybackYears.toFixed(1) },
      { label: "ROI (%)", value: roiPercent.toFixed(1) },
      { label: "IRR (TIR %)", value: (irr * 100).toFixed(1) }
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

  // STEP 19: Tab switching and chart rendering
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
        const renderFunction = window[`render${activeChart.charAt(0).toUpperCase() + activeChart.slice(1)}`];
        if (typeof renderFunction === "function") {
          await renderFunction();
        }
      }
    });
  });
});
