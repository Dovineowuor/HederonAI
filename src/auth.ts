import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
// Bypassing any locally-tested hardcoded localhost URLs set in Vercel's env dashboard
if (process.env.VERCEL || process.env.VERCEL_URL) {
  delete process.env.AUTH_URL;
  delete process.env.NEXTAUTH_URL;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret_for_poc_only_do_not_use_in_prod",
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Intercept any OAuth Social Login (Google, GitHub, Auth0, Microsoft) to provision Hedera Wallets
      if (account?.type === "oauth" && user?.email) {
        const { getUserByEmail, createUser } = await import("./lib/db");
        let dbUser = getUserByEmail(user.email);
        
        if (!dbUser) {
          const { provisionNewAccount } = await import("./lib/hedera");
          const wallet = await provisionNewAccount(5);
          createUser(
            user.email,
            user.name || "Social User",
            "OAUTH_LOGIN_" + Date.now(),
            wallet?.accountId,
            wallet?.privateKey
          );
          dbUser = getUserByEmail(user.email);
        }
        
        if (dbUser?.hederaAccountId) {
          (user as any).hederaAccountId = dbUser.hederaAccountId;
        }
      }
      return true;
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "hedera-wallet",
      name: "Hedera Wallet",
      credentials: {
        accountId: { label: "Account ID", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accountId || !credentials?.signature) return null;
        
        const accountId = credentials.accountId as string;
        if (!accountId.startsWith("0.0.")) return null;

        return {
          id: accountId,
          name: `Wallet: ${accountId}`,
          email: `${accountId}@hedera.wallet`,
          image: null,
        };
      },
    }),
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = credentials.email as string;
        const password = credentials.password as string;

        const { getUserByEmail } = await import("./lib/db");
        const user = getUserByEmail(email);

        if (user && user.password.includes('.')) {
          const [salt, storedHash] = user.password.split('.');
          const crypto = await import("crypto");
          const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

          if (hash === storedHash) {
            return {
              id: user.id,
              name: user.name,
              email: user.id,
              role: (user as any).role,
              hederaAccountId: user.hederaAccountId,
            };
          }
        } else if (user && user.password === password) {
          return {
            id: user.id,
            name: user.name,
            email: user.id,
            role: (user as any).role,
            hederaAccountId: user.hederaAccountId,
          };
        }
        return null;
      },
    }),
  ],
});
