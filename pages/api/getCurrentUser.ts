import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });
    res.json({ message: "successful", user: currentUser });
  }
};
