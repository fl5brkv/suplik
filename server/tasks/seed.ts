export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task',
  },
  async run() {
    console.log('Running DB seed task...');

    const categories = [
      {name: 'Electronics', type: 'product' as const},
      {name: 'Cleaning Services', type: 'service' as const},
      {name: 'Furniture', type: 'product' as const},
      {name: 'Consulting', type: 'service' as const},
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

    const items = [
      {
        categoryId: 1,
        type: 'product' as const,
        name: 'Wireless Mouse',
        unitPrice: '25.99',
        category: 'Electronics',
      },
      {
        categoryId: 1,
        type: 'product' as const,
        name: 'Laptop',
        unitPrice: '999.99',
        category: 'Electronics',
      },
      {
        categoryId: 2,
        type: 'service' as const,
        name: 'Office Cleaning',
        unitPrice: '150.00',
        category: 'Cleaning Services',
      },
      {
        categoryId: 3,
        type: 'product' as const,
        name: 'Office Desk',
        unitPrice: '299.50',
        category: 'Furniture',
      },
      {
        categoryId: 4,
        type: 'service' as const,
        name: 'IT Consulting',
        unitPrice: '100.00',
        category: 'Consulting',
      },
    ];

    await useDrizzle().insert(tables.items).values(items);

    const productDetails = [
      {
        itemId: 1,
        supplierId: 1,
        stock: 100,
        reserved: 10,
        purchasePrice: '15.00',
      },
      {
        itemId: 2,
        supplierId: 1,
        stock: 50,
        reserved: 5,
        purchasePrice: '700.00',
      },
      {
        itemId: 4,
        supplierId: 3,
        stock: 30,
        reserved: 2,
        purchasePrice: '200.00',
      },
    ];

    await useDrizzle().insert(tables.productDetails).values(productDetails);

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

    await useDrizzle().insert(tables.demands).values(demands);

    const demandItems = [
      {demandId: 1, itemId: 1, quantity: 10},

      {demandId: 2, itemId: 4, quantity: 2},
      {demandId: 2, itemId: 3, quantity: 1},

      {demandId: 3, itemId: 5, quantity: 3},

      {demandId: 4, itemId: 2, quantity: 1},
    ];

    await useDrizzle().insert(tables.demandItems).values(demandItems);

    const quotations = [
      {
        demandId: 2,
        status: 'sent' as const,
        expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
        additionalInfo: 'Sent for review. Expiry date in 5 days.',
        version: 1,
      },
      {
        demandId: 4,
        status: 'declined' as const,
        expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
        additionalInfo: 'I dont like the price.',
        version: 1,
      },
    ];

    await useDrizzle().insert(tables.quotations).values(quotations);

    const quotationItems = [
      {quotationId: 1, itemId: 1, quantity: 10, unitPrice: '25.99'},

      {quotationId: 2, itemId: 4, quantity: 2, unitPrice: '299.50'},
      {quotationId: 2, itemId: 3, quantity: 1, unitPrice: '150.00'},

      {quotationId: 3, itemId: 5, quantity: 3, unitPrice: '100.00'},

      {quotationId: 4, itemId: 2, quantity: 1, unitPrice: '999.99'},
      {quotationId: 4, itemId: 1, quantity: 2, unitPrice: '25.99'},
    ];

    await useDrizzle().insert(tables.quotationItems).values(quotationItems);

    return {result: 'success'};
  },
});
