import { prisma } from "@/db";
import { RequireOnlyOne } from "@/types/RequireOnlyOne";
import { UserWithImage } from "@/types/user";
import { exclude } from "@/utils/object";

const excludePassword = (user: UserWithImage | null) => {
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
