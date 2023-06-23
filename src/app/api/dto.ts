import { ReasonPhrases, StatusCodes } from "http-status-codes";

interface HttpErrorT<Status extends StatusCodes> {
  message: ReasonPhrases | string;
  status: Status;
}

export type ResponseDto<DataT> =
  | {
      ok: boolean;
      data: DataT;
      error: undefined;
    }
  | {
      ok: boolean;
      data: undefined;
      error: HttpErrorT<StatusCodes>;
    };
