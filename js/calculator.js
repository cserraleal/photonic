// calculator.js

/**
 * @function calculateAverageMonthlyConsumption
 * @description
 * Calculates the average monthly consumption in kWh based on four input months.
 *
 * @param {number} month1 - kWh for month 1.
 * @param {number} month2 - kWh for month 2.
 * @param {number} month3 - kWh for month 3.
 * @param {number} month4 - kWh for month 4.
 *
 * @returns {number} Average monthly consumption in kWh.
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
function calculateAverageMonthlyConsumption(month1, month2, month3, month4) {
  return (month1 + month2 + month3 + month4) / 4;
}

/**
 * @function calculateRequiredSystemSizeKw
 * @description
 * Calculates the required system size in kW (unrounded) based on average monthly consumption
 * and annual irradiance.
 *
 * @param {number} averageMonthlyConsumption - Average monthly consumption in kWh.
 * @param {number} annualIrradiance - Annual irradiance in kWh/m²/day.
 *
 * @returns {number} Required system size in kW.
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
function calculateRequiredSystemSizeKw(averageMonthlyConsumption, annualIrradiance) {
  return (averageMonthlyConsumption * 12) / (annualIrradiance * 365 * SYSTEM_EFFICIENCY);
}

/**
 * @function calculateNumberOfPanels
 * @description
 * Calculates the number of panels needed (rounded up) based on the required system size.
 *
 * @param {number} requiredSystemSizeKw - Required system size in kW.
 *
 * @returns {number} Number of solar panels needed.
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
function calculateNumberOfPanels(requiredSystemSizeKw) {
  return Math.ceil(requiredSystemSizeKw / PANEL_POWER_KW);
}

/**
 * @function calculateInstalledPowerKw
 * @description
 * Calculates the total installed power in kW.
 *
 * @param {number} numberOfPanels - Number of panels.
 *
 * @returns {number} Installed power in kW.
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
function calculateInstalledPowerKw(numberOfPanels) {
  return numberOfPanels * PANEL_POWER_KW;
}

/**
 * @function calculateRequiredAreaM2
 * @description
 * Calculates the required roof area in square meters for the given number of panels.
 *
 * @param {number} numberOfPanels - Number of panels.
 *
 * @returns {number} Required area in square meters.
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
function calculateRequiredAreaM2(numberOfPanels) {
  return parseFloat((numberOfPanels * PANEL_AREA_M2).toFixed(2));
}

/**
 * @function calculateAnnualGenerationKwh
 * @description
 * Calculates the annual energy generation in kWh.
 *
 * @param {number} numberOfPanels - Number of panels.
 * @param {number} annualIrradiance - Annual irradiance in kWh/m²/day.
 *
 * @returns {number} Annual energy generation in kWh.
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
function calculateAnnualGenerationKwh(numberOfPanels, annualIrradiance) {
  return numberOfPanels * PANEL_POWER_KW * annualIrradiance * SYSTEM_EFFICIENCY * 365;
}

/**
 * @function calculateCoveragePercentage
 * @description
 * Calculates the monthly coverage percentage (capped at 100% in balanced mode).
 *
 * @param {number} annualGenerationKwh - Annual solar generation in kWh.
 * @param {number} averageMonthlyConsumption - Average monthly consumption in kWh.
 * @param {string} sizingPreference - Sizing preference ("minimum", "balanced", "maximum").
 *
 * @returns {number} Coverage percentage.
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
function calculateCoveragePercentage(annualGenerationKwh, averageMonthlyConsumption, sizingPreference) {
  const coverage = (annualGenerationKwh / (averageMonthlyConsumption * 12)) * 100;
  if (sizingPreference === "balanced") {
    return Math.min(coverage, 100);
  }
  return coverage;
}

/**
 * @function calculateAnnualCO2Saved
 * @description
 * Calculates the annual CO₂ savings in kilograms.
 *
 * @param {number} annualGenerationKwh - Annual solar generation in kWh.
 *
 * @returns {number} Annual CO₂ savings in kg.
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
function calculateAnnualCO2Saved(annualGenerationKwh) {
  return Math.ceil(annualGenerationKwh * CO2_SAVED_PER_KWH);
}

/**
 * @function calculateTreeEquivalents
 * @description
 * Calculates the equivalent number of trees based on annual generation.
 *
 * @param {number} annualGenerationKwh - Annual solar generation in kWh.
 *
 * @returns {number} Equivalent number of trees.
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
function calculateTreeEquivalents(annualGenerationKwh) {
  return Math.ceil((annualGenerationKwh * TREE_FACTOR) / 10);
}

/**
 * @function calculateInvestmentCost
 * @description
 * Calculates the investment cost based on system size.
 *
 * @param {number} systemSizeKw - System size in kW.
 *
 * @returns {number} Investment cost in Q.
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
function calculateInvestmentCost(systemSizeKw) {
  return systemSizeKw * COST_PER_KW;
}
