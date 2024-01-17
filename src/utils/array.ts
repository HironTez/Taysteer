const isFunction = <F extends Function>(value: unknown | F): value is F =>
  typeof value === "function";

// type NumericRange<
//   END extends number,
//   START_ARR extends number[] = [],
//   ACC extends number = never,
// > = START_ARR["length"] extends END
//   ? ACC
//   : NumericRange<END, [...START_ARR, 1], ACC | START_ARR["length"]>;

/**
 * Create an array using your custom constructor
 * @example
 * arrayConstructor(4, i => i * 2);
 * // > [0, 2, 4, 6]
 * @param length the length of the array
 * @param constructor constructor function or element to insert 'length' times
 * @returns new array
 */

export const arrayConstructor = <
  TLength extends number,
  const T,
>(
  length: TLength,
  constructor: ((index: number) => T) | T,
) => {
  return Array.from({ length }, (_v, k) =>
    isFunction(constructor) ? constructor(k) : constructor,
  );
};
