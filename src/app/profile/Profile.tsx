import { urlAddToPath } from "@/utils/url";
import { Role, Status } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import Confirm from "../components/confirm";
import ProfilePicture from "../components/profile-picture";
import { getSessionUser, redirectToAuth } from "../internal-actions/auth";
import { getUrl } from "../internal-actions/url";
import {
  banUser,
  checkAccess,
  deleteUser,
  getUserById,
  unbanUser,
} from "../internal-actions/user";
import { variable } from "../internal-actions/variables";
import styles from "./profile.module.css";

type ProfileProps = {
  userId?: string;
};

const deleteUserErrorVariable = variable<string | undefined>("deleteUserError");
const banUserErrorVariable = variable<string | undefined>("banUserError");
const unbanUserErrorVariable = variable<string | undefined>("unbanUserError");

export async function Profile({ userId }: ProfileProps) {
  const requestedUser = userId ? await getUserById(userId) : null;
  const sessionUser = await getSessionUser();

  if (!userId && !sessionUser) redirectToAuth();
  if (userId && !requestedUser) notFound();

  const user = (requestedUser || sessionUser)!;

  const viewerHasAccess = await checkAccess(sessionUser, user);
  const viewerIsAdmin = sessionUser?.role === Role.ADMIN;
  const userIsBanned = user.status === Status.BANNED;
  const userIsSame = user.id === sessionUser?.id;
  const pathEdit = urlAddToPath(getUrl(), "edit");
  const deleteUserError = deleteUserErrorVariable.get();
  const banUserError = banUserErrorVariable.get();
  const unbanUserError = unbanUserErrorVariable.get();

  const submitDelete = async () => {
    "use server";
    const result = await deleteUser(user);
    if (!result.success) deleteUserErrorVariable.set(result.errors.global);
  };

  const submitBan = async () => {
    "use server";
    const result = await banUser(user);
    if (!result.success) banUserErrorVariable.set(result.errors.global);
  };

  const submitUnban = async () => {
    "use server";
    const result = await unbanUser(user);
    if (!result.success) unbanUserErrorVariable.set(result.errors.global);
  };

  return (
    <div>
      <div className={styles.imageContainer}>
        <ProfilePicture user={user} />
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
