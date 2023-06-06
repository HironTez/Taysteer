import { User } from "@prisma/client";
import { exclude } from "@/utils/object";

export const excludePassword = (user: User) => exclude(user, ["passwordHash"]);
