import {
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import Icon from "./Icon";
import Link from "next/link";
import { PostProps } from "./Interfaces";

export default function Post({
  title,
  content,
  createdAt,
  user,
  likes,
  id,
  isTitleClickable = true,
  currentUser,
  _count,
  postType,
}: PostProps) {
  const [liked, setLiked] = useState(likedInfo().ifLiked);
  const [likeCounter, setLikeCounter] = useState(_count.likes);

  const createdDate = useRef(new Date(createdAt));
  const formattedDate = `${new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdDate.current)} • ${new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(createdDate.current)}`;

  function likedInfo() {
    const likeByUser = likes.filter(
      (like) => like.postId === id && like.userId === currentUser?.id
    );

    const userHasLiked = likeByUser.length === 0 ? false : true;

    return {
      ifLiked: userHasLiked,
      likeId: userHasLiked ? likeByUser[0].id : null,
    };
  }

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCounter((prev) => (!liked ? prev + 1 : prev - 1));

    fetch("/api/likePost", {
      method: "POST",
      body: JSON.stringify({
        postId: id,
        likeId: likedInfo().likeId,
      }),
    });
  }

  return (
    <div className="rounded-md bg-snow dark:bg-charcoal sm:p-6 sm:pb-3 p-4 pb-2">
      <div className="sm:text-sm text-xs opacity-50 justify-between flex flex-row items-center mb-2 sm:mb-4">
        <Link
          href={`/user/${user.id}`}
          className="hover:underline focus-visible:outline outline-2"
        >
          by {user.name}
        </Link>
        <span>{formattedDate}</span>
      </div>
      {isTitleClickable ? (
        <Link
          href={`/${id}`}
          className="font-semibold text-lg sm:text-xl block mb-2 hover:underline focus-visible:outline outline-2"
        >
          {title}
        </Link>
      ) : (
        <h2 className="font-semibold text-lg sm:text-xl block mb-2">{title}</h2>
      )}
      {postType === "text" && (
        <div className="whitespace-pre-wrap">{content}</div>
      )}
      {postType === "pic" && (
        <a href={content} target="_blank" className="block w-fit mx-auto">
          <img
            src={content}
            className="object-cover object-center max-h-[40vh] mx-auto"
          />
        </a>
      )}
      {postType === "video" && (
        <video
          src={content}
          className="object-cover object-center max-h-[40vh] mx-auto"
          controls
          muted
        />
      )}
      <div className="h-[1px] bg-black dark:bg-white opacity-10 mt-4 sm:mt-6 mb-2"></div>
      <div className="flex flex-row items-center justify-start gap-2">
        <span className="-mb-[1px] opacity-50">{likeCounter}</span>
        <Icon
          icon={
            <HeartIcon
              className={liked ? "text-blueberry fill-blueberry" : ""}
            />
          }
          handleClick={handleLike}
        />
        <span className="-mb-[1px] opacity-50">{_count.comments}</span>
        <Icon icon={<ChatBubbleBottomCenterTextIcon />} />
      </div>
    </div>
  );
}
