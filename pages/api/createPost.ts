import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const body = JSON.parse(req.body);

  if (!session)
    return res.status(401).json({ message: "You must be logged in" });

  if (!body.content || !body.title)
    return res.status(400).json({ message: "Both fields must not be empty" });
  if (body.content.length > 64000)
    return res
      .status(400)
      .json({ message: "The post must be under 64000 chars" });
  if (!body.works)
    return res.status(400).json({ message: `Not a valid ${body.postType}` });

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!prismaUser || !prismaUser.id)
    return res.status(400).json({ message: "User not found" });

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      userId: prismaUser.id,
      postType: body.postType,
    },
  });
  res.json({
    message: post,
  });
};
