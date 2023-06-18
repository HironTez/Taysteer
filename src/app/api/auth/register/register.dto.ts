import { ResponseDto } from "../../dto";
import { UserResponseT } from "../../users/[userId]/user.dto";

export interface RegisterRequestDto {
  email: string;
  password: string;
};

export type RegisterResponseDto = ResponseDto<UserResponseT>
