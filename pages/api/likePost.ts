import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

interface BodyProps {
  postId: string;
  likeId: string | null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const body = JSON.parse(req.body);

  if (session) {
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });

    if (prismaUser && prismaUser.id) {
      if (body.likeId) {
        const like = await prisma.like.delete({
          where: {
            id: body.likeId,
          },
        });
        res.json({
          message: like,
        });
      } else {
        const like = await prisma.like.create({
          data: {
            postId: body.postId,
            userId: prismaUser.id,
          },
        });
        res.json({
          message: like,
        });
      }
    }
  }
};
