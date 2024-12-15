// TODO
/**
 * ! Datos de prueba. Eliminar antes de pasar a producción
 */
export const people = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@admin.com",
    rut: "11.111.111-1",
    password: "admin",
    role: "Admin",
    phone: "56997571019",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "client@client.com",
    rut: "22.222.222-2",
    companyRut: "33.333.333-3",
    password: "client",
    role: "Client",
    phone: "56960526880",
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "user@user.com",
    rut: "44.444.444-4",
    password: "user",
    role: "User",
    phone: "56998782651",
  },
  {
    firstName: "Tandie",
    lastName: "Smith",
    email: "temma0@salon.com",
    rut: "14.675.166-K",
    password: "fW7){Dnsj+BFC",
    role: "User",
    phone: "56965188959",
  },
  {
    firstName: "Jareb",
    lastName: "Lachaize",
    email: "jlachaize1@aol.com",
    rut: "15.886.788-K",
    companyRut: "99.734.771-K",
    password: "qA3+<lX8wqAA/",
    role: "Client",
    phone: "56975645328",
  },
  {
    firstName: "Drusilla",
    lastName: "McCarty",
    email: "dmccartyj@pinterest.com",
    rut: "16.886.788-K",
    companyRut: "99.734.772-K",
    password: "qA3+<lX8wqAA/",
    role: "Client",
    phone: "56994526473",
  },
  {
    firstName: "Acme",
    lastName: "Corp",
    email: "contact@acme.com",
    rut: "99.999.999-9",
    companyRut: "99.999.999-9",
    password: "password123",
    role: "Client",
    phone: "56951435128",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    rut: "98.765.432-1",
    password: "password123",
    role: "User",
    phone: "56974300231",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    rut: "12.345.678-9",
    password: "password123",
    role: "Admin",
    phone: "56950120591",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    rut: "55.555.555-5",
    password: "password123",
    role: "User",
    phone: "56931054978",
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    rut: "66.666.666-6",
    companyRut: "99.999.999-9",
    password: "password123",
    role: "Client",
    phone: "56974986501",
  },
  {
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    rut: "77.777.777-7",
    companyRut: "88.888.888-8",
    password: "password123",
    role: "Client",
    phone: "56952471107",
  },
  {
    firstName: "Eve",
    lastName: "White",
    email: "eve.white@example.com",
    rut: "99.999.999-8",
    password: "password123",
    role: "User",
    phone: "56919687306",
  },
  {
    firstName: "Frank",
    lastName: "Green",
    email: "frank.green@example.com",
    rut: "10.101.010-1",
    companyRut: "99.999.999-9",
    password: "password123",
    role: "Client",
    phone: "56930231679",
  },
  {
    firstName: "Grace",
    lastName: "Black",
    email: "grace.black@example.com",
    rut: "11.111.111-2",
    password: "password123",
    role: "User",
    phone: "56959173106",
  },
  {
    firstName: "Hank",
    lastName: "Blue",
    email: "hank.blue@example.com",
    rut: "12.121.212-2",
    companyRut: "99.999.999-9",
    password: "password123",
    role: "Client",
    phone: "56982694946",
  },
  {
    firstName: "Ivy",
    lastName: "Red",
    email: "ivy.red@example.com",
    rut: "13.131.313-2",
    password: "password123",
    role: "User",
    phone: "56963084261",
  },
  {
    firstName: "Jack",
    lastName: "Yellow",
    email: "jack.yellow@example.com",
    rut: "14.141.414-2",
    companyRut: "99.999.999-9",
    password: "password123",
    role: "Client",
    phone: "56951610387",
  },
  {
    firstName: "Kara",
    lastName: "Purple",
    email: "kara.purple@example.com",
    rut: "15.151.515-2",
    password: "password123",
    role: "User",
    phone: "56931621749",
  },
  {
    firstName: "Leo",
    lastName: "Orange",
    email: "leo.orange@example.com",
    rut: "16.161.616-2",
    companyRut: "99.999.999-9",
    password: "password123",
    role: "Client",
    phone: "56972898652",
  },
  {
    firstName: "Pablo",
    lastName: "Cortés",
    email: "pablo.cortes@example.com",
    rut: "20.600.436-3",
    password: "pablocortes",
    role: "User",
    phone: "56959252625",
  },
  {
    firstName: "Camilo",
    lastName: "Bravo",
    email: "camilo.bravo@example.com",
    rut: "21.048.333-0",
    companyRut: "99.999.999-9",
    password: "camilobravo",
    role: "Client",
    phone: "56964141800",
  },
];

export const tickets = [
  {
    title: "Veniam ea velit sunt ea nulla.",
    description:
      "Culpa occaecat cillum eu amet pariatur fugiat occaecat mollit et consectetur labore qui labore Lorem minim pariatur eiusmod non dolor aliquip.",
    type: "Bug",
    priority: "Medium",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-01-15"),
  },
  {
    title: "Anim duis est nulla ullamco.",
    description:
      "Elit sint fugiat ea aute nostrud ad nisi nostrud commodo incididunt officia officia magna amet in id culpa sit id velit incididunt.",
    type: "Question",
    priority: "Low",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-02-20"),
  },
  {
    title: "Esse est reprehenderit incididunt.",
    description:
      "Ut nisi nulla magna adipisicing tempor id et officia ullamco ex minim ipsum culpa eiusmod ex pariatur dolore labore anim nostrud esse.",
    type: "Feature",
    priority: "Medium",
    status: "Open",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2023-03-10"),
  },
  {
    title: "Amet minim dolor aute consequat.",
    description:
      "Ea qui elit commodo ea sit sit ipsum esse esse proident eiusmod veniam eu mollit sint sit incididunt irure adipisicing veniam fugiat.",
    type: "Question",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2023-04-05"),
  },
  {
    title: "Sit cupidatat quis mollit.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-05-01"),
  },
  {
    title: "Tempor amet do consectetur mollit dolor.",
    description:
      "Officia id magna ullamco minim qui cupidatat Lorem laboris voluptate est nisi occaecat officia pariatur ullamco occaecat ullamco do excepteur labore sunt quis adipisicing nulla qui reprehenderit duis eiusmod.",
    type: "Bug",
    priority: "Medium",
    status: "Open",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2023-06-10"),
  },
  {
    title: "Deserunt duis duis ut aliqua exercitation.",
    description:
      "Ullamco incididunt quis ex irure dolore sint esse reprehenderit sint adipisicing consectetur non est non nostrud aute dolore culpa dolor.",
    type: "Bug",
    priority: "Medium",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-07-15"),
  },
  {
    title: "Id ea occaecat cillum.",
    description:
      "Commodo aute esse velit minim ullamco dolore ad id cupidatat amet fugiat quis eiusmod occaecat ut nulla mollit aute ea non deserunt magna sint anim ullamco nisi ad laborum pariatur.",
    type: "Question",
    priority: "High",
    status: "InProgress",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2023-08-20"),
  },
  {
    title: "Occaecat laboris ut minim.",
    description:
      "Minim exercitation voluptate reprehenderit laborum qui id officia nostrud occaecat amet magna veniam Lorem veniam esse incididunt et commodo est id excepteur.",
    type: "Question",
    priority: "Medium",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-09-25"),
  },
  {
    title: "Magna commodo sit sint.",
    description:
      "Eiusmod cillum culpa nostrud enim aliqua labore sint eu sit magna velit amet est commodo est est sunt incididunt et anim proident officia dolor fugiat aliquip.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-10-01"),
  },
  {
    title: "Aliquip cupidatat et sit.",
    description:
      "Sint aliquip officia amet reprehenderit veniam minim sit laborum excepteur est duis dolore proident ipsum id ut quis culpa elit cupidatat eiusmod elit.",
    type: "Question",
    priority: "High",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2023-11-05"),
  },
  {
    title: "Laboris nisi ut aliquip ex ea commodo.",
    description:
      "Laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    type: "Feature",
    priority: "Low",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2023-12-01"),
  },
  {
    title: "Excepteur sint occaecat cupidatat non proident.",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "Bug",
    priority: "Medium",
    status: "Closed",
    userId: 4, // Asignado a Tandie
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2023-12-15"),
  },
  {
    title: "Sed ut perspiciatis unde omnis iste natus.",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    type: "Question",
    priority: "High",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-01-10"),
  },
  {
    title: "Nemo enim ipsam voluptatem quia voluptas.",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    type: "Feature",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-01-20"),
  },
  {
    title: "Neque porro quisquam est qui dolorem.",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-02-05"),
  },
  {
    title: "Ut enim ad minima veniam.",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    type: "Question",
    priority: "Low",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-02-15"),
  },
  {
    title: "Quis autem vel eum iure reprehenderit.",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    type: "Feature",
    priority: "Medium",
    status: "InProgress",
    userId: null, // No asignado
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-03-01"),
  },
  {
    title: "At vero eos et accusamus et iusto odio.",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    type: "Bug",
    priority: "High",
    status: "Closed",
    userId: 4, // Asignado a Tandie
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-03-10"),
  },
  {
    title: "Similique sunt in culpa qui officia deserunt.",
    description:
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    type: "Question",
    priority: "Low",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-04-05"),
  },
  {
    title: "Nam libero tempore, cum soluta nobis est.",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
    type: "Feature",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-04-15"),
  },
  {
    title: "Temporibus autem quibusdam et aut officiis.",
    description:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-05-01"),
  },
  {
    title: "Itaque earum rerum hic tenetur a sapiente.",
    description:
      "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    type: "Question",
    priority: "Low",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-05-10"),
  },
  {
    title: "Ut enim ad minima veniam.",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    type: "Feature",
    priority: "Medium",
    status: "InProgress",
    userId: null, // No asignado
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-06-01"),
  },
  {
    title: "Quis autem vel eum iure reprehenderit.",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    type: "Bug",
    priority: "High",
    status: "Closed",
    userId: 4, // Asignado a Tandie
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-06-10"),
  },
  {
    title: "At vero eos et accusamus et iusto odio.",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    type: "Question",
    priority: "Low",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-07-05"),
  },
  {
    title: "Similique sunt in culpa qui officia deserunt.",
    description:
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    type: "Feature",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-07-15"),
  },
  {
    title: "Nam libero tempore, cum soluta nobis est.",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-08-01"),
  },
  {
    title: "Temporibus autem quibusdam et aut officiis.",
    description:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    type: "Question",
    priority: "Low",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-08-10"),
  },
  {
    title: "Itaque earum rerum hic tenetur a sapiente.",
    description:
      "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    type: "Feature",
    priority: "Medium",
    status: "InProgress",
    userId: null, // No asignado
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-09-01"),
  },
  {
    title: "Ut enim ad minima veniam.",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    type: "Bug",
    priority: "High",
    status: "Closed",
    userId: 4, // Asignado a Tandie
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-09-10"),
  },
  {
    title: "Quis autem vel eum iure reprehenderit.",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    type: "Question",
    priority: "Low",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-10-05"),
  },
  {
    title: "At vero eos et accusamus et iusto odio.",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    type: "Feature",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-10-15"),
  },
  {
    title: "Similique sunt in culpa qui officia deserunt.",
    description:
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-11-01"),
  },
  {
    title: "Nam libero tempore, cum soluta nobis est.",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
    type: "Question",
    priority: "Low",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-11-10"),
  },
  {
    title: "Temporibus autem quibusdam et aut officiis.",
    description:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    type: "Feature",
    priority: "Medium",
    status: "InProgress",
    userId: null, // No asignado
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2024-12-01"),
  },
  {
    title: "Itaque earum rerum hic tenetur a sapiente.",
    description:
      "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    type: "Bug",
    priority: "High",
    status: "Closed",
    userId: 4, // Asignado a Tandie
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2024-12-10"),
  },
  {
    title: "Ut enim ad minima veniam.",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    type: "Question",
    priority: "Low",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2025-01-05"),
  },
  {
    title: "Quis autem vel eum iure reprehenderit.",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    type: "Feature",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2025-01-15"),
  },
  {
    title: "At vero eos et accusamus et iusto odio.",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2025-02-01"),
  },
  {
    title: "Similique sunt in culpa qui officia deserunt.",
    description:
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    type: "Question",
    priority: "Low",
    status: "Closed",
    userId: 3, // Asignado a Jane Doe
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2025-02-10"),
  },
  {
    title: "Nam libero tempore, cum soluta nobis est.",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
    type: "Feature",
    priority: "Medium",
    status: "InProgress",
    userId: null, // No asignado
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2025-03-01"),
  },
  {
    title: "Temporibus autem quibusdam et aut officiis.",
    description:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    type: "Bug",
    priority: "High",
    status: "Closed",
    userId: 4, // Asignado a Tandie
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2025-03-10"),
  },
  {
    title: "Itaque earum rerum hic tenetur a sapiente.",
    description:
      "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    type: "Question",
    priority: "Low",
    status: "Open",
    userId: 3, // Asignado a Jane Doe
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2025-04-05"),
  },
  {
    title: "Ut enim ad minima veniam.",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    type: "Feature",
    priority: "Medium",
    status: "Closed",
    userId: null, // No asignado
    clientId: 5, // Cliente Jareb
    createdAt: new Date("2025-04-15"),
  },
  {
    title: "Quis autem vel eum iure reprehenderit.",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    type: "Bug",
    priority: "High",
    status: "InProgress",
    userId: 4, // Asignado a Tandie
    clientId: 2, // Cliente John Doe
    createdAt: new Date("2025-05-01"),
  },
];
