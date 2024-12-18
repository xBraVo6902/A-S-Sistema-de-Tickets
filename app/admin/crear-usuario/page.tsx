import CreateUserForm from "@/components/create-user-form";

export default function CreateTicketPage() {
  return (
    <div className="container mx-auto py-10 md:px-10 flex justify-center">
      <CreateUserForm role="Admin" />
    </div>
  );
}
