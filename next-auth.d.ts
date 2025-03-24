
// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      accessToken?: string;
      linkedinAccessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleAccessToken?: string | null;
    linkedinAccessToken?: string | null;
    googleId?: string | null;
  }
}
