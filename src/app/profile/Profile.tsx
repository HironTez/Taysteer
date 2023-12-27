import { notFound } from "next/navigation";
import React from "react";
import AutoImage from "../components/AutoImage";
import { getSession } from "../internal-actions/auth";
import { getUserBy } from "../internal-actions/user";
import "./style.module.css";

type ProfileProps = {
  username?: string;
};
export async function Profile({ username }: ProfileProps) {
  const user = username ? await getUserBy({ username }) : await getSession();

  if (!user) {
    notFound();
  }

  const profilePicture = user.image?.id
    ? `/image/${user.image.id}`
    : await import("@/../public/profile.svg");

  return (
    <div>
      <AutoImage sizes="100%" src={profilePicture} alt="Profile picture" />
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Description: {user.description}</p>
    </div>
  );
}
