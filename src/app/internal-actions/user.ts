import { prisma } from "@/db";
import { RequireOnlyOne } from "@/types/RequireOnlyOne";
import { UserWithImage } from "@/types/user";
import { actionError, actionResponse } from "@/utils/dto";
import { exclude } from "@/utils/object";
import { Comment, Recipe, RecipeRating, Role, User } from "@prisma/client";
import { hash } from "bcrypt";
import { fileTypeFromBuffer } from "file-type";
import { getSessionUser } from "./auth";

export const checkAccess = async (
  target: User | UserWithImage | Recipe | RecipeRating | Comment | null,
  user: UserWithImage | null,
) => {
  if (
    user &&
    (user.role === Role.ADMIN ||
      (target &&
        (("userId" in target && target.userId === user.id) ||
          target.id === user.id)))
  ) {
    return true;
  }

  return false;
};

type UserWithImageAndPassword = UserWithImage & { passwordHash: string };

const excludePassword = (user: UserWithImageAndPassword | null) => {
  return user && exclude(user, ["passwordHash"]);
};

type Param = RequireOnlyOne<{
  userId: string;
  email: string;
}>;

export const getUserBy = async ({ userId, email }: Param) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            id: userId,
          },
          {
            email,
          },
        ],
      },
      include: {
        image: { select: { id: true } },
      },
    });

    return excludePassword(user);
  } catch {
    return null;
  }
};

export const editUser = async (
  targetUser: UserWithImage,
  name: string | undefined,
  description: string | undefined,
  image: File | undefined,
  username: string | undefined,
  email: string | undefined,
  password: string | undefined,
) => {
  const user = await getSessionUser();
  const hasAccess = await checkAccess(targetUser, user);
  if (!hasAccess) {
    return actionError("Forbidden");
  }

  const passwordHash = password && (await hash(password, 10));

  const imageBuffer = image && Buffer.from(await image.arrayBuffer());
  const imageFileType = imageBuffer && (await fileTypeFromBuffer(imageBuffer));
  const imageMime = imageFileType?.mime;

  const newUser = await prisma.user.update({
    where: { id: targetUser.id },
    data: {
      name,
      description,
      username,
      email,
      passwordHash,
      image:
        imageBuffer && imageMime
          ? {
              create: {
                value: imageBuffer,
                mime: imageMime,
              },
            }
          : undefined,
    },
  });

  return actionResponse({ user: newUser });
};
