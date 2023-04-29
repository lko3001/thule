import {
  HomeIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Icon from "./Icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { UserProps } from "./Interfaces";
import { useRouter } from "next/router";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const { setTheme, theme, systemTheme } = useTheme();
  const { status, data } = useSession();
  const router = useRouter();
  const currentTheme = theme === "system" ? systemTheme : theme;

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
    } else {
      setTheme(systemTheme!);
    }
  }

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
          <Icon icon={<PlusIcon />} link="/create" />
          <img
            src={user.image || ""}
            onClick={() => router.push(`/user/${user.id}`)}
            className="h-8 w-8 object-cover rounded-md outline cursor-pointer outline-transparent hover:outline-blueberry transition-[outline] duration-200"
          />
        </>
      )}
      <Icon
        icon={currentTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        handleClick={switchTheme}
      />
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
