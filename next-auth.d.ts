// auth.ts
import NextAuth, { NextAuthConfig, Session, User, JWT } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null;
      name: string;
      email: string;
      image: string;
      googleAccessToken: string | null;
      linkedinAccessToken: string | null;
    };
  }

  interface JWT {
    googleAccessToken?: string | null;
    linkedinAccessToken?: string | null;
    googleId?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.labels",
            "openid",
            "profile",
            "email",
          ].join(" "),
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.AUTH_LINKEDIN_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "profile",
            "email"
          ],
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // Store Google tokens
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token ?? null;
        token.googleId = profile?.sub ?? null;
      }

      // Store LinkedIn tokens
      if (account?.provider === "linkedin") {
        token.linkedinAccessToken = account.access_token ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      // Manually typecast session.user to allow assigning custom fields
      const user = session.user as Session["user"];

      user.googleAccessToken = token.googleAccessToken ?? null;
      user.linkedinAccessToken = token.linkedinAccessToken ?? null;
      user.id = token.googleId ?? null;

      return session;
    },
  },



  secret: process.env.AUTH_SECRET,
});
