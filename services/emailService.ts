import nodemailer from "nodemailer";
import "dotenv/config";
import { loadTemplate } from "@/lib/templateLoader";
import {
  CreatePasswordEmailData,
  ResetPasswordEmailData,
  StatusChangeEmailData,
  TicketAssignedEmailData,
  TicketCreatedEmailData,
} from "./types";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "Gmail",
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendEmail({
    to,
    subject,
    text,
    html,
  }: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendTicketCreatedEmail(
    to: string,
    data: TicketCreatedEmailData
  ): Promise<void> {
    const html = await loadTemplate("ticket-created", data);
    await this.sendEmail({
      to,
      subject: `Ticket #${data.ticketId} creado`,
      html,
    });
  }

  async sendResetPasswordEmail(
    to: string,
    data: ResetPasswordEmailData
  ): Promise<void> {
    const html = await loadTemplate("reset-password", data);
    await this.sendEmail({
      to,
      subject: "Restablece tu contraseña",
      html,
    });
  }

  async sendCreatePasswordEmail(
    to: string,
    data: CreatePasswordEmailData
  ): Promise<void> {
    const html = await loadTemplate("create-password", data);
    await this.sendEmail({
      to,
      subject: "Bienvenido a la plataforma",
      html,
    });
  }

  async sendStatusChangeEmail(
    to: string,
    data: StatusChangeEmailData
  ): Promise<void> {
    const html = await loadTemplate("status-change", data);
    await this.sendEmail({
      to,
      subject: `Ticket #${data.ticketId} actualizado`,
      html,
    });
  }

  async sendTicketAssignedEmail(
    to: string,
    data: TicketAssignedEmailData
  ): Promise<void> {
    const html = await loadTemplate("ticket-assigned", data);
    await this.sendEmail({
      to,
      subject: `Ticket #${data.ticketId} asignado`,
      html,
    });
  }
}

const emailService = new EmailService();
export default emailService;
