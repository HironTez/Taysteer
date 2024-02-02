export const isFunction = <F extends Function>(
  value: unknown | F,
): value is F => typeof value === "function";

const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> =>
  value !== undefined;
