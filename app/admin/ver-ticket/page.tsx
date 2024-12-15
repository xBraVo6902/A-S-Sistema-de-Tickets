import { getServerSession } from "next-auth";
import { Ticket, columns } from "@/app/user/dashboard/columns";
import { DataTable } from "@/components/data-table";
import { authOptions } from "@/auth";
import "dotenv/config";
import { LoadingTable } from "@/components/loading-table";
import { Suspense } from "react";

async function getTickets(): Promise<Ticket[]> {
  const res = await import("@/app/api/tickets/route");
  const session: { user?: { id?: string; role?: string} } | null = await getServerSession(
    authOptions
  );
   
  
  const request = new Request(
    `${process.env.NEXTAUTH_URL}/api/dashboard-routes?route=summary`,
    {
      method: "GET",
    }
  );

  if (!(await res.GET(request)).ok) {
    throw new Error("Failed to fetch data");
  }

  return await (await res.GET(request)).json();
}

async function TicketsTable() {
  const data = await getTickets();
  return <DataTable columns={columns} data={data} />;
}

export default async function Page() {
  return (
    <div className="container mx-auto py-10 md:px-10">
      <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
      <Suspense fallback={<LoadingTable />}>
        <TicketsTable />
      </Suspense>
    </div>
  );
}
