// TODO
// ! Script de desarrollo, borrar antes de hacer deploy.

import { PrismaClient } from "@prisma/client";
import { people, tickets } from "./data.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany({});
  await prisma.person.deleteMany({});

  await prisma.$executeRaw`ALTER TABLE Person AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Ticket AUTO_INCREMENT = 1;`;

  const createdPeople = [];
  for (const person of people) {
    const hashedPassword = await bcrypt.hash(person.password, 10);
    const createdPerson = await prisma.person.create({
      data: {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        rut: person.rut,
        companyRut: person.companyRut,
        password: hashedPassword,
        role: person.role,
        phone: person.phone,
      },
    });
    createdPeople.push(createdPerson);
  }

  for (const ticket of tickets) {
    await prisma.ticket.create({
      data: {
        title: ticket.title,
        description: ticket.description,
        type: ticket.type,
        priority: ticket.priority,
        status: ticket.status,
        userId: ticket.userId,
        clientId: ticket.clientId,
        createdAt: ticket.createdAt,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
