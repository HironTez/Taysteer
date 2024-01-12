import { urlAddToPath } from "@/utils/url";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import { checkAccess, getUserBy } from "../internal-actions/user";
import styles from "./style.module.css";

type ProfileProps = {
  userId?: string;
};

export async function Profile({ userId }: ProfileProps) {
  const requestedUser = userId ? await getUserBy({ userId }) : null;
  const sessionUser = await getSessionUser();

  if (!userId && !sessionUser) redirect("/auth");
  if (userId && !requestedUser) notFound();

  const user = (requestedUser || sessionUser)!;

  const profilePicture = user.image?.id
    ? `/image/${user.image.id}`
    : (await import("@/../public/profile.svg")).default;

  const hasAccess = await checkAccess(requestedUser, sessionUser);
  const pathEdit = urlAddToPath(getUrl(), "edit");

  return (
    <div>
      <div className={styles.imageContainer}>
        <Image fill sizes="50%" src={profilePicture} alt="Profile picture" />
      </div>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Description: {user.description}</p>
      {hasAccess && <Link href={pathEdit}>Edit</Link>}
      {/* TODO: delete button */}
    </div>
  );
}
