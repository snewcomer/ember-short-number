/**
 * @method replaceNumber
 * @param {Number} number
 * @param {String} format
 * @return {String}
 */
export function replaceNumber(number, format) {
  // 1.734 -> 1K
  // replace 0's with absolute number while preserving space and remaining text
  // return format.replace(/0*(\s*)(\w+)/, Math.round(number) + '$1$2');
  return format.replace(/0*/, number);
}

/**
 * @method normalizeLocal
 * @param {String} locale
 * @return {String}
 */
export function normalizeLocal(locale) {
  let match = locale.match(/_|-/);
  if (match) {
    return locale.split(match[0])[0];
  }
  return locale;
}

/**
 * If rule only contains 0, it indicates no short number formatting applied
 * e.g. "ja" 1234 -> 1234 and not 1K
 *
 * @method needsFormatting
 * @param {String} format
 * @return {String}
 */
export function needsFormatting(format) {
  return format.match(/[^0]/);
}
