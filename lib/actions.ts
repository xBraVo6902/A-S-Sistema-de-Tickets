"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { Status, Ticket } from "@prisma/client";

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

export async function getUserById(id: string) {
  const user = await prisma.person.findUnique({
    where: { id: parseInt(id) },
    include: { assigned: true },
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
