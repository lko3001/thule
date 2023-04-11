import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Post from "@/components/Post";
import { PostProps, UserProps } from "@/components/Interfaces";
import { FormEvent, useEffect, useRef, useState } from "react";
import settingsInput from "../../data/settingsInput.json";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";
import TextareaAutosize from "react-textarea-autosize";
import { useRouter } from "next/router";
import { Comment as CommentInterface } from "@prisma/client";
import Comment from "@/components/Comment";

interface ExtendedComments extends CommentInterface {
  post: PostProps;
}

interface ExtendedUser extends UserProps {
  posts: PostProps[];
  comments: ExtendedComments[];
}

type Inputs = {
  [key: string]: string;
};

interface IdProps {
  user: ExtendedUser;
  isMe: boolean;
  currentUser: UserProps;
}
type Tabs = "posts" | "comments";

export default function Id({ user, isMe, currentUser }: IdProps) {
  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTabs, setSelectedTabs] = useState<Tabs>("posts");
  const [inputs, setInputs] = useState<Inputs>({
    picture: user.image || "",
    username: user.username,
    name: user.name || "",
    biography: user.biography || "",
  });

  const profileTabs: Tabs[] = ["posts", "comments"];
  const router = useRouter();

  function handleFollow() {
    fetch("/api/followUser", {
      method: "POST",
      body: JSON.stringify({ followingId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  function handleSettings() {
    setAreSettingsOpen((prev) => !prev);
  }
  function handleSubmit() {
    setIsLoading(true);
    fetch("/api/updateUser", { method: "POST", body: JSON.stringify(inputs) })
      .then((res) => {
        if (!res.ok)
          return res.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        return res.json();
      })
      .then((data) => {
        router.reload();
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }

  if (!user) return <h1>user Not found</h1>;

  if (areSettingsOpen)
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-0">
        <div className="flex flex-row items-center gap-4 mb-4">
          <Icon icon={<ArrowLeftIcon />} handleClick={handleSettings} />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <h2 className="text-lg font-medium mb-2">Edit Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="bg-snow dark:bg-charcoal p-2 rounded-md">
            {settingsInput.map((el) => (
              <div key={el.inputId} className="mb-3">
                <label
                  htmlFor={el.inputId}
                  className="block capitalize text-sm opacity-50 mb-1"
                >
                  {el.label}
                </label>
                <TextareaAutosize
                  name={el.inputId}
                  maxRows={100}
                  id={el.inputId}
                  placeholder={el.placeholder}
                  disabled={isLoading}
                  required={el.inputId === "biography" ? false : true}
                  className="p-2 resize-none disabled:opacity-50 px-4 rounded-md block w-full grow bg-snowdrift dark:bg-night invalid:outline-error focus:outline outline-transparent outline-2"
                  value={inputs[el.inputId]}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [el.inputId]: e.target.value,
                    }))
                  }
                />
                {el.inputId === "username" && (
                  <p className="opacity-50 text-xs mt-1 ml-1">
                    At least 3 characters, the valid characters are lowercase
                    and uppercase letters, numbers, underscores and dashes
                  </p>
                )}
                {el.inputId !== "picture" && (
                  <p className="opacity-50 text-xs mt-1 ml-1 text-right">
                    {inputs[el.inputId].length}/{el.maxLength}
                  </p>
                )}
              </div>
            ))}
          </div>
          {error && <p className="text-error text-xs mt-1 ml-1">{error}</p>}
          <div className="text-right mt-3">
            <button
              disabled={isLoading}
              type="submit"
              className="rounded-md disabled:opacity-50 bg-blueberry px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap"
            >
              Save
            </button>
          </div>
        </form>
        <h2 className="text-lg font-medium mb-2">Account</h2>
        <div className="bg-snow dark:bg-charcoal p-2 rounded-md flex flex-row items-center justify-between pl-4">
          <p>Sign Out</p>
          <button
            disabled={isLoading}
            type="submit"
            className="rounded-md disabled:opacity-50 bg-error px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap"
          >
            signout
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 lg:px-0 mt-4 md:mt-0">
        <div className="flex flex-row justify-between items-end mb-4">
          <img
            src={user.image || "http://unsplash.it/500/500"}
            className="rounded-md h-24 w-24 object-cover"
          />
          <button
            onClick={isMe ? handleSettings : handleFollow}
            className="rounded-md bg-blueberry px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap"
          >
            {isMe ? "Settings" : "Follow"}
          </button>
        </div>
        <h1 className="text-lg font-semibold">{user.name}</h1>
        <span className="opacity-50 mb-2 block">@{user.username}</span>
        {user.biography && (
          <div className="text-sm whitespace-pre-wrap">{user.biography}</div>
        )}
        <div className="mt-6 mb-3 flex flex-row gap-4">
          {profileTabs.map((tab) => (
            <span
              key={tab}
              className={`text-sm grow font-medium text-center opacity-50 capitalize hover:opacity-100 cursor-pointer transition-opacity duration-150 ${
                tab === selectedTabs && "underline !opacity-100 cursor-text"
              }`}
              tabIndex={0}
              onClick={() => setSelectedTabs(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {selectedTabs === "posts" &&
            user.posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                userId={post.userId}
                title={post.title}
                content={post.content}
                likes={post.likes}
                user={post.user}
                currentUser={currentUser}
                postType={post.postType}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                _count={post._count}
              />
            ))}
          {selectedTabs === "comments" &&
            user.comments.map((comment) => (
              <Comment
                key={comment.id}
                user={user}
                text={comment.content}
                createdAt={new Date(comment.createdAt)}
                postToLink={comment.post}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userId = context.query.id;
  const session = await getServerSession(context.req, context.res, authOptions);
  const body = { id: userId };

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/getSingleUser`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();

  const { user, currentUser } = data;

  const isMe = session?.user?.email === user?.email ? true : false;

  return { props: { user, isMe, currentUser } };
}
