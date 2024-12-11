'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard-admin/overview"
import { RecentTickets } from "@/components/dashboard-admin/recent-tickets"
import { TicketStats } from "@/components/dashboard-admin/ticket-stats"
import { TechnicianPerformance } from "@/components/dashboard-admin/technician-performance"
import { CompanyOverview } from "@/components/dashboard-admin/company-overview"
import { LoadingSpinner } from "@/components/dashboard-admin/loading-spinner"

interface TechnicianData {
  name: string
  completed: number
  pending: number
}

interface CompanyData {
  name: string
  completed: number
  pending: number
}

interface MonthlyData {
  month: string
  tickets: number
}

interface DashboardData {
  totalTickets: number
  pendingTickets: number
  completedTickets: number
  ticketsByTechnician: TechnicianData[]
  ticketsByCompany: CompanyData[]
  monthlyData: MonthlyData[]
}

async function getAdminDashboardData(): Promise<DashboardData> {
  try {
    const [ticketsByTechnician, ticketsByCompany, monthlyData] = await Promise.all([
      fetch('/api/technicians/performance').then(res => {
        if (!res.ok) throw new Error(`Error fetching technicians performance: ${res.statusText}`);
        return res.json();
      }),
      fetch('/api/company/overview').then(res => {
        if (!res.ok) throw new Error(`Error fetching company overview: ${res.statusText}`);
        return res.json();
      }),
      fetch('/api/overview').then(res => {
        if (!res.ok) throw new Error(`Error fetching overview: ${res.statusText}`);
        return res.json();
      }),
    ]);

    return {
      totalTickets: monthlyData.reduce((acc: number, item: MonthlyData) => acc + item.tickets, 0),
      pendingTickets: ticketsByTechnician.reduce((acc: number, item: TechnicianData) => acc + item.pending, 0),
      completedTickets: ticketsByTechnician.reduce((acc: number, item: TechnicianData) => acc + item.completed, 0),
      ticketsByTechnician,
      ticketsByCompany,
      monthlyData,
    };
  } catch (error) {
    console.error('Error in getAdminDashboardData:', error);
    throw error;
  }
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardData = await getAdminDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Error al cargar los datos del dashboard')
      }
    }
    fetchData()
  }, [])

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

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
              <TicketStats data={data.monthlyData} />
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