import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID, // Ensure these are defined!
      clientSecret: process.env.AUTH_GOOGLE_SECRET, // Ensure these are defined!
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "https://www.googleapis.com/auth/gmail.readonly",  // Corrected: Removed leading space
            "https://www.googleapis.com/auth/gmail.send",      // Corrected: Removed leading space
            "https://www.googleapis.com/auth/gmail.labels",     // Corrected: Removed leading space
            "openid",                                            // Added: Standard OpenID Connect scopes
            "profile",                                           // Added: Standard OpenID Connect scopes
            "email",                                             // Added: Standard OpenID Connect scopes
          ].join(" "), // Join the scopes into a space-separated string
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sing-in",
  },

  secret: process.env.AUTH_SECRET,
});
