import type { NextAuthConfig } from "next-auth";
import Auth0 from "next-auth/providers/auth0";

// Auth0 issuer logic
const auth0Issuer = process.env.AUTH0_ISSUER || 
  (process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}` : undefined);

const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret_for_poc_only_do_not_use_in_prod",
  providers: [
    // Auth0 is Edge-compatible
    ...(process.env.AUTH0_CLIENT_ID && auth0Issuer && process.env.AUTH0_CLIENT_SECRET
      ? [
          Auth0({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: auth0Issuer,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export default authConfig;
