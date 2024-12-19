import { authOptions } from "@/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const whereCondition: Prisma.PersonWhereInput =
      buildWhereCondition(searchParams);

    const users = await prisma.person.findMany({
      where: whereCondition,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener los usuarios" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { id, firstName, lastName, email, phone } = body;

    if (!id || !firstName || !lastName || !email || !phone) {
      return new Response(JSON.stringify({ message: "Datos incompletos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedUser = await prisma.person.update({
      where: { id: Number(id) }, // Asegúrate de que el ID sea del tipo correcto
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al actualizar el usuario" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function buildWhereCondition(searchParams: URLSearchParams) {
  const whereCondition: Prisma.PersonWhereInput = { role: "User" };

  const firstName = searchParams.get("firstName");
  if (firstName) {
    whereCondition.firstName = { contains: firstName };
  }

  return whereCondition;
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ message: "ID no proporcionado" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.ticket.deleteMany({
      where: { clientId: Number(id) },
    });

    await prisma.person.delete({
      where: { id: Number(id) },
    });

    return new Response(
      JSON.stringify({ message: "Usuario eliminado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al eliminar el usuario" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
