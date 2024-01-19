/**
 * Creates an object from key-value entries and preserves generic types
 * @param entries list of key-value entries
 * @returns an object created by key-value entries for properties and methods
 */

export const typeSafeObjectFromEntries = Object.fromEntries as <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>,
>(
  entries: T,
) => { [K in T[number] as K[0]]: K[1] };
