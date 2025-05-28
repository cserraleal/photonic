// bill-calculator.js

/**
 * Calculates a monthly electricity bill.
 * 
 * @param {number} consumptionKwh - Monthly kWh consumption
 * @param {string} distributor - e.g., "EGGSA"
 * @param {string} rateType - e.g., "BT"
 * @param {string} department - e.g., "Guatemala"
 * @returns {number} monthly bill in Q
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
  const withTax = withMunicipality * (1 + TAX_RATE); // Now uses constant from constants.js

  return withTax;
}
