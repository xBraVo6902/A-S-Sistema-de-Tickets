"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TicketIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface TicketsDataViewProps {
  columns: any[];
  data: any[];
  onRefresh?: () => void;
}

export function TicketsDataView({ columns, data, onRefresh }: TicketsDataViewProps) {
  const stats = {
    total: data.length,
    pendientes: data.filter(t => t.status === "Abierto").length,
    enProceso: data.filter(t => t.status === "En progreso").length,
    completados: data.filter(t => t.status === "Cerrado").length
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Tickets</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleString()}
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="abiertos">Abierto</TabsTrigger>
          <TabsTrigger value="en-proceso">En Proceso</TabsTrigger>
          <TabsTrigger value="cerrados">Cerrado</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <TicketIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
            </Card>
          </div>
          <DataTable 
            columns={columns} 
            data={data}
          />
        </TabsContent>

        <TabsContent value="abiertos">
            <div className="grid gap-4 md:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abiertos</CardTitle>
                <ClockIcon className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {stats.pendientes}
                </div>
            </CardContent>
            </Card>
            </div>

          <DataTable 
            columns={columns} 
            data={data.filter(t => t.status === "Abierto")}
          />
        </TabsContent>

        <TabsContent value="en-proceso">
            <div className="grid gap-4 md:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                <ClockIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {stats.enProceso}
                </div>
            </CardContent>
            </Card>
            </div>

          <DataTable 
            columns={columns} 
            data={data.filter(t => t.status === "En progreso")}
          />
        </TabsContent>

        <TabsContent value="cerrados">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cerrados</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {stats.completados}
                </div>
            </CardContent>  
            </Card>



          </div>


          <DataTable 
            columns={columns} 
            data={data.filter(t => t.status === "Cerrado")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 