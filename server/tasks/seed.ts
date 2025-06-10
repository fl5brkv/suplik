export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task',
  },
  async run() {
    console.log('Running DB seed task...');

    const users = [
      {
        email: 'adm@adm.sk',
        password:
          '$scrypt$n=16384,r=8,p=1$CLxQA1X18Wj9peLV9LO2VA$eHz5uWSC1p/UvL6aBAVtJ+fUHe0ckTf22N7O5U4Cm7PjCKy6vFR5qNeV1lXVuv8nm095HJneo1AY3nqYfW4xyA',
      },
      {
        email: 'tech2@example.com',
        password: 'hashedpassword2',
      },
      {
        email: 'tech3@example.com',
        password: 'hashedpassword2',
      },
      {
        email: 'tech4@example.com',
        password: 'hashedpassword2',
      },
      {
        email: 'tech@tech.sk',
        password:
          '$scrypt$n=16384,r=8,p=1$CLxQA1X18Wj9peLV9LO2VA$eHz5uWSC1p/UvL6aBAVtJ+fUHe0ckTf22N7O5U4Cm7PjCKy6vFR5qNeV1lXVuv8nm095HJneo1AY3nqYfW4xyA',
      },
    ];

    await useDrizzle().insert(tables.users).values(users);

    const technicians = [
      {
        userId: 2,
        firstName: 'Michael',
        lastName: 'Reynolds',
      },
      {
        userId: 3,
        firstName: 'Peter',
        lastName: 'Doe',
      },
      {
        userId: 4,
        firstName: 'Daniel',
        lastName: 'Parkson',
      },
      {
        userId: 5,
        firstName: 'James',
        lastName: 'Bennett',
      },
    ];

    await useDrizzle().insert(tables.technicians).values(technicians);

    const clients = [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phoneNumber: '555-0101',
        company: 'Johnson Solutions',
        companyNumber: 'CZ12345678',
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@example.com',
        phoneNumber: '555-0202',
        company: null,
        companyNumber: null,
      },
      {
        firstName: 'Clara',
        lastName: 'Nguyen',
        email: 'clara.nguyen@greenbuild.com',
        phoneNumber: '555-0303',
        company: 'GreenBuild s.r.o.',
        companyNumber: 'CZ87654321',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.lee@example.com',
        phoneNumber: '555-0404',
        company: null,
        companyNumber: null,
      },
      {
        firstName: 'Eva',
        lastName: 'Kozáková',
        email: 'eva.kozakova@ekconsulting.cz',
        phoneNumber: '555-0505',
        company: 'EK Consulting',
        companyNumber: 'CZ11223344',
      },
    ];

    await useDrizzle().insert(tables.clients).values(clients);

    const categories = [
      {name: 'Electronics'},
      {name: 'Cleaning Services'},
      {name: 'Furniture'},
      {name: 'Consulting'},
    ];

    await useDrizzle().insert(tables.categories).values(categories);

    const suppliers = [
      {
        name: 'Tech Supplies Inc.',
        email: 'sales@techsupplies.com',
        phoneNumber: '123-456-7890',
      },
      {
        name: 'CleanCo',
        email: 'contact@cleanco.com',
        phoneNumber: '555-555-5555',
      },
      {
        name: 'FurniWorld',
        email: 'hello@furniworld.com',
        phoneNumber: '888-123-4567',
      },
    ];

    await useDrizzle().insert(tables.suppliers).values(suppliers);

    const products = [
      {
        categoryId: 1,
        supplierId: 1,
        name: 'Wireless Mouse',
        stock: 100,
        reserved: 10,
        isPublic: true,
      },
      {
        categoryId: 1,
        supplierId: 1,
        name: 'Laptop',
        stock: 50,
        reserved: 5,
        isPublic: true,
      },
      {
        categoryId: 3,
        supplierId: 3,
        name: 'Office Desk',
        stock: 30,
        reserved: 2,
        isPublic: false,
      },
    ];

    await useDrizzle().insert(tables.products).values(products);

    const services = [
      {
        categoryId: 4,
        name: 'Hardware Consulting',
        isPublic: true,
      },
      {
        categoryId: 2,
        name: 'Office Cleaning',
        isPublic: true,
      },
      {
        categoryId: 4,
        name: 'Software Consulting',
        isPublic: false,
      },
    ];

    await useDrizzle().insert(tables.services).values(services);

    const cases = [
      {
        clientId: 1,
        code: 'K4J8M2QX',
      },
      {
        clientId: 3,
        code: 'RXV81D7B',
      },
      {
        clientId: 5,
        code: 'A9S3QPLZ',
      },
      {
        clientId: 2,
        code: 'M7N2L8KW',
      },
      {
        clientId: 2,
        code: 'X3ND7RVT',
      },
    ];

    await useDrizzle().insert(tables.cases).values(cases);

    const demands = [
      {
        caseId: 1,
        status: 'new' as const,
        additionalInfo: 'Please process ASAP.',
      },
      {
        caseId: 3,
        status: 'quoted' as const,
        additionalInfo: 'Let us know if this fits your needs.',
      },
      {
        caseId: 5,
        status: 'declined' as const,
        additionalInfo: 'Just a new demand additional info.',
      },
      {
        caseId: 2,
        status: 'quoted' as const,
        additionalInfo: 'Still confirming budget.',
      },
    ];

    await useDrizzle().insert(tables.demands).values(demands);

    const demandProducts = [
      {demandId: 1, productId: 1, quantity: 10},
      {demandId: 2, productId: 2, quantity: 2},
      {demandId: 2, productId: 3, quantity: 1},
      {demandId: 4, productId: 1, quantity: 4},
    ];

    await useDrizzle().insert(tables.demandProducts).values(demandProducts);

    const demandServices = [
      {demandId: 1, serviceId: 1, quantity: 10},
      {demandId: 3, serviceId: 2, quantity: 2},
      {demandId: 2, serviceId: 3, quantity: 1},
    ];

    await useDrizzle().insert(tables.demandServices).values(demandServices);

    const quotes = [
      {
        caseId: 2,
        status: 'accepted' as const,
        additionalInfo: 'Sending you quote',
        version: 1,
      },
      {
        caseId: 1,
        status: 'sent' as const,
        additionalInfo: 'Sent for review. Expiry date in 5 days.',
        version: 1,
      },
      {
        caseId: 4,
        status: 'sent' as const,
        additionalInfo: 'This is the 1st version of our quote',
        version: 1,
      },
      {
        caseId: 3,
        status: 'declined' as const,
        additionalInfo: 'I dont like the price.',
        version: 2,
      },
    ];

    await useDrizzle().insert(tables.quotes).values(quotes);

    const quoteProducts = [
      {quoteId: 1, productId: 1, quantity: 10},
      {quoteId: 2, productId: 2, quantity: 2},
      {quoteId: 2, productId: 3, quantity: 1},
      {quoteId: 4, productId: 1, quantity: 4},
    ];

    await useDrizzle().insert(tables.quoteProducts).values(quoteProducts);

    const quoteServices = [
      {quoteId: 1, serviceId: 1, quantity: 10},
      {quoteId: 2, serviceId: 2, quantity: 2},
      {quoteId: 2, serviceId: 3, quantity: 1},
      {quoteId: 4, serviceId: 1, quantity: 4},
    ];

    await useDrizzle().insert(tables.quoteServices).values(quoteServices);

    const offers = [
      {caseId: 1, additionalInfo: 'Install next week'},
      {caseId: 3, additionalInfo: 'This is additional info'},
      {caseId: 4, additionalInfo: 'This is offer from us'},
    ];

    await useDrizzle().insert(tables.offers).values(offers);

    const offerServices = [
      {offerId: 1, serviceId: 1, technicianId: 2, quantity: 10},
      {offerId: 2, serviceId: 2, technicianId: 4, quantity: 2},
      {offerId: 2, serviceId: 3, technicianId: 3, quantity: 1},
      {offerId: 3, serviceId: 2, technicianId: 2, quantity: 1},
    ];

    await useDrizzle().insert(tables.offerServices).values(offerServices);

    const offerProducts = [
      {offerId: 1, offerServiceId: 1, productId: 1, quantity: 10},
      {offerId: 1, offerServiceId: 1, productId: 2, quantity: 2},
      {offerId: 2, offerServiceId: 2, productId: 3, quantity: 1},
    ];

    await useDrizzle().insert(tables.offerProducts).values(offerProducts);

    const jobs = [
      {caseId: 1, additionalInfo: 'Install next week'},
      {caseId: 3, additionalInfo: 'This is additional info'},
    ];

    await useDrizzle().insert(tables.jobs).values(jobs);

    const jobServices = [
      {jobId: 1, serviceId: 1, technicianId: 1, quantity: 10},
      {jobId: 2, serviceId: 2, technicianId: 4, quantity: 2},
      {jobId: 2, serviceId: 3, technicianId: 2, quantity: 1},
    ];

    await useDrizzle().insert(tables.jobServices).values(jobServices);

    const jobProducts = [
      {jobId: 1, jobServiceId: 1, productId: 1, quantity: 10},
      {jobId: 1, jobServiceId: 1, productId: 2, quantity: 2},
    ];

    await useDrizzle().insert(tables.jobProducts).values(jobProducts);

    const orders = [
      {
        productId: 3,
        status: 'sent' as const,
        quantity: 10,
        delivery: '2025-07-08',
      },
      {
        productId: 1,
        status: 'delivered' as const,
        quantity: 2,
        delivery: '2025-08-05',
      },
    ];

    await useDrizzle().insert(tables.orders).values(orders);

    return {result: 'success'};
  },
});
