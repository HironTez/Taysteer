import { User } from "@prisma/client";
import { GetDto } from "../dto";

type Pagination = { hasMore: boolean };

export type UserDto = Omit<User, "passwordHash">;

interface UsersDto {
  users: Omit<User, "passwordHash">[];
  pagination: Pagination;
}

export type GetUsersDto = GetDto<UsersDto>;
