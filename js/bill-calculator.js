// bill-calculator.js

/**
 * @function calculateMonthlyBill
 * @description
 * Calculates a monthly electricity bill given the consumption in kWh,
 * distributor, rate type, and department. Applies fixed charges, variable
 * rates, municipality fees, and tax rates defined in constants.js.
 *
 * @param {number} consumptionKwh - Monthly consumption in kWh.
 * @param {string} distributor - The electricity distributor (e.g., "EGGSA").
 * @param {string} rateType - The rate type (e.g., "BT").
 * @param {string} department - The department/region (e.g., "Guatemala").
 *
 * @returns {number} The monthly bill amount in Q.
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
 * const bill = calculateMonthlyBill(400, 'EGGSA', 'BT', 'Guatemala');
 * console.log(bill); // prints calculated bill
 */
function calculateMonthlyBill(consumptionKwh, distributor, rateType, department) {
  if (
    !window.electricityPricing ||
    !window.electricityPricing[distributor] ||
    !window.electricityPricing[distributor][rateType] ||
    !window.electricityPricing[distributor][rateType][department]
  ) {
    console.warn("Missing pricing data:", distributor, rateType, department);
    return 0;
  }

  const { fixedCharge, pricePerKwh, municipalityFee } =
    window.electricityPricing[distributor][rateType][department];

  const subtotal = fixedCharge + (consumptionKwh * pricePerKwh);
  const withMunicipality = subtotal * (1 + municipalityFee);
  const withTax = withMunicipality * (1 + TAX_RATE); // Tax constant from constants.js

  return withTax;
}

