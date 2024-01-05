import { prisma } from "@/db";
import { RequireOnlyOne } from "@/types/RequireOnlyOne";
import { UserWithImage } from "@/types/user";
import { actionError, actionResponse } from "@/utils/dto";
import { exclude } from "@/utils/object";
import { hash } from "bcrypt";
import { fileTypeFromBuffer } from "file-type";
import { accessGuard } from "./auth";

type UserWithImageAndPassword = UserWithImage & { passwordHash: string };

const excludePassword = (user: UserWithImageAndPassword | null) => {
  return user && exclude(user, ["passwordHash"]);
};

type Param = RequireOnlyOne<{
  userId: string;
  username: string;
  email: string;
}>;

export const getUserBy = async ({ userId, username, email }: Param) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            id: userId,
          },
          {
            username,
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
  const { hasAccess } = await accessGuard(targetUser);
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
