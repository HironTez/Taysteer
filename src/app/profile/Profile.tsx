import { urlAddToPath } from "@/utils/url";
import Link from "next/link";
import { notFound } from "next/navigation";
import AutoImage from "../components/AutoImage";
import { accessGuard } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import { getUserBy } from "../internal-actions/user";
import "./style.module.css";
import React from "react";

type ProfileProps = {
  username?: string;
};

export async function Profile({ username }: ProfileProps) {
  const requestedUser = username && (await getUserBy({ username }));

  const { hasAccess, session } = await accessGuard(requestedUser || undefined);

  if (!session) {
    notFound();
  }

  const user = requestedUser || session;

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
      {hasAccess && <Link href={pathEdit}>Edit</Link>}
    </div>
  );
}
