import { PromiseController } from "@/utils/promise";

export const request = async <ResponseType>(
  url: string,
  queries?: { [key: string]: string }
) => {
  const promiseController = new PromiseController<ResponseType | null>();
  fetch(`${url}?${new URLSearchParams(queries).toString()}`)
    .then((response) =>
      response
        .json()
        .then((result) => promiseController.resolve(result as ResponseType))
        .catch(() => promiseController.resolve(null))
    )
    .catch((error) => promiseController.reject(error));

  return promiseController.promise;
};