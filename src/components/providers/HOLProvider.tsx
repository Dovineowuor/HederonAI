"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface HOLContextType {
  isConnected: boolean;
  accountId: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const HOLContext = createContext<HOLContextType | undefined>(undefined);

export function HOLProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for HOL wallet connect events from the CDN-loaded web components
    const handleConnect = (event: any) => {
      console.log("[HOL] Wallet Connected:", event.detail);
      setIsConnected(true);
      setAccountId(event.detail.accountId);
    };

    const handleDisconnect = () => {
      console.log("[HOL] Wallet Disconnected");
      setIsConnected(false);
      setAccountId(null);
    };

    window.addEventListener("hashgraph-connected", handleConnect);
    window.addEventListener("hashgraph-disconnected", handleDisconnect);

    return () => {
      window.removeEventListener("hashgraph-connected", handleConnect);
      window.removeEventListener("hashgraph-disconnected", handleDisconnect);
    };
  }, []);

  const connect = async () => {
    // Trigger the HOL wallet connect modal from the global window object
    const hashinalWC = document.querySelector("hashgraph-wallet-connect") as any;
    if (hashinalWC) {
      hashinalWC.openModal();
    }
  };

  const disconnect = async () => {
     const hashinalWC = document.querySelector("hashgraph-wallet-connect") as any;
     if (hashinalWC) {
       hashinalWC.disconnect();
     }
  };

  return (
    <HOLContext.Provider value={{ isConnected, accountId, connect, disconnect }}>
      {children}
    </HOLContext.Provider>
  );
}

export function useHOL() {
  const context = useContext(HOLContext);
  if (context === undefined) {
    throw new Error("useHOL must be used within a HOLProvider");
  }
  return context;
}
