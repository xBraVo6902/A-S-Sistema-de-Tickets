'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CompanyData {
  name: string
  completed: number
  pending: number
}

interface CompanyOverviewProps {
  data: CompanyData[]
}

export function CompanyOverview({ data }: CompanyOverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" interval={0} /> {/* Asegúrate de que interval esté configurado en 0 */}
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#8884d8" name="Completados" />
        <Bar dataKey="pending" fill="#82ca9d" name="Pendientes" />
      </BarChart>
    </ResponsiveContainer>
  )
}