import { GetUsersDto } from "./users.dto";
import { request } from "../request";

const URL = "/api/users";

export const getUsers = (page: number, count = 10) =>
  request<GetUsersDto>(URL, {
    page: page.toString(),
    take: count.toString(),
  });
