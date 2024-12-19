import { getClients } from "@/lib/actions";
import { columns } from "./columns";
import { ClientsTable } from "@/components/clients.table";

export default async function Page() {
  const data = (await getClients()).map((client) => ({
    id: client.id,
    name: client.firstName + " " + client.lastName,
    rut: client.rut,
    companyRut: client.companyRut,
    email: client.email,
    ticketCount: client.created.length,
  }));

  return (
    <div className="container mx-auto py-10">
      <ClientsTable columns={columns} data={data} />
    </div>
  );
}
