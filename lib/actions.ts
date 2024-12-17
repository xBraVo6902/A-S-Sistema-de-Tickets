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
  const client = await prisma.person.findUnique({
    where: { rut: rut },
  });
  return client;
}
