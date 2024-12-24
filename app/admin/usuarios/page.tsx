import { UsersTable } from "@/components/users-table";
import { getUsers, getTicketMetadata } from "@/lib/actions";
import { columns } from "./columns";

export default async function Page() {
  const ticketMetadata = await getTicketMetadata();
  const closedId = ticketMetadata.statuses.find(
    (s) => s.name === "Cerrado"
  )?.id;

  const data = (await getUsers()).map((user) => ({
    id: user.id,
    name: user.firstName + " " + user.lastName,
    rut: user.rut,
    email: user.email,
    open: user.assigned.filter((t) => t.statusId !== closedId).length,
    closed: user.assigned.filter((t) => t.statusId === closedId).length,
  }));

  return (
    <div className="container mx-auto py-10">
      <UsersTable columns={columns} data={data} />
    </div>
  );
}
