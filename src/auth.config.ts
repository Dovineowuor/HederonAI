import type { NextAuthConfig } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import AzureAD from "next-auth/providers/azure-ad";

// Auth0 issuer logic
const auth0Issuer = process.env.AUTH0_ISSUER || 
  (process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}` : undefined);

const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret_for_poc_only_do_not_use_in_prod",
  providers: [
    // OAuth Providers (Edge-compatible)
    ...(process.env.AUTH0_CLIENT_ID && auth0Issuer && process.env.AUTH0_CLIENT_SECRET
      ? [
          Auth0({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: auth0Issuer,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
      ? [
          AzureAD({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            // Must use 'common' for "Entra ID tenants + personal Microsoft accounts"
            // Using a specific tenant ID here would reject accounts from other tenants
            issuer: "https://login.microsoftonline.com/common/v2.0",
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "user";
        if ((user as any).hederaAccountId) {
          token.hederaAccountId = (user as any).hederaAccountId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        if (token.hederaAccountId) {
          (session.user as any).name = `Wallet: ${token.hederaAccountId}`;
          (session.user as any).hederaAccountId = token.hederaAccountId;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export default authConfig;
