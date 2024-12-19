import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function PUT(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json(
      { message: "Token y nueva contraseña son requeridos" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.person.findFirst({
      where: {
        temporaryToken: token,
        tokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.person.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        temporaryToken: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Contraseña restablecida correctamente",
    });
  } catch (error) {
    console.error("Failed to reset password:", error);
    return NextResponse.json(
      { message: "Token inválido o expirado" },
      { status: 400 }
    );
  }
}
