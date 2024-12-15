"use client";

import * as React from "react";
import { columns } from "./columns";
import { LoadingTable } from "@/components/loading-table";
import { TicketsDataView } from "@/components/tickets-data-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

async function getTickets() {
  const response = await fetch("/api/tickets/all");
  if (!response.ok) {
    throw new Error("Error al cargar los tickets");
  }
  return response.json();
}

export default function ViewTicketsPage() {
  const [tickets, setTickets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
      setError(null);
    } catch {
      setError("Error al cargar los tickets");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-10 md:px-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 md:px-10">
      {loading ? (
        <LoadingTable />
      ) : (
        <TicketsDataView 
          columns={columns} 
          data={tickets} 
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}