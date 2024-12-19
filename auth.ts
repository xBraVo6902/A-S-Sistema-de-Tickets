import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    name: string;
  }

  interface Session {
    user: User;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const person = await prisma.person.findUnique({
          where: { email: credentials.email },
        });

        if (!person) throw new Error("USER_NOT_FOUND");

        const passwordsMatch =
          person.password === null
            ? credentials.password === person.password
            : await bcrypt.compare(credentials.password, person.password);

        if (!passwordsMatch) throw new Error("WRONG_PASSWORD");

        return {
          id: person.id.toString(),
          name: person.firstName,
          email: person.email,
          role: person.role,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        role: token.role,
        name: token.name,
      },
    }),
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
