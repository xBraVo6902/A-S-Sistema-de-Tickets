'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Ticket {
  id: number
  title: string
  status: string
  date: string
}

export function RecentTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch('/api/tickets/dashboard/recent')
        if (!res.ok) {
          throw new Error('Failed to fetch recent tickets')
        }
        const data = await res.json()
        setTickets(data)
      } catch (error) {
        console.error('Error fetching recent tickets:', error)
        setError('Error al cargar los tickets recientes')
      }
    }
    fetchTickets()
  }, [])

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>{ticket.status}</TableCell>
            <TableCell>{ticket.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}