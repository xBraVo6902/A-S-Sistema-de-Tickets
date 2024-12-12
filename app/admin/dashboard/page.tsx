"use client";

import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard admin/overview";
import { RecentTickets } from "@/components/dashboard admin/recent-tickets";
import { TicketStats } from "@/components/dashboard admin/ticket-stats";
import { CategoryBreakdown } from "@/components/dashboard admin/category-breakdown";
import { TechnicianPerformance } from "@/components/dashboard admin/technician-performance";
import { CompanyOverview } from "@/components/dashboard admin/company-overview";
import { LoadingSpinner } from "@/components/dashboard admin/loading-spinner";

type DashboardData = {
  totalTickets: number;
  pendingTickets: number;
  completedTickets: number;
  ticketsByCategory: Array<{ category: string; count: number }>;
  ticketsByTechnician: Array<{ name: string; completed: number; pending: number }>;
  ticketsByCompany: Array<{ name: string; completed: number; pending: number }>;
  monthlyData: Array<{ month: string; tickets: number }>;
};

async function fetchDashboardData(): Promise<DashboardData> {
  const [summary, resolutionRate, monthlySummary, byCategory, technicianPerformance, companySummary] = await Promise.all([
    fetch('/api/dashboard-routes?route=summary').then(res => res.json()),
    fetch('/api/dashboard-routes?route=resolution-rate').then(res => res.json()),
    fetch('/api/dashboard-routes?route=monthly-summary').then(res => res.json()),
    fetch('/api/dashboard-routes?route=by-category').then(res => res.json()),
    fetch('/api/dashboard-routes?route=technician-performance').then(res => res.json()),
    fetch('/api/dashboard-routes?route=company-summary').then(res => res.json()),
  ]);

  return {
    totalTickets: summary.totalTickets,
    pendingTickets: summary.pendingTickets,
    completedTickets: summary.completedTickets,
    ticketsByCategory: byCategory.map((item: any) => ({
      category: item.type,
      count: item._count._all,
    })),
    ticketsByTechnician: technicianPerformance.map((item: any) => ({
      name: item.userId, // Assuming you have a way to get the technician's name from userId
      completed: item._count._all, // Assuming completed tickets are counted here
      pending: 0, // You might need to adjust this based on your data structure
    })),
    ticketsByCompany: companySummary.map((item: any) => ({
      name: item.clientId, // Assuming you have a way to get the company's name from clientId
      completed: item._count._all, // Assuming completed tickets are counted here
      pending: 0, // You might need to adjust this based on your data structure
    })),
    monthlyData: monthlySummary.map((item: any) => ({
      month: new Date(item.createdAt).toLocaleString('es-ES', { month: 'short' }),
      tickets: item._count._all,
    })),
  };
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        setError('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Administrador</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
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