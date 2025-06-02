// plot-data-generator.js

/**
 * @function generateRealisticMonthlyData
 * @description
 * Generates 12 slightly varied monthly values that sum up to the total annual value.
 * Adds realistic variation using a random factor to simulate real-world fluctuations.
 *
 * @param {number} totalAnnualValue - The total annual value to distribute.
 * @param {number} [variation=0.05] - The percentage variation (e.g. 0.05 for ±5%).
 *
 * @returns {number[]} An array of 12 monthly values.
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
function generateRealisticMonthlyData(totalAnnualValue, variation = 0.05) {
  const months = 12;
  const base = totalAnnualValue / months;
  let monthlyValues = [];

  // Generate values with small random variation
  for (let i = 0; i < months; i++) {
    const randFactor = 1 + (Math.random() * 2 - 1) * variation;
    monthlyValues.push(base * randFactor);
  }

  // Normalize to ensure the sum matches the original total
  const sum = monthlyValues.reduce((acc, val) => acc + val, 0);
  const scale = totalAnnualValue / sum;
  monthlyValues = monthlyValues.map(val => parseFloat((val * scale).toFixed(2)));

  return monthlyValues;
}

/**
 * @function generateMonthlyGeneration
 * @description
 * Generates monthly generation values using real irradiance data per month.
 *
 * @param {number} numberOfPanels - Number of installed panels.
 * @param {number} panelPower - Panel power in kW.
 * @param {number} efficiency - System efficiency as a decimal (e.g. 0.789).
 * @param {number[]} monthlyIrradiance - 12 values in kWh/m²/day.
 *
 * @returns {number[]} An array of 12 monthly generation values in kWh.
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
function generateMonthlyGeneration(numberOfPanels, panelPower, efficiency, monthlyIrradiance) {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return monthlyIrradiance.map((irradiance, i) => {
    const generation = numberOfPanels * panelPower * irradiance * efficiency * daysPerMonth[i];
    return parseFloat(generation.toFixed(2));
  });
}

/**
 * @function generateRealisticAnnualData
 * @description
 * Generates an array of annual data with small variations to simulate real-world changes over time.
 *
 * @param {number} baseValue - The base annual value (generation or consumption).
 * @param {number} years - The number of years to generate.
 * @param {number} [variation=0.05] - The percentage variation (e.g. 0.05 for ±5%).
 *
 * @returns {number[]} An array of annual values with realistic variation.
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
function generateRealisticAnnualData(baseValue, years, variation = 0.05) {
  let annualValues = [];

  for (let i = 0; i < years; i++) {
    const randFactor = 1 + (Math.random() * 2 - 1) * variation;
    annualValues.push(parseFloat((baseValue * randFactor).toFixed(2)));
  }

  return annualValues;
}

/**
 * @function generateAnnualCostComparisonData
 * @description
 * Generates data for the annual cost comparison chart using realistic monthly data.
 * Calculates costs with and without solar by comparing net monthly consumption
 * and applying utility rates and fees.
 *
 * @param {number[]} monthlyConsumptions - Realistic monthly consumption in kWh.
 * @param {string} distributor - The electricity distributor (e.g., "EGGSA").
 * @param {string} rateType - The rate type (e.g., "BT").
 * @param {string} department - The department/region (e.g., "Guatemala").
 * @param {number[]} monthlyGeneration - Realistic monthly generation in kWh.
 *
 * @returns {object} An object containing:
 *  - {number} annualCostWithoutSolar: The total annual cost without solar panels (Q).
 *  - {number} annualCostWithSolar: The total annual cost with solar panels (Q).
 *  - {number} annualSavings: The total annual savings achieved by solar panels (Q).
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
function generateAnnualCostComparisonData(
  monthlyConsumptions,
  distributor,
  rateType,
  department,
  monthlyGeneration
) {
  console.log("Generating cost comparison data with realistic data:");

  if (
    !monthlyConsumptions ||
    !monthlyGeneration ||
    monthlyConsumptions.length !== 12 ||
    monthlyGeneration.length !== 12
  ) {
    console.warn("Missing or invalid inputs. Skipping calculation.");
    return {
      annualCostWithoutSolar: 0,
      annualCostWithSolar: 0,
      annualSavings: 0
    };
  }

  // Calculate monthly bills without solar
  const monthlyBillsWithoutSolar = monthlyConsumptions.map(monthlyKwh => {
    const bill = calculateMonthlyBill(monthlyKwh, distributor, rateType, department);
    return isNaN(bill) ? 0 : bill;
  });

  const annualCostWithoutSolar = monthlyBillsWithoutSolar.reduce((sum, val) => sum + val, 0);

  // Calculate net consumption per month (consumption - solar generation)
  const netMonthlyConsumptions = monthlyConsumptions.map((consumption, index) => {
    const net = consumption - monthlyGeneration[index];
    return Math.max(net, 0);
  });

  // Calculate monthly bills with solar
  const monthlyBillsWithSolar = netMonthlyConsumptions.map(monthlyKwh => {
    const bill = calculateMonthlyBill(monthlyKwh, distributor, rateType, department);
    return isNaN(bill) ? 0 : bill;
  });

  const annualCostWithSolar = monthlyBillsWithSolar.reduce((sum, val) => sum + val, 0);

  const annualSavings = annualCostWithoutSolar - annualCostWithSolar;

  console.log("Annual Cost Without Solar:", annualCostWithoutSolar);
  console.log("Annual Cost With Solar:", annualCostWithSolar);
  console.log("Annual Savings:", annualSavings);

  return {
    annualCostWithoutSolar: parseFloat(annualCostWithoutSolar.toFixed(2)),
    annualCostWithSolar: parseFloat(annualCostWithSolar.toFixed(2)),
    annualSavings: parseFloat(annualSavings.toFixed(2))
  };
}
