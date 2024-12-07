import TicketInfo from "@/components/ticket-info";
import { TicketInfoProps } from "@/components/ticket-info";
import TicketMessages from "@/components/ticket-messages";
import { TicketMessage } from "@/components/ticket-messages";

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

async function getMessages(params: {
  params: { id: string };
}): Promise<TicketMessage[]> {
  const res = await import("@/app/api/messages/[id]/route");
  const request = new Request(
    `${process.env.NEXTAUTH_URL}/api/messages/${params.params.id}`,
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
  const messages = await getMessages({ params: { id } });

  return (
    <div className="container mx-auto py-10 md:px-10 space-y-6">
      <TicketInfo data={ticketData} />
      <TicketMessages messages={messages} />
    </div>
  );
}
