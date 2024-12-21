"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import md5 from "md5";
import "dotenv/config";

export async function assignUserToTicket(ticketId: string, userId: string) {
  try {
    await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: { userId: parseInt(userId) },
    });

    revalidatePath(`/admin/ticket/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to assign user:", error);
    return { success: false };
  }
}

export async function updateTicketStatus(ticketId: string, status: Status) {
  try {
    await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: { status: status },
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

export async function searchUserOrClientByRut(rut: string) {
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
    where: { phone: phone },
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

type CreateUserOrClientInput = {
  companyRut?: string;
  rut: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "User" | "Client";
  temporaryToken: string;
  tokenExpiry: Date;
};

export async function generateAvatarUrl(email: string) {
  const hashedEmail = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hashedEmail}?s=256&d=mp`;
}

export async function createUserOrClient(data: CreateUserOrClientInput) {
  try {
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
        temporaryToken: data.temporaryToken,
        tokenExpiry: data.tokenExpiry,
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

export async function getPeople() {
  const people = await prisma.person.findMany();
  return people;
}

export async function getTicketMetadata() {
  const [statuses, types, priorities] = await Promise.all([
    prisma.status.findMany(),
    prisma.type.findMany(),
    prisma.priority.findMany(),
  ]);

  return { statuses, types, priorities };
}
