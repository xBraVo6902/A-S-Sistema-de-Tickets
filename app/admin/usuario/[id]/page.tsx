import { BackButton } from "@/components/back-button";
import TicketInfo from "@/components/ticket-info";
import { TicketInfoProps } from "@/components/ticket-info";

async function getTicket(params: {
  params: { id: string };
}): Promise<TicketInfoProps["data"]> {
  const res = await import("@/app/api/tickets/[id]/route");
  const request = new Request(
    `${process.env.NEXTAUTH_URL}/api/tickets/${params.params.id}`,
    {
      method: "GET",
    }
  );

  if (!(await res.GET(request, params)).ok) {
    throw new Error("Failed to fetch data");
  }

  return await (await res.GET(request, params)).json();
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
};

async function getUsers(): Promise<User[]> {
  const res = await import("@/app/api/users/route");
  const request = new Request(`${process.env.NEXTAUTH_URL}/api/users`, {
    method: "GET",
  });

  if (!(await res.GET(request)).ok) {
    throw new Error("Failed to fetch data");
  }

  return await (await res.GET(request)).json();
}

export default async function TicketView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [ticketData, users] = await Promise.all([
    getTicket({ params: { id } }),
    getUsers(),
  ]);

  return (
    <div className="container mx-auto py-10 md:px-10 space-y-6">
      <BackButton href="/admin/usuarios" text="Volver a la lista" />
      <TicketInfo data={ticketData} role="Admin" users={users} />
    </div>
  );
}
