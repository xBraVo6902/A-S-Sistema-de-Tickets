import TicketInfo from "@/components/ticket-info";
import { TicketInfoProps } from "@/components/ticket-info";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

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
      <Link href="/admin/asignar-ticket">
        <Button variant="outline" className="hover:bg-secondary">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver a la lista
        </Button>
      </Link>
      <TicketInfo data={ticketData} role="Admin" users={users} />
    </div>
  );
}
