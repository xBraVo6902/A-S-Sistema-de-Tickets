// pages/api/tickets/stats.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ticketStats = await prisma.ticket.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    const statsData = ticketStats.map(stat => ({
      name: stat.status,
      value: stat._count.status,
    }))

    res.status(200).json(statsData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching ticket stats' })
  }
}