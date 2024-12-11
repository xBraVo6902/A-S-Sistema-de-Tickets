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
      fetch('/api/dashboard-routes/technicians/performance').then(res => {
        if (!res.ok) throw new Error(`Error fetching technicians performance: ${res.statusText}`);
        return res.json();
      }),
      fetch('/api/dashboard-routes/company/overview').then(res => {
        if (!res.ok) throw new Error(`Error fetching company overview: ${res.statusText}`);
        return res.json();
      }),
      fetch('/api/dashboard-routes/overview').then(res => {
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
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="recent-tickets">Tickets Recientes</TabsTrigger>
          <TabsTrigger value="ticket-stats">Estadísticas de Tickets</TabsTrigger>
          <TabsTrigger value="technician-performance">Rendimiento de Técnicos</TabsTrigger>
          <TabsTrigger value="company-overview">Resumen de Compañías</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.pendingTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.completedTickets}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Estadísticas de Tickets</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <TicketStats data={data.monthlyData} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Rendimiento de Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <TechnicianPerformance data={data.ticketsByTechnician} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Compañías</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <CompanyOverview data={data.ticketsByCompany} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Tickets Recientes</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <RecentTickets />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}