"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import md5 from "md5";
import "dotenv/config";
import emailService from "@/services/emailService";
import crypto from "crypto";
import { Ticket } from "@prisma/client";
import { emailQueue } from "@/services/queueService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function validateClientTicketOwnership(
  ticketId: string,
  clientEmail: string
) {
  const client = await prisma.person.findUnique({
    where: { email: clientEmail },
  });
  if (!client) {
    return false;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(ticketId), clientId: client.id },
  });

  return !!ticket;
}

export async function validateUserTicketOwnership(
  ticketId: string,
  userEmail: string
) {
  const user = await prisma.person.findUnique({
    where: { email: userEmail },
  });
  if (!user) {
    return false;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(ticketId), userId: user.id },
  });

  return !!ticket;
}

export async function assignUserToTicket(ticketId: string, userId: string) {
  try {
    const [ticket, user] = await Promise.all([
      prisma.ticket.findUnique({
        where: { id: parseInt(ticketId) },
        include: { type: true, priority: true, status: true, user: true },
      }),
      prisma.person.findUnique({
        where: { id: parseInt(userId) },
      }),
    ]);

    if (!ticket || !user) {
      return { success: false };
    }

    const prevUser = ticket.user
      ? `${ticket.user.firstName} ${ticket.user.lastName}`
      : "Sin asignar";
    const newUser = `${user.firstName} ${user.lastName}`;

    await Promise.all([
      prisma.note.create({
        data: {
          prevValue: prevUser,
          newValue: newUser,
          type: "user-change",
          ticketId: parseInt(ticketId),
        },
      }),
      prisma.ticket.update({
        where: { id: parseInt(ticketId) },
        data: { userId: parseInt(userId) },
      }),
    ]);

    emailQueue.add({
      type: "ticket-assigned",
      to: user.email,
      data: {
        ticketId: ticketId,
        firstName: user.firstName,
        title: ticket.title,
        description: ticket.description,
        status: {
          name: ticket.status.name,
          hexColor: ticket.status.hexColor,
        },
        priority: {
          name: ticket.priority.name,
          hexColor: ticket.priority.hexColor,
        },
        type: {
          name: ticket.type.name,
          hexColor: ticket.type.hexColor,
        },
        ticketLink: `${process.env.NEXT_PUBLIC_BASE_URL}/user/ticket/${ticketId}`,
      },
    });

    revalidatePath(`/admin/ticket/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to assign user:", error);
    return { success: false };
  }
}

export async function updateTicketStatus(ticketId: string, statusId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) },
      include: { client: true, status: true },
    });
    if (!ticket) {
      return { success: false };
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: { statusId: parseInt(statusId) },
      include: { status: true },
    });

    const prevStatus = ticket.status;
    const newStatus = updatedTicket.status;

    await prisma.note.create({
      data: {
        prevValue: prevStatus.name,
        newValue: newStatus.name,
        type: "status-change",
        ticketId: parseInt(ticketId),
      },
    });

    emailQueue.add({
      type: "status-change",
      to: ticket.client.email,
      data: {
        firstName: ticket.client.firstName,
        ticketId: ticketId,
        title: ticket.title,
        prevStatus: {
          name: ticket.status.name,
          hexColor: ticket.status.hexColor,
        },
        newStatus: {
          name: updatedTicket.status.name,
          hexColor: updatedTicket.status.hexColor,
        },
        ticketLink: `${process.env.NEXT_PUBLIC_BASE_URL}/client/ticket/${ticketId}`,
      },
    });

    revalidatePath(`/admin/ticket/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false };
  }
}

export async function searchClientByRut(rut: string) {
  try {
    const client = await prisma.person.findUnique({
      where: { rut: rut, role: "Client" },
    });
    return client;
  } catch (error) {
    console.error("Failed to search client:", error);
    return null;
  }
}

export async function searchPersonByRut(rut: string) {
  try {
    const person = await prisma.person.findUnique({
      where: { rut: rut },
    });
    return person;
  } catch (error) {
    console.error("Failed to search person:", error);
    return null;
  }
}

export async function emailExists(email: string) {
  const user = await prisma.person.findFirst({
    where: { email: email },
  });

  return !!user;
}

export async function phoneExists(phone: string) {
  const user = await prisma.person.findFirst({
    where: { phone: "569" + phone },
  });

  return !!user;
}

export async function getUserById(id: string) {
  const user = await prisma.person.findUnique({
    where: { id: parseInt(id) },
    include: { assigned: true, created: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getUsers() {
  const users = await prisma.person.findMany({
    where: { role: "User" },
    include: { assigned: true },
  });

  return users;
}

export async function getClients() {
  const clients = await prisma.person.findMany({
    where: { role: "Client" },
    include: { created: true },
  });

  return clients;
}

type CreatePersonInput = {
  companyRut?: string;
  rut: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "User" | "Client";
};

export async function generateAvatarUrl(email: string) {
  const hashedEmail = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hashedEmail}?s=256&d=mp`;
}

export async function createPerson(data: CreatePersonInput) {
  try {
    const temporaryToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.person.create({
      data: {
        companyRut: data.companyRut,
        rut: data.rut,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: await generateAvatarUrl(data.email),
        temporaryToken,
        tokenExpiry,
      },
    });

    emailQueue.add({
      type: "create-password",
      to: data.email,
      data: {
        firstName: data.firstName,
        createLink: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${temporaryToken}&firstLogin=true`,
      },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/clientes");
    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
}

type CreateTicketInput = {
  rut: string;
  title: string;
  description: string;
  type: string;
  priority: string;
};

export async function createTicket(data: CreateTicketInput, isAdmin: boolean) {
  try {
    let clientId;
    if (isAdmin) {
      const client = await prisma.person.findFirst({
        where: { rut: data.rut, role: "Client" },
      });
      if (!client) {
        return null;
      }
      clientId = client.id;
    } else {
      const session = await getServerSession(authOptions);
      if (!session) {
        return null;
      }
      clientId = session.user.id;
    }

    const [type, priority, status, client] = await Promise.all([
      prisma.type.findFirst({ where: { name: data.type } }),
      prisma.priority.findFirst({ where: { name: data.priority } }),
      prisma.status.findFirst({ where: { name: "Abierto" } }),
      prisma.person.findUnique({ where: { id: parseInt(clientId as string) } }),
    ]);

    if (!type || !priority || !status || !client) {
      return null;
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        type: { connect: { id: type.id } },
        priority: { connect: { id: priority.id } },
        status: { connect: { id: status.id } },
        client: { connect: { id: parseInt(clientId as string) } },
      },
    });

    if (isAdmin) {
      emailQueue.add({
        type: "ticket-created",
        to: client.email,
        data: {
          ticketId: ticket.id.toString(),
          firstName: client.firstName,
          title: ticket.title,
          description: ticket.description,
          status: { name: status.name, hexColor: status.hexColor },
          type: { name: type.name, hexColor: type.hexColor },
          priority: { name: priority.name, hexColor: priority.hexColor },
          ticketLink: `${process.env.NEXT_PUBLIC_BASE_URL}/client/ticket/${ticket.id}`,
        },
      });
    }

    revalidatePath("/admin/tickets");
    revalidatePath("/client/mis-tickets/");
    return ticket;
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return null;
  }
}

export async function createMessage(
  content: string,
  ticketId: string,
  userId: string | null
) {
  try {
    if (!userId) {
      return null;
    }
    const message = await prisma.message.create({
      data: {
        content,
        ticket: { connect: { id: parseInt(ticketId) } },
        user: { connect: { id: parseInt(userId) } },
      },
    });
    if (!message) {
      return null;
    }

    revalidatePath(`/admin/ticket/${ticketId}`);
    revalidatePath(`/user/ticket/${ticketId}`);
    revalidatePath(`/client/ticket/${ticketId}`);
  } catch (error) {
    console.error("Failed to create note:", error);
    return null;
  }
}

export async function getPeople() {
  const people = await prisma.person.findMany();
  return people;
}

export async function getTicketMetadata() {
  const [statuses, types, priorities] = await Promise.all([
    prisma.status.findMany({ orderBy: { order: "asc" } }),
    prisma.type.findMany(),
    prisma.priority.findMany({ orderBy: { order: "asc" } }),
  ]);

  return { statuses, types, priorities };
}

export async function getTicketsByUserId(userId: string) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: parseInt(userId) },
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
        client: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return tickets;
  } catch (error) {
    console.error("Failed to get tickets by person id:", error);
    return [];
  }
}

export async function getTicketsByClientId(clientId: string) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { clientId: parseInt(clientId) },
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
        client: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return tickets;
  } catch (error) {
    console.error("Failed to get tickets by person id:", error);
    return [];
  }
}

export async function sendResetEmail(email: string) {
  try {
    const person = await prisma.person.findUnique({
      where: { email },
    });
    if (!person) {
      return { success: false };
    }
    const temporaryToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.person.update({
      where: { id: person.id },
      data: { temporaryToken, tokenExpiry },
    });

    emailQueue.add({
      type: "reset-password",
      to: email,
      data: {
        firstName: person.firstName,
        resetLink: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${temporaryToken}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return { success: false };
  }
}

export async function sendTicketCreatedEmail(ticket: Ticket) {
  try {
    const [client, type, priority, status] = await Promise.all([
      prisma.person.findUnique({
        where: { id: ticket.clientId },
      }),
      prisma.type.findUnique({
        where: { id: ticket.typeId },
      }),
      prisma.priority.findUnique({
        where: { id: ticket.priorityId },
      }),
      prisma.status.findUnique({
        where: { id: ticket.statusId },
      }),
    ]);

    if (!client || !type || !priority || !status) {
      return { success: false };
    }

    await emailService.sendTicketCreatedEmail(client.email, {
      ticketId: ticket.id.toString(),
      firstName: client.firstName,
      title: ticket.title,
      description: ticket.description,
      status: { name: status.name, hexColor: status.hexColor },
      type: { name: type.name, hexColor: type.hexColor },
      priority: { name: priority.name, hexColor: priority.hexColor },
      ticketLink: `${process.env.NEXT_PUBLIC_BASE_URL}/client/ticket/${ticket.id}`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send ticket created email:", error);
    return { success: false };
  }
}
