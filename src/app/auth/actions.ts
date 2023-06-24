"use server";

import { createUser } from "../actions/user";
import { createUserSchema } from "../schemas/user";
import { zodError } from "@/utils/zod";

export const submitRegister = async (data: unknown) => {
  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) return zodError(parsed.error);
  return await createUser(parsed.data);
};
