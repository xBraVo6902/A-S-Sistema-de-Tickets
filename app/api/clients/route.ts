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

  if (session.user.role !== "Admin") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const whereCondition: Prisma.PersonWhereInput = { role: "Client" };

    const rut = searchParams.get("rut");
    if (rut) {
      whereCondition.rut = rut;
    }

    const clients = await prisma.person.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        rut: true,
        companyRut: true,
      },
    });

    if (clients.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron clientes" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(clients), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener los clientes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
