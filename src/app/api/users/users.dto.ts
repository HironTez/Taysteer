import { User } from "@prisma/client";

type Pagination = { hasMore: boolean };

interface GetUsers {
  users: Omit<User, 'passwordHash'>[]
  pagination: Pagination
}

export type GetUsersDTO = GetUsers | null
