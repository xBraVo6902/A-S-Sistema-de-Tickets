import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const secretKey = process.env.JWT_SECRET_KEY || 'mysecretkey';

export async function PUT(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ message: 'Token y nueva contraseña son requeridos' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { email: string };
    const email = decoded.email;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const prisma = new PrismaClient();
    await prisma.person.update({
      where: {
        email
      },
      data: {
        password: hashedPassword
      }
    });


    return NextResponse.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 400 });
  }
}
 