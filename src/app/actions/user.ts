"use server";

import { error, response } from "./dto";

import { createUserSchema } from "../schemas/user";
import { hash } from "bcrypt";
import { prisma } from "@/db";
import { z } from "zod";

type CreateUserDataT = z.infer<typeof createUserSchema>;

export const createUser = async ({ email, password }: CreateUserDataT) => {
  // Check if email isn't registered
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists)
    return error<CreateUserDataT>("This email is already registered", [
      "email",
    ]);

  // Hash the password
  const passwordHash = await hash(password, 10);

  // Create an unique username
  const username = `user${Date.now()}`;

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
    },
  });

  return response(user);
};
