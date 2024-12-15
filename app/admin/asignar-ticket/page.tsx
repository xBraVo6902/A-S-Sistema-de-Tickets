import { Ticket, columns } from "./columns";
import { DataTable } from "@/components/data-table";

async function getTickets(): Promise<Ticket[]> {
  const res = await import("@/app/api/tickets/route");
  const request = new Request(`${process.env.NEXTAUTH_URL}/api/tickets`, {
    method: "GET",
  });

  if (!(await res.GET(request)).ok) {
    throw new Error("Failed to fetch data");
  }

  return await (await res.GET(request)).json();
}

export default async function DemoPage() {
  const data = await getTickets();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
