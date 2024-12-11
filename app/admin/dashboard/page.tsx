'use client'

import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard admin/overview"
import { RecentTickets } from "@/components/dashboard admin/recent-tickets"
import { TicketStats } from "@/components/dashboard admin/ticket-stats"
import { CategoryBreakdown } from "@/components/dashboard admin/category-breakdown"
import { TechnicianPerformance } from "@/components/dashboard admin/technician-performance"
import { CompanyOverview } from "@/components/dashboard admin/company-overview"
import { LoadingSpinner } from "@/components/dashboard admin/loading-spinner"

interface DashboardData {
  totalTickets: number
  pendingTickets: number
  completedTickets: number
  ticketsByCategory: Array<{ category: string; count: number }>
  ticketsByTechnician: Array<{ name: string; completed: number; pending: number }>
  ticketsByCompany: Array<{ name: string; completed: number; pending: number }>
  monthlyData: Array<{ month: string; tickets: number }>
}
async function getAdminDashboardData(): Promise<DashboardData> {
  const [ticketsByCategory, ticketsByTechnician, ticketsByCompany, monthlyData] = await Promise.all([
    fetch('/api/tickets/category-breakdown').then(res => res.json()),
    fetch('/api/technicians/performance').then(res => res.json()),
    fetch('/api/company/overview').then(res => res.json()),
    fetch('/api/overview').then(res => res.json()),
  ])

  return {
    totalTickets: ticketsByCategory.reduce((acc: number, item: { count: number }) => acc + item.count, 0),
    pendingTickets: ticketsByTechnician.reduce((acc: number, item: { pending: number }) => acc + item.pending, 0),
    completedTickets: ticketsByTechnician.reduce((acc: number, item: { completed: number }) => acc + item.completed, 0),
    ticketsByCategory: ticketsByCategory.map((item: { category: string; count: number }) => ({
      name: item.category,
      value: item.count,
    })),
    ticketsByTechnician,
    ticketsByCompany,
    monthlyData,
  }
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function fetchData() {
      const dashboardData = await getAdminDashboardData()
      setData(dashboardData)
    }
    fetchData()
  }, [])

  if (!data) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto py-10 md:px-10">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent-tickets">Recent Tickets</TabsTrigger>
          <TabsTrigger value="ticket-stats">Ticket Stats</TabsTrigger>
          <TabsTrigger value="category-breakdown">Category Breakdown</TabsTrigger>
          <TabsTrigger value="technician-performance">Technician Performance</TabsTrigger>
          <TabsTrigger value="company-overview">Company Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview data={data.monthlyData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent-tickets">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTickets />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ticket-stats">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketStats data={data.ticketsByCategory.map(item => ({ name: item.category, value: item.count }))} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="category-breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown data={data.ticketsByCategory} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="technician-performance">
          <Card>
            <CardHeader>
              <CardTitle>Technician Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <TechnicianPerformance data={data.ticketsByTechnician} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company-overview">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyOverview data={data.ticketsByCompany} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}