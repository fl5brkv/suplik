export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle()
    .select({
      clientId: tables.clients.clientId,
      firstName: tables.clients.firstName,
      lastName: tables.clients.lastName,
      phoneNumber: tables.clients.phoneNumber,
      company: tables.clients.company,
      companyNumber: tables.clients.companyNumber,
    })
    .from(tables.clients);

  return selected;
});
