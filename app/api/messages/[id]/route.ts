import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (session?.user.role !== "Client" && session?.user.role !== "User") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const content = await request.json();
    const personId = parseInt(session.user?.id as string);
    const ticketId = parseInt(
      request.headers.get("referer")?.split("/").pop() as string
    );

    const body = { content, personId, ticketId };

    const messageSchema = z.object({
      content: z.string().min(1, "Content is required"),
      personId: z.number().positive("Person ID is required"),
      ticketId: z.number().positive("Ticket ID is required"),
    });

    const parsedBody = messageSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error.errors), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    await prisma.message.create({
      data: {
        content: parsedBody.data.content,
        person: { connect: { id: parsedBody.data.personId } },
        ticket: { connect: { id: parsedBody.data.ticketId } },
      },
    });

    return new Response(
      JSON.stringify({ message: "Mensaje creado con éxito" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al crear el mensaje" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

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

  if (session?.user.role !== "Client" && session?.user.role !== "User") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const ticketId = parseInt(params.id);

    const ticketSchema = z.object({
      ticketId: z.number().positive("Ticket ID is required"),
    });

    const parsedTicket = ticketSchema.safeParse({ ticketId });

    if (!parsedTicket.success) {
      return new Response(JSON.stringify(parsedTicket.error.errors), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const messages = await prisma.message.findMany({
      where: { ticketId: parsedTicket.data.ticketId },
      select: {
        id: true,
        content: true,
        person: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const formattedMessages = messages.map((message) => {
      return {
        ...message,
        createdAt: new Date(message.createdAt).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date(message.updatedAt).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    return new Response(JSON.stringify(formattedMessages), {
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
