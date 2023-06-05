import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "Login", type: "login" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { login, password } = credentials ?? {};
        if (!login || !password) {
          throw new Error("Missing login or password");
        }
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: login }, { username: login }],
          },
        });
        // if user doesn't exist or password doesn't match
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
          throw new Error("Invalid login or password");
        }
        return user;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
