import { urlAddToPath } from "@/utils/url";
import { Role, Status } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Confirm from "../components/confirm";
import { getSessionUser } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import {
  banUser,
  checkAccess,
  deleteUser,
  getUserBy,
  unbanUser,
} from "../internal-actions/user";
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

  const viewerHasAccess = await checkAccess(user, sessionUser);
  const viewerIsAdmin = sessionUser?.role === Role.ADMIN;
  const userIsBanned = user.status === Status.BANNED;
  const userIsSame = user.id === sessionUser?.id;

  const profilePicture = user.image?.id
    ? `/image/${user.image.id}`
    : (await import("@/../public/profile.svg")).default;
  const pathEdit = urlAddToPath(getUrl(), "edit");

  let deleteUserError: string | undefined = undefined;
  let banUserError: string | undefined = undefined;
  let unbanUserError: string | undefined = undefined;

  const submitDelete = async () => {
    "use server";
    const result = await deleteUser(user);
    if (!result.success) deleteUserError = result.errors.global;
  };

  const submitBan = async () => {
    "use server";
    const result = await banUser(user);
    if (!result.success) banUserError = result.errors.global;
  };

  const submitUnban = async () => {
    "use server";
    const result = await unbanUser(user);
    if (!result.success) unbanUserError = result.errors.global;
  };

  return (
    <div>
      <div className={styles.imageContainer}>
        <Image fill sizes="50%" src={profilePicture} alt="Profile picture" />
      </div>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Description: {user.description}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.status}</p>
      {viewerHasAccess && (
        <>
          <Link href={pathEdit}>Edit</Link>
          <Confirm
            buttonText="Delete"
            confirmText="Confirm deletion"
            onConfirm={submitDelete}
          >
            Do you actually want to delete this profile? This action cannot be
            undone
            {deleteUserError}
          </Confirm>

          {viewerIsAdmin &&
            !userIsSame &&
            (userIsBanned ? (
              <Confirm
                buttonText="Unban"
                confirmText="Confirm unban"
                onConfirm={submitUnban}
                key="unban"
              >
                Unban user?
                {banUserError}
              </Confirm>
            ) : (
              <Confirm
                buttonText="Ban"
                confirmText="Confirm ban"
                onConfirm={submitBan}
                key="ban"
              >
                Ban user?
                {unbanUserError}
              </Confirm>
            ))}
        </>
      )}
    </div>
  );
}
