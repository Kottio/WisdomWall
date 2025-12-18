import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { username, position, linkedinUrl, gitHubUrl } = body;

    if (!username || !position) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur et le poste sont requis" },
        { status: 400 }
      );
    }

    // Check if student profile already exists
    const existingStudent = await prisma.student.findUnique({
      where: { userId: session.user.id },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Un profil existe déjà pour cet utilisateur" },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingUsername = await prisma.student.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris" },
        { status: 400 }
      );
    }

    // Create student profile
    const student = await prisma.student.create({
      data: {
        username,
        position,
        linkedinUrl,
        gitHubUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error("Error creating student profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du profil" },
      { status: 500 }
    );
  }
}
