/**
 * isDefined
 *
 * if it's anything other than `undefined` we're good
 *
 * @param {Any} val
 * @returns {Boolean}
 */
export function isDefined(val) {
  return val !== void 0; // eslint-disable-line no-void
}
