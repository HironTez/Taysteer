import { prisma } from "@/db";
import { UserWithImage } from "@/types/Models";
import { actionError, actionResponse } from "@/utils/dto";
import { Comment, Recipe, RecipeRating, Role, Status } from "@prisma/client";
import { getURL } from "next/dist/shared/lib/utils";
import { redirect } from "next/navigation";
import { deleteSessionCookies, getSessionUser } from "./auth";
import { getCreateImageVariable } from "./helpers";
import { revalidatePage } from "./url";

export const checkAccess = async (
  user: UserWithImage | null,
  target: UserWithImage | Recipe | RecipeRating | Comment | null,
) => {
  if (!user || !target) return false;

  if (user.role === Role.ADMIN) return true;
  if (target.id === user.id && user.status === Status.ACTIVE) return true;
  if ("userId" in target && target.userId === user.id) return true;

  return false;
};

export const getUserById = async (id: string) => {
  try {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: { image: { select: { id: true } } },
    });
  } catch {
    return null;
  }
};

export const editUser = async (
  targetUser: UserWithImage,
  name: string | null,
  description: string | null,
  image: File | undefined,
  username: string,
  email: string,
) => {
  const user = await getSessionUser();
  const hasAccess = await checkAccess(user, targetUser);
  if (!hasAccess) {
    return actionError("Forbidden");
  }

  const createImageVariable = await getCreateImageVariable(image);
  const newUser = await prisma.user.update({
    where: { id: targetUser.id },
    data: {
      name,
      description,
      username,
      email,
      image: createImageVariable,
    },
  });

  return actionResponse({ user: newUser });
};

export const deleteUser = async (targetUser: UserWithImage) => {
  const user = await getSessionUser();
  const hasAccess = await checkAccess(user, targetUser);
  if (!hasAccess) {
    return actionError("Forbidden");
  }

  try {
    await prisma.user.delete({ where: { id: targetUser.id } });

    if (targetUser.image?.id) {
      await prisma.image.delete({ where: { id: targetUser.image.id } });
    }

    if (targetUser.id === user!.id) {
      deleteSessionCookies();
      redirect("/");
    } else {
      redirect(getURL());
    }
  } catch {
    return actionError("Could not delete user");
  }
};

export const banUser = async (targetUser: UserWithImage) => {
  const user = await getSessionUser();
  const hasAccess = await checkAccess(user, targetUser);
  const userIsSame = targetUser.id === user?.id;
  if (!hasAccess || userIsSame) {
    return actionError("Forbidden");
  }

  try {
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { status: Status.BANNED },
    });

    await prisma.session.deleteMany({ where: { userId: targetUser.id } });

    revalidatePage();
    return actionResponse();
  } catch {
    return actionError("Could not ban user");
  }
};

export const unbanUser = async (targetUser: UserWithImage) => {
  const user = await getSessionUser();
  const hasAccess = await checkAccess(user, targetUser);
  const userIsSame = targetUser.id === user?.id;
  if (!hasAccess || userIsSame) {
    return actionError("Forbidden");
  }

  try {
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { status: Status.ACTIVE },
    });

    await prisma.session.deleteMany({ where: { userId: targetUser.id } });

    revalidatePage();
    return actionResponse();
  } catch {
    return actionError("Could not unban user");
  }
};

export const getNameOfUser = (user: UserWithImage | null | undefined) => {
  const userExists = !!user;
  const userValid = userExists && user.status === Status.ACTIVE;

  return userExists ? (userValid ? user.name : "Banned user") : "Deleted user";
};
