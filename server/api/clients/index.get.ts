export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle()
    .select({
      id: tables.clients.id,
      firstName: tables.clients.firstName,
      lastName: tables.clients.lastName,
      email: tables.clients.email,
      phoneNumber: tables.clients.phoneNumber,
      company: tables.clients.company,
      companyNumber: tables.clients.companyNumber,
    })
    .from(tables.clients);

  return selected;
});
