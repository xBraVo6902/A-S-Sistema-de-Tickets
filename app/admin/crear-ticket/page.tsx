import CreateTicketForm from "@/components/create-ticket-form";
import { getTicketMetadata } from "@/lib/actions";

export default async function CreateTicketPage() {
  const ticketMetadata = await getTicketMetadata();

  return (
    <div className="container mx-auto py-10 md:px-10 flex justify-center">
      <CreateTicketForm ticketMetadata={ticketMetadata} role="Admin" />
    </div>
  );
}
