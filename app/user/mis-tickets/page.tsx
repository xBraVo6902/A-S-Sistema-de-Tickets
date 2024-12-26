import { getServerSession } from "next-auth";
import { columns } from "@/app/user/mis-tickets/columns";
import { DataTable } from "@/components/data-table";
import { authOptions } from "@/auth";
import "dotenv/config";
import { getTicketsByUserId } from "@/lib/actions";

export default async function Page() {
  const session: { user?: { id?: string } } | null = await getServerSession(
    authOptions
  );
  const data = (await getTicketsByUserId(session?.user?.id ?? "0")).map(
    (ticket) => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      type: ticket.type,
      priority: ticket.priority,
      client: ticket.client,
    })
  );

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} role="user" />
    </div>
  );
}
