import { User } from "@prisma/client";

type Pagination = { hasMore: boolean };

interface GetUsers {
  users: User[]
  pagination: Pagination
}

export type GetUsersDTO = GetUsers | null
