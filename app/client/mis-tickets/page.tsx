import { getServerSession } from "next-auth";
import { columns } from "@/app/client/mis-tickets/columns";
import { DataTable } from "@/components/data-table";
import { authOptions } from "@/auth";
import "dotenv/config";
import { redirect } from "next/navigation";
import { getTicketsByClientId } from "@/lib/actions";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const data = (await getTicketsByClientId(session.user.id ?? "")).map(
    (ticket) => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      type: ticket.type,
      priority: ticket.priority,
      user: ticket.user,
    })
  );

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} role="client" />
    </div>
  );
}
