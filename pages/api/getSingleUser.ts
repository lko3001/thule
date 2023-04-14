import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);

  const prismaUser = await prisma.user.findUnique({
    where: { email: body.session?.user?.email || "" },
    include: {
      followings: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: body.id || "" },
    include: {
      posts: {
        include: {
          likes: true,
          user: true,
          _count: true,
        },
      },
      comments: { include: { post: true } },
    },
  });

  res.json({
    message: "successful",
    user: user,
    currentUser: prismaUser,
  });
};
