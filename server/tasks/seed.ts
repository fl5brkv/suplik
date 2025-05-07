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
        role: 'admin' as const,
      },
      {
        email: 'jane@example.com',
        password: 'password123',
        role: 'technician' as const,
      },
    ];

    const clients = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '0910202457',
        company: 'Acme Inc.',
        companyNumber: '12345678',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '09102024578',
        company: 'Smith & Co.',
        companyNumber: '87654321',
      },
    ];

    const suppliers = [
      {
        name: 'Alpha Supplies',
        email: 'contact@alphasupplies.com',
        phoneNumber: '0900123456',
      },
      {
        name: 'Beta Tools',
        email: 'sales@betatools.com',
        phoneNumber: '0900789123',
      },
    ];

    const services = [
      {
        name: 'Nastavenie drevených vchodových dverí',
        group: 'Servis vchodových dverí',
        type: 'service' as const,
        unitPrice: '150.00',
      },
      {
        name: 'Výmena zámkov a kľučiek',
        group: 'Servis interiérových dverí',
        type: 'service' as const,
        unitPrice: '100.00',
      },
    ];

    const products = [
      {
        name: 'Hammer',
        group: 'Tools',
        type: 'product' as const,
        unitPrice: '10.00',
      },
      {
        name: 'Drill',
        group: 'Doors',
        type: 'product' as const,
        unitPrice: '75.00',
      },
    ];

    const itemProductDetails = [
      {
        itemId: 1,
        supplierId: 1,
        quantity: 100,
        reserved: 10,
      },
      {
        itemId: 2,
        supplierId: 2,
        quantity: 50,
        reserved: 5,
      },
    ];

    const orders = [
      {
        clientId: 1,
        type: 'inquiry' as const,
        status: 'new' as const,
        internalNote: 'Urgent request',
        externalNote: 'Client needs fast processing',
      },
      {
        clientId: 2,
        type: 'inquiry' as const,
        status: 'new' as const,
        externalNote: 'I need it ASAP',
      },
      {
        clientId: 2,
        type: 'quotation' as const,
        status: 'sent' as const,
        internalNote: 'Awaiting client approval',
        externalNote: 'Quote sent on Monday',
      },
    ];

    const orderItems = [
      {
        orderId: 1,
        itemId: 1,
        quantity: 10,
      },
      {
        orderId: 1,
        itemId: 2,
        quantity: 5,
      },
      {
        orderId: 2,
        itemId: 2,
        quantity: 1,
      },
    ];

    await useDrizzle().insert(tables.users).values(users);
    await useDrizzle().insert(tables.clients).values(clients);
    await useDrizzle().insert(tables.suppliers).values(suppliers);
    await useDrizzle()
      .insert(tables.items)
      .values([...services, ...products]);
    await useDrizzle()
      .insert(tables.itemProductDetails)
      .values(itemProductDetails);
    await useDrizzle().insert(tables.orders).values(orders);
    await useDrizzle().insert(tables.orderItems).values(orderItems);

    return {result: 'success'};
  },
});
