import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import prisma from "@/prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const body = JSON.parse(req.body);

  if (!session)
    return res.status(401).json({ message: "You must be logged in" });

  if (!body.picture || !body.username || !body.name)
    return res.status(400).json({ message: "Please fill out the fields" });

  if (body.username.length > 30)
    return res
      .status(400)
      .json({ message: "Username must be under 30 characters" });
  if (body.name.length > 64)
    return res
      .status(400)
      .json({ message: "Name must be under 64 characters" });
  if (body.biography.length > 200)
    return res
      .status(400)
      .json({ message: "Biography must be under 200 characters" });

  const regex = /^[a-zA-Z0-9_-]{3,}$/;
  if (!body.username.match(regex))
    return res
      .status(400)
      .json({ message: "Username does not follow required pattern" });
  try {
    const post = await prisma.user.update({
      where: { email: session.user?.email! },
      data: {
        image: body.picture,
        username: body.username,
        name: body.name,
        biography: body.biography,
      },
    });
    res.json({
      message: post,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2000")
        return res
          .status(400)
          .json({ message: "The field content is too long" });
    }
    return res
      .status(400)
      .json({ message: "Oops! An error occurred. Plase try again" });
  }
};
