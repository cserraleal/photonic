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
