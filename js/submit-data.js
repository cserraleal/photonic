// submit-data.js

let lastAnnualGeneration = 0;
let lastAvgMonthlyConsumption = 0;
let latestResults = null;

document.addEventListener("DOMContentLoaded", async () => {

  //  STEP: Load pricing data on startup
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

  //  CALL THE LOADER HERE
  await loadElectricityPricing();

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
    const distributor = formData.distributor;
    const rateType = formData.rateType;

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

    // 1. Calculate number of panels and installed power
    const numberOfPanels = calculateNumberOfPanels(requiredSystemSizeKw);
    const installedPowerKw = calculateInstalledPowerKw(numberOfPanels);
    const requiredArea = calculateRequiredAreaM2(numberOfPanels);

    // 2. Calculate generation and environmental impact
    const annualGeneration = calculateAnnualGenerationKwh(numberOfPanels, irradianceValue);
    const coverage = calculateCoveragePercentage(annualGeneration, avgMonthlyConsumption);
    const co2Saved = calculateAnnualCO2Saved(annualGeneration);
    const treeEquivalents = calculateTreeEquivalents(annualGeneration);

    // 3. Generate realistic monthly consumption and calculate bill
    const monthlyConsumptions = generateRealisticMonthlyData(avgMonthlyConsumption * 12, 0.05);
    const monthlyBills = monthlyConsumptions.map(kwh =>
      calculateMonthlyBill(kwh, distributor, rateType, department)
    );
    const annualElectricityCost = monthlyBills.reduce((sum, val) => sum + val, 0);

    // 4a. Calculate investment and financial metrics
    const investmentCost = calculateInvestmentCost(installedPowerKw);
    const paybackYears = investmentCost / annualElectricityCost;
    const roiPercent = ((annualElectricityCost * SYSTEM_LIFETIME_YEARS - investmentCost) / investmentCost) * 100;
    
    // 4b. Construct cash flow array for IRR
    const cashFlows = [-investmentCost];
    for (let year = 1; year <= SYSTEM_LIFETIME_YEARS; year++) {
      cashFlows.push(annualElectricityCost);
    }

    // 4v. Calculate Internal Rate of Return (IRR)
    const irr = calculateIRR(cashFlows);

    // 5a. Store values for charts
    lastAnnualGeneration = annualGeneration;
    lastAvgMonthlyConsumption = avgMonthlyConsumption;

    // 5b. Store latestResults for later use
    latestResults = {
      installedPowerKw,
      numberOfPanels,
      requiredArea,
      annualGeneration,
      coverage,
      co2Saved,
      treeEquivalents,
      department,
      averageMonthlyConsumption: avgMonthlyConsumption,
      annualElectricityCost,
      investmentCost,
      paybackYears,
      roiPercent,
      irr,
      distributor,
      rateType
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

  // 8. Tab switching + delayed chart rendering
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
