// api/recent.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const recentTickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Obtener los 5 tickets más recientes
    })

    const formattedTickets = recentTickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      date: new Date(ticket.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }))

    res.status(200).json(formattedTickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching recent tickets' })
  }
}
