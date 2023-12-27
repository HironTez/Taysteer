import { prisma } from "@/db";
import { notFound } from "next/navigation";
import React from "react";
import { getSession } from "../internal-actions/auth";
import "./style.css";

type ProfileProps = {
  username?: string;
};

export default async function Profile({ username }: ProfileProps) {
  const user = username
    ? await prisma.user.findUnique({
        where: { username },
      })
    : await getSession();

  if (!user) {
    notFound();
  }

  return <>{JSON.stringify(user)}</>;
}
