import { GetUsersRequestDto, GetUsersResponseDto } from "./users.dto";

import { request } from "../request";

const URL = "/api/users";

export const getUsers = (page: number, count = 10) =>
  request<GetUsersResponseDto, GetUsersRequestDto>(URL, {
    page: page.toString(),
    take: count.toString(),
  });
