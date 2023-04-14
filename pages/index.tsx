import Post from "@/components/Post";
import { useEffect, useState } from "react";
import { PostProps, UserProps } from "@/components/Interfaces";
import LoadingPosts from "@/components/LoadingPosts";
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [selectedTabs, setSelectedTabs] = useState<"following" | "explore">(
    "explore"
  );
  const [currentUser, setCurrentUser] = useState<UserProps>({} as UserProps);
  const postsToMap = { following: followingPosts, explore: posts };
  useEffect(() => {
    fetchAllPosts();
  }, [selectedTabs]);

  function fetchAllPosts() {
    console.log("Fetching all posts");

    fetch("/api/getAllPosts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setCurrentUser(data.currentUser);
      });
  }
  function fetchFollowingPosts() {
    console.log("YEEEEEE");
    fetch("/api/getFollowingPosts")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowingPosts(data.posts);
        setCurrentUser(data.currentUser);
      });
  }

  const profileTabs: ["following", "explore"] = ["following", "explore"];

  return (
    <>
      <section className="max-w-3xl lg:w-[768px] w-auto md:mx-auto mx-2">
        <div className="mb-3 flex flex-row items-center">
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
          {postsToMap[selectedTabs].length !== 0 ? (
            postsToMap[selectedTabs].map((post) => {
              return (
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
              );
            })
          ) : currentUser._count?.followings === 0 ? (
            <div className="dark:bg-charcoal px-8 bg-snow rounded-md flex flex-col items-center justify-center py-20">
              <h2 className="font-medium text-xl">
                You are not following anyone
              </h2>
              <p className="opacity-50 mb-4 text-center">
                Discover new accounts in the explore page
              </p>
              <button
                className="rounded-md bg-blueberry px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap"
                onClick={() => setSelectedTabs("explore")}
              >
                Explore
              </button>
            </div>
          ) : session.status !== "unauthenticated" ? (
            <LoadingPosts />
          ) : (
            <div className="dark:bg-charcoal px-8 bg-snow rounded-md flex flex-col items-center justify-center py-20">
              <h2 className="font-medium text-xl">You are not authenticated</h2>
              <p className="opacity-50 mb-4 text-center">
                Please sign in to view the posts of the users you are following
              </p>
              <button
                className="rounded-md bg-blueberry px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap"
                onClick={() => signIn()}
              >
                sign in
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
