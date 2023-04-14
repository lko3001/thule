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
    console.log(prismaUser?.id, body.followingId);
    if (prismaUser && prismaUser.id) {
      const followedUser = await prisma.follow.create({
        data: {
          followerId: prismaUser.id,
          followingId: body.followingId,
        },
      });
    }
  }
};
