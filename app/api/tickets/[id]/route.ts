import { authOptions } from "@/auth";
import { getTicketMetadata } from "@/lib/actions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const [session, ticketMetadata] = await Promise.all([
    getServerSession(authOptions),
    getTicketMetadata(),
  ]);

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
        statusId: true,
        typeId: true,
        priorityId: true,
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
      },
    });

    if (!ticket) {
      return new Response(JSON.stringify({ message: "Ticket not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const translatedTicket = {
      ...ticket,
      priority: ticketMetadata.priorities[ticket.priorityId],
      status: ticketMetadata.statuses[ticket.statusId],
      type: ticketMetadata.types[ticket.typeId],
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

    return new Response(JSON.stringify(translatedTicket), {
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
