import { UsersTable } from "@/components/users-table";
import { getUsers } from "@/lib/actions";
import { columns } from "./columns";

export default async function Page() {
  const data = await getUsers();

  return (
    <div className="container mx-auto py-10">
      <UsersTable columns={columns} data={data} role="admin" />
    </div>
  );
}
