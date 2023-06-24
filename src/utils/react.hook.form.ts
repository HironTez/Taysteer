// @ts-nocheck

import { UseFormSetError } from "react-hook-form";

export const errorHandler = <T, T2>(data: T, setError: UseFormSetError<T2>) => {
  if (!data.success)
    data.errors.forEach((error) => {
      error.path.forEach((path) => {
        setError(path, { message: error.message });
      });
    });
};
