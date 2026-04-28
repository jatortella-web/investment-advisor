/**
 * Calculates the future value of an investment using compound interest.
 *
 * @param principal - The initial amount invested (in any currency unit).
 * @param annualRate - The annual interest rate as a decimal (e.g. 0.07 for 7 %).
 * @param years - The number of years the money is invested.
 * @param compoundingFrequency - How many times per year interest is compounded (default: 1 = annually).
 * @returns The future value of the investment.
 *
 * @example
 * // €10 000 at 7 % per year, compounded monthly for 10 years
 * calculateCompoundInterest(10000, 0.07, 10, 12); // ≈ 20 097.07
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = 1
): number {
  if (principal < 0 || years < 0 || compoundingFrequency <= 0) {
    throw new RangeError(
      "principal and years must be non-negative; compoundingFrequency must be positive"
    );
  }
  return principal * Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency * years);
}

/**
 * Estimates the number of years required to double an investment using the Rule of 72.
 *
 * The Rule of 72 is a quick mental-math shortcut: divide 72 by the annual percentage
 * return to approximate how long doubling takes. It works best for rates between 6 % and 10 %.
 *
 * @param annualRatePercent - The annual return rate expressed as a percentage (e.g. 8 for 8 %).
 * @returns The approximate number of years to double the investment.
 * @throws {RangeError} If annualRatePercent is zero or negative.
 *
 * @example
 * calculateRuleOf72(8);  // 9   (an 8 % return doubles money in ~9 years)
 * calculateRuleOf72(6);  // 12
 */
export function calculateRuleOf72(annualRatePercent: number): number {
  if (annualRatePercent <= 0) {
    throw new RangeError("annualRatePercent must be greater than zero");
  }
  return 72 / annualRatePercent;
}
