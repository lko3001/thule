import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
    });
    const followings = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
      select: {
        followings: {
          select: {
            followingId: true,
          },
        },
      },
    });

    const followingIds = followings?.followings.map((f) => f.followingId) || [];
    const followingPosts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: true,
        _count: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      message: "successful",
      posts: followingPosts,
      currentUser: prismaUser,
    });
  } catch (err) {
    res.json({ message: err });
  }
};
