import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function LoadingPosts() {
  const { status } = useSession();
  const [glowing, setGlowing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (status === "loading") {
      intervalRef.current = setInterval(() => {
        setGlowing((prev) => !prev);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [status]);

  return (
    <main className="max-w-3xl md:mx-auto mx-2 flex flex-col gap-4">
      {[1, 2, 3].map((el) => (
        <div
          key={el}
          className={`rounded-md p-6 pb-3 h-[700px] loading-post overflow-hidden relative transition-colors duration-[2000ms] ${
            glowing ? "bg-blueberry/10" : "bg-snow dark:bg-charcoal"
          }`}
        ></div>
      ))}
    </main>
  );
}
