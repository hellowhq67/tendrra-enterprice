<<<<<<< HEAD
// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
=======
import NextAuth from "next-auth";
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      accessToken?: string;
<<<<<<< HEAD
      linkedinAccessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleAccessToken?: string | null;
    linkedinAccessToken?: string | null;
    googleId?: string | null;
=======
    };
  }
  interface User {
    id: string;
    accessToken?: string;
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
  }
}
