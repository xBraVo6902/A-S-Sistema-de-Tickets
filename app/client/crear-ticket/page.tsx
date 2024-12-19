import CreateTicketForm from "@/components/create-ticket-form";

export default function CreateTicketPage() {
  return (
    <div className="container mx-auto py-10 md:px-10 flex justify-center">
      <CreateTicketForm role="Client" />
    </div>
  );
}
