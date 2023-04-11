import Link from "next/link";
import { PostProps, UserProps } from "./Interfaces";
import Icon from "./Icon";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

interface Props {
  user: UserProps;
  text: string;
  createdAt: Date;
  postToLink?: PostProps;
}

export default function Comment({ user, text, createdAt, postToLink }: Props) {
  const formattedDate = `${new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt)} • ${new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(createdAt)}`;

  return (
    <div className="rounded-md bg-snow dark:bg-charcoal p-4">
      <div className="sm:text-sm text-xs opacity-50 justify-between flex flex-row items-center mb-3">
        <Link
          href={`/user/${user.id}`}
          className="hover:underline focus-visible:outline outline-2"
        >
          {user.name}
        </Link>
        <span>{formattedDate}</span>
      </div>
      <div className="whitespace-pre-wrap">{text}</div>
      {postToLink && (
        <Link
          href={`/${postToLink.id}`}
          className="flex flex-row justify-end hover:underline items-center sm:text-sm text-xs opacity-50 mt-2"
        >
          <Icon
            icon={<ArrowTopRightOnSquareIcon />}
            child="[&>*]:w-4 [&>*]:h-4"
            parent="p-1"
          />
          <span>Open Post</span>
        </Link>
      )}
    </div>
  );
}
