export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task',
  },
  async run() {
    console.log('Running DB seed task...');

    const users = [
      {
        email: 'john@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        email: 'jane@example.com',
        password: 'password123',
        role: 'technician',
      },
    ];

    const services = [
      {
        name: 'Nastavenie drevených vchodových dverí',
        group: 'Servis vchodových dverí',
      },
      {
        name: 'Výmena zámkov a kľučiek',
        group: 'Servis interiérových dverí',
      },
      {
        name: 'Výmena drevených okien',
        group: 'Servis a výmena okien',
      },
      {
        name: 'Doprava materiálu',
        group: 'Doplnkové služby',
      },
      {
        name: 'Nastavenie okenného kovania',
        group: 'Servis a výmena okien',
      },
      {
        name: 'Tesnenie okien',
        group: 'Servis a výmena okien',
      },
      {
        name: 'Nastavenie interiérových dverí',
        group: 'Servis interiérových dverí',
      },
      {
        name: 'Tesnenie proti hluku',
        group: 'Servis interiérových dverí',
      },
      {
        name: 'Odborné poradenstvo na mieste',
        group: 'Doplnkové služby',
      },
      {
        name: 'Oprava zámkov a kovania vchodových dverí',
        group: 'Servis vchodových dverí',
      },
    ];

    const products = [
      {
        name: 'Window',
        quantity: 100,
        reserved: 5,
        group: 'Windows',
      },
      {
        name: 'Hammer',
        quantity: 50,
        reserved: 2,
        group: 'Tools',
      },
      {
        name: 'Drill',
        quantity: 30,
        reserved: 10,
        group: 'Doors',
      },
      {
        name: 'Wrench',
        quantity: 75,
        reserved: 0,
        group: 'Windows',
      },
      {
        name: 'Saw',
        quantity: 20,
        reserved: 1,
        group: 'Tools',
      },
    ];

    // const clients = [
    //   {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john.doe@example.com',
    //     phoneNumber: '0910202457',
    //   },
    //   {
    //     firstName: 'Jane',
    //     lastName: 'Smith',
    //     email: 'jane.smith@example.com',
    //     phoneNumber: '09102024578',
    //   },
    // ];

    // const inquiries = [
    //   {
    //     client: {
    //       firstName: 'Alexis',
    //       lastName: 'Stone',
    //       email: 'beqeqysun@mailinator.com',
    //       phoneNumber: '+1 (648) 409-9031',
    //       company: 'Walter Townsend Traders',
    //       companyNumber: 'Holder Burnett Traders',
    //     },
    //     additionalInfo: 'Iure corporis minus ',
    //     inquiryServices: [{serviceId: 1, quantity: 103, date: '2025-04-28'}],
    //     inquiryProducts: [{productId: 4, quantity: 634, date: '2025-04-28'}],
    //   },
    //   {
    //     client: {
    //       firstName: 'Samson',
    //       lastName: 'Daniel',
    //       email: 'zajudumin@mailinator.com',
    //       phoneNumber: '+1 (369) 456-8762',
    //       company: 'Barlow Terrell Inc',
    //       companyNumber: 'Waters Wagner Inc',
    //     },
    //     additionalInfo: 'Dicta distinctio Lo',
    //     inquiryServices: [
    //       {serviceId: 1, quantity: 103, date: '2025-04-28'},
    //       {serviceId: 1, quantity: 366, date: '2025-04-28'},
    //       {serviceId: 1, quantity: 1, date: '2025-04-28'},
    //     ],
    //     inquiryProducts: [
    //       {productId: 4, quantity: 634, date: '2025-04-28'},
    //       {productId: 5, quantity: 416, date: '2025-04-28'},
    //     ],
    //   },
    // ];

    // @ts-ignore
    await useDrizzle().insert(tables.users).values(users);
    await useDrizzle().insert(tables.products).values(products);
    await useDrizzle().insert(tables.services).values(services);
    // await useDrizzle().insert(tables.clients).values(clients);
    // await useDrizzle().insert(tables.inquiries).values(inquiries);

    return {result: 'success'};
  },
});
