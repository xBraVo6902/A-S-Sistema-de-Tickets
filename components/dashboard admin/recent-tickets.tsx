// components/RecentTickets.tsx
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

  useEffect(() => {
    async function fetchTickets() {
      const res = await fetch('/api/tickets/recent')
      const data = await res.json()
      setTickets(data)
    }
    fetchTickets()
  }, [])

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