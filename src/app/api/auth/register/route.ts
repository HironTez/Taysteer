import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  // Check if email isn't registered
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  // Generate an unique username
  let username = "";
  while (username && (await prisma.user.findUnique({ where: { username } })))
    username = `user${Math.random() * 1000000000}`;

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hash(password, 10),
      username,
    },
  });
  return NextResponse.json(user);
}
