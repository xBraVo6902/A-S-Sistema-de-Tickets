// app/api/dashboard-routes/overview.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ticketsByMonth = await prisma.ticket.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const overviewData = ticketsByMonth.map(ticket => ({
      month: new Date(ticket.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }),
      tickets: ticket._count.createdAt,
    }))

    res.status(200).json(overviewData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching overview data' })
  }
}