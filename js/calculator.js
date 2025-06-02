// calculator.js

/**
 * Calculate the average monthly consumption in kWh
 */
function calculateAverageMonthlyConsumption(month1, month2, month3, month4) {
  return (month1 + month2 + month3 + month4) / 4;
}

/**
 * Calculate the required system size in kW (rounded up)
 */
function calculateRequiredSystemSizeKw(averageMonthlyConsumption, annualIrradiance) {
  return (averageMonthlyConsumption * 12) / (annualIrradiance * 365 * SYSTEM_EFFICIENCY);
}

/**
 * Calculate the number of panels needed (rounded up)
 */
function calculateNumberOfPanels(requiredSystemSizeKw) {
  return Math.ceil(requiredSystemSizeKw / PANEL_POWER_KW);
}

/**
 * Calculate total installed power in kW
 */
function calculateInstalledPowerKw(numberOfPanels) {
  return numberOfPanels * PANEL_POWER_KW;
}

/**
 * Calculate required roof area in square meters
 */
function calculateRequiredAreaM2(numberOfPanels) {
  return parseFloat((numberOfPanels * PANEL_AREA_M2).toFixed(2));
}

/**
 * Calculate annual energy generation in kWh
 */
function calculateAnnualGenerationKwh(numberOfPanels, annualIrradiance) {
  return numberOfPanels * PANEL_POWER_KW * annualIrradiance * SYSTEM_EFFICIENCY * 365;
}

/**
 * Calculate monthly coverage percentage (capped at 100)
 */
function calculateCoveragePercentage(annualGenerationKwh, averageMonthlyConsumption, sizingPreference) {
  const coverage = (annualGenerationKwh / (averageMonthlyConsumption * 12)) * 100;
  if (sizingPreference === "balanced") {
    return Math.min(coverage, 100);
  }
  return coverage;
}

/**
 * Calculate annual CO₂ savings in kilograms
 */
function calculateAnnualCO2Saved(annualGenerationKwh) {
  return Math.ceil(annualGenerationKwh * CO2_SAVED_PER_KWH);
}

/**
 * Calculate equivalent number of trees
 */
function calculateTreeEquivalents(annualGenerationKwh) {
  return Math.ceil((annualGenerationKwh * TREE_FACTOR) / 10);
}

function calculateInvestmentCost(systemSizeKw) {
  return systemSizeKw * COST_PER_KW;
}