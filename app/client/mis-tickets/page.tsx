import { getServerSession } from "next-auth";
import { Ticket, columns } from "@/app/client/mis-tickets/columns";
import { DataTable } from "@/components/data-table";
import { authOptions } from "@/auth";
import "dotenv/config";

async function getTickets(): Promise<Ticket[]> {
  const res = await import("@/app/api/tickets/route");
  const session: { user?: { id?: string } } | null = await getServerSession(
    authOptions
  );
  const request = new Request(
    `${process.env.NEXTAUTH_URL}/api/tickets?clientId=${session?.user?.id}`,
    {
      method: "GET",
    }
  );

  if (!(await res.GET(request)).ok) {
    throw new Error("Failed to fetch data");
  }

  return await (await res.GET(request)).json();
}

export default async function Page() {
  const data = await getTickets();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} role="client" />
    </div>
  );
}
