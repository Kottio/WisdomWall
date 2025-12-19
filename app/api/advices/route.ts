import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET() {
  const advices = await prisma.advice.findMany({
    include: {
      student: {
        select: {
          id: true,
          username: true,
          position: true,
          linkedinUrl: true,
          gitHubUrl: true,
        },
      },
      likes: true,
      comments: {
        include: {
          student: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ advices });
}
