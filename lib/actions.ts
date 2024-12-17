"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

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
