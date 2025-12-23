import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { studentId, sessionId, eventName, adviceId, properties } = body;
  console.log(body);
  try {
    await prisma.event.create({
      data: {
        studentId,
        sessionId,
        eventName,
        adviceId,
        properties: properties || {},
      },
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}
