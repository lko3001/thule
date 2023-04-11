import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Layout from "./layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}
