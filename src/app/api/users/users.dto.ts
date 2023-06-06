import { User } from "@prisma/client";

type Pagination = { hasMore: boolean };

export type UserDto = Omit<User, 'passwordHash'>

interface GetUsers {
  users: Omit<User, 'passwordHash'>[]
  pagination: Pagination
}

export type GetUsersDto = GetUsers | null
