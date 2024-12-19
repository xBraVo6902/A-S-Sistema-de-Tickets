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

export default async function TicketView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const ticketData = await getTicket({ params: { id } });

  return (
    <div className="container mx-auto py-10 md:px-10 space-y-6">
      <BackButton href="/client/mis-tickets" text="Volver a la lista" />
      <TicketInfo data={ticketData} role="Client" />
    </div>
  );
}
