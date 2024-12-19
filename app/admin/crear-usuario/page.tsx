import CreateUserForm from "@/components/create-user-form";

export default function CreateTicketPage() {
  return (
    <div className="container mx-auto py-10 md:px-10 flex justify-center">
      <div className="space-y-6">
        <CreateUserForm role="Admin" />
      </div>
    </div>
  );
}
