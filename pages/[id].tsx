import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Post from "@/components/Post";
import TextareaAutosize from "react-textarea-autosize";
import { PostProps, UserProps } from "@/components/Interfaces";
import { FormEvent, useEffect, useState } from "react";
import Comment from "@/components/Comment";

interface IdProps {
  post: PostProps;
  currentUser: UserProps;
  postId: string;
}

export default function Id({ post, currentUser, postId }: IdProps) {
  const [content, setContent] = useState("");
  const [createdComments, setCreatedComments] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const body = { content: content, postId: postId };

    fetch("/api/createComment", { method: "POST", body: JSON.stringify(body) })
      .then((res) => {
        if (!res.ok)
          return res.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        return res.json();
      })
      .then((data) => {
        setCreatedComments((prev) => [...prev, content]);
        setContent("");
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div className="mx-auto max-w-3xl lg:w-[768px] w-auto">
      <Post
        id={post.id}
        userId={post.userId}
        title={post.title}
        content={post.content}
        likes={post.likes}
        user={post.user}
        currentUser={currentUser}
        isTitleClickable={false}
        postType={post.postType}
        createdAt={post.createdAt}
        updatedAt={post.updatedAt}
        _count={post._count}
      />
      <div className="flex flex-col mt-6 gap-4">
        <form
          className="rounded-md bg-snow dark:bg-charcoal p-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <TextareaAutosize
            className="p-2 px-4 rounded-md resize-none block w-full grow bg-snowdrift dark:bg-night"
            placeholder="Write a comment"
            value={content}
            minRows={2}
            required
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="opacity-50 text-xs mt-1 ml-1 text-right mb-2">
            {content.length}/{2000}
          </p>
          <div>
            {error && (
              <span className="mb-3 block text-error text-xs -mt-1">
                {error}
              </span>
            )}
            <button
              type="submit"
              className="rounded-md bg-blueberry w-full px-4 py-2 font-medium text-white uppercase text-sm whitespace-nowrap disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
        {createdComments.reverse().map((comment, index) => (
          <Comment
            key={index}
            user={currentUser}
            text={comment}
            createdAt={new Date()}
          />
        ))}
        {post.comments?.map((comment) => (
          <Comment
            key={comment.id}
            user={comment.user}
            text={comment.content}
            createdAt={new Date(comment.createdAt)}
          />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = context.query.id;
  const session = await getServerSession(context.req, context.res, authOptions);
  const body = { id: postId, session: session };

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/getSinglePost`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();

  const { post, currentUser } = data;

  return { props: { post, currentUser, postId } };
}
