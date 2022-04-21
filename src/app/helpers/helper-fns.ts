/**
 * to make a for loop of items
 * @param start
 * @param end
 * @returns
 */
export function rangeFor(start: number, end: number) {
  let length = Math.abs(end - start) + 1;
  return Array.from(new Array(length), (x, i) => i + start);
}

/**
 * kelvin to farenheit converter
 * @param k
 * @returns
 */
export function kToF(k: number) {
  return Math.round(((k - 273.15) * 9) / 5 + 32);
}
