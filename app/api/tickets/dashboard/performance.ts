// api/performance.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const technicians = await prisma.person.findMany({
      where: {
        role: 'User',
      },
      select: {
        name: true,
        _count: {
          select: {
            assigned: true,
          },
        },
        assigned: {
          select: {
            status: true,
          },
        },
      },
    })

    const technicianData = technicians.map(technician => ({
      name: technician.name,
      completed: technician.assigned.filter(ticket => ticket.status === 'Closed').length,
      pending: technician.assigned.filter(ticket => ticket.status !== 'Closed').length,
    }))

    res.status(200).json(technicianData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching technician performance' })
  }
}