'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TicketStatsData {
  totalTickets: number
  pendingTickets: number
  completedTickets: number
}

interface TicketStatsProps {
  data: TicketStatsData
}

export function TicketStats({ data }: TicketStatsProps) {
  const chartData = [
    { name: 'Total', value: data.totalTickets },
    { name: 'Pendientes', value: data.pendingTickets },
    { name: 'Completados', value: data.completedTickets },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}