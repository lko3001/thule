import {
  HomeIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Icon from "./Icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { UserProps } from "./Interfaces";
import { useRouter } from "next/router";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const { setTheme, theme } = useTheme();
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch("/api/getCurrentUser")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  if (!mounted) {
    return null;
  }

  function switchTheme() {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  function whichButton(
    userStatus: "authenticated" | "loading" | "unauthenticated"
  ): { handler: () => void; text: string } {
    if (userStatus === "authenticated")
      return { handler: signOut, text: "Sign Out" };
    if (userStatus === "unauthenticated")
      return { handler: signIn, text: "Sign In" };
    return { handler: signIn, text: "Loading..." };
  }

  const { handler, text } = whichButton(status);

  return (
    <nav className="flex z-10 mb-4 md:mb-8 px-6 border-b-[1px] border-black/10 dark:border-white/10 flex-row items-center justify-around gap-3 p-2 bg-snow dark:bg-charcoal sticky top-0">
      <Icon link="/" icon={<HomeIcon />} />
      <input
        type="text"
        className="p-2 px-4 rounded-full w-full grow bg-snowdrift dark:bg-night"
        placeholder="Search..."
      />
      {user && (
        <>
          <Icon icon={<PlusIcon />} />
          <img
            src={user.image || ""}
            onClick={() => router.push(`/user/${user.id}`)}
            className="h-8 w-8 object-cover rounded-md outline cursor-pointer outline-transparent hover:outline-blueberry transition-[outline] duration-200"
          />
        </>
      )}
      {!data?.user?.email && (
        <button
          className="rounded-md bg-blueberry px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap"
          onClick={() => signIn()}
        >
          sign in
        </button>
      )}
    </nav>
  );
}
