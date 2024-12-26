import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { getTicketMetadata } from "@/lib/actions";

export async function POST(request: Request) {
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

  if (session?.user.role !== "Client" && session?.user.role !== "Admin") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    const finalClientId = clientId
      ? parseInt(clientId)
      : parseInt(session?.user?.id || "0");

    const ticketSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(
        ticketMetadata.types.map((t) => t.name) as [string, ...string[]]
      ),
      priority: z.enum(
        ticketMetadata.priorities.map((p) => p.name) as [string, ...string[]]
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
      where: { id: finalClientId },
    });

    if (client?.role !== "Client") {
      return new Response(
        JSON.stringify({ message: "El ID del cliente no es válido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const typeId = ticketMetadata.types.find((t) => t.name === type)?.id;
    const priorityId = ticketMetadata.priorities.find(
      (p) => p.name === priority
    )?.id;
    const statusId = ticketMetadata.statuses.find(
      (s) => s.name === "Abierto"
    )?.id;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        type: { connect: { id: typeId } },
        priority: { connect: { id: priorityId } },
        status: { connect: { id: statusId } },
        client: { connect: { id: finalClientId } },
      },
    });

    return new Response(
      JSON.stringify({ message: "Ticket creado con éxito", ticket }),
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
    const clientId = searchParams.get("clientId");
    const userId = searchParams.get("userId");

    const tickets = await prisma.ticket.findMany({
      where:
        clientId || userId
          ? { client: { id: parseInt(clientId || userId || "0") } }
          : {},
      select: {
        id: true,
        title: true,
        type: {
          select: { id: true, name: true, hexColor: true, lucideIcon: true },
        },
        status: {
          select: { id: true, name: true, hexColor: true, lucideIcon: true },
        },
        priority: {
          select: { id: true, name: true, hexColor: true, lucideIcon: true },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(tickets), {
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
