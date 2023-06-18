import { request } from "../../request";
import { GetUserResponseDto } from "./user.dto";

export const getUser = (userId: string) => {
  const URL = `/api/users/${userId}`;

  return request<GetUserResponseDto>(URL);
};
