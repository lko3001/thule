import { Post, User, Like, Comment } from "@prisma/client";
import { ReactNode } from "react";

export interface PostProps extends Post {
  postType: "pic" | "video" | "text";
  user: User;
  currentUser: User;
  likes: Like[];
  comments?: CommentProps[];
  _count: { likes: number; comments: number };
  isTitleClickable?: boolean;
}

export interface UserProps extends User {
  _count?: {
    accounts: number;
    sessions: number;
    posts: number;
    likes: number;
    comments: number;
    followers: number;
    followings: number;
  };
}

export interface IconProps {
  link?: string;
  handleClick?: () => void;
  icon: ReactNode;
  parent?: string;
  child?: string;
  buttonType?: "button" | "submit" | "reset" | undefined;
}

export interface CommentProps extends Comment {
  user: User;
}
