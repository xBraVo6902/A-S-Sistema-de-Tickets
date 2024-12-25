import emailService from "./emailService";

// await emailService.sendTicketCreatedEmail("rakifih471@owube.com", {
//   ticketId: "TK-123",
//   userName: "John Doe",
//   status: "Open",
// });

await emailService.sendResetPasswordEmail("rakifih471@owube.com", {
  firstName: "John",
  resetLink: "http://example.com/reset-password",
});
