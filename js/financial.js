// financial.js

/**
 * @function calculateIRR
 * @description
 * Calculates the Internal Rate of Return (IRR) for a given set of cash flows using
 * the Newton-Raphson iterative method.
 *
 * @param {number[]} cashFlows - An array of cash flows (initial investment should be negative).
 * @param {number} [guess=0.1] - Optional starting guess for IRR (default is 10%).
 *
 * @returns {number|null} The IRR as a decimal (e.g., 0.12 for 12%) or null if not found.
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
 * const irr = calculateIRR([-5000, 1000, 1200, 1500]);
 * console.log(irr); // e.g., 0.1234
 */
function calculateIRR(cashFlows, guess = 0.1) {
  const maxIterations = 1000;
  const tolerance = 1e-6;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      derivative -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
    }

    const newRate = rate - npv / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }

    rate = newRate;
  }

  console.warn("IRR did not converge");
  return null;
}

/**
 * @function generateCumulativeCashflow
 * @description
 * Generates cumulative cashflow over the system lifetime for financial analysis.
 * Year 0 represents the initial investment (negative cashflow). Each subsequent year
 * adds the annual savings from solar generation.
 *
 * @param {number} investmentCost - The initial investment cost (Q).
 * @param {number} annualSavings - Annual savings in electricity bills (Q).
 * @param {number} [years=SYSTEM_LIFETIME_YEARS] - The system lifetime in years.
 *
 * @returns {Array<{year: number, value: number}>} Array of objects containing year and cumulative cashflow value.
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
 * const cashflow = generateCumulativeCashflow(5000, 1000, 25);
 * console.log(cashflow);
 */
function generateCumulativeCashflow(investmentCost, annualSavings, years = SYSTEM_LIFETIME_YEARS) {
  const cashflow = [];
  let cumulative = -investmentCost;

  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      cashflow.push({ year, value: cumulative });
    } else {
      cumulative += annualSavings;
      cashflow.push({ year, value: cumulative });
    }
  }

  return cashflow;
}
