import { urlAddToPath } from "@/utils/url";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { accessGuard } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import { getUserBy } from "../internal-actions/user";
import styles from "./style.module.css";

type ProfileProps = {
  userId?: string;
};

export async function Profile({ userId }: ProfileProps) {
  const requestedUser = userId && (await getUserBy({ userId }));

  const { hasAccess, session } = await accessGuard(requestedUser || undefined);

  if (!session) {
    notFound();
  }

  const user = requestedUser || session;

  const profilePicture = user.image?.id
    ? `/image/${user.image.id}`
    : (await import("@/../public/profile.svg")).default;

  const pathEdit = urlAddToPath(getUrl(), "edit");

  return (
    <div>
      <div className={styles.imageContainer}>
        <Image sizes="100%" src={profilePicture} alt="Profile picture" />
      </div>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Description: {user.description}</p>
      {hasAccess && <Link href={pathEdit}>Edit</Link>}
    </div>
  );
}
