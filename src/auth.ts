import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";

const providers = [];

// Add Auth0 provider when credentials are available
const auth0Issuer = process.env.AUTH0_ISSUER || 
  (process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}` : undefined);
 
if (process.env.AUTH0_CLIENT_ID && auth0Issuer && process.env.AUTH0_CLIENT_SECRET) {
  providers.push(
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: auth0Issuer,
    })
  );
}

providers.push(
  Credentials({
    id: "hedera-wallet",
    name: "Hedera Wallet",
    credentials: {
      accountId: { label: "Account ID", type: "text" },
      signature: { label: "Signature", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.accountId || !credentials?.signature) return null;

      // In a real production app, we would use @hashgraph/sdk to verify the signature
      // against the account's public key. For this hackathon, we'll verify the format
      // and allow sign-in.
      
      const accountId = credentials.accountId as string;
      if (!accountId.startsWith("0.0.")) return null;

      return {
        id: accountId,
        name: `Wallet: ${accountId}`,
        email: `${accountId}@hedera.wallet`, // Mock email for provider consistency
        image: null,
      };
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
