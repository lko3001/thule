import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);

  const prismaUser = await prisma.user.findUnique({
    where: { email: body.session?.user?.email || "" },
  });
  const singlePost = await prisma.post.findUnique({
    where: {
      id: body.id,
    },
    include: {
      likes: true,
      user: true,
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      _count: true,
    },
  });
  res.json({
    message: "successful",
    post: singlePost,
    currentUser: prismaUser,
  });
};
