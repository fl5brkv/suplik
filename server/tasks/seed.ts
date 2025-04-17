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
        role: 'admin'
      },
      {
        email: 'jane@example.com',
        password: 'password123',
        role: 'technician'
      },
    ];
    
    // @ts-ignore
    await useDrizzle().insert(tables.users).values(users);
    return {result: 'success'};
  },
});
