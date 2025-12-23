import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { adviceId: string } }
) {
  const { newComment, studentId } = await request.json();
  const para = await params;
  const adviceId = parseInt(para.adviceId);

  const data = await prisma.adviceComment.create({
    data: {
      text: newComment,
      studentId: studentId,
      adviceId: adviceId,
    },
  });
  if (data) {
    console.log("posted");
    return NextResponse.json({ status: 201, commentId: data.id });
  } else {
    return NextResponse.json({ status: 400 });
  }
}
