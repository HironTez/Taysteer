"use server";

import { hash } from "bcrypt";
import { prisma } from "@/db";
import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .strict();

type CreateUserDataT = z.infer<typeof createUserSchema>;

export const createUser = async ({ email, password }: CreateUserDataT) => {
  // Check if email isn't registered
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) return { error: "This email is already registered" };

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

  return user;
};
