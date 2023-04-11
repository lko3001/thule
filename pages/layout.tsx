import Navbar from "@/components/Navbar";
import { useTheme } from "next-themes";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import LoadingPosts from "@/components/LoadingPosts";

const inter = Inter({ subsets: ["latin"], variable: "--inter" });

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { status } = useSession();
  const router = useRouter();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-snowdrift text-black dark:bg-night dark:text-white ${inter.variable} ${theme} font-inter`}
    >
      <Navbar />
      <main className="grow px-2">{children}</main>
      <Footer />
    </div>
  );
}
