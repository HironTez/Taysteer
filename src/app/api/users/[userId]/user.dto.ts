import { User } from "next-auth";
import { ResponseDto } from "../../dto";

export type UserResponseT = Omit<User, "passwordHash">;

export type GetUserResponseDto = ResponseDto<UserResponseT>
