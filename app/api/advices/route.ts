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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { advice, studentId } = body;

    console.log(body);

    const newAdvice = await prisma.advice.create({
      data: {
        message: advice.message,
        category: advice.category,
        resourceUrl: advice.resourceUrl,
        studentId: studentId,
      },
    });
    if (newAdvice) {
      return NextResponse.json({ data: newAdvice }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }
}
