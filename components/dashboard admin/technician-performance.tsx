'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TechnicianData {
  name: string
  completed: number
  pending: number
}

interface TechnicianPerformanceProps {
  data: TechnicianData[]
}

export function TechnicianPerformance({ data }: TechnicianPerformanceProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#8884d8" name="Completados" />
        <Bar dataKey="pending" fill="#82ca9d" name="Pendientes" />
      </BarChart>
    </ResponsiveContainer>
  )
}