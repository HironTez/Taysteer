import { Role, Status } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import Confirm from "../components/confirm";
import ProfilePicture from "../components/profile-picture";
import Recipes from "../components/recipes";
import { getSessionUser, redirectToAuth } from "../internal-actions/auth";
import { newUrl, revalidatePage } from "../internal-actions/url";
import {
  banUser,
  checkAccess,
  checkSessionAccess,
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

  const viewerHasAccess = checkAccess(sessionUser, user);
  const viewerIsAdmin = sessionUser?.role === Role.ADMIN;
  const userIsBanned = user.status === Status.BANNED;
  const userIsSame = user.id === sessionUser?.id;
  const editUrl = newUrl("edit");
  const changePasswordUrl = newUrl("/profile/change-password");
  const deleteUserError = deleteUserErrorVariable.get();
  const banUserError = banUserErrorVariable.get();
  const unbanUserError = unbanUserErrorVariable.get();

  const submitDelete = async () => {
    "use server";
    const viewerHasAccess = await checkSessionAccess(user);
    if (viewerHasAccess) {
      const result = await deleteUser(user.id, sessionUser!);
      deleteUserErrorVariable.set(
        result.success ? undefined : result.errors.global,
      );
    } else {
      deleteUserErrorVariable.set("Forbidden");
    }

    revalidatePage();
  };

  const submitBan = async () => {
    "use server";
    const viewerHasAccess = await checkSessionAccess(user);
    if (viewerHasAccess && sessionUser!.id !== user.id) {
      const result = await banUser(user.id);
      banUserErrorVariable.set(
        result.success ? undefined : result.errors.global,
      );
    } else {
      banUserErrorVariable.set("Forbidden");
    }

    revalidatePage();
  };

  const submitUnban = async () => {
    "use server";
    const viewerHasAccess = await checkSessionAccess(user);
    if (viewerHasAccess && sessionUser!.id !== user.id) {
      const result = await unbanUser(user.id);
      unbanUserErrorVariable.set(
        result.success ? undefined : result.errors.global,
      );
    } else {
      unbanUserErrorVariable.set("Forbidden");
    }

    revalidatePage();
  };

  return (
    <>
      <div className={styles.imageContainer}>
        <ProfilePicture user={user} sizes="50%" />
      </div>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Description: {user.description}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.status}</p>
      {viewerHasAccess && (
        <>
          <Link href={editUrl}>Edit</Link>
          <Confirm
            buttonText="Delete"
            confirmText="Confirm deletion"
            onConfirm={submitDelete}
          >
            Do you actually want to delete this profile? This action cannot be
            undone
            {deleteUserError}
          </Confirm>
          {userIsSame && <Link href={changePasswordUrl}>Change password</Link>}

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

      <p>{user.name}'s recipes:</p>
      <Recipes userId={user.id} />
    </>
  );
}
