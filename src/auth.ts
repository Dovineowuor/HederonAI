import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
            };
          }
        } else if (user && user.password === password) {
          return {
            id: user.id,
            name: user.name,
            email: user.id,
          };
        }
        return null;
      },
    }),
  ],
});
