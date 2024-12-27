import { authOptions } from "@/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        description: true,
        status: {
          select: { id: true, name: true, lucideIcon: true, hexColor: true },
        },
        type: {
          select: { id: true, name: true, lucideIcon: true, hexColor: true },
        },
        priority: {
          select: { id: true, name: true, lucideIcon: true, hexColor: true },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        notes: {
          select: {
            createdAt: true,
            prevValue: true,
            newValue: true,
            type: true,
          },
        },
      },
    });

    if (!ticket) {
      return new Response(JSON.stringify({ message: "Ticket not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const localizedTicket = {
      ...ticket,
      createdAt: new Date(ticket.createdAt).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date(ticket.updatedAt).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    return new Response(JSON.stringify(localizedTicket), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener el ticket" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
