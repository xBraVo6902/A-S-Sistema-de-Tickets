import { Suspense } from 'react'
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
  // Simulando una llamada a API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    totalTickets: 1234,
    pendingTickets: 123,
    completedTickets: 1111,
    ticketsByCategory: [
      { category: "Hardware", count: 450 },
      { category: "Software", count: 350 },
      { category: "Network", count: 250 },
      { category: "Other", count: 184 },
    ],
    ticketsByTechnician: [
      { name: "Alice", completed: 300, pending: 20 },
      { name: "Bob", completed: 250, pending: 15 },
      { name: "Charlie", completed: 200, pending: 10 },
    ],
    ticketsByCompany: [
      { name: "Acme Inc", completed: 400, pending: 30 },
      { name: "Globex Corp", completed: 350, pending: 25 },
      { name: "Initech", completed: 300, pending: 20 },
    ],
    monthlyData: [
      { month: "Ene", tickets: 100 },
      { month: "Feb", tickets: 120 },
      { month: "Mar", tickets: 150 },
      { month: "Abr", tickets: 180 },
      { month: "May", tickets: 200 },
      { month: "Jun", tickets: 220 },
    ],
  }
}

export default async function AdminDashboard() {
  const dashboardData = await getAdminDashboardData()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Administrador</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
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
                <div className="text-2xl font-bold">{dashboardData.totalTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.pendingTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.completedTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Resolución
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((dashboardData.completedTickets / dashboardData.totalTickets) * 100).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Tickets</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<LoadingSpinner />}>
                  <Overview data={dashboardData.monthlyData} />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Tickets Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <RecentTickets />
                </Suspense>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Estadísticas de Tickets</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<LoadingSpinner />}>
                  <TicketStats data={dashboardData} />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Desglose por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <CategoryBreakdown data={dashboardData.ticketsByCategory} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Rendimiento de Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <TechnicianPerformance data={dashboardData.ticketsByTechnician} />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Resumen por Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <CompanyOverview data={dashboardData.ticketsByCompany} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}