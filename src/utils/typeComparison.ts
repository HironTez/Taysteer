export const isFunction = <F extends Function>(
  value: unknown | F,
): value is F => typeof value === "function";
