import { urlAddToPath } from "@/utils/url";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import AutoImage from "../components/AutoImage";
import { accessGuard, getSession } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import { getUserBy } from "../internal-actions/user";
import "./style.module.css";

type ProfileProps = {
  username?: string;
};
export async function Profile({ username }: ProfileProps) {
  const session = await getSession();
  const user = username ? await getUserBy({ username }) : session;

  if (!user) {
    notFound();
  }

  const access = await accessGuard(user, session);

  const profilePicture = user.image?.id
    ? `/image/${user.image.id}`
    : await import("@/../public/profile.svg");

  const pathEdit = urlAddToPath(getUrl(), "edit");

  return (
    <div>
      <AutoImage sizes="100%" src={profilePicture} alt="Profile picture" />
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Description: {user.description}</p>
      {access.success && <Link href={pathEdit}>Edit</Link>}
    </div>
  );
}
