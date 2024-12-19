import { UsersTable } from "@/components/users-table";
import { getUsers } from "@/lib/actions";
import { columns } from "./columns";

export default async function Page() {
  const data = (await getUsers()).map((user) => ({
    id: user.id,
    name: user.firstName + " " + user.lastName,
    rut: user.rut,
    email: user.email,
    ticketCount: user.assigned.length,
  }));
  console.log(data);

  return (
    <div className="container mx-auto py-10">
      <UsersTable columns={columns} data={data} />
    </div>
  );
}
