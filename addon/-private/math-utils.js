import toLocaleFixed from './to-locale-fixed';

/**
 * @method isLessThanBoundary
 * @param {Number} number
 * @param {Number} boundary
 * @return {Boolean}
 */
export function isLessThanBoundary(number, boundary) {
  if (number <= boundary) {
    return true;
  }
  return false;
}

/**
 * @method extractIntPart
 * @return {Decimal}
 */
export function extractIntPart(number, range, numberOfDigits) {
  // 1734 -> 1.734
  // 17345 -> 17.345
  // 999949 -> 999.9K with one significant digit or 999,9 mil in Spanish
  // this gives us the "int" (LHS) part of the number with the remains on the RHS
  return number / (range / Math.pow(10, numberOfDigits - 1));
}

/**
 * Meant to either localize a number with a Decimal or return an Integer
 * localization accepts 3 arguments
 *  - significantDigits
 *  - minimumFractionDigits
 *  - maximumFractionDigits
 *
 * @method normalizeNumber
 * @return {String|Integer}
 */
export function normalizeNumber(
  decimal,
  range,
  numberOfDigits,
  arbitraryPrecision,
  sign,
  locale,
  { significantDigits = 0, minimumFractionDigits = 0, maximumFractionDigits = 2 }) {
  if (significantDigits) {
    // String
    return toLocaleFixed(toFixed(decimal, significantDigits), locale, { minimumFractionDigits, maximumFractionDigits });
  }

  // Integer
  return withRounding(decimal, arbitraryPrecision) * sign;
}

function toFixed(decimal, significantDigits) {
  // solves issues with toFixed returning a string
  // e.g. 999.94 -> 999.9
  // e.g. 999.95 -> 1000 instead of (999.95).toFixed(1) -> '1000.1'
  return Math.round(decimal * Math.pow(10, significantDigits)) / Math.pow(10, significantDigits);
}

function withRounding(decimal, arbitraryPrecision) {
  // rounding on floating point numbers
  // e.g. 99.5 -> 100
  if (decimal > 1) {
    return Math.round(decimal / Math.pow(10, arbitraryPrecision)) * Math.pow(10, arbitraryPrecision);
  }

  // We do not want to round up to nearest 10 (Math.pow(10, 1)) when < 1.  Just round decimal
  return Math.round(decimal);
}

