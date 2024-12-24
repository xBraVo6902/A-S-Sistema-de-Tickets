import { getClients, getTicketMetadata } from "@/lib/actions";
import { columns } from "./columns";
import { ClientsTable } from "@/components/clients.table";

export default async function Page() {
  const ticketMetadata = await getTicketMetadata();
  const closedId = ticketMetadata.statuses.find(
    (s) => s.name === "Cerrado"
  )?.id;

  const data = (await getClients()).map((client) => ({
    id: client.id,
    name: client.firstName + " " + client.lastName,
    rut: client.rut,
    companyRut: client.companyRut,
    email: client.email,
    open: client.created.filter((t) => t.statusId !== closedId).length,
    closed: client.created.filter((t) => t.statusId === closedId).length,
  }));

  return (
    <div className="container mx-auto py-10">
      <ClientsTable columns={columns} data={data} />
    </div>
  );
}
