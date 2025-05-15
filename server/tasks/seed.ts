export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task',
  },
  async run() {
    console.log('Running DB seed task...');

    const users = [
      {
        email: 'admin@example.com',
        password: 'hashedpassword1',
        role: 'admin' as const,
      },
      {
        email: 'tech@example.com',
        password: 'hashedpassword2',
        role: 'technician' as const,
      },
    ];

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

    const categories = [
      {name: 'Electronics', type: 'product' as const},
      {name: 'Cleaning Services', type: 'service' as const},
      {name: 'Furniture', type: 'product' as const},
      {name: 'Consulting', type: 'service' as const},
    ];

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

    const items = [
      {
        categoryId: 1,
        type: 'product' as const,
        name: 'Wireless Mouse',
        // unitPrice: '25.99',
        category: 'Electronics',
        isPublic: true,
      },
      {
        categoryId: 1,
        type: 'product' as const,
        name: 'Laptop',
        // unitPrice: '999.99',
        category: 'Electronics',
        isPublic: true,
      },
      {
        categoryId: 2,
        type: 'service' as const,
        name: 'Office Cleaning',
        // unitPrice: '150.00',
        category: 'Cleaning Services',
        isPublic: false,
      },
      {
        categoryId: 3,
        type: 'product' as const,
        name: 'Office Desk',
        // unitPrice: '299.50',
        category: 'Furniture',
        isPublic: false,
      },
      {
        categoryId: 4,
        type: 'service' as const,
        name: 'IT Consulting',
        // unitPrice: '100.00',
        category: 'Consulting',
        isPublic: true,
      },
    ];

    const productDetails = [
      {
        itemId: 1,
        supplierId: 1,
        stock: 100,
        reserved: 10,
        // purchasePrice: '15.00',
      },
      {
        itemId: 2,
        supplierId: 1,
        stock: 50,
        reserved: 5,
        // purchasePrice: '700.00',
      },
      {
        itemId: 4,
        supplierId: 3,
        stock: 30,
        reserved: 2,
        // purchasePrice: '200.00',
      },
    ];

    const demands = [
      {
        clientId: 1,
        status: 'new' as const,
        additionalInfo: 'Please process ASAP.',
      },
      {
        clientId: 3,
        status: 'quoted' as const,
        additionalInfo: 'Let us know if this fits your needs.',
      },
      {
        clientId: 5,
        status: 'declined' as const,
        additionalInfo: 'Just a new inquiry additional info.',
      },
      {
        clientId: 2,
        status: 'quoted' as const,
        additionalInfo: 'Still confirming budget.',
      },
    ];

    const demandItems = [
      {demandId: 1, itemId: 1, quantity: 10},

      {demandId: 2, itemId: 4, quantity: 2},

      {demandId: 2, itemId: 3, quantity: 1},

      {demandId: 3, itemId: 5, quantity: 3},

      {demandId: 4, itemId: 2, quantity: 1},
    ];

    const quotes = [
      {
        demandId: 1,
        status: 'accepted' as const,
        additionalInfo: 'Sending you quote',
        version: 1,
      },
      {
        demandId: 2,
        status: 'sent' as const,
        additionalInfo: 'Sent for review. Expiry date in 5 days.',
        version: 1,
      },
      {
        demandId: 4,
        status: 'sent' as const,
        additionalInfo: 'This is the 1st version of our quote',
        version: 1,
      },
      {
        demandId: 4,
        status: 'declined' as const,
        additionalInfo: 'I dont like the price.',
        version: 2,
      },
      {
        demandId: 4,
        status: 'sent' as const,
        additionalInfo: 'This is the new price for your quote.',
        version: 3,
      },
    ];

    const quoteItems = [
      {
        quoteId: 1,
        itemId: 4,
        quantity: 2,
        // unitPrice: '299.50'
      },
      {
        quoteId: 1,
        itemId: 3,
        quantity: 1,
        //  unitPrice: '150.00'
      },

      {
        quoteId: 2,
        itemId: 2,
        quantity: 1,
        //unitPrice: '999.99'
      },
      {
        quoteId: 2,
        itemId: 1,
        quantity: 2,
        // unitPrice: '25.99'
      },
    ];

    const jobs = [
      {demandId: 1, additionalInfo: 'Install next week'},
      {demandId: 2, additionalInfo: 'This is additional info'},
    ];

    const jobItems = [
      {jobId: 1, itemId: 1, quantity: 2, status: 'pending' as const},
      {jobId: 1, itemId: 2, quantity: 1, status: 'in_progress' as const},
      {jobId: 2, itemId: 3, quantity: 1, status: 'blocked' as const},
    ];

    const orders = [
      {
        itemId: 3,
        status: 'ordered' as const,
        quantity: 10,
        expectedDelivery: '2025-07-08',
      },
    ];

    const jobItemsToOrders = [{jobItemId: 3, orderId: 1}];

    await useDrizzle().insert(tables.users).values(users);
    await useDrizzle().insert(tables.clients).values(clients);
    await useDrizzle().insert(tables.categories).values(categories);
    await useDrizzle().insert(tables.suppliers).values(suppliers);
    await useDrizzle().insert(tables.items).values(items);
    await useDrizzle().insert(tables.productDetails).values(productDetails);
    await useDrizzle().insert(tables.demands).values(demands);
    await useDrizzle().insert(tables.demandItems).values(demandItems);
    await useDrizzle().insert(tables.quotes).values(quotes);
    await useDrizzle().insert(tables.quoteItems).values(quoteItems);
    await useDrizzle().insert(tables.jobs).values(jobs);
    await useDrizzle().insert(tables.jobItems).values(jobItems);
    await useDrizzle().insert(tables.orders).values(orders);
    await useDrizzle().insert(tables.jobItemsToOrders).values(jobItemsToOrders);

    return {result: 'success'};
  },
});
