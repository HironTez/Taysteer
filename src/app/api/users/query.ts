import { request } from "../request";
import { GetUsersDTO } from "./users.dto";

const URL = "/api/users";

export const getUsers = (page: number, count = 10) =>
  request<GetUsersDTO>(URL, {
    page: page.toString(),
    take: count.toString(),
  });
