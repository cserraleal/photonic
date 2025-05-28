// financial.js

/**
 * Calculates the Internal Rate of Return (IRR) for a given set of cash flows.
 * @param {number[]} cashFlows - An array of cash flows (initial investment should be negative).
 * @param {number} guess - Optional starting guess for IRR.
 * @returns {number|null} - IRR as a decimal (e.g., 0.12 for 12%) or null if not found.
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
