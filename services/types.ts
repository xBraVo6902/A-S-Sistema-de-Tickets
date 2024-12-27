export type TicketCreatedEmailData = {
  ticketId: string;
  firstName: string;
  title: string;
  description: string;
  status: { name: string; hexColor: string };
  type: { name: string; hexColor: string };
  priority: { name: string; hexColor: string };
  ticketLink: string;
};

export type ResetPasswordEmailData = {
  firstName: string;
  resetLink: string;
};

export type CreatePasswordEmailData = {
  firstName: string;
  createLink: string;
};

export type StatusChangeEmailData = {
  firstName: string;
  ticketId: string;
  title: string;
  prevStatus: { name: string; hexColor: string };
  newStatus: { name: string; hexColor: string };
  ticketLink: string;
};

export type TicketAssignedEmailData = {
  ticketId: string;
  firstName: string;
  title: string;
  description: string;
  status: { name: string; hexColor: string };
  priority: { name: string; hexColor: string };
  type: { name: string; hexColor: string };
  ticketLink: string;
};
