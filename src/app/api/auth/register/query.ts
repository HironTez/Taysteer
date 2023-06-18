import { RegisterRequestDto, RegisterResponseDto } from "./register.dto";

import { request } from "../../request";

const URL = "/api/auth/register";

export const register = (email: string, password: string) =>
  request<RegisterResponseDto, RegisterRequestDto>(
    URL,
    {
      email,
      password,
    },
    "POST"
  );
