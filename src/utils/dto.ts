import { ZodError } from "zod";

type FormDataLikeInput = {
  [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
  entries(): IterableIterator<[string, FormDataEntryValue]>;
};

export type ActionResponseSuccess<T> = {
  success: true;
  data: T;
};

export const actionResponse = <T extends unknown = undefined>(
  data?: T,
): ActionResponseSuccess<T> => ({
  success: true as true,
  data: data as T,
});

export type ActionResponseError<T extends object> = {
  success: false;
  errors: ActionError<T>;
};

export type ActionError<T extends object = { global: void }> = Partial<
  Record<keyof T | "global", string>
>;

export const actionError = <T extends object>(
  message: string,
  field?: keyof T,
): ActionResponseError<ActionError<T>> => ({
  success: false,
  errors: { [field ?? "global"]: message } as ActionError<T>,
});

export const zodError = <T extends object>(
  error: ZodError<FormData | FormDataLikeInput>,
): ActionResponseError<T> => ({
  success: false as false,
  errors: error.errors.reduce((previousValue, currentValue) => {
    const path = currentValue.path.at(0);
    if (path) {
      return {
        ...previousValue,
        ...{ [path]: currentValue.message },
      };
    }
    return previousValue;
  }, {} as ActionError<T>),
});
