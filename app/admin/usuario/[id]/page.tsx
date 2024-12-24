import { BackButton } from "@/components/back-button";
import UserInfo from "@/components/user-info";
import { getUserById, getTicketMetadata } from "@/lib/actions";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [user, ticketMetadata] = await Promise.all([
    getUserById(id),
    getTicketMetadata(),
  ]);
  console.log(user);
  console.log(ticketMetadata);

  const formatPhone = (phone: string) => {
    const countryCode = phone.slice(0, 2);
    const areaCode = phone.slice(2, 3);
    const firstPart = phone.slice(3, 7);
    const secondPart = phone.slice(7, 11);
    return `+${countryCode} ${areaCode} ${firstPart} ${secondPart}`;
  };

  const userData = {
    id: user.id.toString(),
    name: user.firstName + " " + user.lastName,
    rut: user.rut,
    email: user.email,
    phone: formatPhone(user.phone),
    avatar: user.avatar,
    role: user.role,
    tickets: (user.role === "Client" ? user.created : user.assigned).map(
      (ticket) => ({
        id: ticket.id.toString(),
        title: ticket.title,
        status: {
          text: ticketMetadata.statuses.find((s) => s.id === ticket.statusId)
            ?.name,
          color: ticketMetadata.statuses.find((s) => s.id === ticket.statusId)
            ?.hexColor,
        },
      })
    ),
  };

  return (
    <div className="container mx-auto py-10 md:px-10 space-y-6">
      <BackButton href="/admin/usuarios" text="Volver a la lista" />
      <UserInfo user={userData} />
    </div>
  );
}
