import { prisma } from "@/db";
import { actionError, actionResponse } from "@/utils/dto";
import { noop } from "@/utils/function";
import {
  Comment,
  Recipe,
  RecipeRating,
  Role,
  Status,
  User,
} from "@prisma/client";
import { deleteSessionCookies, getSessionUser } from "./auth";
import { getCreateImageVariable } from "./helpers";

export const checkAccess = (
  user: User | null,
  target: User | Recipe | RecipeRating | Comment | null,
) => {
  if (!user || !target) return false;

  if (user.role === Role.ADMIN) return true;
  if (target.id === user.id && user.status === Status.ACTIVE) return true;
  if ("userId" in target && target.userId === user.id) return true;

  return false;
};

export const checkSessionAccess = async (
  target: User | Recipe | RecipeRating | Comment | null,
) => {
  const user = await getSessionUser();
  if (!user) return false;

  return checkAccess(user, target);
};

export const getUserById = async (id: string) =>
  await prisma.user
    .findUnique({
      where: {
        id,
      },
      include: { image: { select: { id: true } } },
    })

    .catch(noop);

export const editUser = async (
  targetUser: User,
  name: string | null,
  description: string | null,
  image: File | undefined,
  username: string,
  email: string,
) => {
  const hasAccess = checkSessionAccess(targetUser);
  if (!hasAccess) {
    return actionError("Forbidden");
  }

  const createImageVariable = await getCreateImageVariable(image);

  return await prisma.user
    .update({
      where: { id: targetUser.id },
      data: {
        name,
        description,
        username,
        email,
        image: createImageVariable,
      },
    })

    .then((newUser) => actionResponse({ user: newUser }))
    .catch(() => actionError("Could not edit user"));
};

export const deleteUser = async (id: string, sessionUser: User) =>
  await prisma.user
    .delete({ where: { id } })
    .then(() => {
      if (id === sessionUser.id) {
        deleteSessionCookies();
      }
    })

    .then(actionResponse)
    .catch(() => actionError("Could not delete user"));

export const banUser = async (id: string) =>
  await prisma.user
    .update({
      where: { id },
      data: { status: Status.BANNED },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not ban user"));

export const unbanUser = async (id: string) =>
  await prisma.user
    .update({
      where: { id },
      data: { status: Status.ACTIVE },
    })

    .then(actionResponse)
    .catch(() => actionError("Could not unban user"));

export const getNameOfUser = (user: User | null | undefined) => {
  const userExists = !!user;
  const userValid = userExists && user.status === Status.ACTIVE;

  return userExists ? (userValid ? user.name : "Banned user") : "Deleted user";
};
