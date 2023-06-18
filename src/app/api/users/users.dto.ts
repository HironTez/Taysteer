import { ResponseDto } from "../dto";
import { UserResponseT } from "./[userId]/user.dto";

export interface GetUsersRequestDto {
  page: string;
  take: string;
}

type Pagination = { hasMore: boolean };

export interface GetUsersResponseT {
  users: UserResponseT[];
  pagination: Pagination;
}

export type GetUsersResponseDto = ResponseDto<GetUsersResponseT>;
