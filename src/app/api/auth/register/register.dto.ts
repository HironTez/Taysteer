import { ResponseDto } from "../../dto";
import { UserResponseT } from "../../users/users.dto";

export interface RegisterRequestDto {
  email: string;
  password: string;
};

export type RegisterResponseDto = ResponseDto<UserResponseT>
