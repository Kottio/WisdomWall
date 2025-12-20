import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { adviceId: string } }
) {
  try {
    const { studentId } = await request.json();
    const param = await params;
    const adviceId = parseInt(param.adviceId);

    const existingLike = await prisma.adviceLike.findUnique({
      where: {
        studentId_adviceId: {
          studentId: studentId,
          adviceId: adviceId,
        },
      },
    });
    if (existingLike) {
      await prisma.adviceLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      await prisma.adviceLike.create({
        data: {
          studentId: studentId,
          adviceId: adviceId,
        },
      });
      return NextResponse.json({ liked: true }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
