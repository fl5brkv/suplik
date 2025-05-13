export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle()
    .select({
      id: tables.suppliers.id,
      name: tables.suppliers.name,
      email: tables.suppliers.email,
      phoneNumber: tables.suppliers.phoneNumber,
    })
    .from(tables.suppliers);

  return selected;
});
