import { ResponseDto } from '../dto';
import { User } from "@prisma/client";

export interface GetUsersRequestDto {
  page: string;
  take: string;
}

type Pagination = { hasMore: boolean };

export type UserResponseT = Omit<User, "passwordHash">;

export interface GetUsersResponseT {
  users: Omit<User, "passwordHash">[];
  pagination: Pagination;
}

export type GetUsersResponseDto = ResponseDto<GetUsersResponseT>
