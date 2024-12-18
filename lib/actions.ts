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

export async function getUsers() {
  const users = await prisma.person.findMany({
    where: { role: "User" },
  });
  const usersWithTicketCount = await Promise.all(
    users.map(async (user) => {
      const ticketCount = await prisma.ticket.count({
        where: { userId: user.id },
      });
      return { ...user, ticketCount };
    })
  );

  return usersWithTicketCount.map((user) => ({
    id: user.id,
    name: user.firstName + " " + user.lastName,
    rut: user.rut,
    email: user.email,
    assignedTickets: user.ticketCount,
  }));
}
