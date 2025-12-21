import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { adviceId: string } }
) {
  const { newComment, studentId } = await request.json();
  const para = await params;
  const { adviceId } = para;

  console.log(newComment, studentId, adviceId);

  return NextResponse.json({ status: 201 });
}
