// TODO
// ! Script de desarrollo, borrar antes de hacer deploy.

import { PrismaClient } from "@prisma/client";
import { people, tickets } from "./data.js";
import bcrypt from "bcrypt";
import md5 from "md5";

const prisma = new PrismaClient();

const statuses = [
  {
    name: "Abierto",
    order: 1,
    lucideIcon: "CircleDot",
    hexColor: "#2471a3",
  },
  {
    name: "En progreso",
    order: 2,
    lucideIcon: "Timer",
    hexColor: "#d4ac0d",
  },
  {
    name: "Cerrado",
    order: 3,
    lucideIcon: "CheckCircle2",
    hexColor: "#27ae60",
  },
];

const types = [
  {
    name: "Bug",
    lucideIcon: "Bug",
    hexColor: "#c0392b",
  },
  {
    name: "Característica",
    lucideIcon: "Lightbulb",
    hexColor: "#8e44ad",
  },
  {
    name: "Pregunta",
    lucideIcon: "HelpCircle",
    hexColor: "#2471a3",
  },
];

const priorities = [
  {
    name: "Baja",
    order: 1,
    lucideIcon: "ArrowDown",
    hexColor: "#27ae60",
  },
  {
    name: "Media",
    order: 2,
    lucideIcon: "ArrowRight",
    hexColor: "#d4ac0d",
  },
  {
    name: "Alta",
    order: 3,
    lucideIcon: "ArrowUp",
    hexColor: "#c0392b",
  },
];

async function main() {
  await prisma.$transaction([
    prisma.ticket.deleteMany({}),
    prisma.person.deleteMany({}),
    prisma.status.deleteMany({}),
    prisma.type.deleteMany({}),
    prisma.priority.deleteMany({}),
  ]);

  await prisma.$executeRaw`ALTER TABLE Person AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Ticket AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Status AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Type AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Priority AUTO_INCREMENT = 1;`;

  const statusRecords = [];
  for (const status of statuses) {
    const record = await prisma.status.create({ data: status });
    statusRecords.push(record);
  }

  const typeRecords = [];
  for (const type of types) {
    const record = await prisma.type.create({ data: type });
    typeRecords.push(record);
  }

  const priorityRecords = [];
  for (const priority of priorities) {
    const record = await prisma.priority.create({ data: priority });
    priorityRecords.push(record);
  }

  for (const person of people) {
    const hashedPassword = await bcrypt.hash(person.password, 10);

    const hashedEmail = md5(person.email.trim().toLowerCase());
    const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}?s=256&d=mp`;

    await prisma.person.create({
      data: {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        rut: person.rut,
        avatar: gravatarUrl,
        companyRut: person.companyRut,
        password: hashedPassword,
        role: person.role,
        phone: person.phone,
      },
    });
  }

  for (const ticket of tickets) {
    const status = statusRecords.find((s) => s.name === ticket.status);
    const type = typeRecords.find((t) => t.name === ticket.type);
    const priority = priorityRecords.find((p) => p.name === ticket.priority);

    await prisma.ticket.create({
      data: {
        title: ticket.title,
        description: ticket.description,
        statusId: status.id,
        typeId: type.id,
        priorityId: priority.id,
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
