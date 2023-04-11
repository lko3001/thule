import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const body = JSON.parse(req.body);

  if (!session)
    return res.status(401).json({ message: "You must be logged in" });

  if (!body.content)
    return res.status(400).json({ message: "Content field must not be empty" });
  if (body.content.length > 2000)
    return res
      .status(400)
      .json({ message: "The comment must be under 2000 chars" });

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!prismaUser || !prismaUser.id)
    return res.status(400).json({ message: "User not found" });

  const comment = await prisma.comment.create({
    data: {
      content: body.content,
      postId: body.postId,
      userId: prismaUser.id,
    },
  });
  res.json({
    message: comment,
  });
};
