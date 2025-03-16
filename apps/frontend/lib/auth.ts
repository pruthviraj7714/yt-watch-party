import { sign } from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prismaClient as prisma } from "@repo/db/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Profile {
    id: string;
    login: string;
  }

  interface Session {
    user: {
      accessToken: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken: string;
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile, account }) {
      if (account && profile) {
        try {
          let dbUser = await prisma.user.findFirst({
            where: { githubId: profile.id.toString() },
          });
    
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                githubId: profile.id.toString(),
                username: profile.login || profile.name!,
              },
            });
          }
    
          const newToken = sign({ id: dbUser.id }, process.env.NEXTAUTH_SECRET!);
    
          token.accessToken = newToken;
          token.id = dbUser.id;
        } catch (error) {
          console.error(error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.id = token.id as string;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
