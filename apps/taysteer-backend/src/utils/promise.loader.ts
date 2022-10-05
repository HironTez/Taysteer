/* eslint-disable @typescript-eslint/no-explicit-any */
const objectZip = (keys: any, values: any) =>
  keys.reduce(
    (others: any, key: any, index: any) => ({
      ...others,
      [key]: values[index],
    }),
    {}
  );

export const loadObject = async (obj: any) =>
  objectZip(Object.keys(obj), await Promise.all(Object.values(obj)));
