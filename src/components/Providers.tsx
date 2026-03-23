import { SessionProvider } from "next-auth/react";
import { HOLProvider } from "./providers/HOLProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HOLProvider>
        {children}
      </HOLProvider>
    </SessionProvider>
  );
}
