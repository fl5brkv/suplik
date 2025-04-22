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
        details: {group: 'Servis vchodových dverí'},
      },

      {
        name: 'Výmena zámkov a kľučiek',
        details: {group: 'Servis interiérových dverí'},
      },
      {
        name: 'Výmena drevených okien',
        details: {group: 'Servis a výmena okien'},
      },
      {name: 'Doprava materiálu', details: {group: 'Doplnkové služby'}},
      {
        name: 'Nastavenie okenného kovania',
        details: {group: 'Servis a výmena okien'},
      },
      {name: 'Tesnenie okien', details: {group: 'Servis a výmena okien'}},
      {
        name: 'Nastavenie interiérových dverí',
        details: {group: 'Servis interiérových dverí'},
      },
      {
        name: 'Tesnenie proti hluku',
        details: {group: 'Servis interiérových dverí'},
      },
      {
        name: 'Odborné poradenstvo na mieste',
        details: {group: 'Doplnkové služby'},
      },
      {
        name: 'Oprava zámkov a kovania vchodových dverí',
        details: {group: 'Servis vchodových dverí'},
      },
    ];

    const products = [
      {
        name: 'Window',
        quantity: 100,
        reserved: 5,
        details: {group: 'Windows'},
      },
      {
        name: 'Hammer',
        quantity: 50,
        reserved: 2,
        details: {group: 'Tools'},
      },
      {
        name: 'Drill',
        quantity: 30,
        reserved: 10,
        details: {group: 'Doors'},
      },
      {
        name: 'Wrench',
        quantity: 75,
        reserved: 0,
        details: {group: 'Windows'},
      },
      {
        name: 'Saw',
        quantity: 20,
        reserved: 1,
        details: {group: 'Tools'},
      },
    ];

    // @ts-ignore
    await useDrizzle().insert(tables.users).values(users);
    await useDrizzle().insert(tables.products).values(products);
    await useDrizzle().insert(tables.services).values(services);

    return {result: 'success'};
  },
});
