import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { Priority, Type, Status, Prisma } from "@prisma/client";
import { ticketMetadata } from "@/prisma/ticketMetadata";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (session?.user.role !== "Client" && session?.user.role !== "Admin") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const clientRut = searchParams.get("clientRut");
    const clientId = searchParams.get("clientId");

    let finalClientId: number;

    if (clientRut) {
      // Si se proporciona RUT, buscar el cliente por RUT
      const client = await prisma.person.findUnique({
        where: { rut: clientRut },
      });

      if (!client) {
        return new Response(
          JSON.stringify({
            message: "No se encontró el cliente con el RUT especificado",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      finalClientId = client.id;
    } else if (clientId) {
      // Si se proporciona ID, usarlo directamente
      finalClientId = parseInt(clientId);
    } else {
      // Si no se proporciona ninguno, usar el ID del usuario de la sesión
      finalClientId = parseInt(session.user.id as string);
    }

    const ticketSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(Object.keys(ticketMetadata.type) as [string, ...string[]]),
      priority: z.enum(
        Object.keys(ticketMetadata.priority) as [string, ...string[]]
      ),
    });

    const parsedBody = ticketSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error.errors), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { title, description, type, priority } = parsedBody.data;

    const client = await prisma.person.findUnique({
      where: { id: clientId },
    });
    console.log(client);

    if (client?.role !== "Client") {
      return new Response(
        JSON.stringify({ message: "El ID del cliente no es válido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.ticket.create({
      data: {
        title,
        description,
        type: capitalize(type) as Type,
        priority: capitalize(priority) as Priority,
        client: { connect: { id: finalClientId } },
      },
    });

    return new Response(
      JSON.stringify({ message: "Ticket creado con éxito" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al crear el ticket" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

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
    const whereCondition: Prisma.TicketWhereInput =
      buildWhereCondition(searchParams);

    const tickets = await prisma.ticket.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    const translatedTickets = tickets.map((ticket) => {
      return {
        ...ticket,
        status: {
          value: ticket.status,
          ...ticketMetadata.status[ticket.status],
        },
        type: {
          value: ticket.type,
          ...ticketMetadata.type[ticket.type],
        },
        priority: {
          value: ticket.priority,
          ...ticketMetadata.priority[ticket.priority],
        },
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
    });

    return new Response(JSON.stringify(translatedTickets), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener los tickets" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function buildWhereCondition(searchParams: URLSearchParams) {
  const whereCondition: Prisma.TicketWhereInput = {};

  const status = searchParams.get("status")?.toLowerCase();
  if (status) {
    whereCondition.status = capitalize(status) as Status;
  }

  const priority = searchParams.get("priority")?.toLowerCase();
  if (priority) {
    whereCondition.priority = capitalize(priority) as Priority;
  }

  const type = searchParams.get("type")?.toLowerCase();
  if (type) {
    whereCondition.type = capitalize(type) as Type;
  }

  const assigned = searchParams.get("assigned");
  if (assigned === "true") {
    whereCondition.userId = { not: null };
  } else if (assigned === "false") {
    whereCondition.userId = null;
  }

  const clientId = searchParams.get("clientId");
  if (clientId) {
    whereCondition.clientId = parseInt(clientId);
  }

  const userId = searchParams.get("userId");
  if (userId) {
    whereCondition.userId = parseInt(userId);
  }

  const createdFrom = searchParams.get("createdFrom");
  const createdTo = searchParams.get("createdTo");
  if (createdFrom || createdTo) {
    whereCondition.createdAt = {
      ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
      ...(createdTo ? { lte: new Date(createdTo) } : {}),
    };
  }

  const updatedFrom = searchParams.get("updatedFrom");
  const updatedTo = searchParams.get("updatedTo");
  if (updatedFrom || updatedTo) {
    whereCondition.updatedAt = {
      ...(updatedFrom ? { gte: new Date(updatedFrom) } : {}),
      ...(updatedTo ? { lte: new Date(updatedTo) } : {}),
    };
  }

  const keyword = searchParams.get("keyword");
  if (keyword) {
    whereCondition.OR = [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }

  return whereCondition;
}
