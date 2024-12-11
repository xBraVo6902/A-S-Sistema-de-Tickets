'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TicketStat {
  month: string
  tickets: number
}

interface TicketStatsProps {
  data: TicketStat[]
}

export function TicketStats({ data }: TicketStatsProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tickets" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}