"use client";

import { SWRConfig } from "swr";
import { NextUIProvider } from "@nextui-org/react";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return await res.json();
  };
  return (
    <SWRConfig value={{ fetcher }}>
      <NextUIProvider>
        <main className="dark text-foreground bg-background">{children}</main>
      </NextUIProvider>
    </SWRConfig>
  );
}
