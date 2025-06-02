// plot-data-generator.js

/**
 * Generates 12 slightly varied monthly values that sum up to the total
 * @param {number} totalAnnualValue
 * @param {number} variation - e.g. 0.05 for ±5%
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

  // Normalize to ensure the sum matches original total
  const sum = monthlyValues.reduce((acc, val) => acc + val, 0);
  const scale = totalAnnualValue / sum;
  monthlyValues = monthlyValues.map(val => parseFloat((val * scale).toFixed(2)));

  return monthlyValues;
}

/**
 * Generates monthly generation values using real irradiance data per month.
 * @param {number} numberOfPanels
 * @param {number} panelPower - in kW
 * @param {number} efficiency - decimal (e.g. 0.789)
 * @param {number[]} monthlyIrradiance - 12 values in kWh/m²/day
 * @returns {number[]} - 12 monthly generation values in kWh
 */
function generateMonthlyGeneration(numberOfPanels, panelPower, efficiency, monthlyIrradiance) {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return monthlyIrradiance.map((irradiance, i) => {
    const generation = numberOfPanels * panelPower * irradiance * efficiency * daysPerMonth[i];
    return parseFloat(generation.toFixed(2));
  });
}

/**
 * Generates realistic annual data with small variation.
 * @param {number} baseValue - The base annual value (generation or consumption).
 * @param {number} years - Number of years to generate.
 * @param {number} variation - e.g. 0.05 for ±5%
 * @returns {number[]} - Array of annual values with realistic variation.
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
 * Generates data for the annual cost comparison chart using realistic monthly data.
 * @param {number[]} monthlyConsumptions - Realistic monthly consumption in kWh.
 * @param {string} distributor - e.g., "EGGSA".
 * @param {string} rateType - e.g., "BT".
 * @param {string} department - e.g., "Guatemala".
 * @param {number[]} monthlyGeneration - Realistic monthly generation in kWh.
 * @returns {object} - { annualCostWithoutSolar, annualCostWithSolar, annualSavings }
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

  // Calculate net consumption per month
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
