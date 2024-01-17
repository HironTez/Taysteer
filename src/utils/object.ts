// TODO: JSDOC

// Exclude fields from an object
export const exclude = <T extends object, Key extends keyof T>(
  obj: T,
  keys: Key[],
): Omit<T, Key> => {
  for (let key of keys) {
    delete obj[key];
  }
  return obj;
};

export const typeSafeObjectFromEntries = <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>,
>(
  entries: T,
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};

// type Object = Record<string, unknown>;

// type RequiredProperty<T extends Object> = {
//   [P in keyof T]-?: Required<NonNullable<T[P]>>;
// };

// type Keys_NullUndefinedExcluded<T extends Object> = {
//   [K in keyof T]-?: T[K] extends null | undefined ? never : K;
// }[keyof T];

// type OmitNullUndefined<T extends Object> = Required<
//   Pick<T, Keys_NullUndefinedExcluded<T>>
// >;

// type NonNullableObject<T extends Object> = OmitNullUndefined<
//   RequiredProperty<T>
// >;

// // Exclude all the undefined fields from an object
// export const removeNullUndefined = <T extends Object>(
//   obj: T,
// ): NonNullableObject<T> => {
//   Object.keys(obj).forEach((key) => {
//     if (obj[key] === undefined || obj[key] === null) {
//       delete obj[key];
//     }
//   });
//   return obj as unknown as NonNullableObject<T>;
// };
