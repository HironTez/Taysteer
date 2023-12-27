export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<
        Record<Exclude<Keys, K>, `Please provide only one of these keys`>
      >;
  }[Keys];
