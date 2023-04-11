import { FormEvent, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  PhotoIcon as PhotoIcono,
  VideoCameraIcon as VideoCameraIcono,
  PencilIcon as PencilIcono,
} from "@heroicons/react/24/outline";
import {
  PhotoIcon as PhotoIcons,
  VideoCameraIcon as VideoCameraIcons,
  PencilIcon as PencilIcons,
} from "@heroicons/react/24/solid";
import Icon from "@/components/Icon";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Create() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<"text" | "pic" | "video">("text");
  const [imageLink, setImageLink] = useState("");
  const [imageWorks, setImageWorks] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [videoWorks, setVideoWorks] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("FORM SUBMITTED");
    const body = {
      title,
      content:
        postType === "text"
          ? content
          : postType === "pic"
          ? imageLink
          : videoLink,
      postType,
      works:
        postType === "text"
          ? true
          : postType === "pic"
          ? imageWorks
          : videoWorks,
    };

    fetch("/api/createPost", { method: "POST", body: JSON.stringify(body) })
      .then((res) => {
        if (!res.ok)
          return res.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        return res.json();
      })
      .then((data) => router.push("/"))
      .catch((err) => {
        setError(err.message);
      });
  }

  function isDisabled() {
    if (postType === "pic" && imageWorks && title !== "") return false;
    if (postType === "video" && videoWorks && title !== "") return false;
    if (postType === "text" && content !== "" && title !== "") return false;
    return true;
  }

  return (
    <form
      className="bg-snow dark:bg-charcoal p-2 max-w-3xl md:mx-auto mx-2 rounded-md"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        type="text"
        className="p-2 px-4 mb-2 rounded-md resize-none text-lg font-semibold block w-full grow bg-snowdrift dark:bg-night"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {postType === "text" ? (
        <>
          <TextareaAutosize
            className="p-2 px-4 rounded-md resize-none mb-2 block w-full grow bg-snowdrift dark:bg-night"
            placeholder="What are you thinking?"
            value={content}
            minRows={5}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="opacity-50 text-xs mt-1 ml-1 text-left mb-2">
            {content.length}/{64000}
          </p>
        </>
      ) : postType === "pic" ? (
        <input
          type="text"
          className="p-2 px-4 mb-2 rounded-md block w-full grow bg-snowdrift dark:bg-night"
          placeholder="https://i.imgur.com/IY1AbrX.png"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="p-2 px-4 mb-2 rounded-md block w-full grow bg-snowdrift dark:bg-night"
          placeholder="https://i.imgur.com/OvpP7XT.mp4"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
      )}
      {error && <p className="text-xs text-error mb-2 mx-1">{error}</p>}
      {imageLink && postType === "pic" && (
        <img
          src={imageLink}
          className={`max-h-60 mb-2 rounded-md mx-auto ${
            imageWorks ? "" : "hidden"
          }`}
          onLoad={() => setImageWorks(true)}
          onError={() => setImageWorks(false)}
        />
      )}
      {videoLink && postType === "video" && (
        <video
          src={videoLink}
          className={`max-h-60 mb-2 rounded-md mx-auto ${
            videoWorks ? "" : "hidden"
          }`}
          autoPlay
          muted
          loop
          onLoadedMetadata={() => setVideoWorks(true)}
          onError={() => setVideoWorks(false)}
        />
      )}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Icon
            icon={postType === "text" ? <PencilIcons /> : <PencilIcono />}
            handleClick={() => setPostType("text")}
          />
          <Icon
            icon={postType === "pic" ? <PhotoIcons /> : <PhotoIcono />}
            handleClick={() => setPostType("pic")}
          />
          <Icon
            icon={
              postType === "video" ? <VideoCameraIcons /> : <VideoCameraIcono />
            }
            handleClick={() => setPostType("video")}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blueberry px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap disabled:opacity-50"
          disabled={isDisabled()}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: { session: session },
  };
}
