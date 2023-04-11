import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-4">
      <div className="h-[1px] bg-black dark:bg-white opacity-10 mt-6 mx-8"></div>
      <div className="text-center text-sm opacity-50 font-light p-4">
        <span>Thule has been created by</span>{" "}
        <Link className="underline" href="https://github.com/lko3001">
          @lko
        </Link>
      </div>
    </footer>
  );
}
