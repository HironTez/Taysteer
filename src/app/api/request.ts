"use client";

import { PromiseController } from "@/utils/promise";
import { ResponseDto } from "./dto";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-hot-toast";

export const request = async <
  ResponseType extends ResponseDto<unknown>,
  RequestType = unknown
>(
  url: string,
  data?: RequestType,
  method: "GET" | "POST" | "PUT" = "GET"
) => {
  const promiseController = new PromiseController<ResponseType>();
  fetch(
    `${url}${
      method === "GET" && data
        ? `?${new URLSearchParams(data as Record<string, string>).toString()}`
        : ""
    }`,
    {
      body:
        method === "POST" || method === "PUT"
          ? JSON.stringify(data)
          : undefined,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) =>
      response
        .json()
        .then((result: ResponseType) => {
          if (result.error?.status === StatusCodes.UNAUTHORIZED)
            window.location.href = "/login";
          return promiseController.resolve(result);
        })
        .catch((error) => {
          toast.error(error.message);
          promiseController.reject(error);
        })
    )
    .catch((error) => {
      toast.error(error.message);
      promiseController.reject(error);
    });

  return promiseController.promise;
};
