import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
      include: {
        _count: true,
      },
    });

    console.log(prismaUser);
    const allPosts = await prisma.post.findMany({
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
      posts: allPosts,
      currentUser: prismaUser,
    });
  } catch (err) {
    res.json({ message: err });
  }
};
